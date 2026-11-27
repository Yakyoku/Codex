// ステージ7「脳」— 区域A：血液脳関門／区域B：神経細胞の森／区域C：アミロイドβのかたまり → 病巣の核（単位 µm、知覚加速 ×100）
// 事実（Docs/REFERENCE/brain.md、実物の写真 img/brain/）：大脳皮質の錐体細胞は涙形の細胞体（約20µm）から、上へ太い尖端樹状突起を伸ばし、
//   となりの細胞の幹と同じ向きにそろって林立する（写真⑪）。樹状突起の表面には、首の細いきのこ形のとげ（頭 約0.3〜1.2µm）が並ぶ（写真⑮）。
//   脳の毛細血管は太さ 約6µm で赤血球より細く、外側をアストロサイトの終足と周皮細胞が覆う（写真⑱⑳㉑）。髄鞘のある軸索では、
//   信号が絞輪から絞輪へ跳ぶように伝わる。ふだんのミクログリアは細い枝を伸ばしてまわりを見張り（マウスで 約0.36µm/分。×100 で見える速さ）、
//   沈着物のそばでは枝を引っこめて丸くなり、群がる（写真㉒〜㉔）。アミロイドβのかたまりは、細い線維の粒がぼやけた輪のように集まり、
//   中にふくれた神経突起を含む（写真①）。アミロイドβが病気の原因かどうかは、まだ議論が続いている（断定しない）。
// 作り事：本物の脳の中は、細胞の突起がすき間なく詰まり、潜行士が歩ける空間はない。潜行士は、組織の表面に作った通り道を進む。
//   かたまりを光で溶かすのも演出。信号の速さは、見えるよう実物よりずっとゆっくり描く。
import * as THREE from 'three/webgpu';
import { organic } from '../../core/realism';
import { tsl, type N } from '../../core/tsl';
import { loadGLB, makeEnvironment } from '../../core/assets';
import { HealthField } from '../../core/health';
import type { ZoneStage, ZoneMeta, Plug } from '../zone';
import { keyLightDirView } from '../../materials/cell';
import tuning from '../../data/tuning.json';

const { uniform, texture, positionWorld, positionLocal, vec2, float, color, mix, exp, length, smoothstep, sin, pow, saturate, dot, normalView, positionViewDirection, instancedDynamicBufferAttribute, abs, fract } = tsl;
const PULSE_T = 4;   // 発火の波（見えるよう、ゆっくり）
const common = { perception: 100, patient: 'conscious' as const };
export const BBB_META: ZoneMeta = { ...common, id: 'bbb', hud: '脳・毛細血管　関門の回復', plugName: '関門のすき間', swimCeil: 22, scaleNote: '潜行士の身長 2µm ／ 脳の毛細血管の太さ 約6µm',
  enter: 'こちらオペレーター。最後の器官、脳に入ります。灯先生の意識は、まだ戻っていません。大脳の表面の、毛細血管のそばに降ります。',
  arrive: 'こちらオペレーター。大脳の灰白質です。足もとの管は脳の毛細血管で、赤血球より細いので、赤血球は形を変えながら通ります。管を覆う平たい板は、アストロサイトの終足。血の中のものを脳へ入れすぎない関門を支えています。ところどころ、すき間から漏れています。光を当てて、関門をふさいでください。',
  plugHit: '関門のすき間です。光を当て続けると、終足が管を覆い直し、漏れが止まります。',
  plugCleared: (l) => (l ? `関門のすき間が一つふさがりました。残りは ${l} か所です。` : 'すべてのすき間がふさがりました。脳のまわりが、静かで澄んだ状態に戻ります。'),
  done: '血液脳関門が戻りました。神経細胞のまわりが、落ち着いた状態になります。', doneTitle: '関門が戻りました', causeMain: '血液脳関門のすき間（漏れ）',
  plugDiag: { short: '関門のすき間', cause: '終足が管から離れ、血の中のものが漏れています。光を当て続けて、ふさいでください' } };
export const CORTEX_META: ZoneMeta = { ...common, id: 'cortex', hud: '脳・皮質　回路の回復', plugName: '切れた回路', swimCeil: 30, scaleNote: '潜行士の身長 2µm ／ 神経細胞の体 約20µm ／ とげ 約1µm',
  arrive: 'こちらオペレーター。神経細胞の森です。上へまっすぐ伸びる幹は、錐体細胞の樹状突起。表面の小さなきのこの形は、ほかの細胞から信号を受け取るとげです。とげが消え、信号が届かなくなった細胞があります。光を当てて、回路をつないでください。',
  plugHit: '回路が切れた細胞です。光を当て続けると、とげが戻り、信号が届くようになります。',
  plugCleared: (l) => (l ? `回路が一つつながりました。残りは ${l} か所です。` : 'すべての回路がつながりました。信号の光が、森じゅうを行き交います。'),
  done: '神経細胞の回路がつながりました。森じゅうで、信号の光が行き交います。', doneTitle: '回路がつながりました', causeMain: 'とげの消えた、切れた回路',
  plugDiag: { short: '切れた回路（とげの消えた細胞）', cause: 'とげが消え、ほかの細胞からの信号を受け取れません。光を当て続けて、回路をつないでください' } };
export const PLAQUE_B_META: ZoneMeta = { ...common, id: 'amyloid', hud: '脳・皮質　沈着物の除去', plugName: 'アミロイドβのかたまり', swimCeil: 30, scaleNote: '潜行士の身長 2µm ／ かたまり 数µm〜約200µm',
  arrive: 'こちらオペレーター。沈着物のある所です。粒の集まったぼやけた輪が、アミロイドβのかたまり。中に、ふくれた神経の突起が見えます。まわりで丸くなって群がっているのは、ミクログリアです。光を当てて、かたまりを溶かしてください。',
  plugHit: 'アミロイドβのかたまりです。手当てを始めると、乱れた信号の波が来ます。まわりを守りながら、光を当て続けてください（本物のかたまりを溶かす方法として描いているのではありません）。',
  plugCleared: (l) => (l ? `かたまりが一つ溶けました。ミクログリアが枝を伸ばし、見張りに戻ります。残りは ${l} か所です。` : 'すべてのかたまりが溶けました。信号が、脳じゅうへ届きはじめます。'),
  done: '沈着物が消え、脳じゅうに信号が戻りました。……灯先生の脳波が、変わりはじめます。', doneTitle: '意識が戻ります', causeMain: 'アミロイドβのかたまりと、まわりの炎症',
  plugDiag: { short: 'アミロイドβのかたまり', cause: '細い線維の粒が集まり、まわりの神経の突起がふくれています。光を当て続けて溶かしてください（手当てを始めると、乱れた信号の波が来ます）' } };

async function build(renderer: THREE.WebGPURenderer, tier: string, variant: 'A' | 'B' | 'C', opts: { entrance?: boolean } = {}): Promise<ZoneStage> {
  const M = variant === 'A' ? BBB_META : variant === 'B' ? CORTEX_META : PLAQUE_B_META;
  const W = 140, D = 90, rich = tier === 'pc-high', vr = tier === 'vr';
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png'); noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.colorSpace = THREE.NoColorSpace;
  const [bg, rg] = await Promise.all([loadGLB('/static/models/brain.glb'), loadGLB('/static/models/rbc.glb')]);
  const geos: Record<string, THREE.BufferGeometry> = {};
  for (const g of [bg, rg]) g.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.updateWorldMatrix(true, false); geos[m.name] = m.geometry.clone().applyMatrix4(m.matrixWorld); } });
  const scene = new THREE.Scene();
  // 脳の中：脳脊髄液と組織の、淡く冷たい霧（電子音と弦の主題に合わせ、ほかの器官より青みを帯びる）
  const fogC = new THREE.Color(0.34, 0.3, 0.36);
  scene.background = fogC.clone().multiplyScalar(0.5); scene.fog = new THREE.FogExp2(fogC.getHex(), 0.011);
  scene.environment = makeEnvironment(renderer, new THREE.Color(0.75, 0.6, 0.7)); scene.environmentIntensity = 0.45;
  const hc = tuning.health;
  const health = new HealthField(hc.gridW, Math.round(hc.gridW * D / W), W, D, 0.2);
  const hBytes = new Uint8Array(health.w * health.h);
  const hTex = new THREE.DataTexture(health.toBytes(hBytes), health.w, health.h, THREE.RedFormat, THREE.UnsignedByteType);
  hTex.magFilter = hTex.minFilter = THREE.LinearFilter; hTex.needsUpdate = true; let hVersion = -1;
  const u = { time: uniform(0), scan: uniform(0), lightIn: uniform(0.4), heartPhase: uniform(0), beamPos: uniform(new THREE.Vector3(0, -999, 0)), beamOn: uniform(0), scanR: uniform(0), scanOrigin: uniform(new THREE.Vector3()), scanPulse: uniform(0) };
  const H: N = texture(hTex, vec2(positionWorld.x.div(W).add(0.5).clamp(0, 1), positionWorld.z.div(D).add(0.5).clamp(0, 1))).r;
  const sick = float(1).sub(H);
  const core = new THREE.Vector3(0, 0, 0);
  const waveR = uniform(0), waveOn = uniform(0), bootR = uniform(-1);
  const dC = length(positionWorld.xz.sub(vec2(core.x, core.z)));
  const waveRing = exp(dC.sub(waveR).div(3).pow(2).negate()).mul(waveOn);
  const bootRing = exp(dC.sub(bootR).div(6).pow(2).negate()).mul(smoothstep(-1, 0, bootR));
  const fres = pow(float(1).sub(saturate(dot(normalView, positionViewDirection).abs())), float(2.5));
  const scanCol = mix(color(0xffa040), color(0x5fe8d0), H);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3(), eu = new THREE.Euler();
  let sd = 31; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const attr = (n: number, fill = 1) => { const a = new THREE.InstancedBufferAttribute(new Float32Array(n).fill(fill), 1); a.setUsage(THREE.DynamicDrawUsage); return a; };
  const instanced = (geo: THREE.BufferGeometry, mat: THREE.Material, n: number) => { const im = new THREE.InstancedMesh(geo, mat, n); im.frustumCulled = false; scene.add(im); return im; };

  // ---- 塊（区域ごと）----
  const plugPos: [number, number][] = variant === 'A' ? [[-34, -25], [10, 15], [42, -25]] : variant === 'B' ? [[-30, 18], [8, -20], [40, 12]] : [[-26, -14], [16, 18], [34, -18]];
  const plugs: (Plug & { gone: number; shake: number })[] = plugPos.map(([x, z]) => ({ p: new THREE.Vector3(x, 0, z), hp: 1, cleared: false, gone: 0, shake: 0 }));

  // ---- 床：神経の突起がすき間なく詰まった、ステンドグラスのような組織の面（電顕の写真②）。生きた灰白質は淡い桃色がかった灰色 ----
  const floorAt = (x: number, z: number) => variant === 'C' ? plugs.reduce((h, pl) => Math.max(h, 3.5 * (1 - pl.gone) * Math.exp(-((x - pl.p.x) ** 2 + (z - pl.p.z) ** 2) / 260)), 0) : 0;
  const fm = new THREE.MeshPhysicalNodeMaterial();
  const cells = texture(noiseTex, positionWorld.xz.mul(1 / 3.2)).r, cells2 = texture(noiseTex, positionWorld.xz.mul(1 / 9).add(0.3)).r;
  const border = smoothstep(0.6, 0.95, cells).mul(0.55).add(smoothstep(0.65, 0.95, cells2).mul(0.35));
  fm.colorNode = mix(color(0x8c7c80), color(0xc4a4a2), H).mul(mix(float(1), float(0.8), border)).mul(texture(noiseTex, positionWorld.xz.mul(1 / 1.3)).g.mul(0.08).add(0.95));
  fm.roughnessNode = mix(float(0.55), float(0.3), H); fm.clearcoatNode = H.mul(0.45); fm.clearcoatRoughnessNode = float(0.2);
  fm.emissiveNode = color(0x7a5aa0).mul(sick.mul(0.08)).add(color(0xa080ff).mul(waveRing.mul(0.45))).add(color(0xfff0e0).mul(bootRing.mul(0.6))).add(scanCol.mul(u.scan.mul(0.12))).add(color(0xe0d0ff).mul(fres.mul(0.05)));
  organic(fm, noiseTex, { scale: 1.8, bump: 0.7, sss: 0xffb0c0, sssAmt: 0.2 });
  const fg = new THREE.PlaneGeometry(W * 1.3, D * 1.3, 130, 84); fg.rotateX(-Math.PI / 2);
  const floor0 = new THREE.Mesh(fg, fm); scene.add(floor0);
  const reshape = () => { if (variant !== 'C') return; const pa = fg.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pa.count; i++) pa.setY(i, floorAt(pa.getX(i), pa.getZ(i))); pa.needsUpdate = true; fg.computeVertexNormals(); };
  reshape();
  const pulse = (ph: N) => fract(u.time.div(PULSE_T).add(ph));   // 0〜1 の発火の位相

  // ---- 区域A：毛細血管・終足・周皮細胞・アストロサイト ----
  const capZ = [-25, 15, 38]; const FS = vr ? 5.1 : 3.4;   // 終足の間隔（VR は大きめの板を少なく）
  const capPathZ = (k: number, x: number) => capZ[k] + 1.5 * Math.sin(x / 17) * (k === 1 ? -1 : 1);
  type Foot = { x: number; k: number; rot: number; plug: number };
  const feet: Foot[] = [];
  let footM: THREE.InstancedMesh | null = null, capM: THREE.InstancedMesh | null = null, leakM: THREE.InstancedMesh | null = null, capR: THREE.InstancedMesh | null = null;
  const capRBC: { x: number; k: number; s: number }[] = [];
  if (variant === 'A') {
    const cm = new THREE.MeshPhysicalNodeMaterial({ transparent: true });   // 管の壁（内皮）：薄く、中の赤血球が透ける
    cm.colorNode = mix(color(0xb07a80), color(0xd8a8a8), H); cm.roughnessNode = float(0.3); cm.opacityNode = float(0.55).add(fres.mul(0.4)); cm.clearcoatNode = float(0.6);
    capM = instanced(geos.capillary, cm, capZ.length);
    capZ.forEach((z, k) => capM!.setMatrixAt(k, m4.compose(v.set(0, 2.6, z), q.setFromEuler(eu.set(0, k === 1 ? Math.PI : 0, 0)), sv.set(1, 1, 1))));
    // 終足：管の向きに 約3.5µm おき、管をぐるりと3枚で覆う。すき間（塊）のそばは欠ける
    for (let k = 0; k < capZ.length; k++) for (let x = -W * 0.62; x < W * 0.62; x += FS) for (const rot of [0, 2.1, 4.2]) {
      let plug = -1; plugs.forEach((pl, i) => { if (Math.abs(pl.p.z - capZ[k]) < 4 && Math.abs(pl.p.x - x) < 9) plug = i; }); feet.push({ x, k, rot: rot + (x * 0.37) % 0.6, plug });
    }
    const em = new THREE.MeshPhysicalNodeMaterial(); em.colorNode = mix(color(0xa89098), color(0xe0ccd0), H).mul(texture(noiseTex, positionWorld.xz.mul(1 / 2)).g.mul(0.12).add(0.9)); em.roughnessNode = float(0.4); em.clearcoatNode = float(0.4);
    organic(em, noiseTex, { scale: 1.2, bump: 0.5, planar: 'tri', sss: 0xffc8d0, sssAmt: 0.3 });
    footM = instanced(geos.endfoot, em, feet.length);
    // 管の中の赤血球：管より太いので、細長く形を変えて通る
    const rm = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide }); rm.colorNode = color(0xa8182a); rm.roughnessNode = float(0.45);
    for (let k = 0; k < capZ.length; k++) for (let i = 0; i < 9; i++) capRBC.push({ x: -W * 0.6 + i * 16 + k * 5, k, s: 0.9 + rnd() * 0.2 });
    capR = instanced(rich ? geos.rbc_lod0 ?? geos.rbc_lod1 : geos.rbc_lod1 ?? geos.rbc_lod0, rm, capRBC.length);
    // 漏れ出す血の中のもの（たんぱく質など）の、淡い黄色のにじみ
    const lm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    lm.colorNode = color(0xd8b060).mul(pow(saturate(dot(normalView, positionViewDirection)), float(2)).mul(0.25));
    leakM = instanced(new THREE.IcosahedronGeometry(1, 2), lm, plugs.length * 6);
    // 周皮細胞とアストロサイト
    const pm = new THREE.MeshPhysicalNodeMaterial(); pm.colorNode = color(0xc8a8a8); pm.roughnessNode = float(0.4); pm.clearcoatNode = float(0.4);
    const pc = instanced(geos.pericyte, pm, 6);
    for (let i = 0; i < 6; i++) { const k = i % 3, x = -50 + i * 19; pc.setMatrixAt(i, m4.compose(v.set(x, 2.6, capPathZ(k, x)), q.setFromEuler(eu.set(i % 2 ? 0.6 : -0.5, 0, 0)), sv.set(1, 1, 1))); }
    const am = new THREE.MeshPhysicalNodeMaterial(); am.colorNode = mix(color(0xb8a0a8), color(0xe4d4d8), H); am.roughnessNode = float(0.35); am.clearcoatNode = float(0.4);
    const ast = instanced(geos.astrocyte, am, 5);
    [[-42, 26], [-12, -6], [24, 30], [55, 2], [-30, -38]].forEach(([x, z], i) => ast.setMatrixAt(i, m4.compose(v.set(x, 4, z), q.setFromEuler(eu.set(i, i * 1.3, 0)), sv.set(0.9, 0.9, 0.9))));
  }

  // ---- 区域B・C：錐体細胞の森（尖端の幹が同じ向きにそろって林立する）と、とげ ----
  type Neu = { x: number; z: number; rot: number; plug: number; tangle: boolean };
  const neus: Neu[] = [];
  if (variant !== 'A') {
    const step = variant === 'B' ? (rich ? 30 : vr ? 44 : 37) : 38;   // 軽い段階では、細胞の間隔を少し広げる
    for (let x = -W * 0.55; x < W * 0.6; x += step) for (let z = -D * 0.5; z < D * 0.55; z += step * 0.85) {
      const nx = x + (rnd() - 0.5) * step * 0.5, nz = z + (rnd() - 0.5) * step * 0.5;
      let plug = -1; plugs.forEach((pl, i) => { if (Math.hypot(pl.p.x - nx, pl.p.z - nz) < step * 0.6) plug = i; });
      if (variant === 'C' && plug >= 0) continue;   // かたまりの場所には細胞を置かない
      if (Math.hypot(nx + W / 2 - 10, nz) < 20) continue;   // スタート地点のまわりはあける
      neus.push({ x: nx, z: nz, rot: rnd() * 6.28, plug, tangle: variant === 'C' && rnd() < 0.35 });
    }
    if (variant === 'B') plugs.forEach((pl, i) => { if (!neus.some((n) => n.plug === i)) neus.push({ x: pl.p.x, z: pl.p.z, rot: rnd() * 6.28, plug: i, tangle: false }); else { const n = neus.find((n2) => n2.plug === i)!; n.x = pl.p.x; n.z = pl.p.z; } });
  }
  const healthyN = neus.filter((n) => !n.tangle);
  let neuM: THREE.InstancedMesh | null = null, neuAlive: THREE.InstancedBufferAttribute | null = null, neuPh: THREE.InstancedBufferAttribute | null = null;
  if (healthyN.length) {
    neuAlive = attr(healthyN.length, 1); neuPh = attr(healthyN.length, 0);
    healthyN.forEach((n, i) => { neuAlive!.setX(i, n.plug >= 0 ? 0 : 1); neuPh!.setX(i, rnd()); });
    const geo = geos.pyramid.clone(); geo.setAttribute('alive', neuAlive); geo.setAttribute('ph', neuPh);
    const alive: N = instancedDynamicBufferAttribute(neuAlive), ph: N = instancedDynamicBufferAttribute(neuPh);
    const nm = new THREE.MeshPhysicalNodeMaterial();
    // 生きた神経細胞は、淡い桃色がかった灰白色の半透明の膜（色は推定。電顕・蛍光の色は使わない）。切れた細胞はくすむ
    nm.colorNode = mix(color(0x8a8088), color(0xd8c8cc), alive.mul(0.7).add(0.3)).mul(texture(noiseTex, positionWorld.xz.add(positionWorld.yy).mul(1 / 3)).g.mul(0.1).add(0.92));
    nm.roughnessNode = float(0.35); nm.clearcoatNode = float(0.5); nm.clearcoatRoughnessNode = float(0.2);
    // 信号：細胞体から幹を上へ、光の粒が走る（見えるよう、ゆっくり）。切れた細胞では走らない
    const sig = exp(positionLocal.y.sub(pulse(ph).mul(150).sub(10)).div(4).pow(2).negate()).mul(alive);
    nm.emissiveNode = color(0x9a8cff).mul(sig.mul(1.4)).add(color(0xd0c8ff).mul(fres.mul(0.12))).add(color(0xfff0e0).mul(bootRing.mul(0.5))).add(scanCol.mul(u.scan.mul(0.1)));
    organic(nm, noiseTex, { scale: 1.0, bump: 0.35, planar: 'tri', sss: 0xffd0e0, sssAmt: 0.35 });
    neuM = instanced(geo, nm, healthyN.length);
    healthyN.forEach((n, i) => neuM!.setMatrixAt(i, m4.compose(v.set(n.x, 7, n.z), q.setFromEuler(eu.set(0, n.rot, 0)), sv.set(1, 1, 1))));
  }
  // とげ：幹の下の方（潜行士の目の高さ）にびっしり。切れた細胞では消えていて、治ると生えてくる
  type Sp = { n: number; y: number; a: number; tilt: number };
  const spines: Sp[] = [];
  healthyN.forEach((n, ni) => { const cnt = vr ? 22 : rich ? 90 : 40; for (let k = 0; k < cnt; k++) spines.push({ n: ni, y: 16 + k * (26 / cnt) + rnd() * 0.3, a: rnd() * 6.28, tilt: 0.3 + rnd() * 0.5 }); });
  let spM: THREE.InstancedMesh | null = null;
  if (spines.length) {
    const smat = new THREE.MeshPhysicalNodeMaterial(); smat.colorNode = color(0xe0d0d4); smat.roughnessNode = float(0.35); smat.clearcoatNode = float(0.5);
    smat.emissiveNode = color(0xb0a8ff).mul(fres.mul(0.15));
    spM = instanced(geos.spine, smat, spines.length);
  }
  const spGrow = healthyN.map((n) => (n.plug >= 0 ? 0 : 1));
  // 区域C：もつれを持つ細胞（半透明の体の中に、炎の形の線維の束）
  const tangN = neus.filter((n) => n.tangle);
  if (tangN.length) {
    const gm = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false }); gm.colorNode = color(0xc8b8c0); gm.opacityNode = float(0.35).add(fres.mul(0.4)); gm.roughnessNode = float(0.3);
    const tm = new THREE.MeshPhysicalNodeMaterial(); tm.colorNode = color(0x3a2a34); tm.roughnessNode = float(0.6);
    const gh = instanced(geos.soma_ghost, gm, tangN.length), tg = instanced(geos.tangle, tm, tangN.length); gh.renderOrder = 6;
    tangN.forEach((n, i) => { v.set(n.x, 7, n.z); q.setFromEuler(eu.set(0, n.rot, 0)); gh.setMatrixAt(i, m4.compose(v, q, sv.set(1, 1, 1))); tg.setMatrixAt(i, m4.compose(v, q, sv.set(0.9, 0.9, 0.9))); });
  }
  // 髄鞘のある軸索（B）：床を横切る白い筒。信号は絞輪から絞輪へ跳ぶように光る
  if (variant === 'B') {
    const NA = 5, phA = attr(NA * 2, 0); const my = new THREE.MeshPhysicalNodeMaterial(); const geo = geos.myelin.clone(); geo.setAttribute('ph', phA);
    my.colorNode = color(0xece4e0); my.roughnessNode = float(0.3); my.clearcoatNode = float(0.6);
    const node = smoothstep(39.5, 41.2, abs(positionLocal.x));   // 絞輪（両端のくびれ）
    my.emissiveNode = color(0x9a8cff).mul(node.mul(exp(pulse(instancedDynamicBufferAttribute(phA)).sub(0.5).div(0.06).pow(2).negate())).mul(3)).add(color(0xd0c8ff).mul(fres.mul(0.1)));
    const axM = instanced(geo, my, NA * 2);
    for (let a = 0; a < NA; a++) for (let s = 0; s < 2; s++) { const i = a * 2 + s, z = -36 + a * 18 + (rnd() - 0.5) * 4, yaw = (rnd() - 0.5) * 0.4; phA.setX(i, a * 0.13 + s * 0.12);
      axM.setMatrixAt(i, m4.compose(v.set(-41 + s * 83 + (a % 2) * 20 - 10, 0.9, z), q.setFromEuler(eu.set(0, yaw, 0)), sv.set(1, 1, 1))); }
  }
  // ---- 区域C：アミロイドβのかたまり、ふくれた神経突起、ミクログリア ----
  let haloM: THREE.InstancedMesh | null = null, plM: THREE.InstancedMesh | null = null, dyM: THREE.InstancedMesh | null = null, maM: THREE.InstancedMesh | null = null;
  const amoeba: { p: THREE.Vector3; plug: number }[] = [];
  if (variant === 'C') {
    const pm = new THREE.MeshPhysicalNodeMaterial(); pm.colorNode = color(0xd8c8a8); pm.roughnessNode = float(0.5);   // 生きた色は分からないので、淡い黄みの灰白色（染色の茶色は使わない）
    pm.emissiveNode = color(0xc89a60).mul(sin(u.time.mul(1.2)).mul(0.04).add(0.08));
    plM = instanced(rich ? geos.plaque : geos.plaque_lo ?? geos.plaque, pm, plugs.length * 2);
    const dm = new THREE.MeshPhysicalNodeMaterial(); dm.colorNode = color(0x5a4048); dm.roughnessNode = float(0.45); dm.clearcoatNode = float(0.3);
    dyM = instanced(geos.dystrophic, dm, plugs.length * 2);
    plugs.forEach((pl, i) => { for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28 + i; const ax = pl.p.x + Math.cos(a) * 19, az = pl.p.z + Math.sin(a) * 17; if (Math.hypot(ax + W / 2 - 10, az) > 16) amoeba.push({ p: new THREE.Vector3(ax, 3, az), plug: i }); } });
    const am = new THREE.MeshPhysicalNodeMaterial(); am.colorNode = color(0xd0c0c4); am.roughnessNode = float(0.4); am.clearcoatNode = float(0.4);
    organic(am, noiseTex, { scale: 0.8, bump: 0.6, planar: 'tri' });
    maM = instanced(geos.microglia_a, am, amoeba.length);
    const hm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    hm.colorNode = color(0xc8b080).mul(pow(saturate(dot(normalView, positionViewDirection)), float(1.5)).mul(0.12));
    haloM = instanced(new THREE.IcosahedronGeometry(1, 3), hm, plugs.length);
  }
  // ふだんのミクログリア（B・C）：まばらに、ほぼ等間隔に散らばり、枝をゆっくり動かして見張る。区域Cでは、かたまりが溶けると丸い細胞が枝を伸ばしてここに加わる
  const ramis: { x: number; z: number; rot: number; plug: number }[] = [];
  if (variant !== 'A') {
    for (let i = 0; i < (variant === 'B' ? 6 : 5); i++) ramis.push({ x: -55 + i * 24 + (rnd() - 0.5) * 8, z: (i % 2 ? 22 : -24) + (rnd() - 0.5) * 10, rot: rnd() * 6.28, plug: -1 });
    if (variant === 'C') plugs.forEach((pl, i) => { for (let k = 0; k < 2; k++) ramis.push({ x: pl.p.x + (k ? 14 : -14), z: pl.p.z + (k ? -6 : 8), rot: rnd() * 6.28, plug: i }); });
  }
  let raM: THREE.InstancedMesh | null = null;
  if (ramis.length) {
    const rm = new THREE.MeshPhysicalNodeMaterial(); rm.colorNode = color(0xd4c4c8); rm.roughnessNode = float(0.4); rm.clearcoatNode = float(0.4); rm.emissiveNode = color(0xc0b0ff).mul(fres.mul(0.12));
    raM = instanced(geos.microglia_r, rm, ramis.length);
  }

  const capAround = (x: number, z: number) => { let cap = 1; for (const pl of plugs) if (!pl.cleared) { const d = Math.hypot(x - pl.p.x, z - pl.p.z); if (d < 18) cap = Math.min(cap, 0.3 + 0.7 * Math.max(0, (d - 9) / 9)); } return cap; };
  health.setFn((x, z) => { let k = 0; for (const p of plugs) k = Math.max(k, Math.exp(-((x - p.p.x) ** 2 + (z - p.p.z) ** 2) / 700)); return 0.24 - 0.18 * k + 0.04 * Math.sin(x * 0.05) * Math.cos(z * 0.06); });
  const startMean = health.mean();
  const plugsLeft = () => plugs.filter((p) => !p.cleared).length;
  const progress = () => Math.min(plugsLeft() ? 0.9 : 1, Math.max(0, (health.mean() - startMean) / (hc.doneAt - startMean)));
  const sun = new THREE.DirectionalLight(0xf4f0ff, 1.2); sun.position.set(-30, 100, 30); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xe8e0f0, 0x6a4a58, 0.9); scene.add(hemi);
  let onPlug: (i: number, kind: 'hit' | 'cleared' | 'pulse') => void = () => {};
  let fight = false, flowS = 0, booted = false, lastPulse = 0;
  const stage: ZoneStage = {
    meta: M, scene, health, size: [W, D], u, sun, plugs, progress, floorHeight: floorAt,
    start: { pos: new THREE.Vector3(-W / 2 + 10, opts.entrance ? 5 : 0, variant === 'A' ? -17 : variant === 'B' ? 2 : 0), yaw: Math.PI / 2, swimming: !!opts.entrance },
    causeAt: (x, z) => (health.sample(x, z) < 0.3 ? { short: variant === 'A' ? '漏れ' : '信号の弱まり', cause: variant === 'A' ? '関門のすき間から、血の中のものが漏れています' : '信号がうまく伝わらず、回路が働いていません' } : { short: '炎症', cause: 'ミクログリアが騒ぎ、まわりが落ち着いていません' }),
    setOnPlug(f) { onPlug = f; },
    encounters(pos, t, walked) {
      const out: { id: string; at: THREE.Vector3 | null }[] = [];
      if (variant === 'A') { if (t > 3) out.push({ id: 'bbb', at: null }); if (walked > 8) out.push({ id: 'astrocyte', at: null }); if (walked > 16) out.push({ id: 'pericyte', at: null }); if (walked > 24) out.push({ id: 'rbc', at: null }); }
      if (variant === 'B') { if (t > 3) out.push({ id: 'neuron', at: null }); if (walked > 8) out.push({ id: 'dendritic_spine', at: null }); if (walked > 16) out.push({ id: 'synapse', at: null }); if (walked > 24) out.push({ id: 'myelin', at: null }); if (walked > 32) out.push({ id: 'oligodendrocyte', at: null }); if (walked > 40) out.push({ id: 'microglia', at: null }); }
      if (variant === 'C') { if (t > 3) out.push({ id: 'amyloid_plaque', at: null }); if (walked > 10) out.push({ id: 'microglia', at: null }); if (walked > 18) out.push({ id: 'tau_tangle', at: null }); }
      return out;
    },
    heal(x, z, dt) {
      plugs.forEach((pl, i) => {
        if (pl.cleared || Math.hypot(x - pl.p.x, z - pl.p.z) > 10) return;
        if (pl.hp === 1) { onPlug(i, 'hit'); if (variant === 'C') fight = true; }
        pl.hp = Math.max(0, pl.hp - dt / 3.8); pl.shake = 1;
        if (pl.hp <= 0) { pl.cleared = true; onPlug(i, 'cleared'); health.heal(pl.p.x, pl.p.z, 18, 0.35); healthyN.forEach((n, j) => { if (n.plug === i) neuAlive!.setX(j, 1); }); if (neuAlive) neuAlive.needsUpdate = true; }
      });
      const got = health.heal(x, z, tuning.beam.radius, tuning.beam.rate * dt); health.clampFn(capAround); return got;
    },
    beat: () => (u.time.value % PULSE_T) / PULSE_T,
    flowing: () => flowS,
    update(dt, t, camera) {
      u.time.value = t; u.heartPhase.value = (t / (60 / 70)) * Math.PI * 2;
      health.spread(dt, hc.regrow); health.clampFn(capAround);
      let changed = false;
      for (const pl of plugs) { pl.shake = Math.max(0, pl.shake - dt * 3); if (pl.cleared && pl.gone < 1) { pl.gone = Math.min(1, pl.gone + dt * 0.45); changed = true; } }
      if (changed) reshape();
      // 対決（C）：発火の波のたびに、かたまりのまわりから乱れの波が広がる
      const pNow = Math.floor(t / PULSE_T);
      if (fight && plugsLeft() && pNow !== lastPulse) { waveR.value = 0; waveOn.value = 1; onPlug(-1, 'pulse'); }
      lastPulse = pNow;
      if (waveOn.value > 0 && fight && plugsLeft()) {
        waveR.value += dt * 12; waveOn.value = Math.max(0, 1 - waveR.value / 36); const Rr = waveR.value, amt = dt * 0.5 * plugsLeft() / 3;
        for (let j = 0; j < health.h; j++) for (let i = 0; i < health.w; i++) { const x = (i / (health.w - 1) - 0.5) * W, z = (j / (health.h - 1) - 0.5) * D; if (Math.abs(Math.hypot(x - core.x, z - core.z) - Rr) < 3) { const k = j * health.w + i; health.data[k] = Math.max(0.12, health.data[k] - amt); } }
        health.version++;
      } else waveOn.value = Math.max(0, waveOn.value - dt);
      const prog = progress(); flowS = prog;
      if (!booted && prog >= 1 && variant === 'C') { booted = true; bootR.value = 0; }
      if (booted) bootR.value += dt * 20;
      u.lightIn.value += ((0.4 + 0.6 * prog) - u.lightIn.value) * Math.min(1, dt * 1.5);
      // 終足：すき間の所は欠けていて、治ると管を覆い直す
      if (footM) { feet.forEach((f, i) => { const pl = f.plug >= 0 ? plugs[f.plug] : null; const k = pl ? Math.min(1, 0.05 + pl.gone * 1.05) : 1; const x = f.x + (pl ? Math.sin(t * 40) * pl.shake * 0.05 : 0);
        footM!.setMatrixAt(i, m4.compose(v.set(x, 2.6, capPathZ(f.k, x)), q.setFromEuler(eu.set(f.rot, 0, 0)), sv.set(k * FS / 3.4, k, k))); }); footM.instanceMatrix.needsUpdate = true; }
      if (capR) { capRBC.forEach((r, i) => { r.x += dt * (3 + 3 * prog) * r.s; if (r.x > W * 0.62) r.x -= W * 1.24; v.set(r.x, 2.6, capPathZ(r.k, r.x)); capR!.setMatrixAt(i, m4.compose(v, q.setFromEuler(eu.set(0, 0, Math.PI / 2)), sv.set(0.62, 1.35, 0.62))); }); capR.instanceMatrix.needsUpdate = true; }
      if (leakM) { plugs.forEach((pl, i) => { for (let k = 0; k < 6; k++) { const a = k * 1.05 + t * 0.2, rr = 3 + ((t * 0.6 + k * 0.7) % 4); const s = (1 - pl.gone) * (2.2 + k * 0.3); leakM!.setMatrixAt(i * 6 + k, m4.compose(v.set(pl.p.x + Math.cos(a) * rr, 3 + Math.sin(t + k) * 1.2, pl.p.z + Math.sin(a) * rr), q, sv.setScalar(s + 0.001))); } }); leakM.instanceMatrix.needsUpdate = true; }
      // とげ：生えている度合いに合わせて大きさが変わる
      if (spM) {
        healthyN.forEach((n, j) => { const want = n.plug >= 0 && !plugs[n.plug].cleared ? 0 : 1; spGrow[j] += (want - spGrow[j]) * Math.min(1, dt * 0.8); });
        spines.forEach((s, i) => { const n = healthyN[s.n], g = spGrow[s.n], tt = (s.y - 10) / 140, r = 2.0 - 1.2 * tt;
          // 幹の中心（模型の幹はゆるくうねる）＋表面の向き。細胞ごとの向き（rot）で回す
          const c = Math.cos(n.rot), sn = Math.sin(n.rot), lx = 1.2 * Math.sin(tt * 3) + Math.cos(s.a) * r, lz = -0.8 * Math.sin(tt * 2 + 1) + Math.sin(s.a) * r;
          v.set(n.x + lx * c + lz * sn, 7 + s.y, n.z - lx * sn + lz * c);
          const dx = Math.cos(s.a) * c + Math.sin(s.a) * sn, dz = -Math.cos(s.a) * sn + Math.sin(s.a) * c;
          q.setFromUnitVectors(sv.set(0, 1, 0), new THREE.Vector3(dx, s.tilt * 0.6, dz).normalize());
          spM!.setMatrixAt(i, m4.compose(v, q, sv.setScalar(Math.max(0.001, g * 1.4)))); });
        spM.instanceMatrix.needsUpdate = true;
      }
      if (plM && dyM) { plugs.forEach((pl, i) => { const k = 1 - pl.gone, sh = Math.sin(t * 40) * pl.shake * 0.15; for (let j = 0; j < 2; j++) {
        plM!.setMatrixAt(i * 2 + j, m4.compose(v.set(pl.p.x + sh, 6 + j * 1.5, pl.p.z), q.setFromEuler(eu.set(0, j * 1.2 + i, 0)), sv.setScalar((2.3 - j * 0.6) * k + 0.001)));
        dyM!.setMatrixAt(i * 2 + j, m4.compose(v.set(pl.p.x + (j ? 4 : -3), 6, pl.p.z + (j ? -2 : 3)), q.setFromEuler(eu.set(i, j, 0)), sv.setScalar(1.6 * k + 0.001))); } });
        if (haloM) { plugs.forEach((pl, i) => haloM!.setMatrixAt(i, m4.compose(v.set(pl.p.x, 6, pl.p.z), q, sv.set(26, 15, 26).multiplyScalar(1 - pl.gone + 0.001)))); haloM.instanceMatrix.needsUpdate = true; }
        plM.instanceMatrix.needsUpdate = dyM.instanceMatrix.needsUpdate = true; }
      if (maM) { amoeba.forEach((a, i) => { const k = 1 - plugs[a.plug].gone; maM!.setMatrixAt(i, m4.compose(v.set(a.p.x + Math.sin(t * 0.3 + i) * 0.6, a.p.y, a.p.z), q.setFromEuler(eu.set(i, t * 0.05, 0)), sv.setScalar(0.6 * k + 0.001))); }); maM.instanceMatrix.needsUpdate = true; }
      // ふだんのミクログリア：枝をゆっくり伸び縮みさせて見張る（×100 で、実物の 約0.36µm/分 が見える速さになる）
      if (raM) { ramis.forEach((r, i) => { const k = r.plug >= 0 ? plugs[r.plug].gone : 1; const br = 0.85 + 0.12 * Math.sin(t * 0.25 + i * 1.7);
        raM!.setMatrixAt(i, m4.compose(v.set(r.x, 3 + floorAt(r.x, r.z), r.z), q.setFromEuler(eu.set(0, r.rot + 0.08 * Math.sin(t * 0.18 + i), 0)), sv.set(br * k + 0.001, k + 0.001, br * k + 0.001))); }); raM.instanceMatrix.needsUpdate = true; }
      sun.intensity = 0.9 + 1.1 * u.lightIn.value;
      (scene.fog as THREE.FogExp2).color.copy(fogC).multiplyScalar(0.85 + 0.25 * prog);
      (scene.background as THREE.Color).copy((scene.fog as THREE.FogExp2).color).multiplyScalar(0.5);
      if (health.version !== hVersion) { health.toBytes(hBytes); hTex.needsUpdate = true; hVersion = health.version; }
      keyLightDirView.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
    },
  };
  void neuPh; void neuM;
  return stage;
}
export const buildBBB = (r: THREE.WebGPURenderer, t: string, o?: { entrance?: boolean }) => build(r, t, 'A', o);
export const buildCortex = (r: THREE.WebGPURenderer, t: string) => build(r, t, 'B');
export const buildAmyloid = (r: THREE.WebGPURenderer, t: string) => build(r, t, 'C');

// ステージ4「腸」— 区域A：絨毛の草原（小腸）／区域B：大腸の粘液／区域C：陰窩とパネート細胞 → 病巣の核（単位 µm、知覚加速 ×1）
// 事実（Docs/REFERENCE/gut.md）：小腸の絨毛は高さ 0.5〜1.6mm・幅 約0.1mm。表面の吸収上皮細胞には長さ 約1µm・太さ 約0.1µm の微絨毛がびっしり（刷子縁）。
//   腸内細菌は大腸で 約10¹¹個/mL（細菌どうし 約2µm おき）。大腸の粘液は2層で、内側の層には細菌がほとんど入らない。パネート細胞は抗菌の粒を出す。
//   腸内細菌のバランスがくずれる（ディスバイオシス）と、内側の粘液が薄くなり、細菌が上皮に近づき、炎症が起きやすい。腸内細菌科（大腸菌など）が増えることがある。
// 遊び（勢力図を塗り替える）：光を当てた所は、粘液と、もとから住む細菌（バクテロイデス・ビフィズス菌・アッカーマンシアなど）が優勢になる。
//   増えすぎた菌の群れが残っている間は、まわりの治っていない所が少しずつ押し返される。大腸では、ぜん動（腸の動き）の波で床が波打つ。
// 作り事：光で粘液と細菌のバランスを整えるのは作り事の治し方。特定の菌が病気を治すとは描かない。
import * as THREE from 'three/webgpu';
import { tsl, type N } from '../../core/tsl';
import { loadGLB, makeEnvironment } from '../../core/assets';
import { HealthField } from '../../core/health';
import type { ZoneStage, ZoneMeta, Plug } from '../zone';
import { keyLightDirView } from '../../materials/cell';
import tuning from '../../data/tuning.json';

const { uniform, texture, positionWorld, positionLocal, vec2, vec3, float, color, mix, exp, length, smoothstep, sin, pow, saturate, dot, normalView, positionViewDirection } = tsl;
const WAVE_T = 6;   // ぜん動の速い波（実物 1分に 約9〜12回）
const common = { perception: 1, patient: 'comfort' as const, swimCeil: 20, plugName: '増えすぎた菌の群れ' };
export const VILLI_META: ZoneMeta = { ...common, id: 'villi', hud: '小腸・絨毛　腸のバランスの回復', scaleNote: '潜行士の身長 2µm ／ 絨毛の幅 約100µm',
  enter: 'こちらオペレーター。小腸に入りました。食べ物の流れに乗って、絨毛の草原へ降ります。',
  arrive: 'こちらオペレーター。小腸の絨毛の先の上です。足もとのびろうどのような面は、微絨毛がびっしり並んだ刷子縁。まわりの丸い山は、となりの絨毛です。腸内細菌のバランスがくずれ、増えすぎた菌の群れが上皮に張りついています。光を当てて、粘液と、もとから住む細菌の勢力を取り戻してください。',
  plugHit: '増えすぎた菌の群れです。光を当て続けると、粘液が戻り、群れが散っていきます。',
  plugCleared: (l) => (l ? `群れが散りました。もとから住む細菌が戻ってきます。残りは ${l} か所です。` : 'すべての群れが散りました。勢力図が、塗り替わっていきます。'),
  done: '絨毛のまわりのバランスが戻りました。吸収上皮細胞が、栄養を受け取りはじめます。', doneTitle: '絨毛の草原が戻りました', causeMain: '腸内細菌のバランスのくずれ（ディスバイオシス）',
  plugDiag: { short: '増えすぎた菌の群れ', cause: '粘液が薄くなった所に、菌が増えて上皮に張りついています。光を当て続けて、バランスを取り戻してください' } };
export const COLON_META: ZoneMeta = { ...common, id: 'colon', hud: '大腸・粘液　すみ分けの回復', scaleNote: '潜行士の身長 2µm ／ 細菌の長さ 約1〜4µm',
  arrive: 'こちらオペレーター。大腸です。ここには、ひとつかみの土より多いほどの細菌が住んでいます。足もとのかたい層は、内側の粘液。ふだんは細菌がほとんど入れない壁ですが、薄くなって菌が近づいています。ぜん動の波で、床が波打ちます。',
  plugHit: '内側の粘液を越えてきた菌の群れです。光を当て続けて、粘液の壁を取り戻してください。',
  plugCleared: (l) => (l ? `粘液の壁が戻り、群れが外へ押し戻されました。残りは ${l} か所です。` : 'すべての群れが押し戻されました。細菌と上皮の間に、粘液の壁が戻ります。'),
  done: '大腸の粘液の2つの層が戻りました。細菌は外側の層に、上皮は内側の層に守られています。', doneTitle: 'すみ分けが戻りました', causeMain: '内側の粘液の層が薄くなったこと',
  plugDiag: { short: '粘液を越えた菌の群れ', cause: '内側の粘液が薄くなり、菌が上皮に近づいています。光を当て続けて粘液の壁を取り戻してください' } };
export const CRYPT_META: ZoneMeta = { ...common, id: 'crypt', hud: '腸・陰窩　守りの回復', scaleNote: '潜行士の身長 2µm ／ パネート細胞 約10µm',
  arrive: 'こちらオペレーター。腸の上皮の、陰窩（くぼみ）が並ぶ所です。くぼみの奥のパネート細胞は、抗菌の粒をたくわえて、くぼみを守っています。奥に、炎症が続いている芯があります。',
  plugName: '炎症の芯', plugHit: '炎症の芯です。手当てを始めると、ぜん動の波のたびに炎症が広がります。陰窩を守りながら、ほどいてください。',
  plugCleared: (l) => (l ? `炎症の芯が一つおさまりました。残りは ${l} か所です。` : 'すべての炎症の芯がおさまりました。'),
  done: 'パネート細胞が抗菌の粒を出しはじめました。腸の守りが戻りました。', doneTitle: '腸が、ふたたび整いました', causeMain: 'バランスのくずれと炎症',
  plugDiag: { short: '炎症の芯', cause: '炎症が続き、陰窩の守りが弱っています。光を当て続けておさめてください（手当てを始めると、ぜん動の波のたびに炎症が広がります）' } };

async function build(renderer: THREE.WebGPURenderer, tier: string, variant: 'A' | 'B' | 'C', opts: { entrance?: boolean } = {}): Promise<ZoneStage> {
  const M = variant === 'A' ? VILLI_META : variant === 'B' ? COLON_META : CRYPT_META;
  const W = 130, D = 100, VR_ = 60, VA = 78, VB = 52;   // 区域A：絨毛の先（実物の写真：葉や舌の形に平たい。長さの向き 約156µm・幅 約104µm、高さの丸み 60µm）
  const rich = tier === 'pc-high', vr = tier === 'vr';
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png'); noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.colorSpace = THREE.NoColorSpace;
  const [gl, nl] = await Promise.all([loadGLB('/static/models/gut.glb'), loadGLB('/static/models/nose.glb')]);
  const geos: Record<string, THREE.BufferGeometry> = {};
  for (const g of [gl, nl]) g.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.updateWorldMatrix(true, false); geos[m.name] = m.geometry.clone().applyMatrix4(m.matrixWorld); } });
  const scene = new THREE.Scene();
  // 腸の中：湿って温かく、粘膜の桃色。大腸は少し黄みを帯びる
  scene.background = new THREE.Color(variant === 'B' ? 0x3a2a22 : 0x3a2426); scene.fog = new THREE.FogExp2(variant === 'B' ? 0x8a7258 : 0x946a64, 0.008);
  scene.environment = makeEnvironment(renderer, new THREE.Color(0.95, 0.65, 0.58)); scene.environmentIntensity = 0.4;
  const hc = tuning.health;
  const health = new HealthField(hc.gridW, Math.round(hc.gridW * D / W), W, D, 0.2);
  const hBytes = new Uint8Array(health.w * health.h);
  const hTex = new THREE.DataTexture(health.toBytes(hBytes), health.w, health.h, THREE.RedFormat, THREE.UnsignedByteType);
  hTex.magFilter = hTex.minFilter = THREE.LinearFilter; hTex.needsUpdate = true; let hVersion = -1;
  const u = { time: uniform(0), scan: uniform(0), lightIn: uniform(0.4), heartPhase: uniform(0), beamPos: uniform(new THREE.Vector3(0, -999, 0)), beamOn: uniform(0), scanR: uniform(0), scanOrigin: uniform(new THREE.Vector3()), scanPulse: uniform(0) };
  const H: N = texture(hTex, vec2(positionWorld.x.div(W).add(0.5).clamp(0, 1), positionWorld.z.div(D).add(0.5).clamp(0, 1))).r;
  const sick = float(1).sub(H);
  const core = new THREE.Vector3(variant === 'C' ? W * 0.25 : 0, 0, 0);
  const waveU = uniform(0), waveR = uniform(0), waveOn = uniform(0), bootR = uniform(-1);
  const dC = length(positionWorld.xz.sub(vec2(core.x, core.z)));
  const waveRing = exp(dC.sub(waveR).div(3).pow(2).negate()).mul(waveOn);
  const bootRing = exp(dC.sub(bootR).div(6).pow(2).negate()).mul(smoothstep(-1, 0, bootR));
  const fres = pow(float(1).sub(saturate(dot(normalView, positionViewDirection).abs())), float(2.5));
  const scanCol = mix(color(0xffa040), color(0x5fe8d0), H);
  // ---- 床 ----
  // 区域A：絨毛の先の丸い面（刷子縁のびろうど）。区域B：内側の粘液のかたい層（下に上皮が透ける）。区域C：陰窩の口が並ぶ上皮
  const floorAt = (x: number, z: number) => variant === 'A' ? VR_ * Math.sqrt(Math.max(0, 1 - (x / VA) ** 2 - (z / VB) ** 2)) - VR_ : 1.6 * Math.sin(x * 0.06 - waveU.value * Math.PI * 2);   // 大腸・陰窩は、ぜん動の波で床が波打つ
  const fm = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide });
  const velvet = texture(noiseTex, positionWorld.xz.mul(1 / 1.6)).g, cells = texture(noiseTex, positionWorld.xz.mul(1 / (variant === 'A' ? 7 : 22))).r;
  const border = smoothstep(0.55, 0.98, cells).mul(0.6);   // 細胞の境目はやわらかく（くっきりした直線にしない）
  const pink = mix(color(0xc87870), color(0xeeb0a4), H), gel = mix(color(0xb8b090), color(0xdde4e0), H);
  const pores = variant === 'B' ? float(0) : smoothstep(0.9, 0.97, texture(noiseTex, positionWorld.xz.mul(1 / 9)).b);   // 杯細胞の口（粘液の出る小さな穴）
  fm.colorNode = (variant === 'B' ? gel : pink).mul(velvet.mul(0.14).add(0.9)).mul(mix(float(1), float(0.82), border)).mul(float(1).sub(pores.mul(0.45)));
  fm.roughnessNode = mix(float(0.6), float(0.25), H); fm.clearcoatNode = H.mul(0.7); fm.clearcoatRoughnessNode = float(0.15);   // 粘液と糖の衣（グリコカリックス）のつや
  fm.emissiveNode = color(0xb83a2a).mul(sick.mul(0.1)).add(color(0xff7a40).mul(waveRing.mul(0.5))).add(color(0xfff0e0).mul(bootRing.mul(0.6))).add(scanCol.mul(u.scan.mul(0.12))).add(color(0xffd8d0).mul(fres.mul(0.06)));
  if (variant === 'B' || variant === 'C') {
    // ぜん動の波：床がゆるく持ち上がって +x へ進む
    fm.positionNode = positionLocal.add(vec3(0, 0, sin(positionLocal.x.mul(0.06).sub(waveU.mul(Math.PI * 2))).mul(1.6)));
  }
  let floor: THREE.Mesh;
  if (variant === 'A') { floor = new THREE.Mesh(geos.vtip, fm); floor.scale.set(VA, VR_, VB); floor.position.y = -VR_; }
  else { const g = new THREE.PlaneGeometry(W * 1.3, D * 1.3, 120, 90); g.rotateX(-Math.PI / 2); g.rotateX(Math.PI / 2); floor = new THREE.Mesh(g, fm); floor.rotation.x = -Math.PI / 2; }
  scene.add(floor);
  if (variant === 'A') {   // となりの絨毛：葉の形の先が、すき間なく並ぶ（実物の走査電顕の写真：舌の形の絨毛が縁を接して敷きつめられる）
    const nm = new THREE.MeshPhysicalNodeMaterial(); nm.colorNode = color(0xe2a094).mul(texture(noiseTex, positionWorld.xz.mul(1 / 7)).r.mul(0.12).add(0.9)); nm.roughnessNode = float(0.28); nm.clearcoatNode = float(0.6); nm.clearcoatRoughnessNode = float(0.15);
    const nb: [number, number, number][] = [[1, 0, 0], [-1, 0, 0], [0.5, 1, 0.25], [-0.5, 1, -0.2], [0.5, -1, 0.15], [-0.5, -1, -0.25], [1.5, 1, 0.3], [-1.5, 1, 0.1], [1.5, -1, -0.1], [-1.5, -1, 0.3], [0, 2, 0], [0, -2, 0.2]];
    nb.forEach(([ix, iz, rot], i) => { const m = new THREE.Mesh(geos.vtip, nm); const k = 0.92 + (i % 3) * 0.05; m.scale.set(VA * k, VR_ * k, VB * k); m.rotation.y = rot; m.position.set(ix * VA * 2.02, -VR_ - 6 - (i % 3) * 5, iz * VB * 2.02); scene.add(m); });
  }
  if (variant === 'B') {   // 内側の粘液ごしに透ける上皮
    const g = new THREE.PlaneGeometry(W * 1.4, D * 1.4); g.rotateX(-Math.PI / 2); const m = new THREE.MeshStandardNodeMaterial(); m.colorNode = mix(color(0xb86860), color(0xd89488), H); const e = new THREE.Mesh(g, m); e.position.y = -26; scene.add(e);
    fm.transparent = true; fm.opacityNode = mix(float(0.45), float(0.8), H); fm.depthWrite = false; floor.renderOrder = 20;
  }
  // 区域C：陰窩の口（盛り上がった輪）と、奥のパネート細胞（抗菌の粒が光る）
  const crypts: THREE.Vector3[] = [];
  if (variant === 'C') {
    const cm = new THREE.MeshPhysicalNodeMaterial(); cm.colorNode = mix(color(0xb87068), color(0xe8a89c), H); cm.roughnessNode = float(0.3); cm.clearcoatNode = float(0.5);
    for (let x = -W / 2 + 10; x < W / 2; x += 22) for (let z = -D / 2 + 10; z < D / 2; z += 22) crypts.push(new THREE.Vector3(x + ((z / 22) % 2 ? 11 : 0), 0, z));
    const ci = new THREE.InstancedMesh(geos.crypt, cm, crypts.length); const m4 = new THREE.Matrix4();
    crypts.forEach((p, i) => ci.setMatrixAt(i, m4.compose(p.clone().setY(-0.8), new THREE.Quaternion(), new THREE.Vector3(5, 5, 3)))); scene.add(ci);
    // くぼみの入り口：輪の内側の暗い穴（奥がのぞく）
    const hm = new THREE.MeshBasicNodeMaterial(); const hr = length(tsl.uv().sub(0.5)).mul(2); hm.colorNode = mix(color(0x3a1a18), color(0x8a4a40), smoothstep(0.2, 1.0, hr));
    const hg = new THREE.CircleGeometry(4.2, 32); hg.rotateX(-Math.PI / 2);
    const hi = new THREE.InstancedMesh(hg, hm, crypts.length); crypts.forEach((p, i) => hi.setMatrixAt(i, m4.compose(p.clone().setY(0.05), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1)))); scene.add(hi);
    const gm = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); gm.colorNode = color(0xf4e2c0); gm.emissiveNode = color(0xffd890).mul(H.mul(0.5).add(sin(u.time.mul(2)).mul(0.08))); gm.opacityNode = float(0.9);
    const gi = new THREE.InstancedMesh(geos.paneth_granules, gm, crypts.length);
    crypts.forEach((p, i) => gi.setMatrixAt(i, m4.compose(p.clone().setY(-9), new THREE.Quaternion(), new THREE.Vector3(0.7, 0.7, 0.7)))); scene.add(gi);
  }
  // ---- 細菌：もとから住む菌（バクテロイデス・ビフィズス菌・アッカーマンシア）と、増えすぎた菌（大腸菌など）----
  const kinds = ['bactero', 'bifido', 'akker', 'ecoli'] as const;
  const mats = { bactero: 0xc8b898, bifido: 0xd8c8a8, akker: 0xe0d0c0, ecoli: 0xb89878 };
  const NB = vr ? 50 : rich ? 140 : 90;
  let sd = 13; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const plugs: (Plug & { gone: number; shake: number })[] = (variant === 'C' ? [[-0.07, -0.12], [0.08, -0.05], [0.0, 0.14]] : variant === 'A' ? [[-0.22, -0.12], [0.18, -0.2], [0.04, 0.24]] : [[-0.25, 0.1], [0.05, -0.2], [0.3, 0.15]])
    .map(([fx, fz]) => { const x = core.x + fx * W, z = core.z + fz * D; return { p: new THREE.Vector3(x, floorAt(x, z), z), hp: 1, cleared: false, gone: 0, shake: 0 }; });
  const bugs = Array.from({ length: NB }, (_, i) => { const pl = plugs[i % 3]; const nearPlug = i < NB * 0.35; const x = nearPlug ? pl.p.x + (rnd() - 0.5) * 12 : (rnd() - 0.5) * W, z = nearPlug ? pl.p.z + (rnd() - 0.5) * 12 : (rnd() - 0.5) * D;
    return { p: new THREE.Vector3(x, 0, z), h: rnd() * 6.28, sp: 0.4 + rnd() * 0.8, k: (nearPlug ? 3 : Math.floor(rnd() * 3)) as number, plug: nearPlug ? i % 3 : -1, ph: rnd() * 6.28, alt: 0.3 + rnd() * 2 }; });
  const insts = kinds.map((k) => { const m = new THREE.MeshPhysicalNodeMaterial(); m.colorNode = color(mats[k]); m.roughnessNode = float(0.35); m.clearcoatNode = float(0.6); m.clearcoatRoughnessNode = float(0.2);
    const im = new THREE.InstancedMesh(geos[k], m, NB); im.frustumCulled = false; im.count = NB; scene.add(im); return im; });
  // 好中球（炎症の所に集まる）
  const neuMat = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); neuMat.colorNode = color(0xece4dc); neuMat.roughnessNode = float(0.4); neuMat.opacityNode = float(0.8);
  const neu = new THREE.InstancedMesh(geos.neutro, neuMat, 4); neu.frustumCulled = false; scene.add(neu);
  const capAround = (x: number, z: number) => { let cap = 1; for (const pl of plugs) if (!pl.cleared) { const d = Math.hypot(x - pl.p.x, z - pl.p.z); if (d < 18) cap = Math.min(cap, 0.3 + 0.7 * Math.max(0, (d - 9) / 9)); } return cap; };
  health.setFn((x, z) => { let k = 0; for (const p of plugs) k = Math.max(k, Math.exp(-((x - p.p.x) ** 2 + (z - p.p.z) ** 2) / 700)); return 0.24 - 0.18 * k + 0.04 * Math.sin(x * 0.05) * Math.cos(z * 0.06); });
  const startMean = health.mean();
  const plugsLeft = () => plugs.filter((p) => !p.cleared).length;
  const progress = () => Math.min(plugsLeft() ? 0.9 : 1, Math.max(0, (health.mean() - startMean) / (hc.doneAt - startMean)));
  const sun = new THREE.DirectionalLight(0xfff2ea, 1.5); sun.position.set(-30, 100, 30); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xffe8e4, 0xa04a44, 0.9); scene.add(hemi);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3(), zero = new THREE.Vector3(0, 0, 0);
  let onPlug: (i: number, kind: 'hit' | 'cleared' | 'pulse') => void = () => {};
  let fight = false, waveT = 0, flowS = 0, booted = false, creep = 0;
  const stage: ZoneStage = {
    meta: M, scene, health, size: [W, D], u, sun, plugs, progress, floorHeight: floorAt,
    start: { pos: new THREE.Vector3(variant === 'A' ? -30 : -W / 2 + 10, opts.entrance ? 18 : 0, 0), yaw: Math.PI / 2, swimming: !!opts.entrance },
    causeAt: (x, z) => (health.sample(x, z) < 0.3 ? { short: '菌のバランスのくずれ', cause: '粘液が薄く、増えすぎた菌が上皮に近づいています' } : { short: '粘液の薄さ', cause: '粘液の層が薄く、上皮の守りが弱っています' }),
    setOnPlug(f) { onPlug = f; },
    encounters(pos, t, walked) {
      const out: { id: string; at: THREE.Vector3 | null }[] = [];
      if (t > 3) out.push({ id: variant === 'A' ? 'villus' : variant === 'B' ? 'gut_mucus' : 'paneth_cell', at: null });
      if (walked > 8) out.push({ id: variant === 'C' ? 'enterocyte' : 'microvilli', at: null });
      const near = (k: number) => bugs.find((b) => b.k === k && b.p.distanceTo(pos) < 10);
      const b0 = near(0); if (b0) out.push({ id: 'bacteroides', at: b0.p.clone() });
      const b1 = near(1); if (b1) out.push({ id: 'bifidobacterium', at: b1.p.clone() });
      const b2 = near(2); if (b2) out.push({ id: 'akkermansia', at: b2.p.clone() });
      const b3 = near(3); if (b3) out.push({ id: 'enterobacteria', at: b3.p.clone() });
      if (variant === 'A' && walked > 20) out.push({ id: 'enterocyte', at: null });
      if (variant === 'B' && progress() > 0.4) out.push({ id: 'butyrate', at: null });
      return out;
    },
    heal(x, z, dt) {
      plugs.forEach((pl, i) => {
        if (pl.cleared || Math.hypot(x - pl.p.x, z - pl.p.z) > 7) return;
        if (pl.hp === 1) { onPlug(i, 'hit'); if (variant === 'C') { fight = true; waveT = 2; } }
        pl.hp = Math.max(0, pl.hp - dt / 3.6); pl.shake = 1;
        if (pl.hp <= 0) { pl.cleared = true; onPlug(i, 'cleared'); health.heal(pl.p.x, pl.p.z, 18, 0.35); }
      });
      const got = health.heal(x, z, tuning.beam.radius, tuning.beam.rate * dt); health.clampFn(capAround); return got;
    },
    beat: variant === 'A' ? undefined : () => ((u.time.value % WAVE_T) / WAVE_T),
    drift: variant === 'A' ? undefined : (p: THREE.Vector3) => { const w = Math.sin(p.x * 0.06 - waveU.value * Math.PI * 2); return new THREE.Vector3(Math.max(0, w) * 1.2, 0, 0); },
    flowing: () => flowS,
    update(dt, t, camera) {
      u.time.value = t; u.heartPhase.value += dt * 1.2; waveU.value = (t % WAVE_T) / WAVE_T;
      health.spread(dt, hc.regrow); health.clampFn(capAround);
      // 勢力のせめぎあい：群れが残っている間、治っていない所は少しずつ押し返される
      creep += dt; if (creep > 0.5 && plugsLeft()) { creep = 0; for (let j = 0; j < health.h; j++) for (let i = 0; i < health.w; i++) { const k = j * health.w + i; if (health.data[k] < 0.5) health.data[k] = Math.max(0.12, health.data[k] - 0.004 * plugsLeft()); } health.version++; }
      for (const pl of plugs) { pl.shake = Math.max(0, pl.shake - dt * 3); if (pl.cleared) pl.gone = Math.min(1, pl.gone + dt * 0.5); }
      if (fight && plugsLeft()) {
        waveT -= dt; if (waveT <= 0) { waveT = WAVE_T; waveR.value = 0; waveOn.value = 1; onPlug(-1, 'pulse'); }
        if (waveOn.value > 0) { waveR.value += dt * 12; waveOn.value = Math.max(0, 1 - waveR.value / 36); const Rr = waveR.value, amt = dt * 0.5 * plugsLeft() / 3;
          for (let j = 0; j < health.h; j++) for (let i = 0; i < health.w; i++) { const x = (i / (health.w - 1) - 0.5) * W, z = (j / (health.h - 1) - 0.5) * D; if (Math.abs(Math.hypot(x - core.x, z - core.z) - Rr) < 3) { const k = j * health.w + i; health.data[k] = Math.max(0.12, health.data[k] - amt); } }
          health.version++; }
      } else waveOn.value = Math.max(0, waveOn.value - dt);
      const prog = progress(); flowS = prog;
      if (!booted && prog >= 1 && variant === 'C') { booted = true; bootR.value = 0; }
      if (booted) bootR.value += dt * 20;
      u.lightIn.value += ((0.4 + 0.6 * prog) - u.lightIn.value) * Math.min(1, dt * 1.5);
      // 細菌：その場所の健康度で、増えすぎた菌か、もとから住む菌かが入れかわる（勢力図）。ゆっくり泳ぎ、ただよう
      for (let k = 0; k < 4; k++) insts[k].count = NB;
      bugs.forEach((b, i) => {
        const h = health.sample(b.p.x, b.p.z);
        const want = b.plug >= 0 && !plugs[b.plug].cleared ? 3 : h < 0.35 ? 3 : (i % 3);
        if (want !== b.k && Math.random() < dt * 0.6) b.k = want;
        b.h += (Math.sin(t * 0.3 + b.ph) * 0.6) * dt;
        const spd = b.k === 3 ? b.sp * 1.4 : b.k === 2 ? 0.1 : b.sp * 0.3;   // 大腸菌はべん毛で泳ぐ。バクテロイデスなどはほとんど動かず、流れにまかせる
        b.p.x += Math.cos(b.h) * spd * dt; b.p.z += Math.sin(b.h) * spd * dt;
        if (b.plug >= 0 && !plugs[b.plug].cleared) { const pl = plugs[b.plug]; const dx = pl.p.x - b.p.x, dz = pl.p.z - b.p.z; if (Math.hypot(dx, dz) > 7) { b.p.x += dx * dt * 0.3; b.p.z += dz * dt * 0.3; } }
        if (Math.abs(b.p.x) > W / 2) b.p.x *= -0.98; if (Math.abs(b.p.z) > D / 2) b.p.z *= -0.98;
        v.copy(b.p); v.y = floorAt(b.p.x, b.p.z) + (variant === 'B' && b.k !== 3 ? b.alt + 1 : b.alt * 0.5 + 0.4);
        q.setFromEuler(new THREE.Euler(Math.sin(t + b.ph) * 0.3, -b.h, Math.sin(t * 0.7 + b.ph) * 0.2));
        for (let k = 0; k < 4; k++) insts[k].setMatrixAt(i, m4.compose(v, q, k === b.k ? sv.set(1, 1, 1) : zero));
      });
      insts.forEach((im) => (im.instanceMatrix.needsUpdate = true));
      for (let i = 0; i < 4; i++) { const pl = plugs[i % 3]; const k = pl.cleared ? Math.max(0, 1 - pl.gone * 1.5) : 1; v.copy(pl.p).add(sv.set(Math.cos(i * 2.1 + t * 0.1) * 9, 1.5, Math.sin(i * 2.1 + t * 0.1) * 9)); v.y = floorAt(v.x, v.z) + 1.5; neu.setMatrixAt(i, m4.compose(v, q.setFromAxisAngle(sv.set(0, 1, 0), i + t * 0.05), sv.set(0.45 * k + 0.001, 0.45 * k + 0.001, 0.45 * k + 0.001))); }
      neu.instanceMatrix.needsUpdate = true;
      sun.intensity = 1.0 + 1.3 * u.lightIn.value;
      (scene.fog as THREE.FogExp2).color.setRGB(0.52 + 0.12 * prog, 0.4 + 0.08 * prog, 0.36 + 0.05 * prog);
      (scene.background as THREE.Color).copy((scene.fog as THREE.FogExp2).color).multiplyScalar(0.5);
      if (health.version !== hVersion) { health.toBytes(hBytes); hTex.needsUpdate = true; hVersion = health.version; }
      keyLightDirView.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
    },
  };
  return stage;
}
export const buildVilli = (r: THREE.WebGPURenderer, t: string, o?: { entrance?: boolean }) => build(r, t, 'A', o);
export const buildColon = (r: THREE.WebGPURenderer, t: string) => build(r, t, 'B');
export const buildCrypt = (r: THREE.WebGPURenderer, t: string) => build(r, t, 'C');

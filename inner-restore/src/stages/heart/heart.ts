// ステージ6「心臓」— 区域A：心内膜とプルキンエ線維／区域B：心筋の並び／区域C：傷あとの迷路 → 病巣の核：渦をまく信号（単位 µm、拍動 ×10 ゆっくり）
// 事実（Docs/REFERENCE/heart.md、実物の写真 img/heart/）：心筋細胞は長さ 約100〜150µm・太さ 約10〜40µm の柱で、ときどき枝分かれして網をつくる（写真①）。
//   表面に細かい横縞（サルコメア 約2µm ごと）、線維を横切る介在板は段のついた道すじ（写真②⑪）。介在板で電気の合図が隣へ渡る。
//   心内膜の下をプルキンエ線維（心筋より太く淡い）が走り、合図を心室じゅうへ速く配る。生きた心筋は濃い赤褐色でつやがある（写真⑥⑦。死後の標本）。
//   線維化：心筋の束のあいだを、細胞の少ないコラーゲンの帯が埋め、心筋が島に分かれる（写真④）。古い梗塞では細い心筋の帯が波打ちながら残り（写真⑤）、
//   合図はジグザグに遅れて伝わる（1.4mm で 45ms 遅れる、de Bakker 1993）。傷あとのまわりを合図が回り続けると、速く乱れた拍（リエントリー）になる。
// 作り事：本物の傷あとは消えない。伝導の波は、見えるよう実物（秒速 0.5〜4m）よりずっとゆっくり描く。
import * as THREE from 'three/webgpu';
import { organic } from '../../core/realism';
import { tsl, type N } from '../../core/tsl';
import { loadGLB, makeEnvironment } from '../../core/assets';
import { HealthField } from '../../core/health';
import type { ZoneStage, ZoneMeta, Plug } from '../zone';
import { keyLightDirView } from '../../materials/cell';
import tuning from '../../data/tuning.json';

const { uniform, texture, positionWorld, vec2, float, color, mix, exp, length, smoothstep, sin, pow, saturate, dot, normalView, positionViewDirection, instancedDynamicBufferAttribute, step, abs, fract, floor, atan, PI } = tsl;
const BEAT_T = 60 / 70 * 10;   // 心拍 約70回/分を ×10 ゆっくり → 約8.6秒ごと（病のあいだは乱れる）
const common = { perception: 10, patient: 'rhythm' as const };
export const ENDO_META: ZoneMeta = { ...common, id: 'endo', hud: '心室・内膜　合図の道の回復', plugName: '途切れた合図の道', swimCeil: 30, scaleNote: '潜行士の身長 2µm ／ プルキンエ線維の太さ 約25µm',
  enter: 'こちらオペレーター。血管を通って、心臓の左心室に入りました。内側の壁、心内膜に降ります。',
  arrive: 'こちらオペレーター。左心室の内側の壁です。床の下を太く淡い線のように走るのが、プルキンエ線維。心臓の打つ合図を、心室じゅうへ速く配る道です。合図がところどころで途切れています。途切れた所に光を当てて、道をつないでください。',
  plugHit: '合図が途切れている所です。光を当て続けると、プルキンエ線維が合図を先へ渡せるようになります。',
  plugCleared: (l) => (l ? `合図の道が一本つながりました。残りは ${l} か所です。` : 'すべての合図の道がつながりました。打つたびに、光の波が心室じゅうへ広がります。'),
  done: '合図の道がつながりました。心室の壁が、そろって縮みはじめます。', doneTitle: '合図の道がつながりました', causeMain: 'プルキンエ線維の合図の途切れ',
  plugDiag: { short: '途切れた合図の道', cause: 'プルキンエ線維が傷み、合図が先へ渡りません。光を当て続けて、道をつないでください' } };
export const MYO_META: ZoneMeta = { ...common, id: 'myo', hud: '心筋・線維　そろった収縮の回復', plugName: '線維化', swimCeil: 22, scaleNote: '潜行士の身長 2µm ／ サルコメア 約2µm ／ 心筋細胞の太さ 約16µm',
  arrive: 'こちらオペレーター。心筋の中、筋の層のすき間です。足もとの太い柱一本一本が、心筋細胞。細かい横縞はサルコメアで、ちょうど潜行士の身長くらいの間隔です。白っぽい糸の束は、コラーゲンがたまった線維化。合図をさえぎっています。',
  plugHit: '線維化です。光を当て続けると、コラーゲンの束がほどけ、合図が通るようになります（本物の傷あとは消えません）。',
  plugCleared: (l) => (l ? `線維化が一つほどけ、合図が通りました。残りは ${l} か所です。` : 'すべての線維化がほどけました。合図の波が、心筋をそろって縮ませます。'),
  done: '心筋がそろって縮むようになりました。横縞が、打つたびにいっせいに縮みます。', doneTitle: 'そろった収縮が戻りました', causeMain: 'コラーゲンがたまった線維化',
  plugDiag: { short: '線維化（コラーゲンの束）', cause: '心筋のあいだにコラーゲンがたまり、合図が通りません。光を当て続けて、ほどいてください' } };
export const SCAR_META: ZoneMeta = { ...common, id: 'scar', hud: '心筋・傷あと　規則正しい拍の回復', plugName: '渦の通り道', swimCeil: 26, scaleNote: '潜行士の身長 2µm ／ 生き残った心筋の帯 約5µm',
  arrive: 'こちらオペレーター。昔の傷あとの中です。コラーゲンの原の中に、細い心筋の帯が波打ちながら残っています。中央の傷あとのまわりを、合図がぐるぐる回り続けて、余計な拍を作っています。渦の通り道に光を当てて、止めてください。',
  plugHit: '渦の通り道です。手当てを始めると、余計な拍のたびに乱れの波が来ます。まわりを守りながら、光を当て続けてください。',
  plugCleared: (l) => (l ? `渦の通り道が一つ整いました。残りは ${l} か所です。` : '渦が止まりました。合図は、洞結節からの規則正しい拍だけになります。'),
  done: '渦が止まり、心臓が規則正しく打ちはじめました。', doneTitle: '規則正しい拍が戻りました', causeMain: '傷あとのまわりを回る合図（リエントリー）',
  plugDiag: { short: '渦の通り道（遅く伝わる所）', cause: '傷あとの中で合図がジグザグに遅れて伝わり、回り続けています。光を当て続けて整えてください（手当てを始めると、余計な拍のたびに乱れの波が来ます）' } };

async function build(renderer: THREE.WebGPURenderer, tier: string, variant: 'A' | 'B' | 'C', opts: { entrance?: boolean } = {}): Promise<ZoneStage> {
  const M = variant === 'A' ? ENDO_META : variant === 'B' ? MYO_META : SCAR_META;
  const W = 140, D = 90, rich = tier === 'pc-high', vr = tier === 'vr';
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png'); noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.colorSpace = THREE.NoColorSpace;
  const [hg, rg] = await Promise.all([loadGLB('/static/models/heart.glb'), loadGLB('/static/models/rbc.glb')]);
  const geos: Record<string, THREE.BufferGeometry> = {};
  for (const g of [hg, rg]) g.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.updateWorldMatrix(true, false); geos[m.name] = m.geometry.clone().applyMatrix4(m.matrixWorld); } });
  const scene = new THREE.Scene();
  // 心室の中（A）は血の赤い霧、心筋の中（B・C）は組織のすき間の、暗く温かい色
  const fogC = variant === 'A' ? new THREE.Color(0.55, 0.2, 0.2) : new THREE.Color(0.32, 0.12, 0.11);
  scene.background = fogC.clone().multiplyScalar(0.5); scene.fog = new THREE.FogExp2(fogC.getHex(), variant === 'A' ? 0.0075 : 0.009);
  scene.environment = makeEnvironment(renderer, new THREE.Color(0.95, 0.5, 0.45)); scene.environmentIntensity = 0.45;
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
  const waveX = uniform(-999), contract = uniform(0), loopAng = uniform(0), loopOn = uniform(variant === 'C' ? 1 : 0);
  const dC = length(positionWorld.xz.sub(vec2(core.x, core.z)));
  const waveRing = exp(dC.sub(waveR).div(3).pow(2).negate()).mul(waveOn);
  const bootRing = exp(dC.sub(bootR).div(6).pow(2).negate()).mul(smoothstep(-1, 0, bootR));
  const fres = pow(float(1).sub(saturate(dot(normalView, positionViewDirection).abs())), float(2.5));
  const scanCol = mix(color(0xffa040), color(0x5fe8d0), H);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3(), eu = new THREE.Euler();
  let sd = 23; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  // 伝導の波の光：波の先（waveX）のあたりが光る。その線維の「合図が止まる所」（blockX）より先には進まない
  const sigGlow = (blockAttr: THREE.InstancedBufferAttribute): N => exp(positionWorld.x.sub(waveX).div(5).pow(2).negate()).mul(step(positionWorld.x, instancedDynamicBufferAttribute(blockAttr)));
  // サルコメアの横縞（約2µm ごと。縮むと間隔が詰まる）と、段のついた介在板（約100µm ごと）
  const sarc = float(2.0).mul(float(1).sub(contract.mul(0.09)));
  const stripes = pow(sin(positionWorld.x.div(sarc).mul(PI.mul(2))).mul(0.5).add(0.5), float(3));
  const discOff = floor(positionWorld.y.mul(0.35)).mul(2.6).add(floor(positionWorld.z.div(22)).mul(37.0));   // 高さで段がつく → 階段状の道すじ
  const disc = smoothstep(0.985, 1.0, fract(positionWorld.x.add(discOff).div(100))).add(smoothstep(0.015, 0.0, fract(positionWorld.x.add(discOff).div(100))));
  const myoMat = (sickTint: boolean, blockAttr: THREE.InstancedBufferAttribute, dim = 1) => {
    const mm = new THREE.MeshPhysicalNodeMaterial();
    const base = mix(color(0x5a2420), color(0x8e3428), sickTint ? H : float(1));   // 生きた心筋：濃い赤褐色（病は暗く灰色がかる）
    mm.colorNode = base.mul(float(1).sub(stripes.mul(0.16))).mul(mix(float(1), float(1.35), disc)).mul(texture(noiseTex, positionWorld.xz.mul(1 / 7)).g.mul(0.12).add(0.9)).mul(dim);
    mm.roughnessNode = float(0.38); mm.clearcoatNode = float(0.45); mm.clearcoatRoughnessNode = float(0.25);
    mm.emissiveNode = color(0xff9a5a).mul(sigGlow(blockAttr).mul(0.9)).add(color(0xffe0b0).mul(disc.mul(sigGlow(blockAttr)).mul(1.2))).add(color(0xfff0e0).mul(bootRing.mul(0.5))).add(scanCol.mul(u.scan.mul(0.1))).add(color(0xffc0a8).mul(fres.mul(0.07)));
    organic(mm, noiseTex, { scale: 1.4, bump: 0.5, sss: 0xff5a3a, sssAmt: 0.45, planar: 'tri' });   // 筋の膜の細かな起伏。縁は血の色に透ける
    return mm;
  };
  const blockArr = (n: number) => { const a = new THREE.InstancedBufferAttribute(new Float32Array(n).fill(1e4), 1); a.setUsage(THREE.DynamicDrawUsage); return a; };
  const instanced = (geo: THREE.BufferGeometry, mat: THREE.Material, n: number) => { const im = new THREE.InstancedMesh(geo, mat, n); im.frustumCulled = false; scene.add(im); return im; };

  // ---- 塊（区域ごと）----
  const loopR = 30;
  const plugPos: [number, number][] = variant === 'A' ? [[-30, -24], [12, 4], [40, 28]] : variant === 'B' ? [[-34, -22], [8, 22], [38, -6]] : [0, 2.1, 4.2].map((a) => [Math.cos(a) * loopR, Math.sin(a) * loopR]);
  const pkLines = [-24, 4, 28];
  const pkZ = (line: number, x: number) => pkLines[line] + 4 * Math.sin(x / 30 + line * 1.7);
  const plugs: (Plug & { gone: number; shake: number })[] = plugPos.map(([x, z], i) => ({ p: new THREE.Vector3(x, 0, variant === 'A' ? pkZ(i, x) : z), hp: 1, cleared: false, gone: 0, shake: 0 }));
  // ---- 区域B：心筋の柱の並び（流れの向き＝x、22µm おき） ----
  const ROW = 22, rows: number[] = []; for (let z = -D * 0.62; z < D * 0.62; z += ROW) rows.push(z);
  const floorAt = (x: number, z: number) => {
    if (variant === 'A') { let h = 0; for (let l = 0; l < 3; l++) { const dz = (z - pkZ(l, x)) / 12.5; if (Math.abs(dz) < 1) h = Math.max(h, 3.2 * Math.sqrt(1 - dz * dz)); } return h; }
    if (variant === 'B') { let best = 1e9; for (const r of rows) best = Math.min(best, Math.abs(z - r)); const dz = best / 8; return Math.max(1.5, dz < 1 ? 6.4 * Math.sqrt(1 - dz * dz) : 0); }
    return 8 * Math.exp(-(x * x + z * z) / (16 * 16)) * (1 - 0.6 * (plugs.filter((p) => p.cleared).length / 3));   // 区域C：中央の傷あとの丘
  };

  // 床（Aは心内膜、Cはコラーゲンの原、Bは柱のすき間の暗い底）
  const fm = new THREE.MeshPhysicalNodeMaterial();
  if (variant === 'A') {
    // 心内膜：薄い膜ごしに心筋の赤褐色が透け、表面は濡れたつや（写真⑦）。内皮細胞は流れの向きに細長く、核の所が少しふくらむ（写真⑨の形）
    const cells = texture(noiseTex, vec2(positionWorld.x.mul(1 / 40), positionWorld.z.mul(1 / 12))).r;
    const border = smoothstep(0.55, 0.98, cells).mul(0.5);
    fm.colorNode = mix(color(0x8e4a42), color(0xc4806e), H).mul(mix(float(1), float(0.86), border)).mul(texture(noiseTex, positionWorld.xz.mul(1 / 3)).g.mul(0.08).add(0.94));
    fm.roughnessNode = mix(float(0.5), float(0.16), H); fm.clearcoatNode = H.mul(0.7).add(0.2); fm.clearcoatRoughnessNode = float(0.1);
  } else if (variant === 'C') {
    // コラーゲンの原：淡い、細胞の少ない、波打つ線維（写真⑤。生きた色は確かめられないので、淡い桃色がかった白で）
    // 線維の向きはゆるくうねり、細い筋が密に並ぶ（規則的な模様にならないよう、ゆがめた雑音から作る）
    const warp = texture(noiseTex, positionWorld.xz.mul(1 / 45)).r.mul(10);
    const fib = texture(noiseTex, vec2(positionWorld.x.add(warp).mul(1 / 3.0), positionWorld.z.mul(1 / 8))).r;
    const fib2 = texture(noiseTex, positionWorld.xz.mul(1 / 14)).b;
    fm.colorNode = mix(color(0xa88078), color(0xe6cec2), fib.mul(0.55).add(fib2.mul(0.45))).mul(mix(float(0.8), float(1), H));
    fm.roughnessNode = float(0.42); fm.clearcoatNode = float(0.35); fm.clearcoatRoughnessNode = float(0.3);
  } else { fm.colorNode = color(0x3a1612); fm.roughnessNode = float(0.6); }
  fm.emissiveNode = color(0xb83a2a).mul(sick.mul(0.1)).add(color(0xff7a40).mul(waveRing.mul(0.5))).add(color(0xfff0e0).mul(bootRing.mul(0.6))).add(scanCol.mul(u.scan.mul(0.12))).add(color(0xffd0c8).mul(fres.mul(0.05)));
  const fg = new THREE.PlaneGeometry(W * 1.3, D * 1.3, 130, 84); fg.rotateX(-Math.PI / 2);
  if (variant !== 'B') organic(fm, noiseTex, { scale: variant === 'A' ? 3 : 1.6, bump: variant === 'A' ? 0.5 : 0.9, sss: 0xff8a6a, sssAmt: 0.25 });   // 膜の細かな起伏と、光の透け
  const floor0 = new THREE.Mesh(fg, fm); floor0.position.y = variant === 'B' ? -6 : 0; scene.add(floor0);
  const reshape = () => { if (variant !== 'C') return; const pa = fg.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pa.count; i++) pa.setY(i, floorAt(pa.getX(i), pa.getZ(i))); pa.needsUpdate = true; fg.computeVertexNormals(); };
  reshape();

  // ---- 区域A：プルキンエ線維（太く淡い細胞が介在板でつながって列になる）----
  type Inst = { x: number; y: number; z: number; yaw: number; sx: number; sy: number; sz: number; line?: number; plug?: number };
  const pkInst: Inst[] = [];
  let pkM: THREE.InstancedMesh | null = null, pkBlock: THREE.InstancedBufferAttribute | null = null;
  if (variant === 'A') {
    for (let l = 0; l < 3; l++) for (let x = -W * 0.65; x < W * 0.65; x += 118) { const xc = x + 59; const yaw = -Math.atan2(pkZ(l, xc + 5) - pkZ(l, xc - 5), 10); pkInst.push({ x: xc, y: -1.8, z: pkZ(l, xc), yaw, sx: 0.8, sy: 0.4, sz: 0.8, line: l }); }
    pkBlock = blockArr(pkInst.length);
    const pm = new THREE.MeshPhysicalNodeMaterial(); const g = sigGlow(pkBlock);
    // 心内膜に覆われた、淡い（筋の線維が少ない）細胞の列：床と同じ濡れた膜の下に、太い畝として透ける。病の所は暗く、くすむ
    const pcells = texture(noiseTex, vec2(positionWorld.x.mul(1 / 40), positionWorld.z.mul(1 / 12))).r;
    pm.colorNode = mix(color(0x9a5a50), color(0xdcab98), H).mul(mix(float(1), float(0.88), smoothstep(0.55, 0.98, pcells).mul(0.5)));
    pm.roughnessNode = mix(float(0.45), float(0.15), H); pm.clearcoatNode = float(0.75); pm.clearcoatRoughnessNode = float(0.1);
    pm.emissiveNode = color(0xffc070).mul(g.mul(1.6)).add(color(0xfff0e0).mul(bootRing.mul(0.6))).add(scanCol.mul(u.scan.mul(0.1))).add(color(0xffe0d0).mul(fres.mul(0.1)));
    const geo = geos.purkinje.clone(); geo.setAttribute('blockX', pkBlock);
    pkM = instanced(geo, pm, pkInst.length);
    pkInst.forEach((p, i) => pkM!.setMatrixAt(i, m4.compose(v.set(p.x, p.y, p.z), q.setFromEuler(eu.set(0, p.yaw, 0)), sv.set(p.sx, p.sy, p.sz))));
  }
  // 途切れの印（A）：腫れて暗い細胞のかたまり
  let breakM: THREE.InstancedMesh | null = null;
  if (variant === 'A') {
    const bm = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); bm.colorNode = color(0x4a2a2a); bm.roughnessNode = float(0.6); bm.opacityNode = float(0.9); bm.emissiveNode = color(0xff5030).mul(sin(u.time.mul(3)).mul(0.08).add(0.12));
    breakM = instanced(geos.sa_cell, bm, plugs.length * 4);
  }

  // ---- 区域B・C：心筋線維 ----
  const fibers: Inst[] = [];
  if (variant === 'B') {
    for (const r of rows) for (let x = -W * 0.7 + (rows.indexOf(r) % 2) * 50; x < W * 0.75; x += 124) {
      fibers.push({ x, y: 0, z: r, yaw: 0, sx: 1, sy: 1, sz: 1 });
      fibers.push({ x: x + 30, y: 36, z: r + 11, yaw: 0, sx: 1, sy: 1, sz: 1 });   // 上の層（筋の層のすき間の天井）
    }
  }
  if (variant === 'C') {   // 生き残った細い心筋の帯：ばらばらの向きに波打つ（写真⑤）
    for (let i = 0; i < 44; i++) { const a = rnd() * Math.PI; const x = (rnd() - 0.5) * W * 1.1, z = (rnd() - 0.5) * D * 1.1; if (Math.hypot(x, z) < loopR + 10) continue; fibers.push({ x, y: 1.4 + floorAt(x, z), z, yaw: a, sx: 0.5 + rnd() * 0.35, sy: 0.24, sz: 0.24 }); }
  }
  let fibM: THREE.InstancedMesh | null = null, fibYM: THREE.InstancedMesh | null = null, fibBlock: THREE.InstancedBufferAttribute | null = null;
  const fibY: Inst[] = [];
  if (variant === 'B') for (let k = 0; k < rows.length - 1; k += 2) fibY.push({ x: -10 + k * 9, y: 0, z: rows[k + 1], yaw: 0, sx: 1, sy: 1, sz: 1 });   // 枝分かれして隣の列とつながる
  let fibYBlock: THREE.InstancedBufferAttribute | null = null;
  if (fibers.length) {
    fibBlock = blockArr(fibers.length);
    const geo = geos.myofiber.clone(); geo.setAttribute('blockX', fibBlock);
    fibM = instanced(geo, myoMat(true, fibBlock), fibers.length);
  }
  if (fibY.length) { fibYBlock = blockArr(fibY.length); const geo = geos.myofiber_y.clone(); geo.setAttribute('blockX', fibYBlock); fibYM = instanced(geo, myoMat(true, fibYBlock), fibY.length); }
  // 毛細血管（B）：柱のすき間を同じ向きに走る、赤血球の透ける細い管
  let capM: THREE.InstancedMesh | null = null; const caps: Inst[] = [];
  if (variant === 'B') {
    for (let k = 0; k < rows.length - 1; k++) for (let x = -W * 0.6 + (k % 2) * 40; x < W * 0.7; x += 126) caps.push({ x, y: -1.5, z: (rows[k] + rows[k + 1]) / 2, yaw: 0, sx: 1, sy: 1, sz: 1 });
    const cm = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); cm.colorNode = color(0xb04a44); cm.roughnessNode = float(0.25); cm.opacityNode = float(0.55).add(fres.mul(0.35)); cm.clearcoatNode = float(0.7);
    capM = instanced(geos.capillary, cm, caps.length);
    caps.forEach((c, i) => capM!.setMatrixAt(i, m4.compose(v.set(c.x, c.y, c.z), q.identity(), sv.set(1, 1, 1))));
  }
  // 区域C：傷あとのまわりを回る渦の帯（中央の丘を囲む、細い心筋の輪）
  let loopM: THREE.InstancedMesh | null = null; const NL = 14;
  if (variant === 'C') {
    const lm = new THREE.MeshPhysicalNodeMaterial();
    const ang = atan(positionWorld.z.sub(core.z), positionWorld.x.sub(core.x));
    const da = abs(fract(ang.sub(loopAng).div(PI.mul(2)).add(0.5)).sub(0.5)).mul(PI.mul(2));
    lm.colorNode = color(0x7a3026).mul(float(1).sub(pow(sin(positionWorld.x.add(positionWorld.z).div(2.0).mul(PI)).mul(0.5).add(0.5), float(3)).mul(0.12)));
    lm.roughnessNode = float(0.4); lm.clearcoatNode = float(0.4);
    lm.emissiveNode = color(0xff6a3a).mul(exp(da.div(0.5).pow(2).negate()).mul(loopOn).mul(1.6)).add(color(0xfff0e0).mul(bootRing.mul(0.5)));
    loopM = instanced(geos.myofiber, lm, NL);
    for (let i = 0; i < NL; i++) { const a = i / NL * Math.PI * 2; loopM.setMatrixAt(i, m4.compose(v.set(Math.cos(a) * loopR, 2.0, Math.sin(a) * loopR), q.setFromEuler(eu.set(0, -a - Math.PI / 2, 0)), sv.set(0.12, 0.34, 0.34))); }
  }
  // ---- 線維化（B・C）：コラーゲンの束と線維芽細胞 ----
  const colls: (Inst & { plug: number })[] = [], fbs: (Inst & { plug: number })[] = [];
  let collM: THREE.InstancedMesh | null = null, fbM: THREE.InstancedMesh | null = null;
  if (variant === 'B' || variant === 'C') {
    plugs.forEach((pl, i) => {
      // 線維化の束は、心筋の柱のすき間と上を、柱とほぼ同じ向きに埋める（写真④：束のあいだの帯）
      for (let k = 0; k < (variant === 'B' ? 6 : 5); k++) { const z = variant === 'B' ? rows.reduce((a, r) => (Math.abs(r - pl.p.z) < Math.abs(a - pl.p.z) ? r : a), rows[0]) + (k % 3 - 1) * ROW / 2 : pl.p.z + (rnd() - 0.5) * 22;
        colls.push({ x: pl.p.x + (rnd() - 0.5) * 16, y: variant === 'B' ? (k % 3 === 1 ? 5.5 : 1.5) : 2 + rnd() * 2, z, yaw: variant === 'B' ? (rnd() - 0.5) * 0.5 : rnd() * Math.PI, sx: 0.45 + rnd() * 0.3, sy: 0.8, sz: 0.6, plug: i }); }
      for (let k = 0; k < 2; k++) fbs.push({ x: pl.p.x + (rnd() - 0.5) * 18, y: (variant === 'B' ? 8 : 3), z: pl.p.z + (rnd() - 0.5) * 18, yaw: rnd() * 6.28, sx: 1, sy: 1, sz: 1, plug: i });
    });
    if (variant === 'C') for (let k = 0; k < (vr ? 14 : 24); k++) { const x = (rnd() - 0.5) * W * 1.2, z = (rnd() - 0.5) * D * 1.2; colls.push({ x, y: 1 + floorAt(x, z), z, yaw: rnd() * Math.PI, sx: 0.6 + rnd() * 0.5, sy: 1.4, sz: 1, plug: -1 }); }
    const clm = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); clm.colorNode = color(0xf0e4da); clm.roughnessNode = float(0.35); clm.opacityNode = float(0.82).add(fres.mul(0.15)); clm.clearcoatNode = float(0.5);
    collM = instanced(rich ? geos.collagen : geos.collagen_lo ?? geos.collagen, clm, colls.length);
    const fbm = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); fbm.colorNode = color(0xe8d4c8); fbm.roughnessNode = float(0.4); fbm.opacityNode = float(0.8);
    fbM = instanced(geos.fibroblast, fbm, fbs.length);
  }
  // ---- 区域A：遠くにそびえる腱索の根元、頭の上を流れる赤血球 ----
  if (variant === 'A') {
    const chm = new THREE.MeshPhysicalNodeMaterial(); chm.colorNode = color(0xe8d8c4); chm.roughnessNode = float(0.3); chm.clearcoatNode = float(0.6);
    const ch = new THREE.Mesh(geos.chorda, chm); ch.position.set(W * 0.5 + 140, -30, -40); ch.scale.setScalar(3.5); scene.add(ch);
    const ch2 = new THREE.Mesh(geos.chorda, chm); ch2.position.set(-W * 0.5 - 170, -30, 70); ch2.scale.setScalar(2.6); ch2.rotation.y = 2; scene.add(ch2);
  }
  const rbcGeo = geos.rbc_lod1 ?? geos.rbc_lod0;
  const NR = variant === 'A' ? (vr ? 50 : rich ? 150 : 90) : 0;
  const flow = Array.from({ length: NR }, () => ({ x: (rnd() - 0.5) * W * 1.3, y: 14 + rnd() * 40, z: (rnd() - 0.5) * D * 1.2, r: rnd() * 6.28, s: 0.7 + rnd() * 0.5 }));
  const frm = new THREE.MeshPhysicalNodeMaterial(); frm.colorNode = color(0xa8182a); frm.roughnessNode = float(0.5);
  const fr = NR ? instanced(rbcGeo, frm, NR) : null;

  const capAround = (x: number, z: number) => { let cap = 1; for (const pl of plugs) if (!pl.cleared) { const d = Math.hypot(x - pl.p.x, z - pl.p.z); if (d < 18) cap = Math.min(cap, 0.3 + 0.7 * Math.max(0, (d - 9) / 9)); } return cap; };
  health.setFn((x, z) => { let k = 0; for (const p of plugs) k = Math.max(k, Math.exp(-((x - p.p.x) ** 2 + (z - p.p.z) ** 2) / 700)); return 0.24 - 0.18 * k + 0.04 * Math.sin(x * 0.05) * Math.cos(z * 0.06); });
  const startMean = health.mean();
  const plugsLeft = () => plugs.filter((p) => !p.cleared).length;
  const progress = () => Math.min(plugsLeft() ? 0.9 : 1, Math.max(0, (health.mean() - startMean) / (hc.doneAt - startMean)));
  const sun = new THREE.DirectionalLight(0xfff0ea, 1.3); sun.position.set(-30, 100, 30); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xffd8d0, 0x7a2420, 0.9); scene.add(hemi);
  let onPlug: (i: number, kind: 'hit' | 'cleared' | 'pulse') => void = () => {};
  let fight = false, flowS = 0, booted = false;
  // ---- 拍のリズム：病のあいだは間隔が乱れ、ときどき早すぎる余計な拍が入る。治るほど規則正しく ----
  let lastBeat = -99, nextBeat = 1.2, extraNow = false;
  const beatP = (t: number) => Math.min(1, (t - lastBeat) / BEAT_T);
  const contractAt = (t: number) => { const b = (t - lastBeat) / BEAT_T; return b > 0.12 && b < 0.6 ? Math.sin((b - 0.12) / 0.48 * Math.PI) : 0; };
  // 合図が止まる所（その線維の、まだ治っていない塊の手前）
  const setBlocks = () => {
    if (pkBlock) { pkInst.forEach((p, i) => { let bx = 1e4; plugs.forEach((pl, j) => { if (!pl.cleared && j === p.line && pl.p.x < bx) bx = pl.p.x; }); pkBlock!.setX(i, bx); }); pkBlock.needsUpdate = true; }
    const blk = (f: Inst) => { let bx = 1e4; for (const pl of plugs) if (!pl.cleared && Math.abs(pl.p.z - f.z) < 16 && pl.p.x < bx) bx = pl.p.x - 6; return variant === 'C' ? 1e4 : bx; };
    if (fibBlock) { fibers.forEach((f, i) => fibBlock!.setX(i, blk(f))); fibBlock.needsUpdate = true; }
    if (fibYBlock) { fibY.forEach((f, i) => fibYBlock!.setX(i, blk(f))); fibYBlock.needsUpdate = true; }
  };
  setBlocks();
  const stage: ZoneStage = {
    meta: M, scene, health, size: [W, D], u, sun, plugs, progress, floorHeight: floorAt,
    start: { pos: new THREE.Vector3(-W / 2 + 10, opts.entrance ? 5 : floorAt(-W / 2 + 10, variant === 'B' ? rows[2] : 0), variant === 'B' ? rows[2] : variant === 'A' ? -10 : 0), yaw: Math.PI / 2, swimming: !!opts.entrance },
    causeAt: (x, z) => (health.sample(x, z) < 0.3 ? { short: variant === 'A' ? '合図の弱まり' : '血のめぐりの不足', cause: variant === 'A' ? '合図がうまく届かず、壁がそろって縮めません' : '血のめぐりが足りず、心筋が弱っています' } : { short: 'リズムの乱れ', cause: '合図のずれで、縮むタイミングがそろっていません' }),
    setOnPlug(f) { onPlug = f; },
    encounters(pos, t, walked) {
      const out: { id: string; at: THREE.Vector3 | null }[] = [];
      if (variant === 'A') { if (t > 3) out.push({ id: 'purkinje_fiber', at: null }); if (walked > 10) out.push({ id: 'endothelial', at: null }); if (walked > 18) out.push({ id: 'chordae_tendineae', at: null }); if (walked > 26) out.push({ id: 'sa_node_cell', at: null }); if (walked > 34) out.push({ id: 'rbc', at: null }); }
      if (variant === 'B') { if (t > 3) out.push({ id: 'cardiomyocyte', at: null }); if (walked > 8) out.push({ id: 'sarcomere', at: null }); if (walked > 16) out.push({ id: 'intercalated_disc', at: null }); if (walked > 26) out.push({ id: 'mitochondrion', at: null });
        for (const pl of plugs) if (!pl.cleared && pl.p.distanceTo(pos) < 24) { out.push({ id: 'collagen_scar', at: pl.p.clone().setY(8) }); out.push({ id: 'cardiac_fibroblast', at: pl.p.clone().setY(9) }); } }
      if (variant === 'C') { if (t > 3) out.push({ id: 'collagen_scar', at: null }); if (walked > 10) out.push({ id: 'cardiac_fibroblast', at: null }); }
      return out;
    },
    heal(x, z, dt) {
      plugs.forEach((pl, i) => {
        if (pl.cleared || Math.hypot(x - pl.p.x, z - pl.p.z) > 9) return;
        if (pl.hp === 1) { onPlug(i, 'hit'); if (variant === 'C') fight = true; }
        pl.hp = Math.max(0, pl.hp - dt / 3.8); pl.shake = 1;
        if (pl.hp <= 0) { pl.cleared = true; onPlug(i, 'cleared'); health.heal(pl.p.x, pl.p.z, 18, 0.35); setBlocks(); reshape(); }
      });
      const got = health.heal(x, z, tuning.beam.radius, tuning.beam.rate * dt); health.clampFn(capAround); return got;
    },
    beat: () => beatP(u.time.value),
    // 心筋が縮むたびに、足もとが線維の向きに少し引き寄せられる
    drift: (p: THREE.Vector3) => { const c = contractAt(u.time.value); return variant === 'A' ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(-Math.sign(p.x) * 1.4 * c, 0, 0); },
    flowing: () => flowS,
    update(dt, t, camera) {
      u.time.value = t;
      const prog = progress(), irr = Math.max(0, 1 - prog);
      if (t >= nextBeat) {
        lastBeat = t; extraNow = irr > 0.15 && rnd() < 0.3 * irr;
        nextBeat = t + (extraNow ? BEAT_T * 0.45 : BEAT_T * (1 + (rnd() - 0.5) * 0.5 * irr));
        if (fight && plugsLeft()) { waveR.value = 0; waveOn.value = 1; onPlug(-1, 'pulse'); }
      }
      u.heartPhase.value = beatP(t) * Math.PI * 2;
      waveX.value = -W * 0.7 + (t - lastBeat) * 70;   // 伝導の波（見えるようゆっくり）
      contract.value = contractAt(t);
      health.spread(dt, hc.regrow); health.clampFn(capAround);
      for (const pl of plugs) { pl.shake = Math.max(0, pl.shake - dt * 3); if (pl.cleared && pl.gone < 1) pl.gone = Math.min(1, pl.gone + dt * 0.5); }
      if (waveOn.value > 0 && fight && plugsLeft()) {
        waveR.value += dt * 12; waveOn.value = Math.max(0, 1 - waveR.value / 36); const Rr = waveR.value, amt = dt * 0.5 * plugsLeft() / 3;
        for (let j = 0; j < health.h; j++) for (let i = 0; i < health.w; i++) { const x = (i / (health.w - 1) - 0.5) * W, z = (j / (health.h - 1) - 0.5) * D; if (Math.abs(Math.hypot(x - core.x, z - core.z) - Rr) < 3) { const k = j * health.w + i; health.data[k] = Math.max(0.12, health.data[k] - amt); } }
        health.version++;
      } else waveOn.value = Math.max(0, waveOn.value - dt);
      flowS = prog;
      if (!booted && prog >= 1 && variant === 'C') { booted = true; bootR.value = 0; }
      if (booted) bootR.value += dt * 20;
      // 渦（C）：治っていない通り道が残るあいだ、拍よりずっと速く回り続ける
      loopOn.value += ((variant === 'C' ? plugsLeft() / 3 : 0) - loopOn.value) * Math.min(1, dt * 2); loopAng.value = (loopAng.value + dt * 2.4) % (Math.PI * 2);
      u.lightIn.value += ((0.4 + 0.6 * prog) - u.lightIn.value) * Math.min(1, dt * 1.5);
      // 心筋の柱：縮むたびに、線維の向きに短く、少し太くなる
      const c = contract.value;
      if (fibM) { fibers.forEach((f, i) => { v.set(f.x * (1 - 0.04 * c), f.y, f.z); fibM!.setMatrixAt(i, m4.compose(v, q.setFromEuler(eu.set(0, f.yaw, 0)), sv.set(f.sx * (1 - 0.06 * c), f.sy * (1 + 0.03 * c), f.sz * (1 + 0.03 * c)))); }); fibM.instanceMatrix.needsUpdate = true; }
      if (fibYM) { fibY.forEach((f, i) => { v.set(f.x * (1 - 0.04 * c), f.y, f.z); fibYM!.setMatrixAt(i, m4.compose(v, q.identity(), sv.set(1 - 0.06 * c, 1 + 0.03 * c, 1 + 0.03 * c))); }); fibYM.instanceMatrix.needsUpdate = true; }
      if (pkM) pkM.instanceMatrix.needsUpdate = false;
      if (breakM) { plugs.forEach((pl, i) => { const k = 1 - pl.gone; for (let j = 0; j < 4; j++) { v.set(pl.p.x + (j - 1.5) * 3.5 + Math.sin(t * 40) * pl.shake * 0.1, 4 + Math.sin(t + j) * 0.2, pkZ(i, pl.p.x) + (j % 2 - 0.5) * 4); breakM!.setMatrixAt(i * 4 + j, m4.compose(v, q.setFromEuler(eu.set(0, j * 0.8, 0.3)), sv.setScalar(0.35 * k + 0.001))); } }); breakM.instanceMatrix.needsUpdate = true; }
      if (collM) { colls.forEach((cl, i) => { const pl = cl.plug >= 0 ? plugs[cl.plug] : null; const k = pl ? 1 - pl.gone : 1; v.set(cl.x + (pl ? Math.sin(t * 40 + i) * pl.shake * 0.1 + pl.gone * 6 * Math.sin(i) : 0), cl.y + (pl ? pl.gone * 4 : 0), cl.z); collM!.setMatrixAt(i, m4.compose(v, q.setFromEuler(eu.set(0, cl.yaw, Math.sin(t * 0.3 + i) * 0.03)), sv.set(cl.sx * k + 0.001, cl.sy * k + 0.001, cl.sz * k + 0.001))); }); collM.instanceMatrix.needsUpdate = true; }
      if (fbM) { fbs.forEach((f, i) => { const k = 1 - plugs[f.plug].gone; fbM!.setMatrixAt(i, m4.compose(v.set(f.x, f.y, f.z), q.setFromEuler(eu.set(0, f.yaw, 0)), sv.setScalar(0.6 * k + 0.001))); }); fbM.instanceMatrix.needsUpdate = true; }
      if (fr) { flow.forEach((f, i) => { f.x += (6 + 14 * c) * f.s * dt; if (f.x > W * 0.65) f.x -= W * 1.3; f.r += dt * 0.5; fr.setMatrixAt(i, m4.compose(v.set(f.x, f.y, f.z), q.setFromEuler(eu.set(f.r, f.r * 0.7, Math.PI / 2)), sv.setScalar(f.s))); }); fr.instanceMatrix.needsUpdate = true; }
      sun.intensity = 0.9 + 1.2 * u.lightIn.value;
      (scene.fog as THREE.FogExp2).color.copy(fogC).multiplyScalar(0.85 + 0.25 * prog);
      (scene.background as THREE.Color).copy((scene.fog as THREE.FogExp2).color).multiplyScalar(0.5);
      if (health.version !== hVersion) { health.toBytes(hBytes); hTex.needsUpdate = true; hVersion = health.version; }
      keyLightDirView.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
    },
  };
  void caps; void sin;
  return stage;
}
export const buildEndo = (r: THREE.WebGPURenderer, t: string, o?: { entrance?: boolean }) => build(r, t, 'A', o);
export const buildMyo = (r: THREE.WebGPURenderer, t: string) => build(r, t, 'B');
export const buildScar = (r: THREE.WebGPURenderer, t: string) => build(r, t, 'C');

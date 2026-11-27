// ステージ3「肺」— 区域B：肺胞の中／区域C：肺胞の壁（ガス交換）→ 病巣の核：粒子のたまり（単位 µm、知覚加速 ×2）
// 事実（Docs/REFERENCE/lung.md）：肺胞は直径 約200µm、両肺で 約4.8億個。壁は薄い所で 0.2〜0.6µm（I型肺胞上皮細胞が面の 約95% を覆う）。
//   壁の中を毛細血管（太さ 約7µm）が網のように走り、赤血球は 約0.75秒で通り抜けながら酸素を受け取る。
//   II型肺胞上皮細胞（直径 約9〜10µm）がサーファクタント（表面の張力を下げる物質）を出す。肺胞マクロファージ（直径 約21µm）が吸いこんだ粒子を食べる。
//   呼吸で肺胞は長さで 4〜10% ほど伸び縮みする（体積の変化の多くは肺胞道）。
// 遊び：吸う息と吐く息で、空気の流れ（潜行士を運ぶ）と壁の伸び縮み（足もとの地形）が変わる。吐く息のときに光を当てると粒子がはがれやすい。
import * as THREE from 'three/webgpu';
import { organic } from '../../core/realism';
import { tsl, type N } from '../../core/tsl';
import { loadGLB, makeEnvironment } from '../../core/assets';
import { HealthField } from '../../core/health';
import type { ZoneStage, ZoneMeta, Plug } from '../zone';
import { keyLightDirView } from '../../materials/cell';
import tuning from '../../data/tuning.json';

const { uniform, texture, positionWorld, vec2, vec3, float, color, mix, exp, length, smoothstep, sin, pow, saturate, dot, normalView, positionViewDirection, fract } = tsl;
const BREATH = 8;   // 実物 約4秒で1回の呼吸を ×2 ゆっくり
const common = { perception: 2, patient: 'breath' as const, swimCeil: 30 };
export const ALV_META: ZoneMeta = { ...common, id: 'alveolus', hud: '肺・肺胞　ガス交換の回復', scaleNote: '潜行士の身長 2µm ／ 肺胞の直径 約200µm',
  arrive: 'こちらオペレーター。肺胞の中に入りました。ぶどうの房の一粒の中です。壁の向こうを流れる赤い光は、毛細血管の中の赤血球。吸いこんだ粒子が壁に積もり、ガス交換を妨げています。息に合わせて、空気の流れと壁が動きます。',
  plugName: '粒子のたまり', plugHit: '壁に積もった粒子の塊です。吐く息のときに光を当てると、はがれやすくなります。',
  plugCleared: (l) => (l ? `粒子がはがれました。肺胞マクロファージが、残りを片づけに向かいます。残りは ${l} か所です。` : 'すべての粒子のたまりがはがれました。壁が澄み、血が酸素を受け取りはじめます。'),
  done: '肺胞の壁が澄みました。息を吸うたびに、壁の向こうの血が明るい赤に変わります。', doneTitle: 'ガス交換が戻りました', causeMain: '壁に積もった粒子と、サーファクタントの不足',
  plugDiag: { short: '粒子のたまり', cause: '吸いこんだ粒子が壁に積もり、空気と血の間をふさいでいます。光を当て続けてはがしてください（吐く息のときによくはがれます）' } };
export const WALL_META: ZoneMeta = { ...common, id: 'alvwall', hud: '肺・肺胞の壁　呼吸の回復', scaleNote: '潜行士の身長 2µm ／ 毛細血管の太さ 約7µm',
  arrive: 'こちらオペレーター。肺胞の壁のすぐ上です。足もとの薄い膜の下を、毛細血管が走っています。この薄い膜ごしに、空気の酸素が血に移ります。奥に、粒子が深くたまって炎症が続いている所があります。',
  plugName: '炎症の芯', plugHit: '粒子が深くたまった炎症の芯です。手当てを始めると、息のたびに炎症の波が広がります。壁を守りながら、ほどいてください。',
  plugCleared: (l) => (l ? `炎症の芯が一つおさまりました。残りは ${l} か所です。` : 'すべての炎症の芯がおさまりました。'),
  done: '肺胞の壁が、また薄く澄みました。息を吸うと、酸素がまっすぐ血に届きます。', doneTitle: '呼吸が深くなりました', causeMain: '粒子のたまりと炎症',
  plugDiag: { short: '炎症の芯（粒子のたまり）', cause: '粒子が深くたまり、炎症が続いています。光を当て続けておさめてください（手当てを始めると、息のたびに炎症の波が広がります）' } };

async function build(renderer: THREE.WebGPURenderer, tier: string, variant: 'B' | 'C'): Promise<ZoneStage> {
  const room = variant === 'B', M = room ? ALV_META : WALL_META;
  const W = room ? 150 : 120, D = room ? 150 : 80, R = 100;
  const rich = tier === 'pc-high', vr = tier === 'vr';
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png');
  noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.colorSpace = THREE.NoColorSpace;
  const gltf = await loadGLB('/static/models/lung.glb');
  const geos: Record<string, THREE.BufferGeometry> = {};
  gltf.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.updateWorldMatrix(true, false); geos[m.name] = m.geometry.clone().applyMatrix4(m.matrixWorld); } });
  const scene = new THREE.Scene();
  // 肺胞の中：空気で満ちている。壁は薄く、血の赤が透けて、ほのかな桃色の光に包まれる
  scene.background = new THREE.Color(0x3a2426); scene.fog = new THREE.FogExp2(0x9a7470, room ? 0.004 : 0.01);
  scene.environment = makeEnvironment(renderer, new THREE.Color(0.95, 0.65, 0.62)); scene.environmentIntensity = 0.4;
  const hc = tuning.health;
  const health = new HealthField(hc.gridW, Math.round(hc.gridW * D / W), W, D, 0.2);
  const hBytes = new Uint8Array(health.w * health.h);
  const hTex = new THREE.DataTexture(health.toBytes(hBytes), health.w, health.h, THREE.RedFormat, THREE.UnsignedByteType);
  hTex.magFilter = hTex.minFilter = THREE.LinearFilter; hTex.needsUpdate = true; let hVersion = -1;
  const u = { time: uniform(0), scan: uniform(0), lightIn: uniform(0.4), heartPhase: uniform(0), beamPos: uniform(new THREE.Vector3(0, -999, 0)), beamOn: uniform(0), scanR: uniform(0), scanOrigin: uniform(new THREE.Vector3()), scanPulse: uniform(0) };
  const H: N = texture(hTex, vec2(positionWorld.x.div(W).add(0.5).clamp(0, 1), positionWorld.z.div(D).add(0.5).clamp(0, 1))).r;
  const breathU = uniform(0), oxy = uniform(0);   // 呼吸の位相（0〜1）、血の明るさ（酸素を受け取った度合い）
  const core = new THREE.Vector3(room ? 0 : W * 0.25, 0, 0);
  const waveR = uniform(0), waveOn = uniform(0), bootR = uniform(-1);
  const dC = length(positionWorld.xz.sub(vec2(core.x, core.z)));
  const waveRing = exp(dC.sub(waveR).div(3).pow(2).negate()).mul(waveOn);
  const bootRing = exp(dC.sub(bootR).div(6).pow(2).negate()).mul(smoothstep(-1, 0, bootR));
  const fres = pow(float(1).sub(saturate(dot(normalView, positionViewDirection).abs())), float(2.5));
  // ---- 壁：薄い膜の下に毛細血管の網。中を赤血球が流れる（赤い光の筋）。病：灰色に厚く、粒子の影。健康：薄く澄んで、血の赤が透ける ----
  const wallMat = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide });
  const P = room ? positionWorld.mul(0.06) : vec3(positionWorld.x.mul(0.06), positionWorld.z.mul(0.06), 0);
  const cell = texture(noiseTex, vec2(P.x.add(P.z.mul(0.7)), P.y.add(P.z.mul(0.3))).mul(0.55)).r;            // 毛細血管の網（細胞の境目の模様を網として使う）
  const net = smoothstep(0.58, 0.8, cell);
  const flow = fract(cell.mul(6).sub(u.time.mul(0.6))).pow(6);                                                   // 網の中を流れる赤血球の光
  const sick = float(1).sub(H);
  const blood = mix(color(0x7a1a22), color(0xe0303a), oxy.mul(H));
  wallMat.colorNode = mix(mix(color(0xb8a8a4), color(0xf0c8c0), H), blood, net.mul(mix(float(0.25), float(0.75), H)).mul(room ? 1 : 0.3));
  wallMat.roughnessNode = mix(float(0.7), float(0.18), H);
  wallMat.clearcoatNode = H.mul(0.7); wallMat.clearcoatRoughnessNode = float(0.12);   // サーファクタントの薄い液の膜のつや
  wallMat.emissiveNode = blood.mul(net.mul(flow).mul(H).mul(0.45)).add(color(0xffd8d0).mul(fres.mul(0.08)))
    .add(color(0xff7a40).mul(waveRing.mul(0.5))).add(color(0xfff0e0).mul(bootRing.mul(0.6)));
  organic(wallMat, noiseTex, { scale: 2.8, bump: 0.45, sss: 0xffb0a0, sssAmt: 0.3, planar: 'tri' });   // ごく薄い膜の細かなしわと、光の透け
  let wall!: THREE.Mesh;
  if (room) { wall = new THREE.Mesh(geos.alveolus, wallMat); wall.scale.setScalar(R); wall.position.y = R; }
  // 区域C：膜は薄く、下を通る毛細血管の所だけ盛り上がって波打つ（実物の写真：薄い膜が毛細血管にかぶさる）
  const laneZ = Array.from({ length: 6 }, (_, k) => -D / 2 + 8 + k * (D - 16) / 5);
  const memY = (x: number, z: number) => { let y = 0; for (const lz of laneZ) y += 3.0 * Math.exp(-(((z - lz - 0.8 * Math.sin(x * 0.05 + lz)) / 4.6) ** 2)); return y + 0.35 * Math.sin(x * 0.07 + z * 0.05); };
  if (!room) { const g = new THREE.PlaneGeometry(W * 1.3, D * 1.3, 160, 120); g.rotateX(-Math.PI / 2); const pa = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pa.count; i++) pa.setY(i, memY(pa.getX(i), pa.getZ(i))); g.computeVertexNormals(); wall = new THREE.Mesh(g, wallMat); }
  scene.add(wall);
  // 区域C：膜のすぐ下の毛細血管を、本物の管として見せる（足もとの膜ごしに赤血球が流れる）
  const rbcs: { x: number; z: number; v: number; lane: number }[] = [];
  let rbcMesh: THREE.InstancedMesh | null = null;
  if (!room) {
    const tube = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false });
    tube.colorNode = color(0xf0c8c0); tube.opacityNode = float(0.18).add(fres.mul(0.25)); tube.roughnessNode = float(0.2);
    for (let k = 0; k < 6; k++) { const g = new THREE.CylinderGeometry(3.5, 3.5, W * 1.3, 24, 1, true); g.rotateZ(Math.PI / 2); const pa = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pa.count; i++) pa.setZ(i, pa.getZ(i) + 0.8 * Math.sin(pa.getX(i) * 0.05 + laneZ[k])); const t = new THREE.Mesh(g, tube); t.position.set(0, -1.0, laneZ[k]); scene.add(t); }
    const rm = new THREE.MeshPhysicalNodeMaterial(); rm.colorNode = mix(color(0x6a1018), color(0xd0202c), oxy); rm.roughnessNode = float(0.45);
    const rg = new THREE.SphereGeometry(1, 20, 12); rg.scale(1.3, 0.55, 1.3);   // 赤血球（直径 約7.8µm を、細い管の中で少し縮めて）
    const NR = vr ? 40 : 90; rbcMesh = new THREE.InstancedMesh(rg, rm, NR); rbcMesh.frustumCulled = false; scene.add(rbcMesh);
    for (let i = 0; i < NR; i++) rbcs.push({ x: (i / NR) * W * 1.3 - W * 0.65, z: 0, v: 0, lane: i % 6 });
    // 膜（I型肺胞上皮細胞）：ごく薄く透ける
    wallMat.transparent = true; wallMat.opacityNode = mix(float(0.92), float(0.35), H); wallMat.depthWrite = false; wall.renderOrder = 20;
  }
  // ---- II型肺胞上皮細胞（壁に点々と）、肺胞マクロファージ、粒子 ----
  const t2Mat = new THREE.MeshPhysicalNodeMaterial(); t2Mat.colorNode = mix(color(0xc8b0a8), color(0xf2dcd4), H); t2Mat.roughnessNode = float(0.35); t2Mat.clearcoatNode = float(0.4);
  const floorAt = (x: number, z: number) => { if (!room) return memY(x, z); const r2 = x * x + z * z; return R - Math.sqrt(Math.max(0, R * R - r2)); };
  const t2: THREE.Vector3[] = []; let sd = 9; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  for (let i = 0; i < (room ? (vr ? 12 : 26) : 10); i++) { const x = (rnd() - 0.5) * W * 0.85, z = (rnd() - 0.5) * D * 0.85; t2.push(new THREE.Vector3(x, floorAt(x, z) - 1.2, z)); }
  const t2m = new THREE.InstancedMesh(geos.type2, t2Mat, t2.length); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3();
  t2.forEach((p, i) => { const n = room ? new THREE.Vector3(-p.x, R - p.y, -p.z).normalize() : new THREE.Vector3(0, 1, 0); q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n); t2m.setMatrixAt(i, m4.compose(p, q, sv.set(1, 1, 1))); });
  scene.add(t2m);
  const macMat = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); macMat.colorNode = color(0xece0d8); macMat.roughnessNode = float(0.4); macMat.opacityNode = float(0.85); macMat.clearcoatNode = float(0.3);
  const macs = Array.from({ length: room ? 3 : 2 }, () => ({ p: new THREE.Vector3((rnd() - 0.5) * W * 0.6, 0, (rnd() - 0.5) * D * 0.6), ang: rnd() * 6.28, eaten: 0 }));
  { const sx = room ? -26 : -W / 2 + 10, sz = room ? 10 : 0; for (const m of macs) if (Math.hypot(m.p.x - sx, m.p.z - sz) < 34) { m.p.x = sx + 40; m.p.z = sz + (m.p.z > sz ? 24 : -24); } }   // スタート地点とカメラのあいだをふさがないよう、マクロファージを離す
  const macM = new THREE.InstancedMesh(geos.macro, macMat, macs.length); macM.frustumCulled = false; scene.add(macM);
  // 粒子のたまり（3つ）：すすの房と鉱物の粒が積もった塊
  const plugs: (Plug & { gone: number; shake: number })[] = (room ? [[-0.25, -0.15], [0.2, -0.22], [0.05, 0.25]] : [[-0.07, -0.12], [0.08, -0.06], [0.0, 0.14]]).map(([fx, fz]) => { const x = core.x + fx * W, z = core.z + fz * D; return { p: new THREE.Vector3(x, floorAt(x, z), z), hp: 1, cleared: false, gone: 0, shake: 0 }; });
  const sootMat = new THREE.MeshStandardNodeMaterial(); sootMat.colorNode = color(0x2a2624); sootMat.roughnessNode = float(0.8);
  const grMat = new THREE.MeshPhysicalNodeMaterial(); grMat.colorNode = color(0xb8b0a4); grMat.roughnessNode = float(0.4); grMat.clearcoatNode = float(0.5);
  const NPP = vr ? 22 : 40, pp: { o: THREE.Vector3; plug: number; s: number; soot: boolean; r: number }[] = [];
  for (let i = 0; i < NPP * 3; i++) { const pl = plugs[i % 3]; const a = rnd() * 6.28, rr = 5 * Math.sqrt(rnd()); const x = pl.p.x + Math.cos(a) * rr, z = pl.p.z + Math.sin(a) * rr; pp.push({ o: new THREE.Vector3(x, floorAt(x, z) + rnd() * 1.5, z), plug: i % 3, s: 0.8 + rnd() * 1.6, soot: rnd() < 0.6, r: rnd() * 6.28 }); }
  const soot = new THREE.InstancedMesh(geos.soot, sootMat, pp.length), grain = new THREE.InstancedMesh(geos.grain, grMat, pp.length);
  soot.frustumCulled = grain.frustumCulled = false; scene.add(soot, grain);
  // 空気の流れの見える目印（ただよう細かな光の点）
  const NA = vr ? 80 : 200, ap = new Float32Array(NA * 3); for (let i = 0; i < NA; i++) { ap[i * 3] = (rnd() - 0.5) * W; ap[i * 3 + 1] = 2 + rnd() * 40; ap[i * 3 + 2] = (rnd() - 0.5) * D; }
  const ag = new THREE.BufferGeometry(); ag.setAttribute('position', new THREE.BufferAttribute(ap, 3));
  const am = new THREE.PointsNodeMaterial({ transparent: true, depthWrite: false, sizeAttenuation: true }); am.colorNode = color(0xfff4f0); am.opacityNode = float(0.3); am.sizeNode = float(0.12);
  const air = new THREE.Points(ag, am); air.frustumCulled = false; scene.add(air);

  const capAround = (x: number, z: number) => { let cap = 1; for (const pl of plugs) if (!pl.cleared) { const d = Math.hypot(x - pl.p.x, z - pl.p.z); if (d < 18) cap = Math.min(cap, 0.3 + 0.7 * Math.max(0, (d - 9) / 9)); } return cap; };
  health.setFn((x, z) => { let k = 0; for (const p of plugs) k = Math.max(k, Math.exp(-((x - p.p.x) ** 2 + (z - p.p.z) ** 2) / 600)); return 0.24 - 0.18 * k + 0.04 * Math.sin(x * 0.05) * Math.cos(z * 0.06); });
  const startMean = health.mean();
  const plugsLeft = () => plugs.filter((p) => !p.cleared).length;
  const progress = () => Math.min(plugsLeft() ? 0.9 : 1, Math.max(0, (health.mean() - startMean) / (hc.doneAt - startMean)));
  const sun = new THREE.DirectionalLight(0xfff2ea, 1.4); sun.position.set(-20, 120, 30); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xffe8e4, 0xa04a44, 0.9); scene.add(hemi);
  let onPlug: (i: number, kind: 'hit' | 'cleared' | 'pulse') => void = () => {};
  let fight = false, waveT = 0, flowS = 0, booted = false;
  const breath = (t: number) => (t % BREATH) / BREATH;
  const stage: ZoneStage = {
    meta: M, scene, health, size: [W, D], u, sun, plugs, progress, floorHeight: floorAt,
    start: { pos: new THREE.Vector3(room ? -26 : -W / 2 + 10, 0, room ? 10 : 0), yaw: Math.PI / 2, swimming: false },
    causeAt: (x, z) => (Math.hypot(x - core.x, z - core.z) < 30 ? { short: '粒子の積もり', cause: '吸いこんだ粒子が壁に積もり、空気と血の間をふさいでいます' } : { short: 'サーファクタントの不足', cause: '壁の表面の液の膜が足りず、肺胞がふくらみにくくなっています' }),
    setOnPlug(f) { onPlug = f; },
    encounters(pos, t, walked) {
      const out: { id: string; at: THREE.Vector3 | null }[] = [];
      if (t > 3) out.push({ id: room ? 'alveolus' : 'alveolar_capillary', at: null });
      const n2 = t2.find((p) => Math.hypot(p.x - pos.x, p.z - pos.z) < 14); if (n2) out.push({ id: 'type2_pneumocyte', at: n2 });
      if (walked > 12) out.push({ id: 'type1_pneumocyte', at: null });
      if (walked > 22) out.push({ id: 'surfactant', at: null });
      for (const m of macs) if (m.p.distanceTo(pos) < 22) out.push({ id: 'alveolar_macrophage', at: m.p.clone() });
      for (const pl of plugs) if (!pl.cleared && pl.p.distanceTo(pos) < 18) out.push({ id: 'particle_pm', at: pl.p.clone() });
      return out;
    },
    heal(x, z, dt) {
      const exh = breath(u.time.value) > 0.4 ? 2 : 1;   // 吐く息のときに、はがれやすい
      plugs.forEach((pl, i) => {
        if (pl.cleared || Math.hypot(x - pl.p.x, z - pl.p.z) > 7) return;
        if (pl.hp === 1) { onPlug(i, 'hit'); if (!room) { fight = true; waveT = 2; } }
        pl.hp = Math.max(0, pl.hp - dt * exh / 6.5); pl.shake = 1;
        if (pl.hp <= 0) { pl.cleared = true; onPlug(i, 'cleared'); health.heal(pl.p.x, pl.p.z, 16, 0.35); }
      });
      const got = health.heal(x, z, tuning.beam.radius, tuning.beam.rate * dt * exh); health.clampFn(capAround); return got;
    },
    beat: () => { const b = breath(u.time.value); return b < 0.4 ? 0.5 : (b - 0.4) / 0.6; },
    drift(p: THREE.Vector3) {
      // 吸う息：口（区域B は上・区域C は -x）から奥へ。吐く息：戻る。流れは高い所ほど強い
      const b = breath(u.time.value); const k = b < 0.4 ? Math.sin(b / 0.4 * Math.PI) : -0.6 * Math.sin((b - 0.4) / 0.6 * Math.PI);
      if (room) { const out = new THREE.Vector3(p.x, 0, p.z); if (out.lengthSq() < 1) out.set(1, 0, 0); return out.normalize().multiplyScalar(1.6 * k); }
      return new THREE.Vector3(1.8 * k, 0, 0);
    },
    flowing: () => flowS,
    update(dt, t, camera) {
      u.time.value = t; u.heartPhase.value += dt * 1.2;
      const b = breath(t); breathU.value = b;
      health.spread(dt, hc.regrow); health.clampFn(capAround);
      for (const pl of plugs) { pl.shake = Math.max(0, pl.shake - dt * 3); if (pl.cleared) pl.gone = Math.min(1, pl.gone + dt * 0.5); }
      if (fight && plugsLeft()) {
        // 対決：息を吸うたびに（呼吸1回ごとに）、炎症の波が広がる
        waveT -= dt; if (waveT <= 0) { waveT = BREATH; waveR.value = 0; waveOn.value = 1; onPlug(-1, 'pulse'); }
        if (waveOn.value > 0) {
          waveR.value += dt * 12; waveOn.value = Math.max(0, 1 - waveR.value / 36);
          const Rr = waveR.value, amt = dt * 0.5 * plugsLeft() / 3;
          for (let j = 0; j < health.h; j++) for (let i = 0; i < health.w; i++) { const x = (i / (health.w - 1) - 0.5) * W, z = (j / (health.h - 1) - 0.5) * D; if (Math.abs(Math.hypot(x - core.x, z - core.z) - Rr) < 3) { const k = j * health.w + i; health.data[k] = Math.max(0.12, health.data[k] - amt); } }
          health.version++;
        }
      } else waveOn.value = Math.max(0, waveOn.value - dt);
      const prog = progress(); flowS = prog;
      if (!booted && prog >= 1 && !room) { booted = true; bootR.value = 0; }
      if (booted) bootR.value += dt * 20;
      // 呼吸：吸う息で肺胞が少しふくらみ（長さで 約5%）、血が酸素を受け取って明るくなる
      const inh = b < 0.4 ? Math.sin(b / 0.4 * Math.PI / 2) : Math.cos((b - 0.4) / 0.6 * Math.PI / 2);
      if (room) wall.scale.setScalar(R * (1 + 0.05 * inh * (0.4 + 0.6 * prog)));
      oxy.value = (0.3 + 0.7 * prog) * (0.6 + 0.4 * inh);
      u.lightIn.value += ((0.4 + 0.6 * prog) - u.lightIn.value) * Math.min(1, dt * 1.5);
      // マクロファージ：病の間はじっとして、治ると、残った粒子へ向かってゆっくり這い、食べる（実物 約0.5µm/分を見える速さに）
      macs.forEach((m, i) => {
        const target = plugs.find((p) => p.cleared && p.gone < 1) ?? plugs.find((p) => !p.cleared);
        if (target && prog > 0.2) { const d = new THREE.Vector3(target.p.x - m.p.x, 0, target.p.z - m.p.z); if (d.length() > 8) { m.ang = Math.atan2(d.z, d.x); m.p.addScaledVector(d.normalize(), dt * 1.2 * prog); } }
        v.copy(m.p); v.y = floorAt(m.p.x, m.p.z) + 1.5;
        macM.setMatrixAt(i, m4.compose(v, q.setFromAxisAngle(sv.set(0, 1, 0), -m.ang), sv.set(1, 1, 1)));
      });
      macM.instanceMatrix.needsUpdate = true;
      pp.forEach((p, i) => {
        const pl = plugs[p.plug]; const k = 1 - pl.gone; v.copy(p.o); v.x += Math.sin(t * 40 + i) * pl.shake * 0.08;
        if (pl.gone > 0) { const m = macs[p.plug % macs.length]; v.lerp(m.p.clone().setY(floorAt(m.p.x, m.p.z) + 1.5), pl.gone); }   // マクロファージに取りこまれる
        q.setFromEuler(new THREE.Euler(p.r, p.r * 2, 0)); const s = p.s * Math.max(0.001, k * 0.8 + 0.2 * (1 - pl.gone));
        soot.setMatrixAt(i, m4.compose(v, q, p.soot ? sv.set(s * 2.2, s * 2.2, s * 2.2) : sv.set(0, 0, 0)));
        grain.setMatrixAt(i, m4.compose(v, q, p.soot ? sv.set(0, 0, 0) : sv.set(s * 0.8, s * 0.6, s * 0.8)));
      });
      soot.instanceMatrix.needsUpdate = grain.instanceMatrix.needsUpdate = true;
      if (rbcMesh) {
        rbcs.forEach((r, i) => { r.x += dt * (3 + 6 * prog); if (r.x > W * 0.65) r.x -= W * 1.3; v.set(r.x, -1.0, laneZ[r.lane] + 0.8 * Math.sin(r.x * 0.05 + laneZ[r.lane])); rbcMesh!.setMatrixAt(i, m4.compose(v, q.setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)), sv.set(1.5, 1.5, 1.5))); });
        rbcMesh.instanceMatrix.needsUpdate = true;
      }
      for (let i = 0; i < NA; i++) { const d = stage.drift!(new THREE.Vector3(ap[i * 3], 0, ap[i * 3 + 2])); ap[i * 3] += d.x * dt * 2; ap[i * 3 + 2] += d.z * dt * 2; if (Math.abs(ap[i * 3]) > W / 2) ap[i * 3] *= -0.95; if (Math.abs(ap[i * 3 + 2]) > D / 2) ap[i * 3 + 2] *= -0.95; }
      (ag.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      sun.intensity = 1.0 + 1.2 * u.lightIn.value;
      (scene.fog as THREE.FogExp2).color.setRGB(0.5 + 0.15 * prog, 0.38 + 0.08 * prog, 0.38 + 0.06 * prog);
      (scene.background as THREE.Color).copy((scene.fog as THREE.FogExp2).color).multiplyScalar(0.5);
      if (health.version !== hVersion) { health.toBytes(hBytes); hTex.needsUpdate = true; hVersion = health.version; }
      keyLightDirView.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
    },
  };
  void breathU; void rich; void sin;
  return stage;
}
export const buildAlveolus = (r: THREE.WebGPURenderer, t: string) => build(r, t, 'B');
export const buildAlvWall = (r: THREE.WebGPURenderer, t: string) => build(r, t, 'C');

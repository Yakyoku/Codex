// ステージ5「血管」— 区域A：静脈の弁／区域B：動脈のプラーク／区域C：血栓 → 病巣の核（単位 µm、知覚加速 ×10）
// 事実（Docs/REFERENCE/vessel.md）：血管の壁のすぐそばには、赤血球のいない血漿の層（0.8〜3µm）がある → 潜行士はこの層を歩き、頭の上を赤血球が流れる。
//   壁の内側は内皮細胞と糖の衣（グリコカリックス、小さな動脈で 2〜3µm）。プラークは内膜の下に脂質がたまって盛り上がり、泡沫細胞（脂質のしずくを抱えたマクロファージ）を含む。
//   プラークの覆い（線維性の膜）が破れると、血小板が集まり、太さ 約0.1µm のフィブリンの網が赤血球をとらえて血栓になる。静脈には、逆流を止めるポケット形の弁がある。
// 作り事：本物のプラークは治療でもゆっくりしか小さくならない（2年で約1%）。ゲームでは光で小さくする（演出）。
import * as THREE from 'three/webgpu';
import { organic } from '../../core/realism';
import { tsl, type N } from '../../core/tsl';
import { loadGLB, makeEnvironment } from '../../core/assets';
import { HealthField } from '../../core/health';
import type { ZoneStage, ZoneMeta, Plug } from '../zone';
import { keyLightDirView } from '../../materials/cell';
import tuning from '../../data/tuning.json';

const { uniform, texture, positionWorld, vec2, float, color, mix, exp, length, smoothstep, sin, pow, saturate, dot, normalView, positionViewDirection } = tsl;
const BEAT_T = 60 / 70 * 10;   // 心拍 約70回/分を ×10 ゆっくり → 約8.6秒ごと
const common = { perception: 10, patient: 'circulation' as const, swimCeil: 6, scaleNote: '潜行士の身長 2µm ／ 壁ぎわの血漿の層 1〜3µm' };
export const VALVE_META: ZoneMeta = { ...common, id: 'valve', hud: '静脈・弁　一方通行の回復', plugName: 'ゆるんだ弁',
  enter: 'こちらオペレーター。足の静脈に入りました。壁ぎわの、赤血球のいない血漿の層に降ります。',
  arrive: 'こちらオペレーター。足の静脈の中です。頭の上を、赤血球が流れていきます。前にあるポケットの形の膜が、静脈の弁。ゆるんで閉じきらず、心臓へ戻る血が逆にもどっています。弁の付け根に光を当てて、引きしめてください。',
  plugHit: '弁の付け根です。光を当て続けると、弁がしっかり閉じるようになります。',
  plugCleared: (l) => (l ? `弁が一枚、しっかり閉じるようになりました。残りは ${l} か所です。` : 'すべての弁が閉じるようになりました。血が、心臓の方へ一方通行で戻ります。'),
  done: '静脈の弁が戻りました。血がたまらずに、心臓へ戻っていきます。', doneTitle: '一方通行が戻りました', causeMain: '静脈の弁のゆるみ（逆流）',
  plugDiag: { short: 'ゆるんだ弁', cause: '弁が閉じきらず、血が逆にもどっています。付け根に光を当て続けて、引きしめてください' } };
export const PLAQUE_META: ZoneMeta = { ...common, id: 'plaque', hud: '動脈・壁　なめらかさの回復', plugName: 'プラーク',
  arrive: 'こちらオペレーター。足の動脈の中です。壁の下に脂質がたまって盛り上がったプラークが、血の通り道を狭めています。透けて見える丸い細胞は、脂質のしずくを抱えた泡沫細胞。光を当てて、小さくしてください。',
  plugHit: 'プラークです。光を当て続けると、少しずつ小さくなります（本物は、ずっとゆっくりしか小さくなりません）。',
  plugCleared: (l) => (l ? `プラークが小さくなり、壁がなめらかになりました。残りは ${l} か所です。` : 'すべてのプラークが小さくなりました。血の通り道が広がります。'),
  done: '動脈の壁がなめらかになりました。血が、勢いよく流れていきます。', doneTitle: '血の通り道が広がりました', causeMain: '内膜の下に脂質がたまったプラーク',
  plugDiag: { short: 'プラーク', cause: '内膜の下に脂質がたまって盛り上がり、通り道を狭めています。光を当て続けて小さくしてください' } };
export const CLOT_META: ZoneMeta = { ...common, id: 'clot', hud: '動脈・血栓　流れの回復', plugName: '血栓',
  arrive: 'こちらオペレーター。プラークの覆いが破れた所に、血栓ができています。細い糸はフィブリン、とらえられた赤い円盤は赤血球、小さな板は血小板です。心臓が打つたびに、血栓が育とうとします。',
  plugHit: '血栓です。手当てを始めると、心臓が打つたびに血小板が集まる波が来ます。まわりを守りながら、フィブリンの網を溶かしてください。',
  plugCleared: (l) => (l ? `血栓が一つ溶けました。残りは ${l} か所です。` : 'すべての血栓が溶けました。血が、足の先まで届きます。'),
  done: '血栓が溶け、血が足の先まで流れはじめました。', doneTitle: '血の流れが戻りました', causeMain: '破れたプラークにできた血栓',
  plugDiag: { short: '血栓（フィブリンの網）', cause: 'フィブリンの網が赤血球と血小板をとらえ、通り道をふさいでいます。光を当て続けて溶かしてください（手当てを始めると、拍動のたびに血小板が集まる波が来ます）' } };

async function build(renderer: THREE.WebGPURenderer, tier: string, variant: 'A' | 'B' | 'C', opts: { entrance?: boolean } = {}): Promise<ZoneStage> {
  const M = variant === 'A' ? VALVE_META : variant === 'B' ? PLAQUE_META : CLOT_META;
  const W = 140, D = 90, rich = tier === 'pc-high', vr = tier === 'vr';
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png'); noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.colorSpace = THREE.NoColorSpace;
  const [vg, rg, ag] = await Promise.all([loadGLB('/static/models/vessel.glb'), loadGLB('/static/models/rbc.glb'), loadGLB('/static/models/atlas_extra.glb')]);
  const geos: Record<string, THREE.BufferGeometry> = {};
  for (const g of [vg, rg, ag]) g.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.updateWorldMatrix(true, false); geos[m.name] = m.geometry.clone().applyMatrix4(m.matrixWorld); } });
  const scene = new THREE.Scene();
  // 血管の中：血漿は淡い黄みの透明な液。赤血球の流れで、上は赤く濃い
  const veinTone = variant === 'A';
  scene.background = new THREE.Color(veinTone ? 0x3a1418 : 0x4a1416); scene.fog = new THREE.FogExp2(veinTone ? 0x7a3438 : 0x9a3a36, 0.014);
  scene.environment = makeEnvironment(renderer, new THREE.Color(0.95, 0.45, 0.42)); scene.environmentIntensity = 0.4;
  const hc = tuning.health;
  const health = new HealthField(hc.gridW, Math.round(hc.gridW * D / W), W, D, 0.2);
  const hBytes = new Uint8Array(health.w * health.h);
  const hTex = new THREE.DataTexture(health.toBytes(hBytes), health.w, health.h, THREE.RedFormat, THREE.UnsignedByteType);
  hTex.magFilter = hTex.minFilter = THREE.LinearFilter; hTex.needsUpdate = true; let hVersion = -1;
  const u = { time: uniform(0), scan: uniform(0), lightIn: uniform(0.4), heartPhase: uniform(0), beamPos: uniform(new THREE.Vector3(0, -999, 0)), beamOn: uniform(0), scanR: uniform(0), scanOrigin: uniform(new THREE.Vector3()), scanPulse: uniform(0) };
  const H: N = texture(hTex, vec2(positionWorld.x.div(W).add(0.5).clamp(0, 1), positionWorld.z.div(D).add(0.5).clamp(0, 1))).r;
  const sick = float(1).sub(H);
  const core = new THREE.Vector3(variant === 'C' ? W * 0.22 : 0, 0, 0);
  const waveR = uniform(0), waveOn = uniform(0), bootR = uniform(-1);
  const dC = length(positionWorld.xz.sub(vec2(core.x, core.z)));
  const waveRing = exp(dC.sub(waveR).div(3).pow(2).negate()).mul(waveOn);
  const bootRing = exp(dC.sub(bootR).div(6).pow(2).negate()).mul(smoothstep(-1, 0, bootR));
  const fres = pow(float(1).sub(saturate(dot(normalView, positionViewDirection).abs())), float(2.5));
  const scanCol = mix(color(0xffa040), color(0x5fe8d0), H);
  // ---- 塊（区域ごと）----
  const plugs: (Plug & { gone: number; shake: number })[] = (variant === 'C' ? [[-0.06, -0.12], [0.08, -0.04], [0.0, 0.14]] : variant === 'A' ? [[-0.22, -0.18], [-0.22, 0.18], [0.24, 0.0]] : [[-0.25, -0.1], [0.05, 0.2], [0.28, -0.15]])
    .map(([fx, fz]) => ({ p: new THREE.Vector3(core.x + fx * W, 0, core.z + fz * D), hp: 1, cleared: false, gone: 0, shake: 0 }));
  // 区域B：プラークの盛り上がりが足もとの高さになる
  const plaqueH = (x: number, z: number) => { if (variant !== 'B') return 0; let h = 0; for (const pl of plugs) { const k = 1 - pl.gone * 0.85; const d2 = ((x - pl.p.x) / 26) ** 2 + ((z - pl.p.z) / 16) ** 2; if (d2 < 1) h = Math.max(h, 7 * k * (1 - d2) ** 1.5 * (1 + 0.16 * Math.sin(x * 0.55 + z * 0.2) * Math.sin(z * 0.7 - x * 0.15) + 0.08 * Math.sin(x * 1.3 + z * 1.1))); } return h; };   // 実物の写真：盛り上がりはごつごつしている
  const floorAt = (x: number, z: number) => plaqueH(x, z);
  // ---- 床：内皮細胞の並び（流れの向きに細長い）と、つやのある糖の衣 ----
  const fm = new THREE.MeshPhysicalNodeMaterial();
  const cells = texture(noiseTex, vec2(positionWorld.x.mul(1 / 60), positionWorld.z.mul(1 / 16))).r;   // 流れの向きに長い細胞
  const border = smoothstep(0.55, 0.98, cells).mul(0.5);
  fm.colorNode = mix(color(0xb87068), color(0xeaa898), H).mul(mix(float(1), float(0.85), border)).mul(texture(noiseTex, positionWorld.xz.mul(1 / 3)).g.mul(0.1).add(0.92));
  if (variant === 'B') fm.colorNode = mix(fm.colorNode as N, mix(color(0xdcbc78), color(0xf0e2c4), smoothstep(0.3, 0.7, texture(noiseTex, positionWorld.xz.mul(1 / 16)).g)), smoothstep(0.4, 4.0, positionWorld.y).mul(0.75));   // 実物の写真：黄白色でまだら（白い線維の覆いの下に脂質の芯）   // プラークの盛り上がりは、脂質で黄みを帯びる
  fm.roughnessNode = mix(float(0.55), float(0.18), H); fm.clearcoatNode = H.mul(0.8); fm.clearcoatRoughnessNode = float(0.12);
  fm.emissiveNode = color(0xb83a2a).mul(sick.mul(0.12)).add(color(0xff7a40).mul(waveRing.mul(0.5))).add(color(0xfff0e0).mul(bootRing.mul(0.6))).add(scanCol.mul(u.scan.mul(0.12))).add(color(0xffd0c8).mul(fres.mul(0.06)));
  const fg = new THREE.PlaneGeometry(W * 1.3, D * 1.3, 140, 90); fg.rotateX(-Math.PI / 2);
  if (variant === 'B') { const pa = fg.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pa.count; i++) pa.setY(i, 0); }
  organic(fm, noiseTex, { scale: 2.6, bump: 0.6, sss: 0xff8070, sssAmt: 0.25 });   // 内皮の、核の所のふくらみと細かな起伏
  const floor = new THREE.Mesh(fg, fm); scene.add(floor);
  const reshape = () => { if (variant !== 'B') return; const pa = fg.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pa.count; i++) pa.setY(i, plaqueH(pa.getX(i), pa.getZ(i))); pa.needsUpdate = true; fg.computeVertexNormals(); };
  reshape();
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3();
  let sd = 17; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  // 区域A：静脈の弁（ポケット形の弁尖が2枚で1組。ゆるむと閉じきらない）
  const leaflets: { base: THREE.Vector3; side: number; plug: number; mesh: THREE.Mesh }[] = [];
  if (variant === 'A') {
    const lm = new THREE.MeshPhysicalNodeMaterial({ transparent: true, side: THREE.DoubleSide }); lm.colorNode = mix(color(0xd8a8a0), color(0xf2d0c8), H); lm.roughnessNode = float(0.3); lm.opacityNode = float(0.72).add(fres.mul(0.2)); lm.clearcoatNode = float(0.6);
    [[-0.22, 1], [-0.22, -1], [0.24, 1]].forEach(([fx, side], i) => { const mesh = new THREE.Mesh(geos.leaflet, lm); const base = new THREE.Vector3(fx * W, 0, side * 0.18 * D); mesh.position.copy(base); mesh.scale.set(30, 26 * side, 26); scene.add(mesh); leaflets.push({ base, side, plug: i, mesh }); });
  }
  // 区域B：プラークの中に透ける泡沫細胞
  let foamM: THREE.InstancedMesh | null = null; const foams: { p: THREE.Vector3; plug: number }[] = [];
  if (variant === 'B') {
    const fom = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); fom.colorNode = color(0xf0d8a0); fom.roughnessNode = float(0.4); fom.opacityNode = float(0.6); fom.emissiveNode = color(0xffe0a0).mul(0.08);
    plugs.forEach((pl, i) => { for (let k = 0; k < 5; k++) foams.push({ p: pl.p.clone().add(new THREE.Vector3((rnd() - 0.5) * 30, 0, (rnd() - 0.5) * 16)), plug: i }); });
    foamM = new THREE.InstancedMesh(geos.foam_drops, fom, foams.length); foamM.frustumCulled = false; scene.add(foamM);
  }
  // 区域C：血栓（フィブリンの網＋とらえられた赤血球と血小板）
  let fibM: THREE.InstancedMesh | null = null, trapR: THREE.InstancedMesh | null = null, plt: THREE.InstancedMesh | null = null; const traps: { p: THREE.Vector3; plug: number; r: number }[] = [];
  const rbcGeo = geos.rbc_lod1 ?? geos.rbc_lod0; const NF = rich ? 5 : vr ? 2 : 3;   // フィブリンの網の数（軽い段階では減らす）
  if (variant === 'C') {
    const fbm = new THREE.MeshPhysicalNodeMaterial(); fbm.colorNode = color(0xf0e6dc); fbm.roughnessNode = float(0.4); fbm.clearcoatNode = float(0.4);
    fibM = new THREE.InstancedMesh(rich ? geos.fibrin : geos.fibrin_lo ?? geos.fibrin, fbm, plugs.length * NF); fibM.frustumCulled = false; scene.add(fibM);
    const rm = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide }); rm.colorNode = color(0x8a1a20); rm.roughnessNode = float(0.45);
    plugs.forEach((pl, i) => { for (let k = 0; k < 14; k++) traps.push({ p: pl.p.clone().add(new THREE.Vector3((rnd() - 0.5) * 16, 1 + rnd() * 12, (rnd() - 0.5) * 16)), plug: i, r: rnd() * 6.28 }); });
    trapR = new THREE.InstancedMesh(rich ? geos.rbc_lod0 ?? rbcGeo : rbcGeo, rm, traps.length); trapR.frustumCulled = false; scene.add(trapR);
    const pm = new THREE.MeshPhysicalNodeMaterial(); pm.colorNode = color(0xe8dcc8); pm.roughnessNode = float(0.4);
    plt = new THREE.InstancedMesh(geos.platelet, pm, traps.length); plt.frustumCulled = false; scene.add(plt);
  }
  // ---- 頭の上を流れる赤血球（拍動で速さが変わる）、ときどき転がる単球 ----
  const NR = vr ? 60 : rich ? 180 : 110;
  const flow = Array.from({ length: NR }, () => ({ x: (rnd() - 0.5) * W * 1.3, y: 5 + rnd() * 30, z: (rnd() - 0.5) * D * 1.2, r: rnd() * 6.28, s: 0.7 + rnd() * 0.5 }));
  const frm = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide }); frm.colorNode = mix(color(0x7a1018), color(0xc8202a), H); frm.roughnessNode = float(0.5);
  const fr = new THREE.InstancedMesh(rbcGeo, frm, NR); fr.frustumCulled = false; scene.add(fr);
  const mm = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); mm.colorNode = color(0xe8e0dc); mm.roughnessNode = float(0.4); mm.opacityNode = float(0.85);
  const mono = new THREE.InstancedMesh(geos.monocyte, mm, 3); mono.frustumCulled = false; scene.add(mono);
  const monos = Array.from({ length: 3 }, (_, i) => ({ x: -W / 2 + i * 40, z: (rnd() - 0.5) * D * 0.6 }));

  const capAround = (x: number, z: number) => { let cap = 1; for (const pl of plugs) if (!pl.cleared) { const d = Math.hypot(x - pl.p.x, z - pl.p.z); if (d < 18) cap = Math.min(cap, 0.3 + 0.7 * Math.max(0, (d - 9) / 9)); } return cap; };
  health.setFn((x, z) => { let k = 0; for (const p of plugs) k = Math.max(k, Math.exp(-((x - p.p.x) ** 2 + (z - p.p.z) ** 2) / 700)); return 0.24 - 0.18 * k + 0.04 * Math.sin(x * 0.05) * Math.cos(z * 0.06); });
  const startMean = health.mean();
  const plugsLeft = () => plugs.filter((p) => !p.cleared).length;
  const progress = () => Math.min(plugsLeft() ? 0.9 : 1, Math.max(0, (health.mean() - startMean) / (hc.doneAt - startMean)));
  const sun = new THREE.DirectionalLight(0xfff0ea, 1.3); sun.position.set(-30, 100, 30); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xffd8d4, 0x902a28, 0.9); scene.add(hemi);
  let onPlug: (i: number, kind: 'hit' | 'cleared' | 'pulse') => void = () => {};
  let fight = false, waveT = 0, flowS = 0, booted = false;
  const beatP = (t: number) => (t % BEAT_T) / BEAT_T;
  const surge = (t: number) => { const b = beatP(t); return b < 0.25 ? Math.sin(b / 0.25 * Math.PI) : 0; };   // 心臓が打った直後の勢い
  const stage: ZoneStage = {
    meta: M, scene, health, size: [W, D], u, sun, plugs, progress, floorHeight: floorAt,
    start: { pos: new THREE.Vector3(-W / 2 + 10, opts.entrance ? 5 : 0, 0), yaw: Math.PI / 2, swimming: !!opts.entrance },
    causeAt: (x, z) => (health.sample(x, z) < 0.3 ? { short: variant === 'A' ? '血のたまり' : '壁の傷み', cause: variant === 'A' ? '弁がゆるみ、血が逆にもどってたまっています' : '内皮が傷み、壁がなめらかさを失っています' } : { short: '流れの乱れ', cause: '狭くなった所で、血の流れが乱れています' }),
    setOnPlug(f) { onPlug = f; },
    encounters(pos, t, walked) {
      const out: { id: string; at: THREE.Vector3 | null }[] = [];
      if (t > 3) out.push({ id: variant === 'A' ? 'vein_valve' : variant === 'B' ? 'artery_wall' : 'thrombus', at: null });
      if (walked > 6) out.push({ id: 'rbc', at: null });
      if (walked > 12) out.push({ id: 'endothelial', at: null });
      for (const m of monos) if (Math.hypot(m.x - pos.x, m.z - pos.z) < 14) out.push({ id: 'monocyte', at: new THREE.Vector3(m.x, 6, m.z) });
      if (variant === 'B') { for (const pl of plugs) if (!pl.cleared && pl.p.distanceTo(pos) < 22) { out.push({ id: 'plaque', at: pl.p.clone() }); out.push({ id: 'foam_cell', at: pl.p.clone().setY(3) }); } if (walked > 30) out.push({ id: 'ldl', at: null }); if (walked > 18) out.push({ id: 'smooth_muscle_cell', at: null }); }
      if (variant === 'C') { for (const pl of plugs) if (!pl.cleared && pl.p.distanceTo(pos) < 20) { out.push({ id: 'fibrin', at: pl.p.clone().setY(6) }); out.push({ id: 'platelet', at: pl.p.clone().setY(4) }); } }
      return out;
    },
    heal(x, z, dt) {
      plugs.forEach((pl, i) => {
        if (pl.cleared || Math.hypot(x - pl.p.x, z - pl.p.z) > 9) return;
        if (pl.hp === 1) { onPlug(i, 'hit'); if (variant === 'C') { fight = true; waveT = 2; } }
        pl.hp = Math.max(0, pl.hp - dt / 3.8); pl.shake = 1;
        if (pl.hp <= 0) { pl.cleared = true; onPlug(i, 'cleared'); health.heal(pl.p.x, pl.p.z, 18, 0.35); }
      });
      const got = health.heal(x, z, tuning.beam.radius, tuning.beam.rate * dt); health.clampFn(capAround); return got;
    },
    beat: () => beatP(u.time.value),
    // 壁ぎわは流れがおそい。拍動のたびに少し押される。区域A（静脈）は、弁がゆるんでいると拍動の合間に逆にもどる
    drift: (p: THREE.Vector3) => { const t = u.time.value, s = surge(t); const back = variant === 'A' ? (1 - progress()) * (beatP(t) > 0.5 ? -0.6 : 0) : 0; return new THREE.Vector3(0.9 * s + back, 0, 0); },
    flowing: () => flowS,
    update(dt, t, camera) {
      u.time.value = t; u.heartPhase.value = (t / BEAT_T) * Math.PI * 2;
      health.spread(dt, hc.regrow); health.clampFn(capAround);
      let changed = false;
      for (const pl of plugs) { pl.shake = Math.max(0, pl.shake - dt * 3); if (pl.cleared && pl.gone < 1) { pl.gone = Math.min(1, pl.gone + dt * 0.5); changed = true; } }
      if (changed) reshape();
      if (fight && plugsLeft()) {
        if (beatP(t) < beatP(t - dt)) { waveR.value = 0; waveOn.value = 1; onPlug(-1, 'pulse'); }   // 心臓が打つたびに
        if (waveOn.value > 0) { waveR.value += dt * 12; waveOn.value = Math.max(0, 1 - waveR.value / 36); const Rr = waveR.value, amt = dt * 0.5 * plugsLeft() / 3;
          for (let j = 0; j < health.h; j++) for (let i = 0; i < health.w; i++) { const x = (i / (health.w - 1) - 0.5) * W, z = (j / (health.h - 1) - 0.5) * D; if (Math.abs(Math.hypot(x - core.x, z - core.z) - Rr) < 3) { const k = j * health.w + i; health.data[k] = Math.max(0.12, health.data[k] - amt); } }
          health.version++; }
      } else waveOn.value = Math.max(0, waveOn.value - dt);
      void waveT;
      const prog = progress(); flowS = prog;
      if (!booted && prog >= 1 && variant === 'C') { booted = true; bootR.value = 0; }
      if (booted) bootR.value += dt * 20;
      u.lightIn.value += ((0.4 + 0.6 * prog) - u.lightIn.value) * Math.min(1, dt * 1.5);
      // 流れる赤血球：拍動で速くなる。狭いと（病）遅く乱れる
      const sp = (variant === 'A' ? 8 : 18) * (0.4 + 0.6 * prog) * (0.6 + 0.8 * surge(t));
      flow.forEach((f, i) => { f.x += sp * f.s * dt * (variant === 'A' && prog < 0.5 && beatP(t) > 0.5 ? -0.4 : 1); if (f.x > W * 0.65) f.x -= W * 1.3; if (f.x < -W * 0.65) f.x += W * 1.3; f.r += dt * 0.5;
        v.set(f.x, f.y + plaqueH(f.x, f.z), f.z); fr.setMatrixAt(i, m4.compose(v, q.setFromEuler(new THREE.Euler(f.r, f.r * 0.7, Math.PI / 2)), sv.set(f.s, f.s, f.s))); });
      fr.instanceMatrix.needsUpdate = true;
      monos.forEach((m, i) => { m.x += dt * (1.5 + 2 * surge(t)); if (m.x > W / 2) m.x -= W; v.set(m.x, floorAt(m.x, m.z) + 7, m.z); mono.setMatrixAt(i, m4.compose(v, q.setFromAxisAngle(sv.set(0, 0, 1), -m.x / 7), sv.set(1, 1, 1))); });
      mono.instanceMatrix.needsUpdate = true;
      leaflets.forEach((l) => {
        // 弁：拍動の合間（逆流しようとする時）に閉じる。ゆるんでいる間は閉じきらない
        const pl = plugs[l.plug], close = beatP(t) > 0.35 ? 1 : 0, tight = pl.cleared ? 1 : 0.35;
        const ang = (0.15 + 0.55 * (1 - close * tight)) * l.side;
        l.mesh.rotation.set(0, 0, 0); l.mesh.rotation.x = -ang * 0.6; l.mesh.position.copy(l.base); l.mesh.position.x += Math.sin(t * 40) * pl.shake * 0.1;
      });
      if (foamM) foams.forEach((f, i) => { const pl = plugs[f.plug], k = 1 - pl.gone; v.copy(f.p); v.y = plaqueH(f.p.x, f.p.z) * 0.5; foamM!.setMatrixAt(i, m4.compose(v, q.identity(), sv.set(0.35 * k + 0.001, 0.22 * k + 0.001, 0.35 * k + 0.001))); });
      if (foamM) foamM.instanceMatrix.needsUpdate = true;
      if (fibM) { plugs.forEach((pl, i) => { const k = 1 - pl.gone; for (let j = 0; j < NF; j++) { v.copy(pl.p).add(sv.set(Math.sin(j * 2.4) * 6, 4 + (j % 3) * 4, Math.cos(j * 2.4) * 6)); v.x += Math.sin(t * 40 + i) * pl.shake * 0.12; fibM!.setMatrixAt(i * NF + j, m4.compose(v, q.setFromEuler(new THREE.Euler(j, i + j * 1.3, j * 0.5)), sv.set(0.75 * k + 0.001, 0.75 * k + 0.001, 0.75 * k + 0.001))); } }); fibM.instanceMatrix.needsUpdate = true; }
      if (trapR && plt) { traps.forEach((tr, i) => { const pl = plugs[tr.plug]; v.copy(tr.p); if (pl.gone > 0) v.x += pl.gone * 30; v.y += Math.sin(t + i) * 0.1; const s = pl.gone > 0.9 ? 0.001 : 1;
        trapR!.setMatrixAt(i, m4.compose(v, q.setFromEuler(new THREE.Euler(tr.r, tr.r * 2, 0)), sv.set(s, s, s)));
        plt!.setMatrixAt(i, m4.compose(v.add(sv.set(4.6 * Math.cos(i * 2.3), 2.2 * Math.sin(i * 1.7), 4.6 * Math.sin(i * 2.3))), q, sv.set(s * 1.2, s * 1.2, s * 1.2))); /* 血小板は赤血球のくぼみではなく、すき間の網にからむ */ }); trapR.instanceMatrix.needsUpdate = plt.instanceMatrix.needsUpdate = true; }
      sun.intensity = 0.9 + 1.2 * u.lightIn.value;
      (scene.fog as THREE.FogExp2).color.setRGB(0.5 + 0.12 * prog, 0.2 + 0.06 * prog, 0.2 + 0.05 * prog);
      (scene.background as THREE.Color).copy((scene.fog as THREE.FogExp2).color).multiplyScalar(0.5);
      if (health.version !== hVersion) { health.toBytes(hBytes); hTex.needsUpdate = true; hVersion = health.version; }
      keyLightDirView.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
    },
  };
  void sin;
  return stage;
}
export const buildValve = (r: THREE.WebGPURenderer, t: string, o?: { entrance?: boolean }) => build(r, t, 'A', o);
export const buildPlaque = (r: THREE.WebGPURenderer, t: string) => build(r, t, 'B');
export const buildClot = (r: THREE.WebGPURenderer, t: string) => build(r, t, 'C');

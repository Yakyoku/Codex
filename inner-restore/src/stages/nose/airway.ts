// ステージ2「鼻」— 区域A：線毛の森／区域B：粘液の川（鼻の中の呼吸上皮。単位は µm、知覚加速 ×20）
// 炎症（かぜのあとなど）で線毛が寝て止まり、粘液が濁って固まる → 治すと線毛が打ちはじめ、波がそろい、粘液が喉の向き（+x）へ流れる。
// 固有の遊び：線毛の波のリズム。照準の輪が線毛の打つ拍子で脈打ち、拍子に合わせて光を当てるとよく治る。
// 区域B は、そろった波が粘液を運ぶ。潜行士も粘液ごと運ばれる（流れに乗る）。粘液栓をほどいて、喉までの流れを通す。
import * as THREE from 'three/webgpu';
import { tsl, type N } from '../../core/tsl';
import { loadGLB, makeEnvironment } from '../../core/assets';
import { HealthField } from '../../core/health';
import type { ZoneStage, ZoneMeta, Plug } from '../zone';
import { keyLightDirView } from '../../materials/cell';
import { ciliaField, epithelium, mucusLayer, PCL, GEL } from './common';
import tuning from '../../data/tuning.json';

const { uniform, texture, positionWorld, vec2, vec3, float, color, mix, exp, length, smoothstep, sin } = tsl;
const BEAT = 11 / 20;       // 1秒あたりの打つ回数（実物 約 11Hz を ×20 ゆっくり見る）
const WAVE = 50;            // 波の長さ（µm）

const common = { perception: 20, scaleNote: '潜行士の身長 2µm ／ 線毛の長さ 約6µm', patient: 'smell' as const, swimCeil: 18,
  plugName: '粘液栓', plugHit: '水分を失って固まった粘液の塊、粘液栓です。光を当て続けて、水分を取り戻してください。',
  plugDiag: { short: '粘液栓（固まった粘液の塊）', cause: '炎症で粘液が濃くなり、固まって線毛の動きを止めています。光を当て続けてほどいてください' } };
export const CILIA_META: ZoneMeta = { ...common, id: 'cilia', hud: '鼻・呼吸上皮　線毛の波の回復',
  enter: 'こちらオペレーター。鼻の中に入りました。吸いこんだ空気の流れに乗って、粘膜へ降ります。',
  arrive: 'こちらオペレーター。鼻の粘膜の上です。足もとは粘液の層、その下に線毛の森があります。炎症で線毛が寝て止まっています。照準の輪が脈打つ拍子に合わせて光を当てると、線毛の波がよくそろいます。',
  plugCleared: (l) => (l ? `粘液栓がほどけました。線毛が打ちはじめます。残りは ${l} か所です。` : 'すべての粘液栓がほどけました。線毛の波がそろいはじめます。'),
  done: '線毛の波がそろいました。粘液が、喉の向きへ流れはじめます。', doneTitle: '線毛の波が戻りました', causeMain: '炎症による線毛の停止と、粘液の固まり' };
export const MUCUS_META: ZoneMeta = { ...common, id: 'mucus', hud: '鼻・粘液の川　流れの回復',
  arrive: 'こちらオペレーター。粘液の川です。そろった線毛の波が、粘液を喉の向きへ運びます。流れをせき止めている粘液栓をほどき、喉までの流れを通してください。流れに乗ると、体ごと運ばれます。',
  plugCleared: (l) => (l ? `せき止めがほどけ、流れが先へ進みました。残りは ${l} か所です。` : 'せき止めがすべてほどけました。粘液が、喉まで流れます。'),
  done: '粘液の川が流れはじめました。ほこりも細菌も、喉へ運ばれていきます。', doneTitle: '粘液の流れが戻りました', causeMain: '粘液栓による流れのせき止め' };

// 肺の細気管支（ステージ3 区域A）も、この形を使う（線毛の森＋粘液。杯細胞の代わりにクラブ細胞、拍子の代わりに呼吸）
export const BRONCH_META: ZoneMeta = { id: 'bronchiole', hud: '肺・細気管支　空気の通り道の回復', perception: 2, scaleNote: '潜行士の身長 2µm ／ 細気管支の太さ 約0.5mm', patient: 'breath', swimCeil: 18,
  enter: 'こちらオペレーター。気管支の奥へ入りました。吸う息に乗って、細い気管支へ降ります。',
  arrive: 'こちらオペレーター。肺の奥の細い気管支、細気管支です。丸く盛り上がった細胞はクラブ細胞。吸いこんだ細かな粒子が粘液にからまって固まり、線毛を止めています。吸う息と吐く息で、空気の流れが行き来します。吐く息のときに光を当てると、粒子がはがれやすくなります。',
  plugName: '粒子のかたまり', plugHit: '吸いこんだ粒子が、粘液と固まった塊です。光を当て続けて、ほどいてください。',
  plugCleared: (l) => (l ? `塊がほどけました。粘液が粒子を運びはじめます。残りは ${l} か所です。` : 'すべての塊がほどけました。線毛が、粘液ごと粒子を喉へ送り返します。'),
  done: '細気管支の線毛が動きはじめました。空気の通り道が開きます。', doneTitle: '空気の通り道が開きました', causeMain: '吸いこんだ粒子と、固まった粘液',
  plugDiag: { short: '粒子のかたまり', cause: '吸いこんだ粒子が粘液と固まり、線毛を止めています。光を当て続けてほどいてください' } };
async function build(renderer: THREE.WebGPURenderer, tier: string, variant: 'A' | 'B' | 'L', opts: { entrance?: boolean } = {}): Promise<ZoneStage> {
  const lung = variant === 'L';
  const W = 110, D = 70, M = variant === 'A' ? CILIA_META : variant === 'B' ? MUCUS_META : BRONCH_META;
  // 呼吸（肺）：実物 約15回/分（4秒で1回）を ×2 ゆっくり → 8秒で1回。吸う 40%・吐く 60%
  const BREATH = 8;
  const breath = (t: number) => (t % BREATH) / BREATH;
  const rich = tier === 'pc-high', vr = tier === 'vr';
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png');
  noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.colorSpace = THREE.NoColorSpace;
  const gltf = await loadGLB('/static/models/nose.glb');
  const geos: Record<string, THREE.BufferGeometry> = {};
  gltf.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.updateWorldMatrix(true, false); geos[m.name] = m.geometry.clone().applyMatrix4(m.matrixWorld); } });
  const scene = new THREE.Scene();
  // 鼻の中の空気の中：湿って温かく、粘膜の桃色の光に包まれる
  scene.background = new THREE.Color(0x3a2624);
  scene.fog = new THREE.FogExp2(0x8a6a64, 0.012);
  scene.environment = makeEnvironment(renderer, new THREE.Color(0.9, 0.62, 0.58)); scene.environmentIntensity = 0.35;
  const hc = tuning.health;
  const health = new HealthField(hc.gridW, Math.round(hc.gridW * D / W), W, D, 0.2);
  const hBytes = new Uint8Array(health.w * health.h);
  const hTex = new THREE.DataTexture(health.toBytes(hBytes), health.w, health.h, THREE.RedFormat, THREE.UnsignedByteType);
  hTex.magFilter = hTex.minFilter = THREE.LinearFilter; hTex.needsUpdate = true; let hVersion = -1;
  const u = { time: uniform(0), scan: uniform(0), lightIn: uniform(0.4), heartPhase: uniform(0), beamPos: uniform(new THREE.Vector3(0, -999, 0)), beamOn: uniform(0), scanR: uniform(0), scanOrigin: uniform(new THREE.Vector3()), scanPulse: uniform(0) };
  const Hat = (xz: N) => texture(hTex, vec2(xz.x.div(W).add(0.5), xz.y.div(D).add(0.5))).r;
  const H: N = Hat(positionWorld.xz);
  const flowX = uniform(0), diverU = uniform(new THREE.Vector3());
  // 床（粘膜の上皮）→ 線毛の森 → 粘液のゲル（上面が潜行士の立つ面、y=0）
  const floorY = -(PCL + GEL);
  const epi = epithelium(W, D, H, noiseTex); epi.position.y = floorY - 0.05; scene.add(epi);
  const goblet = (x: number, z: number) => { if (lung) { const gx2 = Math.round(x / 7), gz2 = Math.round(z / 7); return (gx2 * 5 + gz2 * 3) % 3 === 0 && Math.hypot(x - gx2 * 7, z - gz2 * 7) < 3.2; } const gx = Math.round(x / 9), gz = Math.round(z / 9); return (gx * 7 + gz * 3) % 6 === 0 && Math.hypot(x - gx * 9, z - gz * 9) < 2.6; };
  const dens = vr ? 0.5 : rich ? 2.6 : tier === 'mobile-high' ? 2.0 : 1.05;   // 予算表の三角形の上限に合わせる（1本 60枚）   // 1µm² あたり（実物 6〜8本）
  const diverLocal = vec3(diverU.x, diverU.y.sub(floorY), diverU.z);
  const cil = ciliaField({ W, D, density: lung ? dens * 0.7 : dens, Hat, time: u.time, wave: float(WAVE), diver: diverLocal, beatHz: lung ? 11 / 2 / 6 : BEAT, goblet });
  cil.mesh.position.y = floorY; scene.add(cil.mesh);
  // 杯細胞の口：線毛のない丸いところから、粘液のしずくがのぞく
  {
    const list: THREE.Vector3[] = [];
    for (let gx = -6; gx <= 6; gx++) for (let gz = -4; gz <= 4; gz++) if ((gx * 7 + gz * 3) % 6 === 0) list.push(new THREE.Vector3(gx * 9, floorY, gz * 9));
    const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); m.colorNode = color(0xeef2f0); m.roughnessNode = float(0.15); m.opacityNode = float(0.7);
    if (!lung) {
    const im = new THREE.InstancedMesh(geos.plug, m, list.length); const m4 = new THREE.Matrix4();
    list.forEach((p, i) => im.setMatrixAt(i, m4.compose(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), new THREE.Vector3(2.2, 2.2, 2.6))));
    scene.add(im);
    } else {
      // クラブ細胞：線毛のない、ドームのように盛り上がった細胞（7µm ごとの並びの一部）
      const cl: THREE.Vector3[] = []; for (let gx = -9; gx <= 9; gx++) for (let gz = -6; gz <= 6; gz++) if ((gx * 5 + gz * 3) % 3 === 0) cl.push(new THREE.Vector3(gx * 7, floorY, gz * 7));
      const cm = new THREE.MeshPhysicalNodeMaterial(); cm.colorNode = mix(color(0xd8a8a0), color(0xf0d0c8), H); cm.roughnessNode = float(0.35); cm.clearcoatNode = float(0.5);
      const lg = await loadGLB('/static/models/lung.glb'); let cg: THREE.BufferGeometry | null = null;
      lg.scene.traverse((o) => { const mm = o as THREE.Mesh; if (mm.isMesh && mm.name === 'club') { mm.updateWorldMatrix(true, false); cg = mm.geometry.clone().applyMatrix4(mm.matrixWorld); } });
      const im = new THREE.InstancedMesh(cg!, cm, cl.length); const m4 = new THREE.Matrix4();
      cl.forEach((p, i) => im.setMatrixAt(i, m4.compose(p, new THREE.Quaternion(), new THREE.Vector3(0.8, 0.8, 0.8)))); scene.add(im);
    }
  }
  const muc = mucusLayer(W, D, H, noiseTex, flowX, rich); scene.add(muc);

  // ---- 粘液栓（3か所）と、粘液にとらえられたほこり・細菌 ----
  const cores = variant === 'A' ? [[-0.25, -0.2], [0.05, 0.22], [0.3, -0.05]] : [[-0.2, 0.0], [0.08, 0.05], [0.33, -0.02]];
  const plugs: (Plug & { gone: number; shake: number })[] = cores.map(([fx, fz]) => ({ p: new THREE.Vector3(fx * W, 0, fz * D), hp: 1, cleared: false, gone: 0, shake: 0 }));
  const plugMat = new THREE.MeshPhysicalNodeMaterial({ transparent: true });
  plugMat.colorNode = color(0xd8c48a); plugMat.roughnessNode = float(0.3); plugMat.opacityNode = float(0.8); plugMat.clearcoatNode = float(0.7); plugMat.clearcoatRoughnessNode = float(0.25);
  plugMat.emissiveNode = color(0xfff0c0).mul(sin(u.time.mul(2)).mul(0.03).add(0.05));
  const plugMesh = new THREE.InstancedMesh(geos.plug, plugMat, plugs.length); plugMesh.frustumCulled = false; scene.add(plugMesh);
  const NP = vr ? 30 : 60;
  const parts: { p: THREE.Vector3; kind: 0 | 1; s: number; r: number; stuck: number }[] = [];
  let sd = 31; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  for (let i = 0; i < NP; i++) {
    const near = i < NP * 0.4 ? plugs[i % 3].p : null;
    const x = near ? near.x + (rnd() - 0.5) * 12 : (rnd() - 0.5) * W, z = near ? near.z + (rnd() - 0.5) * 12 : (rnd() - 0.5) * D;
    parts.push({ p: new THREE.Vector3(x, 0.2, z), kind: rnd() < 0.55 ? 0 : 1, s: 0.6 + rnd() * rnd() * 1.1, r: rnd() * 6.28, stuck: near ? (i % 3) : -1 });
  }
  const dustMat = new THREE.MeshPhysicalNodeMaterial(); dustMat.colorNode = color(0x9a8a7a); dustMat.roughnessNode = float(0.6); dustMat.clearcoatNode = float(0.6); dustMat.clearcoatRoughnessNode = float(0.2);   // 粘液の膜をまとって、つやがある
  const bacMat = new THREE.MeshStandardNodeMaterial(); bacMat.colorNode = color(0xd8c8a0); bacMat.roughnessNode = float(0.5);
  const dust = new THREE.InstancedMesh(geos.dust, dustMat, NP), bac = new THREE.InstancedMesh(geos.staph, bacMat, NP);
  dust.frustumCulled = bac.frustumCulled = false; scene.add(dust, bac);
  // 好中球：炎症の所に集まって、細菌を取りこもうとしている（病んでいる間だけ）
  const NN = 5;
  const neuMat = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); neuMat.colorNode = color(0xece4dc); neuMat.roughnessNode = float(0.4); neuMat.opacityNode = float(0.8);
  const neu = new THREE.InstancedMesh(geos.neutro, neuMat, NN); neu.frustumCulled = false; scene.add(neu);
  const neuts = Array.from({ length: NN }, (_, i) => ({ p: plugs[i % 3].p.clone().add(new THREE.Vector3((rnd() - 0.5) * 20, 1.5, (rnd() - 0.5) * 20)), r: rnd() * 6.28 }));

  const capAround = (x: number, z: number) => { let cap = 1; for (const pl of plugs) if (!pl.cleared) { const d = Math.hypot(x - pl.p.x, z - pl.p.z); if (d < 18) cap = Math.min(cap, 0.3 + 0.7 * Math.max(0, (d - 9) / 9)); } return cap; };
  health.setFn((x, z) => { let k = 0; for (const p of plugs) k = Math.max(k, Math.exp(-((x - p.p.x) ** 2 + (z - p.p.z) ** 2) / 500)); return 0.22 - 0.18 * k + 0.04 * Math.sin(x * 0.08) * Math.cos(z * 0.1); });
  const startMean = health.mean();
  const plugsLeft = () => plugs.filter((p) => !p.cleared).length;
  const progress = () => Math.min(plugsLeft() ? 0.9 : 1, Math.max(0, (health.mean() - startMean) / (hc.doneAt - startMean)));

  // ---- 光：上（鼻の入り口の側）から差しこむ光と、粘膜の桃色の照り返し ----
  const sun = new THREE.DirectionalLight(0xfff2e6, 1.8); sun.position.set(-40, 80, 20); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xffe8e0, 0x9a4a40, 0.8); scene.add(hemi);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3();
  let onPlug: (i: number, kind: 'hit' | 'cleared' | 'pulse') => void = () => {};
  let flowS = 0, speed = 0;
  const flowAt = (x: number, z: number) => { const h = health.sample(x, z); return Math.max(0, (h - 0.45) / 0.45); };   // 0〜1
  const stage: ZoneStage & { beat(): number } = {
    meta: M, scene, health, size: [W, D], u, sun, plugs, progress,
    floorHeight: () => 0,
    start: { pos: new THREE.Vector3(-W / 2 + 12, opts.entrance ? 16 : 0, 0), yaw: Math.PI / 2, swimming: !!opts.entrance },
    causeAt: (x, z) => (health.sample(x, z) < 0.3 ? { short: '線毛の停止', cause: '炎症で線毛が寝て止まり、粘液が流れません' } : { short: '線毛の波の乱れ', cause: '線毛が打つ拍子がそろわず、粘液を運べません' }),
    setOnPlug(f) { onPlug = f; },
    encounters(pos, t, walked) {
      const out: { id: string; at: THREE.Vector3 | null }[] = [];
      if (t > 3) out.push({ id: 'mucus', at: null });
      if (walked > 6) out.push({ id: 'cilium', at: pos.clone().setY(floorY + 4) });
      if (walked > 14) out.push({ id: 'ciliated_cell', at: pos.clone().setY(floorY) });
      if (walked > 24) out.push({ id: 'goblet_cell', at: null });
      for (const n of neuts) if (n.p.distanceTo(pos) < 16 && progress() < 0.95) out.push({ id: 'neutrophil', at: n.p.clone() });
      return out;
    },
    heal(x, z, dt) {
      plugs.forEach((pl, i) => {
        if (pl.cleared || Math.hypot(x - pl.p.x, z - pl.p.z) > 7) return;
        if (pl.hp === 1) onPlug(i, 'hit');
        pl.hp = Math.max(0, pl.hp - dt / 3.4); pl.shake = 1;
        if (pl.hp <= 0) { pl.cleared = true; onPlug(i, 'cleared'); health.heal(pl.p.x, pl.p.z, 18, 0.35); }
      });
      // 拍子に合わせると、よく治る（線毛の打つリズムがそろう）
      const onBeat = lung ? (breath(u.time.value) > 0.4 ? 2.0 : 1) : stage.beat() < 0.3 ? 2.2 : 1;
      const got = health.heal(x, z, tuning.beam.radius, tuning.beam.rate * dt * onBeat);
      health.clampFn(capAround); return got;
    },
    /** 拍子の位相（0〜1。0 付近が「打つ」瞬間）。照準の輪の脈打ちと、治りやすさに使う */
    beat: () => (lung ? (breath(u.time.value) < 0.4 ? 0.5 : (breath(u.time.value) - 0.4) / 0.6) : (u.time.value * BEAT) % 1),
    flowing: () => flowS,
    drift(p: THREE.Vector3) { if (lung) { const b = breath(u.time.value); return new THREE.Vector3(b < 0.4 ? 2.2 * Math.sin(b / 0.4 * Math.PI) : -1.4 * Math.sin((b - 0.4) / 0.6 * Math.PI), 0, 0); } return new THREE.Vector3(speed * flowAt(p.x, p.z) * (variant === 'B' ? 1 : 0.35), 0, 0); },
    update(dt, t, camera) {
      u.time.value = t; u.heartPhase.value += dt * 1.2;
      health.spread(dt, hc.regrow); health.clampFn(capAround);
      for (const pl of plugs) { pl.shake = Math.max(0, pl.shake - dt * 3); if (pl.cleared) pl.gone = Math.min(1, pl.gone + dt * 0.6); }
      const prog = progress(); flowS = prog;
      // 粘液の流れの速さ：実物 約 100µm/秒（6mm/分）を ×20 ゆっくり見て 約 5µm/秒。波がそろうほど速い
      speed = 5 * prog; flowX.value += speed * dt;
      u.lightIn.value += ((0.4 + 0.6 * prog) - u.lightIn.value) * Math.min(1, dt * 1.5);
      plugs.forEach((pl, i) => { const k = 1 - pl.gone; v.copy(pl.p).add(sv.set(Math.sin(t * 40 + i) * pl.shake * 0.12, 0, 0)); v.x += pl.gone * 8; v.y -= 1.2 * k; plugMesh.setMatrixAt(i, m4.compose(v, q.identity(), sv.set(5.5 * k + 0.01, 3.2 * k + 0.01, 5.5 * k + 0.01))); /* 粘液の面から盛り上がる、平たい塊 */ });
      plugMesh.instanceMatrix.needsUpdate = true;
      parts.forEach((pp, i) => {
        const stuck = pp.stuck >= 0 && !plugs[pp.stuck].cleared;
        if (!stuck) { pp.p.x += speed * flowAt(pp.p.x, pp.p.z) * dt; if (pp.p.x > W / 2) pp.p.x -= W; }
        q.setFromEuler(new THREE.Euler(pp.r, pp.r * 2 + t * 0.05, 0)); v.copy(pp.p); v.y = -0.25 * (pp.kind === 0 ? pp.s : 1) + Math.sin(t + i) * 0.04; /* 粘液に半分しずんでとらえられている */
        const s = pp.kind === 0 ? pp.s : 0, sb = pp.kind === 1 ? 1 : 0;
        dust.setMatrixAt(i, m4.compose(v, q, sv.set(s, s, s))); bac.setMatrixAt(i, m4.compose(v, q, sv.set(sb, sb, sb)));
      });
      dust.instanceMatrix.needsUpdate = bac.instanceMatrix.needsUpdate = true;
      neuts.forEach((n, i) => { const k = Math.max(0, 1 - prog * 1.2); n.p.x += Math.sin(t * 0.3 + i) * dt * 0.6; v.copy(n.p); v.y = 2.2 + 0.2 * Math.sin(t * 0.7 + i); neu.setMatrixAt(i, m4.compose(v, q.setFromEuler(new THREE.Euler(0, n.r + t * 0.05, 0)), sv.set(0.5 * k + 0.001, 0.5 * k + 0.001, 0.5 * k + 0.001))); });
      neu.instanceMatrix.needsUpdate = true;
      sun.intensity = 1.2 + 1.2 * u.lightIn.value;
      (scene.fog as THREE.FogExp2).color.setRGB(0.5 + 0.12 * prog, 0.38 + 0.08 * prog, 0.36 + 0.06 * prog);
      (scene.background as THREE.Color).copy((scene.fog as THREE.FogExp2).color).multiplyScalar(0.5);
      if (health.version !== hVersion) { health.toBytes(hBytes); hTex.needsUpdate = true; hVersion = health.version; }
      keyLightDirView.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
    },
  };
  (stage as unknown as { setDiver: (p: THREE.Vector3) => void }).setDiver = (p) => diverU.value.copy(p);
  void exp; void length; void smoothstep; void mix;
  return stage;
}
export const buildCilia = (r: THREE.WebGPURenderer, t: string, o?: { entrance?: boolean }) => build(r, t, 'A', o);
export const buildMucus = (r: THREE.WebGPURenderer, t: string, o?: { entrance?: boolean }) => build(r, t, 'B', o);
export const buildBronchiole = (r: THREE.WebGPURenderer, t: string, o?: { entrance?: boolean }) => build(r, t, 'L', o);

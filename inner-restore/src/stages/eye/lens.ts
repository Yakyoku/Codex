// ステージ1「目」— 区域B：水晶体の皮質
// 平たい六角形の帯（水晶体線維細胞。幅 10µm・厚み 2µm）が、広い面どうしを重ねて層になっている。
// 実際には細胞の間にすき間はないが、潜行士はスーツの力で2つの層の間を押し広げて進む（作り事。案内で伝える）。
// 白内障：線維の中のクリスタリン（透明なタンパク質）が形を崩して固まり、50〜500nm の粒になって光を散らす。
// 固有の遊び「光を導く」：濁りを晴らすほど、瞳から入った光が層の奥まで届く。単位は µm。
import * as THREE from 'three/webgpu';
import { tsl, type N } from '../../core/tsl';
import { loadGLB, makeEnvironment } from '../../core/assets';
import { HealthField } from '../../core/health';
import type { ZoneStage, ZoneMeta, Plug } from '../zone';
import { keyLightDirView } from '../../materials/cell';
import tuning from '../../data/tuning.json';

const { uniform, texture, positionWorld, normalView, positionViewDirection, vec2, float, color, mix, smoothstep, sin, exp, pow, dot, saturate, length } = tsl;

const META: ZoneMeta = {
  id: 'lens', hud: '水晶体・皮質　透明さの回復', swimCeil: 6,
  arrive: 'こちらオペレーター。水晶体の中です。六角形の帯は、水晶体線維細胞。本当はすき間なく重なっていますが、スーツの力で層の間を押し広げて進みます。白く濁っているのは、固まったタンパクの粒です。光を通る道を晴らしてください。',
  plugName: '凝集の核', plugHit: '濃い粒の塊に当たっています。固まったクリスタリンの集まりです。当て続けて、ほどいてください。',
  plugCleared: (left) => (left ? `塊がほどけて、光が奥へ通りはじめました。残りは ${left} か所です。` : 'すべての塊がほどけました。光が、層の奥まで届きます。'),
  done: '水晶体が透明さを取り戻しました。光が、まっすぐ奥へ通ります。', doneTitle: '光の通り道が開きました', causeMain: 'クリスタリンの凝集（白内障）',
  plugDiag: { short: '凝集の核（固まったタンパクの塊）', cause: '形を崩したクリスタリンが大きな塊になり、光をさえぎっています。光を当て続けてほどくと、光が奥へ通ります' },
};

export async function buildLens(renderer: THREE.WebGPURenderer, tier: string): Promise<ZoneStage> {
  const W = 150, D = 80, GAP = 8;
  const rich = tier === 'pc-high', vr = tier === 'vr';
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png');
  noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.colorSpace = THREE.NoColorSpace;
  const gltf = await loadGLB('/static/models/lens.glb');
  const geos: Record<string, THREE.BufferGeometry> = {};
  gltf.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.updateWorldMatrix(true, false); geos[m.name] = m.geometry.clone().applyMatrix4(m.matrixWorld); } });
  const scene = new THREE.Scene();
  // 水晶体の中は透明で、前（-x）から瞳の光が差し込む。濁っている間は乳白色にかすむ
  scene.background = new THREE.Color(0x16181a);
  scene.fog = new THREE.FogExp2(0x6c6862, 0.012);
  scene.environment = makeEnvironment(renderer, new THREE.Color(0.85, 0.82, 0.8)); scene.environmentIntensity = 0.22;

  const hc = tuning.health;
  const health = new HealthField(hc.gridW, Math.round(hc.gridW * D / W), W, D, 0.2);
  const hBytes = new Uint8Array(health.w * health.h);
  const hTex = new THREE.DataTexture(health.toBytes(hBytes), health.w, health.h, THREE.RedFormat, THREE.UnsignedByteType);
  hTex.magFilter = hTex.minFilter = THREE.LinearFilter; hTex.needsUpdate = true; let hVersion = -1;
  const u = {
    time: uniform(0), scan: uniform(0), lightIn: uniform(0.3), heartPhase: uniform(0),
    beamPos: uniform(new THREE.Vector3(0, -999, 0)), beamOn: uniform(0),
    scanR: uniform(0), scanOrigin: uniform(new THREE.Vector3()), scanPulse: uniform(0),
  };
  const reach = uniform(-W / 2);   // 瞳の光が届いている所（x）
  const hUV = vec2(positionWorld.x.div(W).add(0.5), positionWorld.z.div(D).add(0.5));
  const H: N = texture(hTex, hUV).r;
  const fres = pow(float(1).sub(saturate(dot(normalView, positionViewDirection).abs())), float(3.0));
  const scanCol = mix(color(0xffa040), color(0x5fe8d0), H);
  const scanRing = exp(length(positionWorld.xz.sub(u.scanOrigin.xz)).sub(u.scanR).div(0.9).pow(2).negate()).mul(u.scanPulse);
  const beamGlow = exp(length(positionWorld.xz.sub(u.beamPos.xz)).div(tuning.beam.radius * 0.55).pow(2).negate()).mul(u.beamOn);
  // 光の届き具合：届いた所は、層の中が淡く光る（前の縁はやわらかく、少し揺らぐ）
  const wave = texture(noiseTex, vec2(positionWorld.x.mul(0.01).sub(u.time.mul(0.02)), positionWorld.z.mul(0.02))).g;
  const lit: N = smoothstep(reach.add(6), reach.sub(10), positionWorld.x.add(wave.mul(8)));
  const sick = float(1).sub(H);

  // ---- 線維の層 ----
  const fiberMat = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false, side: THREE.FrontSide });
  const n1 = texture(noiseTex, positionWorld.xz.mul(1 / 9)).b;
  // 健康：ほとんど無色透明（層の重なりがうっすら分かる程度）。白内障：灰白色〜乳白色に濁る
  fiberMat.colorNode = mix(mix(color(0xd8e2ea), color(0xcfd8de), n1), mix(color(0xd6cfc6), color(0xc4bcb2), n1), sick);
  fiberMat.roughnessNode = mix(float(0.08), float(0.45), sick);
  fiberMat.metalnessNode = float(0);
  if (rich) { fiberMat.clearcoatNode = float(0.6); fiberMat.clearcoatRoughnessNode = float(0.12); }
  const haze = sick.mul(mix(float(0.45), float(0.75), n1));
  fiberMat.opacityNode = saturate(haze.add(fres.mul(mix(float(0.12), float(0.3), sick))).add(0.025));
  fiberMat.specularIntensityNode = float(0.7);
  fiberMat.emissiveNode = color(0xfff1dc).mul(lit.mul(mix(float(0.03), float(0.07), H)).mul(fres.mul(0.8).add(0.2)))
    .add(color(0xf4ece4).mul(haze.mul(lit.mul(0.3).add(0.03))))
    .add(color(0xffe9c8).mul(beamGlow.mul(0.4))).add(scanCol.mul(u.scan).mul(fres.mul(0.5).add(0.05))).add(scanCol.mul(scanRing.mul(0.8)));
  const segs = Object.keys(geos).filter((k) => k.startsWith('fiber')).map((k) => geos[k]);
  const layers: [number, number][] = vr ? [[-1, 0], [GAP + 1, 5]] : [[-1, 0], [-3, 5], [GAP + 1, 5]];
  const perLayer = Math.ceil(W / 40 + 1) * Math.ceil(D / 10 + 1);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  segs.forEach((g, si) => {
    const mesh = new THREE.InstancedMesh(g, fiberMat, perLayer * layers.length); let k = 0;
    layers.forEach(([y, off], li) => {
      for (let ix = 0; ix * 40 < W + 40; ix++) for (let iz = 0; iz * 10 < D + 10; iz++) {
        if ((ix + iz * 2 + li) % segs.length !== si) continue;
        v.set(-W / 2 - 20 + ix * 40 + ((iz * 13) % 40) * 0.5, y, -D / 2 - 5 + iz * 10 + off);
        mesh.setMatrixAt(k++, m4.compose(v, q.identity(), one));
      }
    });
    mesh.count = k; mesh.renderOrder = 20; mesh.frustumCulled = false; scene.add(mesh);
  });

  // ---- 固まったタンパクの粒（50〜500nm。潜行士から見ると、細かな白い粒の霧）----
  const grainGeo = geos.grain;
  const grainMat = new THREE.MeshStandardNodeMaterial({ transparent: true, depthWrite: false });
  grainMat.colorNode = color(0xd8d2ca); grainMat.roughnessNode = float(0.7);
  grainMat.opacityNode = float(0.75); grainMat.emissiveNode = color(0xfff4e8).mul(lit.mul(0.25).add(0.05));
  const NG = vr ? 2500 : rich ? 7000 : 4500;
  const grains = new THREE.InstancedMesh(grainGeo, grainMat, NG); grains.frustumCulled = false; grains.renderOrder = 25; scene.add(grains);
  let sd = 11; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const gp: { p: THREE.Vector3; s: number; plug: number; ph: number }[] = [];
  // 塊（凝集の核）を3つ、光の通り道（中央の帯）をふさぐ位置に
  const cores = [-0.28, 0.05, 0.33].map((fx, i) => new THREE.Vector3(fx * W, 3.2, (i === 1 ? 0.12 : -0.1) * D));
  for (let i = 0; i < NG; i++) {
    const inPlug = i < NG * 0.36 ? Math.floor((i / (NG * 0.36)) * 3) : -1;
    let p: THREE.Vector3;
    if (inPlug >= 0) { const c = cores[inPlug]; const r = 4.6 * Math.cbrt(rnd()); const th = rnd() * 6.283, ph = Math.acos(2 * rnd() - 1); p = new THREE.Vector3(c.x + r * Math.sin(ph) * Math.cos(th), Math.max(0.3, c.y + r * Math.cos(ph) * 0.8), c.z + r * Math.sin(ph) * Math.sin(th)); }
    else p = new THREE.Vector3((rnd() - 0.5) * W, 0.3 + rnd() * (GAP - 0.6), (rnd() - 0.5) * D);
    gp.push({ p, s: (0.1 + rnd() * rnd() * 0.2) * (inPlug >= 0 ? 2.2 : 1), plug: inPlug, ph: rnd() * 6.28 });   // 直径 0.1〜0.3µm（実物 50〜200nm よりわずかに大きく見せる）。塊は粒が寄り集まって大きくなる
  }
  const plugs: (Plug & { gone: number; shake: number })[] = cores.map((c) => ({ p: c, hp: 1, cleared: false, gone: 0, shake: 0 }));
  const capAround = (x: number, z: number) => { let cap = 1; for (const pl of plugs) if (!pl.cleared) { const d = Math.hypot(x - pl.p.x, z - pl.p.z); if (d < 20) cap = Math.min(cap, 0.3 + 0.7 * Math.max(0, (d - 10) / 10)); } return cap; };
  health.setFn((x, z) => { let k = 0; for (const c of cores) k = Math.max(k, Math.exp(-((x - c.x) ** 2 + (z - c.z) ** 2) / 500)); return 0.22 - 0.2 * k + 0.04 * Math.sin(x * 0.07 + z * 0.05); });
  const startMean = health.mean();
  const plugsLeft = () => plugs.filter((p) => !p.cleared).length;
  const progress = () => Math.min(plugsLeft() ? 0.9 : 1, Math.max(0, (health.mean() - startMean) / (hc.doneAt - startMean)));
  const sc = new THREE.Vector3();
  function updateGrains(t: number) {
    for (let i = 0; i < NG; i++) {
      const g = gp[i]; const h = health.sample(g.p.x, g.p.z);
      let s = g.s * Math.min(1, Math.max(0, (0.78 - h) / 0.5));       // 治るほど粒は溶けて小さくなる
      v.copy(g.p); v.y += Math.sin(t * 0.4 + g.ph) * 0.08;
      if (g.plug >= 0) { const pl = plugs[g.plug]; s = g.s * 1.2 * (1 - pl.gone); v.x += Math.sin(t * 37 + i) * pl.shake * 0.1; v.addScaledVector(sc.subVectors(g.p, pl.p).normalize(), pl.gone * 6); }
      grains.setMatrixAt(i, m4.compose(v, q.identity(), sc.set(s, s, s)));
    }
    grains.instanceMatrix.needsUpdate = true;
  }

  // ---- 光：前（-x）の上から差し込む瞳の光と、層の間を通る光の帯 ----
  const sun = new THREE.DirectionalLight(0xfff4e6, 1.4); sun.position.set(-80, 50, 10); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xe8eef4, 0x3a3632, 0.35); scene.add(hemi);
  {
    const g = new THREE.BoxGeometry(W * 1.4, GAP - 0.4, D * 1.2); g.translate(0, GAP / 2, 0);
    const m = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide, fog: false });
    const streak = texture(noiseTex, vec2(positionWorld.x.mul(0.004).sub(u.time.mul(0.01)), positionWorld.z.mul(0.03))).g;
    // 光の筋：細い帯だけが光る（画面全体を一様に明るくしない）
    m.colorNode = color(0xfff0dc).mul(lit.mul(smoothstep(0.55, 0.85, streak).mul(0.09).add(0.006))).mul(u.lightIn);
    const slab = new THREE.Mesh(g, m); slab.renderOrder = 40; scene.add(slab);
  }
  let flowS = 0;
  let onPlug: (i: number, kind: 'hit' | 'cleared') => void = () => {};
  const floorHeight = () => 0;
  const stage: ZoneStage = {
    meta: META, scene, health, size: [W, D], u, floorHeight, sun, plugs, progress,
    start: { pos: new THREE.Vector3(-W / 2 + 10, 0, 0), yaw: Math.PI / 2, swimming: false },
    causeAt: () => ({ short: '白濁（タンパクの凝集）', cause: '線維の中のクリスタリンが形を崩して固まり、光を散らしています' }),
    setOnPlug(f) { onPlug = f; },
    encounters(pos, t) {
      const out: { id: string; at: THREE.Vector3 | null }[] = [];
      if (t > 3) out.push({ id: 'lens_fiber', at: null });
      for (const pl of plugs) if (!pl.cleared && Math.hypot(pl.p.x - pos.x, pl.p.z - pos.z) < 22) out.push({ id: 'crystallin_aggregate', at: pl.p });
      return out;
    },
    heal(x, z, dt) {
      plugs.forEach((pl, i) => {
        if (pl.cleared || Math.hypot(x - pl.p.x, z - pl.p.z) > 7) return;
        if (pl.hp === 1) onPlug(i, 'hit');
        pl.hp = Math.max(0, pl.hp - dt / 3.4); pl.shake = 1;
        if (pl.hp <= 0) { pl.cleared = true; onPlug(i, 'cleared'); health.heal(pl.p.x, pl.p.z, 18, 0.35); }
      });
      const got = health.heal(x, z, tuning.beam.radius, tuning.beam.rate * dt);
      health.clampFn(capAround); return got;
    },
    flowing: () => flowS,
    update(dt, t, camera) {
      u.time.value = t; u.heartPhase.value += dt * 1.2;
      health.spread(dt, hc.regrow); health.clampFn(capAround);
      for (const pl of plugs) { pl.shake = Math.max(0, pl.shake - dt * 3); if (pl.cleared) pl.gone = Math.min(1, pl.gone + dt * 0.7); }
      // 光の届く所：前から、中央の帯の濁りが晴れている所まで
      let rx = -W / 2;
      for (let x = -W / 2; x <= W / 2; x += 3) { let s = 0; for (let z = -12; z <= 12; z += 6) s += health.sample(x, z); if (s / 5 < 0.5 || plugs.some((p) => !p.cleared && Math.abs(p.p.x - x) < 5 && Math.abs(p.p.z) < 14)) break; rx = x; }
      reach.value += (rx + 4 - reach.value) * Math.min(1, dt * 1.5);
      flowS = (reach.value + W / 2) / W;
      const prog = progress();
      u.lightIn.value += ((0.3 + 0.7 * prog) - u.lightIn.value) * Math.min(1, dt * 1.5);
      (scene.fog as THREE.FogExp2).density = 0.016 - 0.01 * prog;
      (scene.fog as THREE.FogExp2).color.setRGB(0.4 - 0.32 * prog, 0.38 - 0.3 * prog, 0.36 - 0.27 * prog);
      (scene.background as THREE.Color).copy((scene.fog as THREE.FogExp2).color).multiplyScalar(0.6);
      sun.intensity = 0.8 + 1.6 * u.lightIn.value;
      if (health.version !== hVersion) { health.toBytes(hBytes); hTex.needsUpdate = true; hVersion = health.version; updateGrains(t); }
      else if (plugs.some((p) => p.shake > 0 || (p.cleared && p.gone < 1))) updateGrains(t);
      keyLightDirView.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
    },
  };
  updateGrains(0);
  return stage;
}

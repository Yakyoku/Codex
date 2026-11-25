// ステージ2「鼻」— 区域C：嗅上皮（においを感じる粘膜）→ 病巣の核：炎症の中心（単位 µm、知覚加速 ×20）
// 事実（Docs/REFERENCE/nose.md）：嗅細胞は鼻の奥の天井の嗅上皮に 約 1,000万個。樹状突起の先のふくらみから、動かない長い線毛（10〜30本、長さ 最大 約100µm）が粘液の中に伸びる。
//   まわりを支持細胞が囲む。かぜのウイルスの一部（新型コロナウイルスなど）は、主に支持細胞に感染し、そのために嗅細胞が働けなくなると考えられている。
// 簡略化：嗅細胞の間隔は 約 5µm。においの分子（約 1nm）は見えないので、スーツが光の点で示す（作り事の表示）。
import * as THREE from 'three/webgpu';
import { tsl, type N } from '../../core/tsl';
import { loadGLB, makeEnvironment } from '../../core/assets';
import { HealthField } from '../../core/health';
import type { ZoneStage, ZoneMeta, Plug } from '../zone';
import { keyLightDirView } from '../../materials/cell';
import { epithelium, mucusLayer, PCL, GEL } from './common';
import tuning from '../../data/tuning.json';

const { uniform, texture, positionWorld, vec2, float, color, mix, exp, length, smoothstep, sin, pointUV, saturate } = tsl;
export const OLF_META: ZoneMeta = {
  id: 'olfactory', hud: '鼻・嗅上皮　においを感じる力の回復', perception: 20, scaleNote: '潜行士の身長 2µm ／ 嗅細胞の線毛 最大 約100µm', patient: 'smell', swimCeil: 18,
  arrive: 'こちらオペレーター。鼻の奥の天井、嗅上皮です。粘液の中に寝そべる長い糸は、嗅細胞の線毛。まわりを支える支持細胞が傷み、嗅細胞が働けなくなっています。においの分子は小さすぎて見えないので、スーツが光の点で示します。',
  plugName: '炎症の中心', plugHit: '炎症の中心です。手当てを始めると、まわりへ炎症の波が広がります。嗅細胞を守りながら、ほどいてください。',
  plugCleared: (l) => (l ? `炎症の中心が一つおさまりました。残りは ${l} か所です。` : 'すべての炎症の中心がおさまりました。においの分子が、嗅細胞に届きます。'),
  done: '嗅細胞が、においの分子をとらえました。信号が脳へ向かいます。', doneTitle: 'においが戻りました', causeMain: '支持細胞の傷みと炎症',
  plugDiag: { short: '炎症の中心', cause: '支持細胞が傷み、炎症が続いています。光を当て続けておさめてください（手当てを始めると、炎症の波が広がります）' },
};

export async function buildOlfactory(renderer: THREE.WebGPURenderer, tier: string): Promise<ZoneStage> {
  const W = 110, D = 70, rich = tier === 'pc-high', vr = tier === 'vr';
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png');
  noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.colorSpace = THREE.NoColorSpace;
  const gltf = await loadGLB('/static/models/nose.glb');
  const geos: Record<string, THREE.BufferGeometry> = {};
  gltf.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.updateWorldMatrix(true, false); geos[m.name] = m.geometry.clone().applyMatrix4(m.matrixWorld); } });
  const scene = new THREE.Scene();
  // 嗅上皮は、鼻の奥の天井の、黄色みを帯びた茶色の粘膜（呼吸上皮の桃色とちがう）
  scene.background = new THREE.Color(0x2e2420); scene.fog = new THREE.FogExp2(0x7a6650, 0.012);
  scene.environment = makeEnvironment(renderer, new THREE.Color(0.85, 0.7, 0.55)); scene.environmentIntensity = 0.35;
  const hc = tuning.health;
  const health = new HealthField(hc.gridW, Math.round(hc.gridW * D / W), W, D, 0.2);
  const hBytes = new Uint8Array(health.w * health.h);
  const hTex = new THREE.DataTexture(health.toBytes(hBytes), health.w, health.h, THREE.RedFormat, THREE.UnsignedByteType);
  hTex.magFilter = hTex.minFilter = THREE.LinearFilter; hTex.needsUpdate = true; let hVersion = -1;
  const u = { time: uniform(0), scan: uniform(0), lightIn: uniform(0.4), heartPhase: uniform(0), beamPos: uniform(new THREE.Vector3(0, -999, 0)), beamOn: uniform(0), scanR: uniform(0), scanOrigin: uniform(new THREE.Vector3()), scanPulse: uniform(0) };
  const H: N = texture(hTex, vec2(positionWorld.x.div(W).add(0.5), positionWorld.z.div(D).add(0.5))).r;
  const floorY = -(PCL + GEL);
  const core = new THREE.Vector3(W * 0.28, 0, 0);
  const waveR = uniform(0), waveOn = uniform(0), bootR = uniform(-1);
  const dC = length(positionWorld.xz.sub(vec2(core.x, core.z)));
  const waveRing = exp(dC.sub(waveR).div(2.5).pow(2).negate()).mul(waveOn);
  const bootRing = exp(dC.sub(bootR).div(5).pow(2).negate()).mul(smoothstep(-1, 0, bootR));
  // 床：支持細胞の頂面（嗅上皮の色）
  const epi = epithelium(W, D, H, noiseTex); epi.position.y = floorY - 0.05;
  const em = epi.material as THREE.MeshStandardNodeMaterial;
  em.colorNode = mix(color(0x8a6a56), color(0xc8a07a), H).mul(texture(noiseTex, positionWorld.xz.mul(1 / 4)).g.mul(0.15).add(0.9));
  em.emissiveNode = color(0xff7a40).mul(waveRing.mul(0.5)).add(color(0xfff0d0).mul(bootRing.mul(0.6)));
  scene.add(epi);
  const muc = mucusLayer(W, D, H, noiseTex, float(0), rich); scene.add(muc);
  // ---- 嗅細胞（先のふくらみ＋寝そべる長い線毛）----
  const list: { p: THREE.Vector3; r: number; s: number; lit: number }[] = [];
  let sd = 77; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const SP = vr ? 7 : 5;
  for (let x = -W / 2; x < W / 2; x += SP) for (let z = -D / 2; z < D / 2; z += SP) list.push({ p: new THREE.Vector3(x + (rnd() - 0.5) * SP * 0.8, floorY, z + (rnd() - 0.5) * SP * 0.8), r: rnd() * 6.28, s: 0.3, lit: 0 });
  const knobMat = new THREE.MeshPhysicalNodeMaterial({ transparent: true });
  knobMat.colorNode = mix(color(0x8a8078), color(0xf0e6da), H); knobMat.roughnessNode = float(0.35); knobMat.opacityNode = float(0.9);
  const litU = uniform(0);
  knobMat.emissiveNode = color(0xffc070).mul(waveRing.mul(0.6)).add(color(0xfff2d8).mul(bootRing.mul(1.5)));
  const knobs = new THREE.InstancedMesh(geos.olfknob, knobMat, list.length); knobs.frustumCulled = false; scene.add(knobs);
  // においを感じた瞬間の光（信号）：ふくらみが短く光る
  const flashGeo = new THREE.PlaneGeometry(6, 6);
  const fm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const fr = length(tsl.uv().sub(0.5)).mul(2);
  fm.colorNode = color(0xffd8a0).mul(exp(fr.mul(fr).mul(-6)));
  const flashes = new THREE.InstancedMesh(flashGeo, fm, list.length); flashes.frustumCulled = false; flashes.renderOrder = 50; scene.add(flashes);
  // ---- 炎症の中心（3つ）：赤く腫れた支持細胞のかたまりと、集まった好中球 ----
  const plugs: (Plug & { gone: number; shake: number })[] = [[-8, -8], [9, -4], [0, 9]].map(([dx, dz]) => ({ p: new THREE.Vector3(core.x + dx, 0, core.z + dz), hp: 1, cleared: false, gone: 0, shake: 0 }));
  const swMat = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); swMat.colorNode = color(0xc0604a); swMat.roughnessNode = float(0.5); swMat.opacityNode = float(0.85);
  swMat.emissiveNode = color(0xff5a30).mul(sin(u.time.mul(2.4)).mul(0.08).add(0.12));
  const sw = new THREE.InstancedMesh(geos.plug, swMat, 3); sw.frustumCulled = false; scene.add(sw);
  const neuMat = new THREE.MeshPhysicalNodeMaterial({ transparent: true }); neuMat.colorNode = color(0xece4dc); neuMat.roughnessNode = float(0.4); neuMat.opacityNode = float(0.75);
  const neu = new THREE.InstancedMesh(geos.neutro, neuMat, 6); neu.frustumCulled = false; scene.add(neu);
  // ---- においの分子（スーツの表示。上の空気から粘液へ溶けこむ）----
  const NO = vr ? 60 : 140; const op = new Float32Array(NO * 3), ov: number[] = [];
  for (let i = 0; i < NO; i++) { op[i * 3] = (rnd() - 0.5) * W; op[i * 3 + 1] = rnd() * 16; op[i * 3 + 2] = (rnd() - 0.5) * D; ov.push(0.6 + rnd() * 0.8); }
  const og = new THREE.BufferGeometry(); og.setAttribute('position', new THREE.BufferAttribute(op, 3));
  const omat = new THREE.PointsNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  omat.colorNode = color(0xffe0a8).mul(saturate(float(1).sub(length(pointUV.sub(0.5)).mul(2))).pow(2)).mul(u.lightIn); omat.sizeNode = float(0.5);
  const odor = new THREE.Points(og, omat); odor.frustumCulled = false; scene.add(odor);

  const capAround = (x: number, z: number) => { let cap = 1; for (const pl of plugs) if (!pl.cleared) { const d = Math.hypot(x - pl.p.x, z - pl.p.z); if (d < 16) cap = Math.min(cap, 0.3 + 0.7 * Math.max(0, (d - 8) / 8)); } return cap; };
  health.setFn((x, z) => 0.24 - 0.14 * Math.exp(-((x - core.x) ** 2 + (z - core.z) ** 2) / 1200) + 0.04 * Math.sin(x * 0.07) * Math.cos(z * 0.09));
  const startMean = health.mean();
  const plugsLeft = () => plugs.filter((p) => !p.cleared).length;
  const progress = () => Math.min(plugsLeft() ? 0.9 : 1, Math.max(0, (health.mean() - startMean) / (hc.doneAt - startMean)));
  const sun = new THREE.DirectionalLight(0xfff0e0, 1.6); sun.position.set(-30, 80, 20); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xffeedd, 0x7a4a30, 0.8); scene.add(hemi);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3();
  let onPlug: (i: number, kind: 'hit' | 'cleared' | 'pulse') => void = () => {};
  let fight = false, waveT = 0, flowS = 0, booted = false;
  const stage: ZoneStage = {
    meta: OLF_META, scene, health, size: [W, D], u, sun, plugs, progress, floorHeight: () => 0,
    start: { pos: new THREE.Vector3(-W / 2 + 10, 0, 0), yaw: Math.PI / 2, swimming: false },
    causeAt: (x, z) => (Math.hypot(x - core.x, z - core.z) < 26 ? { short: '炎症', cause: '支持細胞が傷み、炎症が続いています' } : { short: '嗅細胞の働きの低下', cause: '支える支持細胞が傷み、嗅細胞がにおいの分子をとらえられません' }),
    setOnPlug(f) { onPlug = f; },
    encounters(pos, t, walked) {
      const out: { id: string; at: THREE.Vector3 | null }[] = [];
      const n = list.find((k) => Math.hypot(k.p.x - pos.x, k.p.z - pos.z) < 8);
      if (t > 3 && n) out.push({ id: 'olfactory_neuron', at: n.p.clone().setY(floorY + 1) });
      if (walked > 16) out.push({ id: 'sustentacular_cell', at: null });
      if (progress() > 0.3) out.push({ id: 'odorant', at: null });
      for (const pl of plugs) if (!pl.cleared && pl.p.distanceTo(pos) < 20) out.push({ id: 'neutrophil', at: pl.p.clone().setY(2) });
      return out;
    },
    heal(x, z, dt) {
      plugs.forEach((pl, i) => {
        if (pl.cleared || Math.hypot(x - pl.p.x, z - pl.p.z) > 7) return;
        if (pl.hp === 1) { onPlug(i, 'hit'); fight = true; waveT = 2; }
        pl.hp = Math.max(0, pl.hp - dt / 4.2); pl.shake = 1;
        if (pl.hp <= 0) { pl.cleared = true; onPlug(i, 'cleared'); health.heal(pl.p.x, pl.p.z, 16, 0.35); }
      });
      const got = health.heal(x, z, tuning.beam.radius, tuning.beam.rate * dt); health.clampFn(capAround); return got;
    },
    flowing: () => flowS,
    update(dt, t, camera) {
      u.time.value = t; u.heartPhase.value += dt * 1.2;
      health.spread(dt, hc.regrow); health.clampFn(capAround);
      for (const pl of plugs) { pl.shake = Math.max(0, pl.shake - dt * 3); if (pl.cleared) pl.gone = Math.min(1, pl.gone + dt * 0.6); }
      // 対決：残った炎症の中心の数だけ強い波（約 7 秒ごと）
      if (fight && plugsLeft()) {
        waveT -= dt; if (waveT <= 0) { waveT = 7; waveR.value = 0; waveOn.value = 1; onPlug(-1, 'pulse'); }
        if (waveOn.value > 0) {
          waveR.value += dt * 12; waveOn.value = Math.max(0, 1 - waveR.value / 36);
          const R = waveR.value, amt = dt * 0.5 * plugsLeft() / 3;
          for (let j = 0; j < health.h; j++) for (let i = 0; i < health.w; i++) { const x = (i / (health.w - 1) - 0.5) * W, z = (j / (health.h - 1) - 0.5) * D; if (Math.abs(Math.hypot(x - core.x, z - core.z) - R) < 3) { const k = j * health.w + i; health.data[k] = Math.max(0.12, health.data[k] - amt); } }
          health.version++;
        }
      } else waveOn.value = Math.max(0, waveOn.value - dt);
      const prog = progress(); flowS = prog;
      if (!booted && prog >= 1) { booted = true; bootR.value = 0; }
      if (booted) bootR.value += dt * 20;
      u.lightIn.value += ((0.4 + 0.6 * prog) - u.lightIn.value) * Math.min(1, dt * 1.5);
      // 嗅細胞：健康なほど線毛が伸び（傷むと縮む）、においの分子が近くに来ると光る
      list.forEach((k, i) => {
        const h = health.sample(k.p.x, k.p.z); k.s += ((0.25 + 0.75 * Math.min(1, Math.max(0, (h - 0.2) / 0.55))) - k.s) * Math.min(1, dt * 1.2);
        k.lit = Math.max(0, k.lit - dt * 1.5);
        knobs.setMatrixAt(i, m4.compose(v.copy(k.p), q.setFromAxisAngle(sv.set(0, 1, 0), k.r), sv.set(k.s, 1, k.s)));
        const f = k.lit; flashes.setMatrixAt(i, m4.compose(v.copy(k.p).setY(floorY + 2), camera.quaternion, sv.set(f + 0.001, f + 0.001, f + 0.001)));
      });
      for (let i = 0; i < NO; i++) {
        op[i * 3 + 1] -= dt * ov[i]; if (op[i * 3 + 1] < floorY + 1.5) {
          // 届いた所の嗅細胞が健康なら、光る（においを感じた）
          const x = op[i * 3], z = op[i * 3 + 2]; if (health.sample(x, z) > 0.6) { const k = list.reduce((b, c) => (Math.hypot(c.p.x - x, c.p.z - z) < Math.hypot(b.p.x - x, b.p.z - z) ? c : b), list[0]); k.lit = 1; }
          op[i * 3] = (rnd() - 0.5) * W; op[i * 3 + 1] = 16; op[i * 3 + 2] = (rnd() - 0.5) * D;
        }
      }
      (og.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      knobs.instanceMatrix.needsUpdate = flashes.instanceMatrix.needsUpdate = true;
      plugs.forEach((pl, i) => { const k = 1 - pl.gone; v.copy(pl.p).setY(floorY + 0.5); v.x += Math.sin(t * 40 + i) * pl.shake * 0.12; sw.setMatrixAt(i, m4.compose(v, q.identity(), sv.set(6 * k + 0.01, 6 * k + 0.01, 3 * k + 0.01))); });
      sw.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < 6; i++) { const pl = plugs[i % 3], k = pl.cleared ? Math.max(0, 1 - pl.gone * 1.5) : 1; v.copy(pl.p).add(sv.set(Math.cos(i * 2.1 + t * 0.1) * 6, 1.5, Math.sin(i * 2.1 + t * 0.1) * 6)); neu.setMatrixAt(i, m4.compose(v, q.setFromEuler(new THREE.Euler(-Math.PI / 2, i, 0)), sv.set(0.45 * k + 0.001, 0.45 * k + 0.001, 0.45 * k + 0.001))); }
      neu.instanceMatrix.needsUpdate = true;
      litU.value = prog; sun.intensity = 1.1 + 1.3 * u.lightIn.value;
      (scene.fog as THREE.FogExp2).color.setRGB(0.44 + 0.14 * prog, 0.38 + 0.1 * prog, 0.3 + 0.06 * prog);
      (scene.background as THREE.Color).copy((scene.fog as THREE.FogExp2).color).multiplyScalar(0.5);
      if (health.version !== hVersion) { health.toBytes(hBytes); hTex.needsUpdate = true; hVersion = health.version; }
      keyLightDirView.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
    },
  };
  void mix;
  return stage;
}

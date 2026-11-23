// ステージ1「目」— 区域C：視細胞の森 → 病巣の核：黄斑の中心
// 足もとは網膜色素上皮（暗い色素を持つ六角形の細胞）。そこから桿体と錐体が森のように立つ（外節 25〜35µm）。
// 病んだ所では外節が傷んで短くなり、治すとその場で伸びて森が戻る。
// 病巣の核：黄斑の中心（中心窩。錐体だけが細く密に並ぶ）の色素上皮の下にたまったドルーゼン（沈着物）。
//   最初に光を当てると、傷んだ色素上皮から、まわりの視細胞を弱らせる波が広がりはじめる（対決）。
//   ドルーゼンをすべてほどくと、光が中心窩に届き、森全体に光が走る（器官の再起動）。
// 簡略化：視細胞の間隔は実物（2.7〜3.4µm）より広い 4.6µm、中心窩の広さも縮めてある（歩いて通れるように）。単位は µm。
import * as THREE from 'three/webgpu';
import { tsl, type N } from '../../core/tsl';
import { loadGLB, makeEnvironment } from '../../core/assets';
import { HealthField } from '../../core/health';
import type { ZoneStage, ZoneMeta, Plug } from '../zone';
import { keyLightDirView } from '../../materials/cell';
import tuning from '../../data/tuning.json';

const { uniform, texture, positionWorld, positionLocal, normalView, positionViewDirection, cameraPosition, vec2, float, color, mix, smoothstep, sin, exp, pow, dot, saturate, length, fract, abs } = tsl;

const META: ZoneMeta = {
  id: 'photo', hud: '視細胞の層　光を受ける力の回復', swimCeil: 56,
  arrive: 'こちらオペレーター。視細胞の層に着きました。足もとの暗い六角形は網膜色素上皮、立ち並ぶ柱が桿体と錐体です。傷んで短くなった視細胞を治しながら、奥の黄斑の中心へ向かってください。',
  plugName: 'ドルーゼン', plugHit: '黄斑の中心の、色素上皮の下の沈着物、ドルーゼンです。傷んだ色素上皮から、まわりを弱らせる波が出ています。波に負けないよう、視細胞を守りながらほどいてください。',
  plugCleared: (left) => (left ? `ドルーゼンが一つほどけました。残りは ${left} つです。` : 'すべてのドルーゼンがほどけました。光が、中心窩に届きます。'),
  done: '光が中心窩に届きました。視細胞が、光を受け止めています。', doneTitle: '目が、ふたたび光をとらえました', causeMain: '視細胞の外節の傷み／黄斑のドルーゼン',
  plugDiag: { short: 'ドルーゼン（色素上皮の下の沈着物）', cause: '黄斑の中心で色素上皮を押し上げ、まわりの視細胞を弱らせています。光を当て続けてほどいてください' },
};

export async function buildPhoto(renderer: THREE.WebGPURenderer, tier: string): Promise<ZoneStage> {
  const W = 150, D = 100;
  const rich = tier === 'pc-high', vr = tier === 'vr';
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png');
  noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.colorSpace = THREE.NoColorSpace;
  const gltf = await loadGLB('/static/models/photo.glb');
  const geos: Record<string, THREE.BufferGeometry> = {};
  gltf.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.updateWorldMatrix(true, false); geos[m.name] = m.geometry.clone().applyMatrix4(m.matrixWorld); } });
  const scene = new THREE.Scene();
  // 視細胞の層は、上（硝子体の側）から網膜を通った光が届く。下の色素上皮は暗く、光を吸う
  scene.background = new THREE.Color(0x1a1012);
  scene.fog = new THREE.FogExp2(0x4a3034, 0.011);
  scene.environment = makeEnvironment(renderer, new THREE.Color(0.8, 0.55, 0.5)); scene.environmentIntensity = 0.25;

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
  const fovea = new THREE.Vector3(W * 0.3, 0, 0);
  const waveR = uniform(0), waveOn = uniform(0), bootR = uniform(-1);   // 弱らせる波／再起動の光の波
  const hUV = vec2(positionWorld.x.div(W).add(0.5), positionWorld.z.div(D).add(0.5));
  const H: N = texture(hTex, hUV).r;
  const sick = float(1).sub(H);
  const fres = pow(float(1).sub(saturate(dot(normalView, positionViewDirection).abs())), float(2.5));
  const scanCol = mix(color(0xffa040), color(0x5fe8d0), H);
  const dF = length(positionWorld.xz.sub(vec2(fovea.x, fovea.z)));
  const scanRing = exp(length(positionWorld.xz.sub(u.scanOrigin.xz)).sub(u.scanR).div(0.9).pow(2).negate()).mul(u.scanPulse);
  const beamGlow = exp(length(positionWorld.xz.sub(u.beamPos.xz)).div(tuning.beam.radius * 0.55).pow(2).negate()).mul(u.beamOn);
  const waveRing = exp(dF.sub(waveR).div(2.2).pow(2).negate()).mul(waveOn);
  const bootRing = exp(dF.sub(bootR).div(5).pow(2).negate()).mul(smoothstep(-1, 0, bootR));

  // ---- 床：網膜色素上皮（六角形、幅 約 14µm）。メラニン色素で暗い褐色 ----
  const rpeMat = new THREE.MeshStandardNodeMaterial();
  const rn = texture(noiseTex, positionWorld.xz.mul(1 / 6)).b;
  rpeMat.colorNode = mix(color(0x2a1610), color(0x4a2a1c), rn).mul(mix(float(0.75), float(1), H));
  rpeMat.roughnessNode = float(0.55);
  rpeMat.emissiveNode = color(0x7a2a1a).mul(sick.mul(0.05)).add(color(0xff7a40).mul(waveRing.mul(0.5))).add(color(0xfff0d0).mul(bootRing.mul(0.6)))
    .add(color(0xffe9c8).mul(beamGlow.mul(0.25))).add(scanCol.mul(u.scan.mul(0.15))).add(scanCol.mul(scanRing.mul(0.8)));

  // ---- ドルーゼン（病巣の核）：中心窩の近くに3つ。色素上皮を押し上げる低いドーム（黄色みを帯びた白）----
  const cores = [[-9, -7, 8], [8, -5, 7], [1, 9, 7.5]].map(([dx, dz, r]) => ({ p: new THREE.Vector3(fovea.x + dx, 0, fovea.z + dz), r }));
  const floorHeight = (x: number, z: number) => { let h = 0; for (const c of cores) { const pl = plugs[cores.indexOf(c)]; const k = pl ? 1 - pl.gone : 1; const d2 = ((x - c.p.x) ** 2 + (z - c.p.z) ** 2) / (c.r * c.r); if (d2 < 1) h = Math.max(h, 4.2 * k * (1 - d2)); } return h; };
  const plugs: (Plug & { gone: number; shake: number; r: number })[] = [];
  for (const c of cores) plugs.push({ p: c.p, hp: 1, cleared: false, gone: 0, shake: 0, r: c.r });
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3();
  const rpeTiles: THREE.Vector3[] = [];
  for (let iz = -1; iz * 12 < D + 12; iz++) for (let ix = -1; ix * 13.9 < W + 14; ix++) rpeTiles.push(new THREE.Vector3(-W / 2 + ix * 13.9 + (iz % 2 ? 6.95 : 0), 0, -D / 2 + iz * 12));
  const rpe = new THREE.InstancedMesh(geos.rpe, rpeMat, rpeTiles.length); rpe.frustumCulled = false; scene.add(rpe);
  const drMat = new THREE.MeshStandardNodeMaterial({ transparent: true });
  drMat.colorNode = color(0xe8d6a0); drMat.roughnessNode = float(0.6); drMat.opacityNode = float(0.85);
  drMat.emissiveNode = color(0xffe0a0).mul(float(0.12).add(sin(u.time.mul(2)).mul(0.04)));
  const dr = new THREE.InstancedMesh(geos.drusen, drMat, 3); dr.frustumCulled = false; scene.add(dr);

  // ---- 視細胞：桿体と錐体（周辺部）、中心窩の細い錐体 ----
  const camFade = smoothstep(1.5, 5.0, length(positionWorld.sub(cameraPosition)));   // カメラのすぐ前の柱は透かす
  const mkMat = (base: number, tint: number) => {
    const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: true });
    const y = positionLocal.z.negate().max(positionLocal.y);   // 書き出しの向きに依らず「高さ」を取る
    const yy: N = positionLocal.y;
    // 外節：円板の積み重ねの細い横縞（実物は 28nm 間隔。ここでは見える細かさに間引いて描く）
    const disc = sin(yy.mul(40)).mul(0.5).add(0.5).pow(3).mul(smoothstep(24.5, 22, yy));
    // 内節のエリプソイド：細長いミトコンドリアが詰まった、温かい色の粒々
    const mito = texture(noiseTex, vec2(positionLocal.x.mul(0.4).add(positionLocal.z.mul(0.4)), yy.mul(0.18))).r.mul(smoothstep(26.5, 28, yy)).mul(smoothstep(36, 33, yy));
    m.colorNode = mix(color(0x6a6068), mix(color(base), color(tint), disc.mul(0.5)), H).add(color(0xd89a60).mul(mito.mul(0.25)));
    m.roughnessNode = float(0.35); m.metalnessNode = float(0);
    if (rich) { m.clearcoatNode = float(0.3); m.clearcoatRoughnessNode = float(0.3); }
    // 光の導き：健康な視細胞は、上から来た光を外節へ導く（光が柱の中を下へ流れる）
    const flowL = fract(yy.div(46).add(u.time.mul(0.35))).pow(8).mul(H).mul(u.lightIn);
    m.opacityNode = saturate(mix(float(0.55), float(0.78), H).add(fres.mul(0.2))).mul(camFade);
    // 外節の先：導いてきた光を返す明るい点（補償光学で撮った生体の眼底像の「視細胞のモザイク」）
    const tip = smoothstep(2.5, 0.2, yy).mul(H).mul(u.lightIn);
    m.emissiveNode = color(0xfff2e0).mul(tip.mul(0.9)).add(color(base).mul(H.mul(u.lightIn).mul(0.22).add(0.02))).add(color(0xfff0dc).mul(flowL.mul(0.35))).add(color(base).mul(fres.mul(H).mul(0.12))).add(color(0xd89a60).mul(mito.mul(0.18).mul(H)))
      .add(color(0xff7a40).mul(waveRing.mul(0.6))).add(color(0xfff2d8).mul(bootRing.mul(1.2))).add(color(0xffe9c8).mul(beamGlow.mul(0.3)))
      .add(scanCol.mul(u.scan).mul(fres.mul(0.6).add(0.06))).add(scanCol.mul(scanRing.mul(0.8)));
    void y; void abs;
    return m;
  };
  // 桿体の外節はロドプシン（視紅）で淡い赤紫、錐体はほぼ無色
  const rodMat = mkMat(0xd8c0cc, 0xc8a4bc), coneMat = mkMat(0xe2dcd6, 0xd6d0ca);
  type Col = { p: THREE.Vector3; kind: 0 | 1 | 2; r: number; s: number; ph: number };
  const cols: Col[] = [];
  let sd = 21; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const SP = 4.6;
  for (let iz = 0; iz * SP * 0.866 < D; iz++) for (let ix = 0; ix * SP < W; ix++) {
    const x = -W / 2 + ix * SP + (iz % 2 ? SP / 2 : 0) + (rnd() - 0.5) * 0.8, z = -D / 2 + iz * SP * 0.866 + (rnd() - 0.5) * 0.8;
    const df = Math.hypot(x - fovea.x, z - fovea.z);
    if (df < 26) continue;                                   // 中心窩は別に（錐体だけ）
    const cone = (ix * 7 + iz * 3) % 9 === 0;                // 周辺部：錐体は桿体よりずっと少ない
    cols.push({ p: new THREE.Vector3(x, 0, z), kind: cone ? 1 : 0, r: cone ? 1.5 : 1.0, s: 0, ph: rnd() });   // 当たりは足もとの高さ（外節）の太さ
  }
  // 錐体の太い内節のまわりは、桿体がよけて輪のように並ぶ
  for (let i = cols.length - 1; i >= 0; i--) if (cols[i].kind === 0 && cols.some((c) => c.kind === 1 && Math.hypot(c.p.x - cols[i].p.x, c.p.z - cols[i].p.z) < 4.7)) cols.splice(i, 1);
  for (let iz = 0; iz * 3.4 * 0.866 < 52; iz++) for (let ix = 0; ix * 3.4 < 52; ix++) {
    const x = fovea.x - 26 + ix * 3.4 + (iz % 2 ? 1.7 : 0), z = fovea.z - 26 + iz * 3.4 * 0.866;
    if (Math.hypot(x - fovea.x, z - fovea.z) >= 26) continue;
    cols.push({ p: new THREE.Vector3(x, 0, z), kind: 2, r: 0.9, s: 0, ph: rnd() });
  }
  const meshes = ([['rod', rodMat, 0], ['cone', coneMat, 1], ['fcone', coneMat, 2]] as const).map(([g, mat, kind]) => {
    const list = cols.filter((c) => c.kind === kind);
    const mesh = new THREE.InstancedMesh(geos[g], mat, list.length); mesh.frustumCulled = false; mesh.renderOrder = 10; scene.add(mesh);
    return { mesh, list };
  });

  // ---- 上（網膜の内側）から届く光の筋：森の間をやわらかく照らす ----
  {
    const g = new THREE.CylinderGeometry(5, 9, 70, 24, 1, true); g.translate(0, 35, 0);
    const m = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });
    const edge = pow(saturate(dot(normalView, positionViewDirection).abs()), float(2.2));
    const vy = positionWorld.y.div(70);
    m.colorNode = color(0xffe8cc).mul(edge.mul(0.06)).mul(smoothstep(0.0, 0.15, vy)).mul(smoothstep(1.0, 0.5, vy)).mul(H.mul(0.8).add(0.2)).mul(u.lightIn);
    for (let i = 0; i < (vr ? 4 : 9); i++) { const sh = new THREE.Mesh(g, m); sh.position.set(-W / 2 + 12 + i * (W - 24) / 8, 0, (Math.sin(i * 2.3) * 0.35) * D); sh.rotation.z = 0.12; sh.renderOrder = 50; scene.add(sh); }
  }
  // ---- 光 ----
  const sun = new THREE.DirectionalLight(0xfff0e0, 1.4); sun.position.set(-20, 90, 30); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xffe8dc, 0x3a1810, 0.7); scene.add(hemi);

  // ---- 初めの病み方：全体に外節が傷み、黄斑の中心ほど強い ----
  health.setFn((x, z) => 0.24 - 0.14 * Math.exp(-((x - fovea.x) ** 2 + (z - fovea.z) ** 2) / 1600) + 0.05 * Math.sin(x * 0.06) * Math.cos(z * 0.08));
  const capAround = (x: number, z: number) => { let cap = 1; for (const pl of plugs) if (!pl.cleared) { const d = Math.hypot(x - pl.p.x, z - pl.p.z); if (d < 18) cap = Math.min(cap, 0.3 + 0.7 * Math.max(0, (d - 9) / 9)); } return cap; };
  const startMean = health.mean();
  const plugsLeft = () => plugs.filter((p) => !p.cleared).length;
  const progress = () => Math.min(plugsLeft() ? 0.9 : 1, Math.max(0, (health.mean() - startMean) / (hc.doneAt - startMean)));

  function place() {
    rpeTiles.forEach((p, i) => { v.set(p.x, floorHeight(p.x, p.z), p.z); rpe.setMatrixAt(i, m4.compose(v, q.identity(), sv.set(1, 1, 1))); });
    rpe.instanceMatrix.needsUpdate = true;
    plugs.forEach((pl, i) => { const k = 1 - pl.gone; v.set(pl.p.x, -0.3, pl.p.z); dr.setMatrixAt(i, m4.compose(v, q.identity(), sv.set(pl.r * (0.3 + 0.7 * k), Math.max(0.01, 8 * k), pl.r * (0.3 + 0.7 * k)))); });
    dr.instanceMatrix.needsUpdate = true;
  }
  function grow(dt: number, t: number) {
    for (const { mesh, list } of meshes) {
      list.forEach((c, i) => {
        const h = health.sample(c.p.x, c.p.z);
        const want = 0.18 + 0.82 * Math.min(1, Math.max(0, (h - 0.15) / 0.6));   // 傷むと外節が短くなる。治ると伸びる
        c.s += (want - c.s) * Math.min(1, dt * 0.9);
        const lean = (1 - c.s) * 0.35;                                          // 傷んだ視細胞は、まっすぐ立てずに傾く
        q.setFromAxisAngle(sv.set(Math.cos(c.ph * 6.28), 0, Math.sin(c.ph * 6.28)), lean + Math.sin(t * 0.5 + c.ph * 6) * 0.01);
        v.set(c.p.x, floorHeight(c.p.x, c.p.z) - 0.6, c.p.z);
        mesh.setMatrixAt(i, m4.compose(v, q, sv.set(1, c.s, 1)));
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
  }
  // 当たり判定：立っている（伸びた）視細胞の柱には入れない
  const cell = 6, grid = new Map<string, Col[]>();
  for (const c of cols) { const k = `${Math.floor(c.p.x / cell)},${Math.floor(c.p.z / cell)}`; if (!grid.has(k)) grid.set(k, []); grid.get(k)!.push(c); }

  let onPlug: (i: number, kind: 'hit' | 'cleared' | 'pulse') => void = () => {};
  let fight = false, waveT = 0, flowS = 0, booted = false;
  const stage: ZoneStage = {
    meta: META, scene, health, size: [W, D], u, floorHeight, sun, plugs, progress,
    start: { pos: new THREE.Vector3(-W / 2 + 8, 0, 0), yaw: Math.PI / 2, swimming: false },
    causeAt: (x, z) => Math.hypot(x - fovea.x, z - fovea.z) < 30 ? { short: '黄斑の傷み', cause: 'ドルーゼンに押し上げられた色素上皮が弱り、錐体が光を受けられなくなっています' } : { short: '外節の傷み', cause: '視細胞の外節（光を受ける部分）が短く崩れ、光を受け止められません' },
    setOnPlug(f) { onPlug = f as typeof onPlug; },
    encounters(pos, t, walked) {
      const out: { id: string; at: THREE.Vector3 | null }[] = [];
      if (t > 3) out.push({ id: 'rpe', at: null });
      const near = (kind: number, minH: number) => cols.find((c) => c.kind === kind && Math.hypot(c.p.x - pos.x, c.p.z - pos.z) < 12 && c.s > minH);
      const r = near(0, 0.7); if (r) out.push({ id: 'rod', at: r.p.clone().setY(18) });
      const c = near(1, 0.7); if (c) out.push({ id: 'cone', at: c.p.clone().setY(20) });
      if (walked > 30 && r) out.push({ id: 'mitochondrion', at: r.p.clone().setY(31) });
      if (Math.hypot(pos.x - fovea.x, pos.z - fovea.z) < 38) out.push({ id: 'fovea', at: fovea.clone().setY(14) });
      for (const pl of plugs) if (!pl.cleared && Math.hypot(pl.p.x - pos.x, pl.p.z - pos.z) < 20) out.push({ id: 'drusen', at: pl.p.clone().setY(3) });
      return out;
    },
    collide(p: THREE.Vector3, rad: number) {
      if (p.y - floorHeight(p.x, p.z) > 46) return;   // 森の上を泳いでいる
      const gx = Math.floor(p.x / cell), gz = Math.floor(p.z / cell);
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const c of grid.get(`${gx + a},${gz + b}`) ?? []) {
        if (c.s < 0.55) continue;
        const dx = p.x - c.p.x, dz = p.z - c.p.z, d = Math.hypot(dx, dz), min = c.r + rad;
        if (d < min && d > 1e-4) { p.x = c.p.x + (dx / d) * min; p.z = c.p.z + (dz / d) * min; }
      }
    },
    heal(x, z, dt) {
      plugs.forEach((pl, i) => {
        if (pl.cleared || Math.hypot(x - pl.p.x, z - pl.p.z) > pl.r) return;
        if (pl.hp === 1) { onPlug(i, 'hit'); fight = true; waveT = 2; }
        pl.hp = Math.max(0, pl.hp - dt / 4.5); pl.shake = 1;
        if (pl.hp <= 0) { pl.cleared = true; onPlug(i, 'cleared'); health.heal(pl.p.x, pl.p.z, 16, 0.35); }
      });
      const got = health.heal(x, z, tuning.beam.radius, tuning.beam.rate * dt);
      health.clampFn(capAround); return got;
    },
    flowing: () => flowS,
    update(dt, t, camera) {
      u.time.value = t; u.heartPhase.value += dt * 1.1;
      health.spread(dt, hc.regrow); health.clampFn(capAround);
      for (const pl of plugs) { pl.shake = Math.max(0, pl.shake - dt * 3); if (pl.cleared && pl.gone < 1) pl.gone = Math.min(1, pl.gone + dt * 0.6); }
      // 対決：残ったドルーゼンの数だけ強い、弱らせる波が中心窩から広がる（約 7 秒ごと）
      if (fight && plugsLeft()) {
        waveT -= dt;
        if (waveT <= 0) { waveT = 7; waveR.value = 0; waveOn.value = 1; onPlug(-1, 'pulse'); }
        if (waveOn.value > 0) {
          waveR.value += dt * 14; waveOn.value = Math.max(0, 1 - waveR.value / 40);
          const R = waveR.value, amt = dt * 0.5 * plugsLeft() / 3;
          for (let j = 0; j < health.h; j++) for (let i = 0; i < health.w; i++) {
            const x = (i / (health.w - 1) - 0.5) * W, z = (j / (health.h - 1) - 0.5) * D, d = Math.hypot(x - fovea.x, z - fovea.z);
            if (Math.abs(d - R) < 3) { const k = j * health.w + i; health.data[k] = Math.max(0.12, health.data[k] - amt); }
          }
          health.version++;
        }
      } else waveOn.value = Math.max(0, waveOn.value - dt);
      // 器官の再起動：すべて治ると、中心窩から森全体へ光が走る
      if (!booted && progress() >= 1) { booted = true; bootR.value = 0; }
      if (booted) bootR.value += dt * 22;
      const prog = progress(); flowS = prog;
      u.lightIn.value += ((0.3 + 0.7 * prog) - u.lightIn.value) * Math.min(1, dt * 1.5);
      sun.intensity = 0.8 + 1.8 * u.lightIn.value; hemi.intensity = 0.5 + 0.5 * u.lightIn.value;
      (scene.fog as THREE.FogExp2).color.setRGB(0.22 + 0.2 * prog, 0.14 + 0.12 * prog, 0.15 + 0.08 * prog);
      (scene.background as THREE.Color).copy((scene.fog as THREE.FogExp2).color).multiplyScalar(0.55);
      if (health.version !== hVersion) { health.toBytes(hBytes); hTex.needsUpdate = true; hVersion = health.version; }
      grow(dt, t); if (plugs.some((p) => p.cleared && p.gone < 1)) place();
      keyLightDirView.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
    },
  };
  place(); grow(10, 0);
  return stage;
}

// 地上の変化：シロツメクサの発芽を、実写の早回しのように、その場で描いて見せる。単位は mm。
// 地下の暗さとの対比のため、ここは朝の斜めの光で、明るく色彩豊かに。
import * as THREE from 'three/webgpu';
import { attribute, float, vec2, vec3, mix, uniform, saturate, smoothstep, normalWorld, positionWorld, positionLocal, cameraPosition, dot, pow, texture, uv, abs, oneMinus, fract, mx_noise_float } from 'three/tsl';
import { loadGLB, loadTexture } from '../core/assets';
import { makeRng } from './rng';
import { makeSoilMaterial } from './soilMaterial';
import { buildLitter } from './litter';

export interface Surface { scene: THREE.Scene; camera: THREE.PerspectiveCamera; focusDistance: { value: number }; setGrowth(g: number): void; update(dt: number, t: number): void; growth: number; }
const STAGES = ['S0_seed', 'S1_radicle', 'S2_hook', 'S3_lift', 'S4_half', 'S5_open'];
const LEAF_STAGES = ['L0_none', 'L1_bud', 'L2_rise'];
/** 種は地表から 3 mm 下（シロツメクサは浅くまく） */
const SEED_DEPTH = 3;

function skyEnvironment(renderer: THREE.WebGPURenderer, sunDir: THREE.Vector3) {
  const s = new THREE.Scene(); const m = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide });
  const n = normalWorld.negate(); const h = saturate(n.y.mul(0.5).add(0.5));
  const sky = mix(vec3(1.0, 0.86, 0.66), vec3(0.16, 0.38, 0.86), smoothstep(0.5, 0.72, h));
  const ground = vec3(0.10, 0.075, 0.05);
  const sun = pow(saturate(dot(n, vec3(sunDir.x, sunDir.y, sunDir.z))), 24.0).mul(6.0);
  m.colorNode = mix(ground, sky, smoothstep(0.46, 0.54, h)).add(vec3(1.0, 0.85, 0.6).mul(sun));
  s.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), m));
  const tex = new THREE.PMREMGenerator(renderer).fromScene(s, 0.03).texture;
  return tex;
}

export async function buildSurface(renderer: THREE.WebGPURenderer, base: string, opts: { shadows: boolean; density: number }): Promise<Surface> {
  const scene = new THREE.Scene();
  const sunDir = new THREE.Vector3(-0.72, 0.36, 0.48).normalize();
  scene.environment = skyEnvironment(renderer, sunDir); scene.environmentIntensity = 0.9;
  scene.background = new THREE.Color(0xd8c3a0); scene.fog = new THREE.Fog(0xd9c4a0, 38, 120);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.3, 600);
  const sun = new THREE.DirectionalLight(0xffdfb4, 4.2); sun.position.copy(sunDir).multiplyScalar(80); scene.add(sun);
  if (opts.shadows) { sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); const c = sun.shadow.camera; c.left = -26; c.right = 26; c.top = 26; c.bottom = -26; c.near = 10; c.far = 160; sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.12; }
  scene.add(new THREE.HemisphereLight(0x9fc0ff, 0x4a3520, 0.7));

  // 地面：土の粒を、ここでは肉眼で見える大きさ（砂粒 0.2〜1.5 mm、団粒 0.5〜3 mm）として敷く
  const rng = makeRng(4242); const detail = await loadTexture(base, 'tex/soil_detail.webp', { repeat: true });
  const kinds: [string, 'quartz' | 'aggregate' | 'humus', number, number, number][] = [['aggregate_a', 'aggregate', 0.16, 1.0, 3400], ['aggregate_b', 'aggregate', 0.12, 0.7, 4200], ['aggregate_c', 'aggregate', 0.1, 0.5, 4200], ['quartz_a', 'quartz', 0.06, 0.3, 2400], ['quartz_b', 'quartz', 0.05, 0.22, 2400], ['humus_a', 'humus', 0.2, 1.1, 900]];
  const lifts: { mesh: THREE.InstancedMesh; idx: number[]; base: THREE.Matrix4[] }[] = [];
  const height = (x: number, z: number) => Math.sin(x * 0.13) * 0.45 + Math.sin(z * 0.17 + 1.3) * 0.4 + Math.sin((x + z) * 0.41) * 0.18;
  for (const [nm, kind, r0, r1, n0] of kinds) {
    const n = Math.round(n0 * opts.density);
    const [g, na] = await Promise.all([loadGLB(base, `models/grains/${nm}.glb`), loadTexture(base, `models/grains/${nm}_lod2_na.webp`)]);
    const geo = (g.scene.getObjectByName(`${nm}_LOD2`) as THREE.Mesh).geometry;
    const wet = new THREE.InstancedBufferAttribute(new Float32Array(n), 1), seed = new THREE.InstancedBufferAttribute(new Float32Array(n), 1);
    const mesh = new THREE.InstancedMesh(geo, makeSoilMaterial(kind, na, detail, wet, seed, { mottle: 0.08, tint: kind === 'quartz' ? [0.9, 0.88, 0.84] : [0.95, 0.80, 0.66] }), n);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(); const idx: number[] = [], bases: THREE.Matrix4[] = [];
    for (let i = 0; i < n; i++) {
      const a = rng.range(0, Math.PI * 2), rad = 36 * rng.next() ** 0.62, r = (r0 + (r1 - r0) * rng.next() ** 2.2) * (1 + rad * 0.035);
      p.set(Math.cos(a) * rad, 0, Math.sin(a) * rad); p.y = height(p.x, p.z) + rng.range(-0.6, 0.25) * r;
      q.setFromEuler(e.set(rng.range(0, 6.28), rng.range(0, 6.28), rng.range(0, 6.28))); s.set(r, r * rng.range(0.7, 1), r * rng.range(0.85, 1.1));
      mesh.setMatrixAt(i, m4.compose(p, q, s));
      { const patch = 0.5 + 0.5 * Math.sin(p.x * 0.31 + Math.sin(p.z * 0.23) * 2.0) * Math.sin(p.z * 0.27 + 0.7); (wet.array as Float32Array)[i] = (0.1 + 0.3 * patch * patch) * rng.range(0.8, 1); } (seed.array as Float32Array)[i] = rng.next();
      if (rad < 3.2) { idx.push(i); bases.push(m4.clone()); }
    }
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); scene.add(mesh); lifts.push({ mesh, idx, base: bases });
  }
  // 粒の下を埋める土の面（すき間から下が抜けて見えないように）
  const underMat = new THREE.MeshStandardNodeMaterial({ roughness: 1 });
  { const t1 = texture(detail, positionWorld.xz.mul(0.9)), t2 = texture(detail, positionWorld.xz.mul(0.21));
    underMat.colorNode = mix(vec3(0.045, 0.032, 0.022), vec3(0.10, 0.072, 0.048), t1.r.mul(0.6).add(t2.g.mul(0.4))).mul(oneMinus(t1.b.mul(0.5))); }
  const under = new THREE.Mesh(new THREE.CircleGeometry(220, 48), underMat); under.rotation.x = -Math.PI / 2; under.position.y = -0.12; under.receiveShadow = true; scene.add(under);
  scene.add(buildLitter(height, { density: opts.density, keepOut: 1.6, radius: 30, sunDir }));

  // 芽生え（子葉・胚軸・根）と、最初の本葉
  const gltf = await loadGLB(base, 'models/plants/clover_seedling.glb');
  const plant = gltf.scene.getObjectByName('clover_seedling') as THREE.Mesh, leaf = gltf.scene.getObjectByName('clover_leaf1') as THREE.Mesh;
  const uGreen = uniform(0), uSun = uniform(sunDir);
  const viewDir = cameraPosition.sub(positionWorld).normalize();
  const back = pow(saturate(dot(viewDir.negate(), uSun)), 2.0);            // 逆光
  const facing = saturate(dot(normalWorld, uSun));
  const aboveGround = smoothstep(-1.6, -0.1, positionWorld.y);
  {
    const vc = attribute('color', 'vec4'); const isCot = vc.r, isRoot = vc.g, topSide = vc.b, alongCot = vc.a;
    const pm = new THREE.MeshPhysicalNodeMaterial();
    const u2 = uv();
    // 表面の細かい粒状感（表皮の細胞の凹凸が、光を受けて細かくきらめく）。写真で確認した特徴
    // 表皮の細胞のきらめき：形の座標（mm）からの3次元ノイズ。UV の伸びに左右されない
    const pl = positionLocal;
    const stipple = saturate(mx_noise_float(pl.mul(9.0)).mul(0.45).add(mx_noise_float(pl.mul(22.0)).mul(0.45)).add(0.5));
    // 色：土の中では淡い黄白色。地上で光に当たると、子葉から先に緑になる。写真の目測 RGB(120,190,70) 前後を線形に直した値
    const pale = vec3(0.80, 0.76, 0.48), rootCol = vec3(0.88, 0.86, 0.78);
    // 縁はわずかに黄色みを帯び、厚みのせいで少し暗く見える（写真 8615）
    const edge = smoothstep(0.32, 0.5, abs(u2.x.sub(0.5))).add(smoothstep(0.85, 1.0, alongCot)).min(1.0);
    const cotTop = mix(mix(vec3(0.085, 0.19, 0.035), vec3(0.17, 0.30, 0.075), stipple), vec3(0.15, 0.21, 0.045), edge.mul(0.5));
    const cotGreen = mix(vec3(0.26, 0.42, 0.14), cotTop, topSide);            // 裏は淡い
    const midline = oneMinus(smoothstep(0.0, 0.10, abs(u2.x.sub(0.5)))).mul(topSide).mul(smoothstep(0.15, 0.4, alongCot));
    // 胚軸：淡い緑。地ぎわはわずかに赤みを帯びる個体がある（写真1点で確認。弱く入れる）
    const stemGreen = mix(vec3(0.30, 0.25, 0.14), vec3(0.22, 0.36, 0.10), smoothstep(0.3, 0.75, vc.b));
    const green = mix(stemGreen, cotGreen.mul(mix(float(1), float(1.12), midline)), isCot);
    const greening = uGreen.mul(mix(float(0.9), float(1), isCot)).mul(aboveGround);
    const col = mix(mix(pale, green, greening), rootCol, isRoot);
    pm.colorNode = col;
    pm.roughnessNode = mix(float(0.5), mix(float(0.82), float(0.22), pow(stipple, float(4.0))), isCot);   // 鈍いつや＋細かいきらめき
    pm.metalnessNode = float(0);
    pm.clearcoatNode = isCot.mul(0.06); pm.clearcoatRoughnessNode = float(0.4);
    pm.sheen = 0.4; pm.sheenRoughness = 0.5; pm.sheenColor = new THREE.Color(0.55, 0.7, 0.3);
    // 透け：子葉は厚いので、逆光では縁だけが明るい黄緑に光る。胚軸は細いので全体が透ける
    const rimThin = pow(oneMinus(saturate(dot(normalWorld, viewDir))), 2.0);
    pm.emissiveNode = col.mul(vec3(1.2, 1.15, 0.45)).mul(back).mul(mix(float(0.22), rimThin.mul(0.9), isCot)).mul(aboveGround).mul(oneMinus(isRoot));
    plant.material = pm; plant.castShadow = true; plant.receiveShadow = true; plant.frustumCulled = false;
  }
  {
    // 最初の本葉：子葉より暗く、つやのない青みの緑（写真の目測 RGB(90,150,80)）。薄いので、逆光で葉脈が浮かぶ
    const vc = attribute('color', 'vec4'); const isBlade = vc.r, fromMid = vc.g, along = vc.b;
    const lm = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide });
    const veins = oneMinus(smoothstep(0.0, 0.05, abs(fract(along.mul(7.0).sub(fromMid.mul(2.2))).sub(0.5)))).mul(smoothstep(0.06, 0.2, fromMid)).mul(0.5);
    const mid = oneMinus(smoothstep(0.0, 0.06, fromMid));
    const bladeCol = mix(vec3(0.085, 0.27, 0.085), vec3(0.14, 0.34, 0.11), veins.add(mid).min(1.0));
    const colL = mix(vec3(0.42, 0.56, 0.26), bladeCol, isBlade);
    lm.colorNode = colL; lm.roughnessNode = mix(float(0.5), float(0.78), isBlade); lm.metalnessNode = float(0);
    lm.emissiveNode = colL.mul(vec3(1.2, 1.35, 0.5)).mul(back.mul(0.5).add(facing.mul(0.0))).mul(mix(float(1), float(0.55), veins.add(mid).min(1.0)));
    leaf.material = lm; leaf.castShadow = true; leaf.receiveShadow = true; leaf.frustumCulled = false;
  }
  const holder = new THREE.Group(); holder.position.y = -SEED_DEPTH; holder.rotation.y = 0.6; holder.add(gltf.scene); scene.add(holder);
  const dict = plant.morphTargetDictionary!, infl = plant.morphTargetInfluences!, ldict = leaf.morphTargetDictionary!, linfl = leaf.morphTargetInfluences!;
  const ease = (x: number) => x * x * (3 - 2 * x);
  /** 0..n の位置から、隣り合う2つのキーの重みを決める（最後の先は基本形＝重みなし） */
  const blend = (inf: number[], d: Record<string, number>, names: string[], x: number) => { const i = Math.min(names.length - 1, Math.floor(x)); const f = ease(Math.min(1, x - i)); inf.fill(0); inf[d[names[i]]] = 1 - f; if (i + 1 < names.length) inf[d[names[i + 1]]] = f; };

  const tmp = new THREE.Matrix4(), tp = new THREE.Vector3(), tq = new THREE.Quaternion(), ts = new THREE.Vector3();
  const focusDistance = uniform(16);
  const surf: Surface = {
    scene, camera, growth: 0, focusDistance,
    setGrowth(g) {
      surf.growth = g = Math.max(0, Math.min(1, g));
      // 時間配分：土の中（種〜かぎ）はゆっくり、地上に出てからの「持ち上げ〜開く」をたっぷり見せ、最後に本葉が伸びる
      const key = (t: number, pts: [number, number][]) => { for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [t0, v0] = pts[i - 1], [t1, v1] = pts[i]; return v0 + (v1 - v0) * ((t - t0) / (t1 - t0)); } return pts[pts.length - 1][1]; };
      blend(infl, dict, STAGES, key(g, [[0, 0], [0.08, 1], [0.24, 2], [0.38, 3], [0.52, 4], [0.66, 5], [0.80, 6], [1, 6]]));
      blend(linfl, ldict, LEAF_STAGES, key(g, [[0, 0], [0.66, 0], [0.76, 1], [0.88, 2], [1, 3]]));
      leaf.visible = g > 0.66;
      uGreen.value = Math.max(0, Math.min(1, (g - 0.30) / 0.36));
      // 首振り（回旋運動）：伸びている茎の先は、小さく円を描くように揺れながら立ち上がる。伸びが止まると収まる
      const nut = Math.sin(Math.min(1, Math.max(0, (g - 0.24) / 0.5)) * Math.PI) * 0.055;
      holder.rotation.x = Math.sin(g * 46) * nut; holder.rotation.z = Math.cos(g * 46) * nut;
      // 胚軸が土を押し上げる：芽の出る所の粒が、盛り上がって外へ退く
      const push = Math.max(0, Math.min(1, (g - 0.16) / 0.16));
      for (const L of lifts) { L.idx.forEach((ii, k) => { L.base[k].decompose(tp, tq, ts); const d = Math.hypot(tp.x, tp.z), w = Math.max(0, 1 - d / 3.2) * push; if (d > 1e-3) { tp.x += (tp.x / d) * w * 0.9; tp.z += (tp.z / d) * w * 0.9; } tp.y += w * 0.45; L.mesh.setMatrixAt(ii, tmp.compose(tp, tq, ts)); }); L.mesh.instanceMatrix.needsUpdate = true; }
    },
    update(_dt, t) {
      // カメラ：斜め上から寄って、葉が「葉」として見える角度で、ゆっくり回り込む（急な動きや揺れは入れない）
      const g = surf.growth, az = 2.35 - g * 1.05, el = 0.50 + 0.10 * Math.sin(g * Math.PI), dist = 13.5 + g * 4 + Math.max(0, g - 0.7) * 16;
      camera.position.set(Math.cos(az) * Math.cos(el) * dist, Math.sin(el) * dist + 1.0, Math.sin(az) * Math.cos(el) * dist);
      camera.lookAt(0.4, 0.4 + Math.max(0, g - 0.2) * 3.4 + Math.max(0, g - 0.7) * 5, 0); void t;
      focusDistance.value = camera.position.length() - 0.5; // ピントは芽に合わせ続ける
    },
  };
  surf.setGrowth(0);
  return surf;
}

// 地上の変化：シロツメクサの発芽を、実写の早回しのように、その場で描いて見せる。単位は mm。
// 地下の暗さとの対比のため、ここは朝の斜めの光で、明るく色彩豊かに。
import * as THREE from 'three/webgpu';
import { attribute, float, vec2, vec3, mix, uniform, saturate, smoothstep, normalWorld, positionWorld, positionLocal, cameraPosition, dot, pow, texture, uv, abs, oneMinus, fract, mx_noise_float } from 'three/tsl';
import { loadGLB, loadTexture } from '../core/assets';
import { makeRng } from './rng';
import { makeSoilMaterial } from './soilMaterial';
import { buildLitter } from './litter';
import { buildGround, makeHeight } from './ground';

export interface Surface { scene: THREE.Scene; camera: THREE.PerspectiveCamera; focusDistance: { value: number }; setGrowth(g: number): void; update(dt: number, t: number): void; growth: number; }
const STAGES = ['S0_seed', 'S1_radicle', 'S2_hook', 'S3_lift', 'S4_half', 'S5_open'];
const LEAF_STAGES = ['L0_none', 'L1_bud', 'L2_rise'];
/** 種は地表から 3 mm 下（シロツメクサは浅くまく） */
const SEED_DEPTH = 3;

function skyEnvironment(renderer: THREE.WebGPURenderer, sunDir: THREE.Vector3) {
  const s = new THREE.Scene(); const m = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide });
  const n = normalWorld.negate(); const h = saturate(n.y.mul(0.5).add(0.5));
  const sky = mix(vec3(0.85, 0.86, 0.84), vec3(0.42, 0.55, 0.78), smoothstep(0.5, 0.85, h));
  const ground = vec3(0.10, 0.075, 0.05);
  const sun = pow(saturate(dot(n, vec3(sunDir.x, sunDir.y, sunDir.z))), 24.0).mul(6.0);
  m.colorNode = mix(ground, sky, smoothstep(0.46, 0.54, h)).add(vec3(1.0, 0.95, 0.85).mul(sun));
  s.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), m));
  const tex = new THREE.PMREMGenerator(renderer).fromScene(s, 0.03).texture;
  return tex;
}

export async function buildSurface(renderer: THREE.WebGPURenderer, base: string, opts: { shadows: boolean; density: number }): Promise<Surface> {
  const scene = new THREE.Scene();
  // 光：写真のような、白っぽい昼の光。太陽はやや高く、空からの柔らかい光を多めに（夕日のオレンジはやめる）
  const sunDir = new THREE.Vector3(-0.55, 0.62, 0.56).normalize();
  scene.environment = skyEnvironment(renderer, sunDir); scene.environmentIntensity = 0.35;
  scene.background = new THREE.Color(0xb9bcb8); scene.fog = new THREE.Fog(0xb9bcb8, 45, 150);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.3, 600);
  const sun = new THREE.DirectionalLight(0xfff3e2, 3.4); sun.position.copy(sunDir).multiplyScalar(80); scene.add(sun);
  if (opts.shadows) { sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); const c = sun.shadow.camera; c.left = -22; c.right = 22; c.top = 22; c.bottom = -22; c.near = 10; c.far = 160; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.06; sun.shadow.radius = 4; }
  scene.add(new THREE.HemisphereLight(0xd6e2f2, 0x55402c, 0.5));

  // 地面：細かい土がつながった面（ground.ts）。その上に、半分埋まった土のかたまりと小石
  const height = makeHeight();
  scene.add(buildGround(height, { segments: opts.density >= 0.9 ? 420 : 300, size: 170, sunDir }));
  const rng = makeRng(4242); const detail = await loadTexture(base, 'tex/soil_detail.webp', { repeat: true });
  // 土のかたまり：0.15〜1.1 mm の小さな団粒と砂粒を、地面の上にぎっしり重ねる（写真の、ぼろぼろした表面）
  const kinds: [string, 'quartz' | 'aggregate' | 'humus', number, number, number][] = [['aggregate_a', 'aggregate', 0.18, 1.1, 5200], ['aggregate_b', 'aggregate', 0.14, 0.8, 6400], ['aggregate_c', 'aggregate', 0.1, 0.55, 6400], ['quartz_a', 'quartz', 0.06, 0.32, 1800], ['quartz_b', 'quartz', 0.05, 0.25, 1800], ['humus_a', 'humus', 0.15, 0.8, 900]];
  const lifts: { mesh: THREE.InstancedMesh; idx: number[]; base: THREE.Matrix4[] }[] = [];
  for (const [nm, kind, r0, r1, n0] of kinds) {
    const n = Math.round(n0 * opts.density * (kind === 'quartz' ? 0.8 : 0.25));
    const near = kind !== 'quartz';
    const [g, na] = await Promise.all([loadGLB(base, `models/grains/${nm}.glb`), loadTexture(base, `models/grains/${nm}_lod2_na.webp`)]);
    const geo = (g.scene.getObjectByName(`${nm}_LOD2`) as THREE.Mesh).geometry;
    const wet = new THREE.InstancedBufferAttribute(new Float32Array(n), 1), seed = new THREE.InstancedBufferAttribute(new Float32Array(n), 1);
    const mesh = new THREE.InstancedMesh(geo, makeSoilMaterial(kind, na, detail, wet, seed, { mottle: 0.08, tint: kind === 'quartz' ? [0.92, 0.9, 0.86] : [0.80, 0.68, 0.56] }), n);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sc = new THREE.Vector3(); const idx: number[] = [], bases: THREE.Matrix4[] = [];
    for (let i = 0; i < n; i++) {
      const a = rng.range(0, Math.PI * 2), rad = 34 * rng.next() ** 0.62, r = (r0 + (r1 - r0) * rng.next() ** 2.4) * (1 + rad * 0.03);
      p.set(Math.cos(a) * rad, 0, Math.sin(a) * rad); p.y = height(p.x, p.z) - r * rng.range(0.15, 0.5);
      q.setFromEuler(e.set(rng.range(0, 6.28), rng.range(0, 6.28), rng.range(0, 6.28))); sc.set(r, r * rng.range(0.6, 0.9), r * rng.range(0.85, 1.1));
      mesh.setMatrixAt(i, m4.compose(p, q, sc));
      { const patch = 0.5 + 0.5 * Math.sin(p.x * 0.31 + Math.sin(p.z * 0.23) * 2.0) * Math.sin(p.z * 0.27 + 0.7); (wet.array as Float32Array)[i] = (0.06 + 0.3 * patch * patch) * rng.range(0.7, 1); }
      (seed.array as Float32Array)[i] = rng.next();
      if (near && rad < 3.2) { idx.push(i); bases.push(m4.clone()); }
    }
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); scene.add(mesh); lifts.push({ mesh, idx, base: bases });
  }
  scene.add(buildLitter(height, { density: opts.density, keepOut: 1.6, radius: 30, sunDir }));

  // 芽生え（子葉・胚軸・根）と、最初の本葉
  const gltf = await loadGLB(base, 'models/plants/clover_seedling.glb');
  const plant = gltf.scene.getObjectByName('clover_seedling') as THREE.Mesh, leaf = gltf.scene.getObjectByName('clover_leaf1') as THREE.Mesh;
  const uGreen = uniform(0), uSun = uniform(sunDir);
  const viewDir = cameraPosition.sub(positionWorld).normalize();
  const back = pow(saturate(dot(viewDir.negate(), uSun)), 2.0);            // 逆光
  const facing = saturate(dot(normalWorld, uSun));
  const gy = height(0, 0); const aboveGround = smoothstep(gy - 1.6, gy - 0.1, positionWorld.y);
  {
    const vc = attribute('color', 'vec4'); const isCot = vc.r, isRoot = vc.g, topSide = vc.b, alongCot = vc.a;
    const pm = new THREE.MeshPhysicalNodeMaterial();
    const u2 = uv();
    // 表面の細かい粒状感（表皮の細胞の凹凸が、光を受けて細かくきらめく）。写真で確認した特徴
    // 表皮の細胞のきらめき：形の座標（mm）からの3次元ノイズ。UV の伸びに左右されない
    const pl = positionLocal;
    const stipple = saturate(mx_noise_float(pl.mul(9.0)).mul(0.45).add(mx_noise_float(pl.mul(22.0)).mul(0.45)).add(0.5));
    // 色：土の中では淡い黄白色。地上で光に当たると、子葉から先に緑になる。写真の目測 RGB(120,190,70) 前後を線形に直した値
    const pale = vec3(0.62, 0.58, 0.16), rootCol = vec3(0.88, 0.86, 0.78);
    // 縁はわずかに黄色みを帯び、厚みのせいで少し暗く見える（写真 8615）
    const edge = smoothstep(0.32, 0.5, abs(u2.x.sub(0.5))).add(smoothstep(0.85, 1.0, alongCot)).min(1.0);
    // 写真から測った色（sRGB #838945・#909E3C・#9BA566）を線形に直した値。緑より黄色みの強い、くすんだオリーブ色
    const cotTop = mix(mix(vec3(0.17, 0.20, 0.06), vec3(0.27, 0.30, 0.12), stipple), vec3(0.30, 0.31, 0.12), edge.mul(0.4));
    const cotGreen = mix(vec3(0.30, 0.36, 0.12), cotTop, topSide);            // 裏は淡い
    const midline = oneMinus(smoothstep(0.0, 0.10, abs(u2.x.sub(0.5)))).mul(topSide).mul(smoothstep(0.15, 0.4, alongCot));
    // 胚軸：淡い緑。地ぎわはわずかに赤みを帯びる個体がある（写真1点で確認。弱く入れる）
    const stemGreen = mix(vec3(0.15, 0.12, 0.03), vec3(0.20, 0.25, 0.07), smoothstep(0.3, 0.75, vc.b));   // 写真の茎 #6B6429 前後
    const green = mix(stemGreen, cotGreen.mul(mix(float(1), float(1.12), midline)), isCot);
    const greening = uGreen.mul(mix(float(0.9), float(1), isCot)).mul(aboveGround);
    const col = mix(mix(pale, green, greening), rootCol, isRoot);
    pm.colorNode = col;
    const glint = smoothstep(0.72, 0.9, mx_noise_float(positionLocal.mul(11.0)).add(0.5));
    pm.roughnessNode = mix(float(0.5), mix(float(0.86), float(0.08), glint), isCot);   // 鈍いつや＋細かいきらめき
    pm.metalnessNode = float(0);
    pm.clearcoatNode = isCot.mul(0.06); pm.clearcoatRoughnessNode = float(0.4);
    pm.sheen = 0.4; pm.sheenRoughness = 0.5; pm.sheenColor = new THREE.Color(0.55, 0.7, 0.3);
    // 透け：子葉は厚いので、逆光では縁だけが明るい黄緑に光る。胚軸は細いので全体が透ける
    const rimThin = pow(oneMinus(saturate(dot(normalWorld, viewDir))), 2.0);
    pm.emissiveNode = col.mul(vec3(1.1, 1.1, 0.5)).mul(back).mul(mix(float(0.25), float(0.18), isCot)).mul(aboveGround).mul(oneMinus(isRoot));
    plant.material = pm; plant.castShadow = true; plant.receiveShadow = true; plant.frustumCulled = false;
  }
  {
    // 最初の本葉：子葉より暗く、つやのない青みの緑（写真の目測 RGB(90,150,80)）。薄いので、逆光で葉脈が浮かぶ
    const vc = attribute('color', 'vec4'); const isBlade = vc.r, fromMid = vc.g, along = vc.b;
    const lm = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide });
    const veins = oneMinus(smoothstep(0.0, 0.05, abs(fract(along.mul(7.0).sub(fromMid.mul(2.2))).sub(0.5)))).mul(smoothstep(0.06, 0.2, fromMid)).mul(0.5);
    const mid = oneMinus(smoothstep(0.0, 0.06, fromMid));
    const bladeCol = mix(vec3(0.07, 0.14, 0.025), vec3(0.09, 0.17, 0.035), mid.mul(0.5));
    const colL = mix(vec3(0.42, 0.56, 0.26), bladeCol, isBlade);
    lm.colorNode = colL; lm.roughnessNode = mix(float(0.5), float(0.78), isBlade); lm.metalnessNode = float(0);
    lm.emissiveNode = colL.mul(vec3(1.2, 1.35, 0.5)).mul(back.mul(0.5).add(facing.mul(0.0)));
    leaf.material = lm; leaf.castShadow = true; leaf.receiveShadow = true; leaf.frustumCulled = false;
  }
  const holder = new THREE.Group(); holder.position.y = height(0, 0) - SEED_DEPTH; holder.rotation.y = 0.6; holder.add(gltf.scene); scene.add(holder);
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
      // カメラ：写真のように 55°で見下ろし、固定（早回しの間、カメラは動かさない）。画面の幅は約 20 mm。地平線と空は写さない
      const g = surf.growth; void t;
      const k = Math.max(0, Math.min(1, (g - 0.7) / 0.3)); const kk = k * k * (3 - 2 * k);   // 本葉が伸びる間だけ、ごくゆっくり引く
      camera.position.set(-9.5 - kk * 2.5, gy + 17.5 + kk * 5.0, 9.0 + kk * 2.0);
      camera.lookAt(0.3 - kk * 0.8, gy + 0.6 + kk * 2.2, 0.2 - kk * 0.6);
      focusDistance.value = camera.position.length() - 0.5; // ピントは芽に合わせ続ける
    },
  };
  surf.setGrowth(0);
  return surf;
}

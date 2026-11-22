// 地上の変化：シロツメクサの発芽を、実写の早回しのように、その場で描いて見せる。単位は mm。
// 地下の暗さとの対比のため、ここは朝の斜めの光で、明るく色彩豊かに。
import * as THREE from 'three/webgpu';
import { attribute, float, vec3, mix, uniform, saturate, smoothstep, normalWorld, positionWorld, cameraPosition, dot, pow } from 'three/tsl';
import { loadGLB, loadTexture } from '../core/assets';
import { makeRng } from './rng';
import { makeSoilMaterial } from './soilMaterial';

export interface Surface { scene: THREE.Scene; camera: THREE.PerspectiveCamera; setGrowth(g: number): void; update(dt: number, t: number): void; growth: number; }
const STAGES = ['S0_seed', 'S1_radicle', 'S2_hook', 'S3_lift', 'S4_open'];
/** 種は地表から 5 mm 下 */
const SEED_DEPTH = 5;

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
  scene.background = scene.environment; scene.backgroundBlurriness = 0.3; scene.backgroundIntensity = 1.25; scene.fog = new THREE.Fog(0xe2cfae, 60, 210);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.3, 600);
  const sun = new THREE.DirectionalLight(0xffdfb4, 4.2); sun.position.copy(sunDir).multiplyScalar(80); scene.add(sun);
  if (opts.shadows) { sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); const c = sun.shadow.camera; c.left = -26; c.right = 26; c.top = 26; c.bottom = -26; c.near = 10; c.far = 160; sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.12; }
  scene.add(new THREE.HemisphereLight(0x9fc0ff, 0x4a3520, 0.7));

  // 地面：土の粒を、ここでは肉眼で見える大きさ（砂粒 0.2〜1.5 mm、団粒 0.5〜3 mm）として敷く
  const rng = makeRng(4242); const detail = await loadTexture(base, 'tex/soil_detail.webp', { repeat: true });
  const kinds: [string, 'quartz' | 'aggregate' | 'humus', number, number, number][] = [['aggregate_a', 'aggregate', 0.6, 3.2, 1500], ['aggregate_b', 'aggregate', 0.5, 2.4, 1500], ['aggregate_c', 'aggregate', 0.4, 1.8, 1300], ['quartz_a', 'quartz', 0.25, 1.1, 700], ['quartz_b', 'quartz', 0.2, 0.9, 700], ['humus_a', 'humus', 0.6, 2.6, 500]];
  const lifts: { mesh: THREE.InstancedMesh; idx: number[]; base: THREE.Matrix4[] }[] = [];
  const height = (x: number, z: number) => Math.sin(x * 0.11) * 0.9 + Math.sin(z * 0.14 + 1.3) * 0.8 + Math.sin((x + z) * 0.33) * 0.35;
  for (const [nm, kind, r0, r1, n0] of kinds) {
    const n = Math.round(n0 * opts.density);
    const [g, na] = await Promise.all([loadGLB(base, `models/grains/${nm}.glb`), loadTexture(base, `models/grains/${nm}_lod1_na.webp`)]);
    const geo = (g.scene.getObjectByName(`${nm}_LOD1`) as THREE.Mesh).geometry;
    const wet = new THREE.InstancedBufferAttribute(new Float32Array(n), 1), seed = new THREE.InstancedBufferAttribute(new Float32Array(n), 1);
    const mesh = new THREE.InstancedMesh(geo, makeSoilMaterial(kind, na, detail, wet, seed, { mottle: 0.3 }), n);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(); const idx: number[] = [], bases: THREE.Matrix4[] = [];
    for (let i = 0; i < n; i++) {
      const a = rng.range(0, Math.PI * 2), rad = 70 * Math.sqrt(rng.next()) ** 1.25, r = r0 + (r1 - r0) * rng.next() ** 2.2;
      p.set(Math.cos(a) * rad, 0, Math.sin(a) * rad); p.y = height(p.x, p.z) + rng.range(-0.5, 0.35) * r;
      q.setFromEuler(e.set(rng.range(0, 6.28), rng.range(0, 6.28), rng.range(0, 6.28))); s.set(r, r * rng.range(0.7, 1), r * rng.range(0.85, 1.1));
      mesh.setMatrixAt(i, m4.compose(p, q, s));
      (wet.array as Float32Array)[i] = Math.max(0.25, 0.75 - rad * 0.012) * rng.range(0.7, 1); (seed.array as Float32Array)[i] = rng.next();
      if (rad < 4.5) { idx.push(i); bases.push(m4.clone()); }
    }
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); scene.add(mesh); lifts.push({ mesh, idx, base: bases });
  }
  // 粒の下を埋める土の面（すき間から下が抜けて見えないように）
  const under = new THREE.Mesh(new THREE.CircleGeometry(220, 48), new THREE.MeshStandardNodeMaterial({ color: 0x2a1c12, roughness: 1, envMapIntensity: 0.15 })); under.rotation.x = -Math.PI / 2; under.position.y = -0.7; under.receiveShadow = true; scene.add(under);

  // 芽生え
  const gltf = await loadGLB(base, 'models/plants/clover_seedling.glb');
  let plant!: THREE.Mesh; gltf.scene.traverse((o) => { if ((o as THREE.Mesh).isMesh) plant = o as THREE.Mesh; });
  const uGreen = uniform(0), uSun = uniform(sunDir);
  const vc = attribute('color', 'vec4'); const isCot = vc.r, isRoot = vc.g, along = vc.b;
  const pm = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide });
  // 色：土の中では光が当たらず、淡い黄白色。地上に出ると、葉緑体ができて緑になる（子葉が先、胚軸は淡い緑）
  const pale = vec3(0.78, 0.74, 0.50), rootCol = vec3(0.86, 0.84, 0.76);
  // 子葉：明るい黄緑で、鈍いつやがある。葉脈は見えない（形の仕様書：写真で確認）。目測の色 RGB(120,190,70) を線形に直した値
  const leafGreen = vec3(0.19, 0.50, 0.065);
  const stemGreen = vec3(0.50, 0.62, 0.30);
  const green = mix(stemGreen, leafGreen, isCot);
  const aboveGround = smoothstep(SEED_DEPTH - 0.6, SEED_DEPTH + 0.8, positionWorld.y.add(SEED_DEPTH));
  const col = mix(mix(pale, green, uGreen.mul(mix(float(0.55), float(1), isCot)).mul(aboveGround)), rootCol, isRoot);
  pm.colorNode = col;
  pm.roughnessNode = mix(float(0.42), float(0.6), isCot); pm.metalnessNode = float(0);
  pm.clearcoatNode = float(0.25); pm.clearcoatRoughnessNode = float(0.35);
  // 透け：逆光のとき、薄い子葉を光が抜けて明るい黄緑に光る
  const viewDir = cameraPosition.sub(positionWorld).normalize();
  const back = pow(saturate(dot(viewDir.negate(), uSun)), 2.0);
  pm.emissiveNode = col.mul(vec3(1.2, 1.25, 0.5)).mul(back).mul(mix(float(0.25), float(1.1), isCot)).mul(aboveGround);
  void along;
  plant.material = pm; plant.castShadow = true; plant.receiveShadow = true; plant.frustumCulled = false;
  const holder = new THREE.Group(); holder.position.y = -SEED_DEPTH; holder.rotation.y = 0.6; holder.add(gltf.scene); scene.add(holder);
  const dict = plant.morphTargetDictionary!, infl = plant.morphTargetInfluences!;

  const tmp = new THREE.Matrix4(), tp = new THREE.Vector3(), tq = new THREE.Quaternion(), ts = new THREE.Vector3();
  const surf: Surface = {
    scene, camera, growth: 0,
    setGrowth(g) {
      surf.growth = g; const x = Math.max(0, Math.min(1, g)) * STAGES.length; const i = Math.min(STAGES.length - 1, Math.floor(x)); let f = x - i; f = f * f * (3 - 2 * f);
      infl.fill(0); infl[dict[STAGES[i]]] = 1 - f; if (i + 1 < STAGES.length) infl[dict[STAGES[i + 1]]] = f;
      uGreen.value = Math.max(0, Math.min(1, (g - 0.5) / 0.4));
      // 胚軸が土を押し上げる：芽の出る所の粒が、盛り上がって外へ退く
      const push = Math.max(0, Math.min(1, (g - 0.3) / 0.25));
      for (const L of lifts) { L.idx.forEach((ii, k) => { L.base[k].decompose(tp, tq, ts); const d = Math.hypot(tp.x, tp.z), w = Math.max(0, 1 - d / 4.5) * push; if (d > 1e-3) { tp.x += (tp.x / d) * w * 1.3; tp.z += (tp.z / d) * w * 1.3; } tp.y += w * 0.9; L.mesh.setMatrixAt(ii, tmp.compose(tp, tq, ts)); }); L.mesh.instanceMatrix.needsUpdate = true; }
    },
    update(_dt, t) {
      // カメラ：地面すれすれから、芽の伸びに合わせてゆっくり上がりながら回り込む（急な動きや揺れは入れない）
      const g = surf.growth, a = 2.2 - g * 0.9, dist = 15 + g * 13, top = Math.max(0, (g - 0.35) / 0.65) * 11;
      camera.position.set(Math.cos(a) * dist, 2.6 + top * 0.7 + Math.sin(t * 0.1) * 0.15, Math.sin(a) * dist); camera.lookAt(0, 0.6 + top * 0.6, 0);
    },
  };
  surf.setGrowth(0);
  return surf;
}

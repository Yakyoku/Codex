// 地上の変化：シロツメクサの発芽を、実写の早回しのように、その場で描いて見せる。単位は mm。
// 地下の暗さとの対比のため、ここは朝の斜めの光で、明るく色彩豊かに。
import * as THREE from 'three/webgpu';
import { attribute, float, vec2, vec3, mix, uniform, saturate, smoothstep, normalWorld, positionWorld, positionLocal, cameraPosition, dot, pow, texture, uv, abs, oneMinus, fract, step, mx_noise_float, mx_worley_noise_float } from 'three/tsl';
import { loadGLB, loadTexture } from '../core/assets';
import { makeRng } from './rng';
import { makeSoilMaterial } from './soilMaterial';
import { buildLitter } from './litter';
import { buildGround, makeHeight } from './ground';
import { buildSand, buildSpill } from './sand';

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
  scene.add(new THREE.HemisphereLight(0xd6e2f2, 0x8a6a4c, 0.6));   // 下からの光は、土の照り返しの色

  // 地面：細かい土がつながった面（ground.ts）。その上に、半分埋まった土のかたまりと小石
  const height = makeHeight();
  scene.add(buildGround(height, { segments: opts.density >= 0.9 ? 420 : 300, size: 170, sunDir }));
  const rng = makeRng(4242); const detail = await loadTexture(base, 'tex/soil_detail.webp', { repeat: true });
  // 土：一粒ずつの砂粒と、粒が集まった小さなかたまり（sand.ts）。芽の上の粒は、芽が出るときにこぼれ落ちる（下の spill）
  const sand = buildSand(height, { density: opts.density, radius: 30, keepOut: 1.7 });
  scene.add(sand.group);
  // 小石：まれに混じる、角の取れた石（0.4〜1.2 mm）
  { const rngS = makeRng(4242); const detail = await loadTexture(base, 'tex/soil_detail.webp', { repeat: true });
    const [g, na] = await Promise.all([loadGLB(base, 'models/grains/quartz_b.glb'), loadTexture(base, 'models/grains/quartz_b_lod1_na.webp')]);
    const n = Math.round(46 * opts.density); const wet = new THREE.InstancedBufferAttribute(new Float32Array(n), 1), seedA = new THREE.InstancedBufferAttribute(new Float32Array(n), 1);
    const mesh = new THREE.InstancedMesh((g.scene.getObjectByName('quartz_b_LOD1') as THREE.Mesh).geometry, makeSoilMaterial('quartz', na, detail, wet, seedA, { mottle: 0.1, tint: [0.85, 0.82, 0.78] }), n);
    const m4 = new THREE.Matrix4(), e = new THREE.Euler(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3();
    for (let i = 0; i < n; i++) { const a = rngS.range(0, 6.28), r = 3 + 26 * rngS.next() ** 0.8, sz = (0.2 + 0.4 * rngS.next() ** 2) * (1 + r * 0.03); p.set(Math.cos(a) * r, 0, Math.sin(a) * r); p.y = height(p.x, p.z) - sz * 0.35;
      mesh.setMatrixAt(i, m4.compose(p, q.setFromEuler(e.set(rngS.range(0, 6), rngS.range(0, 6), rngS.range(0, 6))), sc.set(sz, sz * 0.7, sz))); (seedA.array as Float32Array)[i] = rngS.next(); }
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); scene.add(mesh); }
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
    // 子葉の色は一色ではない（写真を拡大して確かめた。#919C41 日陰、#CACD89 日なた、縁 #D1D187）：
    //  ① 大きなまだら：黄緑と緑が数百 µm の大きさで混じる  ② 縁：薄く黄色みを帯びて透ける  ③ 付け根と中央の溝はやや濃い
    //  ④ 表皮の細胞の凹凸：銀白色の細かい光の点が、表面のほぼ半分を覆う（霜をふいたような質感） ⑤ 小さな土の粒が少し付いている
    // 模様の座標は、子葉の実際の寸法（幅 約2.25 mm × 長さ 約3.8 mm）に合わせた UV（mm）。圧縮したモデルの座標は mm ではないので使わない
    const pl = vec3(u2.x.mul(2.25), u2.y.mul(3.8), topSide.mul(5.0));
    const blot = saturate(mx_noise_float(pl.mul(1.6)).mul(0.8).add(mx_noise_float(pl.mul(4.3)).mul(0.4)).add(0.5));
    const edgeU = smoothstep(0.36, 0.5, abs(u2.x.sub(0.5))), edgeTip = smoothstep(0.9, 1.0, alongCot);
    const edge = edgeU.add(edgeTip).min(1.0);
    const base = smoothstep(0.35, 0.1, alongCot);                                           // 付け根
    const midline = oneMinus(smoothstep(0.0, 0.08, abs(u2.x.sub(0.5)))).mul(topSide).mul(smoothstep(0.15, 0.4, alongCot));
    let cotTop = mix(vec3(0.16, 0.20, 0.035), vec3(0.30, 0.33, 0.08), blot);                // ① まだら（日陰色〜黄緑）
    cotTop = mix(cotTop, vec3(0.50, 0.50, 0.16), edge.mul(0.75));                             // ② 黄色みの縁
    cotTop = cotTop.mul(mix(float(1.0), float(0.78), base.mul(0.6).add(midline.mul(0.35))));   // ③ 付け根と溝
    // ④ 光の点：0.03〜0.06 mm 間隔の細かいセル。点そのものは銀白色で、鋭く光る
    const cellA = mx_worley_noise_float(pl.mul(17.0)), cellB = mx_worley_noise_float(pl.mul(29.0).add(vec3(3.1, 1.3, 2.2)));
    const dots = smoothstep(0.32, 0.12, cellA).add(smoothstep(0.26, 0.1, cellB).mul(0.7)).min(1.0).mul(topSide.mul(0.7).add(0.3));
    cotTop = mix(cotTop, vec3(0.66, 0.68, 0.52), dots.mul(0.62));
    // ⑤ 付いた土の粒：まばらな茶色の小さな点
    const speck = smoothstep(0.06, 0.02, mx_worley_noise_float(pl.mul(6.0).add(vec3(7.0, 2.0, 5.0)))).mul(step(0.6, saturate(mx_noise_float(pl.mul(2.0)).add(0.5))));
    cotTop = mix(cotTop, vec3(0.16, 0.10, 0.06), speck.mul(0.85));
    // 裏側（日の当たらない側）も一色ではない（ダイコンの芽生えの写真）：灰色がかった淡い緑のまだら、白っぽい中央の葉脈と細い葉脈の網目、
    // 白い粉をふいたような鈍い光沢（シーン）、縁のわずかな赤紫。光の点は表より少ない
    const midU = oneMinus(smoothstep(0.0, 0.06, abs(u2.x.sub(0.5)))).mul(smoothstep(0.12, 0.5, alongCot));
    const vnet = smoothstep(0.5, 0.85, mx_worley_noise_float(pl.mul(2.6))).mul(smoothstep(0.1, 0.35, abs(u2.x.sub(0.5)).oneMinus())).mul(0.6);
    let under = mix(vec3(0.21, 0.27, 0.10), vec3(0.32, 0.36, 0.15), blot);
    under = mix(under, vec3(0.48, 0.50, 0.29), midU.mul(0.65).add(vnet.mul(0.4)).min(1.0));
    under = mix(under, vec3(0.30, 0.20, 0.13), edgeU.mul(0.35));
    under = under.mul(mix(float(1.0), float(0.8), base.mul(0.5)));
    under = mix(under, vec3(0.52, 0.55, 0.42), dots.mul(0.25));
    const cotGreen = mix(under, cotTop, topSide);
    // 胚軸：淡い緑で半透明。地ぎわはわずかに赤みを帯び、上へ行くほど緑
    const stemGreen = mix(vec3(0.18, 0.12, 0.05), vec3(0.24, 0.30, 0.09), smoothstep(0.3, 0.8, vc.b)).mul(mix(float(0.9), float(1.1), saturate(mx_noise_float(vec3(u2.x.mul(1.2), u2.y.mul(4.0), float(0)).mul(6.0)).add(0.5))));
    const green = mix(stemGreen, cotGreen, isCot);
    // 緑になる順番：光に当たった所から。縁と先が先に緑になり、付け根はしばらく黄色が残る
    const greening = saturate(uGreen.mul(1.3).sub(base.mul(0.3)).sub(oneMinus(isCot).mul(0.15))).mul(aboveGround);
    // 開く前（まだ光に慣れていない）色：付け根は淡い黄、先と外側ほど黄緑。まだら、縁の明るさ、裏はやや濃い。茎は根元が赤み
    const rootCol = vec3(0.88, 0.86, 0.78);
    const paleCot = mix(mix(vec3(0.72, 0.60, 0.17), vec3(0.42, 0.50, 0.10), smoothstep(0.2, 1.0, alongCot)), vec3(0.62, 0.58, 0.24), smoothstep(0.3, 0.8, blot).mul(0.6))
      .mul(mix(float(1.0), float(0.82), oneMinus(topSide).mul(0.5))).add(vec3(0.08, 0.08, 0.02).mul(edge));
    const paleStem = mix(vec3(0.42, 0.20, 0.10), vec3(0.62, 0.58, 0.22), smoothstep(0.15, 0.6, vc.b));
    const pale = mix(paleStem, paleCot, isCot);
    const col = mix(mix(pale, green, greening), rootCol, isRoot);
    pm.colorNode = col;
    // 粗さ：土台はつやなし。光の点だけ鋭く光る
    const opened = mix(float(0.88), float(0.12), dots.mul(topSide));
    pm.roughnessNode = mix(float(0.45), mix(float(0.32), opened, greening), isCot);   // 開く前は、ろうのような強いつや
    pm.metalnessNode = float(0);
    pm.clearcoatNode = dots.mul(isCot).mul(0.35); pm.clearcoatRoughnessNode = float(0.15);
    pm.sheenNode = mix(float(0.15), float(0.6), oneMinus(topSide)).mul(isCot); pm.sheenRoughness = 0.55; pm.sheenColor = new THREE.Color(0.75, 0.8, 0.7);   // 裏は白い粉をふいたような光沢
    // 透け：縁と胚軸は薄いので、光が抜けて明るむ
    // 透過光：日の当たらない面には、葉を透けた黄緑の光が届く（薄い子葉は光の一部を通す）。縁と胚軸も薄いので少し明るむ
    const through = saturate(dot(normalWorld, uSun).negate()).mul(0.8).add(0.2);
    const transmitted = col.mul(vec3(0.9, 1.05, 0.45)).mul(through).mul(oneMinus(topSide).mul(0.9).add(0.1));   // 葉の模様の色のまま透ける
    pm.emissiveNode = col.mul(vec3(1.1, 1.1, 0.5)).mul(back.mul(0.5)).mul(mix(float(0.3), edge.mul(0.25), isCot)).add(transmitted.mul(isCot).mul(0.5)).mul(aboveGround).mul(oneMinus(isRoot));
    plant.material = pm; plant.castShadow = true; plant.receiveShadow = true; plant.frustumCulled = false;
  }
  {
    // 最初の本葉：子葉より暗く、つやのない青みの緑（写真の目測 RGB(90,150,80)）。薄いので、逆光で葉脈が浮かぶ
    const vc = attribute('color', 'vec4'); const isBlade = vc.r, fromMid = vc.g, along = vc.b;
    const lm = new THREE.MeshPhysicalNodeMaterial({ side: THREE.DoubleSide });
    // 本葉も一色ではない（写真 #88BA7E・#7FB375 前後）：青みがかった灰緑の上に、白っぽい細い葉脈の網目と、中央の葉脈。
    // 表面は細かい毛のような、ビロードに近い鈍い光沢。縁はわずかに明るい
    const lu = uv(); const lp = vec3(lu.x.mul(4.3), lu.y.mul(3.5), float(0));          // 本葉の実際の寸法（mm）
    const net = mx_worley_noise_float(lp.mul(2.1)), net2 = mx_worley_noise_float(lp.mul(5.5).add(vec3(1.7, 0.3, 2.9)));
    const veinNet = smoothstep(0.45, 0.8, net).mul(0.75).add(smoothstep(0.55, 0.85, net2).mul(0.4)).mul(smoothstep(0.08, 0.2, fromMid));
    const mid = oneMinus(smoothstep(0.0, 0.05, fromMid)).mul(smoothstep(0.02, 0.2, along));
    const blotL = saturate(mx_noise_float(lp.mul(1.2)).mul(0.9).add(0.5));
    let bladeCol = mix(vec3(0.09, 0.20, 0.07), vec3(0.14, 0.28, 0.10), blotL);                 // 灰緑のまだら
    bladeCol = mix(bladeCol, vec3(0.34, 0.48, 0.30), veinNet.mul(0.55).add(mid.mul(0.6)).min(1.0));  // 白っぽい葉脈
    bladeCol = mix(bladeCol, vec3(0.30, 0.42, 0.20), smoothstep(0.85, 1.0, fromMid).mul(0.5));    // 縁
    const fine = saturate(mx_noise_float(lp.mul(40.0)).add(0.5));
    bladeCol = bladeCol.mul(mix(float(0.92), float(1.06), fine));
    const colL = mix(vec3(0.30, 0.42, 0.18), bladeCol, isBlade);
    lm.colorNode = colL; lm.roughnessNode = mix(float(0.5), float(0.72), isBlade); lm.metalnessNode = float(0);
    lm.sheen = 0.25; lm.sheenRoughness = 0.5; lm.sheenColor = new THREE.Color(0.7, 0.8, 0.7);
    const thruL = saturate(dot(normalWorld, uSun).abs().oneMinus().mul(0.3).add(back));
    lm.emissiveNode = colL.mul(vec3(1.2, 1.35, 0.6)).mul(thruL.mul(0.45)).mul(oneMinus(veinNet.mul(0.5)));
    leaf.material = lm; leaf.castShadow = true; leaf.receiveShadow = true; leaf.frustumCulled = false;
  }
  const holder = new THREE.Group(); holder.position.y = height(0, 0) - SEED_DEPTH; holder.rotation.y = 0.6; holder.add(gltf.scene); scene.add(holder);
  const dict = plant.morphTargetDictionary!, infl = plant.morphTargetInfluences!, ldict = leaf.morphTargetDictionary!, linfl = leaf.morphTargetInfluences!;
  const ease = (x: number) => x * x * (3 - 2 * x);
  /** 0..n の位置から、隣り合う2つのキーの重みを決める（最後の先は基本形＝重みなし） */
  const blend = (inf: number[], d: Record<string, number>, names: string[], x: number) => { const i = Math.min(names.length - 1, Math.floor(x)); const f = ease(Math.min(1, x - i)); inf.fill(0); inf[d[names[i]]] = 1 - f; if (i + 1 < names.length) inf[d[names[i + 1]]] = f; };

  const key = (t: number, pts: [number, number][]) => { for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [t0, v0] = pts[i - 1], [t1, v1] = pts[i]; return v0 + (v1 - v0) * ((t - t0) / (t1 - t0)); } return pts[pts.length - 1][1]; };
  const pose = (g: number) => {
    // 時間配分：土の中（種〜かぎ）はゆっくり、地上に出てからの「持ち上げ〜開く」をたっぷり見せ、最後に本葉が伸びる
    blend(infl, dict, STAGES, key(g, [[0, 0], [0.08, 1], [0.24, 2], [0.38, 3], [0.52, 4], [0.66, 5], [0.80, 6], [1, 6]]));
    blend(linfl, ldict, LEAF_STAGES, key(g, [[0, 0], [0.66, 0], [0.76, 1], [0.88, 2], [1, 3]]));
    leaf.visible = g > 0.66;
    uGreen.value = Math.max(0, Math.min(1, (g - 0.30) / 0.36));
    // 首振り（回旋運動）：早回し動画（CC BY 3.0、Internet Archive の接写映像）で確かめた動き。
    // 芽が出てから子葉が開くまでの間、かぎ形の先が左右にゆっくり大きく揺れ（約 3 往復）、開ききると収まる
    const w = Math.max(0, Math.min(1, (g - 0.22) / 0.46)), env = Math.sin(w * Math.PI) ** 0.8;
    const ph = w * Math.PI * 2 * 3;
    holder.rotation.z = Math.sin(ph) * 0.12 * env; holder.rotation.x = Math.sin(ph * 0.5 + 0.7) * 0.05 * env;
  };
  holder.updateMatrixWorld(true);
  const spill = buildSpill(height, sand.geos, sand.mats, plant, pose, { growSec: 26, count: Math.round(2600 * Math.max(0.6, opts.density)), stuck: 80 });
  scene.add(spill.group); const dq = new URLSearchParams(location.search); if (dq.has('nospill')) spill.group.visible = false; if (dq.has('noplant')) holder.visible = false;
  const focusDistance = uniform(16);
  const surf: Surface = {
    scene, camera, growth: 0, focusDistance,
    setGrowth(g) {
      surf.growth = g = Math.max(0, Math.min(1, g));
      pose(g); spill.update(g);
    },
    update(_dt, t) {
      // カメラ：写真のように 55°で見下ろし、固定（早回しの間、カメラは動かさない）。画面の幅は約 20 mm。地平線と空は写さない
      const g = surf.growth; void t;
      const k = Math.max(0, Math.min(1, (g - 0.7) / 0.3)); const kk = k * k * (3 - 2 * k);   // 本葉が伸びる間だけ、ごくゆっくり引く
      camera.position.set(-9.5 - kk * 2.5, gy + 17.5 + kk * 5.0, 9.0 + kk * 2.0);
      const sc = new URLSearchParams(location.search).get('scam'); if (sc) { const v = sc.split(',').map(Number); camera.position.set(v[0], gy + v[1], v[2]); camera.lookAt(0, gy + v[3], 0); focusDistance.value = camera.position.distanceTo(new THREE.Vector3(0, gy + v[3], 0)); return; }   // 確認用：?scam=x,y,z,注視の高さ
      camera.lookAt(0.3 - kk * 0.8, gy + 0.6 + kk * 2.2, 0.2 - kk * 0.6);
      focusDistance.value = camera.position.length() - 0.5; // ピントは芽に合わせ続ける
    },
  };
  surf.setGrowth(0);
  return surf;
}

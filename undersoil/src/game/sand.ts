// 地上の土を「一粒ずつの砂粒」で作る。単位は mm。
// 写真を拡大して確かめた特徴：①粒は 0.08〜0.5 mm で、一つ一つ色が違う（白・灰・薄茶・こげ茶・赤み・半透明の石英）
// ②粒と粒のすき間に小さな影がある ③粒が集まって小さな土のかたまり（団粒）を作る ④表面はつやがなく、石英の粒だけが鋭く光る
import * as THREE from 'three/webgpu';
import { float, mix, mx_noise_float, mx_worley_noise_float, positionLocal, positionWorld, saturate, smoothstep, vec3 } from 'three/tsl';
import { makeRng } from './rng';

type Height = (x: number, z: number) => number;

/** ゆがんだ多面体の粒（亜角の砂粒）。detail=0 は 20 面、1 は 80 面 */
export function grainGeometry(seed: number, detail: number) {
  const rng = makeRng(seed);
  const g = detail < 0 ? new THREE.OctahedronGeometry(1, 0) : new THREE.IcosahedronGeometry(1, detail);
  const pos = g.attributes.position as THREE.BufferAttribute; const map = new Map<string, number>();
  const sx = rng.range(0.75, 1.0), sy = rng.range(0.55, 0.85);
  for (let i = 0; i < pos.count; i++) {
    const key = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;   // 同じ頂点は同じだけ動かす（割れ目を作らない）
    if (!map.has(key)) map.set(key, rng.range(0.78, 1.18));
    const k = map.get(key)!; pos.setXYZ(i, pos.getX(i) * k * sx, pos.getY(i) * k * sy, pos.getZ(i) * k);
  }
  g.computeVertexNormals();
  return g;
}

// 写真から測った土の色（sRGB）と、出やすさ
const PALETTE: [string, number][] = [
  ['#8f7a66', 0.22], ['#7d6c5c', 0.18], ['#6f6862', 0.12], ['#857b68', 0.12], ['#5e4e40', 0.12],
  ['#433730', 0.09], ['#9c8a76', 0.06], ['#2f2620', 0.05], ['#80604a', 0.025], ['#b4aa9a', 0.015],
];
function pickColor(rng: ReturnType<typeof makeRng>, out: THREE.Color, darker = 1) {
  let x = rng.next(), hex = PALETTE[0][0];
  for (const [h, w] of PALETTE) { if (x < w) { hex = h; break; } x -= w; }
  out.setStyle(hex); out.multiplyScalar(rng.range(0.8, 1.1) * darker * 0.85);
  return out;
}

function grainMaterial(quartz: boolean) {
  const m = quartz ? new THREE.MeshPhysicalNodeMaterial() : new THREE.MeshStandardNodeMaterial();
  // 粒の中の小さな色むら（一粒の中も一色ではない）
  const mott = saturate(mx_noise_float(positionLocal.mul(2.7)).mul(0.5).add(0.5));
  m.colorNode = vec3(1, 1, 1).mul(mix(float(0.82), float(1.12), mott));
  if (quartz) {
    // 石英：半透明で、鋭い光が一点だけ
    const pm = m as THREE.MeshPhysicalNodeMaterial;
    pm.roughnessNode = float(0.18); pm.metalnessNode = float(0); pm.clearcoat = 1; pm.clearcoatRoughness = 0.05; pm.ior = 1.54;
  } else {
    m.roughnessNode = mix(float(0.78), float(0.95), mott); m.metalnessNode = float(0);
  }
  return m;
}

export interface SandOpts { density: number; radius: number; keepOut?: number }

/** 地面を覆う砂粒の層と、粒が集まった小さなかたまり */
export function buildSand(height: Height, opts: SandOpts) {
  const group = new THREE.Group(); group.name = 'sand';
  const rng = makeRng(2025);
  const geos = [grainGeometry(1, 0), grainGeometry(2, 0), grainGeometry(3, 1), grainGeometry(4, 1), grainGeometry(5, -1), grainGeometry(6, -1)];
  const mats = [grainMaterial(false), grainMaterial(true)];
  type G = { p: THREE.Vector3; s: number; q: THREE.Quaternion; c: THREE.Color; v: number; quartz: boolean };
  const list: G[] = []; const e = new THREE.Euler(); const col = new THREE.Color();
  const add = (x: number, y: number, z: number, s: number, darker = 1, quartzChance = 0.1) => {
    const quartz = rng.next() < quartzChance;
    const c = quartz ? new THREE.Color().setStyle(rng.next() < 0.5 ? '#a8a49c' : '#8a857c') : pickColor(rng, col, darker).clone();
    list.push({ p: new THREE.Vector3(x, y, z), s, q: new THREE.Quaternion().setFromEuler(e.set(rng.range(0, 6.28), rng.range(0, 6.28), rng.range(0, 6.28))), c, v: s < 0.09 ? rng.int(4, 5) : s < 0.2 ? rng.int(0, 1) : rng.int(2, 3), quartz });
  };
  const R = opts.radius, keep = opts.keepOut ?? 0;
  // 1) 砂粒の層：芽のまわりほど細かく密に。遠くは粒を大きくして数を減らす（ぼけるので見分けがつかない）
  const ring = (n: number, r0: number, r1: number, sMin: number, sSpread: number, grow: number) => {
    for (let i = 0; i < n; i++) {
      const a = rng.range(0, Math.PI * 2), r = Math.sqrt(r0 * r0 + (r1 * r1 - r0 * r0) * rng.next());
      if (r < keep) continue;
      const x = Math.cos(a) * r, z = Math.sin(a) * r, u = rng.next();
      const s = (sMin + sSpread * u * u * u + (rng.next() < 0.03 ? sSpread * 0.8 : 0)) * (1 + r * grow);   // 小さい粒が多く、大きい粒はまれ
      add(x, height(x, z) - s * rng.range(0.15, 0.5), z, s);
    }
  };
  ring(Math.round(40000 * opts.density), 0, 9, 0.05, 0.2, 0.02);      // 芽のまわり：0.05〜0.25 mm
  ring(Math.round(34000 * opts.density), 9, 17, 0.07, 0.26, 0.02);
  ring(Math.round(14000 * opts.density), 17, R, 0.12, 0.4, 0.02);     // 遠く（ぼけて見える）
  // 2) 小さな土のかたまり：細かい粒が寄り集まったもの（0.3〜1.4 mm）。少し暗く、茶色っぽい
  const nCrumb = Math.round(90 * opts.density);
  for (let k = 0; k < nCrumb; k++) {
    const a = rng.range(0, Math.PI * 2), r = Math.max(keep + 1.5, R * 0.9 * Math.pow(rng.next(), 0.8));
    const cx = Math.cos(a) * r, cz = Math.sin(a) * r, cr = (0.3 + 1.1 * rng.next() ** 2) * (1 + r * 0.02), cy = height(cx, cz) + cr * 0.2;
    const darker = rng.range(0.7, 0.95), n = Math.min(260, Math.round(12 + (cr / 0.08) ** 2 * 1.6));
    for (let j = 0; j < n; j++) {
      const d = new THREE.Vector3(rng.range(-1, 1), rng.range(-0.2, 1), rng.range(-1, 1)).normalize();
      const rr = cr * (0.75 + 0.3 * rng.next()) * (1 + 0.25 * Math.sin(Math.atan2(d.z, d.x) * 3 + k));
      const s = (0.045 + 0.09 * rng.next() ** 2) * (1 + r * 0.02);
      add(cx + d.x * rr, cy + d.y * rr * 0.65, cz + d.z * rr, s, darker, 0.05);
    }
  }
  // 種類ごとに、インスタンス描画にまとめる
  const m4 = new THREE.Matrix4(), sc = new THREE.Vector3();
  for (let v = 0; v < 6; v++) for (const quartz of [false, true]) {
    const sel = list.filter((g) => g.v === v && g.quartz === quartz); if (!sel.length) continue;
    const mesh = new THREE.InstancedMesh(geos[v], mats[quartz ? 1 : 0], sel.length);
    sel.forEach((g, i) => { mesh.setMatrixAt(i, m4.compose(g.p, g.q, sc.setScalar(g.s))); mesh.setColorAt(i, g.c); });
    mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); mesh.name = `sand_${v}${quartz ? 'q' : ''}`;
    group.add(mesh);
  }
  return { group, count: list.length, geos, mats };
}

/** 芽が土を割って出るときに、こぼれ落ちる砂粒。動きはあらかじめ計算しておき、成長の度合い（0〜1）で再生する（巻き戻しても同じ絵になる） */
export function buildSpill(height: Height, geos: THREE.BufferGeometry[], mats: THREE.Material[], plant: THREE.Mesh, pose: (g: number) => void, opts: { growSec: number; count: number; stuck: number }) {
  const rng = makeRng(77); const col = new THREE.Color();
  const N = opts.count + opts.stuck;
  type S = { rest: THREE.Vector3; p: THREE.Vector3; v: THREE.Vector3; s: number; mode: number; thr: number; rel: number; vtx: number; axis: THREE.Vector3; spin: number; ang: number; q0: THREE.Quaternion };
  const st: S[] = []; const e = new THREE.Euler();
  // 芽の上にかぶさっている土（半径 1.6 mm）
  for (let i = 0; i < opts.count; i++) {
    const a = rng.range(0, Math.PI * 2), r = 1.75 * Math.sqrt(rng.next()), x = Math.cos(a) * r, z = Math.sin(a) * r;
    const s = 0.05 + 0.12 * rng.next() ** 2;
    st.push({ rest: new THREE.Vector3(x, height(x, z) + s * rng.range(0.1, 1.2), z), p: new THREE.Vector3(), v: new THREE.Vector3(), s, mode: 0, thr: rng.range(0.25, 1.4), rel: 0, vtx: -1, axis: new THREE.Vector3(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1)).normalize(), spin: 0, ang: 0, q0: new THREE.Quaternion().setFromEuler(e.set(rng.range(0, 6), rng.range(0, 6), rng.range(0, 6))) });
  }
  // 子葉の表に付いたまま持ち上げられる粒：子葉が開くときに、すべり落ちる
  const colA = plant.geometry.getAttribute('color') as THREE.BufferAttribute, uvA = plant.geometry.getAttribute('uv') as THREE.BufferAttribute;
  const cotTop: number[] = [], stem: number[] = [];
  for (let i = 0; i < colA.count; i++) {
    const r = colA.getX(i), g = colA.getY(i), b = colA.getZ(i), a = colA.getW(i);
    if (r > 0.5 && b > 0.5 && a > 0.25 && a < 0.95 && Math.abs(uvA.getX(i) - 0.5) < 0.35) cotTop.push(i);
    else if (r < 0.5 && g < 0.5 && i % 3 === 0) stem.push(i);
  }
  for (let i = 0; i < opts.stuck; i++) {
    const s = 0.045 + 0.08 * rng.next() ** 2;
    st.push({ rest: new THREE.Vector3(), p: new THREE.Vector3(), v: new THREE.Vector3(), s, mode: 2, thr: 0, rel: rng.range(0.44, 0.64), vtx: cotTop[rng.int(0, cotTop.length - 1)], axis: new THREE.Vector3(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1)).normalize(), spin: 0, ang: 0, q0: new THREE.Quaternion().setFromEuler(e.set(rng.range(0, 6), rng.range(0, 6), rng.range(0, 6))) });
  }
  const colors = st.map((s) => pickColor(rng, col, s.mode === 0 && Math.hypot(s.rest.x, s.rest.z) < 0.8 ? 0.72 : 1).clone());
  // あらかじめ計算する（30 コマ/秒）
  const FPS = 15, steps = Math.ceil(opts.growSec * FPS) + 1, dt = 1 / FPS;
  const frames = new Float32Array(steps * N * 4);
  const domes = new Float32Array(steps * 3);   // 土の山の中心（x, z）と頂の高さ
  const tmp = new THREE.Vector3(), apex = new THREE.Vector3(), G = 22;   // 早回しでも転がる様子が見えるよう、重力は弱めにしている（演出）
  // 芽が下から押し上げる、土の小さな山。芽の頭が地上に出たあとは崩れて低くなる
  let domeTop = -1e9, domeK = 0.55;
  const dome = (x: number, z: number) => domeTop - domeK * ((x - apex.x) ** 2 + (z - apex.z) ** 2);
  // 転がる計算には、細かい凸凹をならした地面を使う（粒より小さい凸凹で転がり出さないように）
  // 地面の高さは、芽のまわり 5 mm 四方を 0.05 mm ごとの表にしておく（毎回計算すると、とても遅い）
  const GH = 5, GS = 0.07, GN = Math.round((GH * 2) / GS) + 1, grid = new Float32Array(GN * GN);
  for (let j = 0; j < GN; j++) for (let i = 0; i < GN; i++) { const x = -GH + i * GS, z = -GH + j * GS; grid[j * GN + i] = (height(x, z) * 2 + height(x + 0.25, z) + height(x - 0.25, z) + height(x, z + 0.25) + height(x, z - 0.25)) / 6; }
  const hs = (x: number, z: number) => {
    const fx = Math.max(0, Math.min(GN - 1.001, (x + GH) / GS)), fz = Math.max(0, Math.min(GN - 1.001, (z + GH) / GS)), i = Math.floor(fx), j = Math.floor(fz), u = fx - i, w = fz - j, o = j * GN + i;
    return (grid[o] * (1 - u) + grid[o + 1] * u) * (1 - w) + (grid[o + GN] * (1 - u) + grid[o + GN + 1] * u) * w;
  };
  const support = (x: number, z: number, r: number) => Math.max(hs(x, z), dome(x, z)) + r * 0.3;
  const grad = (x: number, z: number, r: number, out: THREE.Vector2) => { const h = 0.03; out.set((support(x + h, z, r) - support(x - h, z, r)) / (2 * h), (support(x, z + h, r) - support(x, z - h, r)) / (2 * h)); return out; };
  const gr = new THREE.Vector2();
  for (const s of st) if (s.mode === 0) s.p.copy(s.rest);
  const t0 = performance.now();
  for (let k = 0; k < steps; k++) {
    const g = Math.min(1, k / (steps - 1)); pose(g); plant.updateMatrixWorld(true);
    // 土を押し上げている、芽のいちばん高い所
    apex.set(0, -1e9, 0);
    for (const vi of stem) { plant.getVertexPosition(vi, tmp); plant.localToWorld(tmp); if (tmp.y > apex.y) apex.copy(tmp); }
    for (const vi of cotTop) { if (vi % 5) continue; plant.getVertexPosition(vi, tmp); plant.localToWorld(tmp); if (tmp.y > apex.y) apex.copy(tmp); }
    const g0 = hs(apex.x, apex.z);
    const collapse = Math.min(1, Math.max(0, (g - 0.40) / 0.12));                  // 子葉が持ち上がったら、山は崩れる
    domeTop = Math.min(apex.y + 0.45, g0 + 0.9) * (1 - collapse) + (g0 - 0.2) * collapse;
    domes[k * 3] = apex.x; domes[k * 3 + 1] = apex.z; domes[k * 3 + 2] = domeTop;
    for (let i = 0; i < N; i++) {
      const s = st[i];
      if (s.mode === 2) {                                         // 子葉に付いている
        plant.getVertexPosition(s.vtx, tmp); plant.localToWorld(tmp); tmp.y += s.s * 0.8;
        if (k > 0) s.v.subVectors(tmp, s.p).divideScalar(dt); s.p.copy(tmp);
        if (g >= s.rel) { s.mode = 1; s.v.multiplyScalar(0.5).add(new THREE.Vector3(rng.range(-1, 1), 0.3, rng.range(-1, 1)).multiplyScalar(0.8)); s.spin = rng.range(4, 12); }
      } else if (s.mode === 0 && (s.p.x - apex.x) ** 2 + (s.p.z - apex.z) ** 2 > Math.max(0.25, (domeTop - g0 + 0.3) / domeK)) {
        /* 山の外の、止まっている粒は動かない */
      } else if (s.mode === 0) {                                  // 地面か、土の山の上に乗っている
        const onDome = dome(s.p.x, s.p.z) > hs(s.p.x, s.p.z) - 0.05;
        const sup = support(s.p.x, s.p.z, s.s);
        if (!onDome && s.v.x === 0 && sup <= s.p.y + 0.3) { /* 山の外の粒は、そのまま動かない */ }
        else if (sup < s.p.y - 0.15) { s.mode = 1; s.v.set(0, 0, 0); }   // 足もとが崩れた
        else {
          s.p.y = sup; grad(s.p.x, s.p.z, s.s, gr);
          if (gr.length() > 0.62 + s.thr) { s.mode = 1; s.v.set(-gr.x * 0.4, 0.15, -gr.y * 0.4); s.spin = rng.range(5, 14); }   // 斜面が急になると転がり出す
          // 芽の頭が土を突き抜けるとき、すぐまわりの粒は押しのけられる（割れ目ができる）
          const dl = Math.hypot(s.p.x - apex.x, s.p.z - apex.z);
          if (s.mode === 0 && dl < 0.42 && apex.y > s.p.y - 0.1) { const ox = (s.p.x - apex.x) / (dl + 1e-4), oz = (s.p.z - apex.z) / (dl + 1e-4); s.mode = 1; s.v.set(ox * rng.range(1.2, 2.6), rng.range(0.4, 1.4), oz * rng.range(1.2, 2.6)); s.spin = rng.range(6, 16); }
        }
      } else if (s.mode === 1) {                                  // 転がる・落ちる・はねる
        s.v.y -= G * dt; s.p.addScaledVector(s.v, dt); s.ang += s.spin * dt;
        const sup = support(s.p.x, s.p.z, s.s);
        if (s.p.y <= sup) {
          s.p.y = sup; if (s.v.y < 0) s.v.y = -s.v.y * 0.18;
          grad(s.p.x, s.p.z, s.s, gr); const sl = gr.length();
          s.v.x += -gr.x * G * 0.55 * dt; s.v.z += -gr.y * G * 0.55 * dt;   // 斜面を下る
          const fr = Math.max(0, 1 - 6.0 * dt); s.v.x *= fr; s.v.z *= fr; s.spin *= fr;
          if (s.v.lengthSq() < 0.04 && sl < 0.62 + s.thr) { s.mode = 0; s.v.set(0, 0, 0); s.spin = 0; s.v.x = 1e-9; }   // 止まった（もう一度、山に押されることはある）
        }
      }
      const o = (k * N + i) * 4; frames[o] = s.p.x; frames[o + 1] = s.p.y; frames[o + 2] = s.p.z; frames[o + 3] = s.ang;
    }
  }
  (window as unknown as Record<string, unknown>).__spillMs = Math.round(performance.now() - t0);
  pose(0);
  // 再生
  const group = new THREE.Group(); group.name = 'spill';
  // 土の山の形（粒の下に見える、湿った暗い土）
  const RINGS = 16, SEGS = 36, MR = 2.2;
  const mg = new THREE.BufferGeometry(); const mpos = new Float32Array((RINGS * SEGS + 1) * 3), mi: number[] = [];
  for (let r = 1; r <= RINGS; r++) for (let a = 0; a < SEGS; a++) {
    const c = 1 + (r - 1) * SEGS + a, n = 1 + (r - 1) * SEGS + ((a + 1) % SEGS);
    if (r === 1) mi.push(0, n, c); else { const pc = c - SEGS, pn = n - SEGS; mi.push(pc, pn, c, pn, n, c); }
  }
  mg.setAttribute('position', new THREE.BufferAttribute(mpos, 3)); mg.setIndex(mi);
  const mm = new THREE.MeshStandardNodeMaterial();
  { const pw = positionWorld; const cell = mx_worley_noise_float(pw.xz.mul(9.0)), n2 = saturate(mx_noise_float(pw.xz.mul(4.0)).add(0.5));
    mm.colorNode = mix(vec3(0.05, 0.035, 0.025), vec3(0.11, 0.08, 0.055), n2).mul(mix(float(1.0), float(0.55), smoothstep(0.2, 0.6, cell)));
    mm.roughnessNode = float(0.9); mm.metalnessNode = float(0); }
  const mound = new THREE.Mesh(mg, mm); mound.castShadow = true; mound.receiveShadow = true; mound.frustumCulled = false; group.add(mound);
  const setMound = (cx: number, cz: number, top: number) => {
    for (let i = 0; i <= RINGS * SEGS; i++) {
      const r = i === 0 ? 0 : (Math.floor((i - 1) / SEGS) + 1) / RINGS * MR, a = i === 0 ? 0 : ((i - 1) % SEGS) / SEGS * Math.PI * 2;
      const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r, d = top - domeK * r * r;
      mpos[i * 3] = x; mpos[i * 3 + 1] = Math.max(hs(x, z) - 0.12, d - 0.04); mpos[i * 3 + 2] = z;
    }
    mg.attributes.position.needsUpdate = true; mg.computeVertexNormals();
  };
  const meshes = [0, 1, 2, 3].map((v) => { const m = new THREE.InstancedMesh(geos[v], mats[0], N); m.count = 0; m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; group.add(m); return m; });
  const slot = st.map((s) => (s.s < 0.12 ? 0 : 2) + (rng.next() < 0.5 ? 0 : 1));
  const idx = new Int32Array(N); const cnt = [0, 0, 0, 0];
  for (let i = 0; i < N; i++) { idx[i] = cnt[slot[i]]++; }
  meshes.forEach((m, v) => { m.count = cnt[v]; });
  st.forEach((s, i) => meshes[slot[i]].setColorAt(idx[i], colors[i]));
  meshes.forEach((m) => { if (m.instanceColor) m.instanceColor.needsUpdate = true; });
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), qa = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3();
  return {
    group,
    update(g: number) {
      const f = Math.max(0, Math.min(steps - 1.001, g * (steps - 1))), k = Math.floor(f), t = f - k;
      for (let i = 0; i < N; i++) {
        const a = (k * N + i) * 4, b = a + N * 4;
        p.set(frames[a] + (frames[b] - frames[a]) * t, frames[a + 1] + (frames[b + 1] - frames[a + 1]) * t, frames[a + 2] + (frames[b + 2] - frames[a + 2]) * t);
        qa.setFromAxisAngle(st[i].axis, frames[a + 3] + (frames[b + 3] - frames[a + 3]) * t); q.copy(st[i].q0).premultiply(qa);
        meshes[slot[i]].setMatrixAt(idx[i], m4.compose(p, q, sc.setScalar(st[i].s)));
      }
      meshes.forEach((m) => { m.instanceMatrix.needsUpdate = true; });
      const da = k * 3, db = da + 3; setMound(domes[da] + (domes[db] - domes[da]) * t, domes[da + 1] + (domes[db + 1] - domes[da + 1]) * t, domes[da + 2] + (domes[db + 2] - domes[da + 2]) * t);
    },
  };
}

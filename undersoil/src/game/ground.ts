// 地上の地面：細かい土がつながった、1枚の高さのある面。単位は mm。
// 写真の地面は「粒が浮いて並ぶ」のではなく、細かい土の面の上に、丸い土のかたまり（団粒）や小石が埋まって乗っている。
// 芽のまわりほど頂点を細かくし（中心に寄せた格子）、遠くは粗くする。
import * as THREE from 'three/webgpu';
import { attribute, float, vec3, mix, smoothstep, saturate, positionWorld, mx_noise_float, mx_worley_noise_float, uniform, oneMinus, length, vec2, bumpMap, step } from 'three/tsl';
import { makeRng } from './rng';

/** 決まった乱数で、格子の各マスに「土のかたまり」を1つずつ置く（ゆらぎのある格子）。近くのマスだけ調べるので速い */
function crumbLayer(cell: number, seed: number, rMin: number, rMax: number, hScale: number, fill: number) {
  const hash = (i: number, j: number, k: number) => { let h = (i * 374761393 + j * 668265263 + k * 1442695041 + seed * 2654435761) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  return (x: number, z: number) => {
    const ci = Math.floor(x / cell), cj = Math.floor(z / cell); let best = 0;
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
      const i = ci + di, j = cj + dj; if (hash(i, j, 0) > fill) continue;
      const px = (i + hash(i, j, 1)) * cell, pz = (j + hash(i, j, 2)) * cell, r = rMin + (rMax - rMin) * hash(i, j, 3) ** 1.6;
      const sx = 0.75 + 0.5 * hash(i, j, 4), ang = Math.atan2(z - pz, x - px), ph = hash(i, j, 6) * 6.28;
      const wob = 1 + 0.28 * Math.sin(ang * 3 + ph) + 0.16 * Math.sin(ang * 5 + ph * 2.3) + 0.08 * Math.sin(ang * 9 + ph * 1.7);   // ゆがんだ輪郭
      const d = Math.hypot((x - px) * sx, (z - pz) / sx) / (r * wob);
      if (d < 1) best = Math.max(best, Math.min(1, Math.pow(1 - d * d, 0.35) * 1.15) * r * hScale * (0.7 + 0.6 * hash(i, j, 5)));   // 肩が張り、頂は平たい
    }
    return best;
  };
}

function valueNoise(seed: number) {
  const h = (i: number, j: number) => { let v = (i * 374761393 + j * 668265263 + seed * 1442695041) | 0; v = Math.imul(v ^ (v >>> 13), 1274126177); return ((v ^ (v >>> 16)) >>> 0) / 4294967296; };
  return (x: number, z: number) => { const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j, sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
    const a = h(i, j), b = h(i + 1, j), c = h(i, j + 1), d = h(i + 1, j + 1); return (a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz) - 0.5; };
}

export function makeHeight() {
  const n1 = valueNoise(11), n2 = valueNoise(12), n3 = valueNoise(13);
  const big = crumbLayer(3.2, 1, 0.9, 2.2, 0.22, 0.55), mid = crumbLayer(1.15, 2, 0.35, 0.8, 0.6, 0.8), fine = crumbLayer(0.42, 3, 0.12, 0.3, 0.6, 0.9);
  const rough = (x: number, z: number) => Math.sin(x * 0.09) * 0.7 + Math.sin(z * 0.11 + 1.3) * 0.6 + Math.sin((x - z) * 0.23) * 0.25;
  return (x: number, z: number) => rough(x, z) + Math.max(big(x, z), mid(x, z) * 0.9, fine(x, z) * 0.8) + mid(x, z) * 0.15 + fine(x, z) * 0.12
    + n1(x * 1.3, z * 1.3) * 0.22 + n2(x * 3.7, z * 3.7) * 0.09 + n3(x * 9, z * 9) * 0.035;   // 細かい凸凹
}

export function buildGround(height: (x: number, z: number) => number, opts: { segments: number; size: number; sunDir: THREE.Vector3 }) {
  const n = opts.segments, half = opts.size / 2;
  // 中心に寄せた格子：u∈[-1,1] → x = sign(u)·|u|^1.8·half（中心ほど細かい）
  const warp = (u: number) => Math.sign(u) * Math.pow(Math.abs(u), 1.8) * half;
  const pos = new Float32Array((n + 1) * (n + 1) * 3), cav = new Float32Array((n + 1) * (n + 1)), idx: number[] = [];
  const hs: number[] = [];
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
    const x = warp(i / n * 2 - 1), z = warp(j / n * 2 - 1), y = height(x, z); hs.push(y);
    pos.set([x, y, z], (j * (n + 1) + i) * 3);
  }
  // くぼみ具合：まわり（約 0.8 mm 先）の平均より低い所ほど 1。湿りと暗さに使う
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
    const k = j * (n + 1) + i, x = pos[k * 3], z = pos[k * 3 + 2]; let s = 0;
    for (const [dx, dz] of [[0.8, 0], [-0.8, 0], [0, 0.8], [0, -0.8], [0.56, 0.56], [-0.56, -0.56], [0.56, -0.56], [-0.56, 0.56]]) s += height(x + dx, z + dz);
    cav[k] = Math.max(0, Math.min(1, (s / 8 - hs[k]) * 2.2 + 0.25));
  }
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const a = j * (n + 1) + i; idx.push(a, a + n + 1, a + 1, a + 1, a + n + 1, a + n + 2); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('cavity', new THREE.BufferAttribute(cav, 1)); g.setIndex(idx); g.computeVertexNormals();

  const m = new THREE.MeshStandardNodeMaterial();
  const cavity = attribute('cavity', 'float');
  const p = positionWorld;
  // 湿りのまだら（数 cm の大きさ）。くぼみほど湿る
  const patch = saturate(mx_noise_float(p.xz.mul(0.06)).mul(0.9).add(0.45));
  const wet = saturate(patch.mul(0.65).add(cavity.mul(0.55)).sub(0.25));
  // 土の色：写真の乾いた表面は灰色がかった明るい茶、湿った所は濃いこげ茶（sRGB を線形に直した値）
  const dry = mix(vec3(0.16, 0.11, 0.075), vec3(0.30, 0.22, 0.15), saturate(mx_noise_float(p.xz.mul(1.7)).mul(1.4).add(0.5)));
  const moist = mix(vec3(0.06, 0.035, 0.022), vec3(0.15, 0.09, 0.05), saturate(mx_noise_float(p.xz.mul(2.3)).add(0.5)));
  let col = mix(dry, moist, wet);
  // 細かい砂：0.1 mm と 0.4 mm の2段のセル模様（写真の地面はほとんどが砂）。粒の色は灰〜茶でばらつき、すき間はほぼ黒
  const sA = mx_worley_noise_float(p.xz.mul(10.0)), sB = mx_worley_noise_float(p.xz.mul(2.6).add(vec2(3.1, 1.7)));
  const grainA = smoothstep(0.62, 0.18, sA), grainB = smoothstep(0.7, 0.25, sB);
  const tone = saturate(mx_noise_float(p.xz.mul(10.0).floor().add(0.5)).add(0.5));   // 粒ごとの色
  const sandCol = mix(vec3(0.13, 0.095, 0.065), vec3(0.30, 0.235, 0.17), tone);
  col = mix(col, sandCol, grainA.mul(0.45).add(grainB.mul(0.25)).mul(oneMinus(wet.mul(0.5))));
  const gap = smoothstep(0.35, 0.75, sA).mul(smoothstep(0.4, 0.85, sB).mul(0.5).add(0.5));
  col = col.mul(mix(float(1.0), float(0.18), gap.mul(0.75)));                  // 粒のすき間は暗い
  // ガラスのように透き通った石英の粒（一部だけ）：小さく鋭い光
  const quartz = smoothstep(0.08, 0.03, sA).mul(step(0.78, tone));
  col = mix(col, vec3(0.55, 0.55, 0.52), quartz.mul(0.6));
  const sand = quartz;
  col = col.mul(mix(float(1.0), float(0.55), cavity.mul(0.9)));            // くぼみは暗い
  m.colorNode = col;
  // 粗さ：乾いた所はつやなし、湿った所はしっとり。砂粒はわずかに光る
  m.roughnessNode = saturate(mix(float(0.95), float(0.6), wet).sub(sand.mul(0.8)));
  m.metalnessNode = float(0);
  // 細かい凹凸：表面の小さな粒のざらつき（数百 µm）を、法線だけで足す
  const bump = sA.mul(-0.6).add(sB.mul(-0.5)).add(mx_noise_float(p.mul(9.0)).mul(0.3));
  m.normalNode = bumpMap(bump, float(0.6));
  void uniform; void oneMinus; void length;
  const mesh = new THREE.Mesh(g, m); mesh.receiveShadow = true; mesh.castShadow = true; mesh.name = 'ground';
  return mesh;
}

/** 地面に半分埋まった小石と土のかたまり（インスタンス）。粒の位置は地面の高さに合わせる */
export function groundStones(height: (x: number, z: number) => number, count: number, radius: number, keepOut: number, seed = 77) {
  const rng = makeRng(seed); const out: { p: THREE.Vector3; r: number; q: THREE.Quaternion; s: THREE.Vector3 }[] = [];
  const e = new THREE.Euler();
  for (let i = 0; i < count; i++) {
    const a = rng.range(0, Math.PI * 2), rad = keepOut + (radius - keepOut) * Math.sqrt(rng.next()), r = 0.12 + 0.9 * rng.next() ** 3.2;
    const x = Math.cos(a) * rad, z = Math.sin(a) * rad;
    out.push({ p: new THREE.Vector3(x, height(x, z) - r * rng.range(0.25, 0.55), z), r, q: new THREE.Quaternion().setFromEuler(e.set(rng.range(0, 6.28), rng.range(0, 6.28), rng.range(0, 6.28))), s: new THREE.Vector3(r, r * rng.range(0.6, 0.9), r * rng.range(0.8, 1.1)) });
  }
  return out;
}

// 地面の落ちもの：枯れ草のくず、小枝、落ち葉のかけら。シロツメクサの芽生えの写真4点すべてに写っている。単位は mm。
// 形はその場で作る（画像に頼らない）。色は、写真の枯れ草（わら色〜灰褐色）、小枝（こげ茶）、落ち葉（赤茶〜こげ茶）に合わせる。
import * as THREE from 'three/webgpu';
import { mx_noise_float, attribute, float, vec3, mix, uv, sin, abs, fract, smoothstep, oneMinus, saturate, normalWorld, dot, cameraPosition, positionWorld, pow, uniform, positionLocal, time } from 'three/tsl';
import { makeRng } from './rng';

type Height = (x: number, z: number) => number;

/** 細長い帯（枯れ草の葉）：幅方向 2 分割、長さ方向 n 分割。ねじれと反りを付ける */
function bladeGeometry(n = 10) {
  const pos: number[] = [], uvs: number[] = [], idx: number[] = [];
  for (let j = 0; j <= n; j++) {
    const v = j / n;
    for (let i = 0; i <= 2; i++) {
      const u = i / 2 - 0.5;
      // 反り（長さに沿って持ち上がる）と、横の巻き（中央がくぼむ）。単位は mm（y は伸ばされない）
      const y = 0.18 * Math.sin(v * 3.0) + 0.35 * v * v + Math.abs(u) * 0.18;
      pos.push(u * (1 - 0.35 * v * v), y, v); uvs.push(i / 2, v);
    }
  }
  for (let j = 0; j < n; j++) for (let i = 0; i < 2; i++) { const a = j * 3 + i; idx.push(a, a + 3, a + 1, a + 1, a + 3, a + 4); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/** 落ち葉のかけら：ふちが不規則な、少し波打つ平たい形 */
function flakeGeometry(seed: number) {
  const r = makeRng(seed); const seg = 14, rings = 3; const pos: number[] = [0, 0, 0], uvs: number[] = [0.5, 0.5], idx: number[] = [];
  const radii = Array.from({ length: seg }, () => r.range(0.55, 1.0));
  for (let k = 1; k <= rings; k++) for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2, rr = (k / rings) * radii[i];
    const x = Math.cos(a) * rr, z = Math.sin(a) * rr * 0.75;
    pos.push(x, Math.sin(x * 3.1 + z * 2.3) * 0.06 * k, z); uvs.push(0.5 + x * 0.5, 0.5 + z * 0.5);
  }
  for (let i = 0; i < seg; i++) idx.push(0, 1 + ((i + 1) % seg), 1 + i);
  for (let k = 1; k < rings; k++) for (let i = 0; i < seg; i++) {
    const a = 1 + (k - 1) * seg + i, b = 1 + (k - 1) * seg + ((i + 1) % seg), c = a + seg, d = b + seg; idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

export function buildLitter(height: Height, opts: { density: number; keepOut: number; radius: number; sunDir: THREE.Vector3 }) {
  const group = new THREE.Group(); group.name = 'litter';
  const rng = makeRng(9090);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3();
  const place = (minR: number) => {
    for (let t = 0; t < 20; t++) {
      const a = rng.range(0, Math.PI * 2), rad = minR + (opts.radius - minR) * Math.sqrt(rng.next());
      p.set(Math.cos(a) * rad, 0, Math.sin(a) * rad); p.y = height(p.x, p.z);
      if (rad > opts.keepOut) return true;
    }
    return false;
  };
  /** 芽のまわり（半径 2.8 mm）を、細長い落ちものが横切らないようにする */
  const clear = (yaw: number, len: number) => { const dx = Math.sin(yaw), dz = Math.cos(yaw); const t = Math.max(0, Math.min(len, -(p.x * dx + p.z * dz))); return Math.hypot(p.x + dx * t, p.z + dz * t) > 2.8; };
  const sun = uniform(opts.sunDir);
  const back = pow(saturate(dot(cameraPosition.sub(positionWorld).normalize().negate(), sun)), 2.0);

  // 1) 枯れ草の葉のくず：幅 0.3〜0.9 mm、長さ 2〜11 mm。縦の筋（平行脈）があり、薄いので逆光で透ける
  {
    const n = Math.round(70 * opts.density);
    const geo = bladeGeometry(); const tone = new THREE.InstancedBufferAttribute(new Float32Array(n), 1);
    const mat = new THREE.MeshStandardNodeMaterial({ side: THREE.DoubleSide });
    const tn = attribute('tone', 'float'); const u2 = uv();
    const straw = mix(mix(vec3(0.30, 0.24, 0.15), vec3(0.17, 0.13, 0.09), tn), vec3(0.24, 0.23, 0.20), smoothstep(0.7, 0.95, tn));
    const veins = oneMinus(smoothstep(0.0, 0.18, abs(fract(u2.x.mul(5.0)).sub(0.5)))).mul(0.25);
    const col = straw.mul(oneMinus(veins)).mul(mix(float(0.85), float(1.1), smoothstep(0.0, 1.0, u2.y)));
    mat.colorNode = col; mat.roughnessNode = float(0.82); mat.metalnessNode = float(0);
    mat.emissiveNode = col.mul(vec3(1.0, 0.85, 0.5)).mul(back).mul(0.35);
    // そよ風：浮いた先のほうだけが、ゆっくり上下にゆれる（根もとは地面に付いたまま）
    { const v = uv().y; const ph = tn.mul(31.0); mat.positionNode = positionLocal.add(vec3(0, sin(time.mul(1.6).add(ph)).mul(0.06).add(sin(time.mul(3.7).add(ph.mul(1.7))).mul(0.02)).mul(v.mul(v)), 0)); }
    const mesh = new THREE.InstancedMesh(geo, mat, n);
    geo.setAttribute('tone', tone);
    for (let i = 0; i < n; i++) {
      if (!place(1.3)) continue;
      const len = rng.range(1.5, 8) * (rng.next() < 0.12 ? 1.5 : 1), w = rng.range(0.25, 0.7);
      q.setFromEuler(e.set(rng.range(-0.15, 0.25), rng.range(0, 6.28), rng.range(-0.3, 0.3))); if (!clear(e.y, len)) continue;
      p.y += rng.range(-0.15, 0.25);
      mesh.setMatrixAt(i, m4.compose(p, q, s.set(w, 1, len))); (tone.array as Float32Array)[i] = rng.next();
    }
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); group.add(mesh);
  }
  // 2) 小枝：直径 0.3〜1.1 mm、長さ 3〜14 mm。こげ茶で、ところどころ樹皮がはげて明るい
  {
    const n = Math.round(18 * opts.density);
    const geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 7, 6); geo.rotateX(Math.PI / 2); geo.translate(0, 0, 0.5);
    { const a = geo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < a.count; i++) { const z = a.getZ(i); a.setX(i, a.getX(i) + Math.sin(z * 4.0) * 0.08); a.setY(i, a.getY(i) + Math.sin(z * 2.7) * 0.06); } geo.computeVertexNormals(); }
    const tone = new THREE.InstancedBufferAttribute(new Float32Array(n), 1); geo.setAttribute('tone', tone);
    const mat = new THREE.MeshStandardNodeMaterial();
    const tn = attribute('tone', 'float'); const z = uv().y.mul(8.0);
    const bark = mix(vec3(0.16, 0.10, 0.065), vec3(0.09, 0.06, 0.04), tn);
    // 樹皮：枝に沿った細い筋と、なだらかな色むら。ところどころ樹皮がはげて明るい木部がのぞく
    // （以前は 1 画素ごとに乱数を使っていたため、砂粒をまぶした帯のように見えていた）
    const u = uv();
    const streak = smoothstep(0.55, 1.0, abs(sin(u.x.mul(44.0).add(mx_noise_float(vec3(u.x.mul(3.0), z.mul(0.6), tn.mul(7.0))).mul(2.0))))).mul(0.3);
    const blotch = saturate(mx_noise_float(vec3(u.x.mul(2.0), z.mul(0.8), tn.mul(5.0))).mul(0.8).add(0.5));
    const peel = smoothstep(0.62, 0.78, saturate(mx_noise_float(vec3(u.x.mul(1.5), z.mul(0.45), tn.mul(11.0))).add(0.5)));
    mat.colorNode = mix(bark.mul(mix(float(0.75), float(1.15), blotch)).mul(oneMinus(streak)), vec3(0.36, 0.28, 0.18), peel.mul(0.55));
    mat.roughnessNode = float(0.88); mat.metalnessNode = float(0);
    const mesh = new THREE.InstancedMesh(geo, mat, n);
    for (let i = 0; i < n; i++) {
      if (!place(2.0)) continue;
      const len = rng.range(2.5, 9), d = rng.range(0.18, 0.55);
      q.setFromEuler(e.set(rng.range(-0.08, 0.12), rng.range(0, 6.28), 0)); if (!clear(e.y, len)) continue; p.y += d * 0.25;
      mesh.setMatrixAt(i, m4.compose(p, q, s.set(d, d, len))); (tone.array as Float32Array)[i] = rng.next();
    }
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); group.add(mesh);
  }
  // 3) 落ち葉のかけら：差し渡し 1.5〜6 mm。赤茶〜こげ茶で、網目の葉脈が残る
  {
    const n = Math.round(26 * opts.density);
    const geo = flakeGeometry(3); const tone = new THREE.InstancedBufferAttribute(new Float32Array(n), 1); geo.setAttribute('tone', tone);
    const mat = new THREE.MeshStandardNodeMaterial({ side: THREE.DoubleSide });
    const tn = attribute('tone', 'float'); const u2 = uv();
    const leafC = mix(vec3(0.09, 0.055, 0.03), vec3(0.045, 0.032, 0.022), tn).mul(mix(float(0.7), float(1.2), saturate(mx_noise_float(u2.mul(9.0)).add(0.5))));
    const vein = oneMinus(smoothstep(0.0, 0.06, abs(fract(u2.x.mul(6.0).add(u2.y.mul(3.0))).sub(0.5)))).mul(0.3).add(oneMinus(smoothstep(0.0, 0.03, abs(u2.y.sub(0.5)))).mul(0.4));
    mat.colorNode = leafC.mul(oneMinus(vein.mul(0.4)).add(vein.mul(0.25)));
    mat.roughnessNode = float(0.78); mat.metalnessNode = float(0);
    mat.emissiveNode = leafC.mul(back).mul(0.3);
    const mesh = new THREE.InstancedMesh(geo, mat, n);
    for (let i = 0; i < n; i++) {
      if (!place(3.0)) continue;
      const sz = rng.range(0.5, 1.6) * 0.5;
      q.setFromEuler(e.set(rng.range(-0.25, 0.25), rng.range(0, 6.28), rng.range(-0.25, 0.25))); p.y += rng.range(-0.05, 0.15);
      mesh.setMatrixAt(i, m4.compose(p, q, s.set(sz, sz, sz))); (tone.array as Float32Array)[i] = rng.next();
    }
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); group.add(mesh);
  }
  void normalWorld;
  return group;
}

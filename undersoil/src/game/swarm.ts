// 細菌の群れ：桿菌（両端が丸い棒）をインスタンス描画し、動きは頂点シェーダーで作る。
// 水の膜の中でだけ泳ぐ。乾いた区画では見えない（芽胞として休眠している）。
import * as THREE from 'three/webgpu';
import { float, vec3, instancedBufferAttribute, time, sin, cos, positionLocal, mix, saturate, normalView, positionViewDirection, dot, pow, oneMinus, hash, instanceIndex , uniform, smoothstep } from 'three/tsl';
import type { Collider } from './world';
import { makeRng } from './rng';

export interface Swarm { highlight(p: THREE.Vector3 | null): void; mesh: THREE.InstancedMesh; count: number; sync(microbesOfCell: (cell: number) => number): void; find(from: THREE.Vector3, fwd: THREE.Vector3): { p: THREE.Vector3; r: number } | null; }

/** 1 単位 = 10 µm。枯草菌は太さ約 0.8 µm × 長さ 2〜3 µm → 0.08 × 0.25 単位 */
export type Species = 'bacillus' | 'pseudomonas';
/** bacillus：枯草菌。太さ 0.8 × 長さ 2.5 µm。粒の表面に張り付き、鎖状につながる。一部は明るい楕円の芽胞
 *  pseudomonas：シュードモナス。太さ 0.7 × 長さ 1.9 µm と短く、1 匹ずつ、水の膜の中を速く泳ぐ */
export function buildSwarm(colliders: Collider[], cellOf: (p: THREE.Vector3) => number, nearPath: (p: THREE.Vector3) => number, count: number, species: Species = 'bacillus'): Swarm {
  const rng = makeRng(species === 'bacillus' ? 77 : 91);
  const geo = species === 'bacillus' ? new THREE.CapsuleGeometry(0.04, 0.17, 3, 8) : new THREE.CapsuleGeometry(0.035, 0.12, 3, 8);
  const scl = new Float32Array(count * 3).fill(1), bright = new Float32Array(count), swim = new Float32Array(count);
  const hosts = colliders.filter((c) => c.r > 1.5);
  const pos = new Float32Array(count * 3), tang = new Float32Array(count * 3), cells = new Uint16Array(count), ph = new Float32Array(count);
  const p = new THREE.Vector3(), n = new THREE.Vector3(), t = new THREE.Vector3(); let k = 0, guard = 0;
  // 細菌は、水中を均一に漂うのではなく、粒の表面やくぼみに小さな集落を作って張り付いている（写真で確認）
  const c0 = new THREE.Vector3(), cn = new THREE.Vector3(), u = new THREE.Vector3(), w = new THREE.Vector3();
  while (k < count && guard++ < count * 40) {
    const h = hosts[rng.int(0, hosts.length - 1)];
    cn.set(rng.range(-1, 1), rng.range(-1, 0.6), rng.range(-1, 1)).normalize();
    c0.set(h.x, h.y, h.z).addScaledVector(cn, h.r);
    if (nearPath(c0) > 13) continue;
    u.set(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1)).cross(cn).normalize(); w.crossVectors(cn, u);
    const size = species === 'bacillus' ? rng.int(10, 60) : rng.int(6, 24), spread = (species === 'bacillus' ? 0.15 : 0.6) + 0.02 * size;
    let j = 0;
    while (j < size && k < count) {
      const a = rng.range(0, 6.28), r = spread * Math.sqrt(rng.next());
      n.copy(cn).addScaledVector(u, Math.cos(a) * r / h.r).addScaledVector(w, Math.sin(a) * r / h.r).normalize();
      t.set(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1)).cross(n).normalize();
      const chain = species === 'bacillus' && rng.next() < 0.5 ? rng.int(2, 7) : 1;   // 枯草菌の半分は、2〜7 個の鎖
      for (let q = 0; q < chain && j < size && k < count; q++, j++) {
        p.set(h.x, h.y, h.z).addScaledVector(n, h.r).addScaledVector(t, q * 0.26);
        const sn = p.clone().sub(new THREE.Vector3(h.x, h.y, h.z)).normalize(); p.set(h.x, h.y, h.z).addScaledVector(sn, h.r + (species === 'bacillus' ? rng.range(0.03, 0.07) : rng.range(0.12, 0.45)));
        if (colliders.some((c) => c !== h && (p.x - c.x) ** 2 + (p.y - c.y) ** 2 + (p.z - c.z) ** 2 < (c.r * 0.98) ** 2)) continue;
        pos.set([p.x, p.y, p.z], k * 3); tang.set([t.x, t.y, t.z], k * 3); cells[k] = cellOf(p); ph[k] = rng.next();
        if (species === 'bacillus' && chain === 1 && rng.next() < 0.18) { scl.set([0.9, 0.62, 0.9], k * 3); bright[k] = 1; }   // 芽胞：小さく明るい楕円
        swim[k] = species === 'pseudomonas' ? rng.range(0.6, 1.4) : 0.04;
        k++;
      }
    }
  }
  const n2 = k;
  type F = ReturnType<typeof float>; type V = ReturnType<typeof vec3>;
  const aPos = instancedBufferAttribute(new THREE.InstancedBufferAttribute(pos.subarray(0, n2 * 3), 3)) as unknown as V;
  const aTan = instancedBufferAttribute(new THREE.InstancedBufferAttribute(tang.subarray(0, n2 * 3), 3)) as unknown as V;
  const aPh = instancedBufferAttribute(new THREE.InstancedBufferAttribute(ph.subarray(0, n2), 1)) as unknown as F;
  const aScl = instancedBufferAttribute(new THREE.InstancedBufferAttribute(scl.subarray(0, n2 * 3), 3)) as unknown as V;
  const aBright = instancedBufferAttribute(new THREE.InstancedBufferAttribute(bright.subarray(0, n2), 1)) as unknown as F;
  const aSwim = instancedBufferAttribute(new THREE.InstancedBufferAttribute(swim.subarray(0, n2), 1)) as unknown as F;
  const liveAttr = new THREE.InstancedBufferAttribute(new Float32Array(n2), 1); liveAttr.setUsage(THREE.DynamicDrawUsage);
  const live = instancedBufferAttribute(liveAttr) as unknown as F;
  const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: true });
  // 泳ぎ：鞭毛で進む「直進（ラン）」と向きを変える「タンブル」を、位相をずらした往復で近似する
  const tt = time.mul(mix(float(0.5), float(1.1), aPh)).mul(species === 'pseudomonas' ? 2.2 : 1.0).add(aPh.mul(40.0));
  const side = aTan.cross(vec3(0.3, 0.9, 0.2)).normalize();
  const run = sin(tt).mul(0.9).add(sin(tt.mul(0.37).add(aPh.mul(6.0))).mul(1.6));
  const drift = aTan.mul(run).add(side.mul(cos(tt.mul(0.61)).mul(0.5))).mul(aSwim).mul(0.35);
  // 棒の向きを進む方向へ（カプセルの長軸は Y）
  const heading = species === 'pseudomonas' ? aTan.mul(cos(tt).sign().add(0.001)).add(side.mul(sin(tt.mul(0.61)).mul(-0.3))).normalize() : aTan;   // 枯草菌は向きを変えない
  const bx = heading.cross(vec3(0.0, 0.0, 1.0)).normalize(), bz = heading.cross(bx);
  const wig = sin(time.mul(18.0).add(aPh.mul(50.0))).mul(0.015); // 細かい震え
  const lp = positionLocal;
  const lps = lp.mul(aScl);
  const rotated = bx.mul(lps.x.add(wig.mul(aSwim))).add(heading.mul(lps.y)).add(bz.mul(lps.z));
  m.positionNode = aPos.add(drift).add(rotated.mul(live));
  // 色：光学顕微鏡で見る細菌はほぼ無色透明。淡い灰色で、縁がわずかに明るい
  const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 2.0);
  m.colorNode = vec3(0.22, 0.23, 0.22);
  m.emissiveNode = vec3(0.06, 0.065, 0.06).mul(rim).add(vec3(0.30, 0.30, 0.26).mul(aBright));   // 芽胞は光を強く屈折して明るく見える
  // 紹介中は、指し示した集落の細菌だけを、縁を金色に光らせて見分けやすくする
  const uHi = uniform(new THREE.Vector3()), uHiOn = uniform(0);
  const near = smoothstep(2.2, 0.8, aPos.distance(uHi)).mul(uHiOn);
  m.emissiveNode = vec3(0.06, 0.065, 0.06).mul(rim).add(vec3(0.30, 0.30, 0.26).mul(aBright)).add(vec3(0.55, 0.38, 0.16).mul(rim.mul(0.7).add(0.3)).mul(near));
  m.opacityNode = mix(mix(mix(float(0.04), float(0.45), pow(rim, float(1.6))), float(0.9), aBright), float(0.95), near.mul(0.7));
  m.roughnessNode = float(0.3); m.metalnessNode = float(0);
  void hash; void instanceIndex;
  const mesh = new THREE.InstancedMesh(geo, m, n2); mesh.name = 'swarm_' + species; mesh.frustumCulled = false;
  const liveArr = liveAttr.array as Float32Array;
  const find = (from: THREE.Vector3, fwd: THREE.Vector3) => {
    // 生きている細菌が多く集まっている所（半径 1.5 単位＝15 µm に何個あるか）を、カメラの前から選ぶ
    const c = new THREE.Vector3(), d = new THREE.Vector3(); let best: THREE.Vector3 | null = null, bs = 0;
    for (let i = 0; i < n2; i += 7) {
      if (liveArr[i] < 0.5) continue; c.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]); d.subVectors(c, from); const dist = d.length();
      if (dist < 3 || dist > 22 || d.dot(fwd) / dist < 0.85 || nearPath(c) > 9) continue;
      let k = 0; for (let j = 0; j < n2; j += 3) if (liveArr[j] > 0.5 && (pos[j * 3] - c.x) ** 2 + (pos[j * 3 + 1] - c.y) ** 2 + (pos[j * 3 + 2] - c.z) ** 2 < 2.25) k++;
      const sc = k / (1 + dist * 0.05); if (sc > bs) { bs = sc; best = c.clone(); }
    }
    return best ? { p: best, r: 1.6 } : null;
  };
  return { highlight(p) { if (p) { uHi.value.copy(p); uHiOn.value = 1; } else uHiOn.value = 0; }, mesh, count: n2, find, sync(w) { const a = liveAttr.array as Float32Array; let ch = false; for (let i = 0; i < n2; i++) { const target = w(cells[i]) > (i % 97) / 97 * 0.9 + 0.05 ? 1 : 0; if (a[i] !== target) { a[i] += Math.sign(target - a[i]) * 0.2; if (Math.abs(a[i] - target) < 0.2) a[i] = target; ch = true; } } if (ch) liveAttr.needsUpdate = true; } };
}

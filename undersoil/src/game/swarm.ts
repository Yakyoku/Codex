// 細菌の群れ：桿菌（両端が丸い棒）をインスタンス描画し、動きは頂点シェーダーで作る。
// 水の膜の中でだけ泳ぐ。乾いた区画では見えない（芽胞として休眠している）。
import * as THREE from 'three/webgpu';
import { float, vec3, instancedBufferAttribute, time, sin, cos, positionLocal, mix, saturate, normalView, positionViewDirection, dot, pow, oneMinus, hash, instanceIndex } from 'three/tsl';
import type { Collider } from './world';
import { makeRng } from './rng';

export interface Swarm { mesh: THREE.InstancedMesh; count: number; sync(microbesOfCell: (cell: number) => number): void; find(from: THREE.Vector3, fwd: THREE.Vector3): { p: THREE.Vector3; r: number } | null; }

/** 1 単位 = 10 µm。枯草菌は太さ約 0.8 µm × 長さ 2〜3 µm → 0.08 × 0.25 単位 */
export function buildSwarm(colliders: Collider[], cellOf: (p: THREE.Vector3) => number, nearPath: (p: THREE.Vector3) => number, count: number): Swarm {
  const rng = makeRng(77);
  const geo = new THREE.CapsuleGeometry(0.04, 0.17, 3, 8);
  const hosts = colliders.filter((c) => c.r > 1.5);
  const pos = new Float32Array(count * 3), tang = new Float32Array(count * 3), cells = new Uint16Array(count), ph = new Float32Array(count);
  const p = new THREE.Vector3(), n = new THREE.Vector3(), t = new THREE.Vector3(); let k = 0, guard = 0;
  while (k < count && guard++ < count * 40) {
    const h = hosts[rng.int(0, hosts.length - 1)];
    n.set(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1)).normalize();
    p.set(h.x, h.y, h.z).addScaledVector(n, h.r * 1.08 + rng.range(0.05, 0.5)); // 粒の表面の水の膜の中
    if (nearPath(p) > 13) continue;
    if (colliders.some((c) => c !== h && (p.x - c.x) ** 2 + (p.y - c.y) ** 2 + (p.z - c.z) ** 2 < (c.r * 0.98) ** 2)) continue;
    t.set(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1)).cross(n).normalize();
    pos.set([p.x, p.y, p.z], k * 3); tang.set([t.x, t.y, t.z], k * 3); cells[k] = cellOf(p); ph[k] = rng.next(); k++;
  }
  const n2 = k;
  type F = ReturnType<typeof float>; type V = ReturnType<typeof vec3>;
  const aPos = instancedBufferAttribute(new THREE.InstancedBufferAttribute(pos.subarray(0, n2 * 3), 3)) as unknown as V;
  const aTan = instancedBufferAttribute(new THREE.InstancedBufferAttribute(tang.subarray(0, n2 * 3), 3)) as unknown as V;
  const aPh = instancedBufferAttribute(new THREE.InstancedBufferAttribute(ph.subarray(0, n2), 1)) as unknown as F;
  const liveAttr = new THREE.InstancedBufferAttribute(new Float32Array(n2), 1); liveAttr.setUsage(THREE.DynamicDrawUsage);
  const live = instancedBufferAttribute(liveAttr) as unknown as F;
  const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: true });
  // 泳ぎ：鞭毛で進む「直進（ラン）」と向きを変える「タンブル」を、位相をずらした往復で近似する
  const tt = time.mul(mix(float(0.5), float(1.1), aPh)).add(aPh.mul(40.0));
  const side = aTan.cross(vec3(0.3, 0.9, 0.2)).normalize();
  const run = sin(tt).mul(0.9).add(sin(tt.mul(0.37).add(aPh.mul(6.0))).mul(1.6));
  const drift = aTan.mul(run).add(side.mul(cos(tt.mul(0.61)).mul(0.8)));
  // 棒の向きを進む方向へ（カプセルの長軸は Y）
  const heading = aTan.mul(cos(tt)).add(side.mul(sin(tt.mul(0.61)).mul(-0.5))).normalize();
  const bx = heading.cross(vec3(0.0, 0.0, 1.0)).normalize(), bz = heading.cross(bx);
  const wig = sin(time.mul(18.0).add(aPh.mul(50.0))).mul(0.015); // 細かい震え
  const lp = positionLocal;
  const rotated = bx.mul(lp.x.add(wig)).add(heading.mul(lp.y)).add(bz.mul(lp.z));
  m.positionNode = aPos.add(drift).add(rotated.mul(live));
  // 色：光学顕微鏡で見る細菌はほぼ無色透明。淡い灰色で、縁がわずかに明るい
  const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 2.0);
  m.colorNode = vec3(0.20, 0.20, 0.18);
  m.emissiveNode = vec3(0.05, 0.055, 0.05).mul(rim);
  m.opacityNode = mix(float(0.45), float(0.95), rim);
  m.roughnessNode = float(0.3); m.metalnessNode = float(0);
  void hash; void instanceIndex;
  const mesh = new THREE.InstancedMesh(geo, m, n2); mesh.name = 'swarm'; mesh.frustumCulled = false;
  const liveArr = liveAttr.array as Float32Array;
  const find = (from: THREE.Vector3, fwd: THREE.Vector3) => {
    // 生きている細菌が多く集まっている所（半径 1.5 単位＝15 µm に何個あるか）を、カメラの前から選ぶ
    const c = new THREE.Vector3(), d = new THREE.Vector3(); let best: THREE.Vector3 | null = null, bs = 0;
    for (let i = 0; i < n2; i += 7) {
      if (liveArr[i] < 0.5) continue; c.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]); d.subVectors(c, from); const dist = d.length();
      if (dist < 3 || dist > 22 || d.dot(fwd) / dist < 0.85) continue;
      let k = 0; for (let j = 0; j < n2; j += 3) if (liveArr[j] > 0.5 && (pos[j * 3] - c.x) ** 2 + (pos[j * 3 + 1] - c.y) ** 2 + (pos[j * 3 + 2] - c.z) ** 2 < 2.25) k++;
      const sc = k / (1 + dist * 0.05); if (sc > bs) { bs = sc; best = c.clone(); }
    }
    return best ? { p: best, r: 1.6 } : null;
  };
  return { mesh, count: n2, find, sync(w) { const a = liveAttr.array as Float32Array; let ch = false; for (let i = 0; i < n2; i++) { const target = w(cells[i]) > (i % 97) / 97 * 0.9 + 0.05 ? 1 : 0; if (a[i] !== target) { a[i] += Math.sign(target - a[i]) * 0.2; if (Math.abs(a[i] - target) < 0.2) a[i] = target; ch = true; } } if (ch) liveAttr.needsUpdate = true; } };
}

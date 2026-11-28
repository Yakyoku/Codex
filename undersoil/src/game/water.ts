// 水の橋（メニスカス）：粒と粒の接点にかかる、鼓の形の水。区画の水の量に応じて太る。
import * as THREE from 'three/webgpu';
import { float, vec3, mix, smoothstep, normalView, positionViewDirection, dot, pow, oneMinus, saturate, instancedBufferAttribute, viewportSharedTexture, screenUV, positionLocal, normalLocal, time, sin } from 'three/tsl';
import type { Collider } from './world';

export interface WaterBridges { mesh: THREE.InstancedMesh; count: number; sync(waterOfCell: (cell: number) => number): void; /** 区画 a と b の水の橋を、音と同じ瞬間にほのかに光らせる */ flash(a: number, b: number, k?: number): void; tick(dt: number): void; centers: THREE.Vector3[]; cells: number[]; }

/** 鼓形（両端が広く、まん中がくびれた回転体）。両端は粒の表面に沿って広がる */
function bridgeGeometry(seg = 28, rings = 18) {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= rings; i++) { const t = (i / rings) * 2 - 1, a = Math.abs(t); pts.push(new THREE.Vector2(0.35 + 0.7 * Math.pow(a, 2.4), t * 0.5)); }
  return new THREE.LatheGeometry(pts, seg);
}

export function buildBridges(colliders: Collider[], pathSamples: THREE.Vector3[], cellOf: (p: THREE.Vector3) => number, opts: { refraction: string; max: number }): WaterBridges {
  const found: { p: THREE.Vector3; axis: THREE.Vector3; r: number; len: number; cell: number }[] = [];
  const nearPath = (p: THREE.Vector3) => { let d = 1e9; for (let i = 0; i < pathSamples.length; i += 2) d = Math.min(d, pathSamples[i].distanceToSquared(p)); return Math.sqrt(d); };
  for (let i = 0; i < colliders.length; i++) for (let j = i + 1; j < colliders.length; j++) {
    const a = colliders[i], b = colliders[j]; if (a.r < 1.4 && b.r < 1.4) continue;
    const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z, d = Math.hypot(dx, dy, dz), gap = d - a.r - b.r;
    const small = Math.min(a.r, b.r);
    if (gap > small * 0.12 || gap < -small * 0.9) continue;   // 接している所だけ
    const t = (a.r + gap * 0.5) / d; const p = new THREE.Vector3(a.x + dx * t, a.y + dy * t, a.z + dz * t);
    const dp = nearPath(p); if (dp > 20) continue;
    found.push({ p, axis: new THREE.Vector3(dx, dy, dz).divideScalar(d), r: small * 0.55, len: Math.max(small * 0.35, gap + small * 0.45), cell: cellOf(p) });
  }
  found.sort((x, y) => y.r - x.r); found.length = Math.min(found.length, opts.max);
  const geo = bridgeGeometry();
  const amt = new THREE.InstancedBufferAttribute(new Float32Array(found.length), 1); amt.setUsage(THREE.DynamicDrawUsage);
  const glow = new THREE.InstancedBufferAttribute(new Float32Array(found.length), 1); glow.setUsage(THREE.DynamicDrawUsage);
  const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false });
  type F = ReturnType<typeof float>;
  const a = instancedBufferAttribute(amt) as unknown as F, gl = instancedBufferAttribute(glow) as unknown as F;
  // 水の量でくびれが太る：量が少ないと細い糸、多いと太い鼓
  const waist = mix(float(0.25), float(1.0), a);
  const wob = sin(time.mul(1.3).add(positionLocal.y.mul(6.0))).mul(0.012);
  m.positionNode = vec3(positionLocal.x.mul(waist.add(wob)), positionLocal.y, positionLocal.z.mul(waist.add(wob)));
  const fres = pow(oneMinus(saturate(dot(normalView, positionViewDirection).abs())), 3.0);
  m.roughnessNode = float(0.02); m.metalnessNode = float(0);
  m.ior = 1.333; m.clearcoat = 1; m.clearcoatRoughness = 0.0; m.envMapIntensity = 2.5;
  // 2026-11-26：写真（ガラス玉の間の水の橋、100 倍）では、水の橋は「くびれた透明な首」で、輪郭に明るい細い線と、
  // 内側にもう一本の暗い線（光が曲がる所）が見え、中は奥が少しゆがんで透ける。前は暗く薄すぎて、ほとんど見えなかった
  m.colorNode = vec3(0.10, 0.13, 0.15);
  const edge = pow(fres, float(1.6));
  const inner = smoothstep(0.25, 0.45, fres).mul(smoothstep(0.7, 0.5, fres));      // 輪郭の内側の、暗い細い帯
  m.emissiveNode = vec3(0.30, 0.34, 0.38).mul(smoothstep(0.55, 0.95, fres)).mul(saturate(a.mul(3.0))).add(vec3(0.45, 0.85, 1.0).mul(gl).mul(fres.mul(1.6).add(0.35)));   // 音が鳴った瞬間の光（水色）   // 縁の明るい線
  m.opacityNode = saturate(a.mul(4.0)).mul(mix(float(0.16), float(0.85), edge).max(inner.mul(0.55))).add(gl.mul(0.45)).min(1.0);
  void viewportSharedTexture; void screenUV;
  void normalLocal;
  const mesh = new THREE.InstancedMesh(geo, m, found.length); mesh.name = 'waterBridges'; mesh.renderOrder = 5;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  found.forEach((f, i) => { q.setFromUnitVectors(up, f.axis); mesh.setMatrixAt(i, m4.compose(f.p, q, new THREE.Vector3(f.r, f.len, f.r))); });
  mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); mesh.frustumCulled = true;
  const cells = found.map((f) => f.cell);
  return {
    mesh, count: found.length, centers: found.map((f) => f.p), cells,
    flash(c1, c2, k = 1) { const g = glow.array as Float32Array; for (let i = 0; i < g.length; i++) if (cells[i] === c1 || cells[i] === c2) g[i] = Math.max(g[i], k); glow.needsUpdate = true; },
    tick(dt) { const g = glow.array as Float32Array; let ch = false; for (let i = 0; i < g.length; i++) if (g[i] > 0) { g[i] = Math.max(0, g[i] - dt * 1.4); ch = true; } if (ch) glow.needsUpdate = true; },
    sync(w) { const arr = amt.array as Float32Array; let ch = false; for (let i = 0; i < arr.length; i++) { const v = Math.min(1, w(cells[i])); if (Math.abs(arr[i] - v) > 0.003) { arr[i] = v; ch = true; } } if (ch) amt.needsUpdate = true; },
  };
}

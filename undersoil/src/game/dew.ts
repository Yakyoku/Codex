// 朝露：芽生えの子葉・本葉と、まわりの枯れ草の上の小さな水滴。単位は mm。
// 実物の写真（Wikimedia Commons の芽生えの接写 kz03 など）では、枯れ草や葉の上に、直径 0.1〜0.6 mm ほどの丸い水滴が光っている。
// 水滴は表面張力で丸くなり、葉の上では半球より少し高い形。中に空の明るさと、まわりの景色が逆さに映る（屈折率 1.33）。
import * as THREE from 'three/webgpu';
import { cameraPosition, dot, float, mix, normalWorld, positionWorld, pow, reflect, saturate, smoothstep, uniform, vec3 } from 'three/tsl';
import { makeRng } from './rng';

type Spot = { p: THREE.Vector3; n: THREE.Vector3; r: number };

/** 水滴の材質：中は下の葉や地面が透けて見え（レンズのように少し明るく）、縁は光が曲がって暗い細い輪になる。太陽の小さく鋭い光の点が 1 つ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dewMaterial(show: any, sun: THREE.Vector3) {
  const m = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false });
  const view = cameraPosition.sub(positionWorld).normalize();
  const nv = saturate(dot(normalWorld, view));
  const rim = smoothstep(0.55, 0.12, nv);                                   // 縁：光が曲がって、暗い輪に
  const r = reflect(view.negate(), normalWorld);
  const spark = pow(saturate(dot(r, vec3(sun.x, sun.y, sun.z).normalize())), float(90)).mul(3.0);   // 太陽の映り込み（小さく鋭い）
  const glow = smoothstep(0.75, 1.0, nv).mul(0.25);                         // 中心：レンズで集まった光で、少し明るい
  m.colorNode = mix(vec3(0.9, 0.95, 0.9).mul(glow.add(0.15)), vec3(0.03, 0.04, 0.03), rim).add(vec3(1.0, 0.98, 0.92).mul(spark));
  m.opacityNode = rim.mul(0.75).add(glow).add(spark).add(0.04).min(1.0).mul(show);
  m.toneMapped = true;
  return m;
}

export function buildDew(spots: Spot[], opts: { max?: number; sun?: THREE.Vector3 } = {}) {
  const show = uniform(0);
  const n = Math.min(spots.length, opts.max ?? 400);
  const geo = new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.62);   // 半球より少し高い、葉に乗った水滴
  const mesh = new THREE.InstancedMesh(geo, dewMaterial(show, opts.sun ?? new THREE.Vector3(0.4, 0.8, 0.3)), n); mesh.name = 'dew'; mesh.renderOrder = 5;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), s = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const sp = spots[i]; q.setFromUnitVectors(up, sp.n);
    mesh.setMatrixAt(i, m4.compose(sp.p.clone().addScaledVector(sp.n, -sp.r * 0.3), q, s.set(sp.r, sp.r * 0.95, sp.r)));
  }
  mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); mesh.frustumCulled = false;
  return { mesh, set(v: number) { show.value = v; mesh.visible = v > 0.01; } };
}

/** メッシュの表面（上を向いた所）から、水滴を置く場所を選ぶ。filter で、使う頂点をしぼる（子葉の表側など） */
export function spotsOnMesh(mesh: THREE.Mesh, count: number, seed: number, rMin: number, rMax: number, filter?: (i: number) => boolean): Spot[] {
  mesh.updateMatrixWorld(true);
  const g = mesh.geometry as THREE.BufferGeometry, P = g.attributes.position as THREE.BufferAttribute, N = g.attributes.normal as THREE.BufferAttribute;
  const nm = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld); const rng = makeRng(seed); const out: Spot[] = [];
  for (let t = 0; t < count * 60 && out.length < count; t++) {
    const i = Math.floor(rng.next() * P.count); if (filter && !filter(i)) continue;
    const n = new THREE.Vector3().fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); if (n.y < 0.35) continue;   // 上を向いた面だけ
    const p = new THREE.Vector3().fromBufferAttribute(P, i).applyMatrix4(mesh.matrixWorld);
    const r = rMin + (rMax - rMin) * rng.next() ** 2.2;
    if (out.some((o) => o.p.distanceTo(p) < (o.r + r) * 1.2)) continue;
    out.push({ p, n, r });
  }
  return out;
}

/** インスタンス（枯れ草など）の表面から、水滴を置く場所を選ぶ */
export function spotsOnInstances(mesh: THREE.InstancedMesh, perInstance: number, seed: number, rMin: number, rMax: number): Spot[] {
  const g = mesh.geometry as THREE.BufferGeometry, P = g.attributes.position as THREE.BufferAttribute, N = g.attributes.normal as THREE.BufferAttribute;
  const rng = makeRng(seed); const out: Spot[] = []; const m4 = new THREE.Matrix4(), nm = new THREE.Matrix3();
  for (let k = 0; k < mesh.count; k++) {
    mesh.getMatrixAt(k, m4); if (m4.elements[0] === 0 && m4.elements[5] === 0) continue; nm.getNormalMatrix(m4);
    const want = Math.floor(rng.next() * (perInstance + 1));
    for (let t = 0, got = 0; t < 30 && got < want; t++) {
      const i = Math.floor(rng.next() * P.count);
      const n = new THREE.Vector3().fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); if (n.y < 0) n.negate(); if (n.y < 0.5) continue;
      const p = new THREE.Vector3().fromBufferAttribute(P, i).applyMatrix4(m4);
      const r = rMin + (rMax - rMin) * rng.next() ** 2.5; out.push({ p, n, r }); got++;
    }
  }
  return out;
}

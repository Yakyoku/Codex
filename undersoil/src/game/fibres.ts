// 植物の繊維のかけら（腐植の一部）：枯れた根や葉がほぐれて残った、細いセルロースの繊維。1 単位 = 10 µm。
// 本物の土の顕微鏡写真（greenhouse_plant_residues_50x など）には、粒の表面や粒の間に、こうした茶色い細い繊維が
// ごちゃごちゃと引っかかっている。生きた菌糸ではない（菌糸は、台帳に菌類を載せるステージ 4 で扱う）。
// 太さ 1〜4 µm、長さ 50〜140 µm の細い繊維の束。茶色でつやがなく、よれて曲がる。大きな粒の表面に沿って寝かせる。
import * as THREE from 'three/webgpu';
import { float, mix, mx_noise_float, uv, vec3, instancedBufferAttribute } from 'three/tsl';
import type { Collider } from './world';
import { makeRng } from './rng';

export function buildFibres(colliders: Collider[], distToPath: (p: THREE.Vector3) => number, count: number) {
  const rng = makeRng(8181);
  // ゆるく曲がった細い管（長さ 1、太さ 1 を基準に、置くときに伸ばす）
  const pts = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1].map((t) => new THREE.Vector3(t - 0.5, Math.sin(t * 7.3) * 0.05 - (t - 0.5) ** 2 * 0.25, Math.sin(t * 4.1 + 1) * 0.16 + Math.sin(t * 11) * 0.04));   // よれて、粒の丸みに沿ってたわむ
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.011, 5, false)   // 太さは長さの約 2%（全体を同じ倍率で伸ばすので、よれた形が保たれる）;
  const tone = new Float32Array(count);
  const m = new THREE.MeshStandardNodeMaterial();
  const T = instancedBufferAttribute(new THREE.InstancedBufferAttribute(tone, 1)) as unknown as ReturnType<typeof float>;
  const streak = mx_noise_float(vec3(uv().x.mul(18.0), uv().y.mul(3.0), T.mul(9.0))).mul(0.5).add(0.5);   // 繊維に沿った細い筋
  m.colorNode = mix(vec3(0.07, 0.05, 0.03), vec3(0.15, 0.11, 0.065), T).mul(mix(float(0.75), float(1.1), streak));
  m.roughnessNode = float(0.92); m.metalnessNode = float(0);
  const mesh = new THREE.InstancedMesh(geo, m, count); mesh.name = 'fibres';
  const big = colliders.filter((c) => c.r > 4); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(); let n = 0;
  for (let k = 0; k < count * 30 && n < count; k++) {
    const c = big[Math.floor(rng.next() * big.length)];
    const d = new THREE.Vector3(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1)).normalize();
    const p = new THREE.Vector3(c.x, c.y, c.z).addScaledVector(d, c.r * 1.06);
    const dp = distToPath(p); if (dp > 14 || dp < 4.5) continue;   // 道のまん中には置かない（目の前の丸太に見える）
    if (colliders.some((o) => o !== c && (p.x - o.x) ** 2 + (p.y - o.y) ** 2 + (p.z - o.z) ** 2 < (o.r * 0.9) ** 2)) continue;
    // 表面に沿って寝かせる：管の長い軸（x）を、表面の接線へ
    const tan = new THREE.Vector3(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1)).cross(d).normalize();
    const basis = new THREE.Matrix4().makeBasis(tan, d, new THREE.Vector3().crossVectors(tan, d)); q.setFromRotationMatrix(basis);
    const len = rng.range(6, 15), w = len;   // 細い繊維の束（太さ 1〜4 µm）。太い繊維（10 µm 級）は、この大きさの世界では丸太に見えるので置かない
    mesh.setMatrixAt(n, m4.compose(p, q, s.set(len, w, w))); tone[n] = rng.next(); n++;
  }
  mesh.count = n; mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); mesh.receiveShadow = true;
  return mesh;
}

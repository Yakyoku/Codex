// シロツメクサの芽生えの主根と根毛（ステージ2）。1 単位 = 10 µm。
// 根拠：Docs/REFERENCE/rhizosphere.md（実験室育ちの芽生えの図からの目測 △）
//   ・根の太さ 約 0.35 mm（半径 17.5 単位）。白〜ごく淡い黄。表皮の細胞は縦に長い長方形（幅 約 15〜20 µm、長さ 約 100〜150 µm）が、れんがのように並ぶ
//   ・根毛：表皮の細胞 1 個から 1 本。太さ 約 13 µm（半径 0.65）、長さ 0.2〜0.45 mm、30〜40 µm おきに、根の表面から直角に出る。透明に近く、先は丸い
//   ・痩せた状態（固い土）では根毛が短い。豊かな状態で長く伸びる → uGrow（0〜1）で長さを変える
import * as THREE from 'three/webgpu';
import { attribute, dot, float, fract, instancedBufferAttribute, mix, mx_noise_float, normalView, oneMinus, positionLocal, positionViewDirection, pow, saturate, smoothstep, uniform, uv, vec3 } from 'three/tsl';
import { makeRng } from '../game/rng';
import type { Collider } from '../game/world';

export function buildRoot(spec: { a: number[]; b: number[]; radius: number }, colliders: Collider[], opts: { hairs: number }) {
  const group = new THREE.Group(); group.name = 'root';
  const A = new THREE.Vector3(...(spec.a as [number, number, number])), B = new THREE.Vector3(...(spec.b as [number, number, number])), R = spec.radius;
  const axis = B.clone().sub(A), L = axis.length(); axis.normalize();
  // ゆるく波打つ中心線（根は粒をよけて少し曲がる）
  const up = new THREE.Vector3(0, 1, 0), side = new THREE.Vector3().crossVectors(axis, up).normalize(), up2 = new THREE.Vector3().crossVectors(side, axis);
  const center = (t: number) => A.clone().addScaledVector(axis, t * L).addScaledVector(up2, Math.sin(t * 5.2) * 2.2).addScaledVector(side, Math.sin(t * 3.1 + 1) * 1.6);
  const curve = new THREE.CatmullRomCurve3(Array.from({ length: 15 }, (_, i) => center(i / 14)));
  const uGrow = uniform(0);

  // 根の本体
  const geo = new THREE.TubeGeometry(curve, 160, R, 40, false);
  const m = new THREE.MeshPhysicalNodeMaterial();
  { const u = uv();   // u.x：長さ方向（0〜1）、u.y：まわり
    // 表皮の細胞：長さ方向 約 12 単位 × まわり 約 1.8 単位のれんが積み。境目がわずかに暗くくぼむ
    const cl = u.x.mul(L / 12.0), row = u.y.mul((2 * Math.PI * R) / 1.8), off = row.floor().mul(0.37);
    const cx = fract(cl.add(off)), cy = fract(row);
    const wall = smoothstep(0.06, 0.0, cx.min(oneMinus(cx))).max(smoothstep(0.12, 0.0, cy.min(oneMinus(cy))));
    const tone = mx_noise_float(vec3(u.x.mul(40.0), u.y.mul(9.0), 0)).mul(0.5).add(0.5);
    const base = mix(vec3(0.62, 0.59, 0.47), vec3(0.72, 0.70, 0.60), tone);      // 白〜ごく淡い黄（土の中の若い根）
    m.colorNode = base.mul(mix(float(1.0), float(0.72), wall));
    m.roughnessNode = mix(float(0.55), float(0.4), uGrow); m.metalnessNode = float(0);
    const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 2.0);
    m.emissiveNode = vec3(0.30, 0.28, 0.20).mul(rim).mul(0.25);                   // 若い根は少し透ける：縁がほんのり明るい
    m.clearcoatNode = uGrow.mul(0.35); m.clearcoatRoughnessNode = float(0.3);     // 豊かなときは粘液でしっとり
  }
  const body = new THREE.Mesh(geo, m); body.name = 'root_body'; body.castShadow = true; body.receiveShadow = true; group.add(body);

  // 根毛：先の丸い細い管。長さ 1・半径 1 を基準に、置くときに伸ばす（+Y が先）
  // 形：y=0〜1 が管の本体、y=1〜2 が丸い先（先の丸みは、長さではなく太さの倍率で伸ばす）
  const prof: THREE.Vector2[] = []; for (let i = 0; i <= 8; i++) prof.push(new THREE.Vector2(1, i / 8)); for (let i = 1; i <= 6; i++) { const a2 = (i / 6) * Math.PI / 2; prof.push(new THREE.Vector2(Math.max(0.001, Math.cos(a2)), 1 + Math.sin(a2))); }
  const hg = new THREE.LatheGeometry(prof, 14);
  const n = opts.hairs, rng = makeRng(2828);
  const pos = new Float32Array(n * 3), dir = new Float32Array(n * 3), len = new Float32Array(n), ph = new Float32Array(n);
  let k = 0;
  for (let t = 0; t < n * 6 && k < n; t++) {
    const u = rng.next(), ang = rng.range(0, Math.PI * 2);
    const c = curve.getPointAt(u), tan = curve.getTangentAt(u), s1 = new THREE.Vector3().crossVectors(tan, up).normalize(), s2 = new THREE.Vector3().crossVectors(s1, tan);
    const nrm = s1.multiplyScalar(Math.cos(ang)).addScaledVector(s2, Math.sin(ang)).normalize();
    const p = c.addScaledVector(nrm, R * 0.98);
    // 伸びる先に、すぐ大きな粒がある所は短くなる（根毛は粒のすき間へ伸びる）
    let maxLen = 20 + 25 * rng.next() ** 1.5;
    for (const o of colliders) { const v = new THREE.Vector3(o.x, o.y, o.z).sub(p), tt = v.dot(nrm); if (tt < 0 || tt > maxLen + o.r) continue; const off2 = v.lengthSq() - tt * tt; if (off2 < (o.r * 0.9) ** 2) maxLen = Math.min(maxLen, Math.max(4, tt - Math.sqrt((o.r * 0.9) ** 2 - off2))); }
    pos.set([p.x, p.y, p.z], k * 3); dir.set([nrm.x, nrm.y, nrm.z], k * 3); len[k] = maxLen; ph[k] = rng.next(); k++;
  }
  type F = ReturnType<typeof float>; type V = ReturnType<typeof vec3>;
  const aP = instancedBufferAttribute(new THREE.InstancedBufferAttribute(pos, 3)) as unknown as V, aD = instancedBufferAttribute(new THREE.InstancedBufferAttribute(dir, 3)) as unknown as V;
  const aL = instancedBufferAttribute(new THREE.InstancedBufferAttribute(len, 1)) as unknown as F, aPh = instancedBufferAttribute(new THREE.InstancedBufferAttribute(ph, 1)) as unknown as F;
  const hm = new THREE.MeshPhysicalNodeMaterial({ transparent: true });   // 奥行きは書く（重なりが破れて見えないように）
  { // 長さ：痩せた状態では 3 割、豊かな状態で全長。少し曲がる
    const lenNow = aL.mul(mix(float(0.3), float(1.0), smoothstep(aPh.mul(0.5), aPh.mul(0.5).add(0.5), uGrow)));
    const bx = aD.cross(vec3(0.21, 0.93, 0.3)).normalize(), bz = aD.cross(bx);
    const y = positionLocal.y;   // 0〜1（先の丸みを含めると少し超える）
    const yy = y.min(1.0); const bend = bx.mul(yy.mul(yy).mul(aPh.sub(0.5).mul(6.0))).add(bz.mul(yy.mul(yy).mul(fract(aPh.mul(7.0)).sub(0.5).mul(6.0))));
    const yb = y.min(1.0), yt = y.sub(1.0).max(0.0);   // 本体と、丸い先
    hm.positionNode = aP.add(aD.mul(yb.mul(lenNow).add(yt.mul(0.65)))).add(bx.mul(positionLocal.x.mul(0.65))).add(bz.mul(positionLocal.z.mul(0.65))).add(bend);
    const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 1.6);
    // 写真（明視野）：根毛は透明に近い管で、輪郭の線がはっきりし、中に細かい粒（細胞質）が流れて見える
    const gran = smoothstep(0.55, 0.85, mx_noise_float(vec3(positionLocal.x.mul(3.0), y.mul(lenNow).mul(1.2), positionLocal.z.mul(3.0)).add(aPh.mul(50.0))).add(0.5));
    hm.colorNode = mix(vec3(0.60, 0.59, 0.52), vec3(0.42, 0.40, 0.32), gran.mul(0.6)); hm.roughnessNode = float(0.35);
    hm.emissiveNode = vec3(0.30, 0.29, 0.24).mul(rim).mul(0.25);
    hm.opacityNode = mix(float(0.42), float(0.95), smoothstep(0.25, 0.85, rim)).max(gran.mul(0.5));
    void attribute;
  }
  const hairs = new THREE.InstancedMesh(hg, hm, k); hairs.name = 'root_hairs'; hairs.frustumCulled = false; hairs.renderOrder = 4; group.add(hairs);
  return { group, curve, radius: R, hairCount: k, /** 0＝痩せた状態（根毛が短い）〜 1＝豊かな状態 */ setGrow(v: number) { uGrow.value = v; } };
}

// 細菌の群れ：桿菌（両端が丸い棒）をインスタンス描画し、動きは頂点シェーダーで作る。
// 水の膜の中でだけ泳ぐ。乾いた区画では見えない（芽胞として休眠している）。
import * as THREE from 'three/webgpu';
import { float, vec3, instancedBufferAttribute, time, sin, cos, positionLocal, mix, saturate, normalView, positionViewDirection, dot, pow, oneMinus, hash, instanceIndex , uniform, smoothstep, mx_noise_float, positionWorld, cameraPosition } from 'three/tsl';
import type { Collider } from './world';
import { makeRng } from './rng';

export interface Swarm { attract(p: THREE.Vector3 | null, k: number): void; highlight(p: THREE.Vector3 | null): void; mesh: THREE.InstancedMesh; count: number; sync(microbesOfCell: (cell: number) => number): void; find(from: THREE.Vector3, fwd: THREE.Vector3): { p: THREE.Vector3; r: number } | null; }

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
        if (species === 'bacillus' && rng.next() < 0.55) bright[k] = rng.range(0.6, 1.0);   // 芽胞：細胞の中の楕円（位置は細胞の中ほど〜端寄り）
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
  // 走化性：糖のしずくが置かれると、近く（半径 約 80µm）の細菌が、しずくのまわりへ寄ってくる（しずくの表面で止まり、重ならない）
  const uSug = uniform(new THREE.Vector3()), uSugK = uniform(0);
  const pullOf = (p: V) => { const to = uSug.sub(p), dist = to.length(); return to.mul(smoothstep(8.0, 1.5, dist).mul(saturate(dist.sub(0.45).div(dist.max(0.001)))).mul(uSugK).mul(0.82)); };
  m.positionNode = aPos.add(drift).add(pullOf(aPos)).add(rotated.mul(live));
  // 見た目（持ち主の資料と顕微鏡写真）：両端の丸い棒。細い暗い輪郭線、中は淡い灰色で細かい粒々。
  //   枯草菌：多くは細胞の中に楕円の芽胞（くすんだ灰緑色で、縁がくっきり）。まわりに細く波打つ鞭毛が数本
  //   シュードモナス：やや短く、わずかに黄緑がかる。片方の端から長く波打つ鞭毛が数本の束（P. fluorescens は 1 本より多い極鞭毛。電子顕微鏡の写真で確認）
  const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 2.0);
  const R0 = species === 'bacillus' ? 0.04 : 0.035, HL = species === 'bacillus' ? 0.11 : 0.06;   // 枯草菌は長さ約 3µm・太さ 0.8µm（写真の細長さ）
  const grain = smoothstep(0.55, 0.85, mx_noise_float(lp.mul(90.0).add(aPh.mul(13.0))).add(0.5));
  // 2026-11-26：遠くでは白い棒（糸くず）に見えていたので、本物の写真（位相差：暗い灰色の棒）に合わせて暗く、光らせない
  const base = species === 'bacillus' ? vec3(0.27, 0.265, 0.25) : vec3(0.25, 0.25, 0.20);
  let col = base.mul(mix(float(1.0), float(0.72), grain));
  // 芽胞：細胞の長軸上、中ほど（やや端寄り）に楕円
  const so = aPh.sub(0.5).mul(HL * 0.6), sd = vec3(lp.x.div(R0 * 0.62), lp.y.sub(so).div(HL * 0.55), lp.z.div(R0 * 0.62)).length();
  const spore = smoothstep(1.0, 0.85, sd).mul(aBright), sporeRim = smoothstep(1.05, 0.95, sd).sub(smoothstep(0.92, 0.8, sd)).mul(aBright);
  col = mix(col, vec3(0.34, 0.33, 0.28), spore.mul(0.8));
  col = mix(col, vec3(0.08, 0.08, 0.07), sporeRim.mul(0.7));
  col = mix(col, vec3(0.07, 0.07, 0.065), smoothstep(0.35, 0.8, rim).mul(0.85));   // 細い暗い輪郭線（明視野では縁が暗く見える）
  m.colorNode = col;
  const uHi = uniform(new THREE.Vector3()), uHiOn = uniform(0);
  const near = smoothstep(2.2, 0.8, aPos.distance(uHi)).mul(uHiOn);
  m.emissiveNode = col.mul(0.06).add(vec3(0.55, 0.38, 0.16).mul(rim.mul(0.7).add(0.3)).mul(near));
  m.opacityNode = mix(float(0.62), float(0.95), rim).max(near.mul(0.9));
  m.roughnessNode = float(0.5); m.metalnessNode = float(0);
  void hash; void instanceIndex;
  const mesh = new THREE.InstancedMesh(geo, m, n2); mesh.name = 'swarm_' + species; mesh.frustumCulled = false;
  // 鞭毛：細いリボンを細胞ごとに置き、細胞と同じ動きに、波打ちを足す
  const NF = 3, FL = species === 'bacillus' ? 0.32 : 0.5;
  const fseg = 14, fg = new THREE.BufferGeometry(); { const fp: number[] = [], fi: number[] = [];
    for (let i = 0; i <= fseg; i++) { const sv = i / fseg; fp.push(-0.5, sv, 0, 0.5, sv, 0); if (i < fseg) { const a = i * 2; fi.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    fg.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3)); fg.setIndex(fi); }
  const fIdx = new Float32Array(n2 * NF * 2);
  const rep3 = (src: Float32Array) => { const o = new Float32Array(n2 * NF * 3); for (let i = 0; i < n2; i++) for (let f = 0; f < NF; f++) o.set(src.subarray(i * 3, i * 3 + 3), (i * NF + f) * 3); return o; };
  const rep1 = (src: Float32Array) => { const o = new Float32Array(n2 * NF); for (let i = 0; i < n2; i++) for (let f = 0; f < NF; f++) o[i * NF + f] = src[i]; return o; };
  for (let i = 0; i < n2; i++) for (let f = 0; f < NF; f++) { const o = (i * NF + f) * 2; fIdx[o] = species === 'bacillus' ? rng.range(-0.8, 0.8) : -1; fIdx[o + 1] = rng.range(0, 6.28); }
  // シュードモナスの鞭毛の本数は株で違う（SBW25 株は平均 1.5 本、束で持つ株もある）。細胞ごとに 1〜3 本にする
  const fMask = new Float32Array(n2 * NF).fill(1);
  if (species === 'pseudomonas') for (let i = 0; i < n2; i++) { const k = 1 + Math.floor(rng.next() * 2.6); for (let f = k; f < NF; f++) fMask[i * NF + f] = 0; }
  const fLive = new THREE.InstancedBufferAttribute(new Float32Array(n2 * NF), 1); fLive.setUsage(THREE.DynamicDrawUsage);
  const fA = (arr: Float32Array, sz: number) => instancedBufferAttribute(new THREE.InstancedBufferAttribute(arr, sz));
  const fPos = fA(rep3(pos.subarray(0, n2 * 3)), 3) as unknown as V, fTan = fA(rep3(tang.subarray(0, n2 * 3)), 3) as unknown as V, fPh = fA(rep1(ph.subarray(0, n2)), 1) as unknown as F, fSw = fA(rep1(swim.subarray(0, n2)), 1) as unknown as F;
  const fAt = fA(fIdx, 2) as unknown as ReturnType<typeof vec3>, fL = instancedBufferAttribute(fLive) as unknown as F;
  const fm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
  { const tt2 = time.mul(mix(float(0.5), float(1.1), fPh)).mul(species === 'pseudomonas' ? 2.2 : 1.0).add(fPh.mul(40.0));
    const side2 = fTan.cross(vec3(0.3, 0.9, 0.2)).normalize();
    const run2 = sin(tt2).mul(0.9).add(sin(tt2.mul(0.37).add(fPh.mul(6.0))).mul(1.6));
    const center = fPos.add(pullOf(fPos)).add(fTan.mul(run2).add(side2.mul(cos(tt2.mul(0.61)).mul(0.5))).mul(fSw).mul(0.35));
    const hd = species === 'pseudomonas' ? fTan.mul(cos(tt2).sign().add(0.001)).add(side2.mul(sin(tt2.mul(0.61)).mul(-0.3))).normalize() : fTan;
    const ax = hd.cross(vec3(0.0, 0.0, 1.0)).normalize(), az = hd.cross(ax);
    const radial = ax.mul(cos(fAt.y)).add(az.mul(sin(fAt.y)));
    const root = center.add(hd.mul(fAt.x.mul(HL + R0 * 0.8))).add(radial.mul(species === 'bacillus' ? R0 : R0 * 0.3));
    const dir = (species === 'bacillus' ? radial.mul(0.75).sub(hd.mul(0.65)) : hd.negate().add(radial.mul(0.2))).normalize();
    const perp = dir.cross(radial.add(vec3(0.01, 0.02, 0.0))).normalize();
    const sv = positionLocal.y, wave = sin(sv.mul(12.0).sub(time.mul(species === 'pseudomonas' ? 30.0 : 14.0)).add(fPh.mul(20.0))).mul(0.045).mul(sv.add(0.15));
    fm.positionNode = root.add(dir.mul(sv.mul(FL))).add(perp.mul(wave)).add(perp.cross(dir).mul(positionLocal.x.mul(0.006))).mul(fL).add(center.mul(oneMinus(fL)));
    // 鞭毛の太さは 0.02µm で、本物では光学顕微鏡でもほぼ見えない。遠くでは消し、すぐそば（約 20µm 以内）でだけ、ごく淡く見せる
    // （2026-11-25：iPad で、粒のまわりに白い糸くずが大量に見えるとの指摘。前は距離に関係なく不透明度 0.38 だった）
    const near = smoothstep(2.0, 0.6, positionWorld.sub(cameraPosition).length());
    fm.colorNode = vec3(0.42, 0.42, 0.40); fm.opacityNode = float(0.12).mul(oneMinus(sv.mul(0.6))).mul(fL).mul(near); }
  const flag = new THREE.InstancedMesh(fg, fm, n2 * NF); flag.name = 'swarm_flagella_' + species; flag.frustumCulled = false; mesh.add(flag);
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
  return { attract(p: THREE.Vector3 | null, k: number) { if (p) uSug.value.copy(p); uSugK.value = k; }, highlight(p) { if (p) { uHi.value.copy(p); uHiOn.value = 1; } else uHiOn.value = 0; }, mesh, count: n2, find, sync(w) { const a = liveAttr.array as Float32Array; let ch = false; for (let i = 0; i < n2; i++) { const target = w(cells[i]) > (i % 97) / 97 * 0.9 + 0.05 ? 1 : 0; if (a[i] !== target) { a[i] += Math.sign(target - a[i]) * 0.2; if (Math.abs(a[i] - target) < 0.2) a[i] = target; ch = true; } } if (ch) { liveAttr.needsUpdate = true; const fa = fLive.array as Float32Array; for (let i = 0; i < n2; i++) for (let f = 0; f < NF; f++) fa[i * NF + f] = a[i] * fMask[i * NF + f]; fLive.needsUpdate = true; } } };
}

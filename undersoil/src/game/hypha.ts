// 菌根菌の菌糸（M2「菌糸を滑る」）。種の近くの土の中で眠っていた胞子が芽を出し、菌糸が粒のすき間を伸びて、種（根）のほうへ向かう。
//   ・菌糸は 1 本の長い管（仕切りがなく、中を油の粒や核が流れる）。粒を避けて、すき間を通る
//   ・種に近い先のほうは、根から出る合図（ストリゴラクトン）で、細かく枝分かれする
//   ・プレイヤーは、近くで「菌糸に乗る」を押すと、菌糸の表面に沿って高速で滑る（前後は移動の入力で。もう一度押すと降りる）
//   数値（太さ・色・流れの速さ）は Docs/REFERENCE/am-fungus.md と SPECIES.md の台帳から。単位は 1 = 10 µm。
import * as THREE from 'three/webgpu';
import { float, mix, normalView, positionViewDirection, dot, pow, oneMinus, saturate, vec3, uniform } from 'three/tsl';
import { pushOut } from './controls';
import type { World } from './world';
import { makeRng } from './rng';

export type HyphaOpts = { r: number; branchR: number; spore: number; color: [number, number, number]; sporeColor: [number, number, number]; flow: number; uFrom: number; uTo: number; side: number; seed: number; lite?: boolean };
export interface Hypha {
  group: THREE.Group; curve: THREE.CatmullRomCurve3; length: number; r: number; spore: THREE.Vector3;
  /** p から菌糸の表面までの距離と、いちばん近い位置（0〜1） */
  near(p: THREE.Vector3): { d: number; u: number };
  /** 菌糸の上（表面から少し離れた位置）と、その場所の進む向き */
  rideAt(u: number, up: THREE.Vector3, out: THREE.Vector3): THREE.Vector3;
  tangentAt(u: number, out: THREE.Vector3): THREE.Vector3;
  /** 0〜1：菌糸がどこまで伸びたか（土の活力で伸びる） */
  grow: number; highlight(on: boolean): void; update(dt: number, vit: number): void;
}

/** 粒のすき間を通る道筋：道ぞいの点を横へずらし、粒から押し出して、なめらかにする */
function route(world: World, o: HyphaOpts) {
  const rng = makeRng(o.seed); const pts: THREE.Vector3[] = []; const n = 26;
  const side = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), tan = new THREE.Vector3();
  for (let i = 0; i <= n; i++) {
    const u = o.uFrom + (o.uTo - o.uFrom) * (i / n); const p = world.path.getPointAt(u); world.path.getTangentAt(u, tan);
    side.crossVectors(tan, up).normalize();
    const wob = Math.sin(i * 0.7 + o.seed) * 1.2 + Math.sin(i * 2.3) * 0.45 + (rng.next() - 0.5) * 1.0;   // 写真（Richter 2024）：細く、ゆるく波打って伸びる
    p.addScaledVector(side, o.side + wob).addScaledVector(up, -1.2 + Math.sin(i * 0.45) * 0.9);
    for (let k = 0; k < 6; k++) pushOut(p, world.colliders, o.r + 0.25);
    pts.push(p);
  }
  // なめらかにしてから、もう一度粒を避ける
  for (let it = 0; it < 3; it++) for (let i = 1; i < pts.length - 1; i++) { pts[i].lerp(pts[i - 1].clone().add(pts[i + 1]).multiplyScalar(0.5), 0.5); pushOut(pts[i], world.colliders, o.r + 0.25); }
  return pts;
}

function hyphaMaterial(color: [number, number, number], glowU: { value: number }) {
  const glow = glowU as unknown as ReturnType<typeof float>;
  // 透明に近い管：縁が明るく、中はうっすら色づく。光の顕微鏡では、縁の線と、中を流れる粒で管だと分かる
  const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const fres = pow(oneMinus(saturate(dot(normalView, positionViewDirection).abs())), 2.2);
  m.colorNode = vec3(...color).mul(0.35); m.roughnessNode = float(0.2); m.metalnessNode = float(0);
  m.emissiveNode = vec3(...color).mul(pow(fres, float(2.0)).mul(0.45)).add(vec3(0.5, 0.8, 1.0).mul(glow).mul(fres.add(0.2)));
  m.opacityNode = mix(float(0.06), float(0.75), pow(fres, float(1.4))).add(glow.mul(0.2)).min(1);   // 生きた菌糸は無色で透明に近い。縁の線と中を流れる粒で、管だと分かる
  return m;
}

/** 油の粒：光を曲げるので、写真では明るい中心と、暗い輪郭の輪に見える */
function lipidMat(c: [number, number, number]) {
  const m = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false });
  const f = pow(oneMinus(saturate(dot(normalView, positionViewDirection).abs())), 1.2);
  m.colorNode = mix(vec3(c[0] * 1.05, c[1] * 0.98, c[2] * 0.75), vec3(c[0] * 0.18, c[1] * 0.14, c[2] * 0.08), f);
  m.opacityNode = mix(float(0.45), float(0.95), f);
  return m;
}

export function buildHypha(world: World, seedPos: THREE.Vector3, o: HyphaOpts): Hypha {
  const group = new THREE.Group(); group.name = 'hypha';
  const pts = route(world, o); const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5); const length = curve.getLength();
  const glow = uniform(0) as unknown as { value: number }; const mat = hyphaMaterial(o.color, glow);
  const seg = o.lite ? 180 : 420, radial = o.lite ? 8 : 14;
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, seg, o.r, radial, false), mat); tube.renderOrder = 4; group.add(tube);
  // 伸びる：先端までを描く範囲で表す（インデックスの数で切る）
  const idx = tube.geometry.index!; const full = idx.count;
  // 先の丸み（伸びている先端）
  const tip = new THREE.Mesh(new THREE.SphereGeometry(o.r, radial, 8), mat); group.add(tip);
  // 胞子：道の始まりの横に、丸い大きな粒（菌糸の付け根）
  const spore = pts[0].clone().addScaledVector(curve.getTangentAt(0).negate(), o.spore * 0.9);
  for (let k = 0; k < 4; k++) pushOut(spore, world.colliders, o.spore);
  // 胞子：淡黄〜黄褐色の厚い壁（3 層、合わせて 数 µm）。中に、油の粒（脂質）がぎっしり詰まって透けて見える
  const sc0 = o.sporeColor;
  const wallMat = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
  { const f = pow(oneMinus(saturate(dot(normalView, positionViewDirection).abs())), 1.6); wallMat.colorNode = vec3(...sc0); wallMat.roughnessNode = float(0.3); wallMat.metalnessNode = float(0);
    wallMat.emissiveNode = vec3(sc0[0] * 0.35, sc0[1] * 0.3, sc0[2] * 0.2).mul(f); wallMat.opacityNode = mix(float(0.18), float(0.95), pow(f, float(1.3))); }   // 写真：縁は暗く厚い壁の輪、中は油の粒が透けて見える
  const sporeG = new THREE.Group(); sporeG.position.copy(spore); sporeG.name = 'amSpore'; group.add(sporeG);
  const wall = new THREE.Mesh(new THREE.SphereGeometry(o.spore, 48, 32), wallMat); wall.scale.set(1, 0.94, 1.04); sporeG.add(wall);
  const inner = new THREE.Mesh(new THREE.SphereGeometry(o.spore * 0.9, 40, 28), new THREE.MeshBasicMaterial({ color: new THREE.Color(sc0[0] * 0.55, sc0[1] * 0.45, sc0[2] * 0.25), transparent: true, opacity: 0.25, depthWrite: false })); inner.scale.copy(wall.scale); sporeG.add(inner);
  { const nL = o.lite ? 120 : 340; const lip = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), lipidMat(sc0), nL);
    const r2 = makeRng(o.seed + 3), m = new THREE.Matrix4(), v = new THREE.Vector3(), q0 = new THREE.Quaternion(), s0 = new THREE.Vector3();
    for (let i = 0; i < nL; i++) { do { v.set(r2.next() * 2 - 1, r2.next() * 2 - 1, r2.next() * 2 - 1); } while (v.lengthSq() > 1); v.multiplyScalar(o.spore * 0.8); lip.setMatrixAt(i, m.compose(v, q0, s0.setScalar(o.spore * (0.075 + r2.next() * 0.035)))); }
    sporeG.add(lip); }
  // 付着菌糸（胞子の柄、太さ 約 11 µm ○）：発芽管は、この柄の中の通り道から出る
  { const dir = pts[0].clone().sub(spore).normalize(); const stub = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, o.spore * 0.5, 16, 1, true), wallMat); stub.position.copy(spore).addScaledVector(dir, o.spore * 1.05); stub.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); group.add(stub); }
  // 種に近い先：根の合図で、細かく枝分かれする
  const rng = makeRng(o.seed + 7); const branches: THREE.Mesh[] = [];
  for (let b = 0; b < (o.lite ? 5 : 9); b++) {
    const u0 = 0.72 + 0.26 * (b / 9) + rng.next() * 0.02; const p0 = curve.getPointAt(u0), t0 = curve.getTangentAt(u0);
    const dir = new THREE.Vector3(rng.next() - 0.5, rng.next() - 0.5, rng.next() - 0.5).normalize().addScaledVector(t0, 0.4).addScaledVector(seedPos.clone().sub(p0).normalize(), 0.5).normalize();
    const L = 3 + rng.next() * 6; const bp = [p0.clone()]; const q = p0.clone();
    for (let k = 1; k <= 5; k++) { q.addScaledVector(dir, L / 5); dir.add(new THREE.Vector3(rng.next() - 0.5, rng.next() - 0.5, rng.next() - 0.5).multiplyScalar(0.35)).normalize(); const c = q.clone(); pushOut(c, world.colliders, o.branchR + 0.1); bp.push(c); }
    const bc = new THREE.CatmullRomCurve3(bp); const m = new THREE.Mesh(new THREE.TubeGeometry(bc, 24, o.branchR, Math.max(6, radial - 4), false), mat); m.userData.u0 = u0; group.add(m); branches.push(m);
  }
  // 根から遠い枝：中身が引き上げられて空になり、仕切り（隔壁）で切り離された透明な管（本種で確認 ○）
  { const emptyMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(o.color[0] * 0.5, o.color[1] * 0.5, o.color[2] * 0.45), transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide });
    const septMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(o.color[0] * 0.6, o.color[1] * 0.58, o.color[2] * 0.5), transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide });
    for (const u0 of [0.08, 0.22]) { const p0 = curve.getPointAt(u0); const dir = new THREE.Vector3(rng.next() - 0.5, -0.3, rng.next() - 0.5).normalize(); const bp = [p0.clone()]; const q = p0.clone();
      for (let k = 1; k <= 4; k++) { q.addScaledVector(dir, 1.6); const c = q.clone(); pushOut(c, world.colliders, o.branchR * 1.6 + 0.1); bp.push(c); }
      const bc = new THREE.CatmullRomCurve3(bp); group.add(new THREE.Mesh(new THREE.TubeGeometry(bc, 20, o.branchR * 1.6, 8, false), emptyMat));
      for (const su of [0.25, 0.55, 0.85]) { const d = new THREE.Mesh(new THREE.CircleGeometry(o.branchR * 1.6, 12), septMat); d.position.copy(bc.getPointAt(su)); d.lookAt(d.position.clone().add(bc.getTangentAt(su))); group.add(d); } } }
  // 動画（Oyarte Galvez 2025）：管の中は細かい粒でいっぱいで、それが流れる。
  // 中を流れる粒（油の粒や核）：両方向に並んで流れる（ふだん 2〜10 µm/秒、ときどき速い流れ ○）。管の中を、ゆっくり両方向へ流れる
  const nDrop = o.lite ? 220 : 700; const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(o.color[0] * 0.32, o.color[1] * 0.31, o.color[2] * 0.28), transparent: true, opacity: 0.6, depthWrite: false }), nDrop);
  drops.frustumCulled = false; group.add(drops);
  const dropU = Float32Array.from({ length: nDrop }, () => Math.random()), dropDir = Float32Array.from({ length: nDrop }, () => (Math.random() < 0.55 ? 1 : -1) * (Math.random() < 0.08 ? 4 + Math.random() * 2 : 0.4 + Math.random() * 1.4)), dropOff = Array.from({ length: nDrop }, () => new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(o.r * 1.3)), dropS = Float32Array.from({ length: nDrop }, () => o.r * (0.06 + Math.random() * 0.12));

  // 菌糸の道：菌糸の表面を、細菌が伝って動く（本種で根粒菌の移動を確認 ○。1 個ずつの速さは、別の菌糸の上のシュードモナスで 約 2 µm/秒と 約 24 µm/秒の 2 群 ○）
  const nB = o.lite ? 8 : 24; const bac = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.045, 0.16, 4, 8), new THREE.MeshStandardMaterial({ color: 0x5a5040, roughness: 0.6 }), nB); bac.frustumCulled = false; bac.name = 'hyphaBacteria'; group.add(bac);
  const bU = Float32Array.from({ length: nB }, () => 0.3 + Math.random() * 0.6), bA = Float32Array.from({ length: nB }, () => Math.random() * Math.PI * 2), bV = Float32Array.from({ length: nB }, () => (Math.random() < 0.5 ? 1 : -1) * (Math.random() < 0.3 ? 2.4 : 0.2));
  // 近さを素早く調べるための、曲線上の点
  const N = 400; const samp = curve.getSpacedPoints(N);
  const tmp = new THREE.Vector3(), nrm = new THREE.Vector3(), bin = new THREE.Vector3(), m4 = new THREE.Matrix4(), qq = new THREE.Quaternion(), sc = new THREE.Vector3();
  const h: Hypha = {
    group, curve, length, r: o.r, spore, grow: 0.25,
    near(p) { let best = 1e9, bi = 0; for (let i = 0; i <= N; i++) { const d = samp[i].distanceToSquared(p); if (d < best) { best = d; bi = i; } } const u = bi / N; return { d: Math.sqrt(best) - o.r, u: Math.min(u, h.grow) }; },
    tangentAt(u, out) { return out.copy(curve.getTangentAt(Math.min(1, Math.max(0, u)))); },
    rideAt(u, up, out) { const uu = Math.min(1, Math.max(0, u)); curve.getPointAt(uu, out); curve.getTangentAt(uu, tmp); nrm.copy(up).addScaledVector(tmp, -up.dot(tmp)).normalize(); return out.addScaledVector(nrm, o.r + 0.85); },
    highlight(on) { glow.value = on ? 0.6 : 0; },
    update(dt, vit) {
      // 伸びる：活力が上がると、先端が種のほうへ伸びる（本物はおよそ 1 日に数 mm 以下。ゲームでは時間を縮めている）
      h.grow = Math.min(1, h.grow + dt * (0.004 + vit * 0.03));
      const g = h.grow; tube.geometry.setDrawRange(0, Math.floor((full / 6) * g) * 6);
      curve.getPointAt(g, tmp); tip.position.copy(tmp);
      for (const b of branches) b.visible = g > (b.userData.u0 as number) + 0.02;
      for (let i = 0; i < nDrop; i++) {
        dropU[i] += dropDir[i] * dt * o.flow / length; if (dropU[i] > g) dropU[i] = 0; if (dropU[i] < 0) dropU[i] = g;
        const u = dropU[i]; curve.getPointAt(u, tmp); curve.getTangentAt(u, nrm); bin.set(0, 1, 0).cross(nrm).normalize(); const up2 = nrm.clone().cross(bin);
        tmp.addScaledVector(bin, dropOff[i].x).addScaledVector(up2, dropOff[i].y);
        drops.setMatrixAt(i, m4.compose(tmp, qq, sc.setScalar(dropS[i])));
      }
      drops.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < nB; i++) {
        bU[i] += bV[i] * dt / length; if (bU[i] > g || bU[i] < 0.02) { bV[i] = -bV[i]; bU[i] = Math.min(g, Math.max(0.02, bU[i])); }
        const u = bU[i]; curve.getPointAt(u, tmp); curve.getTangentAt(u, nrm); bin.set(0, 1, 0).cross(nrm).normalize(); const up2 = nrm.clone().cross(bin);
        bA[i] += dt * 0.1; const off = o.r + 0.05; tmp.addScaledVector(bin, Math.cos(bA[i]) * off).addScaledVector(up2, Math.sin(bA[i]) * off);
        qq.setFromUnitVectors(new THREE.Vector3(0, 1, 0), nrm); bac.setMatrixAt(i, m4.compose(tmp, qq, sc.setScalar(1)));
      }
      bac.instanceMatrix.needsUpdate = true; qq.identity();
    },
  };
  h.update(0, 0);
  return h;
}

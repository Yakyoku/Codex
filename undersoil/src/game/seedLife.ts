// 種のまわりの「目覚め」：吸水した種の表面の水の膜、種からしみ出す養分、集まってくる細菌、種皮の割れ目からのぞく白い幼根。1 単位 = 10 µm。
// 根拠：Docs/REFERENCE/species/trifolium-repens.md「S1 吸水」「S2 幼根が出る」と、GDD の 8（目覚めの引き金＝水が、種からしみ出した養分を運ぶこと）。
//   ・吸水した種からは、糖やアミノ酸などがまわりの水にしみ出す（種子圏の総説）。細菌はそれを目当てに種の表面に集まる。
//   ・しみ出す養分そのものは無色で見えない。ここでは、見えるように淡い色をつけて「流れ」として描く（紹介カードにもそう書く）。
//   ・幼根は、こぶ（幼根の先）の側で種皮を破って出る。白く、太さ 約 0.3〜0.4mm（△）。ここでは「少しのぞく」ところまで。
import * as THREE from 'three/webgpu';
import { attribute, cameraPosition, dot, float, instancedBufferAttribute, mix, mx_noise_float, normalWorld, oneMinus, positionLocal, positionWorld, pow, saturate, sin, smoothstep, time, uniform, uv, vec3 } from 'three/tsl';
import { makeRng } from './rng';

export function buildSeedLife(seed: THREE.Mesh, opts: { cells?: number; plumes?: number } = {}) {
  const group = new THREE.Group(); group.name = 'seed_life';
  seed.updateMatrixWorld(true);
  const M = seed.matrixWorld, NM = new THREE.Matrix3().getNormalMatrix(M);
  const geo = seed.geometry as THREE.BufferGeometry, P = geo.attributes.position as THREE.BufferAttribute, N = geo.attributes.normal as THREE.BufferAttribute;
  const uWake = uniform(0);        // 目覚めの度合い（0〜1）：区画の活力と、道の終わりの水の量から
  const uRoot = uniform(0);        // 幼根ののぞき具合（0〜1）
  const rng = makeRng(4242);
  const toPath = new THREE.Vector3(-1, 0.1, 0).normalize();   // 道の終わりの向き（種から見て −X）

  // 1) 水の膜：種の表面をおおう、ごく薄い水。縁で光を返し、ゆっくりゆらぐ
  {
    const g = geo.clone(); g.scale(1.012, 1.012, 1.02);
    const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false });
    const view = cameraPosition.sub(positionWorld).normalize();
    const fres = pow(oneMinus(saturate(dot(normalWorld, view))), float(3.0));
    const ripple = mx_noise_float(positionLocal.mul(0.08).add(vec3(0, time.mul(0.15), 0))).mul(0.5).add(0.5);
    m.colorNode = vec3(0.75, 0.82, 0.88); m.roughnessNode = float(0.05); m.metalnessNode = float(0);
    m.opacityNode = fres.mul(0.55).add(ripple.mul(0.06)).mul(uWake.mul(0.7).add(0.3));
    m.clearcoatNode = float(1); m.clearcoatRoughnessNode = float(0.03);
    const mesh = new THREE.Mesh(g, m); mesh.matrixAutoUpdate = false; mesh.matrix.copy(M); mesh.renderOrder = 3; mesh.name = 'seed_water';
    group.add(mesh);
  }

  // 表面の点を、道の側（細菌が来る側）から選ぶ
  const pick = (n: number, minFacing: number) => {
    const out: { p: THREE.Vector3; n: THREE.Vector3 }[] = []; const p = new THREE.Vector3(), nn = new THREE.Vector3();
    for (let t = 0; t < n * 40 && out.length < n; t++) {
      const i = Math.floor(rng.next() * P.count); p.fromBufferAttribute(P, i).applyMatrix4(M); nn.fromBufferAttribute(N, i).applyMatrix3(NM).normalize();
      if (nn.dot(toPath) < minFacing - rng.next() * 0.3) continue;
      out.push({ p: p.clone(), n: nn.clone() });
    }
    return out;
  };

  // 2) しみ出す養分の流れ：種の表面から、道のほうへゆらめきながら広がる淡い帯（見えるように色をつけている）
  {
    const nPl = opts.plumes ?? 14, seg = 24;
    const pos: number[] = [], uvs: number[] = [], idx: number[] = [];
    let base = 0;
    for (const s of pick(nPl, 0.35)) {
      const side = new THREE.Vector3().crossVectors(s.n, new THREE.Vector3(0, 1, 0)).normalize(); if (side.lengthSq() < 0.1) side.set(1, 0, 0);
      const len = 18 + rng.next() * 22, w0 = 2 + rng.next() * 2.5, curl = rng.range(-0.4, 0.4);
      for (let k = 0; k <= seg; k++) {
        const t = k / seg, w = w0 * (0.5 + t * 1.6);
        const c = s.p.clone().addScaledVector(s.n, 0.6 + t * len).addScaledVector(side, Math.sin(t * 3 + curl * 5) * 3 * t).addScaledVector(new THREE.Vector3(0, 1, 0), t * t * 4);
        for (const e of [-1, 1]) { const q = c.clone().addScaledVector(side, e * w); pos.push(q.x, q.y, q.z); uvs.push((e + 1) / 2, t); }
        if (k < seg) { const a = base + k * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      }
      base += (seg + 1) * 2;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); g.setIndex(idx);
    const m = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
    const u = uv();
    const flow = mx_noise_float(vec3(u.x.mul(3.0), u.y.mul(5.0).sub(time.mul(0.35)), positionWorld.x.mul(0.02))).mul(0.5).add(0.5);
    const edge = smoothstep(0.0, 0.35, u.x).mul(smoothstep(1.0, 0.65, u.x));
    m.colorNode = vec3(0.95, 0.78, 0.38);
    m.opacityNode = edge.mul(smoothstep(0.0, 0.08, u.y)).mul(smoothstep(1.0, 0.45, u.y)).mul(smoothstep(0.3, 0.8, flow)).mul(0.16).mul(uWake);
    const mesh = new THREE.Mesh(g, m); mesh.name = 'seed_exudate'; mesh.renderOrder = 4; mesh.frustumCulled = false; group.add(mesh);
  }

  // 3) 集まってくる細菌：種の表面（道の側）に付く、棒の形の細胞。目覚めの度合いに合わせて数が増える
  {
    const n = opts.cells ?? 900; const pts = pick(n, 0.0);
    const cap = new THREE.CapsuleGeometry(0.04, 0.17, 3, 6); cap.rotateZ(Math.PI / 2);   // 太さ 0.8µm、長さ 2.5µm
    const m = new THREE.MeshStandardNodeMaterial({ transparent: true });
    const order = new Float32Array(pts.length), ph = new Float32Array(pts.length);
    const mesh = new THREE.InstancedMesh(cap, m, pts.length); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1);
    pts.forEach((s, i) => {
      // 道の側に近いほど早く集まる（順番）。表面に寝かせ、向きはばらばら
      order[i] = saturate01(1 - (s.n.dot(toPath) + 0.3) / 1.3) * 0.7 + rng.next() * 0.3; ph[i] = rng.next();
      const t = new THREE.Vector3().crossVectors(s.n, new THREE.Vector3(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1))).normalize();
      q.setFromUnitVectors(new THREE.Vector3(1, 0, 0), t);
      mesh.setMatrixAt(i, m4.compose(s.p.clone().addScaledVector(s.n, 0.06 + rng.next() * 0.08), q, sc));
    });
    cap.setAttribute('order', new THREE.InstancedBufferAttribute(order, 1)); cap.setAttribute('ph', new THREE.InstancedBufferAttribute(ph, 1));
    const o = instancedBufferAttribute(new THREE.InstancedBufferAttribute(order, 1)) as unknown as ReturnType<typeof float>;
    const phase = instancedBufferAttribute(new THREE.InstancedBufferAttribute(ph, 1)) as unknown as ReturnType<typeof float>;
    const on = smoothstep(o, o.add(0.08), uWake);                                  // 目覚めが進むと、順に現れる
    m.colorNode = mix(vec3(0.42, 0.40, 0.36), vec3(0.55, 0.52, 0.46), phase);
    m.roughnessNode = float(0.45); m.opacityNode = on.mul(0.9);
    m.positionNode = positionLocal.mul(on.mul(0.6).add(0.4)).add(vec3(sin(time.mul(2.0).add(phase.mul(30.0))).mul(0.02), 0, 0));
    void attribute;
    mesh.name = 'seed_bacteria'; mesh.frustumCulled = false; group.add(mesh);
  }

  // 4) 幼根：こぶの側で種皮を破り、白い先がのぞく。割れ目は種皮の暗い筋
  {
    const knobL = new THREE.Vector3(-0.75, 0.66, 0).normalize();
    // こぶのいちばん外の点（種のメッシュのうち、その向きにいちばん遠い頂点）
    let best = 0, bp = new THREE.Vector3(), bn = new THREE.Vector3(); const p = new THREE.Vector3();
    for (let i = 0; i < P.count; i++) { p.fromBufferAttribute(P, i); const s = p.clone().normalize().dot(knobL) * p.length(); if (s > best) { best = s; bp.copy(p); bn.fromBufferAttribute(N, i); } }
    const wp = bp.clone().applyMatrix4(M), wn = bn.clone().applyMatrix3(NM).normalize();
    // 根：太さ 約 0.3mm（半径 14 単位）。種皮から少し曲がって伸び、先は丸い根冠。長さは uRoot で 0 → 34 単位（0.34mm）
    const R = 14, Lr = 34;
    const curve = new THREE.CatmullRomCurve3([0, 0.35, 0.7, 1].map((t) => wp.clone().addScaledVector(wn, -10 + t * (Lr + 10)).add(new THREE.Vector3(0, -t * t * 8, t * 4))));
    const tube = new THREE.TubeGeometry(curve, 48, R, 28, false);
    { // 先を丸める（最後の 0.4R ぶんで半球に）、根もとは種皮の中へ少し細く
      const a = tube.attributes.position as THREE.BufferAttribute, uvA = tube.attributes.uv as THREE.BufferAttribute; const v = new THREE.Vector3(), c = new THREE.Vector3();
      const Ltot = curve.getLength();
      for (let i = 0; i < a.count; i++) {
        const t = uvA.getX(i); curve.getPointAt(t, c); v.fromBufferAttribute(a, i).sub(c);
        const fromTip = (1 - t) * Ltot; const k = fromTip < R ? Math.sqrt(Math.max(0, 1 - ((R - fromTip) / R) ** 2)) : 1;
        v.multiplyScalar(Math.max(0.05, k) * (1 + 0.012 * Math.sin(i * 2.3)));   // 輪じわは付けない（根の表面はなめらかで、細胞は縦に並ぶ） a.setXYZ(i, c.x + v.x, c.y + v.y, c.z + v.z);
      }
      tube.computeVertexNormals();
    }
    const m = new THREE.MeshPhysicalNodeMaterial();
    const along = uv().x;   // 0＝つけ根、1＝先
    const show = smoothstep(uRoot.sub(0.02), uRoot, along).oneMinus();             // 伸びた分だけ見せる
    // 白い根：表皮の細胞が縦に並ぶ細い筋。先の根冠はわずかに黄みがかって半透明
    const cells = mx_noise_float(vec3(uv().y.mul(60.0), along.mul(14.0), 0)).mul(0.5).add(0.5);
    const capT = smoothstep(0.86, 0.97, along);
    m.colorNode = mix(vec3(0.82, 0.80, 0.70).mul(mix(float(0.92), float(1.04), cells)), vec3(0.90, 0.84, 0.60), capT);
    m.roughnessNode = float(0.4); m.transmissionNode = capT.mul(0.35).add(0.08); m.thicknessNode = float(8.0);
    m.sheenNode = float(0.35); m.sheenColor = new THREE.Color(1, 1, 1);
    m.alphaTestNode = float(0.5); m.opacityNode = show;
    const root = new THREE.Mesh(tube, m); root.name = 'seed_radicle'; group.add(root);
    // 割れ目：種皮が裂けて、根のまわりにぎざぎざにめくれた縁（種皮の色、裂けた内側は暗い）
    const ring: number[] = [], col: number[] = [], ix: number[] = []; const segs = 48;
    const ax1 = new THREE.Vector3().crossVectors(wn, new THREE.Vector3(0, 0, 1)).normalize(), ax2 = new THREE.Vector3().crossVectors(wn, ax1).normalize();
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2, jag = 1 + 0.35 * Math.abs(Math.sin(a * 5.3 + 1.1)) + 0.25 * Math.sin(a * 11.7);
      const dir = ax1.clone().multiplyScalar(Math.cos(a)).addScaledVector(ax2, Math.sin(a));
      const inner = wp.clone().addScaledVector(dir, R * 1.02).addScaledVector(wn, 1.5), outer = wp.clone().addScaledVector(dir, R * (1.25 + 0.35 * jag)).addScaledVector(wn, 3.5 + 2.5 * jag);
      ring.push(inner.x, inner.y, inner.z, outer.x, outer.y, outer.z); col.push(0.18, 0.09, 0.03, 0.55, 0.32, 0.06);
      if (i < segs) { const b = i * 2; ix.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
    }
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(ring, 3)); cg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); cg.setIndex(ix); cg.computeVertexNormals();
    const crack = new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, side: THREE.DoubleSide })); crack.name = 'seed_crack';
    group.add(crack);
    (group.userData as Record<string, unknown>).crack = crack;
    (group.userData as Record<string, unknown>).rootTip = wp.clone().addScaledVector(wn, 30);
  }

  return {
    group,
    /** wake：目覚め（0〜1）。root：幼根ののぞき具合（0〜1） */
    set(wake: number, root: number) { uWake.value = wake; uRoot.value = root; (group.userData.crack as THREE.Mesh).visible = root > 0.02; },
    get rootTip() { return group.userData.rootTip as THREE.Vector3; },
  };
}
function saturate01(x: number) { return Math.max(0, Math.min(1, x)); }

// 生き物（コルポダ）。モデルは assets/blender/creatures/colpoda.py。GLB は −Z が前、1 単位 = 10 µm。
// 乾いた区画ではシスト（丸い殻）のまま動かず、水が養分を運んでくると殻を出て、らせんを描いて泳ぐ（実際は約2時間かかる。ゲームでは早回し）。
import * as THREE from 'three/webgpu';
import { texture, uv, vec3, float, mix, normalMap, normalView, positionViewDirection, dot, pow, oneMinus, saturate, smoothstep, fract, sin, time, abs, positionLocal, mx_noise_float, mx_worley_noise_float } from 'three/tsl';
import { loadGLB, loadTexture } from '../core/assets';
import type { World } from './world';

export interface Creatures { group: THREE.Group; update(dt: number, t: number): void; anyActive(): boolean; nearest(p: THREE.Vector3): THREE.Vector3 | null; }

function bodyMaterial(na: THREE.Texture) {
  // 持ち主の資料と顕微鏡写真：腎臓形。細い暗い輪郭線。中は淡い灰褐色（#C2B5A4）で、細かい粒々が詰まっている
  const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false });
  const naT = texture(na, uv());
  m.normalNode = normalMap(vec3(mix(float(0.5), naT.r, 0.15), mix(float(0.5), naT.g, 0.15), float(1)));
  const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 1.6);
  const speck = smoothstep(0.62, 0.9, mx_noise_float(positionLocal.mul(25.0)).add(0.5)).add(smoothstep(0.7, 0.95, mx_noise_float(positionLocal.mul(60.0)).add(0.5)).mul(0.7)).min(1.0);
  // 2026-11-26：本物の動画・写真では、黄みがかった灰緑〜黄褐色で、細かい粒がぎっしり詰まって見える（前は白っぽかった）
  const fine = smoothstep(0.45, 0.85, mx_noise_float(positionLocal.mul(140.0)).add(0.5));
  const base = mix(mix(vec3(0.26, 0.25, 0.12), vec3(0.15, 0.14, 0.05), speck), vec3(0.09, 0.085, 0.03), fine.mul(0.55));
  m.colorNode = mix(base, vec3(0.06, 0.06, 0.05), smoothstep(0.55, 0.9, rim));     // 輪郭線は暗く細い
  m.emissiveNode = base.mul(0.12);
  m.roughnessNode = float(0.45); m.metalnessNode = float(0);
  m.opacityNode = mix(float(0.62), float(0.95), smoothstep(0.3, 0.9, rim)).max(speck.mul(0.6)).max(fine.mul(0.5));
  return m;
}
function innerMaterial(opacity: number, col: [number, number, number]) {
  const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false });
  m.colorNode = vec3(...col); m.roughnessNode = float(0.5); m.opacityNode = float(opacity); return m;
}
function ciliaMaterial() {
  // 繊毛の殻：輪郭から内側へ、繊毛の長さぶんの淡い帯。列ごとのすじに、後ろへ流れる波をかける。自分では光らない
  const m = new THREE.MeshStandardNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const edge = pow(smoothstep(0.75, 0.0, abs(dot(normalView, positionViewDirection))), 2.0);
  const u = uv(); const row = fract(u.x.mul(80.0)); const line = smoothstep(0.0, 0.35, row).mul(smoothstep(1.0, 0.65, row));
  const wave = sin(u.y.mul(42.0).sub(time.mul(26.0)).add(u.x.mul(240.0))).mul(0.5).add(0.5);
  m.colorNode = vec3(0.75, 0.74, 0.7); m.roughnessNode = float(0.6);
  m.opacityNode = edge.mul(mix(float(0.25), float(1), line)).mul(mix(float(0.55), float(1), wave)).mul(0.14);   // 繊毛は細く、写真ではふちにかすかに見えるだけ
  return m;
}

export async function buildCreatures(base: string, world: World, opts: { lod: 0 | 1; count: number }): Promise<Creatures> {
  const group = new THREE.Group(); group.name = 'creatures';
  const [gltf, na] = await Promise.all([loadGLB(base, 'models/creatures/colpoda.glb'), loadTexture(base, opts.lod === 0 ? 'models/creatures/colpoda_na.webp' : 'models/creatures/colpoda_lod1_na.webp')]);
  const L = `_LOD${opts.lod}`, other = `_LOD${1 - opts.lod}`;
  const body = bodyMaterial(na), cv = innerMaterial(0.25, [0.46, 0.46, 0.44]), cil = ciliaMaterial();
  const vac = new THREE.MeshStandardNodeMaterial({ transparent: true });
  { const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 1.5); const dots = smoothstep(0.6, 0.9, mx_noise_float(positionLocal.mul(30.0)).add(0.5));
    vac.colorNode = mix(mix(vec3(0.36, 0.29, 0.13), vec3(0.18, 0.14, 0.06), dots), vec3(0.08, 0.06, 0.03), smoothstep(0.5, 0.9, rim)); vac.opacityNode = float(0.45); vac.roughnessNode = float(0.5); }
  const nuc = new THREE.MeshStandardNodeMaterial({ transparent: true });
  { const g = smoothstep(0.5, 0.9, mx_noise_float(positionLocal.mul(18.0)).add(0.5)); const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 1.5);
    nuc.colorNode = mix(mix(vec3(0.36, 0.34, 0.29), vec3(0.24, 0.23, 0.2), g), vec3(0.1, 0.1, 0.09), smoothstep(0.55, 0.9, rim)); nuc.opacityNode = float(0.75); }
  // シスト：屈折の強い二重の殻（縁だけが明るい、ほぼ透明）の中に、細かい粒の詰まった一つの細胞のかたまり（写真で確認。白い粒の集まりではない）
  const wall = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
  { const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection)).abs()), 2.2);
    wall.colorNode = vec3(0.30, 0.29, 0.25); wall.roughnessNode = float(0.3); wall.opacityNode = mix(float(0.05), float(0.75), rim); wall.emissiveNode = vec3(0.12, 0.11, 0.09).mul(rim); }
  const cell = new THREE.MeshStandardNodeMaterial();
  { const g = saturate(mx_noise_float(positionLocal.mul(9.0)).mul(0.6).add(mx_worley_noise_float(positionLocal.mul(5.0)).mul(-0.5)).add(0.6));
    cell.colorNode = mix(vec3(0.10, 0.09, 0.07), vec3(0.24, 0.21, 0.15), g); cell.roughnessNode = float(0.85); }
  const list: { root: THREE.Object3D; active: THREE.Object3D[]; cyst: THREE.Object3D[]; cvMesh: THREE.Object3D | null; cellIdx: number; home: THREE.Vector3; ph: number; a: number; axis: THREE.Vector3; s: number; rate: number; modeT: number; rollA: number }[] = [];
  for (let k = 0; k < opts.count; k++) {
    const root = gltf.scene.clone(true); const active: THREE.Object3D[] = [], cyst: THREE.Object3D[] = []; let cvMesh: THREE.Object3D | null = null;
    root.traverse((o) => {
      const me = o as THREE.Mesh; if (!me.isMesh) return; const n = me.name;
      if (n.endsWith(other)) { me.visible = false; return; }
      me.renderOrder = 6; me.frustumCulled = false;
      if (n.startsWith('colpoda_body')) { me.material = body; me.renderOrder = 8; active.push(me); }
      else if (n.startsWith('colpoda_cilia')) { me.material = cil; me.renderOrder = 9; active.push(me); }
      else if (n.startsWith('colpoda_vacuoles')) { me.material = vac; active.push(me); }
      else if (n === 'colpoda_cv') { me.material = cv; active.push(me); cvMesh = me; }
      else if (n === 'colpoda_macronucleus') { me.material = nuc; active.push(me); }
      else if (n.startsWith('colpoda_cyst_wall')) { me.material = wall; me.renderOrder = 8; cyst.push(me); }
      else if (n.startsWith('colpoda_cyst_granules')) { me.visible = false; }   // 白い粒は使わない
      else { me.material = cell; cyst.push(me); }
      void L;
    });
    // すむ場所：道の中ほど〜奥の、粒のすき間
    const u = 0.42 + 0.16 * k + 0.03 * Math.sin(k * 7.1); const home = world.path.getPointAt(Math.min(0.92, u));
    home.x += Math.sin(k * 3.3) * 1.5; home.y += 0.6 + Math.cos(k * 2.1) * 1.2; home.z += Math.cos(k * 4.7) * 1.5;
    const tan = world.path.getTangentAt(Math.min(0.92, u));
    list.push({ root, active, cyst, cvMesh, cellIdx: world.cellAt(home), home, ph: k * 2.4, a: 0, axis: tan, s: k * 2.4, rate: 1, modeT: 1 + k, rollA: 0 });
    group.add(root);
  }
  const p = new THREE.Vector3(), nxt = new THREE.Vector3(), side = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), m = new THREE.Matrix4(), q = new THREE.Quaternion(), roll = new THREE.Quaternion(), fwd = new THREE.Vector3(0, 0, -1);
  // 泳ぎ方（2026-11-26、本物の動画〈iNaturalist、Shelpiakov〉と文献に合わせた）：
  //   ・らせんの道すじを描き、体の長い軸のまわりを回りながら進む（Kim et al. 2016）
  //   ・速さは同属の C. steinii の実測に近い毎秒約 50µm（5 単位）。ときどき止まって向きを変え、少し後ろへ下がる（繊毛虫に普通の動き）
  const posAt = (c: (typeof list)[number], s: number, t: number, out: THREE.Vector3) => {
    side.crossVectors(c.axis, up).normalize();
    out.copy(c.home).addScaledVector(c.axis, Math.sin(s) * 4.2).addScaledVector(side, Math.sin(s * 2) * 1.6).addScaledVector(up, Math.cos(s * 1.3) * 1.1);
    const hx = Math.cos(t * 2.4 + c.ph) * 0.45, hy = Math.sin(t * 2.4 + c.ph) * 0.45;   // らせん（半径 4.5µm）
    return out.addScaledVector(side, hx).addScaledVector(up, hy);
  };
  const step = (c: (typeof list)[number], dt: number) => {
    c.modeT -= dt;
    if (c.modeT <= 0) { const r = Math.random(); if (c.rate > 0.5) { c.rate = r < 0.35 ? -0.35 : 0.06; c.modeT = c.rate < 0 ? 0.7 + Math.random() * 0.5 : 0.8 + Math.random() * 1.2; } else { c.rate = 1; c.modeT = 2 + Math.random() * 3; } }
    // 経路の長さ約 20 単位を 1 周 2π として、毎秒 5 単位で進むよう、位相の進みを決める
    const want = c.rate * 1.55; c.s += want * dt * 1.0; c.rollA += dt * (1.2 + 3.0 * Math.max(0, c.rate));
  };
  return {
    group,
    anyActive: () => list.some((c) => c.a > 0.6),
    nearest(from) { let best: THREE.Vector3 | null = null, bd = 1e9; for (const c of list) { if (c.a < 0.6) continue; const d = c.root.position.distanceToSquared(from); if (d < bd) { bd = d; best = c.root.position; } } return best; },
    update(dt, t) {
      for (const c of list) {
        const cellS = world.grid.cells[c.cellIdx]; const target = cellS.microbes > 0.45 && cellS.water > 0.4 ? 1 : 0;
        c.a += Math.sign(target - c.a) * Math.min(Math.abs(target - c.a), dt * 0.5);
        const act = c.a > 0.5; for (const o of c.active) o.visible = act && !o.name.endsWith(other); for (const o of c.cyst) o.visible = !act && !o.name.endsWith(other) && !o.name.startsWith('colpoda_cyst_granules');
        if (!act) { c.root.position.copy(c.home); c.root.position.y -= 1.8; c.root.scale.setScalar(1); continue; }
        step(c, dt); posAt(c, c.s, t, p); posAt(c, c.s + Math.sign(c.rate || 1) * 0.05 + 0.0001, t + 0.03, nxt); nxt.sub(p);
        const ud = c.root.userData as { head?: THREE.Quaternion }; ud.head ??= c.root.quaternion.clone();
        if (nxt.lengthSq() > 1e-8) { nxt.normalize(); if (c.rate < 0) nxt.negate(); ud.head.slerp(new THREE.Quaternion().setFromUnitVectors(fwd, nxt), 1 - Math.exp(-dt * 4)); }   // 向きはなめらかに変える（後ろへ下がるときも頭は前のまま）
        roll.setFromAxisAngle(fwd, c.rollA); q.copy(ud.head).multiply(roll);   // 体の長い軸のまわりに回りながら進む（止まると回りもゆっくり）
        c.root.position.copy(p); c.root.quaternion.copy(q); c.root.scale.setScalar(0.6 + 0.4 * Math.min(1, (c.a - 0.5) * 2));
        if (c.cvMesh) c.cvMesh.scale.setScalar(0.55 + 0.45 * Math.abs(Math.sin(t * 0.9 + c.ph))); // 収縮胞の拍動
        void m;
      }
    },
  };
}

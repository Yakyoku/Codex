// 生き物（コルポダ）。モデルは assets/blender/creatures/colpoda.py。GLB は −Z が前、1 単位 = 10 µm。
// 乾いた区画ではシスト（丸い殻）のまま動かず、水が養分を運んでくると殻を出て、らせんを描いて泳ぐ（実際は約2時間かかる。ゲームでは早回し）。
import * as THREE from 'three/webgpu';
import { texture, uv, vec3, float, mix, normalMap, normalView, positionViewDirection, dot, pow, oneMinus, saturate, smoothstep, fract, sin, time, abs } from 'three/tsl';
import { loadGLB, loadTexture } from '../core/assets';
import type { World } from './world';

export interface Creatures { group: THREE.Group; update(dt: number, t: number): void; anyActive(): boolean; nearest(p: THREE.Vector3): THREE.Vector3 | null; }

function bodyMaterial(na: THREE.Texture) {
  // 光学顕微鏡で見るコルポダは無色で、ほぼ透明。縁と厚い所がわずかに見える
  const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false });
  const naT = texture(na, uv());
  // 繊毛の列の溝は、実物ではごく細い線にしか見えない。法線は弱く効かせる
  m.normalNode = normalMap(vec3(mix(float(0.5), naT.r, 0.22), mix(float(0.5), naT.g, 0.22), float(1)));
  const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 1.6);
  m.colorNode = vec3(0.40, 0.42, 0.39); m.roughnessNode = float(0.28); m.metalnessNode = float(0);
  m.opacityNode = mix(float(0.07), float(0.5), rim);
  m.clearcoat = 0.3; m.clearcoatRoughness = 0.2;
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
  m.colorNode = vec3(0.7, 0.72, 0.68); m.roughnessNode = float(0.6);
  m.opacityNode = edge.mul(mix(float(0.25), float(1), line)).mul(mix(float(0.45), float(1), wave)).mul(0.11);
  return m;
}

export async function buildCreatures(base: string, world: World, opts: { lod: 0 | 1; count: number }): Promise<Creatures> {
  const group = new THREE.Group(); group.name = 'creatures';
  const [gltf, na] = await Promise.all([loadGLB(base, 'models/creatures/colpoda.glb'), loadTexture(base, opts.lod === 0 ? 'models/creatures/colpoda_na.webp' : 'models/creatures/colpoda_lod1_na.webp')]);
  const L = `_LOD${opts.lod}`, other = `_LOD${1 - opts.lod}`;
  const body = bodyMaterial(na), vac = innerMaterial(0.2, [0.30, 0.31, 0.27]), cv = innerMaterial(0.1, [0.5, 0.52, 0.5]), nuc = innerMaterial(0.12, [0.5, 0.5, 0.48]), cil = ciliaMaterial();
  const wall = innerMaterial(0.5, [0.55, 0.53, 0.46]), cell = innerMaterial(0.55, [0.45, 0.45, 0.40]);
  const list: { root: THREE.Object3D; active: THREE.Object3D[]; cyst: THREE.Object3D[]; cvMesh: THREE.Object3D | null; cellIdx: number; home: THREE.Vector3; ph: number; a: number; axis: THREE.Vector3 }[] = [];
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
      else { me.material = cell; cyst.push(me); }
      void L;
    });
    // すむ場所：道の中ほど〜奥の、粒のすき間
    const u = 0.42 + 0.16 * k + 0.03 * Math.sin(k * 7.1); const home = world.path.getPointAt(Math.min(0.92, u));
    home.x += Math.sin(k * 3.3) * 1.5; home.y += 0.6 + Math.cos(k * 2.1) * 1.2; home.z += Math.cos(k * 4.7) * 1.5;
    const tan = world.path.getTangentAt(Math.min(0.92, u));
    list.push({ root, active, cyst, cvMesh, cellIdx: world.cellAt(home), home, ph: k * 2.4, a: 0, axis: tan });
    group.add(root);
  }
  const p = new THREE.Vector3(), nxt = new THREE.Vector3(), side = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), m = new THREE.Matrix4(), q = new THREE.Quaternion(), roll = new THREE.Quaternion(), fwd = new THREE.Vector3(0, 0, -1);
  const posAt = (c: (typeof list)[number], t: number, out: THREE.Vector3) => {
    // すき間の中を、ゆるい8の字に巡る（体長の約1.5倍/秒。泳ぐ速さの実測値は未確認）
    const s = t * 0.42 + c.ph; side.crossVectors(c.axis, up).normalize();
    return out.copy(c.home).addScaledVector(c.axis, Math.sin(s) * 4.2).addScaledVector(side, Math.sin(s * 2) * 1.6).addScaledVector(up, Math.cos(s * 1.3) * 1.1);
  };
  return {
    group,
    anyActive: () => list.some((c) => c.a > 0.6),
    nearest(from) { let best: THREE.Vector3 | null = null, bd = 1e9; for (const c of list) { if (c.a < 0.6) continue; const d = c.root.position.distanceToSquared(from); if (d < bd) { bd = d; best = c.root.position; } } return best; },
    update(dt, t) {
      for (const c of list) {
        const cellS = world.grid.cells[c.cellIdx]; const target = cellS.microbes > 0.45 && cellS.water > 0.4 ? 1 : 0;
        c.a += Math.sign(target - c.a) * Math.min(Math.abs(target - c.a), dt * 0.5);
        const act = c.a > 0.5; for (const o of c.active) o.visible = act && !o.name.endsWith(other); for (const o of c.cyst) o.visible = !act && !o.name.endsWith(other);
        if (!act) { c.root.position.copy(c.home); c.root.position.y -= 1.8; c.root.scale.setScalar(1); continue; }
        posAt(c, t, p); posAt(c, t + 0.05, nxt); nxt.sub(p).normalize();
        q.setFromUnitVectors(fwd, nxt); roll.setFromAxisAngle(fwd, t * 2.2 + c.ph); q.multiply(roll); // 体の長い軸のまわりに回りながら進む
        c.root.position.copy(p); c.root.quaternion.copy(q); c.root.scale.setScalar(0.6 + 0.4 * Math.min(1, (c.a - 0.5) * 2));
        if (c.cvMesh) c.cvMesh.scale.setScalar(0.55 + 0.45 * Math.abs(Math.sin(t * 0.9 + c.ph))); // 収縮胞の拍動
        void m;
      }
    },
  };
}

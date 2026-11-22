// 焼き込んだメッシュの読み込みと、骨組み（リグ）。
import * as THREE from 'three';
import { BONES, PARENT, type BoneName, type Joints } from '../models/skeleton';

const cache = new Map<string, Promise<THREE.BufferGeometry>>();
export function loadMesh(name: string): Promise<THREE.BufferGeometry> {
  let p = cache.get(name);
  if (!p) {
    p = fetch(`./models/${name}.bin`).then(r => { if (!r.ok) throw new Error(`造形データ ${name} を読み込めません（${r.status}）`); return r.arrayBuffer(); }).then(parse);
    cache.set(name, p);
  }
  return p;
}
function parse(buf: ArrayBuffer): THREE.BufferGeometry {
  const dv = new DataView(buf);
  const hl = dv.getUint32(0, true);
  const h = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, hl)));
  const pad = (n: number) => (n + 3) & ~3;
  let o = 4 + pad(hl);
  const nv: number = h.nv;
  const q = new Uint16Array(buf, o, nv * 3); o += pad(nv * 6);
  const n8 = new Int8Array(buf, o, nv * 3); o += pad(nv * 3);
  const col = new Uint8Array(buf, o, nv * 4); o += pad(nv * 4);
  const si = new Uint8Array(buf, o, nv * 4); o += pad(nv * 4);
  const sw = new Uint8Array(buf, o, nv * 4); o += pad(nv * 4);
  const idx = h.use16 ? new Uint16Array(buf, o, h.ni) : new Uint32Array(buf, o, h.ni);
  const pos = new Float32Array(nv * 3);
  for (let i = 0; i < nv; i++) for (let a = 0; a < 3; a++) pos[i * 3 + a] = h.min[a] + (q[i * 3 + a] / 65535) * (h.max[a] - h.min[a]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(n8, 3, true));
  g.setAttribute('color', new THREE.BufferAttribute(col, 4, true));
  g.setAttribute('skinIndex', new THREE.BufferAttribute(new Uint16Array(si), 4));
  g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4, true));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeBoundingSphere(); g.computeBoundingBox();
  return g;
}

export class Rig {
  root = new THREE.Group();
  bones = {} as Record<BoneName, THREE.Bone>;
  skeleton: THREE.Skeleton;
  rest: Joints;
  meshes: THREE.SkinnedMesh[] = [];
  constructor(J: Joints) {
    this.rest = J;
    const list: THREE.Bone[] = [];
    for (const n of BONES) {
      const b = new THREE.Bone(); b.name = n; this.bones[n] = b; list.push(b);
      const p = PARENT[n];
      if (p) { this.bones[p].add(b); b.position.set(J[n][0] - J[p][0], J[n][1] - J[p][1], J[n][2] - J[p][2]); }
      else { this.root.add(b); b.position.set(...J[n]); }
    }
    this.root.updateMatrixWorld(true);
    this.skeleton = new THREE.Skeleton(list);
  }
  add(geo: THREE.BufferGeometry, mat: THREE.Material): THREE.SkinnedMesh {
    const m = new THREE.SkinnedMesh(geo, mat);
    m.frustumCulled = false;
    this.root.add(m);
    m.bind(this.skeleton, new THREE.Matrix4());
    this.meshes.push(m);
    return m;
  }
  b(n: BoneName): THREE.Bone { return this.bones[n]; }
  /** 全身を基本姿勢へ */
  reset(): void { for (const n of BONES) { this.bones[n].quaternion.identity(); } const h = this.rest.hips; this.bones.hips.position.set(h[0], h[1], h[2]); }
}

// 図鑑の3Dビューア：出会ったものの模型を、ドラッグで回して細部まで見る。実際の大きさを、潜行士の身長（2µm）の物差しと並べて示す。
// 画面のキャンバスをそのまま使い、図鑑を開いている間だけ、ゲームの場面の代わりにこの場面を描く。
import * as THREE from 'three/webgpu';
import { loadGLB, makeEnvironment } from '../core/assets';

type Src = { url: string; mesh: string; scale?: number; tilt?: number; many?: number };
// 模型のある項目（Blender で作った模型を使う）
const MODELS: Record<string, Src> = {
  rbc: { url: '/static/models/rbc.glb', mesh: 'rbc_lod0' },
  lens_fiber: { url: '/static/models/lens.glb', mesh: 'fiber0' },
  crystallin_aggregate: { url: '/static/models/lens.glb', mesh: 'grain', many: 60 },
  rod: { url: '/static/models/photo.glb', mesh: 'rod' },
  cone: { url: '/static/models/photo.glb', mesh: 'cone' },
  fovea: { url: '/static/models/photo.glb', mesh: 'fcone', many: 19 },
  rpe: { url: '/static/models/photo.glb', mesh: 'rpe' },
  drusen: { url: '/static/models/photo.glb', mesh: 'drusen', scale: 8 },
};
export const hasModel = (id: string) => id in MODELS;

export class AtlasViewer {
  scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(35, 1, 0.05, 2000);
  active = false; private obj: THREE.Object3D | null = null; private yaw = 0.6; private pitch = 0.35; private dist = 20; private auto = true;
  private bar: THREE.Group;
  constructor(renderer: THREE.WebGPURenderer, el: HTMLElement) {
    this.scene.background = new THREE.Color(0x0b0f12);
    this.scene.environment = makeEnvironment(renderer, new THREE.Color(0.9, 0.85, 0.9)); this.scene.environmentIntensity = 0.6;
    const key = new THREE.DirectionalLight(0xfff4ea, 2.2); key.position.set(3, 5, 4); this.scene.add(key, new THREE.HemisphereLight(0xdde6ff, 0x221a18, 0.6));
    // 物差し：潜行士の身長 2µm（白い柱）
    this.bar = new THREE.Group();
    const m = new THREE.MeshBasicMaterial({ color: 0x7fe0d2 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2, 8), m); pole.position.y = 1; this.bar.add(pole);
    for (const y of [0, 2]) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.06), m); t.position.y = y; this.bar.add(t); }
    this.scene.add(this.bar);
    let drag = false, lx = 0, ly = 0;
    el.addEventListener('pointerdown', (e) => { drag = true; lx = e.clientX; ly = e.clientY; this.auto = false; });
    addEventListener('pointerup', () => (drag = false));
    addEventListener('pointermove', (e) => { if (!drag || !this.active) return; this.yaw -= (e.clientX - lx) * 0.008; this.pitch = Math.max(-1.3, Math.min(1.3, this.pitch + (e.clientY - ly) * 0.006)); lx = e.clientX; ly = e.clientY; });
    el.addEventListener('wheel', (e) => { this.dist *= Math.exp(e.deltaY * 0.001); }, { passive: true });
  }
  async show(id: string) {
    const src = MODELS[id]; if (!src) return;
    if (this.obj) this.scene.remove(this.obj); this.obj = null; this.active = true;   // 読み込みの間も、図鑑の背景を出しておく
    const g = await loadGLB(src.url); let geo: THREE.BufferGeometry | null = null; let mat: THREE.Material | null = null;
    g.scene.traverse((o) => { const mm = o as THREE.Mesh; if (mm.isMesh && mm.name === src.mesh) { mm.updateWorldMatrix(true, false); geo = mm.geometry.clone().applyMatrix4(mm.matrixWorld); } });
    if (!geo) return;
    mat = new THREE.MeshPhysicalMaterial({ color: id === 'rbc' ? 0x9a1c18 : id === 'rpe' ? 0x4a2a1c : id === 'drusen' ? 0xe8d6a0 : id === 'rod' ? 0xd8c0cc : 0xe4e0dc,
      roughness: 0.35, clearcoat: 0.4, transparent: id === 'lens_fiber', opacity: id === 'lens_fiber' ? 0.7 : 1 });
    const grp = new THREE.Group();
    const n = src.many ?? 1;
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(geo, mat); const s = src.scale ?? 1; m.scale.setScalar(s);
      if (n > 1) { const a = i * 2.4, r = Math.sqrt(i) * (id === 'fovea' ? 2.2 : 0.45); m.position.set(Math.cos(a) * r, id === 'fovea' ? 0 : Math.sin(i * 1.7) * 0.4, Math.sin(a) * r); if (id !== 'fovea') m.scale.multiplyScalar(0.5 + ((i * 37) % 10) / 10); }
      grp.add(m);
    }
    const box = new THREE.Box3().setFromObject(grp), c = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
    grp.position.sub(c); grp.position.y += sz.y / 2; this.obj = grp; this.scene.add(grp);
    // 物差しは実寸（2µm）のまま。大きな模型の横でも見えるよう、太さだけ見やすくする
    const th = Math.max(1, Math.max(sz.x, sz.y, sz.z) / 12); this.bar.children.forEach((c, i) => c.scale.set(th, i === 0 ? 1 : 1, th));
    this.bar.position.set(-Math.max(sz.x, sz.z) * 0.5 - 1.2 - th * 0.3, 0, 0);
    this.dist = Math.max(sz.x, sz.y, sz.z) * 2.4 + 4; this.auto = true; this.active = true;
  }
  hide() { this.active = false; }
  render(renderer: THREE.WebGPURenderer, dt: number) {
    if (this.auto) this.yaw += dt * 0.35;
    const h = this.obj ? new THREE.Box3().setFromObject(this.obj).getSize(new THREE.Vector3()).y / 2 : 1;
    this.camera.position.set(Math.sin(this.yaw) * Math.cos(this.pitch) * this.dist, h + Math.sin(this.pitch) * this.dist, Math.cos(this.yaw) * Math.cos(this.pitch) * this.dist);
    this.camera.lookAt(0, h, 0);
    const s = renderer.getSize(new THREE.Vector2()); this.camera.aspect = s.x / s.y; this.camera.updateProjectionMatrix();
    renderer.render(this.scene, this.camera);
  }
}

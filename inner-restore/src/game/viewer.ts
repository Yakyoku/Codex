// 図鑑の3Dビューア：出会ったものの模型を、ドラッグで回して細部まで見る。実際の大きさを、潜行士の身長（2µm）の物差しと並べて示す。
// 画面のキャンバスをそのまま使い、図鑑を開いている間だけ、ゲームの場面の代わりにこの場面を描く。
import * as THREE from 'three/webgpu';
import { loadGLB, makeEnvironment } from '../core/assets';

type Src = { url: string; mesh: string; scale?: number; tilt?: number; many?: number; ghost?: string; col?: number; noBar?: string };
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
  mitochondrion: { url: '/static/models/atlas_extra.glb', mesh: 'mito', col: 0xe8b896 },
  platelet: { url: '/static/models/atlas_extra.glb', mesh: 'platelet', col: 0xe8dcc8 },
  endothelial: { url: '/static/models/atlas_extra.glb', mesh: 'endo', col: 0xdcc4b8 },
  pericyte: { url: '/static/models/atlas_extra.glb', mesh: 'pericyte', ghost: 'pericyte_tube', col: 0xd8b8a8 },
  muller: { url: '/static/models/atlas_extra.glb', mesh: 'muller', col: 0xdcd8e4 },
  vitreous: { url: '/static/models/atlas_extra.glb', mesh: 'vitreous', col: 0xd8e8f0 },
  ciliated_cell: { url: '/static/models/nose.glb', mesh: 'ciliated', col: 0xe8c8c0 },
  cilium: { url: '/static/models/nose.glb', mesh: 'axoneme', col: 0xe8e0d8, noBar: '断面（9+2）を 約40倍に拡大して表示' },
  goblet_cell: { url: '/static/models/nose.glb', mesh: 'goblet', col: 0xe8e4e0 },
  mucus: { url: '/static/models/nose.glb', mesh: 'plug', col: 0xdde8ea },
  olfactory_neuron: { url: '/static/models/nose.glb', mesh: 'olfknob', col: 0xf0e2d2 },
  sustentacular_cell: { url: '/static/models/nose.glb', mesh: 'sustentacular', col: 0xc8a07a },
  neutrophil: { url: '/static/models/nose.glb', mesh: 'neutro', ghost: 'neutro_nucleus', col: 0xece4dc },
  alveolus: { url: '/static/models/lung.glb', mesh: 'alveolus', scale: 100, col: 0xf0c8c0, noBar: '肺胞の部屋（直径 約200µm）を外から見た形。上の大きな口が肺胞道につながる' },
  type2_pneumocyte: { url: '/static/models/lung.glb', mesh: 'type2', col: 0xf2dcd4 },
  alveolar_macrophage: { url: '/static/models/lung.glb', mesh: 'macro', col: 0xece0d8 },
  club_cell: { url: '/static/models/lung.glb', mesh: 'club', col: 0xf0d0c8 },
  particle_pm: { url: '/static/models/lung.glb', mesh: 'soot', scale: 2, col: 0x3a3634 },
  villus: { url: '/static/models/gut.glb', mesh: 'vtip', scale: 50, col: 0xeeb0a4, noBar: '絨毛の先（幅 約100µm）。根元はさらに長く伸びる' },
  paneth_cell: { url: '/static/models/gut.glb', mesh: 'paneth', ghost: 'paneth_granules', col: 0xf0d8c8 },
  bacteroides: { url: '/static/models/gut.glb', mesh: 'bactero', col: 0xc8b898 },
  bifidobacterium: { url: '/static/models/gut.glb', mesh: 'bifido', col: 0xd8c8a8 },
  akkermansia: { url: '/static/models/gut.glb', mesh: 'akker', col: 0xe0d0c0 },
  enterobacteria: { url: '/static/models/gut.glb', mesh: 'ecoli', col: 0xb89878 },
};
export const hasModel = (id: string) => id in MODELS;

export class AtlasViewer {
  scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(35, 1, 0.05, 2000);
  note = ''; active = false; private obj: THREE.Object3D | null = null; private yaw = 0.6; private pitch = 0.35; private dist = 20; private auto = true;
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
    mat = new THREE.MeshPhysicalMaterial({ color: src.col ?? (id === 'rbc' ? 0x9a1c18 : id === 'rpe' ? 0x4a2a1c : id === 'drusen' ? 0xe8d6a0 : id === 'rod' ? 0xd8c0cc : 0xe4e0dc),
      roughness: 0.35, clearcoat: 0.4, transparent: id === 'lens_fiber' || id === 'neutrophil' || id === 'paneth_cell', opacity: id === 'lens_fiber' ? 0.7 : id === 'neutrophil' || id === 'paneth_cell' ? 0.4 : 1, depthWrite: id !== 'neutrophil' && id !== 'paneth_cell' });
    const grp = new THREE.Group();
    const n = src.many ?? 1;
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(geo, mat); const s = src.scale ?? 1; m.scale.setScalar(s);
      if (n > 1) { const a = i * 2.4, r = Math.sqrt(i) * (id === 'fovea' ? 2.2 : 0.45); m.position.set(Math.cos(a) * r, id === 'fovea' ? 0 : Math.sin(i * 1.7) * 0.4, Math.sin(a) * r); if (id !== 'fovea') m.scale.multiplyScalar(0.5 + ((i * 37) % 10) / 10); }
      grp.add(m);
    }
    if (src.ghost) {   // 相手（毛細血管など）を半透明で添える
      let gg: THREE.BufferGeometry | null = null; g.scene.traverse((o) => { const mm = o as THREE.Mesh; if (mm.isMesh && mm.name === src.ghost) { mm.updateWorldMatrix(true, false); gg = mm.geometry.clone().applyMatrix4(mm.matrixWorld); } });
      if (gg) grp.add(new THREE.Mesh(gg, new THREE.MeshPhysicalMaterial({ color: 0xc89080, transparent: true, opacity: 0.22, roughness: 0.3, side: THREE.DoubleSide, depthWrite: false })));
    }
    const box = new THREE.Box3().setFromObject(grp), c = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
    grp.position.sub(c); grp.position.y += sz.y / 2; this.obj = grp; this.scene.add(grp);
    // 物差しは実寸（2µm）のまま。大きな模型の横でも見えるよう、太さだけ見やすくする
    const th = Math.max(1, Math.max(sz.x, sz.y, sz.z) / 12); this.bar.children.forEach((c, i) => c.scale.set(th, i === 0 ? 1 : 1, th));
    this.bar.visible = !src.noBar; this.note = src.noBar ?? '';
    this.bar.position.set(-Math.max(sz.x, sz.z) * 0.5 - 1.2 - th * 0.3, 0, 0);
    this.dist = Math.max(sz.x, sz.y, sz.z) * (document.body.classList.contains("shot") ? 1.5 : 2.4) + (document.body.classList.contains("shot") ? 1 : 4); this.auto = true; this.active = true;
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

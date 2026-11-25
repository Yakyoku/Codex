// 全身マップ（ハブ）：患者・灯（あかり）の全身を、透ける立体の人体で見せる。治した器官から順に、色と脈動が戻る。
// 画面版：図鑑の3Dと同じく、画面のキャンバスに描き、ドラッグで回す・器官をタップで選ぶ。VR 版：目の前に浮かべてのぞき込む。
import * as THREE from 'three/webgpu';
import { tsl } from '../core/tsl';
import { loadGLB, makeEnvironment } from '../core/assets';
import { stageZones, stageProgress } from '../stages/zone';
import type { Save } from '../core/save';
const { uniform, color, float, mix, pow, saturate, dot, normalView, positionViewDirection, sin, positionWorld, uv, length, smoothstep } = tsl;

export interface Organ { id: string; ja: string; stage: number; ready: boolean; at: THREE.Vector3; r: number; note: string }
type J = Record<string, number[]>;
/** 器官の位置（関節の位置から。患者の左は +x、正面は +z）。ステージの順はゲームの約束どおり */
export function organs(j: J): Organ[] {
  const v = (k: string) => new THREE.Vector3(...(j[k] as [number, number, number]));
  const eye = v('l-eye').add(v('r-eye')).multiplyScalar(0.5);
  const chest = v('spine-3').lerp(v('neck'), 0.55);
  return [
    { id: 'eye', ja: '目', stage: 1, ready: true, at: eye, r: 0.035, note: '水晶体の濁りを晴らし、網膜の血流と視細胞を治す' },
    { id: 'nose', ja: '鼻', stage: 2, ready: stageZones('nose').length > 0, at: eye.clone().add(new THREE.Vector3(0, -0.045, 0.02)), r: 0.025, note: '線毛の波と粘液の流れを取り戻す' },
    { id: 'lung', ja: '肺', stage: 3, ready: stageZones('lung').length > 0, at: chest.clone().add(new THREE.Vector3(0, 0.02, 0.02)), r: 0.11, note: '肺胞に沈着した粒子を取り除き、ガス交換を再開させる' },
    { id: 'gut', ja: '腸', stage: 4, ready: false, at: v('spine-1').lerp(v('pelvis'), 0.3).add(new THREE.Vector3(0, 0, 0.05)), r: 0.09, note: '腸内細菌の勢力図を塗り替える' },
    { id: 'vessel', ja: '血管', stage: 5, ready: false, at: v('l-elbow').lerp(v('l-shoulder'), 0.4), r: 0.03, note: 'プラークと血栓を取り除く（器官どうしをつなぐ道）' },
    { id: 'heart', ja: '心臓', stage: 6, ready: false, at: chest.clone().add(new THREE.Vector3(0.035, -0.03, 0.04)), r: 0.045, note: '乱れた電気信号を整える' },
    { id: 'brain', ja: '脳', stage: 7, ready: false, at: v('head').add(new THREE.Vector3(0, 0.1, -0.01)), r: 0.075, note: '切れた回路をつなぎ、沈着物を取り除く' },
  ];
}
/** 目の進み具合（0〜1）：治しきった区域の数 */
export const eyeProgress = (s: Save) => stageProgress(s.done, 'eye');
export const noseProgress = (s: Save) => stageProgress(s.done, 'nose');

/** バイタル（ゲーム上の目安の数値。治した器官に応じて戻る）。目は視力の目安だけが変わる */
export function vitals(s: Save) {
  const e = eyeProgress(s), n = noseProgress(s);
  return [
    { k: '視力（目安）', v: (0.1 + 0.9 * e).toFixed(1), ok: e >= 1 },
    { k: '嗅覚（目安）', v: n >= 1 ? 'ほぼ正常' : n > 0 ? '少し戻った' : 'ほとんど感じない', ok: n >= 1 },
    { k: '心拍', v: `${Math.round(96 - 4 * e - 2 * n)} 回/分`, ok: false },
    { k: '血中の酸素', v: `${Math.round(91 + 7 * stageProgress(s.done, 'lung'))} %`, ok: stageProgress(s.done, 'lung') >= 1 },
    { k: '呼吸', v: `${Math.round(22 - 7 * stageProgress(s.done, 'lung'))} 回/分`, ok: stageProgress(s.done, 'lung') >= 1 },
  ];
}

/** 人体と器官の目印（画面版・VR 版で共用） */
export async function buildHubModel(save: Save) {
  const [g, j] = await Promise.all([loadGLB('/static/models/hub_body.glb'), fetch('/static/data/hub.json').then((r) => r.json() as Promise<{ joints: J }>)]);
  const grp = new THREE.Group(); const t = uniform(0);
  let geo: THREE.BufferGeometry | null = null;
  g.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.updateWorldMatrix(true, false); geo = m.geometry.clone().applyMatrix4(m.matrixWorld); } });
  // 透ける体：縁ほど光る（X 線写真のような）。病のあいだは青白く、治るほど温かい色が差す
  const e = eyeProgress(save);
  const bm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
  const rim = pow(float(1).sub(saturate(dot(normalView, positionViewDirection).abs())), float(2.2));
  const scan = smoothstep(0.02, 0.0, positionWorld.y.sub(sin(t.mul(0.6)).mul(0.9).add(0.85)).abs());   // 上下に行き来する走査の線
  bm.colorNode = mix(color(0x5c8cff), color(0xffb07a), float(0.1 + 0.4 * e)).mul(rim.mul(0.55).add(0.03)).add(color(0x9fe8ff).mul(scan.mul(0.25)));
  const body = new THREE.Mesh(geo!, bm); body.renderOrder = 5; grp.add(body);
  const list = organs(j.joints);
  const marks: { o: Organ; mesh: THREE.Mesh; state: 'done' | 'active' | 'locked' }[] = [];
  for (const o of list) {
    const pr = o.id === 'eye' ? e : o.id === 'nose' ? noseProgress(save) : o.id === 'lung' ? stageProgress(save.done, 'lung') : 0;
    const state = !o.ready ? 'locked' : pr >= 1 ? 'done' : 'active';
    const m = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const d = length(uv().sub(0.5)).mul(2);
    const col = state === 'done' ? color(0xffc890) : state === 'active' ? color(0x7fe0d2) : color(0x56606a);
    const beat = state === 'locked' ? float(0.55) : sin(t.mul(state === 'done' ? 5.2 : 3)).mul(0.25).add(0.85);   // 治った器官は脈打つ
    m.colorNode = col.mul(pow(saturate(float(1).sub(d)), float(1.6))).mul(beat);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(o.r * 2.6, o.r * 2.6), m); mesh.position.copy(o.at); mesh.renderOrder = 10; mesh.userData.organ = o.id;
    grp.add(mesh); marks.push({ o, mesh, state });
  }
  return { group: grp, marks, t, list };
}

export class HubView {
  scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50);
  active = false; private yaw = 0.35; private pitch = 0.08; private dist = 3.6; private target = new THREE.Vector3(0, 0.95, 0);
  private model: Awaited<ReturnType<typeof buildHubModel>> | null = null; private ray = new THREE.Raycaster();
  onPick: (id: string) => void = () => {};
  constructor(renderer: THREE.WebGPURenderer, private el: HTMLElement) {
    this.scene.background = new THREE.Color(0x05080b);
    this.scene.environment = makeEnvironment(renderer, new THREE.Color(0.5, 0.6, 0.8));
    // 床の目盛りの輪
    const rm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const d = length(uv().sub(0.5)).mul(2);
    rm.colorNode = color(0x2a6a78).mul(smoothstep(0.98, 0.94, d).mul(smoothstep(0.9, 0.94, d)).add(smoothstep(1.0, 0.0, d).mul(0.08)));
    const ring = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6).rotateX(-Math.PI / 2), rm); this.scene.add(ring);
    let drag = false, lx = 0, ly = 0, moved = 0;
    el.addEventListener('pointerdown', (e) => { if (!this.active) return; drag = true; lx = e.clientX; ly = e.clientY; moved = 0; });
    addEventListener('pointerup', (e) => { if (!this.active || !drag) return; drag = false; if (moved < 6) this.pick(e.clientX, e.clientY); });
    addEventListener('pointermove', (e) => { if (!drag || !this.active) return; moved += Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly); this.yaw -= (e.clientX - lx) * 0.008; this.pitch = Math.max(-0.5, Math.min(0.8, this.pitch + (e.clientY - ly) * 0.005)); lx = e.clientX; ly = e.clientY; });
    el.addEventListener('wheel', (e) => { if (this.active) this.dist = Math.max(1.2, Math.min(6, this.dist * Math.exp(e.deltaY * 0.001))); }, { passive: true });
  }
  async open(save: Save) {
    if (this.model) this.scene.remove(this.model.group);
    this.model = await buildHubModel(save); this.scene.add(this.model.group); this.active = true;
  }
  close() { this.active = false; }
  focus(id: string) { const m = this.model?.marks.find((x) => x.o.id === id); if (m) { this.target.copy(m.o.at); this.dist = id === 'eye' || id === 'nose' ? 1.1 : 2.0; } }
  reset() { this.target.set(0, 0.95, 0); this.dist = 3.6; }
  private pick(x: number, y: number) {
    if (!this.model) return;
    const r = this.el.getBoundingClientRect(); this.ray.setFromCamera(new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1), this.camera);
    // 目印は小さいので、光線からの近さで選ぶ
    let best: string | null = null, bd = 1e9;
    for (const m of this.model.marks) { const d = this.ray.ray.distanceToPoint(m.o.at) / Math.max(0.04, m.o.r); if (d < 2.2 && d < bd) { bd = d; best = m.o.id; } }
    if (best) this.onPick(best);
  }
  private cur = new THREE.Vector3(0, 0.95, 0);
  render(renderer: THREE.WebGPURenderer, dt: number) {
    if (this.model) { this.model.t.value += dt; for (const m of this.model.marks) m.mesh.quaternion.copy(this.camera.quaternion); }
    this.yaw += dt * 0.08;
    this.cur.lerp(this.target, Math.min(1, dt * 3));
    this.camera.position.set(this.cur.x + Math.sin(this.yaw) * Math.cos(this.pitch) * this.dist, this.cur.y + Math.sin(this.pitch) * this.dist, this.cur.z + Math.cos(this.yaw) * Math.cos(this.pitch) * this.dist);
    this.camera.lookAt(this.cur);
    const s = renderer.getSize(new THREE.Vector2()); this.camera.aspect = s.x / s.y; this.camera.updateProjectionMatrix();
    renderer.render(this.scene, this.camera);
  }
}

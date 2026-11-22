import * as THREE from 'three/webgpu';
import { loadGLB } from '../core/assets';
import { tsl } from '../core/tsl';
const { vertexColor, color, float, pow, saturate, dot, normalView, positionViewDirection, mix } = tsl;

/** 主人公（ナノスーツの潜行士）。継ぎ目のない体を、ボーン（骨）で曲げて動かす。
 *  ボーンの向き（ねじれ）に左右されないよう、「体の向きを基準にした軸」で回す：
 *    bone.quaternion = R(親の空間に直した軸, 角度) × 安静時の回転
 *  動きはすべて「ばね」で目標へ追従させ、急に切り替わらないようにする（なめらかさ・遅れて付いてくる動き）。 */
const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);
interface BoneRig { bone: THREE.Object3D; rest: THREE.Quaternion; ax: THREE.Vector3; ay: THREE.Vector3; az: THREE.Vector3; }
/** 2次のばね（少しだけ行き過ぎて戻る、やわらかい追従） */
class Spring {
  v = 0; vel = 0;
  constructor(public k = 90, public damp = 0.8) {}
  step(target: number, dt: number) {
    const c = 2 * Math.sqrt(this.k) * this.damp; const n = Math.max(1, Math.ceil(dt / 0.008)); const h = dt / n;
    for (let i = 0; i < n; i++) { this.vel += (this.k * (target - this.v) - c * this.vel) * h; this.v += this.vel * h; }
    return this.v;
  }
}
const JOINTS = ['pelvis', 'chest', 'head', 'upperArmL', 'foreArmL', 'handL', 'upperArmR', 'foreArmR', 'handR', 'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR'];
export class Diver {
  root = new THREE.Group();
  private b: Record<string, BoneRig> = {};
  private sp: Record<string, [Spring, Spring, Spring]> = {};
  private phase = 0; private t = 0; private speedS = new Spring(30, 1); private aimS = new Spring(120, 0.9); private leanS = new Spring(40, 0.9); private bankS = new Spring(35, 0.85);
  private lastSpeed = 0;
  lamp = new THREE.SpotLight(0xfff2dc, 0, 46, 0.62, 0.7, 1.4);
  hand: THREE.Object3D = new THREE.Object3D();
  static async load(rich = true) {
    const d = new Diver();
    const g = await loadGLB('/static/models/diver.glb', true);
    const model = g.scene; d.root.add(model);
    model.updateMatrixWorld(true);
    const nodes: Record<string, THREE.Object3D> = {};
    model.traverse((o) => {
      nodes[o.name] = o;
      const m = o as THREE.Mesh; m.frustumCulled = false;
      if (!m.isMesh) return;
      const mats = (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshPhysicalMaterial[];
      const out = mats.map((mt) => Diver.restyle(mt, rich));
      m.material = Array.isArray(m.material) ? out : out[0];
    });
    const q = new THREE.Quaternion();
    for (const n of JOINTS) {
      const bone = nodes[n]; if (!bone) continue;
      bone.parent!.getWorldQuaternion(q); const inv = q.clone().invert();
      d.b[n] = { bone, rest: bone.quaternion.clone(), ax: X.clone().applyQuaternion(inv), ay: Y.clone().applyQuaternion(inv), az: Z.clone().applyQuaternion(inv) };
      const soft = n.startsWith('upperArm') || n.startsWith('foreArm') || n === 'chest' || n === 'head' || n.startsWith('hand');
      d.sp[n] = [new Spring(soft ? 70 : 140, soft ? 0.62 : 0.85), new Spring(soft ? 70 : 140, soft ? 0.62 : 0.85), new Spring(soft ? 70 : 140, soft ? 0.62 : 0.85)];
    }
    if (nodes.emitterTip) d.hand = nodes.emitterTip;
    const mount = nodes.lampMount ?? nodes.head ?? model;
    mount.add(d.lamp); mount.add(d.lamp.target);
    d.lamp.target.position.set(0, 0, 6).applyQuaternion(mount.getWorldQuaternion(new THREE.Quaternion()).invert());
    return d;
  }
  /** 透明感のある色合い：真珠のような光の干渉、つやの層、縁がほんのり光る（内側から光が透けて見える） */
  private static restyle(src: THREE.MeshPhysicalMaterial, rich: boolean): THREE.Material {
    const name = src.name;
    if (name === 'glow') { src.emissiveIntensity = 1.8; return src; }
    const m = new THREE.MeshPhysicalNodeMaterial(); m.name = name;
    const facing = saturate(dot(normalView, positionViewDirection));
    const rim = pow(float(1).sub(facing), float(2.4));
    const vc = vertexColor().rgb;
    if (name === 'armor') {
      m.colorNode = vc.mul(color(0xf4eeff)).mul(1.12);
      m.roughness = 0.16; m.metalness = 0.05; m.clearcoat = 1; m.clearcoatRoughness = 0.04;
      m.sheen = 0.5; m.sheenColor = new THREE.Color(0xe6d8ff); m.sheenRoughness = 0.4;
      if (rich) { m.iridescence = 0.75; m.iridescenceIOR = 1.35; m.iridescenceThicknessRange = [180, 520]; }
      m.emissiveNode = mix(color(0xb994ff), color(0xffffff), rim).mul(rim.mul(0.55).add(0.04));
    } else if (name === 'suit') {
      m.colorNode = mix(vc.mul(color(0xe4d8ff)).mul(1.5), color(0x9c86e0), float(0.25));
      m.roughness = 0.24; m.metalness = 0.0; m.clearcoat = 0.85; m.clearcoatRoughness = 0.08;
      m.sheen = 0.7; m.sheenColor = new THREE.Color(0xc8b0ff); m.sheenRoughness = 0.35;
      m.emissiveNode = mix(color(0x9a6cff), color(0xe8dcff), rim).mul(rim.mul(0.6).add(0.04));
    } else if (name === 'visor') {
      m.colorNode = color(0x050308); m.roughness = 0.03; m.clearcoat = 1;
      if (rich) { m.iridescence = 1; m.iridescenceIOR = 1.6; m.iridescenceThicknessRange = [300, 800]; }
      m.emissiveNode = color(0x6a3cff).mul(rim.mul(0.45));
    } else {
      m.colorNode = vc.mul(color(0xd0c0ff)).mul(1.2); m.roughness = 0.25; m.clearcoat = 0.6;
      m.emissiveNode = color(0x7b4dff).mul(rim.mul(0.45));
    }
    m.envMapIntensity = 2.0;
    return m;
  }
  private qa = new THREE.Quaternion(); private qb = new THREE.Quaternion(); private qc = new THREE.Quaternion();
  /** 体の向きを基準に、x（前後に曲げる）・y（ねじる）・z（横に開く）の目標角へ、ばねで追従させる */
  private set(n: string, x: number, y: number, z: number, dt: number) {
    const r = this.b[n]; if (!r) return; const s = this.sp[n];
    const ax = s[0].step(x, dt), ay = s[1].step(y, dt), az = s[2].step(z, dt);
    this.qa.setFromAxisAngle(r.ax, ax); this.qb.setFromAxisAngle(r.ay, ay); this.qc.setFromAxisAngle(r.az, az);
    r.bone.quaternion.copy(this.qa).multiply(this.qb).multiply(this.qc).multiply(r.rest);
  }
  // 安静の姿勢（MakeHuman の標準の姿勢）は腕を斜め下に開き、脚も少し開いている。立つときの補正
  static ARM_DOWN = 0.62; static LEG_IN = 0.09;
  /** speed: 歩く速さ（µm/s）, aiming: 道具を構えているか, pitch: 視点の上下, turn: 向きの変わる速さ（rad/s） */
  update(dt: number, speed: number, aiming: boolean, pitch: number, turn = 0) {
    if (dt <= 0) return;
    this.t += dt;
    const sp = this.speedS.step(speed, dt);
    const amp = Math.min(1, sp / 4.5), idle = 1 - amp;
    this.phase += dt * (sp / 0.62) * 1.0 + dt * 0.0;                 // 歩幅に合わせて進む（足が滑って見えないように）
    const ph = this.phase, s = Math.sin(ph), c = Math.cos(ph);
    const A = this.aimS.step(aiming ? 1 : 0, dt);
    const accel = (sp - this.lastSpeed) / dt; this.lastSpeed = sp;
    const lean = this.leanS.step(Math.max(-0.12, Math.min(0.18, accel * 0.025)) + 0.05 * amp, dt);   // 加速で前に傾く
    const bank = this.bankS.step(Math.max(-0.2, Math.min(0.2, -turn * 0.06 * amp)), dt);             // 曲がるとき内側へ
    const br = Math.sin(this.t * 1.5), sway = Math.sin(this.t * 0.55);                               // 呼吸と、ゆっくりした重心の移動
    // 腰：歩くと左右に傾いて振れる（曲線のある歩き方）。止まると片足に重心をのせる
    const hipTilt = s * 0.085 * amp + (0.06 + 0.02 * sway) * idle;
    const hipTwist = s * 0.13 * amp;
    this.set('pelvis', lean * 0.4, hipTwist, hipTilt + bank, dt);
    // 胴：腰と逆にひねり、傾きを打ち消す。構えると道具の方へ向く
    this.set('chest', lean * 0.6 + 0.012 * br - 0.02 * idle, -hipTwist * 1.25 + 0.22 * A, -hipTilt * 0.75 - 0.03 * idle + bank * 0.4, dt);
    // 頭：体のねじれを打ち消して前を見続ける
    this.set('head', -pitch * 0.4 * A + 0.04 * idle - lean * 0.6, hipTwist * 0.2 - 0.18 * A, hipTilt * 0.25 + 0.04 * idle, dt);
    // 脚：一本の線の上に足を運ぶ。ひざは振り出しで曲がり、着地で伸びる
    const kneeL = Math.pow(Math.max(0, Math.sin(ph + 1.25)), 1.4) * 1.05 * amp, kneeR = Math.pow(Math.max(0, Math.sin(ph + Math.PI + 1.25)), 1.4) * 1.05 * amp;
    const tL = -s * 0.5 * amp, tR = s * 0.5 * amp;
    const cross = 0.05 * amp;
    this.set('thighL', tL - 0.1 * idle, 0.04 * idle, -Diver.LEG_IN - cross - 0.04 * idle, dt);
    this.set('thighR', tR + 0.03 * idle, 0, Diver.LEG_IN + cross + 0.06 * idle, dt);
    this.set('shinL', kneeL + 0.04 + 0.16 * idle, 0, 0, dt); this.set('shinR', kneeR + 0.04 + 0.02 * idle, 0, 0, dt);
    this.set('footL', -(tL + kneeL) * 0.62 - 0.08 * idle, 0, 0, dt); this.set('footR', -(tR + kneeR) * 0.62, 0, 0, dt);
    // 腕：胴より少し遅れて振れる。手首はしなやかに
    const swL = Math.sin(ph - 0.35), swR = Math.sin(ph + Math.PI - 0.35);
    this.set('upperArmL', -swL * 0.36 * amp + 0.04 * idle + 0.02 * br, 0.05, -Diver.ARM_DOWN + 0.07 + 0.03 * amp, dt);
    this.set('foreArmL', -(0.12 + 0.22 * amp + 0.15 * Math.max(0, -swL) * amp + 0.06 * idle), 0, 0, dt);
    this.set('handL', -0.12 - 0.08 * idle, 0, 0.05, dt);
    this.set('upperArmR', (-swR * 0.36 * amp - 0.02 * idle) * (1 - A) + (-1.42 + pitch * 0.85) * A, 0, Diver.ARM_DOWN - (0.07 + 0.03 * amp) * (1 - A) + 0.05 * A, dt);
    this.set('foreArmR', -(0.12 + 0.22 * amp + 0.15 * Math.max(0, -swR) * amp) * (1 - A) + 0.3 * A, 0, 0, dt);
    this.set('handR', -0.1 * (1 - A), 0, -0.05 * (1 - A), dt);
    // 体の上下：着地のたびに少し沈む
    this.root.position.y += (Math.abs(c) - 0.6) * 0.03 * amp;
  }
}

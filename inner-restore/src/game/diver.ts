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
    d.initAnimations(g.animations, model);
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
  // 安静の姿勢（MakeHuman の標準の姿勢）は腕を斜め下に開いている。構えの補正に使う
  static ARM_DOWN = 0.62;
  // ---- Blender で作ったアニメーション（idle・walk・run・squat・crouch）を、重みで滑らかに混ぜる ----
  mixer?: THREE.AnimationMixer; private act: Record<string, THREE.AnimationAction> = {};
  private w: Record<string, number> = { idle: 1, walk: 0, run: 0, squat: 0, crouch: 0 };
  static WALK_SPEED = 1.5; static RUN_SPEED = 3.6;   // それぞれの動きが、足が滑らずに見える速さ（µm/s）
  private still = 0; private gait = 0;
  initAnimations(clips: THREE.AnimationClip[], model: THREE.Object3D) {
    this.mixer = new THREE.AnimationMixer(model);
    for (const c of clips) { const a = this.mixer.clipAction(c); a.play(); a.setEffectiveWeight(c.name === 'idle' ? 1 : 0); this.act[c.name] = a; }
  }
  private qa2 = new THREE.Quaternion(); private qt = new THREE.Quaternion();
  /** speed: 進む速さ（µm/s）, aiming: 道具を構えているか, pitch: 視点の上下, turn: 向きの変わる速さ（rad/s）, scanning: スキャン中か */
  update(dt: number, speed: number, aiming: boolean, pitch: number, turn = 0, scanning = false) {
    if (dt <= 0 || !this.mixer) return;
    this.t += dt;
    const sp = this.speedS.step(speed, dt);
    this.still = sp < 0.15 && !aiming ? this.still + dt : 0;
    // 目標の重み：止まっていれば立ち、ゆっくりなら歩き、速ければ走り。止まってスキャンすると片ひざ
    const k = (x: number, a: number, b: number) => Math.min(1, Math.max(0, (x - a) / (b - a)));
    const crouch = scanning && sp < 0.6 ? 1 : 0;
    const squat = !crouch && this.still > 9 && (this.still % 14) < 4 ? 1 : 0;   // 長く立ち止まると、ときどきしゃがむ
    const move = k(sp, 0.12, 0.7), run = k(sp, Diver.WALK_SPEED * 1.2, Diver.RUN_SPEED * 0.85);
    const target = { idle: (1 - move) * (1 - crouch) * (1 - squat), walk: move * (1 - run) * (1 - crouch), run: move * run * (1 - crouch), squat: squat * (1 - crouch), crouch };
    for (const n of Object.keys(target) as (keyof typeof target)[]) {
      this.w[n] += (target[n] - this.w[n]) * Math.min(1, dt * (n === 'crouch' || n === 'squat' ? 3.5 : 7));
      this.act[n]?.setEffectiveWeight(this.w[n]);
    }
    // 歩きと走りの足運びをそろえる：進んだ距離から「歩の位相」を進め、両方の動きを同じ位相で再生する
    //（別々の速さで再生すると、混ざる間に足がもつれて見える）
    const wd = this.act.walk?.getClip().duration ?? 1.1, rd = this.act.run?.getClip().duration ?? 0.7;
    const stride = (1 - run) * Diver.WALK_SPEED * wd + run * Diver.RUN_SPEED * rd;      // 1周期（2歩）で進む距離
    const cadence = Math.max(0.55 / wd * 0.0 + 0.4, sp / stride);                       // 1秒あたりの周期
    if (move > 0.001) this.gait = (this.gait + dt * cadence) % 1;
    if (this.act.walk) { this.act.walk.timeScale = 0; this.act.walk.time = this.gait * wd; }
    if (this.act.run) { this.act.run.timeScale = 0; this.act.run.time = this.gait * rd; }
    this.mixer.update(dt);
    // 上乗せ：加速で前に傾き、曲がるときは内側へ傾く
    const accel = (sp - this.lastSpeed) / dt; this.lastSpeed = sp;
    const lean = this.leanS.step(Math.max(-0.1, Math.min(0.14, accel * 0.02)), dt);
    const bank = this.bankS.step(Math.max(-0.22, Math.min(0.22, -turn * 0.07 * Math.min(1, sp / 2))), dt);
    this.addRot('pelvis', lean * 0.5, 0, bank);
    // 上乗せ：構えると右腕を前へ伸ばし、胴と頭を道具の方へ向ける（アニメーションの上に重ねる）
    const A = this.aimS.step(aiming ? 1 : 0, dt);
    if (A > 0.001) {
      this.blendTo('upperArmR', -1.42 + pitch * 0.85, 0, Diver.ARM_DOWN + 0.05, A);
      this.blendTo('foreArmR', 0.3, 0, 0, A); this.blendTo('handR', 0, 0, 0, A);
      this.addRot('chest', 0, 0.2 * A, 0); this.addRot('head', -pitch * 0.35 * A, -0.15 * A, 0);
    }
  }
  /** アニメーションの姿勢に、体の向きを基準にした回転を上乗せする */
  private addRot(n: string, x: number, y: number, z: number) {
    const r = this.b[n]; if (!r) return;
    this.qa.setFromAxisAngle(r.ax, x); this.qb.setFromAxisAngle(r.ay, y); this.qc.setFromAxisAngle(r.az, z);
    this.qa2.copy(this.qa).multiply(this.qb).multiply(this.qc); r.bone.quaternion.premultiply(this.qa2);
  }
  /** アニメーションの姿勢から、体の向きを基準にした目標の姿勢へ、割合 t だけ寄せる */
  private blendTo(n: string, x: number, y: number, z: number, t: number) {
    const r = this.b[n]; if (!r) return;
    this.qa.setFromAxisAngle(r.ax, x); this.qb.setFromAxisAngle(r.ay, y); this.qc.setFromAxisAngle(r.az, z);
    this.qt.copy(this.qa).multiply(this.qb).multiply(this.qc).multiply(r.rest);
    r.bone.quaternion.slerp(this.qt, t);
  }
}

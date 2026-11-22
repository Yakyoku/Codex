import * as THREE from 'three/webgpu';
import { loadGLB } from '../core/assets';

/** 主人公（ナノスーツの潜行士）。継ぎ目のない体を、ボーン（骨）で曲げて動かす。
 *  ボーンの向き（ねじれ）に左右されないよう、「体の向きを基準にした軸」で回す：
 *    bone.quaternion = R(親の空間に直した軸, 角度) × 安静時の回転 */
const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);
interface BoneRig { bone: THREE.Object3D; rest: THREE.Quaternion; ax: THREE.Vector3; ay: THREE.Vector3; az: THREE.Vector3; }
export class Diver {
  root = new THREE.Group();
  private b: Record<string, BoneRig> = {};
  private phase = 0; private aim = 0; private t = 0;
  lamp = new THREE.SpotLight(0xfff2dc, 0, 46, 0.62, 0.7, 1.4);
  hand: THREE.Object3D = new THREE.Object3D();
  static async load() {
    const d = new Diver();
    const g = await loadGLB('/static/models/diver.glb', true);
    const model = g.scene; d.root.add(model);
    model.updateMatrixWorld(true);
    const nodes: Record<string, THREE.Object3D> = {};
    model.traverse((o) => {
      nodes[o.name] = o;
      const m = o as THREE.Mesh; m.frustumCulled = false;
      if (m.isMesh) for (const mt of (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshPhysicalMaterial[]) {
        mt.envMapIntensity = 2.0;
        if (mt.name === 'glow') { mt.emissiveIntensity = 1.6; }
        // 体内は暖かい色の光なので、装甲とスーツの紫が灰色に寄らないよう、材質の色で少しだけ寒色に寄せる
        if (mt.name === 'armor') mt.color.setRGB(0.95, 0.9, 1.0);
        if (mt.name === 'suit') mt.color.setRGB(0.92, 0.85, 1.0);
        if (mt.name === 'visor') { mt.roughness = 0.03; mt.envMapIntensity = 3.2; }
      }
    });
    const q = new THREE.Quaternion();
    for (const n of ['pelvis', 'chest', 'head', 'upperArmL', 'foreArmL', 'handL', 'upperArmR', 'foreArmR', 'handR', 'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR']) {
      const bone = nodes[n]; if (!bone) continue;
      bone.parent!.getWorldQuaternion(q); const inv = q.clone().invert();
      d.b[n] = { bone, rest: bone.quaternion.clone(), ax: X.clone().applyQuaternion(inv), ay: Y.clone().applyQuaternion(inv), az: Z.clone().applyQuaternion(inv) };
    }
    if (nodes.emitterTip) d.hand = nodes.emitterTip;
    const mount = nodes.lampMount ?? nodes.head ?? model;
    mount.add(d.lamp); mount.add(d.lamp.target);
    d.lamp.target.position.set(0, 0, 6).applyQuaternion(mount.getWorldQuaternion(new THREE.Quaternion()).invert());
    return d;
  }
  private qa = new THREE.Quaternion(); private qb = new THREE.Quaternion(); private qc = new THREE.Quaternion();
  /** 体の向きを基準に、x（前後に曲げる）・y（ねじる）・z（横に開く）の角度で、安静の姿勢から回す */
  private set(n: string, x: number, y = 0, z = 0) {
    const r = this.b[n]; if (!r) return;
    this.qa.setFromAxisAngle(r.ax, x); this.qb.setFromAxisAngle(r.ay, y); this.qc.setFromAxisAngle(r.az, z);
    r.bone.quaternion.copy(this.qa).multiply(this.qb).multiply(this.qc).multiply(r.rest);
  }
  // 安静の姿勢（MakeHuman の標準の姿勢）は腕を斜め下に開き、脚も少し開いている。立つときの補正
  static ARM_DOWN = 0.62; static LEG_IN = 0.09;
  /** speed: 歩く速さ（µm/s）, aiming: 道具を構えているか, pitch: 視点の上下 */
  update(dt: number, speed: number, aiming: boolean, pitch: number) {
    this.t += dt; this.phase += dt * (2.2 + speed * 0.95);
    const amp = Math.min(1, speed / 4.5), s = Math.sin(this.phase), c = Math.cos(this.phase);
    this.aim += ((aiming ? 1 : 0) - this.aim) * Math.min(1, dt * 9);
    const A = this.aim, idle = 1 - amp, br = Math.sin(this.t * 1.6) * 0.5 + 0.5;   // 呼吸
    // 脚：前後の振り、ひざの曲げ、足裏を地面に沿わせる。立ち止まると片足に重心をのせる
    const tL = -s * 0.55 * amp, tR = s * 0.55 * amp;
    const kL = Math.max(0, c) * 0.9 * amp + 0.06 + 0.12 * idle, kR = Math.max(0, -c) * 0.9 * amp + 0.03;
    this.set('thighL', tL - 0.08 * idle, 0, -Diver.LEG_IN - 0.03 * idle); this.set('thighR', tR + 0.03 * idle, 0, Diver.LEG_IN + 0.05 * idle);
    this.set('shinL', kL); this.set('shinR', kR);
    this.set('footL', -(tL + kL) * 0.65); this.set('footR', -(tR + kR) * 0.65);
    this.set('pelvis', 0, s * 0.07 * amp, 0.05 * idle);
    this.set('chest', 0.04 * amp - 0.015 * br, -s * 0.1 * amp + 0.2 * A, -0.06 * idle);
    this.set('head', -pitch * 0.4 * A + 0.05 * idle, s * 0.04 * amp - 0.15 * A, 0.04 * idle);
    // 腕：歩く振り。構えると右腕を前へ伸ばす
    this.set('upperArmL', s * 0.42 * amp + 0.04 * idle, 0, -Diver.ARM_DOWN + 0.06);
    this.set('foreArmL', -(0.05 + 0.2 * amp));
    this.set('handL', -0.1);
    this.set('upperArmR', (-s * 0.42 * amp - 0.03 * idle) * (1 - A) + (-1.42 + pitch * 0.85) * A, 0, Diver.ARM_DOWN - 0.06 * (1 - A) + 0.05 * A);
    this.set('foreArmR', -(0.12 + 0.2 * amp) * (1 - A) + 0.3 * A);
    this.set('handR', -0.08 * (1 - A));
    this.root.position.y += Math.abs(c) * 0.03 * amp;
  }
}

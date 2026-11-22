// 人型の動き：姿勢の目標へなめらかに寄せる、足の接地（簡易IK）、揺れもの（ばね）。
import * as THREE from 'three';
import { Rig } from './model';
import { blotMaterial } from './watercolor';
let shadowMat: THREE.ShaderMaterial | null = null;
import { BONES, type BoneName, type Joints } from '../models/skeleton';

export type Pose = Partial<Record<BoneName, [number, number, number]>>; // オイラー角（ラジアン, XYZ）
const _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _q2 = new THREE.Quaternion();
const DOWN = new THREE.Vector3(0, -1, 0);

interface Foot { pos: THREE.Vector3; from: THREE.Vector3; to: THREE.Vector3; t: number; stepping: boolean; side: 1 | -1 }

export class Humanoid {
  rig: Rig;
  root: THREE.Group;
  pos = new THREE.Vector3(); yaw = 0; scale = 1;
  vel = new THREE.Vector3();
  target: Pose = {};
  rate = 12;                 // 姿勢を寄せる速さ
  hipDrop = 0; hipLean = 0;  // 腰の沈みと前傾（姿勢から指定）
  mats: THREE.ShaderMaterial[] = [];
  private feet: Foot[];
  private sway = new THREE.Vector3(); private swayV = new THREE.Vector3(); private lastPos = new THREE.Vector3();
  private thighLen: number; private shinLen: number; private hipW: number; private footH: number;
  onStep?: (side: number) => void;
  /** 足もとの影の染み。シーンに別途 add する */
  shadow: THREE.Mesh;
  groundY: (x: number, z: number) => number = () => 0;
  stride = 0.42; stepTime = 0.26;

  constructor(J: Joints, scale = 1) {
    this.rig = new Rig(J); this.root = this.rig.root; this.scale = scale;
    this.root.scale.setScalar(scale);
    this.thighLen = J.thighL[1] - J.shinL[1]; this.shinLen = J.shinL[1] - J.footL[1]; this.hipW = J.thighL[0]; this.footH = J.footL[1];
    shadowMat ??= blotMaterial({ color: 0x55647e, opacity: 0.42, soft: 0.75, edge: 0.5 });
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(2, 2).rotateX(-Math.PI / 2), shadowMat);
    this.shadow.renderOrder = 2;
    this.feet = [1, -1].map(s => ({ pos: new THREE.Vector3(), from: new THREE.Vector3(), to: new THREE.Vector3(), t: 1, stepping: false, side: s as 1 | -1 }));
  }
  add(geo: THREE.BufferGeometry, mat: THREE.ShaderMaterial): THREE.SkinnedMesh { this.mats.push(mat); return this.rig.add(geo, mat); }
  place(x: number, z: number, yaw: number): void {
    this.pos.set(x, this.groundY(x, z), z); this.yaw = yaw; this.lastPos.copy(this.pos); this.sway.set(0, 0, 0); this.swayV.set(0, 0, 0);
    for (const f of this.feet) { this.home(f, _v); f.pos.copy(_v); f.stepping = false; f.t = 1; }
  }
  private home(f: Foot, out: THREE.Vector3): THREE.Vector3 {
    const s = Math.sin(this.yaw), c = Math.cos(this.yaw), w = this.hipW * this.scale * 1.25 * f.side * (1 + this.wide);
    out.set(this.pos.x + c * w, 0, this.pos.z - s * w);
    out.x += this.vel.x * this.stepTime * 0.9; out.z += this.vel.z * this.stepTime * 0.9;
    out.y = this.groundY(out.x, out.z);
    return out;
  }
  wide = 0; // 足幅の広げ（構え）

  update(dt: number): void {
    const sc = this.scale;
    this.pos.y += (this.groundY(this.pos.x, this.pos.z) - this.pos.y) * Math.min(1, dt * 14);
    // 足運び：離れすぎた足を、もう一方が接地している時に踏み出す
    const speed = Math.hypot(this.vel.x, this.vel.z);
    const stT = this.stepTime * (speed > 3.2 * sc ? 0.75 : 1);
    let maxSpread = 0;
    for (let i = 0; i < 2; i++) {
      const f = this.feet[i], o = this.feet[1 - i];
      this.home(f, _v);
      const d = Math.hypot(_v.x - f.pos.x, _v.z - f.pos.z);
      if (f.stepping) {
        f.t = Math.min(1, f.t + dt / stT);
        f.to.copy(_v);
        const e = f.t * f.t * (3 - 2 * f.t);
        f.pos.lerpVectors(f.from, f.to, e);
        f.pos.y += Math.sin(Math.PI * f.t) * 0.13 * sc * Math.min(1, 0.4 + speed / (2 * sc));
        if (f.t >= 1) { f.stepping = false; f.pos.copy(f.to); this.onStep?.(f.side); }
      } else if (d > this.stride * sc * (speed > 0.2 ? 0.55 : 0.3) && !o.stepping || d > this.stride * sc * 1.6) {
        f.stepping = true; f.t = 0; f.from.copy(f.pos);
      }
      maxSpread = Math.max(maxSpread, d);
    }
    // 根の位置と向き
    this.root.position.copy(this.pos);
    this.shadow.position.set(this.pos.x + 0.25 * sc, this.pos.y + 0.03, this.pos.z - 0.2 * sc); this.shadow.scale.set(0.62 * sc, 1, 0.5 * sc);
    this.root.rotation.y = this.yaw;
    // 姿勢を目標へ寄せる（動き出しと止めに緩急）
    const k = 1 - Math.exp(-this.rate * dt);
    for (const n of BONES) {
      if (n === 'thighL' || n === 'thighR' || n === 'shinL' || n === 'shinR' || n === 'footL' || n === 'footR') continue;
      const t = this.target[n];
      _q.setFromEuler(_e.set(t ? t[0] : 0, t ? t[1] : 0, t ? t[2] : 0, 'XYZ'));
      this.rig.bones[n].quaternion.slerp(_q, k);
    }
    // 腰：歩幅に応じた沈み＋姿勢の沈み
    const hips = this.rig.bones.hips, rest = this.rig.rest.hips;
    const spread = Math.hypot(this.feet[0].pos.x - this.feet[1].pos.x, this.feet[0].pos.z - this.feet[1].pos.z) / sc;
    const legMax = this.thighLen + this.shinLen;
    const drop = Math.max(0, spread - this.hipW * 2.6) * 0.22 + this.hipDrop;
    const fy = (this.feet[0].pos.y + this.feet[1].pos.y) / 2 - this.pos.y;
    hips.position.y += ((rest[1] - drop + Math.min(0, fy / sc) * 0.5) - hips.position.y) * Math.min(1, dt * 10);
    hips.position.z += (this.hipLean - hips.position.z) * Math.min(1, dt * 10);
    this.root.updateMatrixWorld(true);
    // 脚のIK
    for (const f of this.feet) {
      const L = f.side > 0;
      const thigh = this.rig.bones[L ? 'thighL' : 'thighR'], shin = this.rig.bones[L ? 'shinL' : 'shinR'], foot = this.rig.bones[L ? 'footL' : 'footR'];
      // 目標（足首）を腰のローカルへ
      _v.set(f.pos.x, f.pos.y + this.footH * sc, f.pos.z);
      hips.worldToLocal(_v); _v.sub(thigh.position);
      const a = this.thighLen, b = this.shinLen;
      let d = _v.length(); d = Math.min(Math.max(d, Math.abs(a - b) + 0.02), (a + b) * 0.999);
      const cosK = (a * a + b * b - d * d) / (2 * a * b), bend = Math.PI - Math.acos(Math.min(1, Math.max(-1, cosK)));
      const cosA = (a * a + d * d - b * b) / (2 * a * d), A = Math.acos(Math.min(1, Math.max(-1, cosA)));
      _q.setFromUnitVectors(DOWN, _v2.copy(_v).normalize());
      _q2.setFromEuler(_e.set(-A, 0, 0));
      thigh.quaternion.copy(_q).multiply(_q2);
      shin.quaternion.setFromEuler(_e.set(bend, 0, 0));
      // 足裏は地面に平らに（踏み出し中はつま先を少し下げる）
      _q.copy(hips.quaternion).multiply(thigh.quaternion).multiply(shin.quaternion).invert();
      _q2.setFromEuler(_e.set(f.stepping ? Math.sin(Math.PI * f.t) * 0.35 : 0, 0, 0));
      foot.quaternion.copy(_q).multiply(_q2);
      void legMax;
    }
    // 揺れもの：根の動きに遅れて付いてくるばね
    _v.copy(this.pos).sub(this.lastPos); this.lastPos.copy(this.pos);
    this.swayV.addScaledVector(_v, -9);                      // 動いた分だけ後ろへ引かれる
    this.swayV.addScaledVector(this.sway, -60 * dt);         // ばね
    this.swayV.multiplyScalar(Math.exp(-7 * dt));            // 減衰
    this.sway.addScaledVector(this.swayV, dt);
    this.sway.clampLength(0, 0.35 * sc);
    for (const m of this.mats) (m.uniforms.uSwayVec.value as THREE.Vector3).copy(this.sway);
  }
  /** 揺れに一押し（腕を振った時など） */
  kick(x: number, y: number, z: number): void { this.swayV.x += x; this.swayV.y += y; this.swayV.z += z; }
  boneWorld(n: BoneName, out: THREE.Vector3): THREE.Vector3 { return out.setFromMatrixPosition(this.rig.bones[n].matrixWorld); }
}

/** 姿勢の合成：a に b を重ねる */
export function mixPose(a: Pose, b: Pose, t: number): Pose {
  const o: Pose = {};
  for (const n of BONES) {
    const x = a[n], y = b[n];
    if (!x && !y) continue;
    const p = x ?? [0, 0, 0], q = y ?? [0, 0, 0];
    o[n] = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
  }
  return o;
}

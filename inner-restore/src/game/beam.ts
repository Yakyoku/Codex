// 浄化の光線（治療の光。作り事の道具）。画面版と VR 版で共用する。
//   芯：明るく細い光／外側：縁がやわらかく消える光の層／流れ：根元から先端へ流れる光のうねりと粒／
//   当たった所：組織の上に広がる光の輪と、舞い上がる細かな粒。原色を避け、淡い白から紫へ。
import * as THREE from 'three/webgpu';
import { tsl, type N } from '../core/tsl';
const { uniform, uv, texture, vec2, float, color, mix, smoothstep, pow, abs, dot, normalView, positionViewDirection, sin, length, exp, pointUV, saturate } = tsl;

export class PurifyBeam {
  group = new THREE.Group();
  private uTime = uniform(0); private uOn = uniform(0); private uLen = uniform(10);
  private core: THREE.Mesh; private outer: THREE.Mesh; private impact: THREE.Mesh; private flare: THREE.Mesh;
  private sparks: THREE.Points; private sparkPos: Float32Array; private sparkSeed: Float32Array;
  light = new THREE.PointLight(0xd9c4ff, 0, 22, 1.6);
  private on = 0; private t = 0;
  constructor(noise: THREE.Texture, private scale = 1) {
    const geo = (r0: number, r1: number) => { const g = new THREE.CylinderGeometry(r0 * scale, r1 * scale, 1, 20, 1, true); g.translate(0, 0.5, 0); g.rotateX(Math.PI / 2); return g; };
    const facing = abs(dot(normalView, positionViewDirection));                       // 正面ほど 1、縁ほど 0
    const along = uv().y;                                                             // 0=根元 → 1=先端
    const flow = texture(noise, vec2(uv().x.mul(2), along.mul(this.uLen).mul(0.12).sub(this.uTime.mul(1.6)))).g;   // 先端へ流れるうねり
    const ends = smoothstep(0.0, 0.04, along).mul(smoothstep(1.0, 0.9, along));
    // 芯
    const cm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    cm.colorNode = mix(color(0xb48cff), color(0xfff6ff), pow(facing, 3)).mul(pow(facing, 1.2).mul(2.6)).mul(flow.mul(0.5).add(0.75)).mul(ends).mul(this.uOn);
    this.core = new THREE.Mesh(geo(0.035, 0.085), cm);
    // 外側のやわらかい光
    const om = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const pulse = sin(along.mul(this.uLen).mul(1.4).sub(this.uTime.mul(9))).mul(0.5).add(0.5);
    om.colorNode = color(0x9a62ff).mul(pow(facing, 2.0).mul(1.0)).mul(flow.mul(0.8).add(0.35)).mul(pulse.mul(0.35).add(0.65)).mul(ends).mul(this.uOn);
    this.outer = new THREE.Mesh(geo(0.12, 0.42), om);
    for (const m of [this.core, this.outer]) { m.frustumCulled = false; m.renderOrder = 52; this.group.add(m); }
    // 当たった所：広がる光の輪
    const im = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const r = length(uv().sub(0.5)).mul(2);
    const rings = sin(r.mul(22).sub(this.uTime.mul(7))).mul(0.5).add(0.5).pow(6).mul(smoothstep(1.0, 0.2, r));
    const center = exp(r.mul(r).mul(-14));
    im.colorNode = mix(color(0x7c48ff), color(0xf4ecff), center).mul(center.mul(1.4).add(rings.mul(0.55))).mul(smoothstep(1.0, 0.75, r)).mul(this.uOn);
    this.impact = new THREE.Mesh(new THREE.PlaneGeometry(7 * scale, 7 * scale), im); this.impact.rotation.x = -Math.PI / 2; this.impact.renderOrder = 53; this.impact.frustumCulled = false;
    // 根元の小さな光の花
    const fm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const fr = length(uv().sub(0.5)).mul(2);
    fm.colorNode = color(0xeadcff).mul(exp(fr.mul(fr).mul(-9))).mul(this.uOn);
    this.flare = new THREE.Mesh(new THREE.PlaneGeometry(0.6 * scale, 0.6 * scale), fm); this.flare.renderOrder = 54; this.flare.frustumCulled = false;
    // 粒：光線に沿って先端へ流れ、当たった所で舞い上がる
    const n = 90; this.sparkPos = new Float32Array(n * 3); this.sparkSeed = new Float32Array(n);
    for (let i = 0; i < n; i++) this.sparkSeed[i] = Math.random();
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(this.sparkPos, 3));
    const pm = new THREE.PointsNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const pr = length(pointUV.sub(0.5)).mul(2);
    pm.colorNode = color(0xf0e2ff).mul(saturate(float(1).sub(pr)).pow(2)).mul(this.uOn);
    pm.sizeNode = float(0.16 * scale);
    this.sparks = new THREE.Points(sg, pm); this.sparks.frustumCulled = false; this.sparks.renderOrder = 55;
    this.group.add(this.impact, this.flare, this.sparks, this.light);
  }
  private a = new THREE.Vector3(); private d = new THREE.Vector3(); private side = new THREE.Vector3(); private up2 = new THREE.Vector3();
  /** from: 光の出口、to: 当たった所、firing: 照射中か、camera: 根元の光の花を正面に向けるため */
  update(dt: number, from: THREE.Vector3, to: THREE.Vector3, firing: boolean, camera: THREE.Camera) {
    this.t += dt; this.on += ((firing ? 1 : 0) - this.on) * Math.min(1, dt * (firing ? 14 : 6));
    const on = this.on * (0.9 + 0.1 * Math.sin(this.t * 37));
    this.uTime.value = this.t; this.uOn.value = on; this.group.visible = this.on > 0.01;
    if (!this.group.visible) { this.light.intensity = 0; return; }
    const len = from.distanceTo(to); this.uLen.value = len;
    for (const m of [this.core, this.outer]) { m.position.copy(from); m.lookAt(to); m.scale.set(1, 1, len); }
    this.impact.position.copy(to).y += 0.06;
    this.flare.position.copy(from); this.flare.quaternion.copy(camera.quaternion);
    this.light.position.copy(to).y += 1.2; this.light.intensity = 30 * on;
    // 粒の位置
    this.d.subVectors(to, from).normalize(); this.side.set(-this.d.z, 0, this.d.x).normalize(); this.up2.crossVectors(this.d, this.side);
    const n = this.sparkSeed.length;
    for (let i = 0; i < n; i++) {
      const s = this.sparkSeed[i]; let k = (s + this.t * (0.55 + s * 0.5)) % 1;
      if (i < n * 0.7) {   // 光線に沿ってらせん状に流れる
        const ang = s * 40 + this.t * 6 + k * 10, rr = (0.05 + 0.12 * s) * this.scale * (0.3 + k);
        this.a.copy(from).addScaledVector(this.d, len * k).addScaledVector(this.side, Math.cos(ang) * rr).addScaledVector(this.up2, Math.sin(ang) * rr);
      } else {             // 当たった所から舞い上がる
        const ang = s * 97, rr = (0.4 + 2.2 * k) * this.scale;
        this.a.set(to.x + Math.cos(ang) * rr, to.y + 0.1 + k * 1.6 * this.scale * (0.5 + s), to.z + Math.sin(ang) * rr);
      }
      this.sparkPos[i * 3] = this.a.x; this.sparkPos[i * 3 + 1] = this.a.y; this.sparkPos[i * 3 + 2] = this.a.z;
    }
    (this.sparks.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}

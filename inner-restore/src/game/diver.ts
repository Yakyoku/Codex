import * as THREE from 'three/webgpu';
import { loadGLB } from '../core/assets';

/** 主人公（ナノスーツの潜行士）。関節ごとの剛体の部品を回して動かす。 */
export class Diver {
  root = new THREE.Group();
  private j: Record<string, THREE.Object3D> = {};
  private phase = 0; private aim = 0;
  lamp = new THREE.SpotLight(0xfff2dc, 0, 46, 0.62, 0.7, 1.4);
  hand = new THREE.Object3D();
  fill = new THREE.PointLight(0xffe6d2, 5, 9, 1.8);
  static async load() {
    const d = new Diver();
    const g = await loadGLB('/static/models/diver.glb', true);
    const model = g.scene; d.root.add(model);
    model.traverse((o) => { d.j[o.name] = o; const m = o as THREE.Mesh; m.frustumCulled = false;
      if (m.isMesh) for (const mt of (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshPhysicalMaterial[]) {
        mt.envMapIntensity = 1.8; if (mt.aoMap) mt.aoMapIntensity = 1.0;
        if (mt.name === 'glass') { mt.transparent = true; mt.opacity = 0.34; mt.roughness = 0.03; mt.depthWrite = false; mt.envMapIntensity = 3.2; m.renderOrder = 45; }
      } });
    const head = d.j.head ?? model;
    d.lamp.position.set(0.17, 0.3, 0.11); head.add(d.lamp); d.lamp.target.position.set(0.17, -0.5, 6); head.add(d.lamp.target);
    (d.j.foreArmR ?? model).add(d.hand); d.hand.position.set(-0.07, -0.29, 0.015);
    d.fill.position.set(0.4, 2.3, -1.6); d.root.add(d.fill);   // スーツの輪郭を拾う、ごく弱い補助光
    return d;
  }
  /** speed: 歩く速さ（µm/s）, aiming: 道具を構えているか */
  update(dt: number, speed: number, aiming: boolean, pitch: number) {
    const j = this.j; this.phase += dt * (2.2 + speed * 0.95);
    const amp = Math.min(1, speed / 4.5), s = Math.sin(this.phase), c = Math.cos(this.phase);
    this.aim += ((aiming ? 1 : 0) - this.aim) * Math.min(1, dt * 9);
    const set = (n: string, x: number, z = 0) => { const o = j[n]; if (o) { o.rotation.x = x; o.rotation.z = z; } };
    const tL = -s * 0.6 * amp, tR = s * 0.6 * amp, kL = Math.max(0, c) * 0.95 * amp + 0.05, kR = Math.max(0, -c) * 0.95 * amp + 0.05;
    set('thighL', tL); set('thighR', tR); set('shinL', kL); set('shinR', kR);
    set('footL', -(tL + kL) * 0.7); set('footR', -(tR + kR) * 0.7);          // 足の裏を地面に沿わせる
    const breathe = Math.sin(this.phase * 0.3) * 0.012;
    set('upperArmL', s * 0.42 * amp, 0.05); set('foreArmL', -0.22 - 0.25 * amp); set('handL', -0.1);
    set('upperArmR', (-s * 0.42 * amp) * (1 - this.aim) + (-1.32 + pitch * 0.85) * this.aim, -0.05);
    set('foreArmR', (-0.22 - 0.25 * amp) * (1 - this.aim) + -0.12 * this.aim); set('handR', -0.1);
    if (j.chest) { j.chest.rotation.x = 0.05 * amp + breathe; j.chest.rotation.y = -s * 0.09 * amp + 0.18 * this.aim; }
    if (j.pelvis) j.pelvis.rotation.y = s * 0.05 * amp;
    if (j.head) { j.head.rotation.x = -pitch * 0.45 * this.aim; j.head.rotation.y = s * 0.05 * amp - 0.12 * this.aim; }
    this.root.position.y += Math.abs(c) * 0.035 * amp;
  }
}

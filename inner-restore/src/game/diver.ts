import * as THREE from 'three/webgpu';
import { loadGLB } from '../core/assets';

/** 主人公（ナノスーツの潜行士）。関節ごとの剛体の部品を回して動かす。 */
export class Diver {
  root = new THREE.Group();
  private j: Record<string, THREE.Object3D> = {};
  private phase = 0; private aim = 0;
  lamp = new THREE.SpotLight(0xfff2dc, 0, 46, 0.62, 0.7, 1.4);
  hand = new THREE.Object3D();
  static async load() {
    const d = new Diver();
    const g = await loadGLB('/static/models/diver.glb', true);
    const model = g.scene; d.root.add(model);
    model.traverse((o) => { d.j[o.name] = o; const m = o as THREE.Mesh; m.frustumCulled = false;
      if (m.isMesh) for (const mt of (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshStandardMaterial[]) { if (mt.name === 'shell') mt.color.multiplyScalar(0.85); mt.envMapIntensity = 1.6; } });
    const head = d.j.head ?? model;
    d.lamp.position.set(0.13, 0.32, 0.16); head.add(d.lamp); d.lamp.target.position.set(0.13, -0.4, 6); head.add(d.lamp.target);
    (d.j.foreArmR ?? model).add(d.hand); d.hand.position.set(0, -0.4, 0.05);
    return d;
  }
  /** speed: 歩く速さ（µm/s）, aiming: 道具を構えているか */
  update(dt: number, speed: number, aiming: boolean, pitch: number) {
    const j = this.j; this.phase += dt * (2.2 + speed * 0.95);
    const amp = Math.min(1, speed / 4.5), s = Math.sin(this.phase), c = Math.cos(this.phase);
    this.aim += ((aiming ? 1 : 0) - this.aim) * Math.min(1, dt * 9);
    const set = (n: string, x: number, z = 0) => { const o = j[n]; if (o) { o.rotation.x = x; o.rotation.z = z; } };
    set('thighL', -s * 0.62 * amp); set('thighR', s * 0.62 * amp);
    set('shinL', Math.max(0, c) * 0.9 * amp + 0.04); set('shinR', Math.max(0, -c) * 0.9 * amp + 0.04);
    set('upperArmL', s * 0.45 * amp, 0.06); set('foreArmL', -0.25 - 0.2 * amp);
    const idle = Math.sin(this.phase * 0.35) * 0.02;
    set('upperArmR', (-s * 0.45 * amp) * (1 - this.aim) + (-1.35 + pitch * 0.8) * this.aim, -0.06);
    set('foreArmR', (-0.25 - 0.2 * amp) * (1 - this.aim) + -0.15 * this.aim);
    if (j.torso) { j.torso.rotation.x = 0.06 * amp + idle; j.torso.position.y += 0; }
    if (j.head) j.head.rotation.x = -pitch * 0.5 * this.aim;
    this.root.position.y += Math.abs(c) * 0.035 * amp;
  }
}

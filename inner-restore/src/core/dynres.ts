// 描画解像度の自動調整：目標の fps を下回ったら解像度を下げ、余裕があれば上げる。
// iPad など高精細な画面で、画面の画素数そのままに描くと重くなりすぎるため。
import type * as THREE from 'three/webgpu';
export class DynamicResolution {
  scale: number; private acc = 0; private n = 0; private t = 0; private calm = 0;
  constructor(private renderer: THREE.WebGPURenderer, private min: number, private max: number, start: number, private target = 57) { this.scale = start; this.apply(); }
  private apply() { this.renderer.setPixelRatio(this.scale); this.renderer.setSize(innerWidth, innerHeight, false); }
  /** 毎コマ呼ぶ。dt は実際のコマの時間（秒） */
  tick(dt: number) {
    if (dt <= 0 || dt > 0.5) return;           // タブ切り替えなどの異常値は無視
    this.acc += dt; this.n++; this.t += dt;
    if (this.t < 0.75) return;
    const fps = this.n / this.acc; this.acc = 0; this.n = 0; this.t = 0;
    let s = this.scale;
    if (fps < this.target - 12) s *= 0.8; else if (fps < this.target - 3) s *= 0.92;
    else if (fps > this.target + 1 && ++this.calm > 3) { s *= 1.06; this.calm = 0; }
    s = Math.min(this.max, Math.max(this.min, s));
    if (Math.abs(s - this.scale) > 0.01) { this.scale = s; this.apply(); }
  }
  setMax(m: number) { this.max = m; if (this.scale > m) { this.scale = m; this.apply(); } }
}

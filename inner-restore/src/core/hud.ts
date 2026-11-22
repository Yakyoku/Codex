// 画面の隅に、描画方式・fps・端末の種類を出す
export class Hud {
  el: HTMLElement;
  private frames = 0; private last = performance.now(); fps = 0;
  constructor(private base: string) {
    this.el = document.createElement('div');
    this.el.className = 'ir-hud';
    this.el.textContent = base;
    document.body.appendChild(this.el);
  }
  tick() {
    this.frames++;
    const now = performance.now();
    if (now - this.last >= 500) {
      this.fps = (this.frames * 1000) / (now - this.last);
      this.frames = 0; this.last = now;
      this.el.textContent = `${this.base} · ${this.fps.toFixed(0)} fps`;
    }
  }
}

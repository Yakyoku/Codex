/** フレーム時間を集めて、平均 fps と「遅いとき」（下位1%）の fps を出す */
export class FpsMeter {
  private times: number[] = [];
  private last = 0;
  constructor(private max = 600) {}
  tick(now: number) {
    if (this.last) { this.times.push(now - this.last); if (this.times.length > this.max) this.times.shift(); }
    this.last = now;
  }
  reset() { this.times = []; this.last = 0; }
  get count() { return this.times.length; }
  get avg() { const n = this.times.length; return n ? 1000 / (this.times.reduce((a, b) => a + b, 0) / n) : 0; }
  /** 遅いほうから1%のフレームの平均 fps */
  get low1() {
    const n = this.times.length; if (!n) return 0;
    const s = [...this.times].sort((a, b) => b - a); const k = Math.max(1, Math.floor(n / 100));
    return 1000 / (s.slice(0, k).reduce((a, b) => a + b, 0) / k);
  }
  get worst() { return this.times.length ? 1000 / Math.max(...this.times) : 0; }
}

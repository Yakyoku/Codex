// 健康度（0〜1）の格子。見た目・動き・音・進行のすべてが、この値を見る。
export class HealthField {
  readonly data: Float32Array;
  version = 0;
  constructor(readonly w: number, readonly h: number, readonly sizeX: number, readonly sizeZ: number, initial = 0) {
    this.data = new Float32Array(w * h).fill(initial);
  }
  private gx(x: number) { return (x / this.sizeX + 0.5) * (this.w - 1); }
  private gz(z: number) { return (z / this.sizeZ + 0.5) * (this.h - 1); }
  /** 世界座標での健康度（双線形補間） */
  sample(x: number, z: number): number {
    const fx = Math.min(this.w - 1, Math.max(0, this.gx(x))), fz = Math.min(this.h - 1, Math.max(0, this.gz(z)));
    const x0 = Math.floor(fx), z0 = Math.floor(fz), x1 = Math.min(this.w - 1, x0 + 1), z1 = Math.min(this.h - 1, z0 + 1);
    const tx = fx - x0, tz = fz - z0, d = this.data, w = this.w;
    return (d[z0 * w + x0] * (1 - tx) + d[z0 * w + x1] * tx) * (1 - tz) + (d[z1 * w + x0] * (1 - tx) + d[z1 * w + x1] * tx) * tz;
  }
  /** (x,z) を中心に半径 radius の範囲を amount だけ治す（縁はなだらか）。実際に増えた量の合計を返す */
  heal(x: number, z: number, radius: number, amount: number): number {
    const cx = this.gx(x), cz = this.gz(z);
    const rx = (radius / this.sizeX) * (this.w - 1), rz = (radius / this.sizeZ) * (this.h - 1);
    let gained = 0;
    for (let j = Math.max(0, Math.floor(cz - rz)); j <= Math.min(this.h - 1, Math.ceil(cz + rz)); j++) {
      for (let i = Math.max(0, Math.floor(cx - rx)); i <= Math.min(this.w - 1, Math.ceil(cx + rx)); i++) {
        const d2 = ((i - cx) / rx) ** 2 + ((j - cz) / rz) ** 2;
        if (d2 >= 1) continue;
        const k = j * this.w + i, f = (1 - d2) * (1 - d2);
        const nv = Math.min(1, Math.max(0, this.data[k] + amount * f));
        gained += nv - this.data[k];
        this.data[k] = nv;
      }
    }
    if (gained !== 0) this.version++;
    return gained;
  }
  /** 血流の戻った所から、まわりの組織へ回復がゆっくり広がる（再灌流）。near が threshold を超えた隣があるマスだけ上がる */
  spread(dt: number, rate: number, threshold = 0.6): void {
    const { w, h, data: d } = this; let changed = false;
    if (!this.tmp) this.tmp = new Float32Array(d.length);
    const o = this.tmp; o.set(d);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const k = j * w + i; if (d[k] >= 1) continue;
      const m = Math.max(i > 0 ? d[k - 1] : 0, i < w - 1 ? d[k + 1] : 0, j > 0 ? d[k - w] : 0, j < h - 1 ? d[k + w] : 0);
      if (m > threshold && m > d[k]) { o[k] = Math.min(1, d[k] + rate * dt * (m - d[k])); changed = true; }
    }
    if (changed) { d.set(o); this.version++; }
  }
  private tmp?: Float32Array;
  mean(): number { let s = 0; for (let i = 0; i < this.data.length; i++) s += this.data[i]; return s / this.data.length; }
  /** 場所ごとの値を関数で決める（初期の病み方の分布） */
  setFn(f: (x: number, z: number) => number) { for (let j = 0; j < this.h; j++) for (let i = 0; i < this.w; i++) this.data[j * this.w + i] = Math.min(1, Math.max(0, f((i / (this.w - 1) - 0.5) * this.sizeX, (j / (this.h - 1) - 0.5) * this.sizeZ))); this.version++; }
  /** 場所ごとの上限で抑える（血が届かない所は治りきらない）。変わったときだけ版を進める */
  clampFn(cap: (x: number, z: number) => number) { let ch = false; for (let j = 0; j < this.h; j++) for (let i = 0; i < this.w; i++) { const k = j * this.w + i; if (this.data[k] < 0.3) continue; const c = cap((i / (this.w - 1) - 0.5) * this.sizeX, (j / (this.h - 1) - 0.5) * this.sizeZ); if (this.data[k] > c) { this.data[k] = c; ch = true; } } if (ch) this.version++; }
  setAll(v: number) { this.data.fill(Math.min(1, Math.max(0, v))); this.version++; }
  /** 0〜255 のバイト列（テクスチャ用）に書き出す */
  toBytes(out: Uint8Array) { for (let i = 0; i < this.data.length; i++) out[i] = Math.round(this.data[i] * 255); return out; }
  /** セーブ用の短い文字列（16段階）と、その復元 */
  serialize(): string { let s = ''; for (let i = 0; i < this.data.length; i++) s += Math.round(this.data[i] * 15).toString(16); return s; }
  deserialize(s: string): boolean {
    if (s.length !== this.data.length || /[^0-9a-f]/.test(s)) return false;
    for (let i = 0; i < s.length; i++) this.data[i] = parseInt(s[i], 16) / 15;
    this.version++; return true;
  }
}

/** 健康度から血流の強さ（0〜1）を決める。閾値より下では流れない */
export function flowFactor(h: number, start: number, full: number): number {
  const t = Math.min(1, Math.max(0, (h - start) / (full - start)));
  return t * t * (3 - 2 * t);
}

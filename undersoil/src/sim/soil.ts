// 土の活力システム：区画（セル）ごとの水・糖・微生物・団粒から「活力（0〜1）」を出す。
// 描画にも入力にも依存しない純粋な計算。調整値は data/tuning.json。
import tuning from '../data/tuning.json';

export interface SoilParams {
  vitalityWeights: { water: number; microbes: number; structure: number };
  waterSpreadRate: number; waterSpreadThreshold: number; dryRate: number;
  microbeWakeWater: number; microbeGrowRate: number; microbeDormRate: number; microbeBase: number;
  carbonUseRate: number; structureGainRate: number; structureMicrobeMin: number; nutrientGainRate: number;
  awakenThreshold: number; rootThreshold: number;
}
export const DEFAULT_SOIL: SoilParams = tuning.soil as unknown as SoilParams;

export interface SoilCell {
  water: number; carbon: number; microbes: number; structure: number; nutrient: number;
  /** 乾きの強さ（山場の「乾きの風」で上げる）。1 が通常 */
  dryness: number;
}
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** 重み付きの相乗平均。どれか1つが 0 なら活力も 0（足りないものを足す遊びになる） */
export function vitality(c: SoilCell, p: SoilParams = DEFAULT_SOIL): number {
  const w = p.vitalityWeights;
  const sum = w.water + w.microbes + w.structure;
  return clamp01(Math.pow(Math.max(c.water, 0), w.water / sum) * Math.pow(Math.max(c.microbes, 0), w.microbes / sum) * Math.pow(Math.max(c.structure, 0), w.structure / sum));
}

export class SoilGrid {
  readonly cells: SoilCell[];
  /** 隣り合う区画（水がしみ込む相手）。粒の接点の「水の橋」がかかっている所だけがつながる */
  readonly links: Set<number>[];
  constructor(readonly count: number, readonly params: SoilParams = DEFAULT_SOIL) {
    this.cells = Array.from({ length: count }, () => ({ water: 0, carbon: 0, microbes: 0, structure: 0.15, nutrient: 0, dryness: 1 }));
    this.links = Array.from({ length: count }, () => new Set<number>());
  }
  link(a: number, b: number) { if (a !== b) { this.links[a].add(b); this.links[b].add(a); } }
  unlink(a: number, b: number) { this.links[a].delete(b); this.links[b].delete(a); }
  addWater(i: number, amount: number) { this.cells[i].water = clamp01(this.cells[i].water + amount); }
  addCarbon(i: number, amount: number) { this.cells[i].carbon = clamp01(this.cells[i].carbon + amount); }
  vitality(i: number) { return vitality(this.cells[i], this.params); }
  mean() { let s = 0; for (let i = 0; i < this.count; i++) s += this.vitality(i); return s / this.count; }
  awakened(i: number) { return this.vitality(i) >= this.params.awakenThreshold; }

  step(dt: number) {
    const p = this.params, cs = this.cells;
    // 1) 水：つながった区画へ、多いほうから少ないほうへしみ込む（しきい値を超えた分だけ）
    const dw = new Float32Array(this.count);
    for (let a = 0; a < this.count; a++) for (const b of this.links[a]) {
      if (b <= a) continue;
      const hi = cs[a].water >= cs[b].water ? a : b, lo = hi === a ? b : a;
      if (cs[hi].water < p.waterSpreadThreshold) continue;
      const f = (cs[hi].water - cs[lo].water) * 0.5 * Math.min(1, p.waterSpreadRate * dt);
      dw[hi] -= f; dw[lo] += f;
    }
    for (let i = 0; i < this.count; i++) {
      const c = cs[i];
      c.water = clamp01(c.water + dw[i] - p.dryRate * c.dryness * dt);
      // 2) 微生物：水があれば目覚め、糖があるほど増える。乾くと休眠に戻る（死なない）
      if (c.water >= p.microbeWakeWater) {
        const cap = clamp01(p.microbeBase + (1 - p.microbeBase) * Math.min(1, c.carbon * 2));
        c.microbes += (cap - c.microbes) * Math.min(1, p.microbeGrowRate * dt);
        c.carbon = clamp01(c.carbon - p.carbonUseRate * c.microbes * dt);
      } else {
        c.microbes += (0 - c.microbes) * Math.min(1, p.microbeDormRate * dt);
      }
      c.microbes = clamp01(c.microbes);
      // 3) 団粒：微生物の粘質物が粒を結ぶ。いったんできた団粒はすぐには壊れない
      if (c.microbes >= p.structureMicrobeMin) c.structure = clamp01(c.structure + p.structureGainRate * c.microbes * dt);
      // 4) 養分：活動している微生物が、植物の使える形にする
      c.nutrient = clamp01(c.nutrient + p.nutrientGainRate * c.microbes * c.water * dt);
    }
  }
  toJSON() { return { cells: this.cells.map((c) => [c.water, c.carbon, c.microbes, c.structure, c.nutrient].map((v) => Math.round(v * 1000) / 1000)), links: this.links.map((s) => [...s]) }; }
  static fromJSON(j: { cells: number[][]; links: number[][] }, params: SoilParams = DEFAULT_SOIL) {
    const g = new SoilGrid(j.cells.length, params);
    j.cells.forEach((v, i) => Object.assign(g.cells[i], { water: v[0], carbon: v[1], microbes: v[2], structure: v[3], nutrient: v[4] }));
    j.links.forEach((l, a) => l.forEach((b) => g.link(a, b)));
    return g;
  }
}

import { describe, expect, it } from 'vitest';
import { SoilGrid, vitality } from '../src/sim/soil';

const run = (g: SoilGrid, sec: number, dt = 0.1) => { for (let t = 0; t < sec; t += dt) g.step(dt); };

describe('土の活力', () => {
  it('どれか1つが欠けると活力は 0', () => {
    expect(vitality({ water: 1, carbon: 1, microbes: 0, structure: 1, nutrient: 0, dryness: 1 })).toBe(0);
    expect(vitality({ water: 1, carbon: 1, microbes: 1, structure: 1, nutrient: 0, dryness: 1 })).toBeCloseTo(1);
  });
  it('乾いた土は何もしなければ目覚めない', () => {
    const g = new SoilGrid(4); run(g, 120);
    expect(g.mean()).toBe(0);
  });
  it('水だけでは微生物は少ししか増えず、糖を足すと目覚める', () => {
    const g = new SoilGrid(1);
    g.addWater(0, 1); run(g, 30);
    const waterOnly = g.vitality(0);
    expect(g.cells[0].microbes).toBeGreaterThan(0.1);
    expect(g.awakened(0)).toBe(false);
    for (let k = 0; k < 6; k++) { g.addCarbon(0, 0.6); g.addWater(0, 0.3); run(g, 15); }
    expect(g.vitality(0)).toBeGreaterThan(waterOnly);
    expect(g.awakened(0)).toBe(true);
  });
  it('水は「水の橋」でつながった区画にだけしみ込む', () => {
    const g = new SoilGrid(3); g.link(0, 1);
    g.addWater(0, 1); run(g, 20);
    expect(g.cells[1].water).toBeGreaterThan(0.3);
    expect(g.cells[2].water).toBe(0);
  });
  it('乾くと微生物は休眠に戻るが、団粒は残る', () => {
    const g = new SoilGrid(1);
    for (let k = 0; k < 6; k++) { g.addCarbon(0, 0.6); g.addWater(0, 0.5); run(g, 15); }
    const s = g.cells[0].structure;
    g.cells[0].dryness = 60; run(g, 60);
    expect(g.cells[0].water).toBe(0);
    expect(g.cells[0].microbes).toBeLessThan(0.01);
    expect(g.cells[0].structure).toBeGreaterThanOrEqual(s);
  });
  it('保存と復元で同じ状態に戻る', () => {
    const g = new SoilGrid(3); g.link(0, 1); g.addWater(0, 0.8); g.addCarbon(0, 0.5); run(g, 10);
    const h = SoilGrid.fromJSON(JSON.parse(JSON.stringify(g)));
    expect(h.vitality(0)).toBeCloseTo(g.vitality(0), 2);
    expect([...h.links[1]]).toEqual([0]);
  });
});

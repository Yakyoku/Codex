import { describe, it, expect } from 'vitest';
import { HealthField, flowFactor } from '../src/core/health';

describe('HealthField', () => {
  it('最初は指定した値で、平均もその値', () => {
    const f = new HealthField(20, 10, 100, 50, 0.1);
    expect(f.mean()).toBeCloseTo(0.1, 5);
    expect(f.sample(0, 0)).toBeCloseTo(0.1, 5);
  });
  it('治した場所だけが上がり、遠くは変わらない', () => {
    const f = new HealthField(40, 20, 100, 50, 0);
    const g = f.heal(10, 5, 8, 0.5);
    expect(g).toBeGreaterThan(0);
    expect(f.sample(10, 5)).toBeGreaterThan(0.3);
    expect(f.sample(-40, -20)).toBe(0);
  });
  it('1 を超えず、0 を下回らない', () => {
    const f = new HealthField(10, 10, 10, 10, 0.9);
    for (let i = 0; i < 10; i++) f.heal(0, 0, 5, 1);
    expect(Math.max(...f.data)).toBeLessThanOrEqual(1);
    f.heal(0, 0, 5, -5);
    expect(Math.min(...f.data)).toBeGreaterThanOrEqual(0);
  });
  it('範囲の外の座標でも落ちない', () => {
    const f = new HealthField(10, 10, 10, 10, 0.5);
    expect(f.sample(999, -999)).toBeCloseTo(0.5, 5);
    expect(() => f.heal(999, 999, 3, 1)).not.toThrow();
  });
  it('書き出して読み込むと、ほぼ同じ状態に戻る', () => {
    const f = new HealthField(12, 8, 10, 10, 0);
    f.heal(1, 1, 4, 0.8);
    const s = f.serialize();
    const g = new HealthField(12, 8, 10, 10, 0);
    expect(g.deserialize(s)).toBe(true);
    expect(g.mean()).toBeCloseTo(f.mean(), 1);
    expect(g.deserialize('zz')).toBe(false);
  });
  it('変更があると version が進む（テクスチャ更新の合図）', () => {
    const f = new HealthField(10, 10, 10, 10, 0);
    const v = f.version; f.heal(0, 0, 3, 0.2);
    expect(f.version).toBeGreaterThan(v);
  });
});
describe('spread', () => {
  it('治した所から周りへ広がるが、手つかずの場所からは広がらない', () => {
    const f = new HealthField(20, 20, 20, 20, 0);
    f.spread(1, 1); expect(f.mean()).toBe(0);
    f.heal(0, 0, 4, 1); const m0 = f.mean();
    for (let i = 0; i < 50; i++) f.spread(0.1, 1);
    expect(f.mean()).toBeGreaterThan(m0); expect(Math.max(...f.data)).toBeLessThanOrEqual(1);
  });
});
describe('flowFactor', () => {
  it('閾値より下では流れず、上限より上では全開', () => {
    expect(flowFactor(0.2, 0.35, 0.8)).toBe(0);
    expect(flowFactor(0.9, 0.35, 0.8)).toBe(1);
    const m = flowFactor(0.575, 0.35, 0.8);
    expect(m).toBeGreaterThan(0.4); expect(m).toBeLessThan(0.6);
  });
});

import { HealthField as HF2 } from '../src/core/health';
import { test as t2, expect as e2 } from 'vitest';
t2('setFn：場所ごとに初めの健康度を決められ、核の近くほど低い', () => {
  const h = new HF2(20, 10, 100, 50, 0);
  h.setFn((x, z) => 0.3 - 0.3 * Math.exp(-(x * x + z * z) / 100));
  e2(h.sample(0, 0)).toBeLessThan(0.05); e2(h.sample(45, 20)).toBeGreaterThan(0.28);
});

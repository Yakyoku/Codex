import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';

// 生き物のデータは台帳（Docs/SPECIES.md）と一致していること。台帳にない生き物をゲームに登場させない。
const ledger = readFileSync(new URL('../Docs/SPECIES.md', import.meta.url), 'utf8');
const dir = new URL('../src/data/species/', import.meta.url);
const all = readdirSync(dir).map((f) => JSON.parse(readFileSync(new URL(f, dir), 'utf8')));

describe('生き物のデータと台帳', () => {
  it('17 件ある（ステージ1 が 11、ステージ2 が 6）', () => expect(all.length).toBe(17));
  for (const s of all) {
    it(`${s.nameJa}：台帳に載っている`, () => {
      expect(ledger).toContain(s.nameJa.replace(/（.*）/, ''));
      if (s.sci) expect(ledger.replace(/\*/g, '')).toContain(s.sci.replace(' 群', ''));
    });
    it(`${s.nameJa}：説明文は 1〜2 文（最大 3 文）で、長すぎない`, () => {
      expect(s.intro.split('。').filter((x: string) => x.length > 0).length).toBeLessThanOrEqual(3);
      expect(s.intro.length).toBeLessThanOrEqual(125);
    });
  }
});

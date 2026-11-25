// 読み上げの台本：ゲームで読み上げる言葉をすべて集める（AI の声を前もって録るため）。?narration で一覧を返す
import atlas from '../data/atlas.json';
import { LINES } from '../data/lines';
import type { ZoneMeta } from '../stages/zone';
export async function collectLines(): Promise<string[]> {
  const metas: ZoneMeta[] = [
    (await import('../stages/eye/retina')).RETINA_META, (await import('../stages/eye/lens')).LENS_META, (await import('../stages/eye/photo')).PHOTO_META,
    (await import('../stages/nose/airway')).CILIA_META, (await import('../stages/nose/airway')).MUCUS_META, (await import('../stages/nose/olfactory')).OLF_META,
    (await import('../stages/nose/airway')).BRONCH_META, (await import('../stages/lung/alveolus')).ALV_META, (await import('../stages/lung/alveolus')).WALL_META,
  ];
  const out: string[] = [];
  for (const m of metas) { if (m.enter) out.push(m.enter); out.push(m.arrive, m.plugHit, m.plugCleared(2), m.plugCleared(1), m.plugCleared(0), m.done); }
  for (const e of atlas.entries) out.push(`${e.ja}。${e.intro}`);
  out.push(...Object.values(LINES));
  return [...new Set(out)];
}
/** 言葉の識別子（FNV-1a 32bit）。録った音のファイル名に使う */
export function lineKey(t: string) { let h = 0x811c9dc5; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); }

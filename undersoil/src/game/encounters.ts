// 出会い：条件がそろい、落ち着いた瞬間になってから、紹介カードを1枚ずつ出す。
import { SPECIES } from './species';
import { showCard } from '../ui/card';

export interface Encounter { id: string; when: () => boolean; }
export function makeEncounters(list: Encounter[], opts: { calm?: () => boolean; gapSec?: number; onShow?: (id: string) => void } = {}) {
  const seen = new Set<string>(); let busy = false, wait = 2;
  return {
    seen,
    update(dt: number) {
      if (busy) return; wait -= dt; if (wait > 0) return;
      if (opts.calm && !opts.calm()) return; // 緊迫した場面の最中には出さない
      const next = list.find((e) => !seen.has(e.id) && SPECIES[e.id] && e.when()); if (!next) return;
      seen.add(next.id); busy = true; opts.onShow?.(next.id);
      showCard(SPECIES[next.id], { done: () => { busy = false; wait = opts.gapSec ?? 3; } });
    },
  };
}

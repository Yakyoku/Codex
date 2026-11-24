// 出会い：条件がそろい、落ち着いた瞬間になってから、紹介カードを1枚ずつ出す。
import { SPECIES } from './species';
import { showCard } from '../ui/card';

export type Target = { p: import('three').Vector3; r: number; geo?: import('three').BufferGeometry; matrix?: import('three').Matrix4; obj?: import('three').Object3D; /** 見せるときのカメラの位置（決まっている場合） */ view?: import('three').Vector3 } | null;
export interface Encounter { id: string; when: () => boolean; /** 画面のどれを説明しているかを示すための、世界の中の位置と大きさ */ target?: () => Target; }
export function makeEncounters(list: Encounter[], opts: { calm?: () => boolean; gapSec?: number; onShow?: (id: string, target: (() => Target) | null) => void; onHide?: () => void } = {}) {
  const seen = new Set<string>(); let busy = false, wait = 2;
  return {
    seen,
    /** もう一度紹介する（生き物を紹介するボタン用） */
    replay(ids: string[]) { for (const id of ids) seen.delete(id); wait = 0.5; },
    update(dt: number) {
      if (busy) return; wait -= dt; if (wait > 0) return;
      if (opts.calm && !opts.calm()) return; // 緊迫した場面の最中には出さない
      const next = list.find((e) => !seen.has(e.id) && SPECIES[e.id] && e.when()); if (!next) return;
      seen.add(next.id); busy = true; opts.onShow?.(next.id, next.target ?? null);
      showCard(SPECIES[next.id], { pointing: !!next.target, done: () => { busy = false; wait = opts.gapSec ?? 3; opts.onHide?.(); } });
    },
  };
}

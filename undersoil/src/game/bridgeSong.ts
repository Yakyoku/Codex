// 水の橋の旋律をつなぐ係（画面版と VR 版で共通）：
//   ・つながっている橋を、つながった順に並べ、区域（A/B/C）ごとの楽器で音にする
//   ・旋律の k 番目の音が鳴る瞬間に、その橋（区画 a と b の間の水の橋）を光らせる
//   ・遊んだあとに聞き直せるように、つないだ順の記録（土の歌）を残す
//   ・近くにいる生き物の音（細菌・コルポダ・クマムシ）の強さを計る
import * as THREE from 'three/webgpu';
import type { AudioEngine } from '../audio/engine';
import type { Game } from './game';

export const zoneOf = (a: number) => (a < 4 ? 0 : a < 8 ? 1 : 2);

export function makeBridgeSong(game: Game, audio: AudioEngine) {
  const g = game.world.grid; let order: [number, number][] = []; const song: number[] = [];
  audio.onNote = (k, delay) => { const o = order[k]; if (!o) return; window.setTimeout(() => game.bridges.flash(o[0], o[1]), Math.max(0, delay * 1000)); };
  const tmp = new THREE.Vector3();
  return {
    /** 土の歌：これまでにつないだ順の区域の列（最大 24） */
    get song() { return song.slice(); },
    update(head: THREE.Vector3) {
      const cur = new Set<string>(); for (let a = 0; a < g.count; a++) for (const b of g.links[a]) if (a < b) cur.add(a + '-' + b);
      order = order.filter(([a, b]) => cur.has(a + '-' + b));
      const have = new Set(order.map(([a, b]) => a + '-' + b));
      for (const k of [...cur].sort((x, y) => +x.split('-')[0] - +y.split('-')[0])) if (!have.has(k)) { const [a, b] = k.split('-').map(Number); order.push([a, b]); if (song.length < 24) song.push(zoneOf(a)); }
      audio.setBridges(order.map(([a]) => zoneOf(a)));
      if (game.wake > 0.5) audio.awaken();
      // 近くの生き物
      const c = g.cells[game.world.cellAt(head)];
      const bact = c ? Math.min(1, c.microbes) * (c.water > 0.3 ? 1 : 0.2) : 0;
      const cp = game.creatures.anyActive() ? game.creatures.nearest(head) : null; const colp = cp ? Math.max(0, 1 - cp.distanceTo(head) / 30) : 0;
      const tg = game.tardigrade.active() ? game.tardigrade.target() : null; const tardi = tg ? Math.max(0, 1 - tmp.copy(tg.p).distanceTo(head) / 45) : 0;
      audio.setNear(bact, colp, tardi);
    },
  };
}

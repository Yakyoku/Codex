// M1 の見せ場：乾いた土が、入口から順に水を得て目覚めていく流れを自動で進める（M3 でプレイヤーの手入れに置き換える）
import type { World } from './world';

export interface Demo { update(dt: number): void; start(): void; dry(): void; progress: number; running: boolean; }
export function makeDemo(world: World, secondsPerCell = 3.2): Demo {
  const g = world.grid; let t = 0, linked = 0;
  const d: Demo = {
    progress: 0, running: false,
    start() { d.running = true; },
    dry() { d.running = false; t = 0; linked = 0; for (let i = 0; i < g.count; i++) { g.cells[i].dryness = 400; for (const j of [...g.links[i]]) g.unlink(i, j); } },
    update(dt) {
      if (!d.running) { if (g.cells[0].dryness > 1 && g.cells.every((c) => c.water === 0)) for (const c of g.cells) c.dryness = 1; return; }
      for (const c of g.cells) c.dryness = 1;
      t += dt;
      const upto = Math.min(g.count, Math.floor(t / secondsPerCell) + 1);
      for (; linked < upto - 1; linked++) g.link(linked, linked + 1); // 水の橋がかかる
      for (let i = 0; i < upto; i++) { g.addWater(i, 0.5 * dt); g.addCarbon(i, 0.12 * dt); }
      d.progress = Math.min(1, t / (secondsPerCell * g.count + 20));
    },
  };
  return d;
}

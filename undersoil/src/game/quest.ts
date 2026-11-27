// 道しるべ（ステージ1 の道のり。設計 GDD 4）：入口「乾いた回廊」→ 区域 A「眠る者たち」→ 区域 B「泳ぐ道」→ 区域 C「種の岸」→ 山場「乾きの風」→ 土の目覚め。
// 「自分で動く」のときに、いまやることを 1 つだけ画面に出す。区画は 12（入口 1〜2、A 3〜5、B 6〜9、C 10〜12）。
import type { World } from './world';

type Step = { zone: string; text: string; hint: string; done: () => boolean; enter?: () => void };
export function makeQuest(world: World, api: { stats: { pours: number; links: number; sugars: number }; wind: () => 'wait' | 'on' | 'done'; windOk: () => boolean; startWind: () => void; retryWind: () => void; wake: () => number; scanned: () => number }) {
  const g = world.grid, C = g.cells;
  const wet = (a: number, b: number) => C.slice(a, b + 1).every((c) => c.water > 0.35);
  const linked = (a: number, b: number) => { for (let k = a; k < b; k++) if (!g.links[k].has(k + 1)) return false; return true; };
  const steps: Step[] = [
    { zone: '入口「乾いた回廊」', text: 'スキャンで、土のようすを調べる', hint: '「スキャン」を押す（E キー）', done: () => api.scanned() > 0 },
    { zone: '入口「乾いた回廊」', text: '入口で水をくみ、となりの区画にまいて、水の橋を 1 本かける', hint: '「水をくむ」→ 少し進んで「水をまく」（F キー）', done: () => api.stats.links >= 1 },
    { zone: '区域 A「眠る者たち」', text: '区画 3〜5 に水を運び、眠っている細菌を目覚めさせる', hint: '水が届くと、芽胞から細菌が目を覚まします', done: () => wet(2, 4) && C.slice(2, 5).some((c) => c.microbes > 0.3) },
    { zone: '区域 A「眠る者たち」', text: '糖のしずくを置いて、細菌の群れを増やす', hint: '「糖のしずく」（Q キー）。細菌が集まって、分かれて増えます', done: () => api.stats.sugars >= 1 },
    { zone: '区域 B「泳ぐ道」', text: '区画 6〜9 まで水の橋をつなぎ、泳げる道にする', hint: '橋がつながった所は、泳いで進めます。コルポダが殻から出てきます', done: () => wet(5, 8) && linked(0, 8) },
    { zone: '区域 C「種の岸」', text: '種の前（区画 10〜12）まで水を届ける', hint: '種の岸には、乾眠中のクマムシがいます', done: () => wet(9, 11) && linked(0, 11) },
    { zone: '山場「乾きの風」', text: '入口の側から乾いていく水の膜を補い、種のまわりの水を守る', hint: '風がやむまで、区画 10〜12 の水を保つ', enter: () => api.startWind(), done: () => { if (api.wind() === 'done' && !api.windOk() && wet(9, 11)) api.retryWind(); return api.wind() === 'done' && api.windOk(); } },
    { zone: '土の目覚め', text: '種のそばへ行き、目覚めを見とどける', hint: '地図の「種（ゴール）」を押すと、向かえます', done: () => false }   // ここから先は、種のゴール（screen.ts の goalTick）が受け持つ,
  ];
  const el = document.createElement('div'); el.className = 'quest'; document.body.append(el);
  let i = 0, entered = -1, flashT = 0;
  const draw = () => { const s = steps[i]; el.innerHTML = `<small>${s.zone}　<i>${i + 1} / ${steps.length}</i></small><b>${s.text}</b><span>${s.hint}</span>`; };
  draw();
  return {
    get index() { return i; },
    /** active：自分で動いているとき（土の中） */
    update(dt: number, active: boolean) {
      el.classList.toggle('on', active); if (!active) return;
      if (entered !== i) { entered = i; steps[i].enter?.(); }
      if (flashT > 0) { flashT -= dt; if (flashT <= 0) { el.classList.remove('done'); draw(); } return; }
      if (i < steps.length - 1 && steps[i].done()) { i++; el.classList.add('done'); flashT = 1.6; return true; }
      return false;
    },
  };
}

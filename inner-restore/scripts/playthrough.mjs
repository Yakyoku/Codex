// 通しプレイの自動確認（画面版）：本物の操作（移動・視点・浄化・スキャン）だけで、
// 閉塞点を3つともほぐし、区域を治しきって「患者の変化」まで進めるかを確かめる。
//   node scripts/playthrough.mjs
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
const { browser, page, logs } = await launch({ width: 960, height: 540 });
await page.goto(ORIGIN + '/'); await waitReady(page);
await page.evaluate(() => { localStorage.setItem('ir.intro', 'off'); localStorage.setItem('ir.tts', 'off'); window.__begin(); });
const res = await page.evaluate(async () => {
  const st = window.__stage, pos = window.__pos, log = [];
  const go = (x, z, near, fire = false, maxN = 900) => { let n = 0; for (; n < maxN; n++) { const d = Math.hypot(x - pos.x, z - pos.z); if (d < near) break; window.__force = { x: 0, y: 1, yaw: Math.atan2(x - pos.x, z - pos.z), pitch: 0.42, fire }; window.__advance(1); } return n; };
  // 1) スキャンで閉塞点を見つける
  window.__force = { x: 0, y: 0, scan: true, pitch: 0.4 }; window.__advance(40);
  // 2) 近い順に閉塞点へ行き、光を当ててほぐす
  for (let k = 0; k < 3; k++) {
    const left = st.plugs.filter((p) => !p.cleared).sort((a, b) => Math.hypot(a.p.x - pos.x, a.p.z - pos.z) - Math.hypot(b.p.x - pos.x, b.p.z - pos.z));
    if (!left.length) break; const pl = left[0];
    go(pl.p.x, pl.p.z, 9);
    let n = 0; for (; n < 600 && !pl.cleared; n++) { window.__force = { x: 0, y: 0, yaw: Math.atan2(pl.p.x - pos.x, pl.p.z - pos.z), pitch: 0.42, fire: true }; window.__advance(1); }
    log.push({ plug: k, cleared: pl.cleared, frames: n });
  }
  // 3) 区域を往復しながら浄化して、治しきる
  const [W, D] = st.size; let laps = 0;
  for (let row = 0; row < 8 && st.progress() < 1; row++) {
    const z = (-0.36 + row * 0.1) * D; const xs = row % 2 ? [0.4, -0.4] : [-0.4, 0.4];
    for (const fx of xs) { go(fx * W, z, 4, true, 1200); laps++; if (st.progress() >= 1) break; }
  }
  window.__force = { x: 0, y: 0 }; window.__advance(60);
  return { log, laps, progress: st.progress(), plugsLeft: st.plugs.filter((p) => !p.cleared).length, hv: document.querySelector('#hv').textContent, subs: document.querySelector('#subs').textContent, errors: window.__irErrors };
});
const ok = res.progress >= 1 && res.plugsLeft === 0 && !res.errors.length && !logs.errors.length;
console.log(JSON.stringify({ ok, ...res, consoleErrors: [...new Set(logs.errors)].slice(0, 3) }, null, 1));
await browser.close(); process.exit(ok ? 0 : 1);

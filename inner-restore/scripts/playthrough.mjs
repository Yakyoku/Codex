// 通しプレイの自動確認（画面版）：本物の操作（移動・視点・浄化・スキャン）で、ステージ1の3つの区域を順に治しきれるかを確かめる。
//   node scripts/playthrough.mjs [区域の id ...]（省略時は retina lens photo）
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
const zones = process.argv.slice(2).length ? process.argv.slice(2) : ['retina', 'lens', 'photo'];
let allOk = true;
for (const zone of zones) {
  const { browser, page, logs } = await launch({ width: 640, height: 360 });
  await page.goto(ORIGIN + `/?zone=${zone}&noentry&post=off`); await waitReady(page);
  await page.evaluate(() => { localStorage.setItem('ir.intro', 'off'); localStorage.setItem('ir.tts', 'off'); window.__begin(); });
  const res = await page.evaluate(async () => {
    const st = window.__stage, pos = window.__pos, log = [];
    const go = (x, z, near, fire = false, maxN = 900) => { let n = 0; for (; n < maxN; n++) { const d = Math.hypot(x - pos.x, z - pos.z); if (d < near) break; window.__force = { x: 0, y: 1, yaw: Math.atan2(x - pos.x, z - pos.z), pitch: 0.42, fire }; window.__advance(1); } return n; };
    window.__force = { x: 0, y: 0, scan: true, pitch: 0.4 }; window.__advance(40);
    for (let k = 0; k < st.plugs.length; k++) {
      const left = st.plugs.filter((p) => !p.cleared).sort((a, b) => Math.hypot(a.p.x - pos.x, a.p.z - pos.z) - Math.hypot(b.p.x - pos.x, b.p.z - pos.z));
      if (!left.length) break; const pl = left[0];
      go(pl.p.x, pl.p.z, 9, false, 1500);
      let n = 0; for (; n < 900 && !pl.cleared; n++) { window.__force = { x: 0, y: 0, yaw: Math.atan2(pl.p.x - pos.x, pl.p.z - pos.z), pitch: 0.42, fire: true }; window.__advance(1); }
      log.push({ plug: k, cleared: pl.cleared, frames: n });
    }
    const [W, D] = st.size;
    for (let lap = 0; lap < 3 && st.progress() < 1; lap++)
      for (let row = 0; row < 8 && st.progress() < 1; row++) {
        const z = (-0.36 + row * 0.1) * D; const xs = row % 2 ? [0.4, -0.4] : [-0.4, 0.4];
        for (const fx of xs) { go(fx * W, z, 4, true, 1500); if (st.progress() >= 1) break; }
      }
    window.__force = { x: 0, y: 0 }; window.__advance(60);
    return { log, progress: +st.progress().toFixed(3), plugsLeft: st.plugs.filter((p) => !p.cleared).length, subs: document.querySelector('#subs').textContent, errors: window.__irErrors };
  });
  const ok = res.progress >= 1 && res.plugsLeft === 0 && !res.errors.length && !logs.errors.length;
  allOk &&= ok;
  console.log(JSON.stringify({ zone, ok, ...res, consoleErrors: [...new Set(logs.errors)].slice(0, 3) }));
  await browser.close();
}
process.exit(allOk ? 0 : 1);

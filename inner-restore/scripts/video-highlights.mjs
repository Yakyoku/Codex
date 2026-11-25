// 見どころの動画：3つの区域それぞれで「スキャン → 塊に光を当ててほぐす → まわりが治る」を、本物の操作で自動再生し、1コマずつ撮ってつなぐ。
//   node scripts/video-highlights.mjs <出力.mp4> [区域…]（省略時 retina lens photo）
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const [out, ...zs] = process.argv.slice(2); const zones = zs.length ? zs : ['retina', 'lens', 'photo'];
const dir = out + '.frames'; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
let k = 0;
for (const zone of zones) {
  const { browser, page } = await launch({ width: 640, height: 360, initScripts: [`try { localStorage.setItem('ir.intro', 'off'); localStorage.setItem('ir.vb', 'off'); localStorage.setItem('ir.voice', JSON.stringify({ on: false, subs: true })); } catch (e) {}`] });
  await page.goto(ORIGIN + `/?zone=${zone}&noentry&post=off`); await waitReady(page, '__irReady', 300000);
  await page.evaluate(() => window.__begin());
  const shot = async () => { const f = await page.evaluate(() => window.__irFrames); await page.waitForFunction((f0) => window.__irFrames >= f0 + 1, f, { timeout: 120000 }); await page.screenshot({ path: `${dir}/f${String(k++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 88, timeout: 120000 }); };
  // 操作：plan の各段を、3コマ進めるごとに1枚撮る
  const run = async (n, fn) => { for (let i = 0; i < n; i++) { await page.evaluate(fn); await shot(); } };
  await run(12, () => { const p = window.__pos, pl = window.__stage.plugs.find((x) => !x.cleared); window.__force = { x: 0, y: 0.8, yaw: Math.atan2(pl.p.x - p.x, pl.p.z - p.z), pitch: 0.4, scan: true }; window.__advance(3); });
  await run(14, () => { const p = window.__pos, pl = window.__stage.plugs.find((x) => !x.cleared) ?? window.__stage.plugs[0]; const d = Math.hypot(pl.p.x - p.x, pl.p.z - p.z); window.__force = { x: 0, y: d > 9 ? 1 : 0, yaw: Math.atan2(pl.p.x - p.x, pl.p.z - p.z), pitch: 0.42 }; window.__advance(12); });
  await run(22, () => { const p = window.__pos, pl = window.__stage.plugs[0]; window.__force = { x: 0, y: 0, yaw: Math.atan2(pl.p.x - p.x, pl.p.z - p.z), pitch: 0.42, fire: true }; window.__advance(6); });
  await run(14, () => { window.__force = { x: 0.5, y: 0.3, pitch: 0.38, fire: true }; window.__advance(8); });
  await browser.close(); console.log(zone, 'frames', k);
}
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '6', '-i', `${dir}/f%05d.jpg`, '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '26', '-movflags', '+faststart', out]);
console.log('done', out, fs.statSync(out).size);

// プレイ動画：時間を一定の刻みで進めながら1コマずつ撮り、ffmpeg でつなぐ（この環境の描画は遅いため）
//   node scripts/video.mjs <出力.mp4> [秒=30] [fps=10] [幅=640] [高さ=360]
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const [out, sec = '30', fps = '10', w = '640', h = '360', from = '1'] = process.argv.slice(2);
const dir = out + '.frames'; fs.mkdirSync(dir, { recursive: true });
const { browser, page, logs } = await launch({ width: +w, height: +h });
await page.goto(ORIGIN + `/?backend=webgl&sim=${from}`); await waitReady(page, '__irReady', 300000);
const n = Math.round(+sec * +fps), stepN = Math.round(30 / +fps);
for (let i = 0; i < n; i++) {
  const f = await page.evaluate((k) => { window.__advance(k); return window.__irFrames; }, stepN);
  await page.waitForFunction((f0) => window.__irFrames >= f0 + 1, f, { timeout: 120000 });
  await page.screenshot({ path: `${dir}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 90, timeout: 120000 });
  if (i % 20 === 0) console.log('frame', i, '/', n);
}
await browser.close();
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', fps, '-i', `${dir}/f%04d.jpg`, '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '24', '-movflags', '+faststart', out]);
console.log('done', out, fs.statSync(out).size, 'errors', [...new Set(logs.errors)].length);

// プレイ動画を作る：時間を一定の刻みで進めながら1コマずつ撮り、ffmpeg でつなげる。
//   node scripts/video.mjs <出力名> [fps=12] [幅=640] [高さ=360]
import { mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const [name = 'm1', fps = '12', w = '640', h = '360'] = process.argv.slice(2);
const dir = new URL('../build-cache/frames/', import.meta.url).pathname; rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
const browser = await launch('webgl2');
const { page, logs } = await openPage(browser, { viewport: { width: +w, height: +h } });
await page.goto(ORIGIN + '/?manual&clean&renderer=webgl2&grow=24');
await waitReady(page, 'ready', 400000);
const SOIL = 24, SURF = 26, dt = 1000 / +fps; let n = 0, ms = 100;
const shoot = async () => { await page.screenshot({ path: `${dir}f${String(n++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 90, timeout: 120000 }); };
await page.evaluate(() => window.__demo());
for (let i = 0; i < SOIL * +fps; i++) { ms += dt; await page.evaluate((t) => window.__frame(t), ms); await shoot(); if (i % 10 === 0) console.log('soil', i, new Date().toISOString().slice(11, 19)); }
await page.evaluate(() => window.__switch('surface'));
for (let i = 0; i < SURF * +fps; i++) { ms += dt; await page.evaluate((t) => window.__frame(t), ms); await shoot(); if (i % 10 === 0) console.log('surface', i, new Date().toISOString().slice(11, 19)); }
await browser.close();
const out = new URL(`../public/progress/${name}.mp4`, import.meta.url).pathname;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', fps, '-i', `${dir}f%05d.jpg`, '-vf', 'minterpolate=fps=24:mi_mode=blend', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', out]);
console.log('video', out, n, 'frames', 'errors=', JSON.stringify(logs.errors.slice(0, 3)));

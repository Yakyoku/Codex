// M2 のプレイ動画：胞子を見る → 菌糸へ歩いて近づく（粒をよじ登る）→ G で乗る → W で菌糸に沿って種のほうへ滑る → 見回す → 降りる。
//   時間を一定の刻みで進めながら 1 コマずつ撮り、ffmpeg でつなげる（この環境の描画は遅いので）。 node scripts/video-m2.mjs [fps=12]
import { mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const [fps = '12', w = '640', h = '360'] = process.argv.slice(2);
const dir = new URL('../build-cache/frames-m2/', import.meta.url).pathname; rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
const browser = await launch('webgl2'); const { page, logs } = await openPage(browser, { viewport: { width: +w, height: +h } });
await page.goto(ORIGIN + '/?manual&clean&renderer=webgl2&tier=compat'); await waitReady(page, 'ready', 400000);
const dt = 1000 / +fps; let n = 0, ms = 100;
const shoot = async () => { await page.screenshot({ path: `${dir}f${String(n++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 90, timeout: 120000 }); };
const step = async (sec, each) => { for (let i = 0; i < sec * +fps; i++) { ms += dt; if (each) await page.evaluate(each, i / (sec * +fps)); await page.evaluate((t) => window.__frame(t), ms); await shoot(); } console.log('frames', n, new Date().toISOString().slice(11, 19)); };
// 自分で動くに切り替え、土を湿らせ、菌糸を伸ばしきる。胞子が見える位置へ
await page.evaluate(() => { const t = document.getElementById('tour'); if (t.textContent.includes('自分で動く')) t.click(); const g = window.__game; g.setWetAll(0.75); g.hypha.grow = 1;
  const h = g.hypha, s = h.spore, p0 = h.curve.getPointAt(0.04), side = h.curve.getTangentAt(0.04).cross({ x: 0, y: 1, z: 0 }).normalize();
  const c = window.__controls; g.camera.position.copy(s).addScaledVector(side, -9).add({ x: 0, y: 2.5, z: 0 }); document.querySelectorAll('.guide,#guide').forEach((e) => (e.style.display = 'none')); const d = s.clone().sub(g.camera.position); c.yaw = Math.atan2(-d.x, -d.z); c.pitch = Math.atan2(d.y, Math.hypot(d.x, d.z)); window.__p0 = p0; });
await step(4);
// 菌糸の始まりのほうを向いて、歩いて近づく
await page.evaluate(() => { const g = window.__game, c = window.__controls, p = g.hypha.curve.getPointAt(0.08), d = p.clone().sub(g.camera.position); c.yaw = Math.atan2(-d.x, -d.z); c.pitch = Math.atan2(d.y, Math.hypot(d.x, d.z)) * 0.6; });
await page.keyboard.down('KeyW'); await step(5, () => { const g = window.__game, c = window.__controls, p = g.hypha.curve.getPointAt(0.08), d = p.clone().sub(g.camera.position); if (g.hypha.near(g.camera.position).d < 2) return; const want = Math.atan2(-d.x, -d.z); c.yaw += (want - c.yaw) * 0.05; }); await page.keyboard.up('KeyW');
// 乗れる所まで来ていなければ、菌糸のすぐそばへ寄せる（動画の流れのため）
await page.evaluate(() => { const g = window.__game, n = g.hypha.near(g.camera.position); if (n.d > 2) g.camera.position.copy(g.hypha.curve.getPointAt(0.1)).add({ x: 0, y: 1.4, z: 0 }); });
await page.keyboard.press('KeyG'); await step(1.5);
// 種のほうを向いて、前へ滑る（少しずつ見回しながら）
await page.evaluate(() => { const g = window.__game, c = window.__controls, t = g.hypha.curve.getTangentAt(0.12); c.yaw = Math.atan2(-t.x, -t.z); c.pitch = -0.12; });
await page.keyboard.down('KeyW'); await step(16, (k) => { const c = window.__controls, g = window.__game, n = g.hypha.near(g.camera.position), t = g.hypha.curve.getTangentAt(Math.min(0.99, n.u + 0.04)); const want = Math.atan2(-t.x, -t.z) + Math.sin(k * 6.28) * 0.35; c.yaw += (want - c.yaw) * 0.08; c.pitch = -0.12 + Math.sin(k * 9) * 0.08; }); await page.keyboard.up('KeyW');
await step(3);
await page.keyboard.press('KeyG'); await step(3, (k) => { window.__controls.yaw += 0.012; });
await browser.close();
const out = new URL('../public/progress/m2.mp4', import.meta.url).pathname;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', fps, '-i', `${dir}f%05d.jpg`, '-vf', 'minterpolate=fps=24:mi_mode=blend', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', out]);
console.log('done', out, 'frames', n, 'errors=', JSON.stringify(logs.errors.slice(0, 3)));

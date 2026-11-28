// 菌糸を滑る（M2）の確認：菌糸のそばへ行く → 「菌糸に乗る」が出る → G で乗る → W で滑る（速く進む）→ G で降りる。ゲームパッドの LB とタッチのボタンも同じ動き
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const browser = await launch('webgl2'); const { page, logs } = await openPage(browser, { viewport: { width: 640, height: 360 } });
await page.goto(ORIGIN + '/?nopost&renderer=webgl2&tier=compat&scene=soil&fast=6'); await waitReady(page, 'ready', 400000);
const ev = (f, a) => page.evaluate(f, a); const steps = []; const ok = (n, v) => { steps.push(`${v ? 'OK ' : 'NG '} ${n}`); return v; };
await ev(() => { if (document.getElementById('tour').textContent.includes('自分で動く')) document.getElementById('tour').click(); });
await page.waitForTimeout(1000);
await ev(() => { const g = window.__game, h = g.hypha; h.grow = 1; const p = h.curve.getPointAt(0.3); g.camera.position.copy(p).add({ x: 0, y: 1.6, z: 0 }); });
await page.waitForTimeout(1500);
ok('菌糸のそばで「菌糸に乗る」が出る', await ev(() => document.getElementById('rideBtn').classList.contains('near')));
await page.keyboard.press('KeyG'); await page.waitForTimeout(500);
ok('G で乗る', await ev(() => window.__controls.riding));
const u0 = await ev(() => window.__game.hypha.near(window.__game.camera.position).u);
// 菌糸の先（種）の方を向いてから、前へ
await ev(() => { const g = window.__game, c = window.__controls, t = g.hypha.curve.getTangentAt(0.3); c.yaw = Math.atan2(-t.x, -t.z); c.pitch = 0; });
await page.keyboard.down('KeyW'); await page.waitForTimeout(6000); const sp = await ev(() => window.__controls.rideSpeed); await page.keyboard.up('KeyW'); await page.waitForTimeout(800);
const u1 = await ev(() => window.__game.hypha.near(window.__game.camera.position).u), d1 = await ev(() => window.__game.hypha.near(window.__game.camera.position).d);
console.log('u', u0.toFixed(3), '→', u1.toFixed(3), 'speed', sp.toFixed(1), 'dist', d1.toFixed(2));
ok('W で菌糸に沿って進む（種のほうへ）', u1 > u0 + 0.05);
ok('菌糸の上にいる（表面から 1.5 以内）', d1 < 1.5);
await page.keyboard.press('KeyG'); await page.waitForTimeout(500);
ok('G で降りる', !(await ev(() => window.__controls.riding)));
await ev(() => document.getElementById('rideBtn').click()); await page.waitForTimeout(300);
ok('画面のボタン（タッチ）でも乗れる', await ev(() => window.__controls.riding)); await ev(() => document.getElementById('rideBtn').click());
console.log(steps.join('\n')); console.log('errors=', JSON.stringify(logs.errors.slice(0, 3)));
await browser.close(); process.exit(steps.some((s) => s.startsWith('NG')) || logs.errors.length ? 1 : 0);

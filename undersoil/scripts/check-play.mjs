// 通しの自動確認（M3）：自分で動く → 水を運ぶ → 水の橋 → 乾きの風 → 種のゴール → 地上の発芽 → 結果の画面 まで、エラーなく進むか。
//   node scripts/check-play.mjs      （この環境の描画は遅いので、?fast= で時間を早回しする。10 分ほどかかる）
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const browser = await launch('webgl2'); const { page, logs } = await openPage(browser, { viewport: { width: 480, height: 270 } });
await page.goto(ORIGIN + '/?nopost&renderer=webgl2&scene=soil&tier=compat&fast=25'); await waitReady(page, 'ready', 400000);
const ev = (f, a) => page.evaluate(f, a); const steps = []; const ok = (name, v) => { steps.push(`${v ? 'OK ' : 'NG '} ${name}`); return v; };
const until = async (f, ms, a) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await ev(f, a)) return true; await page.waitForTimeout(1500); } return false; };
await ev(() => document.getElementById('tour').click()); await page.waitForTimeout(2000);
const pour = (c) => ev((c) => { const g = window.__game, b = document.getElementById('waterBtn'); g.camera.position.copy(g.world.cellCenter(0)); b.click(); g.camera.position.copy(g.world.cellCenter(c)); b.click(); b.click(); }, c);
for (let c = 0; c < 6; c++) { await pour(c); await page.waitForTimeout(800); }
ok('水をくんでまく（6 区画）', await ev(() => window.__game.world.grid.cells.slice(0, 6).every((c) => c.water > 0.3)));
ok('水の橋がつながる', await ev(() => window.__game.world.grid.links.slice(0, 5).every((s, i) => s.has(i + 1))));
ok('乾きの風が始まる', await until(() => document.querySelector('.wind').classList.contains('on'), 60000));
ok('乾きの風が終わる', await until(() => !document.querySelector('.wind').classList.contains('on'), 240000));
for (let c = 0; c < 12; c++) { await pour(c); await page.waitForTimeout(500); }
ok('12 区画すべてに水', await ev(() => window.__game.world.grid.cells.every((c) => c.water > 0.3)));
ok('種が目覚める', await until(() => window.__game.wake > 0.5, 120000));
await ev(() => { const g = window.__game; g.camera.position.copy(g.seed.position).add({ x: -70, y: 2, z: 0 }); });
ok('ゴールの知らせ', await until(() => document.querySelector('.goal').classList.contains('on') || document.body.classList.contains('surface'), 60000));
ok('地上の場面へ', await until(() => document.body.classList.contains('surface'), 120000));
ok('結果の画面', await until(() => !!document.querySelector('dialog.result')?.open, 240000));
const res = await ev(() => document.querySelector('dialog.result')?.textContent?.replace(/\s+/g, ' ').slice(0, 160));
console.log(steps.join('\n')); console.log('結果:', res); console.log('errors=', JSON.stringify(logs.errors.slice(0, 5)), '404=', JSON.stringify(logs.notFound));
await browser.close(); process.exit(steps.some((s) => s.startsWith('NG')) || logs.errors.length ? 1 : 0);

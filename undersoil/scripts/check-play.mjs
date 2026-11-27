// 通しの自動確認（M3）：自分で動く → 水を運ぶ → 水の橋 → 乾きの風 → 種のゴール → 地上の発芽 → 結果の画面 まで、エラーなく進むか。
//   node scripts/check-play.mjs      （この環境の描画は遅いので、?fast= で時間を早回しする。10 分ほどかかる）
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const browser = await launch('webgl2'); const { page, logs } = await openPage(browser, { viewport: { width: 480, height: 270 } });
await page.goto(ORIGIN + '/?nopost&renderer=webgl2&scene=soil&tier=compat&fast=25'); await waitReady(page, 'ready', 400000);
const ev = (f, a) => page.evaluate(f, a); const steps = []; const ok = (name, v) => { steps.push(`${v ? 'OK ' : 'NG '} ${name}`); return v; };
const until = async (f, ms, a) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await ev(f, a)) return true; await page.waitForTimeout(1500); } return false; };
await ev(() => document.getElementById('tour').click()); await page.waitForTimeout(2000);
const pour = (c) => ev((c) => { const g = window.__game, b = document.getElementById('waterBtn'); g.camera.position.copy(g.world.cellCenter(0)); b.click(); g.camera.position.copy(g.world.cellCenter(c)); b.click(); b.click(); }, c);
const step = () => ev(() => document.querySelector('.quest small i')?.textContent ?? '');
await ev(() => document.getElementById('scanBtn').click());
ok('道しるべ 1：スキャン', await until(() => document.querySelector('.quest small i')?.textContent.startsWith('2'), 30000));
for (let c = 0; c < 2; c++) { await pour(c); await page.waitForTimeout(600); }
ok('道しるべ 2：水の橋を 1 本', await until(() => document.querySelector('.quest small i')?.textContent.startsWith('3'), 30000));
for (let c = 2; c < 5; c++) { await pour(c); await page.waitForTimeout(600); }
ok('道しるべ 3：区域 A の細菌が目覚める', await until(() => document.querySelector('.quest small i')?.textContent.startsWith('4'), 120000));
await ev(() => { const g = window.__game; g.camera.position.copy(g.world.cellCenter(3)); document.getElementById('sugarBtn').click(); });
ok('道しるべ 4：糖のしずく', await until(() => document.querySelector('.quest small i')?.textContent.startsWith('5'), 30000));
for (let c = 5; c < 9; c++) { await pour(c); await page.waitForTimeout(600); }
ok('道しるべ 5：区域 B まで橋をつなぐ', await until(() => document.querySelector('.quest small i')?.textContent.startsWith('6'), 60000));
for (let c = 9; c < 12; c++) { await pour(c); await page.waitForTimeout(600); }
ok('道しるべ 6：種の岸まで水', await until(() => document.querySelector('.quest small i')?.textContent.startsWith('7'), 60000));
ok('乾きの風が始まる', await until(() => document.querySelector('.wind').classList.contains('on'), 60000));
// 風の間、種のまわり（区画 10〜12）に水を補いつづける
let windDone = false; for (let k = 0; k < 40 && !windDone; k++) { for (const c of [9, 10, 11]) await pour(c); await page.waitForTimeout(1200); windDone = await ev(() => !document.querySelector('.wind').classList.contains('on')); }
ok('乾きの風が終わる', windDone);
ok('道しるべ 7：風を乗りきる', await until(() => document.querySelector('.quest small i')?.textContent.startsWith('8'), 60000));
console.log('step', await step());
for (let c = 0; c < 12; c++) { await pour(c); await page.waitForTimeout(400); }
ok('種が目覚める', await until(() => window.__game.wake > 0.5, 120000));
await ev(() => { const g = window.__game; g.camera.position.copy(g.seed.position).add({ x: -70, y: 2, z: 0 }); });
ok('ゴールの知らせ', await until(() => document.querySelector('.goal').classList.contains('on') || document.body.classList.contains('surface'), 60000));
ok('地上の場面へ', await until(() => document.body.classList.contains('surface'), 120000));
ok('結果の画面', await until(() => !!document.querySelector('dialog.result')?.open, 240000));
const res = await ev(() => document.querySelector('dialog.result')?.textContent?.replace(/\s+/g, ' ').slice(0, 160));
console.log(steps.join('\n')); console.log('結果:', res); console.log('errors=', JSON.stringify(logs.errors.slice(0, 5)), '404=', JSON.stringify(logs.notFound));
await browser.close(); process.exit(steps.some((s) => s.startsWith('NG')) || logs.errors.length ? 1 : 0);

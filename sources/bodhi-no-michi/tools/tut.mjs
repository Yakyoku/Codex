// 自動操作で通し確認。 使い方: node tools/play.mjs '<query>' <秒> [w] [h] — 5秒ごとに状態を出し、最後に画面写真
import { createRequire } from 'node:module';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright/index.js');
const [query = '?auto=begin&bot=1', secs = '120', w = '480', h = '270', outPrefix = '.shots/play'] = process.argv.slice(2);
const root = new URL('../../../games/bodhi-no-michi/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.bin': 'application/octet-stream', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, hasTouch: true });
const errs = new Set();
page.on('console', m => { if (m.type() === 'error') errs.add(m.text().slice(0, 300)); });
page.on('pageerror', e => errs.add('pageerror: ' + e.message));
await page.route('http://game.local/**', route => {
  let p = new URL(route.request().url()).pathname; if (p.endsWith('/')) p += 'index.html';
  const f = join(root, p);
  if (!existsSync(f)) return route.fulfill({ status: 404, body: 'nf' });
  route.fulfill({ status: 200, contentType: types[extname(f)] || 'application/octet-stream', body: readFileSync(f) });
});
await page.goto('http://game.local/' + query);
mkdirSync('.shots', { recursive: true });
const st = () => page.evaluate('({ mode: window.__game.game.mode, tut: window.__game.game.tut, cue: window.__game.game.cue(), stats: window.__game.game.stats, inka: +window.__game.game.inka.toFixed(2) })');
await page.waitForFunction('window.__game', null, { timeout: 120000 });
await page.keyboard.down('KeyW');
for (let i = 0; i < 120; i++) { await page.waitForTimeout(500); const s = await st(); if (s.mode !== 'explore') break; if (i % 10 === 0) console.log('walk', JSON.stringify(await page.evaluate('window.__game.state().pos'))); }
await page.keyboard.up('KeyW');
let shots = 0;
for (let i = 0; i < 400 && shots < 4; i++) {
  if (i % 10 === 0) console.log('t', i, JSON.stringify(await st()).slice(0, 160));
  await page.waitForTimeout(400);
  // 図鑑・遊び方の画面を閉じる
  await page.evaluate(`(() => { const go = document.querySelector('.bd-howto.is-on .bd-howto-go'); if (go) go.click(); const cl = [...document.querySelectorAll('#ui button, #ui [role=button]')].find(e => /閉じる/.test(e.textContent) && e.offsetParent); if (cl) cl.click(); })()`);
  const s = await st();
  if (s.tut === 'parry' && shots === 0) { await page.waitForTimeout(1500); await page.screenshot({ path: outPrefix + '-1-parry.png' }); shots = 1; console.log('tut parry', JSON.stringify(s.cue)); await page.keyboard.down('KeyL'); await page.waitForTimeout(1200); await page.keyboard.up('KeyL'); }
  else if (s.tut === 'counter' && shots === 1) { await page.waitForTimeout(1500); await page.screenshot({ path: outPrefix + '-2-counter.png' }); shots = 2; console.log('tut counter', JSON.stringify(s.cue)); await page.keyboard.press('KeyJ'); await page.waitForTimeout(700); await page.screenshot({ path: outPrefix + '-3-after.png' }); shots = 3; console.log('after', JSON.stringify(await st())); }
  else if (shots === 3 && s.cue && s.cue.text === '構えた') { await page.waitForTimeout(300); await page.screenshot({ path: outPrefix + '-4-ring.png' }); shots = 4; console.log('ring', JSON.stringify(s.cue)); }
}
if (errs.size) console.log('ERRORS:\n' + [...errs].join('\n'));
await browser.close();

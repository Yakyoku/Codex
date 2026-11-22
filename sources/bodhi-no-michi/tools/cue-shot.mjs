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
const want = new Set(['受ける！', '構えた', '攻める', '近づく', '待つ']); const got = new Set();
for (let t = 0; t < +secs * 2 && got.size < 3; t++) {
  await page.waitForTimeout(500);
  const c = await page.evaluate('window.__game && window.__game.game.cue()');
  if (c && want.has(c.text) && !got.has(c.text)) { got.add(c.text); await page.screenshot({ path: `${outPrefix}-${got.size}.png` }); console.log('cue', c.text, c.action); }
}
if (errs.size) console.log('ERRORS:\n' + [...errs].join('\n'));
await browser.close();

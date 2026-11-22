// 画面写真を撮る（サーバーは立てず、ビルド結果をブラウザの通信横取りで配る）。
// 使い方: node tools/shots.mjs '<query>' <out.png> [w] [h] [waitMs] [dpr] [jsEval]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright/index.js');
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
const [query = '', out = '.shots/out.png', w = '1280', h = '720', wait = '2500', dpr = '1', js = ''] = process.argv.slice(2);
const root = new URL('../../../games/bodhi-no-michi/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.bin': 'application/octet-stream', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr, hasTouch: !!process.env.TOUCH });
const errs = [];
page.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !/GPU stall|GL_CLOSE_PATH/.test(m.text())) errs.push(m.type() + ': ' + m.text().slice(0,600)); });
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
await page.route('http://game.local/**', route => {
  let p = new URL(route.request().url()).pathname; if (p.endsWith('/')) p += 'index.html';
  const f = join(root, p);
  if (!existsSync(f)) return route.fulfill({ status: 404, body: 'nf' });
  route.fulfill({ status: 200, contentType: types[extname(f)] || 'application/octet-stream', body: readFileSync(f) });
});
await page.goto('http://game.local/' + query);
await page.waitForTimeout(+wait);
if (js) console.log('eval:', JSON.stringify(await page.evaluate(js)));
mkdirSync(dirname(out), { recursive: true });
await page.screenshot({ path: out });
if (errs.length) console.log(errs.slice(0, 4).join('\n'));
await browser.close();

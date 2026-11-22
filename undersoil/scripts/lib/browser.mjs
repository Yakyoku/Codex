// Playwright で dist/ を仮の https の住所から読み込ませる（ローカルの Web サーバーは立てない）
import { createRequire } from 'node:module';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node-tools/node_modules/playwright'); }
export const ORIGIN = 'https://undersoil.test';
export const DIST = process.env.DIST_DIR ?? new URL('../../dist/', import.meta.url).pathname;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.bin': 'application/octet-stream', '.ktx2': 'image/ktx2' };

/** mode: 'webgl2'（絵の確認用。ソフトウェア描画）| 'webgpu'（エラーなく動くかの確認用） */
export async function launch(mode = 'webgl2') {
  const args = ['--no-sandbox', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--autoplay-policy=no-user-gesture-required'];
  if (mode === 'webgpu') args.push('--enable-unsafe-webgpu', '--enable-features=Vulkan,WebGPU', '--use-webgpu-adapter=swiftshader');
  return pw.chromium.launch({ headless: true, args });
}

export async function openPage(browser, opts = {}) {
  const ctx = await browser.newContext({ viewport: opts.viewport ?? { width: 1280, height: 720 }, deviceScaleFactor: opts.dpr ?? 1, userAgent: opts.userAgent, hasTouch: !!opts.touch, isMobile: !!opts.touch });
  const page = await ctx.newPage();
  const logs = { errors: [], warnings: [], notFound: [] };
  page.on('console', (m) => { if (m.type() === 'error') logs.errors.push(m.text()); else if (m.type() === 'warning') logs.warnings.push(m.text()); });
  page.on('pageerror', (e) => logs.errors.push('pageerror: ' + e.message));
  if (opts.initScript) await page.addInitScript(opts.initScript);
  await ctx.route(ORIGIN + '/**', (route) => {
    let p = decodeURIComponent(new URL(route.request().url()).pathname);
    if (p.endsWith('/')) p += 'index.html';
    let f = join(DIST, normalize(p));
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
    if (!f.startsWith(DIST) || !existsSync(f)) { logs.notFound.push(p); return route.fulfill({ status: 404, body: 'not found' }); }
    route.fulfill({ status: 200, body: readFileSync(f), headers: { 'content-type': MIME[extname(f)] ?? 'application/octet-stream', 'cache-control': 'no-store' } });
  });
  return { ctx, page, logs };
}

export async function waitReady(page, key = 'ready', timeout = 90000) {
  await page.waitForFunction((k) => window.__state && (window.__state[k] || window.__state.failed), key, { timeout });
  return page.evaluate(() => window.__state);
}

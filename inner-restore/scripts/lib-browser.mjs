// Playwright でビルド結果（dist）を仮の https の住所から読み込ませる。ローカルの Web サーバーは立てない。
import { createRequire } from 'node:module';
import fs from 'node:fs'; import path from 'node:path';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node-tools/node_modules/playwright'); }
export const ORIGIN = 'https://ir.test';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.glb': 'model/gltf-binary', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.wasm': 'application/wasm', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
export const DIST = path.resolve(import.meta.dirname, '..', 'dist');

export async function launch({ webgpu = false, width = 1280, height = 720, dsf = 1, extraArgs = [], initScripts = [] } = {}) {
  const args = ['--use-angle=swiftshader', '--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', ...extraArgs];
  if (webgpu) args.push('--enable-unsafe-webgpu', '--enable-features=Vulkan,WebGPU', '--use-vulkan=swiftshader', '--use-webgpu-adapter=swiftshader');
  const browser = await pw.chromium.launch({ args });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf, ignoreHTTPSErrors: true });
  for (const s of initScripts) await ctx.addInitScript(s);
  await ctx.route(ORIGIN + '/**', async (route) => {
    const u = new URL(route.request().url());
    let p = path.join(DIST, decodeURIComponent(u.pathname));
    if (p.endsWith(path.sep) || (fs.existsSync(p) && fs.statSync(p).isDirectory())) p = path.join(p, 'index.html');
    if (!p.startsWith(DIST) || !fs.existsSync(p)) return route.fulfill({ status: 404, body: 'not found' });
    route.fulfill({ status: 200, contentType: MIME[path.extname(p)] ?? 'application/octet-stream', body: fs.readFileSync(p) });
  });
  const page = await ctx.newPage();
  const logs = { errors: [], warnings: [] };
  page.on('console', (m) => { if (m.type() === 'error') logs.errors.push(m.text()); else if (m.type() === 'warning') logs.warnings.push(m.text()); });
  page.on('pageerror', (e) => logs.errors.push('pageerror: ' + e.message));
  return { browser, ctx, page, logs };
}
export async function waitReady(page, key = '__irReady', timeout = 90000) {
  await page.waitForFunction((k) => !!window[k], key, { timeout });
  return page.evaluate((k) => window[k], key);
}

// 第1部の確認：画面版・VR 版・診断を WebGL 2 と WebGPU で開き、エラーの有無と絵を確かめる
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
import fs from 'node:fs';
const out = process.argv[2] || 'shots'; fs.mkdirSync(out, { recursive: true });
const results = [];
for (const webgpu of [false, true]) {
  for (const [name, url, key] of [['main', '/?t=3', '__irReady'], ['vr', '/vr/', '__irReady'], ['diag', '/diag/?quick', '__irDiag']]) {
    const { browser, page, logs } = await launch({ webgpu });
    const q = url.includes('?') ? '&' : '?';
    let info = null, err = null;
    try {
      await page.goto(ORIGIN + url + q + 'backend=' + (webgpu ? 'webgpu' : 'webgl'));
      info = await waitReady(page, key);
      await page.waitForFunction(() => (window.__irFrames || 0) > 5 || !!window.__irDiag, null, { timeout: 60000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${out}/${name}-${webgpu ? 'webgpu' : 'webgl2'}.png` });
    } catch (e) { err = String(e).slice(0, 300); }
    const pageErrors = await page.evaluate(() => window.__irErrors || []).catch(() => []);
    results.push({ page: name, mode: webgpu ? 'WebGPU' : 'WebGL 2', info, err, consoleErrors: logs.errors, pageErrors, warnings: logs.warnings.slice(0, 4) });
    await browser.close();
  }
}
console.log(JSON.stringify(results, null, 1));

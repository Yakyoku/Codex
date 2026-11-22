// 1枚撮る： node scripts/shot.mjs <出力.png> "<パスとクエリ>" [幅] [高さ] [webgpu]
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
const [out, url = '/', w = '1280', h = '720', mode = ''] = process.argv.slice(2);
const { browser, page, logs } = await launch({ webgpu: mode === 'webgpu', width: +w, height: +h });
const frames = /[?&]frames=/.test(url);
await page.goto(ORIGIN + url);
try {
  await waitReady(page);
  await page.waitForFunction((f) => f ? !!window.__irDone : (window.__irFrames || 0) > 3, frames, { timeout: 240000 });
  await page.waitForTimeout(400);
} catch (e) { console.log('ERR', String(e).slice(0, 200)); }
await page.screenshot({ path: out, timeout: 180000 });
const errs = [...new Set([...logs.errors, ...(await page.evaluate(() => window.__irErrors || []))])];
console.log(out, errs.length ? 'ERRORS ' + JSON.stringify(errs.slice(0, 5)) : 'エラー0', [...new Set(logs.warnings)].filter((x) => !/ReadPixels/.test(x)).slice(0, 4));
await browser.close();

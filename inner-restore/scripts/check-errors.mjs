// 全区域・全ページのコンソールのエラーを数える（指示書「コンソールのエラーをゼロにする」）。
//   npm run build のあとに node scripts/check-errors.mjs [区域 …]（vite build だけだと進捗ページが無く 404 になる）
//   → 画面版（区域を始めて少し動かし、スキャンする）と VR 版（区域を読み込む）、タイトル・診断・進捗
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
const all = ['retina', 'lens', 'photo', 'cilia', 'mucus', 'olfactory', 'bronchiole', 'alveolus', 'alvwall', 'villi', 'colon', 'crypt', 'valve', 'plaque', 'clot', 'endo', 'myo', 'scar', 'bbb', 'cortex', 'amyloid'];
const zones = process.argv.slice(2).length ? process.argv.slice(2) : all;
let bad = 0;
const report = (name, logs) => { const e = logs.errors.filter((t) => !/favicon/.test(t)); if (e.length) bad++; console.log(JSON.stringify({ page: name, errors: e.slice(0, 4), n: e.length, warnings: logs.warnings.length })); };
{ const { browser, page, logs } = await launch({ width: 960, height: 540 });
  for (const path of ['/', '/diag/', '/progress/']) { await page.goto(ORIGIN + path); await page.waitForTimeout(4000); }
  report('title・diag・progress', logs); await browser.close(); }
for (const z of zones) {
  const { browser, page, logs } = await launch({ width: 640, height: 360 });
  await page.goto(ORIGIN + `/?zone=${z}&noentry&post=off`); await waitReady(page);
  await page.evaluate(() => { localStorage.setItem('ir.intro', 'off'); window.__begin?.(); window.__force = { x: 0.3, y: 0.6, pitch: 0.1 }; window.__advance?.(30); window.__force = { x: 0, y: 0, pitch: 0.1, scan: true }; window.__advance?.(20); });
  report('screen:' + z, logs); logs.errors.length = 0; logs.warnings.length = 0;
  await page.goto(ORIGIN + `/vr/?zone=${z}`); await waitReady(page, '__irReady', 240000);
  report('vr:' + z, logs); await browser.close();
}
console.log(bad ? `NG ${bad}` : 'OK 0 errors');

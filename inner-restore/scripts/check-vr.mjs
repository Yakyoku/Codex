// VR の自動確認：Meta の WebXR エミュレーター（iwer）で Quest 3 を模擬し、VR に入る→見回す→歩く→浄化、までを確かめる
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
import fs from 'node:fs'; import path from 'node:path';
const out = process.argv[2] || 'shots'; fs.mkdirSync(out, { recursive: true });
const iwer = fs.readFileSync(path.resolve(import.meta.dirname, '../node_modules/iwer/build/iwer.min.js'), 'utf8');
const { browser, page, logs } = await launch({ width: 960, height: 540, initScripts: [`/* 確認用の回避：iwer は描画先として null（画面）を返すが、three r187 はそれを WeakMap のキーにして落ちる。実機では実体のある描画先が返る */
  { const S = {}; for (const m of ['set', 'get', 'has', 'delete']) { const o = WeakMap.prototype[m]; WeakMap.prototype[m] = function (k, ...a) { return o.call(this, k === null ? S : k, ...a); }; } }`, iwer + `;window.__xrd = new IWER.XRDevice(IWER.metaQuest3); window.__xrd.installRuntime({ forceInstall: true, polyfillLayers: true }); window.__xrd.position.set(0,1.6,0);`] });
await page.goto(ORIGIN + '/vr/?xrscale=0.2');
const info = await waitReady(page, '__irReady', 240000);
await page.click('#entervr');
await page.waitForFunction(() => window.__irXR === true, null, { timeout: 60000 });
const f0 = await page.evaluate(() => window.__irFrames);
// 見回す → 左スティックで前進 → 右トリガーで足もとの先を浄化
await page.evaluate(() => { const d = window.__xrd; d.quaternion.set(0, 0.2474, 0, 0.9689);
  const L = d.controllers.left, R = d.controllers.right; L.updateAxes('thumbstick', 0, -1);
  R.position.set(0.25, 1.3, -0.3); R.quaternion.set(-0.2955, 0, 0, 0.9553); R.updateButtonValue('trigger', 1); });
await page.waitForFunction((f) => window.__irFrames > f + 8, f0, { timeout: 400000 }).catch(async () => console.log('TIMEOUT frames', await page.evaluate(() => [window.__irFrames, window.__irErrors]), logs.errors.slice(0, 5)));
const r = await page.evaluate(() => ({ frames: window.__irFrames, rig: window.__rig.position.toArray().map((v) => +v.toFixed(2)), mean: +window.__stage.health.mean().toFixed(4), errs: window.__irErrors }));
await page.screenshot({ path: `${out}/vr-emulated.png`, timeout: 180000 });
console.log(JSON.stringify({ info, entered: true, ...r, consoleErrors: [...new Set(logs.errors)] }));
await browser.close();

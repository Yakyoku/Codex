// ヘッドセットなしでの VR の自動確認：WebXR エミュレーター（iwer）で「VR に入る → 見回す → 終了」を通す
import { readFileSync } from 'node:fs';
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const iwer = readFileSync(new URL('../node_modules/iwer/build/iwer.min.js', import.meta.url), 'utf8');
// エミュレーターは XRWebGLLayer.framebuffer が null（＝画面のキャンバス）になる。Three.js の WebGL 2 側は
// それを WeakMap のキーにして例外を出すので、確認用にだけ null キーを無視させる（実機は Layers API の経路で、ここを通らない）。
const SHIM = `{ const s = WeakMap.prototype.set; WeakMap.prototype.set = function (k, v) { return (k === null || k === undefined) ? this : s.call(this, k, v); }; }`;
const out = new URL('../shots/', import.meta.url).pathname;
const path = process.argv[2] ?? '/vr/';
const browser = await launch('webgl2');
const { page, logs } = await openPage(browser, { viewport: { width: 1280, height: 720 },
  initScript: SHIM + iwer + `;window.__xrDevice = new IWER.XRDevice(IWER.metaQuest3); window.__xrDevice.installRuntime({ forceInstall: true }); window.__xrDevice.position.set(0, 1.2, 0);` });
await page.goto(ORIGIN + path);
let st = await waitReady(page);
console.log('対応判定:', st.supported);
await page.evaluate(() => document.getElementById('enterVR').click());
await page.waitForFunction(() => window.__state?.presenting === true, null, { timeout: 240000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: out + 'vr_emul_front.png', timeout: 240000 });
await page.evaluate(() => { const d = window.__xrDevice; d.quaternion.set(0, Math.sin(0.45), 0, Math.cos(0.45)); });
await page.waitForTimeout(1500);
await page.screenshot({ path: out + 'vr_emul_turned.png', timeout: 240000 });
const f1 = (await page.evaluate(() => window.__state)).frames;
await page.waitForTimeout(1000);
st = await page.evaluate(() => window.__state);
console.log('VR 中:', st.presenting, 'フレームが進んでいる:', st.frames > f1);
await page.evaluate(() => document.getElementById('enterVR').click());
await page.waitForFunction(() => window.__state?.presenting === false, null, { timeout: 240000 });
console.log('終了: OK', 'errors=', JSON.stringify(logs.errors), '404=', JSON.stringify(logs.notFound));
await browser.close();
process.exit(logs.errors.length ? 1 : 0);

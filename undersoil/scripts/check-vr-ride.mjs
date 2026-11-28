// VR 版の「菌糸を滑る」の確認：菌糸のそばで左手の引き金（toggleRide）→ 乗る、乗り物の枠が出る、視野のまわりが暗くなる、頭が菌糸の上へ運ばれる → 降りる
import { readFileSync } from 'node:fs';
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const iwer = readFileSync(new URL('../node_modules/iwer/build/iwer.min.js', import.meta.url), 'utf8');
const SHIM = `{ const s = WeakMap.prototype.set; WeakMap.prototype.set = function (k, v) { return (k === null || k === undefined) ? this : s.call(this, k, v); }; }`;
const browser = await launch('webgl2');
const { page, logs } = await openPage(browser, { viewport: { width: 640, height: 360 },
  initScript: SHIM + iwer + `;window.__xrDevice = new IWER.XRDevice(IWER.metaQuest3); window.__xrDevice.installRuntime({ forceInstall: true }); window.__xrDevice.position.set(0, 1.2, 0);` });
await page.goto(ORIGIN + '/vr/'); await waitReady(page, 'ready', 400000);
const ev = (f, a) => page.evaluate(f, a); const steps = []; const ok = (n, v) => { steps.push(`${v ? 'OK ' : 'NG '} ${n}`); return v; };
const until = async (f, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await ev(f)) return true; await page.waitForTimeout(1500); } return false; };
await ev(() => document.getElementById('enterVR').click());
ok('VR に入る', await until(() => window.__state?.presenting === true, 240000));
// 頭を菌糸のそばへ（体を動かす）
await ev(() => { const v = window.__vr, h = v.game.hypha; h.grow = 1; const p = h.curve.getPointAt(0.4); const head = v.cam(); v.rig.position.add(p.clone().add({ x: 0, y: 1.5, z: 0 }).sub(head)); });
await page.waitForTimeout(3000);
await ev(() => window.__vr.toggleRide());
ok('左手の引き金で乗る', await ev(() => window.__vr.riding));
ok('乗り物の枠が出る', await ev(() => window.__vr.frame.visible));
ok('視野のまわりが暗くなる（酔いにくさ）', await until(() => window.__vr.vig.material.opacity > 0.3, 120000));
ok('頭が菌糸の上にある', await until(() => window.__vr.game.hypha.near(window.__vr.cam()).d < 2.5, 120000));
await ev(() => window.__vr.toggleRide());
ok('もう一度引くと降りる', await ev(() => !window.__vr.riding && !window.__vr.frame.visible));
await ev(() => document.getElementById('enterVR').click());
console.log(steps.join('\n')); console.log('errors=', JSON.stringify(logs.errors.slice(0, 5)), '404=', JSON.stringify(logs.notFound));
await browser.close(); process.exit(steps.some((s) => s.startsWith('NG')) || logs.errors.length ? 1 : 0);

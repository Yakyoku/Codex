// VR 版の通しの自動確認（M3「画面版と VR 版の両方」）：WebXR エミュレーターで VR に入り、
// 右手の道具（水をくむ・まく）で入口から種まで水を運ぶ → 乾きの風 → 種のゴール → 地上の芽生え、までエラーなく進むか。
//   node scripts/check-vr-play.mjs
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
// 右手の握るボタンの代わりに、道具を直接呼ぶ（手の位置＝区画の中心）
const pour = (c) => ev((c) => { const v = window.__vr, w = v.game.world; v.tools.water(w.cellCenter(0)); v.tools.water(w.cellCenter(c)); v.tools.water(w.cellCenter(c)); }, c);
for (let c = 0; c < 12; c++) { await pour(c); await page.waitForTimeout(400); }
ok('12 区画に水、水の橋', await ev(() => { const g = window.__vr.game.world.grid; return g.cells.every((c) => c.water > 0.3) && g.links.slice(0, 11).every((s, i) => s.has(i + 1)); }));
await ev(() => { window.__vr.tools.startWind(); window.__keepOn = true; const f = () => { if (!window.__keepOn) return; const g = window.__vr.game.world.grid; for (const c of [9, 10, 11]) g.addWater(c, 1); requestAnimationFrame(f); }; requestAnimationFrame(f); });
ok('乾きの風が始まる', await until(() => window.__vr.tools.wind === 'on', 60000));
// この環境の VR の模擬はとても遅い（1 コマ数秒）。風の 60 秒を待たずに、残り時間を 1 秒にして終わりの処理を確かめる
await page.waitForTimeout(5000); await ev(() => { window.__vr.tools.__endWind?.(); });
ok('乾きの風が終わる', await until(() => window.__vr.tools.wind === 'done', 300000));
await ev(() => { window.__keepOn = false; });
ok('種が目覚める', await until(() => window.__vr.game.wake > 0.5, 600000));
await ev(() => { const v = window.__vr; v.rig.position.copy(v.game.seed.position).add({ x: -70, y: -1, z: 0 }); });
ok('地上の芽生えへ', await until(() => window.__vr.where === 'surface', 180000));
console.log('debug', await ev(() => { const v = window.__vr, x = v.game.renderer; const cam = v.cam(); return JSON.stringify({ wake: v.game.wake, wind: v.tools.wind, where: v.where, head: cam.toArray().map((n) => +n.toFixed(1)), seed: v.game.seed.position.toArray(), frames: window.__state.frames }); }));
await ev(() => document.getElementById('enterVR').click());
console.log(steps.join('\n')); console.log('errors=', JSON.stringify(logs.errors.slice(0, 5)), '404=', JSON.stringify(logs.notFound));
await browser.close(); process.exit(steps.some((s) => s.startsWith('NG')) || logs.errors.length ? 1 : 0);

// タブレットのタッチ操作の自動確認：iPad として開き、開始をタップ → 画面左を指でドラッグ → 主人公が動くか、アニメーションが進むか
//   node scripts/check-touch.mjs
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
const UA = 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const { browser, page, logs } = await launch({ width: 1180, height: 820, ctxOpts: { hasTouch: true, isMobile: true, userAgent: UA } });
await page.goto(ORIGIN + '/?post=off'); await waitReady(page);
await page.evaluate(() => { localStorage.clear(); localStorage.setItem('ir.intro', 'off'); }); await page.reload(); await waitReady(page);
await page.waitForTimeout(1500);
await page.tap('#start'); await page.waitForTimeout(1500);
const s0 = await page.evaluate(() => ({ pos: window.__pos.toArray(), frames: window.__irFrames, kind: window.__input.kind }));
const cdp = await page.context().newCDPSession(page);
const pt = (x, y) => [{ x, y, id: 1 }];
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(200, 600) });
for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(200, 600 - i * 6) }); await page.waitForTimeout(60); }
await page.waitForTimeout(3000);
const s1 = await page.evaluate(() => ({ pos: window.__pos.toArray(), frames: window.__irFrames, stick: window.__input.moveY, paused: !document.getElementById('pause').classList.contains('hide') }));
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
const moved = Math.hypot(s1.pos[0] - s0.pos[0], s1.pos[2] - s0.pos[2]);
console.log(JSON.stringify({ ok: moved > 1 && s1.pos[0] > s0.pos[0] && s1.frames > s0.frames, moved: +moved.toFixed(2), s0, s1, errors: [...new Set([...logs.errors, ...(await page.evaluate(() => window.__irErrors))])].slice(0, 5) }, null, 1));
await browser.close();

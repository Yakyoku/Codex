// 菌糸の見え方の確認：菌糸を伸ばしきって、横・上・乗った視点から撮る。 node scripts/shot-hypha.mjs [名前の頭] [mode]
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const [pre = 'hy', mode = 'webgl2', tier = 'compat'] = process.argv.slice(2);
const browser = await launch(mode); const { page, logs } = await openPage(browser, { viewport: { width: 960, height: 540 } });
await page.goto(ORIGIN + `/?renderer=${mode}&tier=${tier}&wet=0.8&pos=0,0,0,1,0,0`); await waitReady(page, 'ready', 400000);
await page.evaluate(() => { const h = window.__game.hypha; h.grow = 1; h.update(0.01, 0.5); });
const views = { side: [0.5, 'side'], spore: [0.0, 'spore'], ride: [0.45, 'ride'] };
for (const [name, [u]] of Object.entries(views)) {
  await page.evaluate((u) => { const g = window.__game, h = g.hypha, p = h.curve.getPointAt(Math.max(0.02, u)), t = h.curve.getTangentAt(Math.max(0.02, u));
    const side = t.clone().cross({ x: 0, y: 1, z: 0 }).normalize(); const c = u === 0 ? h.spore.clone().addScaledVector(side, 14).add({ x: 0, y: 3, z: 0 }) : p.clone().addScaledVector(side, 5).add({ x: 0, y: 1.5, z: 0 }).addScaledVector(t, -3);
    if (u === 0.45) { const r = h.rideAt(u, { x: 0, y: 1, z: 0, clone() { return this; } }.constructor ? new p.constructor(0, 1, 0) : null, new p.constructor()); const ahead = h.curve.getPointAt(u + 0.08); window.__pos = [r.x, r.y + 0.3, r.z, ahead.x, ahead.y, ahead.z]; return; }
    const look = u === 0 ? h.spore : p; window.__pos = [c.x, c.y, c.z, look.x, look.y, look.z]; }, u);
  await page.waitForTimeout(2500);
  await page.screenshot({ timeout: 120000, path: new URL(`../shots/${pre}_${name}.png`, import.meta.url).pathname }).catch((e) => console.log('shot', e.message));
}
console.log('errors=', JSON.stringify(logs.errors.slice(0, 3)), 'len', await page.evaluate(() => window.__game.hypha.length));
await browser.close();

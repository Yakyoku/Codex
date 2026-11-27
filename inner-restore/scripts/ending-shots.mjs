// 締めくくりの記録映像：治しきった区域を、画面の文字なしで撮る → public/static/img/ending/<区域>.jpg
//   node scripts/ending-shots.mjs [区域 …]（省略時 photo cilia alveolus villi myo cortex）
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
import fs from 'node:fs'; import path from 'node:path';
const out = path.resolve(import.meta.dirname, '../public/static/img/ending'); fs.mkdirSync(out, { recursive: true });
const zones = process.argv.slice(2).length ? process.argv.slice(2) : ['photo', 'cilia', 'alveolus', 'villi', 'myo', 'cortex'];
for (const z of zones) {
  const { browser, page, logs } = await launch({ width: 1280, height: 720 });
  await page.goto(ORIGIN + `/?zone=${z}&noentry&still&post=full&shadows`); await waitReady(page);
  await page.evaluate(() => { localStorage.setItem('ir.intro', 'off'); window.__begin(); const st = document.createElement('style'); st.textContent = 'body > *:not(canvas):not(#c){display:none!important} #hud,#patient,#hint,#topbtns,#subs,#reticle,#dx,#tags,#card{display:none!important}'; document.head.appendChild(st); });
  await page.evaluate(() => { const st = window.__stage; for (const pl of st.plugs) for (let i = 0; i < 140; i++) st.heal(pl.p.x, pl.p.z, 1 / 30); for (let k = 0; k < 50; k++) for (let x = -70; x < 70; x += 8) for (let zz = -40; zz < 45; zz += 20) st.heal(x, zz, 1 / 30);
    window.__force = { x: 0, y: 1, pitch: 0.18 }; window.__advance(30); window.__force = { x: 0, y: 0, pitch: 0.18 }; window.__advance(60); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(out, `${z}.jpg`), type: 'jpeg', quality: 82, timeout: 300000 });
  console.log(z, 'errors', logs.errors.slice(0, 2));
  await browser.close();
}

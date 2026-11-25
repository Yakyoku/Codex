// 図鑑の画像：図鑑の3D表示を1項目ずつ撮って、public/static/img/atlas/<id>.jpg にする（模型を作り直したら実行）
//   node scripts/atlas-images.mjs
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
import fs from 'node:fs'; import path from 'node:path';
const out = path.resolve(import.meta.dirname, '../public/static/img/atlas'); fs.mkdirSync(out, { recursive: true });
const atlas = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../src/data/atlas.json'), 'utf8')).entries;
const { browser, page } = await launch({ width: 800, height: 400 });
await page.goto(ORIGIN + '/?zone=retina&noentry&post=off'); await waitReady(page);
await page.evaluate((ids) => { localStorage.setItem('ir.known', ids.join(',')); localStorage.setItem('ir.vb', 'off'); }, atlas.map((e) => e.id));
await page.reload(); await waitReady(page); await page.evaluate(() => window.__begin());
await page.evaluate(() => document.getElementById('b-atlas').click()); await page.waitForTimeout(500);
for (const e of atlas) {
  const has = await page.evaluate((id) => !!document.querySelector(`.v3d[data-id="${id}"]`), e.id);
  if (!has) { console.log('模型なし', e.id); continue; }
  await page.evaluate(() => document.body.classList.add('shot'));   // 文字を隠し、模型に寄って撮る
  await page.evaluate((id) => document.querySelector(`.v3d[data-id="${id}"]`).click(), e.id);
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(out, `${e.id}.jpg`), type: 'jpeg', quality: 82, timeout: 120000 });
  await page.evaluate(() => { document.body.classList.remove('shot'); document.getElementById('v-close').click(); });
  await page.waitForTimeout(300); console.log('ok', e.id);
}
await browser.close();

// 紹介の問いかけの確認（?card= で紹介カードを出す）：紹介カードに「考えてみよう」が出て、図鑑に答えが開ける
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const browser = await launch('webgl2'); const { page, logs } = await openPage(browser, { viewport: { width: 900, height: 600 } });
await page.addInitScript(() => localStorage.setItem('undersoil.zukan', JSON.stringify(['colpoda', 'water-film'])));
await page.goto(ORIGIN + '/?nopost&renderer=webgl2&scene=soil&tier=compat&card=colpoda'); await waitReady(page, 'ready', 400000);
const ev = (f) => page.evaluate(f); let card = '';
for (let i = 0; i < 20 && !card; i++) { card = await ev(() => document.querySelector('.card.show .card-ask')?.textContent ?? ''); if (!card) await page.waitForTimeout(1500); }
console.log('card:', card);
const zk = await ev(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent?.includes('図鑑')); b?.click(); const d = [...document.querySelectorAll('dialog')].find((x) => x.open); const c = d?.querySelector('[data-id="colpoda"]'); (c)?.click(); const a = [...document.querySelectorAll('dialog')].find((x) => x.open)?.querySelector('.zk-ask'); a?.querySelector('summary')?.click(); return a ? a.textContent : null; });
console.log('zukan:', zk); console.log('errors=', JSON.stringify(logs.errors.slice(0, 3)));
await browser.close(); process.exit(card && zk && !logs.errors.length ? 0 : 1);

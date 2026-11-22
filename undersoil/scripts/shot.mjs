// 決まった場面を同じ条件で撮る。  node scripts/shot.mjs <名前> "<パスとクエリ>" [幅 高さ] [mode]
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const [name, path, w = '1280', h = '720', mode = 'webgl2'] = process.argv.slice(2);
const browser = await launch(mode);
const { page, logs } = await openPage(browser, { viewport: { width: +w, height: +h } });
await page.goto(ORIGIN + path + (path.includes('?') ? '&' : '?') + 'renderer=' + mode);
const st = await waitReady(page, path.includes('freeze=') ? 'frozen' : 'ready', 400000).catch((e) => ({ failed: true, e: String(e) }));
await page.waitForTimeout(+(process.env.WAIT ?? 1500));
await page.evaluate(() => { for (const id of ['hud']) { const e = document.getElementById(id); if (e && new URLSearchParams(location.search).has('clean')) e.style.display = 'none'; } document.querySelectorAll('.nav,.caption').forEach((e) => { if (new URLSearchParams(location.search).has('clean')) e.style.display = 'none'; }); });
await page.screenshot({ timeout: 120000, path: new URL(`../shots/${name}.png`, import.meta.url).pathname });
console.log(name, JSON.stringify(st.stats ?? st), 'vit', st.vitality, 'col', JSON.stringify(st.col), 'err=', JSON.stringify(logs.errors.slice(0, 3)), '404=', JSON.stringify(logs.notFound));
await browser.close();

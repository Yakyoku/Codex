// 第1部の確認：WebGL 2 で絵が出ること、WebGPU でエラーなく初期化と描画ができること、コンソールのエラーがゼロであること
import { launch, openPage, waitReady, ORIGIN } from './lib/browser.mjs';
const out = new URL('../shots/', import.meta.url).pathname;
let bad = 0;
for (const mode of ['webgl2', 'webgpu']) {
  const browser = await launch(mode);
  for (const [name, path, key] of [['screen', '/?t=3', 'ready'], ['vr', '/vr/', 'ready'], ['diag', '/diag/?ms=1500', 'done'], ['progress', '/progress/', null]]) {
    const { ctx, page, logs } = await openPage(browser);
    const url = ORIGIN + path + (path.includes('?') ? '&' : '?') + 'renderer=' + mode;
    await page.goto(url);
    let st = null;
    try { st = key ? await waitReady(page, key) : (await page.waitForSelector('h1'), {}); } catch (e) { logs.errors.push('timeout: ' + e.message.split('\n')[0]); }
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}part1_${name}_${mode}.png` });
    const hud = await page.evaluate(() => document.getElementById('hud')?.textContent ?? document.getElementById('short')?.value ?? '');
    const ok = logs.errors.length === 0 && logs.notFound.length === 0 && st && !st.failed;
    if (!ok) bad++;
    console.log(`${ok ? 'OK ' : 'NG '} ${mode} ${name} isWebGPU=${st?.isWebGPU} | ${hud.replace(/\n/g, ' ')} | err=${JSON.stringify(logs.errors)} 404=${JSON.stringify(logs.notFound)} warn=${logs.warnings.length ? JSON.stringify(logs.warnings.slice(0, 3)) : 0}`);
    await ctx.close();
  }
  await browser.close();
}
process.exit(bad ? 1 : 0);

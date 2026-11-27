// 区域ごとの三角形の数と描画回数を数え、予算表（Docs/WEB_BUDGET.md）と比べる。
//   node scripts/measure-zones.mjs [区域 …]　→ 画面版（互換）と VR 版の実数を表示
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
const all = ['retina', 'lens', 'photo', 'cilia', 'mucus', 'olfactory', 'bronchiole', 'alveolus', 'alvwall', 'villi', 'colon', 'crypt', 'valve', 'plaque', 'clot', 'endo', 'myo', 'scar', 'bbb', 'cortex', 'amyloid'];
const zones = process.argv.slice(2).length ? process.argv.slice(2) : all;
const count = () => { let tris = 0, draws = 0; window.__stage.scene.traverse((o) => { if (!o.isMesh || !o.visible) return; const g = o.geometry, n = (g.index ? g.index.count : g.attributes.position.count) / 3; tris += n * (o.isInstancedMesh ? o.count : 1); draws++; }); return { tris: Math.round(tris), draws }; };
for (const z of zones) {
  const { browser, page } = await launch({ width: 640, height: 360 });
  await page.goto(ORIGIN + `/?zone=${z}&noentry&post=off`); await waitReady(page);
  const a = await page.evaluate(count);
  await page.goto(ORIGIN + `/vr/?zone=${z}`); await waitReady(page, '__irReady', 240000);
  const b = await page.evaluate(count);
  console.log(JSON.stringify({ zone: z, screen: a, vr: b, over: [a.tris > 800000 ? '画面(互換 80万)' : '', b.tris > 400000 ? 'VR(40万)' : '', b.draws > 100 ? 'VR描画回数' : ''].filter(Boolean) }));
  await browser.close();
}

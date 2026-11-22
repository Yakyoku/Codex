// 進捗確認ページ（/progress/）を Docs/progress.json から作る
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'Docs', 'progress.json'), 'utf8'));
const out = path.join(root, 'progress'); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(path.join(out, 'img'), { recursive: true });
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
let html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>INNER RESTORE — 進捗</title><style>
:root{color-scheme:dark}body{margin:0;background:#07090b;color:#e9eef2;font-family:"Hiragino Sans","Yu Gothic UI","Noto Sans JP",system-ui,sans-serif;line-height:1.75}
main{max-width:1100px;margin:0 auto;padding:28px 18px 80px}h1{font-size:20px;letter-spacing:.2em;font-weight:500}h2{font-size:17px;margin:44px 0 6px;font-weight:600;border-left:3px solid #7fe0d2;padding-left:10px}
p.note{color:#8fa3ad;font-size:14px;margin:0 0 14px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,460px),1fr));gap:18px}
figure{margin:0;background:#0d1215;border:1px solid #ffffff12}figure img,figure video{width:100%;display:block;height:auto}figcaption{padding:10px 12px;font-size:13.5px;color:#c4d0d6}
a{color:#7fe0d2}.top{color:#8fa3ad;font-size:13px}.wide{grid-column:1/-1}
</style></head><body><main><h1>INNER RESTORE — 進捗確認</h1><p class="top">更新：${esc(data.updated)}　<a href="/">画面版</a>　<a href="/vr/">VR 版</a>　<a href="/diag/">実機診断</a></p>`;
for (const s of data.sections) {
  html += `<h2>${esc(s.title)}</h2>${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}<div class="grid">`;
  for (const it of s.items) {
    const name = it.src.replace(/[\/\\]/g, '_');
    fs.copyFileSync(path.join(root, it.src), path.join(out, 'img', name));
    const media = /\.(mp4|webm)$/.test(name) ? `<video src="img/${name}" controls playsinline muted loop preload="metadata"></video>` : `<img loading="lazy" src="img/${name}" alt="">`;
    html += `<figure class="${it.wide ? 'wide' : ''}">${media}<figcaption>${esc(it.caption)}</figcaption></figure>`;
  }
  html += '</div>';
}
html += '</main></body></html>';
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log('progress page:', data.sections.reduce((a, s) => a + s.items.length, 0), 'items');

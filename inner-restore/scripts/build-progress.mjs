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
.ov{background:#0d1215;border:1px solid #ffffff18;padding:18px 18px 10px;margin:18px 0 8px}.ov h2{margin:0 0 6px;border:0;padding:0;font-size:18px}
.big{display:flex;align-items:baseline;gap:14px;margin:8px 0 10px}.big b{font-size:44px;font-weight:300;color:#7fe0d2}.big span{color:#8fa3ad;font-size:14px}
.bar{height:12px;background:#ffffff14;border-radius:6px;overflow:hidden;margin-bottom:14px}.bar i{display:block;height:100%;background:linear-gradient(90deg,#f2b36b,#7fe0d2)}
table{width:100%;border-collapse:collapse;font-size:14px}td,th{padding:7px 6px;border-top:1px solid #ffffff12;text-align:left;vertical-align:top}th{color:#8fa3ad;font-weight:400;font-size:12.5px}
td.st{white-space:nowrap}.ok{color:#7fe0d2}.wip{color:#f2b36b}.no{color:#6f8088}.mini{display:inline-block;width:70px;height:6px;background:#ffffff14;border-radius:3px;vertical-align:middle;margin-right:6px}.mini i{display:block;height:100%;background:#7fe0d2;border-radius:3px}
.desc{color:#9fb3bc;font-size:13px}
</style></head><body><main><h1>INNER RESTORE — 進捗確認</h1><p class="top">更新：${esc(data.updated)}　<a href="/">画面版</a>　<a href="/vr/">VR 版</a>　<a href="/diag/">実機診断</a></p>`;
// 全体の進み具合（いちばん上）
if (data.overview) {
  const ov = data.overview, tot = ov.items.reduce((a, x) => a + x.weight, 0), got = ov.items.reduce((a, x) => a + x.weight * x.done, 0), pct = Math.round((got / tot) * 100);
  const doneN = ov.items.filter((x) => x.done >= 1).length;
  html += `<section class="ov"><h2>${esc(ov.title)}</h2><div class="big"><b>${pct}%</b><span>全 ${ov.items.length} 項目のうち、完了 ${doneN}・進行中 ${ov.items.filter((x) => x.done > 0 && x.done < 1).length}・未着手 ${ov.items.filter((x) => !x.done).length}（重みの合計 ${tot} のうち ${got.toFixed(1)}）</span></div><div class="bar"><i style="width:${pct}%"></i></div>
  <table><tr><th>番号</th><th>項目</th><th>状態</th><th>重み</th></tr>${ov.items.map((x) => { const st = x.done >= 1 ? '<span class="ok">完了</span>' : x.done > 0 ? `<span class="wip">${esc(x.state ?? '進行中')}</span>` : '<span class="no">未着手</span>';
    return `<tr><td>${x.no}</td><td>${esc(x.name)}<div class="desc">${esc(x.desc)}</div></td><td class="st"><span class="mini"><i style="width:${Math.round(x.done * 100)}%"></i></span>${st}</td><td>${x.weight}</td></tr>`; }).join('')}</table>
  <p class="note" style="margin-top:10px">${esc(ov.note)}</p></section>`;
}
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

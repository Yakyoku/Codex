// 進捗確認ページ：public/progress/data.json を読んで、スクリーンショット・動画・生き物の確認用画像を並べる
import '../ui/base.css';
import './progress.css';

interface Item { src: string; caption: string; kind?: 'image' | 'video'; }
interface Section { title: string; note?: string; items: Item[]; }
interface Data { updated: string; milestone: string; summary: string; sections: Section[]; }

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) => { const e = document.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; };

async function main() {
  const app = document.getElementById('app')!;
  const data: Data = await (await fetch('./data.json', { cache: 'no-store' })).json();
  app.textContent = '';
  app.append(el('h1', 'UNDERSOIL 進捗'), el('p', `${data.milestone} ／ 更新：${data.updated}`, 'meta'), el('p', data.summary));
  const nav = el('p', undefined, 'links');
  for (const [t, h] of [['画面版', '../'], ['VR 版', '../vr/'], ['実機診断', '../diag/']] as const) { const a = el('a', t, 'btn'); a.href = h; nav.append(a); }
  app.append(nav);
  for (const s of data.sections) {
    app.append(el('h2', s.title));
    if (s.note) app.append(el('p', s.note, 'note'));
    const grid = el('div', undefined, 'grid');
    for (const it of s.items) {
      const fig = el('figure');
      if (it.kind === 'video') { const v = el('video'); v.src = it.src; v.controls = true; v.playsInline = true; v.preload = 'metadata'; fig.append(v); }
      else { const a = el('a'); a.href = it.src; a.target = '_blank'; const img = el('img'); img.src = it.src; img.loading = 'lazy'; img.alt = it.caption; a.append(img); fig.append(a); }
      fig.append(el('figcaption', it.caption)); grid.append(fig);
    }
    app.append(grid);
  }
}
main().catch((e) => { document.getElementById('app')!.textContent = '読み込みに失敗しました：' + e; });

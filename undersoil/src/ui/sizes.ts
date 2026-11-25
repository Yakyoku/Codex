// 大きさくらべ：本物の写真を、ほんとうの大きさの順に並べる。横の目盛りは「1 目盛りで 10 倍」（対数の目盛り）。
// ふつうの目盛りでは、細菌（数 µm）とシロツメクサの種（1 mm 余り）を同じ図に並べられないため。
// 大きさの値は、紹介カード・台帳（Docs/SPECIES.md）と同じものを使う。
type Item = { name: string; size: number; label: string; img?: string; color: string };
const ITEMS: Item[] = [
  { name: 'シュードモナスの仲間（なかま）', size: 2, label: '約 2 µm', img: 'photos/pseudomonas-1.webp', color: '#9fb2a0' },
  { name: '枯草菌（こそうきん）', size: 3, label: '約 3 µm', img: 'photos/bacillus-2.webp', color: '#a9a9a0' },
  { name: 'コルポダ', size: 60, label: '約 60 µm', img: 'photos/colpoda-1.webp', color: '#c8b48a' },
  { name: '髪（かみ）の毛の太さ', size: 80, label: '約 80 µm', color: '#6d5a44' },
  { name: '細かい砂粒（すなつぶ）', size: 200, label: '約 0.2 mm', color: '#b9b0a2' },
  { name: 'クマムシ（トウキョウチョウメイムシ）', size: 500, label: '約 0.5 mm', img: 'photos/tardigrade-1.webp', color: '#d9b77a' },
  { name: 'シロツメクサの種（たね）', size: 1200, label: '約 1.2 mm', img: 'photos/seed-1.webp', color: '#e0a640' },
  { name: 'ゴマ粒（つぶ）', size: 3000, label: '約 3 mm', color: '#efe6d8' },
];

export function makeSizes(base: string) {
  const dlg = document.createElement('dialog'); dlg.className = 'sizes';
  const lo = Math.log10(1), hi = Math.log10(10000), X = (v: number) => ((Math.log10(v) - lo) / (hi - lo)) * 100;
  const ticks = [[1, '1 µm'], [10, '10 µm'], [100, '0.1 mm'], [1000, '1 mm'], [10000, '1 cm']] as const;
  dlg.innerHTML = `<h2>大（おお）きさくらべ</h2>
    <p class="sz-lead">本物の大きさの順に並べました。目盛りは <b>1 つ右へ行くごとに 10 倍</b> です。枯草菌のおよそ 20 倍がコルポダ、その約 8 倍がクマムシ、その 2 倍あまりがシロツメクサの種です。</p>
    <div class="sz-scale">${ticks.map(([v, l]) => `<span style="left:${X(v)}%">${l}</span>`).join('')}</div>
    <ol class="sz-list">${ITEMS.map((it) => `<li>
      <div class="sz-ph">${it.img ? `<img src="${base}${it.img}" alt="" loading="lazy">` : '<i></i>'}</div>
      <div class="sz-body"><div class="sz-name">${it.name}<em>${it.label}</em></div>
        <div class="sz-track">${ticks.map(([v]) => `<s style="left:${X(v)}%"></s>`).join('')}<b style="width:${X(it.size)}%;background:${it.color}"></b></div></div></li>`).join('')}</ol>
    <p class="sz-note">µm（マイクロメートル）は 1 mm の 1000 分の 1 です。</p>
    <button class="btn primary" type="button" data-close>とじる</button>`;
  document.body.append(dlg);
  dlg.querySelector('[data-close]')!.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  return { open() { dlg.showModal(); } };
}

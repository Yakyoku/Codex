// 見本帳：各章の見せ場、尊格を回して見る表示、章のパレット、採点結果を 1 ページに。
import '@fontsource/shippori-mincho/400.css';
import '@fontsource/shippori-mincho/600.css';
import { PALETTE } from './scenes/palette';
import { SCORES, CRITERIA } from './data/scores';

const css = `
body{margin:0;background:#f4efe4;color:#2b3350;font-family:"Shippori Mincho",serif;line-height:1.9}
main{max-width:1080px;margin:0 auto;padding:28px 16px 80px}
h1{font-weight:600;letter-spacing:.28em;font-size:clamp(22px,5vw,34px);margin:.4em 0 0}
h2{font-weight:600;letter-spacing:.2em;font-size:19px;margin:2.6em 0 .6em;border-bottom:1px solid #2b335033;padding-bottom:.3em}
h2 small{color:#b5432e;letter-spacing:.1em;margin-left:.8em;font-weight:400}
p,li{font-size:15px} a{color:#b5432e}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}
figure{margin:0} figure img{width:100%;display:block;border:1px solid #2b335022;background:#fff}
figcaption{font-size:13px;color:#56607a;padding:.2em .1em}
.sw{display:flex;flex-wrap:wrap;gap:10px}.sw div{width:104px;font-size:12px;text-align:center}
.sw i{display:block;height:58px;border-radius:46% 54% 50% 50%/55% 48% 52% 45%;border:1px solid #2b335018;margin-bottom:4px}
table{border-collapse:collapse;width:100%;font-size:14px}td,th{border-bottom:1px solid #2b335022;padding:.35em .5em;text-align:left;vertical-align:top}
td.n{text-align:center;width:3.2em;font-weight:600}.ok{color:#56706f}.ng{color:#b5432e}
.turn{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
iframe{width:100%;aspect-ratio:1/1;border:1px solid #2b335022;background:#f4efe4}
.btn{display:inline-block;border:1px solid #2b335055;padding:.3em 1.1em;margin:.2em .4em .2em 0;text-decoration:none;color:#2b3350}
.note{font-size:13px;color:#56607a}`;
document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));
const fig = (f: string, cap: string) => `<figure><a href="./gallery/${f}"><img loading="lazy" src="./gallery/${f}" alt="${cap}"></a><figcaption>${cap}</figcaption></figure>`;
const total = SCORES.rounds[SCORES.rounds.length - 1];
document.getElementById('gallery')!.innerHTML = `<main>
<a class="btn" href="./index.html">← 題字へ戻る</a>
<h1>見本帳</h1><p>「菩提への道 ― 水彩曼荼羅」の絵づくりを確かめるための頁です。画像は実際のゲーム画面（公開中のビルド）をそのまま撮ったものです。</p>

<h2>序章　山門 ― 金剛力士<small>${PALETTE.name}</small></h2>
<div class="grid">
${fig('wide.jpg', '見せ場の構図：山門と二尊、蓮')}${fig('trial.jpg', '試練の最中（操作中の画面）')}
${fig('a-full.jpg', '阿形（あぎょう）の全身')}${fig('a-face.jpg', '阿形の顔')}
${fig('un-face.jpg', '吽形（うんぎょう）の顔')}${fig('monk.jpg', '主人公・蓮（れん）')}
${fig('steps.jpg', '参道の石段（探索）')}${fig('title.jpg', '題字')}
</div>

<h2>尊格を回して見る</h2>
<p class="note">指やマウスでなぞると回せます。ホイール／ピンチで寄れます（読み込みに数秒かかります）。</p>
<div class="turn"><iframe loading="lazy" src="./index.html?view=nio&dist=5.2&ty=1.15&spin=1" title="阿形"></iframe><iframe loading="lazy" src="./index.html?view=un&dist=5.2&ty=1.15&spin=1" title="吽形"></iframe></div>
<p><a class="btn" href="./index.html?view=nio&dist=1.0&ty=1.86">阿形の顔に寄る</a><a class="btn" href="./index.html?view=un&dist=1.0&ty=1.86">吽形の顔に寄る</a><a class="btn" href="./index.html?view=monk&dist=2.6&ty=0.95">蓮を見る</a></p>

<h2>章のパレット（限定 7 色）</h2>
<div class="sw">${PALETTE.colors.map((c, i) => `<div><i style="background:${c}"></i>${PALETTE.names[i]}<br>${c}</div>`).join('')}</div>
<p class="note">鮮やかな色は画面の 1 割以下、尊格の裳と天衣だけに使います。黒は使わず、藍で締めます。明るい所は塗らずに紙の白を残します。</p>

<h2>作り方の 3 案の比較（M0）</h2>
${fig('abc.jpg', '左上 A＝物体シェーダーのみ／右上 B＝後処理のみ／下 C＝両方（採用）')}
<p>${SCORES.abc}</p>

<h2>採点（各 5 点満点・全項目 4 点以上で合格）</h2>
<table><tr><th>項目</th>${SCORES.rounds.map(r => `<th>${r.name}</th>`).join('')}</tr>
${CRITERIA.map((c, i) => `<tr><td>(${i + 1}) ${c}</td>${SCORES.rounds.map(r => `<td class="n ${r.s[i] >= 4 ? 'ok' : 'ng'}">${r.s[i] || '—'}</td>`).join('')}</tr>`).join('')}</table>
<p class="note">${total.note}</p>
<div class="grid">${SCORES.rounds.filter(r => r.img).map(r => fig(r.img!, r.name + ' の点検画面')).join('')}</div>

<h2>絵づくりの調整</h2>
<p>ゲームの URL の末尾に <b>?art=1</b> を付けると、にじみ・縁の溜まり・粒状感・紙目・輪郭線・彩度の強さを画面上のつまみで変えられます。下に出る文字（artv=…）を伝えていただければ、そのまま既定値に反映します。</p>
<p><a class="btn" href="./index.html?art=1">調整パネル付きで開く</a><a class="btn" href="./index.html?art=1&auto=court">試練の場面で調整する</a></p>
<p class="note">静止画モード：ゲーム中に一時停止 →「静止画モード」。UI が消え、ドラッグで構図を変えて眺められます。</p>
</main>`;

import"./600-CP3taO9o.js";var e={name:`青緑と灰、差し色に丹`,colors:[`#f4efe4`,`#b9cbc8`,`#7f9d98`,`#56706f`,`#9aa3a8`,`#3f4a66`,`#c8694f`],names:[`紙の白`,`霧の青緑`,`杉の緑青`,`深い苔`,`石の灰`,`藍（締め色）`,`丹（差し色）`]},t=[`止めた画面が一枚の水彩画に見える`,`紙の白が生きている`,`にじみと縁の溜まりが自然`,`色が澄み、章のパレットに収まる`,`曲線が美しい`,`主役に目が行く構成`,`奥行きと空気感`,`尊格の顔と手が美しく、図像が約束どおり`,`動かしても質が保たれ、ちらつかない`,`題字・ゲーム中・VR の間で質に差がない`],n={abc:`A は顔料のむら・粒・溜まりが出るが、紙の端の塗り残しと輪郭線がなく「色を塗った3D」に留まる。B は細部が筆の面にまとまるが、色面が均一でセル画に寄り、粒状感が出ない。C は物体側で顔料のふるまいを作り、後処理は「面のまとめ・途切れる線・紙端」だけを足すので、止めた絵として最もまとまる。VR では後処理を外しても A 相当の質が残る点も決め手。よって C を採用。`,rounds:[{name:`1周目`,s:[3.5,3.5,3,3.5,3,3,3.5,2.5,0,0],img:`round1.jpg`,note:``},{name:`2周目`,s:[4,4,3.5,4,3.5,3.5,4,3,0,4],img:`round2.jpg`,note:``},{name:`3周目`,s:[4,4,3.5,4,3.5,4,4,3,0,4],img:`round3.jpg`,note:``},{name:`4周目（画風の更新）`,s:[4,4,4,4,4,4,4,3.5,0,4],img:`round4.jpg`,note:`いただいた見本（墨の線と淡彩）に合わせて更新：墨の線を太く濃く・筆圧で揺らし、塗り分けの境（目・眉・筋）にも線を引く／にじみ（色が隣へ染み出す処理）を追加／金剛力士を丹の肌・朱の天衣に塗り直し、額の皺・隈取り・筋肉の描き込み、開いた五指を追加／参道を暗い大杉の幹で縁取り、下草（羊歯）を追加。自己採点（正直な現状）：(8) 尊格の顔と手は 3.5 で、見本の描き込み（歯・皺・血管・指の節）にはまだ届いていません。(9) 動かしたときの安定は実機での目視がまだのため未採点（—）です。`}]};document.head.appendChild(Object.assign(document.createElement(`style`),{textContent:`
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
.note{font-size:13px;color:#56607a}`}));var r=(e,t)=>`<figure><a href="./gallery/${e}"><img loading="lazy" src="./gallery/${e}" alt="${t}"></a><figcaption>${t}</figcaption></figure>`,i=n.rounds[n.rounds.length-1];document.getElementById(`gallery`).innerHTML=`<main>
<a class="btn" href="./index.html">← 題字へ戻る</a>
<h1>見本帳</h1><p>「菩提への道 ― 水彩曼荼羅」の絵づくりを確かめるための頁です。画像は実際のゲーム画面（公開中のビルド）をそのまま撮ったものです。</p>

<h2>序章　山門 ― 金剛力士<small>${e.name}</small></h2>
<div class="grid">
${r(`wide.jpg`,`見せ場の構図：山門と二尊、蓮`)}${r(`trial.jpg`,`試練の最中（操作中の画面）`)}
${r(`a-full.jpg`,`阿形（あぎょう）の全身`)}${r(`a-face.jpg`,`阿形の顔`)}
${r(`un-face.jpg`,`吽形（うんぎょう）の顔`)}${r(`monk.jpg`,`主人公・蓮（れん）`)}
${r(`steps.jpg`,`参道の石段（探索）`)}${r(`title.jpg`,`題字`)}
</div>

<h2>尊格を回して見る</h2>
<p class="note">指やマウスでなぞると回せます。ホイール／ピンチで寄れます（読み込みに数秒かかります）。</p>
<div class="turn"><iframe loading="lazy" src="./index.html?view=nio&dist=5.2&ty=1.15&spin=1" title="阿形"></iframe><iframe loading="lazy" src="./index.html?view=un&dist=5.2&ty=1.15&spin=1" title="吽形"></iframe></div>
<p><a class="btn" href="./index.html?view=nio&dist=1.0&ty=1.86">阿形の顔に寄る</a><a class="btn" href="./index.html?view=un&dist=1.0&ty=1.86">吽形の顔に寄る</a><a class="btn" href="./index.html?view=monk&dist=2.6&ty=0.95">蓮を見る</a></p>

<h2>章のパレット（限定 7 色）</h2>
<div class="sw">${e.colors.map((t,n)=>`<div><i style="background:${t}"></i>${e.names[n]}<br>${t}</div>`).join(``)}</div>
<p class="note">鮮やかな色（丹）は画面の 1 割以下、尊格の肌と山門の柱だけに使います。黒は使わず、藍で締めます。明るい所は塗らずに紙の白を残します。</p>

<h2>作り方の 3 案の比較（M0）</h2>
${r(`abc.jpg`,`左上 A＝物体シェーダーのみ／右上 B＝後処理のみ／下 C＝両方（採用）`)}
<p>${n.abc}</p>

<h2>採点（各 5 点満点・全項目 4 点以上で合格）</h2>
<table><tr><th>項目</th>${n.rounds.map(e=>`<th>${e.name}</th>`).join(``)}</tr>
${t.map((e,t)=>`<tr><td>(${t+1}) ${e}</td>${n.rounds.map(e=>`<td class="n ${e.s[t]>=4?`ok`:`ng`}">${e.s[t]||`—`}</td>`).join(``)}</tr>`).join(``)}</table>
<p class="note">${i.note}</p>
<div class="grid">${n.rounds.filter(e=>e.img).map(e=>r(e.img,e.name+` の点検画面`)).join(``)}</div>

<h2>絵づくりの調整</h2>
<p>ゲームの URL の末尾に <b>?art=1</b> を付けると、にじみ・縁の溜まり・粒状感・紙目・輪郭線・彩度の強さを画面上のつまみで変えられます。下に出る文字（artv=…）を伝えていただければ、そのまま既定値に反映します。</p>
<p><a class="btn" href="./index.html?art=1">調整パネル付きで開く</a><a class="btn" href="./index.html?art=1&auto=court">試練の場面で調整する</a></p>
<p class="note">静止画モード：ゲーム中に一時停止 →「静止画モード」。UI が消え、ドラッグで構図を変えて眺められます。</p>
</main>`;
import atlasData from '../data/atlas.json';
export type AtlasEntry = (typeof atlasData.entries)[number];
export const ATLAS: AtlasEntry[] = atlasData.entries;
export const TIPS = [
  '赤血球の直径は約7.8µm。網膜の毛細血管はそれより細い所があり、赤血球は形を変えて一列で通り抜けます。',
  '生きた網膜は、ほぼ透明です。眼底が橙赤色に見えるのは、その奥の色素上皮と脈絡膜にある、色素と血液の色です。',
  '硝子体は98%以上が水。ごく細いコラーゲンの線維が、透明なゼリーの形を保っています。',
  '網膜の毛細血管の壁は、内皮細胞どうしが固く結びついた「関門」になっています。',
];
export function buildUI() {
  const ui = document.createElement('div'); ui.id = 'ui';
  ui.innerHTML = `
  <div id="hud" class="hide"><div class="lab">網膜・内側の面　血流の回復</div><div class="val"><span id="hv">0</span><small>%</small></div><div class="meter"><i id="hm"></i></div>
    <div class="small">知覚加速 ×<span id="pf"></span>（体内の時間をゆっくり見ています）<br>潜行士の身長 2µm ／ 赤血球の直径 7.8µm</div></div>
  <div id="patient" class="hide"><img src="/static/img/patient_view.jpg" alt=""><div class="spot"></div><div class="cap">患者の視界</div></div>
  <div id="reticle" class="hide"></div><div id="hint" class="hide"></div><div id="subs"></div>
  <div id="card"><div class="k">初めて出会ったもの</div><div class="n"></div><div class="e"></div><div class="s"></div><div class="d"></div><div class="p"><i></i></div><div class="h"></div></div>
  <div id="viewer" class="hide"><div class="vt"><b></b><span></span></div><button class="btn" id="v-close">図鑑に戻る</button><div class="vh">ドラッグで回す・ホイールで寄る。青緑の物差しは潜行士の身長（2µm）</div></div><div id="dx" class="hide"><div class="t">スキャン診断</div><div class="l"></div></div><div id="tags"><div class="tag"></div><div class="tag"></div><div class="tag"></div></div>
  <div id="touch" class="hide"><div id="stick" class="hide"><i></i></div><button class="tb" id="tb-fire">浄化</button><button class="tb" id="tb-scan">スキャン</button><button class="tb tb-s" id="tb-up">上へ</button><button class="tb tb-s" id="tb-down">下へ</button></div>
  <div id="topbtns" class="hide"><button id="b-atlas">図鑑</button><button id="b-pause">一時停止</button><button id="b-full">全画面</button></div>
  <div id="fade"></div><div id="toast"></div>
  <div id="done" class="hide"><h2>区域の血流が戻りました</h2><p id="donetext"></p><button class="btn" id="b-next">次の区域へ</button> <button class="btn" id="b-cont">探索を続ける</button></div>
  <div id="pause" class="sheet hide"><h2 style="font-weight:300;letter-spacing:.3em">一時停止</h2><button class="btn" id="p-resume">再開する</button><button class="btn" id="p-atlas">図鑑</button><button class="btn" id="p-full">全画面表示</button>
    <div style="font-size:.88em;color:#b7c6cc;max-width:34em;line-height:1.8;text-align:center">セーブはこのブラウザの中に保存され、別のブラウザや端末には引き継がれません。</div><a class="btn" href="/vr/" style="text-decoration:none">VR 版へ</a></div>
  <div id="atlas" class="sheet hide"><h2 style="font-weight:300;letter-spacing:.3em">体内図鑑</h2><div class="grid"></div><button class="btn" id="a-close">閉じる</button></div>
  <div id="title"><div class="sub">体内紀行</div><h1>INNER RESTORE</h1>
    <div id="load"><div class="bar"><i></i></div><div class="tip"></div></div>
    <button class="btn hide" id="start">クリックして開始</button>
    <div id="opts"><label>描画方式 <select id="o-backend"><option value="auto">自動</option><option value="webgpu">WebGPU</option><option value="webgl">WebGL 2</option></select></label>
      <label>初登場の紹介 <select id="o-intro"><option value="all">すべて表示</option><option value="name">名前だけ</option><option value="off">表示しない</option></select></label>
      <label>読み上げ <select id="o-tts"><option value="on">あり</option><option value="off">なし</option></select></label></div>
    <div class="links"><a href="/vr/" id="l-vr">VR で遊ぶ（Meta Quest 3）</a><a href="/diag/">実機診断</a><a href="/progress/">進捗</a></div>
    <div class="note">本作は娯楽作品であり、医療上の助言ではありません。<br>登場する細胞や組織は実在のものに基づいていますが、主人公と道具、治し方は作り事です。</div></div>`;
  document.body.appendChild(ui);
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  return { ui, $ };
}
export function renderAtlas(grid: HTMLElement, known: Set<string>, onView?: (id: string) => void, has3d: (id: string) => boolean = () => false) {
  grid.innerHTML = ATLAS.map((e) => {
    const k = known.has(e.id);
    return `<div class="it ${k ? '' : 'unk'}">${k && has3d(e.id) ? `<button class="btn v3d" data-id="${e.id}">3Dで回して見る</button>` : ''}<h3>${k ? e.ja : '？？？'}</h3><div class="e">${k ? e.en : 'まだ出会っていません'}</div>${
      k ? `<dl><dt>種類・大きさ</dt><dd>${e.kind}　${e.size}（${e.compare}）</dd><dt>姿</dt><dd>${e.look}</dd><dt>動き</dt><dd>${e.move}</dd><dt>働き</dt><dd>${e.role}</dd><dt>ほかとの関係</dt><dd>${e.relation}</dd></dl>` : ''}</div>`;
  }).join('');
  if (onView) grid.querySelectorAll<HTMLButtonElement>('.v3d').forEach((b) => (b.onclick = () => onView(b.dataset.id!)));
}

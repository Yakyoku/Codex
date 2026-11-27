import atlasData from '../data/atlas.json';
export type AtlasEntry = (typeof atlasData.entries)[number];
export const ATLAS: AtlasEntry[] = atlasData.entries;
// 読み込み中の豆知識（器官ごと。どれも事実確認ずみの図鑑の内容から）
export const TIPS_BY: Record<string, string[]> = {
  eye: [
  '赤血球の直径は約7.8µm。網膜の毛細血管はそれより細い所があり、赤血球は形を変えて一列で通り抜けます。',
  '生きた網膜は、ほぼ透明です。眼底が橙赤色に見えるのは、その奥の色素上皮と脈絡膜にある、色素と血液の色です。',
  '硝子体は98%以上が水。ごく細いコラーゲンの線維が、透明なゼリーの形を保っています。',
  '網膜の毛細血管の壁は、内皮細胞どうしが固く結びついた「関門」になっています。',
  ],
  nose: [
    '線毛は長さ 約5〜7µm、太さは髪の毛の約300分の1。細胞の表面に生えた、細い毛のような突起です。',
    '線毛の中には、細い管が「9+2」の形に並んでいます。そのあいだのモーターのたんぱくが、毛を曲げます。',
  ],
  lung: [
    '肺胞は直径 約200µm。両方の肺に、約5億個あります（人により3億〜8億個ほど）。',
    '肺胞の壁の毛細血管は、赤血球とほぼ同じ太さ。赤血球は1秒足らずで通り抜けるあいだに、酸素を受け取ります。',
  ],
  gut: [
    '小腸の絨毛は、高さ 約0.5〜1.6mm、太さは髪の毛1本強。この草原が、腸の表面を何倍にも広げています。',
    '微絨毛は長さ 約1µm。吸収上皮細胞の頭の面に、ブラシの毛のようにびっしり並んでいます。',
  ],
  vessel: [
    '静脈には、向かい合う2枚の薄い膜の扉があります。血液を心臓の方へだけ通し、逆戻りを防ぎます。',
    'フィブリンの糸は、太さ 約0.1µm。赤血球の約80分の1の細さで、血を止める網を編みます。',
  ],
  heart: [
    '心筋細胞は、長さ 約100〜150µm。端どうしで隣とつながり、電気の合図を受けると、みんなでそろって縮みます。',
    'サルコメアは長さ 約2µm。潜行士の背丈とほぼ同じ間隔で並び、心臓の縞もようをつくります。',
    'プルキンエ線維は、心室の内側の壁のすぐ下を走り、合図を心室のすみずみへ届けます。',
  ],
  brain: [
    '大脳皮質の錐体細胞の体は、約20µm。枝のような突起で合図を受け取り、1本の長い線で次の細胞へ送ります。',
    '脳の毛細血管は内径 約6µmで、赤血球より細い管です。壁のすき間はぴったり閉じています。',
    'ミクログリアは、脳の見張り役。細胞体は動かさず、細い枝だけを伸ばし縮めして、まわりを調べています。',
  ],
};
export const TIPS = TIPS_BY.eye;

export function buildUI() {
  const ui = document.createElement('div'); ui.id = 'ui';
  ui.innerHTML = `
  <div id="hud" class="hide"><div class="lab">網膜・内側の面　血流の回復</div><div class="val"><span id="hv">0</span><small>%</small></div><div class="meter"><i id="hm"></i></div>
    <div class="small">知覚加速 ×<span id="pf"></span>（体内の時間をゆっくり見ています）<br><span id="scalenote">潜行士の身長 2µm ／ 赤血球の直径 7.8µm</span></div></div>
  <div id="patient" class="hide"><img src="/static/img/patient_view.jpg" alt=""><canvas class="wisps"></canvas><div class="spot"></div><div class="cap">患者の視界</div></div>
  <div id="reticle" class="hide"></div><div id="hint" class="hide"></div><div id="subs"></div>
  <div id="card"><div class="k">初めて出会ったもの</div><div class="n"></div><div class="e"></div><div class="s"></div><div class="d"></div><div class="p"><i></i></div><div class="h"></div></div>
  <div id="hubui" class="hide"><div class="hh"><b>全身マップ</b><span>患者：灯（あかり）— ナノスーツの基礎理論を作った研究者。全身の器官が、順に働きを失っている。</span></div>
    <div class="vit"></div><div class="org hide"><h3></h3><p class="on"></p><div class="zl"></div></div>
    <button class="btn" id="h-close">戻る</button><div class="hn">器官をタップ（クリック）して選ぶ・ドラッグで回す</div></div>
  <div id="viewer" class="hide"><div class="vt"><b></b><span></span></div><button class="btn" id="v-close">図鑑に戻る</button><div class="vh">ドラッグで回す・ホイールで寄る。青緑の物差しは潜行士の身長（2µm）</div></div><div id="dx" class="hide"><div class="t">スキャン診断</div><div class="l"></div></div><div id="tags"><div class="tag"></div><div class="tag"></div><div class="tag"></div></div>
  <div id="touch" class="hide"><div id="stick" class="hide"><i></i></div><button class="tb" id="tb-fire">浄化</button><button class="tb" id="tb-scan">スキャン</button><button class="tb tb-s" id="tb-up">上へ</button><button class="tb tb-s" id="tb-down">下へ</button></div>
  <div id="topbtns" class="hide"><button id="b-atlas">図鑑</button><button id="b-pause">一時停止</button><button id="b-full">全画面</button></div>
  <div id="errline" class="hide"></div><div id="fade"></div><div id="toast"></div>
  <div id="done" class="hide"><h2>区域の血流が戻りました</h2><p id="donetext"></p><button class="btn" id="b-next">次の区域へ</button> <button class="btn" id="b-dhub">全身マップへ</button> <button class="btn" id="b-cont">探索を続ける</button></div>
  <div id="pause" class="sheet hide"><h2 style="font-weight:300;letter-spacing:.3em">一時停止</h2><button class="btn" id="p-resume">再開する</button><button class="btn" id="p-atlas">図鑑</button><button class="btn" id="p-full">全画面表示</button>
    <div style="font-size:.88em;color:#b7c6cc;max-width:34em;line-height:1.8;text-align:center">セーブはこのブラウザの中に保存され、別のブラウザや端末には引き継がれません。</div><button class="btn" id="p-hub">全身マップ</button><button class="btn" id="p-settings">設定</button><a class="btn" href="/vr/" style="text-decoration:none">VR 版へ</a></div>
  <div id="settings" class="sheet hide"><h2 style="font-weight:300;letter-spacing:.3em">設定</h2>
    <div class="sgrid">
      <section><h3>読み上げ（字幕を声で読む）</h3>
        <label>読み上げ <select id="o-tts"><option value="on">あり</option><option value="off">なし</option></select></label>
        <label>声 <select id="o-voice"><option value="">おすすめ（やさしい女性の声）</option></select></label>
        <label>速さ <input type="range" id="o-rate" min="0.6" max="1.5" step="0.05"><output id="o-rate-v"></output></label>
        <label>声の高さ（端末の声） <input type="range" id="o-pitch" min="0.6" max="1.5" step="0.05"><output id="o-pitch-v"></output></label>
        <label>声の大きさ <input type="range" id="o-vol" min="0.1" max="1" step="0.05"><output id="o-vol-v"></output></label>
        <button class="btn" id="o-test">試しに聞く</button>
        <div class="snote">「AI の声」は、ゲームのナレーションを前もって4種類の声で録ったものです（速さも変えられます）。「端末の声」は、お使いの端末に入っている声です。iPhone・iPad は「設定 → アクセシビリティ → 読み上げコンテンツ → 声 → 日本語」で声を追加すると、ここに増えます。</div></section>
      <section><h3>表示</h3>
        <label>字幕 <select id="o-subs"><option value="on">表示する</option><option value="off">表示しない</option></select></label>
        <label>初登場の紹介 <select id="o-intro"><option value="all">すべて表示</option><option value="name">名前だけ</option><option value="off">表示しない</option></select></label></section>
      <section><h3>進み具合（セーブ）</h3>
        <div class="snote">進み具合と図鑑は、このブラウザの中だけに保存されます。別のブラウザや端末には引き継がれません。続きを別の端末で遊ぶときは、下の「書き出す」で出た文字列を、その端末の「読み込む」に貼り付けてください。</div>
        <button class="btn" id="o-export">書き出す（文字列をコピー）</button>
        <textarea id="o-code" rows="3" placeholder="ここに書き出した文字列が出ます／貼り付けて読み込みます" style="width:100%;font:inherit;font-size:.85em"></textarea>
        <button class="btn" id="o-import">読み込む</button><div class="snote" id="o-msg"></div></section>
      <section><h3>描画</h3>
        <label>映像の仕上げ <select id="o-post"><option value="on">入れる（ぼけ・光のにじみ・色調）</option><option value="off">切る（軽い・不具合のとき）</option></select></label>
        <label>描画方式 <select id="o-backend"><option value="auto">自動</option><option value="webgpu">WebGPU</option><option value="webgl">WebGL 2</option></select></label>
        <div class="snote">映像の仕上げと描画方式を変えると、ページを読み込み直します。動かない・止まるときは「WebGL 2」と「切る」を試してください。</div></section>
    </div>
    <button class="btn" id="s-close">閉じる</button></div>
  <div id="atlas" class="sheet hide"><h2 style="font-weight:300;letter-spacing:.3em">体内図鑑</h2><div class="grid"></div><button class="btn" id="a-close">閉じる</button></div>
  <div id="title"><div class="sub">体内紀行</div><h1>INNER RESTORE</h1>
    <div id="load"><div class="bar"><i></i></div><div class="tip"></div></div>
    <div id="tmenu" class="hide"><button class="btn" id="start">はじめる</button><button class="btn" id="b-hub">全身マップ</button><button class="btn ghost" id="b-new">はじめから</button></div>
    <button class="btn ghost" id="b-settings">設定（声・速さ・字幕など）</button>
    <div class="links"><a href="/vr/" id="l-vr">VR で遊ぶ（Meta Quest 3）</a><a href="/diag/">実機診断</a><a href="/progress/">進捗</a></div>
    <div class="note">本作は娯楽作品であり、医療上の助言ではありません。<br>登場する細胞や組織は実在のものに基づいていますが、主人公と道具、治し方は作り事です。</div></div>`;
  document.body.appendChild(ui);
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  return { ui, $ };
}
export function renderAtlas(grid: HTMLElement, known: Set<string>, onView?: (id: string) => void, has3d: (id: string) => boolean = () => false) {
  grid.innerHTML = ATLAS.map((e) => {
    const k = known.has(e.id);
    return `<div class="it ${k ? '' : 'unk'}"><img src="/static/img/atlas/${e.id}.jpg" alt="" loading="lazy" onerror="this.remove()">${k && has3d(e.id) ? `<button class="btn v3d" data-id="${e.id}">3Dで回して見る</button>` : ''}<h3>${k ? e.ja : '？？？'}</h3><div class="e">${k ? e.en : 'まだ出会っていません'}</div>${
      k ? `<dl><dt>種類・大きさ</dt><dd>${e.kind}　${e.size}（${e.compare}）</dd><dt>姿</dt><dd>${e.look}</dd><dt>動き</dt><dd>${e.move}</dd><dt>働き</dt><dd>${e.role}</dd><dt>ほかとの関係</dt><dd>${e.relation}</dd></dl>` : ''}</div>`;
  }).join('');
  if (onView) grid.querySelectorAll<HTMLButtonElement>('.v3d').forEach((b) => (b.onclick = () => onView(b.dataset.id!)));
}

// 遊び方（1 枚）と、試練中に画面中央へ出す「次の一手」の合図。
import type { Action } from '../game/contracts';

export interface Cue { text: string; sub: string; action: Action | null; urgent: boolean }

const HOWTO_HTML = `<div class="bd-howto-in">
<h2>遊び方</h2>
<p class="bd-howto-lead">金剛力士は敵ではなく<b style="color:var(--shu)">師</b>です。倒すのではなく、息を合わせて<b style="color:var(--shu)">認めてもらう（印可）</b>のが目的です。<br>画面の上の<b style="color:var(--shu)">朱の線</b>が満ちると次の段へ。三段で試練を越えます。</p>
<div class="bd-howto-grid">
  <div class="bd-howto-step"><div class="bd-howto-key">◯</div><div><b>動く</b>：画面の左側を指でなぞる。尊格に近づく。</div></div>
  <div class="bd-howto-step"><div class="bd-howto-key shu">受</div><div><b>受ける</b>：尊格が腕を振り上げると、足もとに<b>墨の輪</b>が出る。画面に「<b>受ける！</b>」と出たら押す。ぴったりだと澄んだ音がして、印可が大きく進む。</div></div>
  <div class="bd-howto-step"><div class="bd-howto-key shu">攻</div><div><b>攻める</b>：下の輪の文字が「<b>阿</b>」のあいだに押す。「吽」のときは受けの時間。息が合うほど印可が進む。</div></div>
  <div class="bd-howto-step"><div class="bd-howto-key">躱</div><div><b>かわす</b>：輪の外へ素早く逃げる。受けが間に合わないときに。</div></div>
  <div class="bd-howto-step"><div class="bd-howto-key">息</div><div><b>息を整える</b>：押し続けると、左上の「心」と「体」が戻る。</div></div>
  <div class="bd-howto-step"><div class="bd-howto-key">心</div><div><b>連打は禁物</b>：焦って押し続けると心が濁り、絵の色がくすむ。間を取ると澄む。</div></div>
</div>
<p class="bd-howto-pc">迷ったら、画面中央の大きな文字（受ける／攻める／近づく）と、朱く光るボタンに従ってください。倒れても罰はなく、その段からやり直せます。<br>キーボード：移動 WASD／攻 J／重 K／受 L・Shift／躱 Space／息 E／一時停止 Esc。ゲームパッドにも対応。</p>
<button class="bd-howto-go" type="button">はじめる</button>
</div>`;

export function createHowto(root: HTMLElement): { show(): Promise<void>; readonly open: boolean; setCue(c: Cue | null): void } {
  const el = document.createElement('div'); el.className = 'bd-howto'; el.innerHTML = HOWTO_HTML; root.appendChild(el);
  let resolve: (() => void) | null = null;
  el.querySelector('.bd-howto-go')!.addEventListener('click', () => { el.classList.remove('is-on'); resolve?.(); resolve = null; });
  const cue = document.createElement('div'); cue.className = 'bd-cue';
  cue.innerHTML = '<div class="bd-cue-main"></div><div class="bd-cue-sub"></div>';
  root.appendChild(cue);
  const main = cue.firstElementChild as HTMLElement, sub = cue.lastElementChild as HTMLElement;
  let last = '';
  return {
    show() { el.classList.add('is-on'); return new Promise<void>(r => { resolve = r; }); },
    get open() { return el.classList.contains('is-on'); },
    setCue(c) {
      const key = c ? c.text + '|' + c.sub + '|' + c.urgent : '';
      if (key === last) return; last = key;
      cue.classList.toggle('is-on', !!c); cue.classList.toggle('is-urgent', !!c?.urgent);
      if (c) { main.textContent = c.text; sub.textContent = c.sub; }
    },
  };
}

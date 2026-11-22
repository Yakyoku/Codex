// 遊び方（1 枚）と、試練中に画面中央へ出す「次の一手」の合図。
import type { Action } from '../game/contracts';

export interface Cue { text: string; sub: string; action: Action | null; urgent: boolean }

const HOWTO_HTML = `<div class="bd-howto-in">
<h2>遊び方</h2>
<p class="bd-howto-lead">金剛力士は敵ではなく<b style="color:var(--shu)">師</b>です。<b style="color:var(--shu)">受けて、返す</b>。この一往復で認められ（印可）、上の朱の線が満ちると次の段へ。三段で試練を越えます。</p>
<div class="bd-howto-grid">
  <div class="bd-howto-step"><div class="bd-howto-key shu">受</div><div><b>① 受ける</b>：尊格が構えると、蓮のまわりに<b>墨の輪</b>が現れて縮む。<b>輪が重なって朱に変わった瞬間</b>に「受」。決まれば「<b>見事</b>」。</div></div>
  <div class="bd-howto-step"><div class="bd-howto-key shu">攻</div><div><b>② 返す</b>：見事に受けると、尊格の構えが開く（<b>隙</b>）。すぐに「攻」で<b>返し</b>。これがいちばん大きく認められる。</div></div>
  <div class="bd-howto-step"><div class="bd-howto-key">躱</div><div><b>③ 躱す</b>：尊格が地を踏むと、<b>墨の波</b>が地面を広がる。届く寸前に「躱」で跳ぶ。</div></div>
  <div class="bd-howto-step"><div class="bd-howto-key">待</div><div><b>間外し</b>：吽形は、輪を途中で止めて間を外す。<b>輪が朱になるまで</b>押さない。</div></div>
  <div class="bd-howto-step"><div class="bd-howto-key">息</div><div><b>息を整える</b>：崩されたら、離れて「息」を長押し。左上の「心」と「体」が戻る。</div></div>
  <div class="bd-howto-step"><div class="bd-howto-key">心</div><div><b>連打は戒められる</b>：むやみに「攻」を押すと、尊格が素早い一手で戒めてくる。</div></div>
</div>
<p class="bd-howto-pc">最初の一回は、時間が止まって教えてくれます。倒れても罰はなく、その段からやり直せます。<br>キーボード：移動 WASD／攻 J／重 K／受 L・Shift／躱 Space／息 E／一時停止 Esc。ゲームパッドにも対応。</p>
<button class="bd-howto-go" type="button">はじめる</button>
</div>`;

export function createHowto(root: HTMLElement): { show(): Promise<void>; readonly open: boolean; setCue(c: Cue | null): void; setRing(x: number, y: number, k: number, hot: boolean, scale: number): void; hideRing(): void; judge(text: string, sub: string, kind: string): void } {
  const el = document.createElement('div'); el.className = 'bd-howto'; el.innerHTML = HOWTO_HTML; root.appendChild(el);
  let resolve: (() => void) | null = null;
  el.querySelector('.bd-howto-go')!.addEventListener('click', () => { el.classList.remove('is-on'); resolve?.(); resolve = null; });
  const cue = document.createElement('div'); cue.className = 'bd-cue';
  cue.innerHTML = '<div class="bd-cue-main"></div><div class="bd-cue-sub"></div>';
  root.appendChild(cue);
  const main = cue.firstElementChild as HTMLElement, sub = cue.lastElementChild as HTMLElement;
  let last = '';
  // 構えの輪：蓮のまわりで外の輪が縮み、内の輪に重なった瞬間が「受」
  const ring = document.createElement('div'); ring.className = 'bd-ring';
  ring.innerHTML = '<svg viewBox="-200 -200 400 400"><circle class="bd-ring-in" r="44"/><circle class="bd-ring-out" r="180"/></svg><b>受</b>';
  root.appendChild(ring);
  const rOut = ring.querySelector('.bd-ring-out') as SVGCircleElement;
  // 判定の文字
  const jd = document.createElement('div'); jd.className = 'bd-judge'; jd.innerHTML = '<b></b><small></small>'; root.appendChild(jd);
  const jdB = jd.firstElementChild as HTMLElement, jdS = jd.lastElementChild as HTMLElement;
  return {
    setRing(x, y, k, hot, scale) {
      ring.classList.add('is-on'); ring.classList.toggle('is-hot', hot);
      ring.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      rOut.setAttribute('r', String(44 + (1 - k) * 150));
      rOut.style.opacity = String(0.35 + k * 0.65);
    },
    hideRing() { ring.classList.remove('is-on'); },
    judge(text, sub, kind) {
      jdB.textContent = text; jdS.textContent = sub;
      jd.className = 'bd-judge is-' + kind; void jd.offsetWidth; jd.classList.add('is-on');
    },
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

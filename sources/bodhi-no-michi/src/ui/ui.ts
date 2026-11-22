// 2D の UI（DOM）。和紙・墨・朱の落款。3D の水彩画の上に重ねる。
import './ui.css';
import type { HudState, Settings, TitleChoice, TitleOpts, UI, UIHandlers } from '../game/contracts';
import { ZUKAN } from '../data/zukan';

export interface UIContext { settings: Settings; zukan: string[]; virtues: string[]; reached: number }

// ───────── 図案（蓮・法輪・宝珠） ─────────
const LOTUS =
  '<svg class="bd-ico" viewBox="0 0 48 48" aria-hidden="true">' +
  '<path d="M24 8 C29.2 16 28.8 26 24 34 C19 26 19.2 16 24 8Z"/>' +
  '<path d="M22 34 C14 30 10.4 22 11 14 C17 17.4 21 24 22 34Z"/><path d="M26 34 C34 30.4 38 22 37 14.2 C31 17 27.2 24 26 34Z"/>' +
  '<path d="M20 36 C12 36.4 6 31 4 24 C11 24.2 17 29 20 36Z"/><path d="M28 36 C36 36 42 31.4 44 24.2 C37 24 31 29 28 36Z"/>' +
  '<path d="M8 41 C16 39.4 30 42 40 40.3"/></svg>';
const WHEEL =
  '<svg class="bd-ico" viewBox="0 0 48 48" aria-hidden="true">' +
  '<path d="M24 6 C34 5.8 42.2 14 42 24 C41.8 34 34 42.2 24 42 C14 41.8 5.8 34 6 24 C6.2 14 14 6.2 24 6Z"/>' +
  '<path d="M24 19.6 C26.6 19.5 28.5 21.6 28.4 24 C28.3 26.5 26.4 28.4 24 28.4 C21.5 28.4 19.6 26.4 19.6 24 C19.6 21.5 21.6 19.7 24 19.6Z"/>' +
  '<path d="M24 6.4V19.6M24 28.4V41.8M6.2 24H19.6M28.4 24H41.8M11.4 11.4L20.9 20.9M27.1 27.1L36.6 36.6M36.6 11.4L27.1 20.9M20.9 27.1L11.4 36.6"/></svg>';
const JEWEL =
  '<svg class="bd-ico" viewBox="0 0 48 48" aria-hidden="true">' +
  '<path d="M24 5 C27 13 36.4 19 36 29 C35.6 36 30.4 41 24 41 C17.4 41 12.2 36 12 29 C11.8 19 21 13 24 5Z"/>' +
  '<path d="M24 16 C26 21 30.6 24 30.4 29.6 C30.2 33 27.4 35.4 24 35.4"/><path d="M9 44 C17 42.6 31 45 40 43.4"/></svg>';
const MOTIF: Record<string, string> = { kongorikishi: WHEEL, jizo: JEWEL };

const DEFS =
  '<svg class="bd-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>' +
  '<filter id="bd-f-rough" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="7" result="n"/>' +
  '<feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>' +
  '<filter id="bd-f-bleed" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="3" result="n"/>' +
  '<feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="1.4"/></filter>' +
  '</defs></svg>';

const PETAL = '<svg viewBox="0 0 12 17" aria-hidden="true"><path d="M6 0.6 C10.2 5 10 11.4 6 16.4 C2 11.4 1.8 5 6 0.6Z"/></svg>';
const ENSO_D = 'M45 11 C31 3 12 11 9 28 C6 46 20 58 35 56 C50 54 59 41 55 26';

// ───────── 章と徳 ─────────
const r = (base: string, rt: string) => `<ruby>${base}<rt>${rt}</rt></ruby>`;
const CHAPTERS: { label: string; name: string }[] = [
  { label: '序章', name: r('金剛力士', 'こんごうりきし') },
  { label: '第一章', name: r('阿修羅', 'あしゅら') },
  { label: '第二章', name: r('四天王', 'してんのう') },
  { label: '第三章', name: r('不動明王', 'ふどうみょうおう') },
  { label: '第四章', name: r('千手観音', 'せんじゅかんのん') },
  { label: '第五章', name: r('文殊', 'もんじゅ') + '・' + r('普賢', 'ふげん') },
  { label: '第六章', name: r('弥勒菩薩', 'みろくぼさつ') },
  { label: '第七章', name: r('阿弥陀如来', 'あみだにょらい') },
  { label: '第八章', name: r('大日如来', 'だいにちにょらい') },
  { label: '終章', name: r('菩提樹', 'ぼだいじゅ') + 'の' + r('下', 'もと') },
];
/** いま遊べる章 */
const IMPLEMENTED = new Set<number>([0]);

/** 成長の木の節。SaveData.virtues には id（または name・別名）を入れる */
export const VIRTUE_NODES: { id: string; chapter: string; name: string; html: string; alias: string[] }[] = [
  { id: 'kokyu', chapter: '序章', name: '呼吸', html: r('呼吸', 'こきゅう'), alias: ['breath'] },
  { id: 'ninniku', chapter: '第一章', name: '忍辱', html: r('忍辱', 'にんにく'), alias: ['patience'] },
  { id: 'jikai', chapter: '第二章', name: '持戒', html: r('持戒', 'じかい'), alias: ['precepts'] },
  { id: 'shojin', chapter: '第三章', name: '精進', html: r('精進', 'しょうじん'), alias: ['diligence'] },
  { id: 'fuse', chapter: '第四章', name: '布施', html: r('布施', 'ふせ'), alias: ['giving'] },
  { id: 'chie', chapter: '第五章', name: '智慧', html: r('智慧', 'ちえ'), alias: ['wisdom'] },
  { id: 'zenjo', chapter: '第六章', name: '禅定', html: r('禅定', 'ぜんじょう'), alias: ['meditation'] },
  { id: 'yudaneru', chapter: '第七章', name: '委ねる', html: r('委', 'ゆだ') + 'ねる', alias: ['surrender'] },
  { id: 'ichinyo', chapter: '第八章', name: '一如', html: r('一如', 'いちにょ'), alias: ['oneness'] },
  { id: 'jodo', chapter: '終章', name: '成道', html: r('成道', 'じょうどう'), alias: ['awakening'] },
];

// ───────── 小道具 ─────────
function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, html?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** 文字列を安全に HTML へ。<ruby><rt><rp><br> だけは通す */
const rich = (s: string) => esc(s).replace(/&lt;(\/?)(ruby|rt|rp|br)&gt;/g, '<$1$2>').replace(/\n/g, '<br>');
const clamp01 = (v: number) => (v > 1 ? 1 : v > 0 ? v : 0);
const delay = (ms: number) => new Promise<void>((res) => window.setTimeout(res, ms));

function button(cls: string, html: string, onTap: () => void): HTMLButtonElement {
  const b = el('button', cls, html);
  b.type = 'button';
  b.addEventListener('click', onTap);
  return b;
}
const vbutton = (html: string, onTap: () => void) => button('bd-vbtn', '<i class="bd-blot"></i><span class="bd-vtx">' + html + '</span>', onTap);

interface Sheet { el: HTMLElement; close(): void }

export function createUI(root: HTMLElement, h: UIHandlers): UI & { setContext(c: UIContext): void } {
  root.textContent = '';
  root.classList.add('bd-ui');
  root.insertAdjacentHTML('beforeend', DEFS);

  let ctx: UIContext | null = null;

  // 最初の操作（音の有効化）
  let gestured = false;
  const firstGesture = () => {
    if (gestured) return;
    gestured = true;
    window.removeEventListener('pointerdown', firstGesture, true);
    window.removeEventListener('keydown', firstGesture, true);
    try { h.onFirstGesture(); } catch (e) { console.error(e); }
  };
  window.addEventListener('pointerdown', firstGesture, true);
  window.addEventListener('keydown', firstGesture, true);

  // タッチ端末の判定（小休止ボタンの表示）
  const markTouch = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    root.classList.add('bd-touch');
    window.removeEventListener('pointerdown', markTouch, true);
  };
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) root.classList.add('bd-touch');
  else window.addEventListener('pointerdown', markTouch, true);

  // 拡大・長押しメニューを抑える
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  root.addEventListener('dblclick', (e) => e.preventDefault());
  root.addEventListener('contextmenu', (e) => e.preventDefault());

  // ───────── 題字 ─────────
  const title = el('div', 'bd-title');
  title.innerHTML =
    '<div class="bd-title-head"><h1>菩提への道</h1>' +
    '<p class="bd-title-sub">水彩曼荼羅<span class="bd-seal">蓮</span></p></div>';
  const titleMenuWrap = el('div', 'bd-title-menu');
  const titleMenu = el('div', 'bd-vmenu');
  titleMenu.setAttribute('role', 'menu');
  titleMenuWrap.appendChild(titleMenu);
  title.appendChild(titleMenuWrap);
  root.appendChild(title);
  let titleOn = false;

  function showTitle(o: TitleOpts) {
    const items: [TitleChoice, string, boolean][] = [
      ['new', 'はじめから', true],
      ['howto', '遊び方', true],
      ['continue', 'つづきから', o.canContinue],
      ['vr', '<span class="bd-tcy">VR</span>で遊ぶ<small>（Meta Quest）</small>', o.vrSupported],
      ['chapters', '章を選ぶ', true],
      ['zukan', r('図鑑', 'ずかん'), true],
      ['settings', '設定', true],
      ['gallery', r('見本帳', 'みほんちょう'), true],
    ];
    titleMenu.textContent = '';
    for (const [choice, html, show] of items) {
      if (!show) continue;
      titleMenu.appendChild(vbutton(html, () => { if (titleOn) h.onTitle(choice); }));
    }
    titleOn = true;
    title.classList.add('is-on');
    titleMenuWrap.style.pointerEvents = 'auto';
  }
  function hideTitle() {
    titleOn = false;
    title.classList.remove('is-on');
    titleMenuWrap.style.pointerEvents = 'none';
  }

  // ───────── 読み込み ─────────
  const loading = el('div', 'bd-loading',
    LOTUS + '<div class="bd-load-line"><div class="bd-load-clip"></div></div><p class="bd-load-label"></p>');
  const loadClip = loading.querySelector('.bd-load-clip') as HTMLElement;
  const loadLabel = loading.querySelector('.bd-load-label') as HTMLElement;
  root.appendChild(loading);
  let loadingOn = false;
  let loadText = '';
  function showLoading(progress: number, label = '墨を磨っています') {
    if (!loadingOn) { loadingOn = true; loading.classList.add('is-on'); }
    loadClip.style.transform = `scaleX(${clamp01(progress).toFixed(3)})`;
    if (label !== loadText) { loadText = label; loadLabel.innerHTML = rich(label); }
  }
  function hideLoading() {
    loadingOn = false;
    loading.classList.remove('is-on');
  }

  // ───────── HUD ─────────
  const hud = el('div', 'bd-hud');
  hud.innerHTML =
    '<div class="bd-hud-tl"><div class="bd-enso">' +
    `<svg viewBox="0 0 64 64" aria-hidden="true"><g class="bd-enso-clear"><path d="${ENSO_D}" stroke-width="4.4"/>` +
    `<path d="${ENSO_D}" stroke-width="1.1" opacity=".4" transform="translate(1.8 1.2)"/></g>` +
    `<g class="bd-enso-mud"><path d="${ENSO_D}" stroke-width="5.2" stroke-dasharray="15 6 3 8 24 5 2 9"/>` +
    `<path d="${ENSO_D}" stroke-width="1.4" opacity=".5" stroke-dasharray="6 11 19 7" transform="translate(-1.6 1.8)"/></g></svg>` +
    '<span class="bd-enso-k">心</span></div>' +
    '<div class="bd-body"><span>体</span><i class="bd-body-track"><b class="bd-body-fill"></b></i></div></div>' +
    '<div class="bd-hud-tc is-off"><div class="bd-petals">' + PETAL.repeat(5) + '</div>' +
    '<div class="bd-inka-line"><div class="bd-inka-fill"><div class="bd-inka-gold"></div></div></div>' +
    '<div class="bd-phase"></div></div>' +
    '<div class="bd-hud-bc"><div class="bd-breath">' +
    '<svg viewBox="0 0 70 70" aria-hidden="true"><path d="M35 2 C54 1.6 68.4 16 68 35 C67.6 54 54 68.4 35 68 C16 67.6 1.6 54 2 35 C2.4 16 16 2.4 35 2Z"/></svg>' +
    '<div class="bd-breath-in"></div><div class="bd-breath-label"></div></div><div class="bd-hint"></div></div>';
  const pauseBtn = el('button', 'bd-pausebtn',
    '<svg viewBox="0 0 26 26" aria-hidden="true"><path d="M5 8.6 C9 7.4 16 7.8 21.4 8 C21 9.6 15 9.9 5.4 10.2Z"/>' +
    '<path d="M3.6 16.8 C9 15.4 17 15.9 22.6 16.2 C22 18.2 14 18.3 4 18.8Z"/></svg>');
  pauseBtn.type = 'button';
  pauseBtn.setAttribute('aria-label', '小休止');
  pauseBtn.addEventListener('click', () => window.dispatchEvent(new CustomEvent('bodhi-pause')));
  hud.appendChild(pauseBtn);
  root.appendChild(hud);

  const q = <T extends Element>(sel: string) => hud.querySelector(sel) as unknown as T;
  const hudTl = q<HTMLElement>('.bd-hud-tl');
  const ensoClear = q<SVGElement>('.bd-enso-clear');
  const ensoMud = q<SVGElement>('.bd-enso-mud');
  const bodyBox = q<HTMLElement>('.bd-body');
  const bodyFill = q<HTMLElement>('.bd-body-fill');
  const hudTc = q<HTMLElement>('.bd-hud-tc');
  const petalBox = q<HTMLElement>('.bd-petals');
  const petals = Array.from(petalBox.children);
  const inkaFill = q<HTMLElement>('.bd-inka-fill');
  const inkaGold = q<HTMLElement>('.bd-inka-gold');
  const phaseEl = q<HTMLElement>('.bd-phase');
  const breathIn = q<HTMLElement>('.bd-breath-in');
  const breathLabel = q<HTMLElement>('.bd-breath-label');
  const hintEl = q<HTMLElement>('.bd-hint');

  // 前回の値（変わったときだけ DOM に触る）
  const last = { visible: false, mind: -1, body: -1, inka: -1, petals: -1, phaseOn: false, phaseName: '', breath: -1, label: '', hint: '' };

  function setHud(s: HudState) {
    if (s.visible !== last.visible) {
      last.visible = s.visible;
      hud.classList.toggle('is-on', s.visible);
      root.classList.toggle('bd-hud-on', s.visible);
    }
    if (!s.visible) return;

    const mind = Math.round(clamp01(s.mind) * 40);
    if (mind !== last.mind) {
      last.mind = mind;
      const v = mind / 40;
      ensoClear.style.opacity = v.toFixed(3);
      ensoMud.style.opacity = (1 - v).toFixed(3);
      hudTl.classList.toggle('is-low', v < 0.4);
    }
    const body = Math.round(clamp01(s.body) * 100);
    if (body !== last.body) {
      last.body = body;
      bodyFill.style.transform = `scaleX(${body / 100})`;
      bodyBox.classList.toggle('is-low', body < 30);
    }
    const phaseOn = s.phase > 0;
    if (phaseOn !== last.phaseOn) {
      last.phaseOn = phaseOn;
      hudTc.classList.toggle('is-off', !phaseOn);
    }
    if (phaseOn) {
      const inka = Math.round(clamp01(s.inka) * 200);
      if (inka !== last.inka) {
        last.inka = inka;
        const v = inka / 200;
        inkaFill.style.transform = `scaleX(${v})`;
        inkaGold.style.opacity = (v * v).toFixed(3);
        const n = Math.floor(v * 5 + 1e-6);
        if (n !== last.petals) {
          last.petals = n;
          petals.forEach((p, i) => p.classList.toggle('is-lit', i < n));
          petalBox.classList.toggle('is-full', n >= 5);
        }
      }
      if (s.phaseName !== last.phaseName) {
        last.phaseName = s.phaseName;
        phaseEl.textContent = s.phaseName;
      }
    }
    const breath = Math.round((((s.breath % 1) + 1) % 1) * 240);
    if (breath !== last.breath) {
      last.breath = breath;
      const t = breath / 240;
      const u = t < 0.5 ? t * 2 : 2 - t * 2;
      const e = u * u * (3 - 2 * u);
      breathIn.style.transform = `scale(${(0.42 + 0.58 * e).toFixed(3)})`;
    }
    if (s.breathLabel !== last.label) {
      last.label = s.breathLabel;
      breathLabel.textContent = s.breathLabel;
    }
    if (s.hint !== last.hint) {
      last.hint = s.hint;
      hintEl.innerHTML = rich(s.hint);
    }
  }

  // ───────── 字幕 ─────────
  const sub = el('div', 'bd-sub', '<div class="bd-sub-in"><span class="bd-sub-sp"></span><p class="bd-sub-tx"></p></div>');
  const subIn = sub.firstElementChild as HTMLElement;
  const subSp = sub.querySelector('.bd-sub-sp') as HTMLElement;
  const subTx = sub.querySelector('.bd-sub-tx') as HTMLElement;
  root.appendChild(sub);
  let subResolve: (() => void) | null = null;
  let subTimer = 0;
  let subAt = 0;

  function endSubtitle(immediate: boolean) {
    const done = subResolve;
    if (!done) return;
    subResolve = null;
    window.clearTimeout(subTimer);
    if (immediate) { done(); return; }
    sub.classList.remove('is-on');
    window.setTimeout(done, 280);
  }
  function skipSubtitle() {
    if (subResolve && performance.now() - subAt > 260) endSubtitle(false);
  }
  function subtitle(text: string, speaker = '', ms?: number): Promise<void> {
    endSubtitle(true);
    subSp.textContent = speaker;
    subSp.hidden = !speaker;
    subTx.innerHTML = rich(text);
    sub.classList.add('is-on');
    subAt = performance.now();
    const plain = text.replace(/<rt>.*?<\/rt>|<[^>]+>/g, '');
    const dur = ms ?? Math.max(2600, 1400 + plain.length * 130);
    return new Promise<void>((res) => {
      subResolve = res;
      subTimer = window.setTimeout(() => endSubtitle(false), dur);
    });
  }
  subIn.addEventListener('click', skipSubtitle);
  // 場面（HUD なし）のあいだは、画面のどこを押しても送れる
  window.addEventListener('pointerdown', (e) => {
    if (!subResolve || last.visible || anyModal()) return;
    if (e.target instanceof Node && subIn.contains(e.target)) return;
    skipSubtitle();
  });

  // ───────── 章の題字 ─────────
  const chap = el('div', 'bd-chap', '<div class="bd-chap-in"><h2 class="bd-chap-title"></h2><p class="bd-chap-sub"></p></div>');
  const chapTitle = chap.querySelector('.bd-chap-title') as HTMLElement;
  const chapSub = chap.querySelector('.bd-chap-sub') as HTMLElement;
  root.appendChild(chap);
  let chapSeq = 0;
  async function chapterCard(titleText: string, subText: string, ms = 3800): Promise<void> {
    const seq = ++chapSeq;
    chapTitle.innerHTML = rich(titleText);
    chapSub.innerHTML = rich(subText);
    chapSub.hidden = !subText;
    chap.classList.add('is-on');
    await delay(ms);
    if (seq !== chapSeq) return;
    chap.classList.remove('is-on');
    await delay(1000);
  }

  // ───────── 知らせ ─────────
  const toastEl = el('div', 'bd-toast', '<span></span>');
  const toastTx = toastEl.firstElementChild as HTMLElement;
  root.appendChild(toastEl);
  let toastTimer = 0;
  function toast(text: string, ms = 2600) {
    toastTx.innerHTML = rich(text);
    toastEl.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove('is-on'), ms);
  }

  // ───────── 紙の面 ─────────
  const sheets: Sheet[] = [];
  function openSheet(titleHtml: string, icon: string, body: HTMLElement, onClose?: () => void, tools?: HTMLElement[]): Sheet {
    const veil = el('div', 'bd-veil');
    const sheet = el('div', 'bd-sheet');
    sheet.setAttribute('role', 'dialog');
    const head = el('div', 'bd-sheet-head', `<h2>${icon}<span>${titleHtml}</span></h2>`);
    const toolBox = el('div', 'bd-sheet-tools');
    let closed = false;
    const self: Sheet = {
      el: veil,
      close() {
        if (closed) return;
        closed = true;
        const i = sheets.indexOf(self);
        if (i >= 0) sheets.splice(i, 1);
        veil.classList.remove('is-on');
        veil.style.pointerEvents = 'none';
        veil.inert = true;
        window.setTimeout(() => veil.remove(), 260);
        if (onClose) onClose();
      },
    };
    const closeBtn = button('bd-btn', '閉じる', () => self.close());
    if (tools) for (const t of tools) toolBox.appendChild(t);
    toolBox.appendChild(closeBtn);
    head.appendChild(toolBox);
    const bodyWrap = el('div', 'bd-sheet-body');
    bodyWrap.appendChild(body);
    sheet.append(head, bodyWrap);
    veil.appendChild(sheet);
    root.appendChild(veil);
    sheets.push(self);
    void veil.offsetWidth;
    veil.classList.add('is-on');
    return self;
  }

  // 図鑑の一枚
  function showZukanCard(id: string): Promise<void> {
    const z = ZUKAN.find((e) => e.id === id);
    if (!z) return Promise.resolve();
    const list = (items: { name: string; reading?: string; meaning: string }[]) =>
      '<dl>' + items.map((a) => `<dt>${a.reading ? r(a.name, a.reading) : a.name}</dt><dd>${a.meaning}</dd>`).join('') + '</dl>';
    const body = el('div', 'bd-card');
    body.innerHTML =
      (MOTIF[z.id] ?? LOTUS).replace('class="bd-ico"', 'class="bd-ico bd-card-motif"') +
      `<div class="bd-card-head"><h3 class="bd-card-name">${r(z.name, z.reading)}</h3>` +
      `<p class="bd-card-rankline">${r('位', 'くらい')}<span class="bd-card-rank">${z.rank}</span></p></div>` +
      `<div class="bd-card-text"><p class="bd-card-sum">${z.summary}</p>` +
      `<h3>持ち物の意味</h3>${list(z.attributes)}` +
      `<h3>手の形（${r('印相', 'いんぞう')}）の意味</h3>${list(z.mudra)}` +
      `<p class="bd-card-note">${z.note}</p></div>`;
    return new Promise<void>((res) => {
      openSheet(r('図鑑', 'ずかん'), LOTUS, body, res);
    });
  }

  function showZukanList(unlocked: string[]) {
    const body = el('div', 'bd-zlist');
    for (const z of ZUKAN) {
      const open = unlocked.includes(z.id);
      const tile = el('button', 'bd-ztile',
        open
          ? `<span class="bd-ztile-name">${r(z.name, z.reading)}</span><span class="bd-ztile-rank">${z.rank}</span>`
          : '<span class="bd-ztile-name">？</span><span class="bd-ztile-rank">&nbsp;</span>');
      tile.type = 'button';
      tile.disabled = !open;
      if (open) tile.addEventListener('click', () => { void showZukanCard(z.id); });
      else tile.setAttribute('aria-label', 'まだ出会っていない');
      body.appendChild(tile);
    }
    if (!unlocked.some((id) => ZUKAN.some((z) => z.id === id))) {
      body.appendChild(el('p', 'bd-zlist-empty', '出会った方が、ここに記されていきます。'));
    }
    const tree = button('bd-btn', '成長の木', () => showVirtueTree(ctx ? ctx.virtues : []));
    openSheet(r('図鑑', 'ずかん'), LOTUS, body, undefined, ctx ? [tree] : []);
  }

  // 成長の木
  function showVirtueTree(virtues: string[]) {
    const tree = el('div', 'bd-tree');
    tree.innerHTML =
      '<svg class="bd-tree-trunk" viewBox="0 0 40 620" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M20 620 C14 560 26 520 21 470 S13 380 20 330 S27 240 19 180 S15 80 20 4" stroke-width="2.4" vector-effect="non-scaling-stroke"/>' +
      '<path d="M23 616 C18 556 29 512 24 466 S17 372 23 322 S30 236 22 176" stroke-width="0.8" opacity=".35" vector-effect="non-scaling-stroke"/></svg>' +
      `<div class="bd-tree-root">${LOTUS}</div>`;
    VIRTUE_NODES.forEach((v, i) => {
      const got = virtues.includes(v.id) || virtues.includes(v.name) || v.alias.some((a) => virtues.includes(a));
      const node = el('div', `bd-tnode ${i % 2 ? 'is-l' : 'is-r'}${got ? ' is-got' : ''}`,
        `<i class="bd-tnode-dot"></i><div><span class="bd-tnode-ch">${v.chapter}</span><span class="bd-tnode-name">${v.html}</span></div>`);
      tree.appendChild(node);
    });
    const s = openSheet('成長の木', LOTUS, tree);
    // 根（序章）から見えるように、いちばん下へ
    const sc = s.el.querySelector('.bd-sheet-body') as HTMLElement;
    sc.scrollTop = sc.scrollHeight;
  }

  // 章を選ぶ
  function showChapterSelect(reached: number) {
    const body = el('div', 'bd-chapters');
    let sheet: Sheet | null = null;
    CHAPTERS.forEach((c, i) => {
      const ok = i <= reached && IMPLEMENTED.has(i);
      const b = vbutton(`<b>${c.label}</b>${c.name}${ok ? '' : '<i>準備中</i>'}`, () => {
        if (!ok) return;
        if (sheet) sheet.close();
        h.onChapterSelect(i);
      });
      b.disabled = !ok;
      body.appendChild(b);
    });
    sheet = openSheet('章を選ぶ', WHEEL, body);
  }

  // 設定
  function showSettings(s: Settings) {
    let cur: Settings = { ...s };
    if (ctx) ctx.settings = cur;
    const body = el('div', 'bd-set');
    const commit = <K extends keyof Settings>(k: K, v: Settings[K]) => {
      if (cur[k] === v) return;
      cur = { ...cur, [k]: v };
      if (ctx) ctx.settings = cur;
      h.onSettings({ ...cur });
    };
    const heading = (html: string) => body.appendChild(el('h3', 'bd-set-h', html));
    const row = (labelHtml: string, control: HTMLElement) => {
      const rowEl = el('div', 'bd-row');
      rowEl.appendChild(el('div', 'bd-row-l', labelHtml));
      rowEl.appendChild(control);
      body.appendChild(rowEl);
    };
    const seg = <K extends keyof Settings>(labelHtml: string, k: K, opts: [Settings[K], string][]) => {
      const box = el('div', 'bd-seg');
      box.setAttribute('role', 'group');
      const btns = opts.map(([v, html]) => {
        const b = button('bd-opt', html, () => {
          commit(k, v);
          btns.forEach((o, i) => o.setAttribute('aria-pressed', String(opts[i][0] === v)));
        });
        b.setAttribute('aria-pressed', String(cur[k] === v));
        box.appendChild(b);
        return b;
      });
      row(labelHtml, box);
    };
    type NumKey = 'volMusic' | 'volSfx' | 'volAmbience' | 'lookSpeed' | 'vrHeightOffset';
    const range = (labelHtml: string, label: string, k: NumKey, min: number, max: number, step: number, fmt: (v: number) => string) => {
      const box = el('div', 'bd-range');
      const input = el('input');
      input.type = 'range';
      input.min = String(min);
      input.max = String(max);
      input.step = String(step);
      input.value = String(cur[k]);
      input.setAttribute('aria-label', label);
      const outEl = el('output', '', fmt(cur[k]));
      input.addEventListener('input', () => {
        const v = Math.min(max, Math.max(min, Number(input.value)));
        outEl.textContent = fmt(v);
        commit(k, Math.round(v * 100) / 100);
      });
      box.append(input, outEl);
      row(labelHtml, box);
    };
    const pct = (v: number) => Math.round(v * 100) + '％';
    const yesNo: [boolean, string][] = [[true, 'する'], [false, 'しない']];

    heading('歩み方');
    seg('難しさ', 'difficulty', [['story', '物語を味わう'], ['standard', '標準'], ['ascetic', r('修行', 'しゅぎょう')]]);
    heading('絵');
    seg('画質', 'quality', [['auto', '自動'], ['low', '低'], ['mid', '中'], ['high', '高']]);
    heading('音');
    range('音楽', '音楽', 'volMusic', 0, 1, 0.05, pct);
    range('効果音', '効果音', 'volSfx', 0, 1, 0.05, pct);
    range('環境音', '環境音', 'volAmbience', 0, 1, 0.05, pct);
    heading('視点');
    range('視点の速さ', '視点の速さ', 'lookSpeed', 0.5, 2, 0.1, (v) => v.toFixed(1) + ' 倍');
    seg('上下を逆にする', 'invertY', yesNo);
    heading('<span>VR</span>');
    seg(r('旋回', 'せんかい'), 'vrSnapTurn', [[false, 'なめらか'], [true, '30度ずつ']]);
    seg('座って遊ぶ', 'vrSeated', yesNo);
    seg('視野の周辺を暗くする', 'vrVignette', yesNo);
    range('身長の調整', '身長の調整', 'vrHeightOffset', -0.3, 0.3, 0.05,
      (v) => (v > 0.001 ? '＋' : v < -0.001 ? '−' : '±') + Math.abs(v).toFixed(2) + ' m');

    openSheet('設定', WHEEL, body);
  }

  // ───────── 小休止 ─────────
  const pause = el('div', 'bd-pause', `<h2 class="bd-pause-head">${LOTUS}<span>小休止</span></h2>`);
  const pauseMenu = el('div', 'bd-vmenu');
  pause.appendChild(pauseMenu);
  root.appendChild(pause);
  let pauseOn = false;
  const pauseAct = (a: 'resume' | 'photo' | 'title' | 'retry') => {
    if (!pauseOn) return;
    hidePause();
    h.onPause(a);
  };
  pauseMenu.append(
    vbutton('つづける', () => pauseAct('resume')),
    vbutton('遊び方', () => window.dispatchEvent(new CustomEvent('bodhi-howto'))),
    vbutton('静止画モード', () => pauseAct('photo')),
    vbutton('設定', () => {
      if (ctx) showSettings(ctx.settings);
      else toast('設定を開けませんでした');
    }),
    vbutton(r('図鑑', 'ずかん'), () => showZukanList(ctx ? ctx.zukan : [])),
    vbutton('この段からやり直す', () => pauseAct('retry')),
    vbutton(r('題字', 'だいじ') + 'へ戻る', () => pauseAct('title')),
  );
  function showPause() {
    if (pauseOn) return;
    pauseOn = true;
    pause.classList.add('is-on');
    (pauseMenu.firstElementChild as HTMLElement).focus({ preventScroll: true });
  }
  function hidePause() {
    pauseOn = false;
    pause.classList.remove('is-on');
    if (document.activeElement instanceof HTMLElement && pause.contains(document.activeElement)) document.activeElement.blur();
  }

  // ───────── 印可 ─────────
  let inkaClose: (() => void) | null = null;
  function showInka(virtue: string, reading: string, desc: string): Promise<void> {
    if (inkaClose) inkaClose();
    const box = el('div', 'bd-inka');
    box.innerHTML =
      `<h2 class="bd-inka-name">${reading ? `<ruby>${esc(virtue)}<rt>${esc(reading)}</rt></ruby>` : esc(virtue)}</h2>` +
      '<div class="bd-inka-side"><div class="bd-inka-seal">印可</div>' +
      `<p class="bd-inka-desc">${rich(desc)}</p><p class="bd-inka-tap">画面に触れて閉じる</p></div>`;
    root.appendChild(box);
    void box.offsetWidth;
    box.classList.add('is-on');
    const at = performance.now();
    return new Promise<void>((res) => {
      let closed = false;
      const close = () => {
        if (closed) return;
        closed = true;
        inkaClose = null;
        box.style.transition = 'opacity 0.5s ease';
        box.style.opacity = '0';
        box.style.pointerEvents = 'none';
        window.setTimeout(() => { box.remove(); res(); }, 520);
      };
      inkaClose = close;
      box.addEventListener('click', () => { if (performance.now() - at > 1500) close(); });
    });
  }

  // ───────── 静止画モード ─────────
  const photoBack = button('bd-photoback', '戻る', () => h.onPhotoExit());
  root.appendChild(photoBack);
  function setPhotoMode(on: boolean) {
    root.classList.toggle('bd-photo', on);
  }

  // ───────── 場面転換 ─────────
  const washEl = el('div', 'bd-washlayer');
  root.appendChild(washEl);
  const css = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' ? CSS : null;
  const maskOk = !!css &&
    (css.supports('mask-image', 'radial-gradient(#000, transparent)') || css.supports('-webkit-mask-image', 'radial-gradient(#000, transparent)')) &&
    css.supports('width', 'calc(max(0, 0.5) * 10vmax)');
  if (!maskOk) washEl.classList.add('is-fade');
  let washSeq = 0;
  let washRaf = 0;
  function wash(cover: boolean, ms = 900): Promise<void> {
    const seq = ++washSeq;
    cancelAnimationFrame(washRaf);
    return new Promise<void>((res) => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        if (seq === washSeq) {
          washEl.classList.remove('is-busy');
          washEl.classList.toggle('is-full', cover);
          washEl.style.setProperty('--w', cover ? '1' : '0');
        }
        res();
      };
      // 画面が裏にあって描画が止まっていても、必ず終わらせる
      window.setTimeout(finish, ms + 250);

      if (!maskOk) {
        washEl.style.setProperty('--ms', ms + 'ms');
        washEl.classList.add('is-busy');
        void washEl.offsetWidth;
        washEl.classList.toggle('is-full', cover);
        window.setTimeout(finish, ms + 30);
        return;
      }
      const start = performance.now();
      washEl.style.setProperty('--w', cover ? '0' : '1');
      washEl.classList.add('is-busy');
      washEl.classList.remove('is-full');
      const step = (now: number) => {
        if (seq !== washSeq || finished) return;
        const t = clamp01((now - start) / ms);
        // 染みは初め速く、のちにゆっくり広がる。引くときは逆
        const e = cover ? 1 - Math.pow(1 - t, 2.2) : Math.pow(1 - t, 1.7);
        washEl.style.setProperty('--w', e.toFixed(4));
        if (t < 1) washRaf = requestAnimationFrame(step);
        else finish();
      };
      washRaf = requestAnimationFrame(step);
    });
  }

  // ───────── 不具合の知らせ ─────────
  let fatalOn = false;
  function fatal(message: string) {
    fatalOn = true;
    root.querySelector('.bd-fatal')?.remove();
    const box = el('div', 'bd-fatal');
    const inner = el('div', 'bd-fatal-in', LOTUS + `<p class="bd-fatal-msg">${rich(message)}</p>`);
    inner.appendChild(button('bd-btn', '読み込み直す', () => window.location.reload()));
    box.appendChild(inner);
    root.appendChild(box);
    hideLoading();
  }

  // ───────── 縦持ちの案内 ─────────
  root.appendChild(el('div', 'bd-rotate',
    '<span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 3.2 H14 C14.8 3.2 15.3 3.8 15.3 4.5 V10"/><path d="M6.9 4.5 V9.6"/>' +
    '<path d="M4 13 H19.6 C20.4 13 20.9 13.6 20.9 14.3 V19.5 C20.9 20.3 20.3 20.8 19.6 20.8 H4.2 C3.5 20.8 3 20.2 3 19.5 V14.2 C3 13.5 3.4 13 4 13Z"/>' +
    '<path d="M18.4 6.2 C19.8 7.2 20.6 8.6 20.7 10.2 M20.7 10.2 L19 9 M20.7 10.2 L21.8 8.4"/></svg>横向きにしてください</span>'));

  // ───────── 鍵盤での操作 ─────────
  function anyModal(): boolean {
    return titleOn || pauseOn || loadingOn || fatalOn || sheets.length > 0 || inkaClose !== null;
  }
  const focusScope = (): HTMLElement | null => {
    if (fatalOn) return root.querySelector('.bd-fatal');
    if (inkaClose) return null;
    if (sheets.length) return sheets[sheets.length - 1].el;
    if (pauseOn) return pause;
    if (titleOn) return title;
    return null;
  };
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (inkaClose) { e.preventDefault(); if (!e.repeat) root.querySelector<HTMLElement>('.bd-inka')?.click(); return; }
      if (e.key === 'Enter' && subResolve && !anyModal()) { skipSubtitle(); return; }
      return;
    }
    if (e.key === 'Escape') {
      if (e.repeat || fatalOn) return;
      if (inkaClose) root.querySelector<HTMLElement>('.bd-inka')?.click();
      else if (sheets.length) sheets[sheets.length - 1].close();
      else if (pauseOn) pauseAct('resume');
      else if (root.classList.contains('bd-photo')) h.onPhotoExit();
      return;
    }
    const next = e.key === 'ArrowDown' || e.key === 'ArrowLeft';
    const prev = e.key === 'ArrowUp' || e.key === 'ArrowRight';
    if (!next && !prev) return;
    const scope = focusScope();
    if (!scope) return;
    const active = document.activeElement;
    if (active instanceof HTMLInputElement && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
    const items = Array.from(scope.querySelectorAll<HTMLElement>('button:not(:disabled), input'));
    if (!items.length) return;
    e.preventDefault();
    const i = active instanceof HTMLElement ? items.indexOf(active) : -1;
    const n = i < 0 ? 0 : (i + (next ? 1 : -1) + items.length) % items.length;
    items[n].focus();
  });

  return {
    showTitle, hideTitle, showLoading, hideLoading, setHud, subtitle, chapterCard,
    showZukanCard, showZukanList, showInka, showVirtueTree, showChapterSelect, showSettings,
    showPause, hidePause, setPhotoMode, wash, toast, fatal,
    get anyModalOpen() { return anyModal(); },
    setContext(c: UIContext) { ctx = c; },
  };
}

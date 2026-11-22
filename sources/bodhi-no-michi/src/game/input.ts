// 入力：キーボード・マウス・ゲームパッド・タッチ（仮想スティックと筆文字のボタン）
import '../ui/ui.css';
import type { Action, Input, InputState } from './contracts';

const ACTIONS: Action[] = ['light', 'heavy', 'guard', 'dodge', 'breathe', 'pause', 'interact', 'touchEarth'];
type Flags = Record<Action, boolean>;
const flags = (): Flags => ({
  light: false, heavy: false, guard: false, dodge: false,
  breathe: false, pause: false, interact: false, touchEarth: false,
});

const KEY_ACTION: Record<string, Action> = {
  KeyJ: 'light', KeyK: 'heavy', KeyL: 'guard', ShiftLeft: 'guard', ShiftRight: 'guard',
  Space: 'dodge', KeyE: 'breathe', KeyQ: 'breathe', KeyF: 'interact', KeyG: 'touchEarth',
  Escape: 'pause', KeyP: 'pause',
};
const MOVE_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

// ゲームパッド（standard）。十字の上＝調べる、下＝地に触れる は補助として割り当て
const PAD_BUTTONS: [number, Action][] = [
  [2, 'light'], [3, 'heavy'], [4, 'guard'], [5, 'guard'], [0, 'dodge'], [1, 'breathe'],
  [9, 'pause'], [12, 'interact'], [13, 'touchEarth'],
];
const PAD_LOOK = 0.045;
const PAD_DEAD = 0.18;
const TOUCH_LOOK = 0.005;
const MOUSE_LOOK = 0.004;

const RING_SVG =
  '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4 C76 3 97 24 96 50 C95 77 75 97 49 96 C23 95 3 75 4 49 C5 24 25 5 50 4Z"/>' +
  '<path class="bd-ring-2" d="M50 9 C72 8 92 27 91 50 C90 73 72 92 50 91"/></svg>';

interface TouchButton { el: HTMLElement; action: Action; pointer: number }

export function createInput(
  canvas: HTMLCanvasElement,
  uiRoot: HTMLElement,
): Input & { showContext(label: string | null, action: Action): void; highlight(action: Action | null): void } {
  const ac = new AbortController();
  const sig = { signal: ac.signal } as const;
  const sigActive = { signal: ac.signal, passive: false } as const;

  let enabled = true;
  let enabledAt = 0;
  let touchVisible = false;
  // iPad・iPhone では最初からボタンを出す（iPadOS の Safari は Mac を名乗るので maxTouchPoints で見る）
  let touchSeen = (navigator.maxTouchPoints ?? 0) > 0 || matchMedia('(pointer: coarse)').matches;
  let usingTouch = false;

  const keys = new Set<string>();
  const kbHeld = flags();
  const mouseHeld = flags();
  const touchHeld = flags();
  const padPrev = flags();
  const pending = flags();
  let lookX = 0;
  let lookY = 0;

  const out: InputState = {
    moveX: 0, moveY: 0, lookX: 0, lookY: 0, held: flags(), pressed: flags(), usingTouch: false,
  };

  canvas.style.touchAction = 'none';
  canvas.style.userSelect = 'none';
  canvas.style.setProperty('-webkit-user-select', 'none');
  canvas.style.setProperty('-webkit-touch-callout', 'none');
  canvas.style.setProperty('-webkit-tap-highlight-color', 'transparent');

  const press = (a: Action, ev?: Event) => {
    // メニューを閉じたのと同じ操作で、すぐ次の入力が入らないようにする
    if (!enabled || (ev && ev.timeStamp <= enabledAt)) return;
    pending[a] = true;
  };

  // ───────── タッチ用の DOM ─────────
  const tc = document.createElement('div');
  tc.className = 'bd-tc';
  const stick = document.createElement('div');
  stick.className = 'bd-stick';
  stick.innerHTML = RING_SVG + '<i class="bd-stick-knob"></i>';
  const knob = stick.querySelector('.bd-stick-knob') as HTMLElement;
  tc.appendChild(stick);

  const buttons: TouchButton[] = [];
  const makeButton = (label: string, action: Action, cls: string): TouchButton => {
    const el = document.createElement('div');
    el.className = 'bd-tbtn ' + cls;
    el.setAttribute('role', 'button');
    el.innerHTML = RING_SVG + '<span>' + label + '</span>';
    el.dataset.action = action;
    tc.appendChild(el);
    const b: TouchButton = { el, action, pointer: -1 };
    buttons.push(b);
    const down = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (b.pointer !== -1) return;
      b.pointer = e.pointerId;
      try { el.setPointerCapture(e.pointerId); } catch { /* 取れなくても続ける */ }
      noteTouch();
      touchHeld[b.action] = true;
      press(b.action, e);
      el.classList.add('is-down');
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== b.pointer) return;
      b.pointer = -1;
      el.classList.remove('is-down');
      touchHeld[b.action] = buttons.some((o) => o !== b && o.pointer !== -1 && o.action === b.action);
    };
    el.addEventListener('pointerdown', down, sigActive);
    el.addEventListener('pointerup', up, sig);
    el.addEventListener('pointercancel', up, sig);
    el.addEventListener('lostpointercapture', up, sig);
    el.addEventListener('contextmenu', (e) => e.preventDefault(), sig);
    return b;
  };
  const bLight = makeButton('攻<small>せめる</small>', 'light', 'bd-tbtn-main');
  const arc: [TouchButton, number][] = [
    [makeButton('重<small>つよく</small>', 'heavy', ''), 2],
    [makeButton('躱<small>かわす</small>', 'dodge', ''), 37],
    [makeButton('受<small>うける</small>', 'guard', ''), 72],
    [makeButton('息<small>ととのえる</small>', 'breathe', ''), 107],
  ];
  const ctx = makeButton('', 'interact', 'bd-tbtn-ctx');
  ctx.el.hidden = true;
  uiRoot.appendChild(tc);

  let stickRadius = 60;
  const layout = () => {
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    const k = Math.min(1.35, Math.max(1, minDim / 400));
    const safe = (side: 'right' | 'bottom', px: number) =>
      `calc(env(safe-area-inset-${side}, 0px) + ${Math.round(px)}px)`;
    const place = (el: HTMLElement, size: number, cxr: number, cyb: number) => {
      el.style.width = el.style.height = Math.round(size) + 'px';
      el.style.right = safe('right', cxr - size / 2);
      el.style.bottom = safe('bottom', cyb - size / 2);
    };
    const cx = 80 * k;
    const cy = 72 * k;
    place(bLight.el, 88 * k, cx, cy);
    const R = 128 * k;
    for (const [b, deg] of arc) {
      const a = (deg * Math.PI) / 180;
      place(b.el, 66 * k, cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    }
    ctx.el.style.right = safe('right', 176 * k);
    ctx.el.style.bottom = safe('bottom', 214 * k);
    const d = Math.round(Math.min(240, Math.max(120, minDim * 0.42)));
    stickRadius = d / 2;
    stick.style.width = stick.style.height = d + 'px';
    stick.style.margin = `${-d / 2}px 0 0 ${-d / 2}px`;
  };
  layout();
  window.addEventListener('resize', layout, sig);
  window.addEventListener('orientationchange', layout, sig);

  // ───────── 仮想スティックと視点 ─────────
  let stickId = -1;
  let stickOX = 0, stickOY = 0, stickX = 0, stickY = 0;
  let lookId = -1;
  let lastX = 0, lastY = 0;
  let mouseDown = false;

  const releaseStick = () => {
    stickId = -1;
    stickX = stickY = 0;
    stick.classList.remove('is-on');
  };
  const releaseTouches = () => {
    releaseStick();
    lookId = -1;
    for (const b of buttons) {
      b.pointer = -1;
      b.el.classList.remove('is-down');
    }
    for (const a of ACTIONS) touchHeld[a] = false;
  };
  const refreshVisible = () => {
    const on = touchSeen && touchVisible && enabled;
    tc.classList.toggle('is-on', on);
    if (!on) releaseTouches();
  };
  function noteTouch() {
    usingTouch = true;
    if (!touchSeen) {
      touchSeen = true;
      refreshVisible();
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') {
      usingTouch = false;
      mouseDown = true;
      lastX = e.clientX; lastY = e.clientY;
      try { canvas.setPointerCapture(e.pointerId); } catch { /* 続ける */ }
      if (e.button === 0) { mouseHeld.light = true; press('light', e); }
      else if (e.button === 2) { mouseHeld.heavy = true; press('heavy', e); }
      e.preventDefault();
      return;
    }
    e.preventDefault();
    noteTouch();
    try { canvas.setPointerCapture(e.pointerId); } catch { /* 続ける */ }
    if (!enabled) return;
    if (stickId === -1 && e.clientX < window.innerWidth / 2) {
      stickId = e.pointerId;
      stickOX = e.clientX; stickOY = e.clientY;
      stickX = stickY = 0;
      stick.style.transform = `translate3d(${stickOX}px,${stickOY}px,0)`;
      knob.style.transform = 'translate3d(0,0,0)';
      stick.classList.add('is-on');
    } else if (lookId === -1) {
      lookId = e.pointerId;
      lastX = e.clientX; lastY = e.clientY;
    }
  }, sigActive);

  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') {
      if (mouseDown && e.buttons !== 0 && enabled) {
        lookX += (e.clientX - lastX) * MOUSE_LOOK;
        lookY -= (e.clientY - lastY) * MOUSE_LOOK;
      }
      lastX = e.clientX; lastY = e.clientY;
      return;
    }
    if (e.pointerId === stickId) {
      const max = stickRadius * 0.78;
      let dx = e.clientX - stickOX;
      let dy = e.clientY - stickOY;
      const len = Math.hypot(dx, dy);
      if (len > max) { dx *= max / len; dy *= max / len; }
      knob.style.transform = `translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0)`;
      const n = Math.min(1, len / max);
      const m = n < 0.12 ? 0 : (n - 0.12) / 0.88;
      const inv = len > 0 ? m / len : 0;
      stickX = (e.clientX - stickOX) * inv;
      stickY = -(e.clientY - stickOY) * inv;
    } else if (e.pointerId === lookId) {
      if (enabled) {
        lookX += (e.clientX - lastX) * TOUCH_LOOK;
        lookY -= (e.clientY - lastY) * TOUCH_LOOK;
      }
      lastX = e.clientX; lastY = e.clientY;
    }
  }, sig);

  const pointerEnd = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') {
      if (e.type === 'pointercancel' || e.buttons === 0) {
        mouseDown = false;
        mouseHeld.light = mouseHeld.heavy = false;
      } else if (e.button === 0) mouseHeld.light = false;
      else if (e.button === 2) mouseHeld.heavy = false;
      return;
    }
    if (e.pointerId === stickId) releaseStick();
    if (e.pointerId === lookId) lookId = -1;
  };
  canvas.addEventListener('pointerup', pointerEnd, sig);
  canvas.addEventListener('pointercancel', pointerEnd, sig);
  canvas.addEventListener('contextmenu', (e) => e.preventDefault(), sig);

  // ───────── キーボード ─────────
  const isField = (t: EventTarget | null) =>
    t instanceof HTMLElement && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT');

  window.addEventListener('keydown', (e) => {
    if (isField(e.target)) return;
    const a = KEY_ACTION[e.code];
    const move = MOVE_KEYS.has(e.code);
    if (!a && !move) return;
    usingTouch = false;
    if (enabled && (move || e.code === 'Space')) e.preventDefault();
    if (move) { keys.add(e.code); return; }
    if (e.repeat) return;
    keys.add(e.code);
    kbHeld[a] = true;
    press(a, e);
  }, sigActive);

  window.addEventListener('keyup', (e) => {
    keys.delete(e.code);
    const a = KEY_ACTION[e.code];
    if (!a) return;
    let still = false;
    for (const code of keys) if (KEY_ACTION[code] === a) still = true;
    kbHeld[a] = still;
  }, sig);

  const clearAll = () => {
    keys.clear();
    mouseDown = false;
    for (const a of ACTIONS) kbHeld[a] = mouseHeld[a] = pending[a] = false;
    lookX = lookY = 0;
    releaseTouches();
  };
  window.addEventListener('blur', clearAll, sig);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearAll(); }, sig);

  // ───────── ゲームパッド ─────────
  const padHeld = flags();
  let padMX = 0, padMY = 0;
  const dead = (v: number) => {
    const s = Math.abs(v);
    return s < PAD_DEAD ? 0 : (Math.sign(v) * (s - PAD_DEAD)) / (1 - PAD_DEAD);
  };
  const pollPad = () => {
    padMX = padMY = 0;
    for (const a of ACTIONS) padHeld[a] = false;
    let pad: Gamepad | null = null;
    try {
      const list = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const p of list) {
        if (p && p.connected && (!pad || (p.mapping === 'standard' && pad.mapping !== 'standard'))) pad = p;
      }
    } catch { /* 使えない環境 */ }
    if (pad) {
      padMX = dead(pad.axes[0] ?? 0);
      padMY = -dead(pad.axes[1] ?? 0);
      const rx = dead(pad.axes[2] ?? 0);
      const ry = dead(pad.axes[3] ?? 0);
      if (enabled) { lookX += rx * PAD_LOOK; lookY -= ry * PAD_LOOK; }
      for (const [i, a] of PAD_BUTTONS) if (pad.buttons[i]?.pressed) padHeld[a] = true;
      if (padMX || padMY || rx || ry || ACTIONS.some((a) => padHeld[a])) usingTouch = false;
    }
    for (const a of ACTIONS) {
      if (padHeld[a] && !padPrev[a] && enabled) pending[a] = true;
      padPrev[a] = padHeld[a];
    }
  };

  const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

  return {
    update(): InputState {
      pollPad();
      out.usingTouch = usingTouch;
      if (!enabled) {
        out.moveX = out.moveY = out.lookX = out.lookY = 0;
        for (const a of ACTIONS) out.held[a] = out.pressed[a] = pending[a] = false;
        lookX = lookY = 0;
        return out;
      }
      let mx = stickX + padMX;
      let my = stickY + padMY;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) mx -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) mx += 1;
      if (keys.has('KeyW') || keys.has('ArrowUp')) my += 1;
      if (keys.has('KeyS') || keys.has('ArrowDown')) my -= 1;
      const len = Math.hypot(mx, my);
      if (len > 1) { mx /= len; my /= len; }
      out.moveX = clamp1(mx);
      out.moveY = clamp1(my);
      out.lookX = lookX;
      out.lookY = lookY;
      lookX = lookY = 0;
      for (const a of ACTIONS) {
        out.held[a] = kbHeld[a] || mouseHeld[a] || touchHeld[a] || padHeld[a];
        out.pressed[a] = pending[a];
        pending[a] = false;
      }
      return out;
    },
    setEnabled(b: boolean) {
      if (b === enabled) return;
      enabled = b;
      enabledAt = performance.now();
      for (const a of ACTIONS) pending[a] = false;
      lookX = lookY = 0;
      refreshVisible();
    },
    setTouchVisible(b: boolean) {
      touchVisible = b;
      refreshVisible();
    },
    /** 次に押すボタンを朱で光らせる（遊び方の手引き） */
    highlight(action: Action | null) {
      for (const b of buttons) b.el.classList.toggle('is-cue', action !== null && b.action === action);
    },
    showContext(label: string | null, action: Action) {
      if (label === null || label === '') {
        if (!ctx.el.hidden) {
          ctx.el.hidden = true;
          if (ctx.pointer !== -1) {
            ctx.pointer = -1;
            ctx.el.classList.remove('is-down');
            touchHeld[ctx.action] = false;
          }
        }
        return;
      }
      if (ctx.action !== action && ctx.pointer !== -1) touchHeld[ctx.action] = false;
      ctx.action = action;
      const span = ctx.el.querySelector('span') as HTMLElement;
      if (span.textContent !== label) span.textContent = label;
      ctx.el.hidden = false;
    },
    dispose() {
      ac.abort();
      tc.remove();
    },
  };
}

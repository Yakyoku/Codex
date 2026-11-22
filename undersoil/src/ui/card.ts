// 初登場時の紹介カード（画面版は HTML）。字幕と、ブラウザの読み上げ機能による仮のナレーションを付ける。
import './card.css';
import type { Species } from '../game/species';

export type IntroMode = 'all' | 'name' | 'off';
export function introMode(): IntroMode { try { const v = localStorage.getItem('undersoil.intro'); if (v === 'name' || v === 'off') return v; } catch { /* noop */ } return 'all'; }

let el: HTMLElement | null = null; let timer = 0; let onDone: (() => void) | null = null;
function root() {
  if (el) return el;
  el = document.createElement('div'); el.className = 'card'; el.setAttribute('role', 'status');
  el.innerHTML = '<div class="card-tag">はじめての出会い</div><h2></h2><div class="sci"></div><div class="size"><b></b><span></span></div><p></p><div class="card-foot"><button class="btn skip">次へ</button><i class="life"></i></div>';
  document.body.append(el);
  el.querySelector('.skip')!.addEventListener('click', () => hideCard());
  addEventListener('keydown', (e) => { if (e.code === 'Enter' && el!.classList.contains('show')) hideCard(); });
  return el;
}
function narrate(text: string) {
  try {
    const synth = window.speechSynthesis; if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.92; u.pitch = 0.95; u.volume = 0.9;
    const v = synth.getVoices().find((x) => x.lang.startsWith('ja')); if (v) u.voice = v;
    synth.speak(u);
  } catch { /* 読み上げが使えない機器では字幕だけ */ }
}
export function showCard(s: Species, opts: { narration?: boolean; done?: () => void; holdMs?: number } = {}) {
  const mode = introMode(); if (mode === 'off') { opts.done?.(); return; }
  const r = root(); onDone = opts.done ?? null;
  r.querySelector('.card-tag')!.textContent = s.kind === 'organism' ? 'はじめての出会い' : '土のしくみ';
  r.querySelector('h2')!.textContent = s.title ?? s.nameJa;
  r.querySelector('.sci')!.textContent = s.sci ?? '';
  r.querySelector('.size b')!.textContent = s.size; r.querySelector('.size span')!.textContent = s.sizeCompare;
  r.querySelector('p')!.textContent = mode === 'name' ? '' : s.intro;
  r.classList.toggle('name-only', mode === 'name');
  // 表示は 5〜8 秒（文の長さに合わせる）
  const ms = opts.holdMs ?? (mode === 'name' ? 3500 : Math.max(5000, Math.min(8000, 2500 + s.intro.length * 90)));
  const life = r.querySelector('.life') as HTMLElement; life.style.transition = 'none'; life.style.width = '100%';
  requestAnimationFrame(() => { r.classList.add('show'); life.style.transition = `width ${ms}ms linear`; life.style.width = '0%'; });
  if (opts.narration !== false && mode === 'all') narrate(`${s.nameJa}。${s.intro}`);
  clearTimeout(timer); timer = window.setTimeout(hideCard, ms);
}
export function hideCard() { if (!el) return; clearTimeout(timer); el.classList.remove('show'); try { window.speechSynthesis?.cancel(); } catch { /* noop */ } const d = onDone; onDone = null; d?.(); }

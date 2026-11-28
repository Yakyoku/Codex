// 初登場時の紹介カード（画面版は HTML）。字幕と、ブラウザの読み上げ機能による仮のナレーションを付ける。
import './card.css';
import type { Species } from '../game/species';
import ASKS from '../data/asks.json';
/** 紹介のあとの問いかけ（答えは図鑑で見つかる） */
export const askOf = (id: string) => (ASKS as unknown as Record<string, { q: string; a: string } | undefined>)[id];

export type IntroMode = 'all' | 'name' | 'off';
export function introMode(): IntroMode { try { const v = localStorage.getItem('undersoil.intro'); if (v === 'name' || v === 'off') return v; } catch { /* noop */ } return 'all'; }

let el: HTMLElement | null = null; let timer = 0; let onDone: (() => void) | null = null;
function root() {
  if (el) return el;
  el = document.createElement('div'); el.className = 'card'; el.setAttribute('role', 'status');
  el.innerHTML = '<div class="card-tag">はじめての出会い</div><div class="card-where">✦ 画面で金色に光っているもの</div><h2></h2><div class="sci"></div><div class="size"><b></b><span></span></div><p></p><div class="card-ask"></div><div class="card-foot"><button class="btn skip">次へ</button><i class="life"></i></div>';
  document.body.append(el);
  el.querySelector('.skip')!.addEventListener('click', () => hideCard());
  addEventListener('keydown', (e) => { if (e.code === 'Enter' && el!.classList.contains('show')) hideCard(); });
  return el;
}
/** ナレーションの声：既定は、やさしい女性の声（端末にある日本語の声から、女性の声を名前で選ぶ）。設定で、声と速さを選べる */
const FEMALE = /kyoko|o-ren|nanami|haruka|ayumi|sayaka|mizuki|female|女性|google 日本語/i, MALE = /otoya|hattori|ichiro|keita|daichi|\bmale\b|男性/i;
export function jaVoices() { try { return (window.speechSynthesis?.getVoices() ?? []).filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('ja')); } catch { return []; } }
export function pickVoice(): SpeechSynthesisVoice | null {
  const all = jaVoices(); let want = 'auto'; try { want = localStorage.getItem('undersoil.voice') ?? 'auto'; } catch { /* noop */ }
  if (want !== 'auto') { const v = all.find((x) => x.name === want); if (v) return v; }
  return all.find((x) => FEMALE.test(x.name) && !MALE.test(x.name)) ?? all.find((x) => !MALE.test(x.name)) ?? all[0] ?? null;
}
export function voiceRate() { let r = 'normal'; try { r = localStorage.getItem('undersoil.rate') ?? 'normal'; } catch { /* noop */ } return r === 'slow' ? 0.78 : r === 'fast' ? 1.15 : 0.95; }
let lastText = '';
export function narrate(text: string) {
  try {
    const synth = window.speechSynthesis; if (!synth) return; lastText = text;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = voiceRate(); u.pitch = 1.08; u.volume = 0.95;   // やさしく、少しゆっくり
    const v = pickVoice(); if (v) u.voice = v;
    synth.speak(u);
  } catch { /* 読み上げが使えない機器では字幕だけ */ }
}
// 端末の声の一覧は、あとから届くことがある
try { window.speechSynthesis?.addEventListener?.('voiceschanged', () => { /* 次の読み上げで選び直す */ }); } catch { /* noop */ }
export function showCard(s: Species, opts: { narration?: boolean; done?: () => void; holdMs?: number; pointing?: boolean } = {}) {
  const mode = introMode(); if (mode === 'off') { opts.done?.(); return; }
  const r = root(); onDone = opts.done ?? null;
  r.querySelector('.card-tag')!.textContent = s.kind === 'organism' ? 'はじめての出会い' : '土のしくみ';
  r.querySelector('h2')!.textContent = s.title ?? s.nameJa;
  r.classList.toggle('pointing', !!opts.pointing);
  r.querySelector('.sci')!.textContent = s.sci ?? '';
  r.querySelector('.size b')!.textContent = s.size; r.querySelector('.size span')!.textContent = s.sizeCompare;
  r.querySelector('p')!.textContent = mode === 'name' ? '' : s.intro;
  r.classList.toggle('name-only', mode === 'name');
  const ask = mode === 'all' ? askOf(s.id) : undefined;
  r.querySelector('.card-ask')!.innerHTML = ask ? `<b>考えてみよう</b>${ask.q}<small>答えは図鑑（ずかん）に</small>` : '';
  // 表示は 5〜8 秒（文の長さに合わせる）
  const ms = opts.holdMs ?? (mode === 'name' ? 3500 : Math.max(5000, Math.min(ask ? 11000 : 8000, 2500 + (s.intro.length + (ask ? ask.q.length : 0)) * 90)));
  const life = r.querySelector('.life') as HTMLElement; life.style.transition = 'none'; life.style.width = '100%';
  requestAnimationFrame(() => { r.classList.add('show'); life.style.transition = `width ${ms}ms linear`; life.style.width = '0%'; });
  let say = true; try { say = localStorage.getItem('undersoil.say') !== 'off'; } catch { /* noop */ }
  if (opts.narration !== false && mode === 'all' && say) narrate(`${s.nameJa}。${s.intro}${ask ? '　考えてみよう。' + ask.q : ''}`);
  clearTimeout(timer); timer = window.setTimeout(hideCard, ms);
}
export function hideCard() { if (!el) return; clearTimeout(timer); el.classList.remove('show'); try { window.speechSynthesis?.cancel(); } catch { /* noop */ } const d = onDone; onDone = null; d?.(); }

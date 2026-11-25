// 読み上げ（端末の音声合成 speechSynthesis）。声・速さ・高さ・音量・字幕は設定画面で選べ、この端末に保存する。
// 初めは、やさしい女性の日本語の声を選ぶ（端末にある声の名前から推し量る。見つからなければ日本語の声のどれか）。
export interface VoiceSettings { on: boolean; voice: string; rate: number; pitch: number; volume: number; subs: boolean }
/** AI の声（前もって録った音を流す）。voice が 'ai:<id>' のとき使う。それ以外は端末の声 */
export const AI_VOICES = [{ id: 'marin', ja: 'マリン（やさしい女性の声・おすすめ）' }, { id: 'shimmer', ja: 'シマー（明るい女性の声）' }, { id: 'coral', ja: 'コーラル（あたたかい女性の声）' }, { id: 'sage', ja: 'セージ（落ち着いた声）' }];
const KEY = 'ir.voice';
const DEF: VoiceSettings = { on: true, voice: 'ai:marin', rate: 1, pitch: 1.05, volume: 0.9, subs: true };
export function loadVoice(): VoiceSettings { try { return { ...DEF, ...(JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<VoiceSettings>) }; } catch { return { ...DEF }; } }
export function saveVoice(v: VoiceSettings) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* 保存できなくても続ける */ } }
export let voiceSettings = loadVoice();
export function setVoice(p: Partial<VoiceSettings>) { voiceSettings = { ...voiceSettings, ...p }; saveVoice(voiceSettings); }

// 女性の声として知られる名前（iOS／macOS・Windows・Android・Chrome）。上ほど優先
const FEMALE = ['Kyoko', 'O-ren', 'Nanami', 'Haruka', 'Ayumi', 'Sayaka', 'Mizuki', 'Google 日本語', 'Hattori'];
const MALE = ['Otoya', 'Ichiro', 'Keita', 'Hattori', 'Daichi', 'Naoki'];
export function jaVoices(): SpeechSynthesisVoice[] {
  try { return window.speechSynthesis.getVoices().filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('ja')); } catch { return []; }
}
export function voiceLabel(v: SpeechSynthesisVoice) {
  const f = FEMALE.some((n) => v.name.includes(n) && !MALE.includes(n)), m = MALE.some((n) => v.name.includes(n));
  return `${v.name.replace(/Microsoft |Google |\(.*?\)/g, '').trim()}${f ? '（女性）' : m ? '（男性）' : ''}${v.localService ? '' : '・ネット'}`;
}
export function pickVoice(): SpeechSynthesisVoice | undefined {
  const vs = jaVoices(); if (!vs.length) return undefined;
  if (voiceSettings.voice.startsWith('ai:')) { /* AI の声で録っていない言葉は、端末の女性の声で */ }
  const chosen = vs.find((v) => v.voiceURI === voiceSettings.voice); if (chosen) return chosen;
  for (const n of FEMALE) { const v = vs.find((x) => x.name.includes(n) && !MALE.some((m) => x.name.includes(m))); if (v) return v; }
  return vs.find((v) => !MALE.some((m) => v.name.includes(m))) ?? vs[0];
}
// AI の声：録った言葉の一覧（manifest）を読み、あればその音を流す。なければ端末の声で読む
import { lineKey } from './narration';
let manifest: Set<string> | null = null; let audio: HTMLAudioElement | null = null;
void fetch('/static/voice/manifest.json').then((r) => (r.ok ? r.json() : null)).then((m: { keys: string[] } | null) => { if (m) manifest = new Set(m.keys); }).catch(() => {});
export const isAI = () => voiceSettings.voice.startsWith('ai:');
function speakDevice(text: string) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP';
  u.rate = voiceSettings.rate; u.pitch = voiceSettings.pitch; u.volume = voiceSettings.volume;
  const v = pickVoice(); if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}
/** 字幕の文を読み上げる。force：設定の「読み上げなし」でも鳴らす（試し聞き用） */
export function speak(text: string, enabled = true, force = false) {
  try {
    if (!enabled || (!voiceSettings.on && !force)) return;
    stopSpeak();
    const key = lineKey(text);
    if (isAI() && manifest?.has(key)) {
      audio = new Audio(`/static/voice/${voiceSettings.voice.slice(3)}/${key}.m4a`);
      (audio as HTMLAudioElement & { preservesPitch?: boolean; webkitPreservesPitch?: boolean }).preservesPitch = true;
      (audio as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
      audio.playbackRate = voiceSettings.rate; audio.volume = voiceSettings.volume;
      void audio.play().catch(() => { if ('speechSynthesis' in window) speakDevice(text); });
      return;
    }
    if ('speechSynthesis' in window) speakDevice(text);
  } catch { /* 読み上げなしで続ける */ }
}
export function stopSpeak() { try { audio?.pause(); audio = null; window.speechSynthesis?.cancel(); } catch { /* 何もしない */ } }

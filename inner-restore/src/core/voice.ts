// 読み上げ（端末の音声合成 speechSynthesis）。声・速さ・高さ・音量・字幕は設定画面で選べ、この端末に保存する。
// 初めは、やさしい女性の日本語の声を選ぶ（端末にある声の名前から推し量る。見つからなければ日本語の声のどれか）。
export interface VoiceSettings { on: boolean; voice: string; rate: number; pitch: number; volume: number; subs: boolean }
const KEY = 'ir.voice';
const DEF: VoiceSettings = { on: true, voice: '', rate: 0.95, pitch: 1.05, volume: 0.9, subs: true };
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
  const chosen = vs.find((v) => v.voiceURI === voiceSettings.voice); if (chosen) return chosen;
  for (const n of FEMALE) { const v = vs.find((x) => x.name.includes(n) && !MALE.some((m) => x.name.includes(m))); if (v) return v; }
  return vs.find((v) => !MALE.some((m) => v.name.includes(m))) ?? vs[0];
}
/** 字幕の文を読み上げる。force：設定の「読み上げなし」でも鳴らす（試し聞き用） */
export function speak(text: string, enabled = true, force = false) {
  try {
    if (!('speechSynthesis' in window) || !enabled || (!voiceSettings.on && !force)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP';
    u.rate = voiceSettings.rate; u.pitch = voiceSettings.pitch; u.volume = voiceSettings.volume;
    const v = pickVoice(); if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch { /* 読み上げなしで続ける */ }
}
export function stopSpeak() { try { window.speechSynthesis.cancel(); } catch { /* 何もしない */ } }

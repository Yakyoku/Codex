// 設定画面のつなぎ込み（タイトルと一時停止から開く）。読み上げの声・速さ・高さ・音量、字幕、音声会話の先生のボタン
import { voiceSettings, setVoice, jaVoices, voiceLabel, pickVoice, speak, AI_VOICES, isAI } from '../core/voice';
import { LINES } from '../data/lines';

export function bindSettings($: (id: string) => HTMLElement, onClose: () => void) {
  const sel = (id: string) => $(id) as HTMLSelectElement, rng = (id: string) => $(id) as HTMLInputElement;
  const fill = () => {
    const vs = jaVoices(), cur = voiceSettings.voice, o = sel('o-voice');
    o.innerHTML = '<optgroup label="AI の声（なめらか。おすすめ）">' + AI_VOICES.map((a) => `<option value="ai:${a.id}">${a.ja}</option>`).join('') + '</optgroup>'
      + '<optgroup label="この端末の声">' + (vs.length ? '<option value="">端末のおすすめ（女性の声）</option>' + vs.map((v) => `<option value="${v.voiceURI}">${voiceLabel(v)}</option>`).join('') : '<option value="" disabled>（日本語の声が見つかりません）</option>') + '</optgroup>';
    o.value = cur.startsWith('ai:') || vs.some((v) => v.voiceURI === cur) ? cur : '';
    rng('o-pitch').disabled = isAI();
    const p = pickVoice(); o.title = p ? `いまの声：${p.name}` : '';
  };
  fill(); try { window.speechSynthesis.addEventListener?.('voiceschanged', fill); } catch { /* 読み上げのない機器 */ }
  const show = () => {
    sel('o-tts').value = voiceSettings.on ? 'on' : 'off'; sel('o-subs').value = voiceSettings.subs ? 'on' : 'off';
    for (const [id, k] of [['o-rate', 'rate'], ['o-pitch', 'pitch'], ['o-vol', 'volume']] as const) { rng(id).value = String(voiceSettings[k]); $(id + '-v').textContent = `×${voiceSettings[k].toFixed(2)}`; }
  };
  show();
  sel('o-tts').onchange = () => setVoice({ on: sel('o-tts').value === 'on' });
  sel('o-subs').onchange = () => { setVoice({ subs: sel('o-subs').value === 'on' }); document.body.classList.toggle('subs-off', !voiceSettings.subs); };
  sel('o-voice').onchange = () => { setVoice({ voice: sel('o-voice').value }); rng('o-pitch').disabled = isAI(); speak(LINES.thisVoice, true, true); };
  for (const [id, k] of [['o-rate', 'rate'], ['o-pitch', 'pitch'], ['o-vol', 'volume']] as const) {
    rng(id).oninput = () => { setVoice({ [k]: Number(rng(id).value) } as never); $(id + '-v').textContent = `×${Number(rng(id).value).toFixed(2)}`; };
    rng(id).onchange = () => speak(LINES.thisVoice, true, true);
  }
  ($('o-test') as HTMLButtonElement).onclick = () => speak(LINES.test, true, true);
  document.body.classList.toggle('subs-off', !voiceSettings.subs);
  ($('s-close') as HTMLButtonElement).onclick = () => { $('settings').classList.add('hide'); onClose(); };
  return { open: () => { show(); fill(); $('settings').classList.remove('hide'); } };
}

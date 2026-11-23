// 設定画面のつなぎ込み（タイトルと一時停止から開く）。読み上げの声・速さ・高さ・音量、字幕、音声会話の先生のボタン
import { voiceSettings, setVoice, jaVoices, voiceLabel, pickVoice, speak } from '../core/voice';

/** 音声会話の先生（voice-buddy）が作る要素。Shadow DOM を持つ body 直下の要素 */
export function vbHost(): HTMLElement | null {
  for (const el of Array.from(document.body.children) as HTMLElement[]) if (el.shadowRoot && el.shadowRoot.querySelector('.fab')) return el;
  return null;
}
export function applyVB(on: boolean) {
  const h = vbHost(); if (h) h.style.display = on ? '' : 'none';
  document.body.classList.toggle('vb', on && !!h);
}
export function bindSettings($: (id: string) => HTMLElement, onClose: () => void) {
  const sel = (id: string) => $(id) as HTMLSelectElement, rng = (id: string) => $(id) as HTMLInputElement;
  const fill = () => {
    const vs = jaVoices(), cur = voiceSettings.voice, o = sel('o-voice');
    o.innerHTML = '<option value="">おすすめ（やさしい女性の声）</option>' + vs.map((v) => `<option value="${v.voiceURI}">${voiceLabel(v)}</option>`).join('');
    o.value = vs.some((v) => v.voiceURI === cur) ? cur : '';
    if (!vs.length) o.innerHTML = '<option value="">（この端末に日本語の声が見つかりません）</option>';
    const p = pickVoice(); o.title = p ? `いまの声：${p.name}` : '';
  };
  fill(); try { window.speechSynthesis.addEventListener?.('voiceschanged', fill); } catch { /* 読み上げのない機器 */ }
  const show = () => {
    sel('o-tts').value = voiceSettings.on ? 'on' : 'off'; sel('o-subs').value = voiceSettings.subs ? 'on' : 'off';
    for (const [id, k] of [['o-rate', 'rate'], ['o-pitch', 'pitch'], ['o-vol', 'volume']] as const) { rng(id).value = String(voiceSettings[k]); $(id + '-v').textContent = `×${voiceSettings[k].toFixed(2)}`; }
    let vb = 'on'; try { vb = localStorage.getItem('ir.vb') ?? 'on'; } catch { /* 既定 */ }
    sel('o-vb').value = vb;
  };
  show();
  sel('o-tts').onchange = () => setVoice({ on: sel('o-tts').value === 'on' });
  sel('o-subs').onchange = () => { setVoice({ subs: sel('o-subs').value === 'on' }); document.body.classList.toggle('subs-off', !voiceSettings.subs); };
  sel('o-voice').onchange = () => { setVoice({ voice: sel('o-voice').value }); speak('この声で読み上げます。', true, true); };
  for (const [id, k] of [['o-rate', 'rate'], ['o-pitch', 'pitch'], ['o-vol', 'volume']] as const) {
    rng(id).oninput = () => { setVoice({ [k]: Number(rng(id).value) } as never); $(id + '-v').textContent = `×${Number(rng(id).value).toFixed(2)}`; };
    rng(id).onchange = () => speak('この速さと高さで読み上げます。', true, true);
  }
  ($('o-test') as HTMLButtonElement).onclick = () => speak('こちらオペレーター。網膜の内側の面に着きました。浄化で、流れを取り戻してください。', true, true);
  sel('o-vb').onchange = () => { try { localStorage.setItem('ir.vb', sel('o-vb').value); } catch { /* 保存できない */ } applyVB(sel('o-vb').value === 'on'); };
  document.body.classList.toggle('subs-off', !voiceSettings.subs);
  ($('s-close') as HTMLButtonElement).onclick = () => { $('settings').classList.add('hide'); onClose(); };
  return { open: () => { show(); fill(); $('settings').classList.remove('hide'); } };
}

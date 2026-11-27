// 設定（M0 の最小版）：描画方式、品質段階、初登場の紹介。ブラウザの中に保存する。
import './settings.css';
const KEYS = { renderer: 'undersoil.renderer', tier: 'undersoil.tier', intro: 'undersoil.intro', bob: 'undersoil.bob', speed: 'undersoil.speed', look: 'undersoil.look', swim: 'undersoil.swim' } as const;
export const savedSwim = () => (get(KEYS.swim, 'glide') === 'dart' ? 'dart' : 'glide') as 'glide' | 'dart';
const K: Record<string, number> = { slow: 0.7, normal: 1, fast: 1.4 };
export const savedSpeed = () => K[get(KEYS.speed, 'normal')] ?? 1;
export const savedLook = () => K[get(KEYS.look, 'normal')] ?? 1;
export const savedBob = () => get(KEYS.bob, 'on') === 'on';
const get = (k: string, d: string) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
const set = (k: string, v: string, d: string) => { try { if (v === d) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { /* noop */ } };
export const savedTier = () => { const t = get(KEYS.tier, 'auto'); return t === 'auto' ? null : t; };

export function mountSettings(openBtn: HTMLElement, info: { renderer: string; tier: string }) {
  const d = document.createElement('dialog'); d.className = 'settings';
  const group = (title: string, key: keyof typeof KEYS, def: string, opts: [string, string][], reload: boolean) => {
    const cur = get(KEYS[key], def);
    return `<fieldset><legend>${title}</legend>${opts.map(([v, l]) => `<label><input type="radio" name="${key}" value="${v}" ${v === cur ? 'checked' : ''} data-def="${def}" data-reload="${reload ? 1 : 0}"><span>${l}</span></label>`).join('')}</fieldset>`;
  };
  d.innerHTML = `<h2>設定</h2>
    ${group('描画方式', 'renderer', 'auto', [['auto', '自動'], ['webgpu', 'WebGPU'], ['webgl2', 'WebGL 2']], true)}
    ${group('画質', 'tier', 'auto', [['auto', '自動'], ['pc-high', 'PC 高画質'], ['mobile-high', 'モバイル高画質'], ['compat', '互換（軽い）']], true)}
    ${group('生き物の初登場の紹介', 'intro', 'all', [['all', 'すべて表示'], ['name', '名前だけ'], ['off', '表示しない']], false)}
    ${group('動く速さ', 'speed', 'normal', [['slow', 'ゆっくり'], ['normal', 'ふつう'], ['fast', 'はやい']], false)}
    ${group('見回す速さ', 'look', 'normal', [['slow', 'ゆっくり'], ['normal', 'ふつう'], ['fast', 'はやい']], false)}
    ${group('泳ぎ方', 'swim', 'glide', [['glide', 'コルポダのように（なめらかに滑る）'], ['dart', '細菌のように（すぐ進み、すぐ止まる）']], false)}
    ${group('歩くときの視点のゆれ', 'bob', 'on', [['on', 'あり'], ['off', 'なし（酔いやすい方に）']], false)}
    <p class="now">いまの動作：${info.renderer} ／ ${info.tier}</p>
    <p class="note">設定と進み具合は、このブラウザの中に保存されます。別のブラウザや端末には引き継がれません。表示が乱れる・止まるときは、描画方式を「WebGL 2」にしてください。</p>
    <fieldset><legend>進み具合の持ち運び</legend><button type="button" class="btn" data-exp>書き出す（ファイルに保存）</button><label class="btn">読みこむ<input type="file" accept="application/json,.json" data-imp hidden></label><small data-msg></small></fieldset>
    <div class="row"><button class="btn primary" value="ok">閉じる</button></div>`;
  document.body.append(d);
  // 書き出し・読みこみ：設定、観察ノート、スタンプ、自分の観察（undersoil. で始まる保存）を、1 つのファイルで別の端末へ運べる
  d.querySelector('[data-exp]')!.addEventListener('click', () => { const out: Record<string, string> = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i)!; if (k.startsWith('undersoil.')) out[k] = localStorage.getItem(k)!; } } catch { /* noop */ }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: 'undersoil', version: 1, saved: new Date().toISOString(), data: out })], { type: 'application/json' })); a.download = 'undersoil-save.json'; a.click(); URL.revokeObjectURL(a.href); d.querySelector('[data-msg]')!.textContent = ' 書き出しました'; });
  d.querySelector('[data-imp]')!.addEventListener('change', async (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return; const msg = d.querySelector('[data-msg]')!;
    try { const j = JSON.parse(await f.text()); if (j.app !== 'undersoil' || typeof j.data !== 'object') throw new Error('このゲームの保存ファイルではありません'); for (const [k, v] of Object.entries(j.data)) if (k.startsWith('undersoil.') && typeof v === 'string') localStorage.setItem(k, v); msg.textContent = ' 読みこみました。開き直します…'; setTimeout(() => location.reload(), 800); } catch (err) { msg.textContent = ' 読みこめませんでした：' + (err as Error).message; } });
  let needReload = false;
  d.addEventListener('change', (e) => { const i = e.target as HTMLInputElement; if (i.type !== 'radio') return; set(KEYS[i.name as keyof typeof KEYS], i.value, i.dataset.def!); if (i.dataset.reload === '1') needReload = true; });
  d.querySelector('button[value=ok]')!.addEventListener('click', () => { d.close(); if (needReload) location.reload(); });
  openBtn.addEventListener('click', () => d.showModal());
}

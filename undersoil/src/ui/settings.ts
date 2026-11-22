// 設定（M0 の最小版）：描画方式、品質段階、初登場の紹介。ブラウザの中に保存する。
import './settings.css';
const KEYS = { renderer: 'undersoil.renderer', tier: 'undersoil.tier', intro: 'undersoil.intro' } as const;
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
    <p class="now">いまの動作：${info.renderer} ／ ${info.tier}</p>
    <p class="note">設定と進み具合は、このブラウザの中に保存されます。別のブラウザや端末には引き継がれません。表示が乱れる・止まるときは、描画方式を「WebGL 2」にしてください。</p>
    <div class="row"><button class="btn primary" value="ok">閉じる</button></div>`;
  document.body.append(d);
  let needReload = false;
  d.addEventListener('change', (e) => { const i = e.target as HTMLInputElement; set(KEYS[i.name as keyof typeof KEYS], i.value, i.dataset.def!); if (i.dataset.reload === '1') needReload = true; });
  d.querySelector('button')!.addEventListener('click', () => { d.close(); if (needReload) location.reload(); });
  openBtn.addEventListener('click', () => d.showModal());
}

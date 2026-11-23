// 調整つまみ（URL に ?tune を付けると出る）。tuning.json の値をその場で変え、気に入った値を JSON で写せる
type Obj = Record<string, unknown>;
export function tunePanel(tuning: Obj, sections = ['player', 'camera', 'beam', 'feel', 'flow', 'vr']) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;right:8px;top:200px;bottom:8px;width:300px;overflow:auto;z-index:50;background:rgba(8,10,12,.86);color:#dde;font:12px/1.4 system-ui;padding:8px 10px;border-radius:8px';
  el.innerHTML = '<b>調整つまみ</b>（値はこの画面だけで変わります）<br><button id="tn-copy">JSON をコピー</button> <button id="tn-hide">閉じる</button>';
  for (const sec of sections) {
    const o = tuning[sec] as Obj | undefined; if (!o) continue;
    const h = document.createElement('div'); h.textContent = sec; h.style.cssText = 'margin-top:8px;color:#9fd;font-weight:600'; el.appendChild(h);
    for (const [k, v] of Object.entries(o)) {
      if (typeof v !== 'number') continue;
      const row = document.createElement('label'); row.style.cssText = 'display:grid;grid-template-columns:110px 1fr 48px;gap:6px;align-items:center';
      const max = v === 0 ? 1 : Math.abs(v) * 3, step = Math.abs(v) < 0.05 ? 0.0001 : Math.abs(v) < 2 ? 0.01 : 0.1;
      row.innerHTML = `<span>${k}</span><input type="range" min="${Math.min(0, v * 3)}" max="${max}" step="${step}" value="${v}"><output>${v}</output>`;
      const inp = row.querySelector('input')!, out = row.querySelector('output')!;
      inp.addEventListener('input', () => { o[k] = Number(inp.value); out.textContent = inp.value; });
      el.appendChild(row);
    }
  }
  document.body.appendChild(el);
  (el.querySelector('#tn-copy') as HTMLButtonElement).onclick = () => { void navigator.clipboard?.writeText(JSON.stringify(tuning, null, 2)); };
  (el.querySelector('#tn-hide') as HTMLButtonElement).onclick = () => el.remove();
  el.addEventListener('mousedown', (e) => e.stopPropagation()); el.addEventListener('touchstart', (e) => e.stopPropagation());
}

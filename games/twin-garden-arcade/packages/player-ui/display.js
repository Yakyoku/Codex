import {storage} from './storage.js';
                                                           
export function validQuality(value         )                 {
  return value === 'ultra' || value === 'balanced' ? value : 'high';
}
export function loadQuality()                 {
  try { return validQuality(storage.getItem('tg-display-quality')); } catch { return 'high'; }
}
export function saveQuality(value                ) {
  try { storage.setItem('tg-display-quality', value); } catch {}
}
// A pixel budget, not a low fixed DPR: 4K desktop remains native at DPR 1 or 2.
// XR uses its compositor's recommended framebuffer instead of this desktop budget.
export function displaySize(width        , height        , dpr        , quality                , maxSize = 16384) {
  const w = Number.isFinite(width) && width > 0 ? width : 1;
  const h = Number.isFinite(height) && height > 0 ? height : 1;
  const density = Number.isFinite(dpr) && dpr > 0 ? dpr : 1;
  const budget = quality === 'ultra' ? 7680 * 4320 : quality === 'balanced' ? 2560 * 1440 : 3840 * 2160;
  const ratio = Math.min(density, Math.sqrt(budget / (w * h)), Math.max(1, maxSize) / Math.max(w, h));
  return { width: Math.max(1, Math.floor(w * ratio)), height: Math.max(1, Math.floor(h * ratio)), ratio };
}
export const qualityOptions = '<option value="high">高精細 · 4K</option><option value="ultra">最高精細 · 8K</option><option value="balanced">軽量 · 1440p</option>';

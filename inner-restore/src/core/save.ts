// 進み具合の保存（この端末のブラウザの中だけ）。M4 で書き出し・読み込みを足す
export interface Save { zone?: string; done?: string[]; arrived?: boolean; known?: string[] }
const KEY = 'ir.save';
export function loadSave(): Save { try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Save; } catch { return {}; } }
export function writeSave(patch: Partial<Save>) { try { localStorage.setItem(KEY, JSON.stringify({ ...loadSave(), ...patch })); } catch { /* 保存できなくても続ける */ } }
export function resetSave() { try { localStorage.removeItem(KEY); } catch { /* 何もしない */ } }

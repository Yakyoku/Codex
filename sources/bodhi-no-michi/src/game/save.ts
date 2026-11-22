// 保存と設定。localStorage が使えない環境（プライベートブラウズ等）でも落ちない。
import type { Difficulty, Quality, SaveData, Settings } from './contracts';

const KEY = 'bodhi-no-michi-save-v1';

export const defaultSettings: Settings = {
  difficulty: 'standard',
  quality: 'auto',
  volMusic: 0.7,
  volSfx: 0.8,
  volAmbience: 0.7,
  invertY: false,
  lookSpeed: 1,
  vrSnapTurn: true,
  vrSeated: false,
  vrVignette: true,
  vrHeightOffset: 0,
};

const DIFFICULTIES: Difficulty[] = ['story', 'standard', 'ascetic'];
const QUALITIES: Quality[] = ['auto', 'low', 'mid', 'high'];

function num(v: unknown, def: number, min: number, max: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : def;
}
function bool(v: unknown, def: boolean): boolean {
  return typeof v === 'boolean' ? v : def;
}
function strings(v: unknown): string[] {
  return Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string'))] : [];
}

function mergeSettings(raw: unknown): Settings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const d = defaultSettings;
  return {
    difficulty: DIFFICULTIES.includes(r.difficulty as Difficulty) ? (r.difficulty as Difficulty) : d.difficulty,
    quality: QUALITIES.includes(r.quality as Quality) ? (r.quality as Quality) : d.quality,
    volMusic: num(r.volMusic, d.volMusic, 0, 1),
    volSfx: num(r.volSfx, d.volSfx, 0, 1),
    volAmbience: num(r.volAmbience, d.volAmbience, 0, 1),
    invertY: bool(r.invertY, d.invertY),
    lookSpeed: num(r.lookSpeed, d.lookSpeed, 0.5, 2),
    vrSnapTurn: bool(r.vrSnapTurn, d.vrSnapTurn),
    vrSeated: bool(r.vrSeated, d.vrSeated),
    vrVignette: bool(r.vrVignette, d.vrVignette),
    vrHeightOffset: num(r.vrHeightOffset, d.vrHeightOffset, -0.3, 0.3),
  };
}

function fresh(): SaveData {
  return { version: 1, chapter: 0, cleared: [], virtues: [], zukan: [], settings: { ...defaultSettings } };
}

function merge(raw: unknown): SaveData {
  if (!raw || typeof raw !== 'object') return fresh();
  const r = raw as Record<string, unknown>;
  const out: SaveData = {
    version: 1,
    chapter: Math.floor(num(r.chapter, 0, 0, 9)),
    cleared: Array.isArray(r.cleared)
      ? [...new Set(r.cleared.filter((x): x is number => typeof x === 'number' && Number.isFinite(x)))]
      : [],
    virtues: strings(r.virtues),
    zukan: strings(r.zukan),
    settings: mergeSettings(r.settings),
  };
  const cp = r.checkpoint as Record<string, unknown> | undefined;
  if (cp && typeof cp === 'object' && typeof cp.chapter === 'number' && typeof cp.id === 'string') {
    out.checkpoint = { chapter: cp.chapter, id: cp.id };
  }
  return out;
}

export function loadSave(): SaveData {
  try {
    const text = localStorage.getItem(KEY);
    if (!text) return fresh();
    return merge(JSON.parse(text));
  } catch {
    return fresh();
  }
}

export function writeSave(s: SaveData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* 保存できない環境では黙って続ける */
  }
}

/** 進行を消す。設定（音量など）は残す */
export function resetSave(): SaveData {
  let settings = { ...defaultSettings };
  try {
    const text = localStorage.getItem(KEY);
    if (text) settings = mergeSettings((JSON.parse(text) as Record<string, unknown>).settings);
  } catch {
    /* 既定値を使う */
  }
  const s = fresh();
  s.settings = settings;
  writeSave(s);
  return s;
}

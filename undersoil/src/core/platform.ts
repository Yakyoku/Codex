// 端末の種類と描画方式の判定
export type DeviceKind = 'quest' | 'iphone' | 'ipad' | 'android' | 'pc';
export type RendererPref = 'auto' | 'webgpu' | 'webgl2';
export type QualityTier = 'pc-high' | 'mobile-high' | 'compat' | 'vr';

export function detectDevice(): DeviceKind {
  const ua = navigator.userAgent;
  if (/OculusBrowser|Quest/i.test(ua)) return 'quest';
  if (/iPhone|iPod/i.test(ua)) return 'iphone';
  if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ipad';
  if (/Android/i.test(ua)) return 'android';
  return 'pc';
}

export const DEVICE_LABEL: Record<DeviceKind, string> = {
  quest: 'Meta Quest', iphone: 'iPhone', ipad: 'iPad', android: 'Android', pc: 'PC',
};

export function browserName(): string {
  const ua = navigator.userAgent;
  const m = (re: RegExp) => ua.match(re)?.[1] ?? '';
  if (/OculusBrowser/.test(ua)) return 'Meta Quest Browser ' + m(/OculusBrowser\/([\d.]+)/);
  if (/Edg\//.test(ua)) return 'Edge ' + m(/Edg\/([\d]+)/);
  if (/CriOS/.test(ua)) return 'Chrome(iOS) ' + m(/CriOS\/([\d]+)/);
  if (/Firefox\//.test(ua)) return 'Firefox ' + m(/Firefox\/([\d]+)/);
  if (/Chrome\//.test(ua)) return 'Chrome ' + m(/Chrome\/([\d]+)/);
  if (/Safari\//.test(ua)) return 'Safari ' + m(/Version\/([\d.]+)/);
  return 'unknown';
}

/** URL の ?renderer= と保存済みの設定から、希望する描画方式を読む */
export function rendererPref(): RendererPref {
  const q = new URLSearchParams(location.search).get('renderer');
  if (q === 'webgpu' || q === 'webgl2' || q === 'auto') return q;
  try {
    const s = localStorage.getItem('undersoil.renderer');
    if (s === 'webgpu' || s === 'webgl2') return s;
  } catch { /* 保存領域が使えない環境 */ }
  return 'auto';
}

export function pickTier(device: DeviceKind, isWebGPU: boolean, inVR = false): QualityTier {
  if (inVR || device === 'quest') return 'vr';
  if (!isWebGPU) return 'compat';
  return device === 'pc' ? 'pc-high' : 'mobile-high';
}

export const TIER_LABEL: Record<QualityTier, string> = {
  'pc-high': 'PC 高画質', 'mobile-high': 'モバイル高画質', compat: '互換', vr: 'VR',
};

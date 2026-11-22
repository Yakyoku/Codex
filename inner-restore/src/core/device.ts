// 端末の種類と品質段階の判定
export type DeviceKind = 'quest' | 'iphone' | 'ipad' | 'android' | 'pc';
export type Tier = 'pc-high' | 'mobile-high' | 'compat' | 'vr';

export function detectDevice(ua = navigator.userAgent): DeviceKind {
  if (/OculusBrowser|Quest/i.test(ua)) return 'quest';
  if (/iPhone|iPod/i.test(ua)) return 'iphone';
  if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ipad';
  if (/Android/i.test(ua)) return 'android';
  return 'pc';
}

export const DEVICE_LABEL: Record<DeviceKind, string> = {
  quest: 'Meta Quest', iphone: 'iPhone', ipad: 'iPad', android: 'Android', pc: 'PC',
};
export const TIER_LABEL: Record<Tier, string> = {
  'pc-high': 'PC 高画質', 'mobile-high': 'モバイル高画質', compat: '互換', vr: 'VR',
};

/** 動作中の描画方式と端末から、品質段階を自動で選ぶ */
export function pickTier(device: DeviceKind, isWebGPU: boolean, inVR = false): Tier {
  if (inVR || device === 'quest') return 'vr';
  if (!isWebGPU) return 'compat';
  return device === 'pc' ? 'pc-high' : 'mobile-high';
}

export function browserName(ua = navigator.userAgent): string {
  const m = (re: RegExp) => ua.match(re)?.[1];
  if (/OculusBrowser/.test(ua)) return 'OculusBrowser ' + (m(/OculusBrowser\/([\d.]+)/) ?? '');
  if (/Edg\//.test(ua)) return 'Edge ' + (m(/Edg\/([\d]+)/) ?? '');
  if (/CriOS/.test(ua)) return 'Chrome(iOS) ' + (m(/CriOS\/([\d]+)/) ?? '');
  if (/Chrome\//.test(ua)) return 'Chrome ' + (m(/Chrome\/([\d]+)/) ?? '');
  if (/Safari\//.test(ua)) return 'Safari ' + (m(/Version\/([\d.]+)/) ?? '');
  if (/Firefox\//.test(ua)) return 'Firefox ' + (m(/Firefox\/([\d]+)/) ?? '');
  return 'unknown';
}

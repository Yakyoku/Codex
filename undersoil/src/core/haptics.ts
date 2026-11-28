// 手応えの振動（依頼書「操作感：手応えの一瞬の間、振動まで作り込む」）。
//   ゲームパッド：vibrationActuator（強い・弱いモーター）／ VR コントローラー：hapticActuators の pulse ／ スマホ：navigator.vibrate（Android など。iPhone の Safari は対応していない）
//   設定「振動」で切れる。
export type Feel = 'bump' | 'pour' | 'link' | 'wind' | 'awake' | 'grab' | 'slide';
const SHAPE: Record<Feel, [number, number, number][]> = {   // [弱いモーター, 強いモーター, ミリ秒] の並び（間は同じ長さの休み）
  bump: [[0.25, 0.05, 40]],
  pour: [[0.35, 0, 60]],
  link: [[0.5, 0.2, 70], [0.8, 0.35, 90]],
  wind: [[0.1, 0.45, 600]],
  awake: [[0.3, 0, 80], [0.5, 0.15, 90], [0.8, 0.4, 140]],
  grab: [[0.4, 0.2, 50]],
  slide: [[0.08, 0, 30]],
};
let on = (() => { try { return localStorage.getItem('undersoil.rumble') !== 'off'; } catch { return true; } })();
export const setRumble = (v: boolean) => { on = v; };
type Pad = Gamepad & { vibrationActuator?: { playEffect?: (t: string, p: object) => Promise<unknown> }; hapticActuators?: { pulse?: (v: number, ms: number) => Promise<unknown> }[] };
/** VR の手（XRInputSource の gamepad）を登録すると、そこにも振動を送る */
const vrPads: (() => Gamepad | null | undefined)[] = [];
export const addVRPad = (get: () => Gamepad | null | undefined) => { vrPads.push(get); };
export function feel(kind: Feel, k = 1) {
  if (!on) return;
  const seq = SHAPE[kind]; let t = 0;
  for (const [weak, strong, ms] of seq) {
    const fire = () => {
      try { for (const g of (navigator.getGamepads?.() ?? []) as (Pad | null)[]) g?.vibrationActuator?.playEffect?.('dual-rumble', { duration: ms, weakMagnitude: Math.min(1, weak * k), strongMagnitude: Math.min(1, strong * k) })?.catch?.(() => {}); } catch { /* noop */ }
      try { for (const get of vrPads) { const g = get() as Pad | null | undefined; g?.hapticActuators?.[0]?.pulse?.(Math.min(1, Math.max(weak, strong) * k), ms)?.catch?.(() => {}); } } catch { /* noop */ }
      try { if (kind !== 'slide' && kind !== 'bump' && 'vibrate' in navigator) navigator.vibrate(ms); } catch { /* noop */ }
    };
    if (t === 0) fire(); else setTimeout(fire, t);
    t += ms * 2;
  }
}

// 手応え（命中時の一瞬の間・振動）。画面版のゲームパッドとスマホの振動、VR のコントローラーで共用する
export function rumble(strong: number, weak: number, ms: number) {
  try {
    for (const p of Array.from(navigator.getGamepads?.() ?? [])) {
      const a = (p as Gamepad & { vibrationActuator?: { playEffect?: (t: string, o: object) => Promise<unknown> } } | null)?.vibrationActuator;
      void a?.playEffect?.('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, strong), weakMagnitude: Math.min(1, weak) })?.catch(() => {});
    }
  } catch { /* 振動のない機器 */ }
}
/** スマホ（Android）の振動。iPhone の Safari は対応していない */
export function buzz(ms: number) { try { navigator.vibrate?.(ms); } catch { /* 対応していない */ } }
/** VR のコントローラーの振動 */
export function haptic(src: XRInputSource | undefined, v: number, ms: number) {
  try { const h = (src?.gamepad as (Gamepad & { hapticActuators?: { pulse: (v: number, ms: number) => Promise<boolean> }[] }) | undefined)?.hapticActuators?.[0]; void h?.pulse(Math.min(1, v), ms); } catch { /* 振動のない機器 */ }
}

import { FpsMeter } from '../core/fps';
import { DEVICE_LABEL, TIER_LABEL, type DeviceKind, type QualityTier } from '../core/platform';

/** 画面の隅に、描画方式・fps・端末の種類を出す */
export function makeHud(el: HTMLElement, info: { device: DeviceKind; isWebGPU: boolean; tier: QualityTier; note?: string | null }) {
  const meter = new FpsMeter(120);
  let lastDraw = 0;
  return {
    meter,
    tick(now: number) {
      meter.tick(now);
      if (now - lastDraw < 500) return;
      lastDraw = now;
      el.textContent = `${info.isWebGPU ? 'WebGPU' : 'WebGL 2'} | ${meter.avg.toFixed(0)} fps | ${DEVICE_LABEL[info.device]} | ${TIER_LABEL[info.tier]}` + (info.note ? `\n${info.note}` : '');
    },
  };
}

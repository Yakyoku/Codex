import * as THREE from 'three/webgpu';
import { RendererPref } from './platform';

export interface RendererInfo {
  renderer: THREE.WebGPURenderer;
  isWebGPU: boolean;
  /** WebGPU を試して失敗し、WebGL 2 に切り替えた場合の理由 */
  fallbackReason: string | null;
}

const CRASH_KEY = 'undersoil.webgpuCrash';

/** WebGPU を第一、WebGL 2 を予備にして描画エンジンを作る。forceWebGL は VR と互換用。 */
export async function createRenderer(canvas: HTMLCanvasElement, pref: RendererPref, opts: { antialias?: boolean; xr?: boolean } = {}): Promise<RendererInfo> {
  let fallbackReason: string | null = null;
  let forceWebGL = pref === 'webgl2' || !!opts.xr;
  if (!forceWebGL && !('gpu' in navigator)) { forceWebGL = true; fallbackReason = 'WebGPU 非対応のブラウザ'; }
  // 前回 WebGPU の初期化中に止まった場合は、自動のときだけ WebGL 2 に切り替える
  if (!forceWebGL && pref === 'auto') {
    try { if (sessionStorage.getItem(CRASH_KEY) === 'pending') { forceWebGL = true; fallbackReason = '前回 WebGPU の起動に失敗'; } } catch { /* noop */ }
  }
  const make = async (webgl: boolean) => {
    const r = new THREE.WebGPURenderer({ canvas, antialias: opts.antialias ?? true, forceWebGL: webgl, alpha: false });
    await r.init();
    return r;
  };
  let renderer: THREE.WebGPURenderer;
  if (forceWebGL) {
    renderer = await make(true);
  } else {
    try { sessionStorage.setItem(CRASH_KEY, 'pending'); } catch { /* noop */ }
    try {
      renderer = await make(false);
    } catch (e) {
      fallbackReason = 'WebGPU 初期化エラー: ' + (e as Error).message;
      renderer = await make(true);
    }
    try { sessionStorage.removeItem(CRASH_KEY); } catch { /* noop */ }
  }
  const isWebGPU = (renderer.backend as unknown as { isWebGPUBackend?: boolean }).isWebGPUBackend === true;
  if (!forceWebGL && !isWebGPU && !fallbackReason) fallbackReason = 'WebGPU のアダプターが得られない';
  renderer.toneMapping = THREE.AgXToneMapping;   // 2026-11-27：ACES より写真に近い（明るい所が白く飛ばず、色が自然に落ち着く）
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return { renderer, isWebGPU, fallbackReason };
}

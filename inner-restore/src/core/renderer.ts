import * as THREE from 'three/webgpu';

export type BackendPref = 'auto' | 'webgpu' | 'webgl';
export interface RendererInfo { renderer: THREE.WebGPURenderer; isWebGPU: boolean; backendLabel: string; fellBack: boolean; }

export function backendPrefFromURL(): BackendPref {
  const q = new URLSearchParams(location.search).get('backend');
  if (q === 'webgl' || q === 'webgpu' || q === 'auto') return q;
  try {
    const s = localStorage.getItem('ir.backend');
    if (s === 'webgl' || s === 'webgpu') return s;
  } catch { /* 保存領域が使えなくても動かす */ }
  return 'auto';
}

/** WebGPU を第一、WebGL 2 を予備にして描画エンジンを作る。VR では forceWebGL を使う。 */
export async function createRenderer(canvas: HTMLCanvasElement, opts: { pref?: BackendPref; antialias?: boolean; xr?: boolean } = {}): Promise<RendererInfo> {
  const pref = opts.pref ?? 'auto';
  const wantGL = pref === 'webgl' || !!opts.xr;
  const make = (forceWebGL: boolean) => new THREE.WebGPURenderer({
    canvas, antialias: opts.antialias ?? true, forceWebGL, alpha: false, powerPreference: 'high-performance',
    multiview: !!opts.xr,
  } as ConstructorParameters<typeof THREE.WebGPURenderer>[0]);
  let renderer = make(wantGL);
  let fellBack = false;
  try {
    await renderer.init();
  } catch (e) {
    if (wantGL) throw e;
    console.warn('WebGPU の初期化に失敗。WebGL 2 に切り替えます', e);
    renderer.dispose();
    renderer = make(true);
    await renderer.init();
    fellBack = true;
  }
  const isWebGPU = (renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend === true;
  if (!wantGL && !isWebGPU) fellBack = true;
  // WebGPU のデバイスが失われたら（表示の停止）、次回から WebGL 2 にして読み込み直す（1回だけ）
  if (isWebGPU) {
    const dev = (renderer.backend as unknown as { device?: GPUDeviceLike }).device;
    void dev?.lost?.then((info) => {
      if (info?.reason === 'destroyed') return;
      try { if (sessionStorage.getItem('ir.fellback')) return; sessionStorage.setItem('ir.fellback', '1'); localStorage.setItem('ir.backend', 'webgl'); } catch { return; }
      location.reload();
    });
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  return { renderer, isWebGPU, backendLabel: isWebGPU ? 'WebGPU' : 'WebGL 2', fellBack };
}

/** 画面の大きさと向きの変化に追従する */
export function fitRenderer(renderer: THREE.WebGPURenderer, camera: THREE.PerspectiveCamera, maxPixelRatio: number, onResize?: () => void) {
  const apply = () => {
    if (renderer.xr.isPresenting) return;
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    onResize?.();
  };
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', apply);
  apply();
  return apply;
}

interface GPUDeviceLike { lost?: Promise<{ reason?: string }>; }

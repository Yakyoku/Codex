import * as THREE from 'three/webgpu';
import { createRenderer, backendPrefFromURL } from '../core/renderer';
import { detectDevice, DEVICE_LABEL, browserName, pickTier, TIER_LABEL } from '../core/device';
import { bytesLoaded } from '../core/assets';
import { buildRbcScene } from './rbcScene';

const errors: string[] = [];
window.addEventListener('error', (e) => errors.push(String(e.message).slice(0, 80)));
window.addEventListener('unhandledrejection', (e) => errors.push(String(e.reason).slice(0, 80)));
const $ = (id: string) => document.getElementById(id)!;
const status = (s: string, p: number) => { $('status').textContent = s; ($('bar').firstElementChild as HTMLElement).style.width = `${p * 100}%`; };
const quick = new URLSearchParams(location.search).has('quick');

interface Step { n: number; lod: number; avg: number; low: number; p95: number; tris: number; }

function measure(renderer: THREE.WebGPURenderer, scene: THREE.Scene, camera: THREE.Camera, update: (t: number, c: THREE.Camera) => void, seconds: number): Promise<Omit<Step, 'n' | 'lod' | 'tris'>> {
  return new Promise((resolve) => {
    const dts: number[] = []; let last = 0; let start = 0; let warm = 0;
    renderer.setAnimationLoop((now: number) => {
      update(now / 1000, camera); renderer.render(scene, camera);
      if (warm++ < 20) { last = now; start = now; return; }   // 最初の数コマ（シェーダー準備）は除く
      dts.push(now - last); last = now;
      if (now - start >= seconds * 1000) {
        renderer.setAnimationLoop(null);
        const s = [...dts].sort((a, b) => a - b);
        const avg = 1000 / (dts.reduce((a, b) => a + b, 0) / dts.length);
        const p95 = s[Math.floor(s.length * 0.95)] ?? 0, p99 = s[Math.floor(s.length * 0.99)] ?? 0;
        resolve({ avg, low: 1000 / (p99 || 1), p95 });
      }
    });
  });
}

async function run() {
  const tStart = performance.now();
  const canvas = $('view') as HTMLCanvasElement;
  const device = detectDevice();
  const pref = backendPrefFromURL();
  status('描画エンジンを初期化中…', 0.05);
  const { renderer, isWebGPU, backendLabel, fellBack } = await createRenderer(canvas, { pref });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.position.set(0, 2, 30); camera.lookAt(0, 0, 0);
  const steps: Step[] = [];
  const plan = quick ? [[60, 2]] : [[300, 0], [2000, 1], [8000, 2]];
  let i = 0;
  for (const [n, lod] of plan) {
    status(`測定 ${i + 1}/${plan.length}：赤血球 ${n} 個…`, 0.1 + (0.85 * i) / plan.length);
    const { scene, update, tris } = await buildRbcScene(renderer, n, lod, 42);
    if (i === 0) (window as unknown as { __irLoadMs: number }).__irLoadMs = performance.now() - tStart;
    const r = await measure(renderer, scene, camera, update, quick ? 1 : 5);
    steps.push({ n, lod, tris, ...r });
    scene.traverse((o) => { const m = o as THREE.InstancedMesh; if (m.isInstancedMesh) m.dispose(); });
    i++;
  }
  // 測定後も最初の場面を静かに回しておく
  const idle = await buildRbcScene(renderer, 120, 1, 42);
  renderer.setAnimationLoop((now: number) => { idle.update(now / 1000, camera); renderer.render(idle.scene, camera); });

  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const mem = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  const gl = (renderer.backend as unknown as { gl?: WebGL2RenderingContext }).gl;
  let gpuName = '';
  try {
    if (gl) { const ext = gl.getExtension('WEBGL_debug_renderer_info'); gpuName = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''; }
    else { const ad = await (navigator as unknown as { gpu?: { requestAdapter(): Promise<{ info?: { vendor?: string; architecture?: string; device?: string } } | null> } }).gpu?.requestAdapter(); gpuName = [ad?.info?.vendor, ad?.info?.architecture, ad?.info?.device].filter(Boolean).join(' '); }
  } catch { /* 取得できない端末もある */ }
  const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
  const vr = xr ? await xr.isSessionSupported('immersive-vr').catch(() => false) : false;
  const tier = pickTier(device, isWebGPU);
  const loadMs = Math.round((window as unknown as { __irLoadMs: number }).__irLoadMs);
  const rows: [string, string, boolean?][] = [
    ['端末', DEVICE_LABEL[device]],
    ['ブラウザ', browserName()],
    ['描画方式', backendLabel + (fellBack ? '（WebGPU から自動で切替）' : ''), fellBack],
    ['品質段階', TIER_LABEL[tier]],
    ['GPU', gpuName || '取得できません'],
    ['画面', `${screen.width}×${screen.height} / 表示 ${window.innerWidth}×${window.innerHeight} / DPR ${window.devicePixelRatio} / 描画 ${Math.round(window.innerWidth * dpr)}×${Math.round(window.innerHeight * dpr)}`],
    ...steps.map((s): [string, string, boolean?] => [`fps（${s.n}個）`, `平均 ${s.avg.toFixed(1)} / 遅いとき ${s.low.toFixed(1)} / 95%コマ ${s.p95.toFixed(1)}ms / ${(s.tris / 1000).toFixed(0)}k 三角形`, s.avg < 30]),
    ['読み込み', `最初の描画まで ${loadMs}ms / ページ ${nav ? Math.round(nav.domContentLoadedEventEnd) : '?'}ms / 素材 ${(bytesLoaded / 1024).toFixed(0)}KB`],
    ['メモリ', mem ? `${(mem.usedJSHeapSize / 1048576).toFixed(0)}MB 使用 / 上限 ${(mem.jsHeapSizeLimit / 1048576).toFixed(0)}MB` : '取得できません（このブラウザは非対応）'],
    ['コア数', `${navigator.hardwareConcurrency ?? '?'}${(navigator as unknown as { deviceMemory?: number }).deviceMemory ? ` / メモリ目安 ${(navigator as unknown as { deviceMemory?: number }).deviceMemory}GB` : ''}`],
    ['VR 対応', vr ? 'あり' : 'なし'],
    ['エラー', errors.length ? errors.join(' | ') : 'なし', errors.length > 0],
  ];
  $('tbl').innerHTML = rows.map(([k, v, bad]) => `<tr><td>${k}</td><td class="${bad ? 'bad' : ''}">${v.replace(/</g, '&lt;')}</td></tr>`).join('');
  const code = [
    'IRD1', `dev=${device}`, `br=${browserName().replace(/ /g, '')}`, `be=${isWebGPU ? 'gpu' : 'gl2'}${fellBack ? '!' : ''}`,
    `gpu=${gpuName.replace(/[|=]/g, ' ').slice(0, 60)}`,
    `scr=${screen.width}x${screen.height}`, `win=${window.innerWidth}x${window.innerHeight}`, `dpr=${window.devicePixelRatio}`,
    ...steps.map((s) => `f${s.n}=${s.avg.toFixed(0)}/${s.low.toFixed(0)}/${s.p95.toFixed(0)}`),
    `load=${loadMs}`, `mem=${mem ? Math.round(mem.usedJSHeapSize / 1048576) : '-'}`, `cores=${navigator.hardwareConcurrency ?? '-'}`,
    `vr=${vr ? 1 : 0}`, `err=${errors.length}${errors.length ? ':' + errors[0] : ''}`, `v=${__BUILD__}`,
  ].join('|');
  ($('out') as HTMLTextAreaElement).value = code;
  ($('copy') as HTMLButtonElement).disabled = false;
  status('測定が終わりました。「結果をコピー」を押してください。', 1);
  (window as unknown as { __irDiag: string }).__irDiag = code;
}
declare const __BUILD__: string;

$('copy').addEventListener('click', async () => {
  const ta = $('out') as HTMLTextAreaElement;
  try { await navigator.clipboard.writeText(ta.value); } catch { ta.select(); document.execCommand('copy'); }
  $('copy').textContent = 'コピーしました';
  setTimeout(() => ($('copy').textContent = '結果をコピー'), 1800);
});
$('again').addEventListener('click', () => location.reload());
$('gl').addEventListener('click', () => (location.search = '?backend=webgl'));
$('gpu').addEventListener('click', () => (location.search = '?backend=webgpu'));
run().catch((e) => { errors.push(String(e)); status('測定に失敗しました：' + String(e), 1); console.error(e); });

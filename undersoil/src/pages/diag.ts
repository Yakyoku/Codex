// 実機診断：開くと自動で測り、結果を短い文字列として写し取れる
import * as THREE from 'three/webgpu';
import '../ui/base.css';
import './diag.css';
import { createRenderer } from '../core/renderer';
import { browserName, detectDevice, DEVICE_LABEL, pickTier, rendererPref, TIER_LABEL } from '../core/platform';
import { FpsMeter } from '../core/fps';
import { createGame } from '../game/game';

const t0 = performance.now();
const errors: string[] = [];
addEventListener('error', (e) => errors.push(e.message));
addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));
const W = window as unknown as Record<string, unknown>;
const $ = (id: string) => document.getElementById(id)!;
const MEASURE_MS = Number(new URLSearchParams(location.search).get('ms') ?? 6000);

async function adapterName(isWebGPU: boolean, renderer: THREE.WebGPURenderer): Promise<string> {
  try {
    if (isWebGPU) {
      const ad = await (navigator as unknown as { gpu: { requestAdapter(): Promise<{ info?: Record<string, string> } | null> } }).gpu.requestAdapter();
      const i = ad?.info; return i ? [i.vendor, i.architecture, i.device, i.description].filter(Boolean).join(' ') : '?';
    }
    const gl = (renderer.getContext() as unknown) as WebGL2RenderingContext;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER));
  } catch { return '?'; }
}

async function main() {
  const canvas = $('view') as HTMLCanvasElement;
  const device = detectDevice();
  const pref = rendererPref();
  const { renderer, isWebGPU, fallbackReason } = await createRenderer(canvas, pref);
  const tier = pickTier(device, isWebGPU);
  let dpr = Math.min(devicePixelRatio, 2.5);
  const resize = () => { renderer.setPixelRatio(dpr); renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); camera.aspect = canvas.clientWidth / canvas.clientHeight; camera.updateProjectionMatrix(); };
  // 実際のゲームの区画（湿った状態）を、その端末の品質段階で描いて測る
  const game = await createGame(renderer, '../', tier);
  const { scene, camera, world } = game; game.setWetAll(0.7);
  renderer.shadowMap.enabled = game.q.shadows > 0;
  const look = new THREE.Vector3();
  dpr = Math.min(devicePixelRatio, game.q.maxDpr); resize(); addEventListener('resize', resize);
  await renderer.compileAsync(scene, camera);
  const loadMs = performance.now() - t0;
  const meter = new FpsMeter(2000);
  let start = 0, done = false;
  $('status').textContent = '計測中…（約' + Math.round(MEASURE_MS / 1000) + '秒）';
  renderer.setAnimationLoop((now: number) => {
    const u = 0.15 + 0.6 * (0.5 - 0.5 * Math.cos(now / 4000));
    world.path.getPointAt(u, camera.position); world.path.getPointAt(u + 0.06, look); camera.position.y += 1; camera.lookAt(look);
    renderer.render(scene, camera);
    if (!start) start = now;
    if (now - start > 800 && !done) meter.tick(now); // 最初の0.8秒は準備として捨てる
    if (!done && now - start > 800 + MEASURE_MS) { done = true; void finish(); }
  });

  async function finish() {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const mem = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
    let vr = 'no';
    try { if (xr && await xr.isSessionSupported('immersive-vr')) vr = 'yes'; } catch { vr = 'err'; }
    const gpu = await adapterName(isWebGPU, renderer);
    const bytes = performance.getEntriesByType('resource').reduce((a, r) => a + ((r as PerformanceResourceTiming).transferSize || 0), 0);
    const res: Record<string, string> = {
      端末: DEVICE_LABEL[device],
      ブラウザ: browserName(),
      描画方式: (isWebGPU ? 'WebGPU' : 'WebGL 2') + (fallbackReason ? `（${fallbackReason}）` : '') + (pref !== 'auto' ? `［指定:${pref}］` : ''),
      品質段階: TIER_LABEL[tier],
      場面: `土の区画 ${world.stats.instances} 個 / 三角形 ${Math.round(world.stats.triangles / 1000)}k / 細菌 ${game.swarm.count}`,
      GPU: gpu,
      画面: `${screen.width}×${screen.height} / 表示 ${innerWidth}×${innerHeight} / DPR ${devicePixelRatio}`,
      描画解像度: `${canvas.width}×${canvas.height}`,
      'fps 平均': meter.avg.toFixed(1),
      'fps 遅いとき(下位1%)': meter.low1.toFixed(1),
      'fps 最悪': meter.worst.toFixed(1),
      読み込み時間: `${(loadMs / 1000).toFixed(2)} 秒（ページ ${nav ? (nav.domContentLoadedEventEnd / 1000).toFixed(2) : '?'} 秒）`,
      転送量: bytes ? `${(bytes / 1024).toFixed(0)} KB` : '取得不可',
      メモリ: mem ? `${(mem.usedJSHeapSize / 1048576).toFixed(0)} MB 使用 / 上限 ${(mem.jsHeapSizeLimit / 1048576).toFixed(0)} MB` : '取得不可',
      'CPU/RAM': `${navigator.hardwareConcurrency ?? '?'} コア / ${(navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? '?'} GB`,
      'WebGPU 対応': 'gpu' in navigator ? 'yes' : 'no',
      'VR 対応': vr,
      ゲームパッド: String((navigator.getGamepads?.() ?? []).filter(Boolean).length),
      エラー: errors.length ? errors.join(' / ').slice(0, 300) : 'なし',
    };
    const tb = $('rows'); tb.innerHTML = '';
    for (const [k, v] of Object.entries(res)) { const tr = document.createElement('tr'); const th = document.createElement('th'); th.textContent = k; const td = document.createElement('td'); td.textContent = v; tr.append(th, td); tb.append(tr); }
    const short = [
      'UNDERSOIL-DIAG2', DEVICE_LABEL[device], browserName(), isWebGPU ? 'WebGPU' : 'WebGL2' + (fallbackReason ? '(fallback)' : ''),
      `gpu=${gpu.slice(0, 60)}`, `scr=${screen.width}x${screen.height}@${devicePixelRatio}`, `buf=${canvas.width}x${canvas.height}`, `tier=${tier}`, `tri=${Math.round(world.stats.triangles / 1000)}k`,
      `fps=${meter.avg.toFixed(1)}/${meter.low1.toFixed(1)}/${meter.worst.toFixed(1)}`, `load=${(loadMs / 1000).toFixed(2)}s`, `kb=${(bytes / 1024).toFixed(0)}`,
      `mem=${mem ? (mem.usedJSHeapSize / 1048576).toFixed(0) + 'MB' : 'na'}`, `cpu=${navigator.hardwareConcurrency ?? '?'}`, `vr=${vr}`, `err=${errors.length}`,
      new Date().toISOString().slice(0, 16),
    ].join(' | ');
    ($('short') as HTMLTextAreaElement).value = short;
    $('status').textContent = '計測が終わりました。「結果をコピー」を押して、Claude に貼り付けてください。';
    ($('copy') as HTMLButtonElement).disabled = false;
    W.__state = { ready: true, done: true, isWebGPU, short, errors };
  }
  $('copy').addEventListener('click', async () => {
    const ta = $('short') as HTMLTextAreaElement;
    try { await navigator.clipboard.writeText(ta.value); } catch { ta.select(); document.execCommand('copy'); }
    $('copy').textContent = 'コピーしました';
    setTimeout(() => { $('copy').textContent = '結果をコピー'; }, 1800);
  });
  const go = (r: string) => { const u = new URL(location.href); u.searchParams.set('renderer', r); location.href = u.toString(); };
  $('reAuto').addEventListener('click', () => go('auto'));
  $('reGL').addEventListener('click', () => go('webgl2'));
  $('reGPU').addEventListener('click', () => go('webgpu'));
}
main().catch((e) => { errors.push(String(e)); console.error(e); $('status').textContent = '起動に失敗しました：' + String(e); W.__state = { ready: false, failed: true, errors }; });

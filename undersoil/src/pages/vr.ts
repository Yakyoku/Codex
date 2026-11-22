import * as THREE from 'three/webgpu';
import '../ui/base.css';
import { createRenderer } from '../core/renderer';
import { detectDevice } from '../core/platform';
import { buildMinScene } from './minscene';
import { makeHud } from './hud';

const errors: string[] = [];
addEventListener('error', (e) => errors.push(e.message));
addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));
const W = window as unknown as Record<string, unknown>;

async function main() {
  const canvas = document.getElementById('view') as HTMLCanvasElement;
  const btn = document.getElementById('enterVR') as HTMLButtonElement;
  const msg = document.getElementById('vrMsg')!;
  const device = detectDevice();
  // VR 中は WebGL 2 で動かす（Quest 3 のブラウザでは VR 中の WebGPU がまだ試験的なため）
  const { renderer, isWebGPU } = await createRenderer(canvas, 'webgl2', { xr: true });
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local-floor');
  renderer.xr.setFoveation(1);
  const hud = makeHud(document.getElementById('hud')!, { device, isWebGPU, tier: 'vr' });
  const { scene, group } = await buildMinScene('../', { vr: true, count: 60 });
  // 座った目の高さ（約1.2m）の前方に粒を置く
  group.position.set(0, 1.2, -1.6); group.scale.setScalar(0.45);
  const rig = new THREE.Group(); scene.add(rig);
  const camera = new THREE.PerspectiveCamera(70, 1, 0.05, 100);
  camera.position.set(0, 1.2, 0); rig.add(camera);
  const resize = () => {
    if (renderer.xr.isPresenting) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  };
  addEventListener('resize', resize); resize();

  // 画面上での見回し（ヘッドセットなしの確認用）
  let yaw = 0, pitch = 0, drag = false, px = 0, py = 0;
  canvas.addEventListener('pointerdown', (e) => { drag = true; px = e.clientX; py = e.clientY; });
  addEventListener('pointerup', () => { drag = false; });
  addEventListener('pointermove', (e) => {
    if (!drag || renderer.xr.isPresenting) return;
    yaw -= (e.clientX - px) * 0.004; pitch = Math.max(-1.2, Math.min(1.2, pitch - (e.clientY - py) * 0.004)); px = e.clientX; py = e.clientY;
  });

  const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
  let supported = false;
  try { supported = !!xr && await xr.isSessionSupported('immersive-vr'); } catch { supported = false; }
  if (!supported) {
    btn.disabled = true;
    msg.textContent = xr ? 'このブラウザは VR に対応していません。Meta Quest 3 の標準ブラウザで開いてください。画面をドラッグすると見回せます。'
      : 'WebXR が使えません。Meta Quest 3 の標準ブラウザで開いてください。画面をドラッグすると見回せます。';
  } else {
    msg.textContent = '座って遊ぶのがおすすめです。ときどき休憩をとり、気分が悪くなったらすぐに中断してください。';
  }
  let session: XRSession | null = null;
  btn.addEventListener('click', async () => {
    if (session) { await session.end(); return; }
    try {
      session = await xr!.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] });
      session.addEventListener('end', () => { session = null; btn.textContent = 'VR で遊ぶ'; document.body.classList.remove('in-vr'); resize(); });
      await renderer.xr.setSession(session);
      btn.textContent = 'VR を終了'; document.body.classList.add('in-vr');
    } catch (e) { msg.textContent = 'VR を開始できませんでした：' + (e as Error).message; errors.push(String(e)); }
  });

  let frames = 0;
  renderer.setAnimationLoop((now: number) => {
    const t = now / 1000;
    group.rotation.y = t * 0.2;
    if (!renderer.xr.isPresenting) camera.rotation.set(pitch, yaw, 0, 'YXZ');
    renderer.render(scene, camera);
    hud.tick(now); frames++;
    W.__state = { ready: frames > 3, frames, isWebGPU, supported, presenting: renderer.xr.isPresenting, errors };
  });
}
main().catch((e) => { errors.push(String(e)); console.error(e); W.__state = { ready: false, failed: true, errors }; });

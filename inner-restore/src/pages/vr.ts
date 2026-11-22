import * as THREE from 'three/webgpu';
import { createRenderer, fitRenderer } from '../core/renderer';
import { detectDevice, DEVICE_LABEL } from '../core/device';
import { Hud } from '../core/hud';
import { buildRbcScene } from './rbcScene';

const W = window as unknown as Record<string, unknown>;
const errors: string[] = (W.__irErrors = []) as string[];
window.addEventListener('error', (e) => errors.push(String(e.message)));
window.addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));

async function main() {
  const canvas = document.getElementById('view') as HTMLCanvasElement;
  const btn = document.getElementById('entervr') as HTMLButtonElement;
  const msg = document.getElementById('vrmsg')!;
  const device = detectDevice();
  // VR 中は WebGL 2 で動かす
  const { renderer, backendLabel } = await createRenderer(canvas, { xr: true });
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local-floor');
  renderer.xr.setFoveation(1);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.05, 300);
  const rig = new THREE.Group();        // プレイヤーの土台。VR ではこれを動かし、頭の動きは奪わない
  rig.add(camera);
  camera.position.set(0, 1.4, 0);
  fitRenderer(renderer, camera, 2);
  // 1 単位 = 1µm の素材を、VR の中では 1m ≒ 14µm になるよう縮めて置く（赤血球が直径約55cmに見える）
  const { scene, update } = await buildRbcScene(renderer, 220, 1, 26);
  const world = new THREE.Group();
  world.scale.setScalar(0.07);
  world.position.set(0, 1.35, -1.1);
  for (const c of [...scene.children]) { world.add(c); const l = c as THREE.PointLight; if (l.isPointLight) { l.intensity *= 0.07 * 0.07; l.distance *= 0.07; } }
  scene.add(world, rig);
  scene.fog = new THREE.FogExp2(0x1a0606, 0.3);
  const hud = new Hud(`${backendLabel} · VR · ${DEVICE_LABEL[device]}`);
  let session: XRSession | null = null;
  const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
  const supported = !!xr && (await xr.isSessionSupported('immersive-vr').catch(() => false));
  if (supported) {
    btn.disabled = false;
    msg.textContent = '座ったまま遊べます。気分が悪くなったら、すぐに中断して休憩してください。';
  } else {
    msg.textContent = 'このブラウザは VR に対応していません。Meta Quest 3 の標準ブラウザでこのページを開いてください。（下は同じ場面の画面表示です）';
  }
  btn.addEventListener('click', async () => {
    if (session) { await session.end(); return; }
    try {
      session = await xr!.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] });
      session.addEventListener('end', () => { session = null; btn.textContent = 'VR で遊ぶ'; W.__irXR = false; });
      await renderer.xr.setSession(session);
      btn.textContent = 'VR を終了';
      W.__irXR = true;
    } catch (e) {
      msg.textContent = 'VR を開始できませんでした：' + String(e);
      errors.push(String(e));
    }
  });
  const t0 = performance.now();
  renderer.setAnimationLoop(() => {
    const t = (performance.now() - t0) / 1000;
    update(t, camera);
    renderer.render(scene, camera);
    hud.tick();
    W.__irFrames = ((W.__irFrames as number) || 0) + 1;
  });
  W.__irReady = { backend: backendLabel, supported };
}
main().catch((e) => { errors.push(String(e)); console.error(e); });

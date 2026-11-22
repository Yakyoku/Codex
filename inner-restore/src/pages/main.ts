import * as THREE from 'three/webgpu';
import { createRenderer, fitRenderer, backendPrefFromURL } from '../core/renderer';
import { detectDevice, DEVICE_LABEL, pickTier, TIER_LABEL } from '../core/device';
import { Hud } from '../core/hud';
import { buildRbcScene } from './rbcScene';

const errors: string[] = ((window as unknown as { __irErrors: string[] }).__irErrors = []);
window.addEventListener('error', (e) => errors.push(String(e.message)));
window.addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));

async function main() {
  const canvas = document.getElementById('view') as HTMLCanvasElement;
  const device = detectDevice();
  const { renderer, isWebGPU, backendLabel } = await createRenderer(canvas, { pref: backendPrefFromURL() });
  const tier = pickTier(device, isWebGPU);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);
  camera.position.set(0, 2.5, 22);
  camera.lookAt(0, 0, 0);
  fitRenderer(renderer, camera, tier === 'compat' ? 1.5 : 2);
  const { scene, update } = await buildRbcScene(renderer, tier === 'compat' ? 160 : 400);
  const hud = new Hud(`${backendLabel} · ${TIER_LABEL[tier]} · ${DEVICE_LABEL[device]}`);
  const nav = document.createElement('nav');
  nav.className = 'ir-nav';
  nav.innerHTML = '<a href="/vr/">VR で遊ぶ</a><a href="/diag/">実機診断</a><a href="/progress/">進捗</a>';
  document.body.appendChild(nav);
  const fixedT = new URLSearchParams(location.search).get('t');
  const t0 = performance.now();
  renderer.setAnimationLoop(() => {
    const t = fixedT !== null ? Number(fixedT) : (performance.now() - t0) / 1000;
    update(t, camera);
    renderer.render(scene, camera);
    hud.tick();
    (window as unknown as { __irFrames: number }).__irFrames = ((window as unknown as { __irFrames: number }).__irFrames || 0) + 1;
  });
  (window as unknown as { __irReady: object }).__irReady = { backend: backendLabel, tier, device };
}
main().catch((e) => { errors.push(String(e)); console.error(e); });

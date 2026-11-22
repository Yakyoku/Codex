import * as THREE from 'three/webgpu';
import '../ui/base.css';
import { createRenderer } from '../core/renderer';
import { detectDevice, pickTier, rendererPref } from '../core/platform';
import { buildMinScene } from './minscene';
import { makeHud } from './hud';

const errors: string[] = [];
addEventListener('error', (e) => errors.push(e.message));
addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));

async function main() {
  const canvas = document.getElementById('view') as HTMLCanvasElement;
  const device = detectDevice();
  const { renderer, isWebGPU, fallbackReason } = await createRenderer(canvas, rendererPref());
  const tier = pickTier(device, isWebGPU);
  const hud = makeHud(document.getElementById('hud')!, { device, isWebGPU, tier, note: fallbackReason });
  const { scene, group } = await buildMinScene('./');
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);
  camera.position.set(0, 0.5, 5);
  const resize = () => {
    const w = innerWidth, h = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, device === 'pc' ? 2 : 2.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  addEventListener('resize', resize); resize();
  if (device === 'quest') document.getElementById('toVR')!.classList.add('primary');
  // テスト用：?t=秒 で時間を固定する（同じ条件で撮るため）
  const fixedT = new URLSearchParams(location.search).get('t');
  let frames = 0;
  renderer.setAnimationLoop((now: number) => {
    const t = fixedT !== null ? Number(fixedT) : now / 1000;
    group.rotation.y = t * 0.25; group.rotation.x = Math.sin(t * 0.17) * 0.2;
    renderer.render(scene, camera);
    hud.tick(now);
    frames++;
    (window as unknown as Record<string, unknown>).__state = { ready: frames > 3, frames, isWebGPU, tier, device, errors };
  });
}
main().catch((e) => { errors.push(String(e)); console.error(e); (window as unknown as Record<string, unknown>).__state = { ready: false, failed: true, errors }; });

import * as THREE from 'three/webgpu';
import '../ui/base.css';
import { createRenderer } from '../core/renderer';
import { detectDevice, pickTier, rendererPref, type QualityTier } from '../core/platform';
import { createGame } from '../game/game';
import { makeHud } from './hud';

const errors: string[] = [];
addEventListener('error', (e) => errors.push(e.message));
addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));
const W = window as unknown as Record<string, unknown>;
const Q = new URLSearchParams(location.search);

async function main() {
  const canvas = document.getElementById('view') as HTMLCanvasElement;
  const device = detectDevice();
  const { renderer, isWebGPU, fallbackReason } = await createRenderer(canvas, rendererPref());
  const tier = (Q.get('tier') as QualityTier | null) ?? pickTier(device, isWebGPU);
  const hud = makeHud(document.getElementById('hud')!, { device, isWebGPU, tier, note: fallbackReason });
  const game = await createGame(renderer, './', tier);
  const { scene, camera, world } = game;
  renderer.shadowMap.enabled = game.q.shadows > 0;
  renderer.toneMappingExposure = 1.0;
  const resize = () => {
    renderer.setPixelRatio(Math.min(devicePixelRatio, game.q.maxDpr)); renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  };
  addEventListener('resize', resize); resize();
  if (device === 'quest') document.getElementById('toVR')!.classList.add('primary');
  // 確認用：?cam=0..1（道のりの位置）、?wet=0..1（全区画の濡れ）、?t=秒（時間を固定）
  const camT = Q.get('cam'), wetQ = Q.get('wet'), fixedT = Q.get('t');
  const freeze = Number(Q.get('freeze') ?? 0); // 確認用：このコマ数だけ描いて止める（ソフトウェア描画での撮影用）
  if (wetQ !== null) game.setWetAll(Number(wetQ));
  const look = new THREE.Vector3(); let frames = 0, last = 0;
  renderer.setAnimationLoop((now: number) => {
    const t = fixedT !== null ? Number(fixedT) : now / 1000; const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    const u = camT !== null ? Number(camT) : (Math.sin(t * 0.05 - 1.5) * 0.5 + 0.5) * 0.9;
    world.path.getPointAt(Math.min(0.985, u), camera.position); world.path.getPointAt(Math.min(1, u + 0.06), look);
    camera.position.y += 1.0; camera.lookAt(look);
    if (wetQ === null) game.update(dt, t);
    renderer.render(scene, camera);
    hud.tick(now); frames++;
    const frozen = freeze > 0 && frames >= freeze; if (frozen) renderer.setAnimationLoop(null);
    W.__state = { ready: frames > 3, frozen, frames, isWebGPU, tier, device, errors, stats: world.stats };
  });
}
main().catch((e) => { errors.push(String(e)); console.error(e); W.__state = { ready: false, failed: true, errors }; });

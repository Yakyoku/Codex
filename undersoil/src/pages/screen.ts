import * as THREE from 'three/webgpu';
import '../ui/base.css';
import '../ui/game.css';
import facts from '../data/facts.json';
import { createRenderer } from '../core/renderer';
import { setProgressListener } from '../core/assets';
import { detectDevice, pickTier, rendererPref, type QualityTier } from '../core/platform';
import { createGame } from '../game/game';
import { makeFreeControls } from '../game/controls';
import { makeDemo } from '../game/demo';
import { makePost } from '../game/post';
import { buildSurface, type Surface } from '../game/surface';
import { makeHud } from './hud';

const errors: string[] = [];
addEventListener('error', (e) => errors.push(e.message));
addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));
const W = window as unknown as Record<string, unknown>;
const Q = new URLSearchParams(location.search);
const $ = (id: string) => document.getElementById(id)!;

function runFacts() {
  const list = facts as { name: string; text: string }[]; if (!list.length) return () => {};
  let i = Math.floor(Math.random() * list.length); const el = $('fact');
  const show = () => { const f = list[i++ % list.length]; el.style.opacity = '0'; setTimeout(() => { el.innerHTML = ''; const s = document.createElement('small'); s.textContent = f.name; el.append(s, document.createTextNode(f.text)); el.style.opacity = '.92'; }, 400); };
  show(); const id = setInterval(show, 5200); return () => clearInterval(id);
}

async function main() {
  const canvas = $('view') as HTMLCanvasElement;
  const device = detectDevice();
  if (Q.has('clean')) document.body.classList.add('clean');
  const stopFacts = runFacts();
  setProgressListener((d, t) => { ($('loadBar') as HTMLElement).style.width = `${Math.round((d / Math.max(1, t)) * 90)}%`; });
  const { renderer, isWebGPU, fallbackReason } = await createRenderer(canvas, rendererPref());
  const tier = (Q.get('tier') as QualityTier | null) ?? pickTier(device, isWebGPU);
  const hud = makeHud($('hud'), { device, isWebGPU, tier, note: fallbackReason });
  const game = await createGame(renderer, './', tier);
  const { scene, camera, world } = game;
  renderer.shadowMap.enabled = game.q.shadows > 0;
  const post = Q.has('nopost') || !game.q.post.length ? null : makePost(renderer, scene, camera, game.q.post);
  const resize = () => {
    renderer.setPixelRatio(Math.min(devicePixelRatio, game.q.maxDpr)); renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    if (surfaceCam) { surfaceCam.aspect = innerWidth / innerHeight; surfaceCam.updateProjectionMatrix(); }
  };
  let surfaceCam: THREE.PerspectiveCamera | null = null;
  addEventListener('resize', resize); addEventListener('orientationchange', resize); resize();
  if (device === 'quest') $('toVR').classList.add('primary');

  // 確認用：?cam=0..1（道のりの位置）、?wet=0..1（全区画の濡れ）、?t=秒（時間を固定）、?freeze=コマ数、?pos=x,y,z,lx,ly,lz
  const camT = Q.get('cam'), wetQ = Q.get('wet'), fixedT = Q.get('t'), dbg = Q.get('pos');
  const freeze = Number(Q.get('freeze') ?? 0);
  const testing = camT !== null || dbg !== null || freeze > 0;
  if (wetQ !== null) game.setWetAll(Number(wetQ));
  // 地上の場面（?scene=surface&g=0..1 で直接確認できる）
  const surface: Surface = await buildSurface(renderer, './', { shadows: game.q.shadows > 0, density: game.q.grainCount });
  const postSurface = post ? makePost(renderer, surface.scene, surface.camera, game.q.post.filter((e) => e !== 'vignette' && e !== 'grain')) : null;
  let mode: 'soil' | 'surface' = Q.get('scene') === 'surface' ? 'surface' : 'soil';
  let growT = 0; const GROW_SEC = 26;
  if (Q.get('g') !== null) surface.setGrowth(Number(Q.get('g')));
  const fade = document.createElement('div'); fade.className = 'fade'; document.body.append(fade);
  const switchTo = (m: 'soil' | 'surface') => { fade.classList.add('on'); setTimeout(() => { mode = m; growT = 0; surface.setGrowth(0); document.body.classList.toggle('surface', m === 'surface'); renderer.toneMappingExposure = m === 'surface' ? 0.9 : 1.0; fade.classList.remove('on'); }, 900); };
  surfaceCam = surface.camera; resize();
  if (mode === 'surface') { document.body.classList.add('surface'); renderer.toneMappingExposure = 0.9; }
  const demo = makeDemo(world);
  const controls = makeFreeControls(camera, canvas, world.colliders, $('stick'));
  let touring = true; controls.enabled = false;
  const look = new THREE.Vector3();
  const placeOnPath = (u: number) => { world.path.getPointAt(Math.min(0.985, u), camera.position); world.path.getPointAt(Math.min(1, u + 0.06), look); camera.position.y += 1.0; camera.lookAt(look); };
  placeOnPath(0.02);

  // シェーダーの初回コンパイルの引っかかりを避けるため、読み込み中に準備しておく
  await renderer.compileAsync(scene, camera);
  ($('loadBar') as HTMLElement).style.width = '100%';
  const begin = () => { $('loading').classList.add('hide'); stopFacts(); if (wetQ === null && !testing) setTimeout(() => demo.start(), 2500); };
  if (testing) begin(); else { const b = $('start') as HTMLButtonElement; b.hidden = false; b.addEventListener('click', begin, { once: true }); }

  $('water').addEventListener('click', () => demo.start());
  $('dry').addEventListener('click', () => demo.dry());
  $('sprout').addEventListener('click', () => switchTo(mode === 'soil' ? 'surface' : 'soil'));
  $('tour').addEventListener('click', () => {
    touring = !touring; controls.enabled = !touring; $('tour').textContent = touring ? '自分で動く' : '自動で巡る';
    if (!touring) { const e = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ'); controls.yaw = e.y; controls.pitch = e.x; }
  });
  $('fs').addEventListener('click', () => { if (document.fullscreenElement) void document.exitFullscreen(); else void document.documentElement.requestFullscreen?.().catch(() => {}); });
  if (!document.documentElement.requestFullscreen) $('fs').style.display = 'none';
  let hidden = false; document.addEventListener('visibilitychange', () => { hidden = document.hidden; last = 0; });

  let frames = 0, last = 0, tourU = 0.02, vitShown = -1;
  renderer.setAnimationLoop((now: number) => {
    if (hidden) return;
    const t = fixedT !== null ? Number(fixedT) : now / 1000; const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    if (dbg) { const v = dbg.split(',').map(Number); camera.position.set(v[0], v[1], v[2]); camera.lookAt(v[3], v[4], v[5]); }
    else if (camT !== null) placeOnPath(Number(camT));
    else if (touring) { tourU = (tourU + dt * 0.012) % 1; placeOnPath(0.02 + 0.9 * (0.5 - 0.5 * Math.cos(tourU * Math.PI * 2))); }
    else controls.update(dt);
    if (wetQ === null) { demo.update(dt); game.update(dt, t); }
    if (mode === 'surface') {
      if (Q.get('g') === null) { growT += dt; surface.setGrowth(Math.min(1, growT / GROW_SEC)); }
      surface.update(dt, t);
      if (postSurface) postSurface.render(); else renderer.render(surface.scene, surface.camera);
    } else if (post) post.render(); else renderer.render(scene, camera);
    hud.tick(now); frames++;
    const vit = Math.round(world.grid.mean() * 100);
    $('sprout').textContent = mode === 'soil' ? '地上を見る' : '土の中へ戻る';
    if (vit !== vitShown) { vitShown = vit; $('vitNum').textContent = String(vit); ($('vitBar') as HTMLElement).style.width = vit + '%'; }
    const frozen = freeze > 0 && frames >= freeze; if (frozen) renderer.setAnimationLoop(null);
    W.__state = { ready: frames > 3, frozen, frames, isWebGPU, tier, device, errors, stats: world.stats, vitality: vit, bridges: game.bridges.count, swarm: game.swarm.count };
  });
}
main().catch((e) => { errors.push(String(e)); console.error(e); W.__state = { ready: false, failed: true, errors }; });

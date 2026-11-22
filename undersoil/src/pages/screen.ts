import * as THREE from 'three/webgpu';
import '../ui/base.css';
import '../ui/game.css';
import facts from '../data/facts.json';
import { createRenderer } from '../core/renderer';
import { setProgressListener } from '../core/assets';
import { detectDevice, pickTier, rendererPref, TIER_LABEL, type QualityTier } from '../core/platform';
import { createGame } from '../game/game';
import { makeFreeControls } from '../game/controls';
import { makeDemo } from '../game/demo';
import { makePost } from '../game/post';
import { buildSurface, type Surface } from '../game/surface';
import { makeEncounters } from '../game/encounters';
import { mountSettings, savedTier } from '../ui/settings';
import { createAudio } from '../audio/engine';
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
  const tier = (Q.get('tier') as QualityTier | null) ?? (savedTier() as QualityTier | null) ?? pickTier(device, isWebGPU);
  mountSettings($('settings'), { renderer: isWebGPU ? 'WebGPU' : 'WebGL 2', tier: TIER_LABEL[tier] });
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
  const testing = camT !== null || dbg !== null || freeze > 0 || Q.has('manual') || Q.get('scene') !== null;
  if (wetQ !== null) game.setWetAll(Number(wetQ));
  // 地上の場面（?scene=surface&g=0..1 で直接確認できる）
  const surface: Surface = await buildSurface(renderer, './', { shadows: game.q.shadows > 0, density: game.q.grainCount });
  const postSurface = post ? makePost(renderer, surface.scene, surface.camera, game.q.post, { distance: surface.focusDistance as never, range: 9, bokeh: 3.5 }) : null;
  let mode: 'soil' | 'surface' = Q.get('scene') === 'surface' ? 'surface' : 'soil';
  let growT = 0; const GROW_SEC = Number(Q.get('grow') ?? 26);
  if (Q.get('g') !== null) surface.setGrowth(Number(Q.get('g')));
  const fade = document.createElement('div'); fade.className = 'fade'; document.body.append(fade);
  const switchTo = (m: 'soil' | 'surface') => { fade.classList.add('on'); setTimeout(() => { mode = m; growT = 0; surface.setGrowth(0); document.body.classList.toggle('surface', m === 'surface'); renderer.toneMappingExposure = m === 'surface' ? 0.9 : 1.0; fade.classList.remove('on'); }, 900); };
  surfaceCam = surface.camera; resize();
  if (mode === 'surface') { document.body.classList.add('surface'); renderer.toneMappingExposure = 0.9; }
  let started = false;
  const audio = createAudio();
  try { audio.muted = localStorage.getItem('undersoil.muted') === '1'; } catch { /* noop */ }
  const demo = makeDemo(world);
  const controls = makeFreeControls(camera, canvas, world.colliders, $('stick'));
  let touring = true; controls.enabled = false;
  const look = new THREE.Vector3();
  const placeOnPath = (u: number) => { world.path.getPointAt(Math.min(0.985, u), camera.position); world.path.getPointAt(Math.min(1, u + 0.06), look); camera.position.y += 1.0; camera.lookAt(look); };
  placeOnPath(0.02);

  // シェーダーの初回コンパイルの引っかかりを避けるため、読み込み中に準備しておく
  await renderer.compileAsync(scene, camera);
  ($('loadBar') as HTMLElement).style.width = '100%';
  const begin = () => { started = true; audio.start(); $('loading').classList.add('hide'); stopFacts(); if (wetQ === null && !testing) setTimeout(() => demo.start(), 2500); };
  if (testing) begin(); else { const b = $('start') as HTMLButtonElement; b.hidden = false; b.addEventListener('click', begin, { once: true }); }

  // 出会いの順番（M1 の自動の流れ用。M3 で、プレイヤーの位置と行動に結び付ける）
  const cellW = (i: number) => world.grid.cells[i].water, cellM = (i: number) => world.grid.cells[i].microbes;
  const enc = makeEncounters([
    { id: 'sand', when: () => mode === 'soil' && started },
    { id: 'aggregate', when: () => mode === 'soil' && started },
    { id: 'water-film', when: () => mode === 'soil' && cellW(1) > 0.4 },
    { id: 'bacillus-subtilis', when: () => mode === 'soil' && cellM(2) > 0.3 },
    { id: 'humus', when: () => mode === 'soil' && cellW(4) > 0.4 },
    { id: 'pseudomonas-fluorescens', when: () => mode === 'soil' && cellM(6) > 0.3 },
    { id: 'colpoda', when: () => mode === 'soil' && game.creatures.anyActive() },
    { id: 'clay', when: () => mode === 'soil' && cellW(8) > 0.4 },
    { id: 'trifolium-repens', when: () => mode === 'surface' && surface.growth > 0.75 },
  ], { gapSec: 4, onShow: () => audio.chime() });
  $('water').addEventListener('click', () => demo.start());
  $('dry').addEventListener('click', () => demo.dry());
  $('sprout').addEventListener('click', () => switchTo(mode === 'soil' ? 'surface' : 'soil'));
  const muteBtn = $('mute'); const showMute = () => { muteBtn.textContent = audio.muted ? '音：切' : '音：入'; }; showMute();
  muteBtn.addEventListener('click', () => { audio.start(); audio.setMuted(!audio.muted); showMute(); try { localStorage.setItem('undersoil.muted', audio.muted ? '1' : '0'); } catch { /* noop */ } });
  // タブを切り替えて戻ったとき、音が壊れないように止めて再開する
  document.addEventListener('visibilitychange', () => audio.pause(document.hidden));
  $('tour').addEventListener('click', () => {
    touring = !touring; controls.enabled = !touring; $('tour').textContent = touring ? '自分で動く' : '自動で巡る';
    if (!touring) { const e = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ'); controls.yaw = e.y; controls.pitch = e.x; }
  });
  $('fs').addEventListener('click', () => { if (document.fullscreenElement) void document.exitFullscreen(); else void document.documentElement.requestFullscreen?.().catch(() => {}); });
  if (!document.documentElement.requestFullscreen) $('fs').style.display = 'none';
  let hidden = false; document.addEventListener('visibilitychange', () => { hidden = document.hidden; last = 0; });

  let frames = 0, last = 0, tourU = 0.02, vitShown = -1;
  const frame = (now: number) => {
    if (hidden) return;
    const t = fixedT !== null ? Number(fixedT) : now / 1000; const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    if (dbg) { const v = dbg.split(',').map(Number); camera.position.set(v[0], v[1], v[2]); camera.lookAt(v[3], v[4], v[5]); }
    else if (camT !== null) placeOnPath(Number(camT));
    else if (touring) { tourU = (tourU + dt * 0.012) % 1; placeOnPath(0.02 + 0.66 * (0.5 - 0.5 * Math.cos(tourU * Math.PI * 2))); /* 奥の種のまわり（まだ作っていない）へは行かない */ }
    else controls.update(dt);
    if (wetQ === null) { demo.update(dt); game.update(dt, t); }
    if (mode === 'surface') {
      if (Q.get('g') === null) { growT += dt; surface.setGrowth(Math.min(1, growT / GROW_SEC)); }
      surface.update(dt, t);
      if (postSurface) postSurface.render(); else renderer.render(surface.scene, surface.camera);
    } else if (post) post.render(); else renderer.render(scene, camera);
    if (!testing) enc.update(dt);
    audio.setMode(mode); audio.setVitality(world.grid.mean()); audio.setGrowth(surface.growth); audio.update(dt);
    hud.tick(now); frames++;
    const vit = Math.round(world.grid.mean() * 100);
    $('sprout').textContent = mode === 'soil' ? '地上を見る' : '土の中へ戻る';
    if (vit !== vitShown) { vitShown = vit; $('vitNum').textContent = String(vit); ($('vitBar') as HTMLElement).style.width = vit + '%'; }
    const frozen = freeze > 0 && frames >= freeze; if (frozen) renderer.setAnimationLoop(null);
    W.__col = game.creatures.nearest(camera.position)?.toArray().map((v) => Math.round(v * 10) / 10);
    W.__state = { col: W.__col, ready: frames > 3, frozen, frames, isWebGPU, tier, device, errors, stats: world.stats, vitality: vit, bridges: game.bridges.count, swarm: game.swarm.count, mode };
  };
  // 動画づくり用：?manual を付けると、外から時間を1コマずつ進められる（この環境の描画は遅いので、そのまま録画しても滑らかにならない）
  if (Q.has('manual')) { W.__frame = (ms: number) => frame(ms); W.__switch = (m: 'soil' | 'surface') => { mode = m; growT = 0; surface.setGrowth(0); document.body.classList.toggle('surface', m === 'surface'); renderer.toneMappingExposure = m === 'surface' ? 0.9 : 1.0; }; W.__demo = () => demo.start(); frame(0); frame(16); frame(32); frame(48); frame(64); }
  else renderer.setAnimationLoop(frame);
}
main().catch((e) => { errors.push(String(e)); console.error(e); W.__state = { ready: false, failed: true, errors }; });

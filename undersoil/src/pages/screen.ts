import * as THREE from 'three/webgpu';
import { uniform } from 'three/tsl';
import '../ui/base.css';
import '../ui/game.css';
import facts from '../data/facts.json';
import { createRenderer } from '../core/renderer';
import { setProgressListener } from '../core/assets';
import { detectDevice, pickTier, rendererPref, TIER_LABEL, type QualityTier } from '../core/platform';
import { createGame } from '../game/game';
import { makeFreeControls, pushOut } from '../game/controls';
import { makeDemo } from '../game/demo';
import { makePost } from '../game/post';
import { buildSurface, type Surface } from '../game/surface';
import { buildMicroscope } from '../game/microscope';
import { makeEncounters } from '../game/encounters';
import { SPECIES } from '../game/species';
import { showCard } from '../ui/card';
import { makePointer } from '../ui/pointer';
import type { Target } from '../game/encounters';
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
  const underFocus = uniform(12);
  const post = Q.has('nopost') || !game.q.post.length ? null : makePost(renderer, scene, camera, game.q.post, { distance: underFocus as never, range: 8, bokeh: 2.2 });
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
  const switchTo = (m: 'soil' | 'surface') => { fade.classList.add('on'); setTimeout(() => { mode = m; growT = 0; surface.setGrowth(0); document.body.classList.toggle('surface', m === 'surface'); renderer.toneMappingExposure = m === 'surface' ? 1.0 : 1.0; fade.classList.remove('on'); }, 900); };
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
  const begin = () => { started = true; audio.start(); setTimeout(() => $('loading').classList.add('hide'), 250); stopFacts(); if (wetQ === null && !testing) setTimeout(() => demo.start(), 2500); };
  // 確認用：?card=<id> で紹介カードをすぐ出す
  const cardQ = Q.get('card'); if (cardQ && SPECIES[cardQ]) setTimeout(() => { const T: Record<string, () => Target> = { sand: grain('quartz'), aggregate: grain('aggregate'), humus: grain('humus'), clay: grain('clay'), 'water-film': bridge, 'bacillus-subtilis': bacteria, 'pseudomonas-fluorescens': pseudo, colpoda, 'trifolium-repens': seedling, 'paramacrobiotus-metropolitanus': tardi }; const t = T[cardQ]; showCard(SPECIES[cardQ], { narration: false, holdMs: 600000, pointing: !!t }); pointer.show(t ?? null, SPECIES[cardQ].nameJa); if (ORGANISMS.includes(cardQ)) { beginVisit(cardQ, t ?? null); scope.show(cardQ, SPECIES[cardQ].nameJa); } }, 1500);
  if (testing) begin(); else { const b = $('start') as HTMLButtonElement; b.hidden = false; b.addEventListener('click', begin, { once: true }); }

  // 出会いの順番（M1 の自動の流れ用。M3 で、プレイヤーの位置と行動に結び付ける）
  const cellW = (i: number) => world.grid.cells[i].water, cellM = (i: number) => world.grid.cells[i].microbes;
  // 紹介カードが指し示す相手（カメラの前にあるもの）
  const pointer = makePointer(camera, [scene]);
  const fwd = () => new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  const grain = (k: 'quartz' | 'aggregate' | 'humus' | 'clay') => (): Target => world.find(k, camera.position, fwd());
  const bridge = (): Target => { let best: THREE.Vector3 | null = null, bs = 0; const f = fwd(), d = new THREE.Vector3();
    game.bridges.centers.forEach((c, i) => { if (world.grid.cells[game.bridges.cells[i]].water < 0.3) return; d.subVectors(c, camera.position); const dist = d.length(); if (dist < 3 || dist > 30) return; const cs = d.dot(f) / dist; if (cs < 0.85) return; const sc = cs / (1 + dist * 0.06); if (sc > bs) { bs = sc; best = c; } });
    return best ? { p: (best as THREE.Vector3).clone(), r: 2.5 } : null; };
  // 細菌の集落：カメラの前になければ、まわりのどの向きからでも探す
  const dirs = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0)];
  const anyDir = (f: (d: THREE.Vector3) => Target) => () => { const a = f(fwd()); if (a) return a; for (const d of dirs) { const b = f(d); if (b) return b; } return null; };
  const bacteria = anyDir((d) => { const f = game.swarm.find(camera.position, d); return f ? { ...f, r: 0.6 } : null; });
  const pseudo = anyDir((d) => { const f = game.swarm2.find(camera.position, d); return f ? { ...f, r: 0.6 } : null; });
  const colpoda = (): Target => { const p = game.creatures.nearest(camera.position); return p ? { p: p.clone(), r: 4.5 } : null; };
  const tardi = (): Target => game.tardigrade.target();
  const seedling = (): Target => mode === 'surface' ? { p: new THREE.Vector3(0.3, surface.groundY + 1.2, 0.2), r: 3.2 } : null;
  let focusT: THREE.Vector3 | null = null;
  const scope = await buildMicroscope('./');
  // 生き物を見せに行く：カードが出ている間、カメラはその生き物のそばで止まり、離れていれば暗転して移る
  const ORGANISMS = ['bacillus-subtilis', 'pseudomonas-fluorescens', 'colpoda', 'paramacrobiotus-metropolitanus'];
  const VIEW: Record<string, number> = { 'bacillus-subtilis': 2.2, 'pseudomonas-fluorescens': 2.6, colpoda: 13, 'paramacrobiotus-metropolitanus': 70 };
  let visit: { get: () => Target; dist: number; pos: THREE.Vector3; anchor: THREE.Vector3; ret: THREE.Vector3; retQ: THREE.Quaternion } | null = null;
  /** 生き物がよく見える位置：まわりの向きを順に試し、間に粒がない向きを選ぶ */
  const clear = (a: THREE.Vector3, b: THREE.Vector3, skip: number) => { const d = b.clone().sub(a), L = d.length(); d.divideScalar(L);
    for (const c of world.colliders) { const v = new THREE.Vector3(c.x, c.y, c.z).sub(a); const t = v.dot(d); if (t < 0.5 || t > L - skip) continue; if (v.lengthSq() - t * t < (c.r * 0.95) ** 2) return false; } return true; };
  const viewFor = (p: THREE.Vector3, dist: number, view?: THREE.Vector3) => {
    if (view) return view.clone();
    // まず、生き物が付いている粒の表面の真正面（粒の中心から外へ向かう向き）から見る
    let host: { x: number; y: number; z: number; r: number } | null = null, hd = 1e9;
    for (const c of world.colliders) { const d = Math.hypot(p.x - c.x, p.y - c.y, p.z - c.z) - c.r; if (d < hd) { hd = d; host = c; } }
    if (host && hd < 1.5) { const n = p.clone().sub(new THREE.Vector3(host.x, host.y, host.z)).normalize(); const v = p.clone().addScaledVector(n, dist); pushOut(v, world.colliders, 0.6); if (clear(v, p, dist * 0.3)) return v; }
    const base = camera.position.clone().sub(p); base.y = 0; if (base.lengthSq() < 1e-4) base.set(1, 0, 0); base.normalize();
    for (let k = 0; k < 16; k++) {
      const ang = (k % 8) * Math.PI / 4 * (k % 2 ? 1 : -1) * 0.5 + (k >= 8 ? Math.PI : 0), el = k >= 8 ? 0.6 : 0.3;
      const d = base.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), ang); d.y = el; d.normalize();
      const v = p.clone().addScaledVector(d, dist); pushOut(v, world.colliders, 1.0);
      if (clear(v, p, dist * 0.35)) return v;
    }
    const v = p.clone().addScaledVector(base, dist); pushOut(v, world.colliders, 1.0); return v;
  };
  const beginVisit = (id: string, t: (() => Target) | null) => {
    if (!t || !touring) return; const first = t(); if (!first) return;
    const dist = VIEW[id] ?? 6, pos = viewFor(first.p, dist, first.view);
    // 手前の細かい粒で見えなくならないよう、見ている間だけ、カメラのすぐ前（距離の半分まで）は描かない
    camera.near = Math.max(0.08, dist * (dist < 4 ? 0.8 : 0.5)); camera.updateProjectionMatrix();
    if (id === 'bacillus-subtilis') game.swarm.highlight(first.p); if (id === 'pseudomonas-fluorescens') game.swarm2.highlight(first.p);
    game.lights.fill.intensity = 7 + Math.min(60, dist * 0.9) * 2;
    visit = { get: t, dist, pos, anchor: first.p.clone(), ret: camera.position.clone(), retQ: camera.quaternion.clone() };
    if (camera.position.distanceTo(pos) > 12) { fade.classList.add('on'); setTimeout(() => { if (visit) { camera.position.copy(visit.pos); const f = visit.get(); if (f) camera.lookAt(f.p); } fade.classList.remove('on'); }, 700); }
  };
  const endVisit = () => { game.lights.fill.intensity = 7; game.swarm.highlight(null); game.swarm2.highlight(null); if (!visit) return; const v = visit; visit = null; setTimeout(() => { camera.near = 0.08; camera.updateProjectionMatrix(); }, 700); if (camera.position.distanceTo(v.ret) > 12) { fade.classList.add('on'); setTimeout(() => fade.classList.remove('on'), 700); } };
  const enc = makeEncounters([
    { id: 'sand', when: () => mode === 'soil' && started && !!grain('quartz')(), target: grain('quartz') },
    { id: 'aggregate', when: () => mode === 'soil' && started && !!grain('aggregate')(), target: grain('aggregate') },
    { id: 'water-film', when: () => mode === 'soil' && cellW(1) > 0.4 && !!bridge(), target: bridge },
    { id: 'bacillus-subtilis', when: () => mode === 'soil' && cellM(2) > 0.3 && !!bacteria(), target: bacteria },
    { id: 'humus', when: () => mode === 'soil' && cellW(4) > 0.4 && !!grain('humus')(), target: grain('humus') },
    { id: 'pseudomonas-fluorescens', when: () => mode === 'soil' && cellM(6) > 0.3 && !!pseudo(), target: pseudo },
    { id: 'colpoda', when: () => mode === 'soil' && game.creatures.anyActive(), target: colpoda },
    { id: 'paramacrobiotus-metropolitanus', when: () => mode === 'soil' && game.tardigrade.active(), target: tardi },
    { id: 'clay', when: () => mode === 'soil' && cellW(8) > 0.4 && !!grain('clay')(), target: grain('clay') },
    { id: 'trifolium-repens', when: () => mode === 'surface' && surface.growth > 0.75, target: seedling },
  ], { gapSec: 4, onShow: (id, t) => { audio.chime(); pointer.show(t, SPECIES[id]?.nameJa ?? ''); if (ORGANISMS.includes(id)) { beginVisit(id, t); scope.show(id, SPECIES[id].nameJa); } }, onHide: () => { pointer.hide(); focusT = null; endVisit(); scope.hide(); } });
  $('meet').addEventListener('click', () => { enc.replay(ORGANISMS); if (!touring) $('tour').click(); });
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
  // 全画面：iPhone の Safari にはページの全画面がないので、ホーム画面に追加する方法を案内する
  const standalone = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
  const canFs = !!document.documentElement.requestFullscreen && document.fullscreenEnabled !== false;
  if (standalone) $('fs').style.display = 'none';
  $('fs').addEventListener('click', () => {
    if (canFs) { if (document.fullscreenElement) void document.exitFullscreen(); else void document.documentElement.requestFullscreen().catch(() => ($('fsHelp') as HTMLDialogElement).showModal()); }
    else ($('fsHelp') as HTMLDialogElement).showModal();
  });
  $('fsHelpClose').addEventListener('click', () => ($('fsHelp') as HTMLDialogElement).close());
  // 操作パネルは、数秒さわらないと薄くなる（映像を広く見せる）。どこかに触れると戻る
  let idleT = 0; const wake = () => { document.body.classList.remove('idle'); clearTimeout(idleT); idleT = window.setTimeout(() => document.body.classList.add('idle'), 4500); };
  for (const ev of ['pointerdown', 'pointermove', 'keydown', 'touchstart']) addEventListener(ev, wake, { passive: true }); wake();
  let hidden = false; document.addEventListener('visibilitychange', () => { hidden = document.hidden; last = 0; });

  let frames = 0, last = 0, tourU = 0.02, vitShown = -1;
  const frame = (now: number) => {
    if (hidden) return;
    const t = fixedT !== null ? Number(fixedT) : now / 1000; const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    if (dbg) { const v = dbg.split(',').map(Number); camera.position.set(v[0], v[1], v[2]); camera.lookAt(v[3], v[4], v[5]); }
    else if (camT !== null) placeOnPath(Number(camT));
    else if (touring && visit) { const f = visit.get(); if (f) { const want = f.view ? f.view : visit.pos.clone().add(f.p.clone().sub(visit.anchor)); camera.position.lerp(want, 1 - Math.exp(-dt * 1.2)); const q0 = camera.quaternion.clone(); camera.lookAt(f.p); camera.quaternion.slerp(q0, Math.exp(-dt * 3)); } }
    else if (touring && pointer.focus()) { const f = pointer.focus()!; focusT = focusT ? focusT.lerp(f, 1 - Math.exp(-dt * 2)) : look.clone(); const q0 = camera.quaternion.clone(); camera.lookAt(focusT); camera.quaternion.slerp(q0, Math.exp(-dt * 1.5)); }
    else if (touring) { tourU = (tourU + dt * 0.012) % 1; placeOnPath(0.02 + 0.66 * (0.5 - 0.5 * Math.cos(tourU * Math.PI * 2))); /* 奥の種のまわり（まだ作っていない）へは行かない */ }
    else controls.update(dt);
    if (wetQ === null) { demo.update(dt); game.update(dt, t); }
    if (mode === 'surface') {
      if (Q.get('g') === null) { growT += dt; surface.setGrowth(Math.min(1, growT / GROW_SEC)); }
      surface.update(dt, t);
      if (postSurface) postSurface.render(); else renderer.render(surface.scene, surface.camera);
    } else if (post) post.render(); else renderer.render(scene, camera);
    if (mode === 'soil') scope.render(renderer, dt);
    if (!testing) enc.update(dt);
    pointer.update(dt);
    { // ピント：説明している物があればそこ、なければ画面中央の粒まで
      const f = pointer.focus(); let d = f ? camera.position.distanceTo(f) : 0;
      if (!f) { const ray = new THREE.Raycaster(camera.position, new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)); let best = 1e9; for (const c of world.colliders) { const v = new THREE.Vector3(c.x, c.y, c.z).sub(camera.position); const t = v.dot(ray.ray.direction); if (t < 0) continue; const off = v.lengthSq() - t * t; if (off < c.r * c.r) best = Math.min(best, t - Math.sqrt(c.r * c.r - off)); } d = best < 1e8 ? best : 14; }
      underFocus.value += (Math.max(2, Math.min(30, d)) - underFocus.value) * (1 - Math.exp(-dt * 3));
    }
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
  if (Q.has('manual')) { W.__frame = (ms: number) => frame(ms); W.__switch = (m: 'soil' | 'surface') => { mode = m; growT = 0; surface.setGrowth(0); document.body.classList.toggle('surface', m === 'surface'); renderer.toneMappingExposure = m === 'surface' ? 1.0 : 1.0; }; W.__demo = () => demo.start(); frame(0); frame(16); frame(32); frame(48); frame(64); }
  else renderer.setAnimationLoop(frame);
}
main().catch((e) => { errors.push(String(e)); console.error(e); W.__state = { ready: false, failed: true, errors }; });

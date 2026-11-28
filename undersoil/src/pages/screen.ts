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
import { makeMinimap } from '../ui/minimap';
import { buildColloids } from '../game/colloids';
import { makeTools } from '../game/tools';
import { makeQuest } from '../game/quest';
import { makeSizes } from '../ui/sizes';
import { makeNotebook } from '../ui/notebook';
import { makeZukan } from '../ui/zukan';
import { makeEncounters } from '../game/encounters';
import { SPECIES } from '../game/species';
import { showCard } from '../ui/card';
import { makePointer } from '../ui/pointer';
import type { Target } from '../game/encounters';
import { mountSettings, savedTier, savedBob, savedSpeed, savedLook, savedSwim } from '../ui/settings';
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
  const game = await createGame(renderer, './', tier); W.__game = game;   // 確認用
  const { scene, camera, world } = game;
  renderer.shadowMap.enabled = game.q.shadows > 0;
  const underFocus = uniform(12);
  // ピントの深さとぼけの強さ：生き物を紹介している間は、ピントを浅く、まわりを強くぼかして、その生き物に目が行くようにする
  const underRange = uniform(8), underBokeh = uniform(2.2);
  const post = Q.has('nopost') || !game.q.post.length ? null : makePost(renderer, scene, camera, game.q.post, { distance: underFocus as never, range: underRange as never, bokeh: underBokeh as never });
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
  const switchTo = (m: 'soil' | 'surface') => { fade.classList.add('on'); setTimeout(() => { mode = m; growT = m === 'surface' ? game.root * 0.2 * GROW_SEC : 0; /* 土の中で根が出ていた分だけ、地上の芽生えも先へ進んだ所から始まる（同じ 1 つの出来事） */ surface.setGrowth(growT / GROW_SEC); document.body.classList.toggle('surface', m === 'surface'); renderer.toneMappingExposure = m === 'surface' ? 1.0 : 1.0; fade.classList.remove('on'); }, 900); };
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
  const cardQ = Q.get('card'); if (cardQ && SPECIES[cardQ]) setTimeout(() => { const T: Record<string, () => Target> = { sand: grain('quartz'), aggregate: grain('aggregate'), humus: grain('humus'), clay: grain('clay'), 'water-film': bridge, 'bacillus-subtilis': bacteria, 'pseudomonas-fluorescens': pseudo, colpoda, 'trifolium-repens': seedling, 'paramacrobiotus-metropolitanus': tardi }; const t = T[cardQ]; showCard(SPECIES[cardQ], { narration: false, holdMs: 600000, pointing: !!t }); pointer.show(t ?? null, SPECIES[cardQ].nameJa); if (ORGANISMS.includes(cardQ)) beginVisit(cardQ, t ?? null); scope.show(cardQ, SPECIES[cardQ].title ?? SPECIES[cardQ].nameJa); }, 1500);
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
  // 吸水した種：道の終わりの先。カメラから種の表面までのおおよその距離と、紹介カードが指す点（根の出ている所）
  const seedC = game.seed.position;
  const nearSeed = () => camera.position.distanceTo(seedC) - 55;
  const seedT = (): Target => mode === 'soil' ? { p: game.root > 0.05 ? game.seedLife.rootTip.clone() : seedC.clone().add(new THREE.Vector3(-50, 2, 0)), r: 20 } : null;
  let focusT: THREE.Vector3 | null = null;
  // 水の中をただよう小さな粒（ブラウン運動）。奥行きの手がかり
  const colloids = game.tier === 'vr' ? null : buildColloids(game.tier === 'pc-high' ? 1400 : game.tier === 'mobile-high' ? 800 : 300, 7, game.q.post.some((e: string) => e.startsWith('dof')) ? 0.15 : 1.6)   // ぼかしのない段階では、近すぎる粒は消す（くっきりした玉に見えるため）; if (colloids) scene.add(colloids.mesh);
  // 道具（M2）：スキャンと糖のしずく。自分で動くときに使う（E・Q キー、ゲームパッド X・Y、画面のボタン）
  const tools = makeTools(scene, camera, world, game.seed.position, () => audio.chime(), (p, k) => { game.swarm.attract(p, k); game.swarm2.attract(p, k); }, (k) => audio.fx(k));
  controls.onAction = (a) => { if (a === 'scan') tools.scan(); else if (a === 'sugar') tools.sugar(); else tools.water(); };
  $('waterBtn').addEventListener('click', () => tools.water());
  const quest = makeQuest(world, { stats: tools.stats, wind: () => tools.wind, windOk: () => tools.stats.windSurvived, startWind: () => tools.startWind(), retryWind: () => tools.retryWind(), wake: () => game.wake, scanned: () => tools.scans });
  $('scanBtn').addEventListener('click', () => tools.scan()); $('sugarBtn').addEventListener('click', () => tools.sugar());
  const scope = await buildMicroscope('./');
  const sizes = makeSizes('./');
  const notebook = makeNotebook('./', (id) => scope.show(id, SPECIES[id]?.title ?? SPECIES[id]?.nameJa ?? ''));
  $('sizes').addEventListener('click', () => sizes.open());
  $('notebook').addEventListener('click', () => notebook.open());
  let zukanOpen = false; const zukan = makeZukan('./', (o) => { zukanOpen = o; last = 0; });   // 図鑑を開いている間は、本体の描画を止める
  $('zukan').addEventListener('click', () => zukan.open());
  // 結果の画面：地上で芽が開ききったら、今回の記録を出す（1 回だけ）
  const result = document.createElement('dialog'); result.className = 'notebook result'; document.body.append(result); let resultShown = false;
  const showResult = () => { resultShown = true; const st = tools.stats, n = notebook.count();
    result.innerHTML = `<h2>今回（こんかい）の記録（きろく）</h2><p class="nb-lead">種が目を覚まし、地上で芽が開きました。</p>
      <div class="res-grid"><div><b>${st.pours}</b><span>水をまいた回数</span></div><div><b>${st.links}</b><span>つないだ水の橋</span></div><div><b>${st.awakened}</b><span>目覚めた区画（12 のうち）</span></div><div><b>${st.sugars}</b><span>置いた糖のしずく</span></div><div><b>${n}</b><span>出会った生き物（6 のうち）</span></div><div><b>${tools.wind === 'done' ? (st.windSurvived ? '○' : '△') : '—'}</b><span>乾きの風</span></div></div>
      <div class="nb-actions"><button type="button" class="btn primary" data-nb>観察ノートを見る</button><button type="button" class="btn" data-close>とじる</button></div>`;
    result.querySelector('[data-close]')!.addEventListener('click', () => result.close()); result.querySelector('[data-nb]')!.addEventListener('click', () => { result.close(); notebook.open(); }); result.showModal(); };
  // 気づきを送る：その場の位置と一言を、Netlify のフォーム（feedback）で届ける
  $('fb').addEventListener('click', async () => { const note = prompt('気になった所・気づいたことを書いてください'); if (!note) return;
    const info = `mode=${mode} tier=${tier} gpu=${isWebGPU ? 'webgpu' : 'webgl2'} pos=${camera.position.toArray().map((v) => v.toFixed(1)).join(',')} cell=${world.cellAt(camera.position)} scr=${innerWidth}x${innerHeight}`;
    try { const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ 'form-name': 'feedback', note, info, bot: '' }).toString() }); alert(r.ok ? '送りました。ありがとうございます' : '送れませんでした（' + r.status + '）'); } catch (e) { alert('送れませんでした：' + String(e)); } });
  const minimap = makeMinimap(world.path, { c: game.seed.position, r: 55 }, world.cavern);
  // ゴール：道の終わりで種にたどり着くと、種が目覚めていれば地上の芽生えへ。まだなら「水をあげよう」と知らせる
  const goal = document.createElement('div'); goal.className = 'goal'; document.body.append(goal);
  let goalState: 'away' | 'shown' | 'done' = 'away', goalT = 0;
  const goalTick = (dt: number) => {
    if (mode !== 'soil' || !started) { goal.classList.remove('on'); return; }
    if (!touring && quest.index < 7) return;   // 自分で動くときは、山場「乾きの風」を乗りきるまで、種のゴールは働かない（道しるべの順番どおり）
    const d = nearSeed();
    if (goalState === 'away' && d < 22) {
      goalState = 'shown'; goalT = 0;
      if (game.wake > 0.5) goal.innerHTML = '<b>種（たね）にたどり着きました！</b><span>種が目を覚まし、根が顔を出しています。地上（ちじょう）で芽が出るところへ行きます</span>';
      else goal.innerHTML = '<b>種（たね）にたどり着きました</b><span>でも、種はまだ眠っています。「水を運ぶ」で土をしめらせよう</span>';
      goal.classList.add('on'); audio.chime();
    }
    // 眠っている種のそばにいる間に、水が届いて種が目覚めたら、あらためて知らせて地上へ進む
    if (goalState === 'shown' && d < 30 && game.wake > 0.5 && !goal.textContent?.includes('地上')) { goalT = 0; goal.innerHTML = '<b>種（たね）が目を覚ましました！</b><span>根が顔を出しています。地上（ちじょう）で芽が出るところへ行きます</span>'; goal.classList.add('on'); audio.chime(); }
    if (goalState === 'shown') {
      goalT += dt;
      if (goalT > 5.5) goal.classList.remove('on');
      if (goalT > 5.5 && game.wake > 0.5 && goal.textContent?.includes('地上')) { goalState = 'done'; switchTo('surface'); }
      if (d > 60) goalState = 'away';
    }
    if (goalState === 'done' && d > 60) goalState = 'away';   // 一度地上へ行ったら、種から離れるまでは知らせない
  };
  // 生き物を見せに行く：カードが出ている間、カメラはその生き物のそばで止まり、離れていれば暗転して移る
  const ORGANISMS = ['bacillus-subtilis', 'pseudomonas-fluorescens', 'colpoda', 'paramacrobiotus-metropolitanus'];
  const VIEW: Record<string, number> = { 'bacillus-subtilis': 2.2, 'pseudomonas-fluorescens': 2.6, colpoda: 13, 'paramacrobiotus-metropolitanus': 70, 'water-film': 6 };
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
    game.lights.fill.intensity = 7 + Math.min(60, dist * 0.9) * (dist < 20 ? 0.6 : 2);   // 近い生き物は、照らしすぎると白く飛ぶ
    visit = { get: t, dist, pos, anchor: first.p.clone(), ret: camera.position.clone(), retQ: camera.quaternion.clone() };
    underFocus.value = Math.min(underFocus.value, Math.max(1.2, dist * 0.25));   // ピント送りの始まり：いったん手前に
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
    { id: 'clover-seed', when: () => mode === 'soil' && nearSeed() < 70, target: seedT },
    { id: 'trifolium-repens', when: () => mode === 'surface' && surface.growth > 0.75, target: seedling },
  ], { gapSec: 4, onShow: (id, t) => { audio.chime(); pointer.show(t, SPECIES[id]?.nameJa ?? ''); if (ORGANISMS.includes(id) || id === 'water-film') beginVisit(id, t); game.creatures.present(id === 'colpoda' ? camera : null); scope.show(id, SPECIES[id]?.title ?? SPECIES[id]?.nameJa ?? ''); notebook.meet(id); zukan.meet(id); }, onHide: () => { pointer.hide(); focusT = null; endVisit(); scope.hide(); } });
  $('meet').addEventListener('click', () => { enc.replay(ORGANISMS); if (!touring) $('tour').click(); });
  $('water').addEventListener('click', () => demo.start());
  $('dry').addEventListener('click', () => demo.dry());
  $('sprout').addEventListener('click', () => switchTo(mode === 'soil' ? 'surface' : 'soil'));
  const muteBtn = $('mute'); const showMute = () => { muteBtn.textContent = audio.muted ? '音：切' : '音：入'; }; showMute();
  muteBtn.addEventListener('click', () => { audio.start(); audio.setMuted(!audio.muted); showMute(); try { localStorage.setItem('undersoil.muted', audio.muted ? '1' : '0'); } catch { /* noop */ } });
  // タブを切り替えて戻ったとき、音が壊れないように止めて再開する
  document.addEventListener('visibilitychange', () => audio.pause(document.hidden));
  // 操作の手引き：はじめて「自分で動く」にしたとき、30 秒だけ出す（押すと消える）
  const guide = document.createElement('div'); guide.className = 'guide'; document.body.append(guide); let guideShown = false;
  const showGuide = () => {
    if (guideShown) return; guideShown = true;
    const touch = matchMedia('(pointer: coarse)').matches, pad = !!navigator.getGamepads?.()[0];
    const rows = pad ? [['左スティック', '動く'], ['右スティック', '見回す'], ['A / B', '上へ / 下へ'], ['RB', '水をくむ・まく'], ['X', 'スキャン'], ['Y', '糖のしずく']]
      : touch ? [['画面の左下をなぞる', '動く'], ['そのほかをなぞる', '見回す'], ['「水をくむ／まく」', '入口でくみ、乾いた所でまく'], ['「スキャン」', '土のようすを調べる'], ['「糖のしずく」', '微生物を呼ぶ']]
      : [['W A S D', '動く'], ['ドラッグ', '見回す'], ['スペース / C', '上へ / 下へ'], ['F', '水をくむ・まく'], ['E', 'スキャン'], ['Q', '糖のしずく']];
    guide.innerHTML = '<b>動（うご）かしかた</b>' + rows.map(([k, v]) => `<div><kbd>${k}</kbd><span>${v}</span></div>`).join('') + '<small>水のある所では泳ぎ、乾いた所では歩きます。押すと消えます</small>';
    guide.classList.add('on'); const off = () => guide.classList.remove('on'); guide.addEventListener('click', off); setTimeout(off, 30000);
  };
  $('tour').addEventListener('click', () => {
    touring = !touring; controls.enabled = !touring; if (!touring) showGuide(); else guide.classList.remove('on'); $('tour').textContent = touring ? '自分で動く' : '自動で巡る';
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

  const FAST = Number(Q.get('fast') ?? 1);
  let frames = 0, last = 0, tourU = 0.02, vitShown = -1, viewShift = 0;
  let gotoU: number | null = null, curU = 0.02;
  minimap.onGo = (p) => { let best = 0, bd = 1e9; for (let k = 0; k <= 100; k++) { const u = 0.02 + 0.84 * k / 100, d = world.path.getPointAt(u).distanceToSquared(p); if (d < bd) { bd = d; best = u; } }
    if (!touring) { let b2 = 1e9; for (let k = 0; k <= 100; k++) { const u = 0.02 + 0.84 * k / 100, d = world.path.getPointAt(u).distanceToSquared(camera.position); if (d < b2) { b2 = d; curU = u; } } $('tour').click(); }
    gotoU = best; };
  const driftQ = new THREE.Quaternion(); const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frame = (now: number) => {
    if (hidden || zukanOpen) return;
    const t = fixedT !== null ? Number(fixedT) : now / 1000; const dt = (last ? Math.min(0.1, (now - last) / 1000) : 0) * FAST; last = now;   // ?fast=N：通しの自動確認用の早回し
    camera.quaternion.multiply(driftQ.invert()); driftQ.identity();   // 前のコマの手持ちの揺れを戻す
    if (dbg) { const v = dbg.split(',').map(Number); camera.position.set(v[0], v[1], v[2]); camera.lookAt(v[3], v[4], v[5]); }
    else if (camT !== null) placeOnPath(Number(camT));
    else if (touring && visit) { const f = visit.get(); if (f) { const want = f.view ? f.view : visit.pos.clone().add(f.p.clone().sub(visit.anchor)); camera.position.lerp(want, 1 - Math.exp(-dt * 1.2)); const q0 = camera.quaternion.clone(); camera.lookAt(f.p); camera.quaternion.slerp(q0, Math.exp(-dt * 3)); } }
    else if (touring && pointer.focus()) { const f = pointer.focus()!; focusT = focusT ? focusT.lerp(f, 1 - Math.exp(-dt * 2)) : look.clone(); const q0 = camera.quaternion.clone(); camera.lookAt(focusT); camera.quaternion.slerp(q0, Math.exp(-dt * 1.5)); }
    else if (gotoU !== null) { // 地図で押した所へ、道に沿って向かう。着いたら「自分で動く」に切り替える
      const dir = Math.sign(gotoU - curU), stepU = dt * 0.035; curU = Math.abs(gotoU - curU) <= stepU ? gotoU : curU + dir * stepU; placeOnPath(curU);
      if (curU === gotoU) { gotoU = null; if (touring) $('tour').click(); } }
    else if (touring) { tourU = (tourU + dt * 0.012) % 1; curU = 0.02 + 0.84 * (0.5 - 0.5 * Math.cos(tourU * Math.PI * 2)); placeOnPath(curU); /* 道の終わりで、吸水した種（seed.ts）に近づく */ }
    else { controls.swimStyle = savedSwim(); controls.speedK = savedSpeed(); controls.lookK = savedLook(); controls.bob = savedBob() && !reduceMotion; controls.water = world.grid.cells[world.cellAt(camera.position)]?.water ?? 0; controls.update(dt); }
    tools.update(dt); if (quest.update(dt, !touring && mode === 'soil')) audio.fx('link'); { const mm = $('moveMode'); const txt = touring || mode !== 'soil' ? '' : controls.swimming ? '泳（およ）ぐ' : '歩（ある）く'; if (mm.textContent !== txt) mm.textContent = txt; $('sugarBtn').textContent = `糖のしずく ${tools.stock}`; { const ci = world.cellAt(camera.position); $('waterBtn').textContent = tools.tank < 3 && (ci === 0 || world.grid.cells[ci].water > 0.6) ? '水をくむ' : `水をまく ${tools.tank}`; } document.body.classList.toggle('free', !touring && mode === 'soil'); }
    if (wetQ === null) { demo.update(dt); if (FAST > 1) { for (let k = 0; k < FAST; k++) game.update(dt / FAST, t); } else game.update(dt, t); }   // 早回しのときも、土の計算は細かい刻みで進める
    // 手持ちカメラのごくわずかな揺れ（記録映像らしさ）：自動で巡るときだけ、0.15°以内。動きを減らす設定の端末では使わない
    if (touring && !reduceMotion && !testing) { const k = 0.0026; driftQ.setFromEuler(new THREE.Euler(Math.sin(t * 0.53) * k + Math.sin(t * 1.37) * k * 0.4, Math.sin(t * 0.41 + 1.2) * k + Math.sin(t * 1.11) * k * 0.35, 0)); camera.quaternion.multiply(driftQ); }
    if (mode === 'surface') {
      if (Q.get('g') === null) { growT += dt; surface.setGrowth(Math.min(1, growT / GROW_SEC)); }
      surface.update(dt, t);
      if (postSurface) postSurface.render(); else renderer.render(surface.scene, surface.camera);
    } else {
      // 拡大像の枠（右上）が出ている間は、映像を左へずらし、紹介している生き物が枠に隠れないようにする
      viewShift += ((scope.compare ? 0.25 : scope.on3d ? 0.15 : 0) - viewShift) * (1 - Math.exp(-dt * 3));
      if (viewShift > 0.002) camera.setViewOffset(innerWidth, innerHeight, innerWidth * viewShift, 0, innerWidth, innerHeight); else if (camera.view) camera.clearViewOffset();
      if (post) post.render(); else renderer.render(scene, camera);
    }
    if (colloids && mode === 'soil') colloids.update(dt, camera.position, world.grid.cells[world.cellAt(camera.position)]?.water ?? 0, !touring && controls.swimming, game.creatures.movers());
    if (mode === 'surface' && surface.growth >= 1 && !resultShown && (!testing || FAST > 1)) showResult();
    scope.tick(dt); minimap.update(camera, mode === 'soil' && started); goalTick(dt);
    if (!testing) enc.update(dt);
    pointer.update(dt);
    { // ピント：説明している物があればそこ、なければ画面中央の粒まで
      const f = pointer.focus(); let d = f ? camera.position.distanceTo(f) : 0;
      if (!f) { const ray = new THREE.Raycaster(camera.position, new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)); let best = 1e9; for (const c of world.colliders) { const v = new THREE.Vector3(c.x, c.y, c.z).sub(camera.position); const t = v.dot(ray.ray.direction); if (t < 0) continue; const off = v.lengthSq() - t * t; if (off < c.r * c.r) best = Math.min(best, t - Math.sqrt(c.r * c.r - off)); } d = best < 1e8 ? best : 14; }
      // ピント送り：生き物の紹介に入ると、手前に合っていたピントが、その生き物へゆっくり移る（記録映像の撮り方）
      underFocus.value += (Math.max(2, Math.min(visit ? 80 : 30, d)) - underFocus.value) * (1 - Math.exp(-dt * (visit ? 0.9 : 3)));
      { const k = 1 - Math.exp(-dt * 2), vr = visit ? Math.max(0.8, visit.dist * 0.3) : 8, vb = visit ? 4.0 : 2.2; underRange.value += (vr - underRange.value) * k; underBokeh.value += (vb - underBokeh.value) * k; }
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

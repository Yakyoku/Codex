// 画面版の本体（M1：網膜の一区画）
import * as THREE from 'three/webgpu';
import '../ui/ui.css';
import { createRenderer, fitRenderer, backendPrefFromURL } from '../core/renderer';
import { detectDevice, DEVICE_LABEL, pickTier, TIER_LABEL } from '../core/device';
import { Hud } from '../core/hud';
import { Input } from '../core/input';
import { GameAudio, speak } from '../core/audio';
import { buildRetina } from '../stages/eye/retina';
import { Diver } from '../game/diver';
import { buildUI, renderAtlas, ATLAS, TIPS } from '../game/ui';
import tuning from '../data/tuning.json';

const W = window as unknown as Record<string, unknown>;
const errors: string[] = (W.__irErrors = []) as string[];
addEventListener('error', (e) => errors.push(String(e.message)));
addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));
const Q = new URLSearchParams(location.search);
const store = { get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* 保存できなくても続ける */ } } };

async function main() {
  const canvas = document.getElementById('view') as HTMLCanvasElement;
  const device = detectDevice();
  const debugCam = Q.get('cam');
  const sim = Q.has('sim') ? Number(Q.get('sim')) : null;
  const { $ } = buildUI();
  const tipEl = $('load').querySelector('.tip') as HTMLElement, barEl = $('load').querySelector('i') as HTMLElement;
  let tipI = Math.floor(Math.random() * TIPS.length); tipEl.textContent = TIPS[tipI];
  const tipTimer = setInterval(() => { tipI = (tipI + 1) % TIPS.length; tipEl.textContent = TIPS[tipI]; }, 5000);
  const progress = (p: number) => (barEl.style.width = `${p * 100}%`);
  if (device === 'quest') { $('l-vr').style.cssText = 'font-size:1.5em;border:1px solid var(--acc);padding:.5em 1em'; }
  ($('o-backend') as HTMLSelectElement).value = backendPrefFromURL();
  $('o-backend').addEventListener('change', (e) => { store.set('ir.backend', (e.target as HTMLSelectElement).value); location.reload(); });
  const introSel = $('o-intro') as HTMLSelectElement, ttsSel = $('o-tts') as HTMLSelectElement;
  introSel.value = store.get('ir.intro') ?? 'all'; ttsSel.value = store.get('ir.tts') ?? 'on';
  introSel.addEventListener('change', () => store.set('ir.intro', introSel.value)); ttsSel.addEventListener('change', () => store.set('ir.tts', ttsSel.value));

  progress(0.1);
  let info = await createRenderer(canvas, { pref: backendPrefFromURL() });
  const { renderer, isWebGPU, backendLabel } = info;
  const tier = pickTier(device, isWebGPU);
  const camera = new THREE.PerspectiveCamera(tuning.camera.fov, 1, 0.08, 700);
  fitRenderer(renderer, camera, tier === 'compat' ? 1.5 : 2);
  progress(0.3);
  const stage = await buildRetina(renderer, tier);
  progress(0.7);
  const diver = await Diver.load();
  stage.scene.add(diver.root);
  const audio = new GameAudio();
  const input = new Input(canvas);
  input.sens = { mouse: tuning.camera.mouseSens, pad: tuning.camera.padSens, touch: tuning.camera.touchSens };

  // 浄化ビーム（治療の光）。原色を避け、淡い白にわずかな青緑
  const beamMat = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xe2d8ff });
  beamMat.opacity = 0.0;
  const beamGeo = new THREE.CylinderGeometry(0.035, 0.11, 1, 10, 1, true); beamGeo.translate(0, 0.5, 0); beamGeo.rotateX(Math.PI / 2);
  const beam = new THREE.Mesh(beamGeo, beamMat); beam.renderOrder = 50; beam.frustumCulled = false; stage.scene.add(beam);
  const beamLight = new THREE.PointLight(0xece4ff, 0, 22, 1.6); stage.scene.add(beamLight);

  if (Q.has('h')) stage.health.setAll(Number(Q.get('h')));
  if (Q.has('heal')) { const [x, z, r] = Q.get('heal')!.split(',').map(Number); for (let i = 0; i < 40; i++) stage.health.heal(x, z, r, 0.1); }

  // ---- 状態 ----
  const [SX, SZ] = stage.size;
  const pos = new THREE.Vector3(-58, 0, 6), vel = new THREE.Vector3();
  let yaw = -1.15, pitch = 0.22, facing = yaw, firstPerson = false, paused = false, started = false, finished = false, t = 0, walked = 0;
  const known = new Set<string>((store.get('ir.known') ?? '').split(',').filter(Boolean));
  const camTarget = new THREE.Vector3(), camPos = new THREE.Vector3(), tmp = new THREE.Vector3(), dir = new THREE.Vector3(), hit = new THREE.Vector3(), focus = new THREE.Vector3();
  let focusAmt = 0; let focusOn = false;
  const hud = new Hud(`${backendLabel} · ${TIER_LABEL[tier]} · ${DEVICE_LABEL[device]}`);
  $('pf').textContent = String(tuning.flow.perceptionFactor);

  // ---- 紹介カード ----
  const card = $('card'); let cardT = 0, cardDur = 0, cardCur: string | null = null, lastCard: string | null = null; const queue: { id: string; at: THREE.Vector3 | null }[] = [];
  const subs = $('subs'); let subT = 0;
  const say = (text: string, dur = 6, voice = true) => { subs.textContent = text; subs.classList.add('on'); subT = dur; if (voice) speak(text, ttsSel.value === 'on' && sim === null); };
  function showCard(id: string, at: THREE.Vector3 | null, replay = false) {
    const e = ATLAS.find((x) => x.id === id)!; const mode = introSel.value;
    if (!replay) { known.add(id); store.set('ir.known', [...known].join(',')); audio.chime(); }
    if (mode === 'off') return;
    card.querySelector('.n')!.textContent = e.ja; card.querySelector('.e')!.textContent = e.en;
    card.querySelector('.s')!.innerHTML = mode === 'name' ? '' : `${e.kind}　<b>${e.size}</b>　— ${e.compare}`;
    card.querySelector('.d')!.textContent = mode === 'name' ? '' : e.intro;
    card.querySelector('.h')!.textContent = input.kind === 'touch' ? 'カードをタップで閉じる ／ 図鑑に登録しました' : input.kind === 'pad' ? 'Y：閉じる ／ 図鑑に登録しました' : 'E：閉じる　R：もう一度 ／ 図鑑に登録しました';
    card.classList.add('on'); cardCur = id; lastCard = id; cardT = 0; cardDur = mode === 'name' ? 3.5 : 8;
    if (mode === 'all') speak(`${e.ja}。${e.intro}`, ttsSel.value === 'on' && sim === null);
    if (at) { focus.copy(at); focusOn = true; } else focusOn = false;
  }
  let cardGap = 0;
  const hideCard = () => { card.classList.remove('on'); cardCur = null; cardGap = 6; focusOn = false; try { speechSynthesis.cancel(); } catch { /* 読み上げのない機器 */ } };
  card.addEventListener('click', hideCard);
  const enqueue = (id: string, at: THREE.Vector3 | null) => { if (!known.has(id) && !queue.some((q) => q.id === id) && cardCur !== id) queue.push({ id, at }); };

  // ---- UI の操作 ----
  const hints: Record<string, string> = {
    kbm: 'WASD：移動　マウス：視点　左クリック長押し：浄化　右クリック／Q：スキャン　Tab：図鑑　V：視点切替　Esc：一時停止',
    pad: '左スティック：移動　右スティック：視点　RT：浄化　LT：スキャン　Select：図鑑　Start：一時停止',
    touch: '左側：移動　右側をドラッグ：視点　浄化ボタンを長押し',
  };
  const setKind = (k: string) => { $('hint').textContent = hints[k]; $('touch').classList.toggle('hide', k !== 'touch' || !started); $('reticle').classList.toggle('hide', !started); };
  input.onKind = setKind;
  input.onStick = (on, ox, oy, dx, dy) => { const s = $('stick'); s.classList.toggle('hide', !on); if (on) { s.style.left = ox + 'px'; s.style.top = oy + 'px'; (s.firstElementChild as HTMLElement).style.transform = `translate(${dx}px,${dy}px)`; } };
  const hold = (id: string, set: (v: boolean) => void) => { const b = $(id); const on = (e: Event) => { e.preventDefault(); set(true); b.classList.add('on'); }; const off = () => { set(false); b.classList.remove('on'); };
    b.addEventListener('touchstart', on, { passive: false }); b.addEventListener('touchend', off); b.addEventListener('touchcancel', off); b.addEventListener('mousedown', on); b.addEventListener('mouseup', off); };
  hold('tb-fire', (v) => (input.touchFire = v)); hold('tb-scan', (v) => (input.touchScan = v));
  const setPause = (p: boolean) => { if (!started || finished) return; paused = p; $('pause').classList.toggle('hide', !p); audio.suspend(p); if (p) document.exitPointerLock?.(); };
  const openAtlas = (o: boolean) => { if (o) renderAtlas($('atlas').querySelector('.grid') as HTMLElement, known); $('atlas').classList.toggle('hide', !o); if (o) { paused = true; document.exitPointerLock?.(); } else if ($('pause').classList.contains('hide')) paused = false; };
  const full = () => { const d = document as Document & { webkitFullscreenElement?: Element }; const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
    if (document.fullscreenElement || d.webkitFullscreenElement) void document.exitFullscreen?.(); else (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.()); };
  input.onAction = (a) => {
    if (a === 'skip') hideCard(); if (a === 'replay' && lastCard && !cardCur) showCard(lastCard, null, true);
    if (a === 'atlas') openAtlas($('atlas').classList.contains('hide')); if (a === 'pause') setPause(!paused); if (a === 'view') firstPerson = !firstPerson;
  };
  $('p-resume').onclick = () => setPause(false); $('p-atlas').onclick = () => openAtlas(true); $('a-close').onclick = () => openAtlas(false);
  $('p-full').onclick = full; $('b-full').onclick = full; $('b-atlas').onclick = () => openAtlas(true); $('b-pause').onclick = () => setPause(true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) setPause(true); });

  // ---- 患者の視界 ----
  const pImg = $('patient').querySelector('img') as HTMLImageElement, pSpot = $('patient').querySelector('.spot') as HTMLElement;
  function patientView(m: number) {
    const k = 1 - m;
    pImg.style.filter = `blur(${(k * 0.9).toFixed(2)}em) brightness(${(0.4 + 0.6 * m).toFixed(2)}) saturate(${(0.35 + 0.65 * m).toFixed(2)}) contrast(${(0.75 + 0.25 * m).toFixed(2)})`;
    pSpot.style.background = `radial-gradient(ellipse 38% 42% at 46% 52%, rgba(20,16,14,${(0.85 * k).toFixed(2)}) 0%, rgba(20,16,14,0) 100%), radial-gradient(ellipse 22% 26% at 72% 36%, rgba(20,16,14,${(0.6 * k).toFixed(2)}) 0%, rgba(20,16,14,0) 100%)`;
  }

  // ---- 1コマぶんの更新 ----
  function demoInput(time: number) {   // 自動操作（確認用の決まった経路）
    const cyc = time % 11; input.moveX = 0; input.moveY = cyc < 2.6 ? 1 : 0; input.fire = cyc >= 2.9 && cyc < 10.6; input.scan = time > 4.2 && time < 5.4; input.dash = false;
    const way = [[-40, -4], [-22, 6], [-6, 16], [14, 22], [32, 24]]; const w = way[Math.min(way.length - 1, Math.floor(time / 11))];
    const want = Math.atan2(w[0] - pos.x, w[1] - pos.z); let d = want - yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); yaw += d * 0.08; pitch += (0.34 - pitch) * 0.1;
  }
  function step(dt: number) {
    t += dt;
    const look = sim !== null || Q.has('demo') ? (demoInput(t), { dx: 0, dy: 0 }) : input.poll(dt);
    yaw -= look.dx; pitch = Math.min(tuning.camera.pitchMax, Math.max(tuning.camera.pitchMin, pitch + look.dy));
    const P = tuning.player;
    // 移動：カメラの向きを基準に。加速と減速に慣性を持たせる
    const fx = Math.sin(yaw), fz = Math.cos(yaw);
    const sp = input.dash ? P.dashSpeed : P.walkSpeed;
    tmp.set((fx * input.moveY - fz * input.moveX) * sp, 0, (fz * input.moveY + fx * input.moveX) * sp);
    const moving = tmp.lengthSq() > 0.01;
    vel.lerp(tmp, Math.min(1, dt * (moving ? P.accel : P.decel)));
    pos.addScaledVector(vel, dt); walked += vel.length() * dt;
    pos.x = Math.max(-SX / 2 + 14, Math.min(SX / 2 - 14, pos.x)); pos.z = Math.max(-SZ / 2 + 12, Math.min(SZ / 2 - 12, pos.z));
    pos.y = stage.floorHeight(pos.x, pos.z);
    const speed = vel.length();
    const wantFace = input.fire ? yaw : speed > 0.3 ? Math.atan2(vel.x, vel.z) : facing;
    let df = wantFace - facing; df = Math.atan2(Math.sin(df), Math.cos(df)); facing += df * Math.min(1, dt * P.turnLerp);
    diver.root.position.copy(pos); diver.root.rotation.y = facing; diver.root.visible = !firstPerson;
    diver.update(dt, speed, input.fire, pitch);
    // カメラ：肩ごしの三人称。対象の紹介中は、ゆっくり対象のほうへ寄る
    dir.set(Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    focusAmt += ((focusOn ? 1 : 0) - focusAmt) * Math.min(1, dt * 1.6);
    camTarget.copy(pos); camTarget.y += P.eyeHeight;
    if (firstPerson) { camPos.copy(camTarget).addScaledVector(dir, 0.2); }
    else { camTarget.x += fz * -0.75; camTarget.z += fx * 0.75; tmp.copy(camTarget).addScaledVector(dir, -tuning.camera.distance * (1 - 0.25 * focusAmt)); tmp.y += tuning.camera.height * 0.35;
      tmp.y = Math.max(tmp.y, stage.floorHeight(tmp.x, tmp.z) + 0.5); camPos.lerp(tmp, started || sim !== null ? Math.min(1, dt * tuning.camera.follow) : 1); }
    camera.position.copy(camPos);
    tmp.copy(firstPerson ? camPos : camTarget).addScaledVector(dir, 12); if (focusAmt > 0.001 && focus.distanceTo(pos) < 26) tmp.lerp(focus, focusAmt * 0.4);
    camera.lookAt(tmp); camera.fov = tuning.camera.fov - 8 * focusAmt; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    // 浄化ビーム：画面の中心が指す床の一点を治す
    let firing = false;
    if (input.fire && !finished) {
      camera.getWorldDirection(dir); let found = false;
      for (let s = 2; s < tuning.beam.range + tuning.camera.distance; s += 0.4) { hit.copy(camera.position).addScaledVector(dir, s); if (hit.y <= stage.floorHeight(hit.x, hit.z)) { found = true; break; } }
      if (!found) { hit.set(pos.x + fx * 9, 0, pos.z + fz * 9); hit.y = stage.floorHeight(hit.x, hit.z); }
      stage.heal(hit.x, hit.z, dt); firing = true;
      diver.hand.getWorldPosition(tmp); beam.position.copy(tmp); beam.lookAt(hit); beam.scale.set(1, 1, tmp.distanceTo(hit));
      stage.u.beamPos.value.copy(hit); beamLight.position.copy(hit).y += 1.2;
    }
    const bo = stage.u.beamOn.value as number; stage.u.beamOn.value = bo + ((firing ? 1 : 0) - bo) * Math.min(1, dt * 10);
    beamMat.opacity = 0.5 * (stage.u.beamOn.value as number) * (0.85 + 0.15 * Math.sin(t * 31)); beam.visible = beamMat.opacity > 0.01; beamLight.intensity = 26 * (stage.u.beamOn.value as number);
    const sc = stage.u.scan.value as number; stage.u.scan.value = sc + ((input.scan ? 1 : 0) - sc) * Math.min(1, dt * (input.scan ? tuning.scan.fadeIn : tuning.scan.fadeOut));
    diver.lamp.intensity = 16;
    stage.update(dt, t, camera);
    // 出会い（落ち着いている時だけ出す）
    const mean = stage.health.mean();
    if (started || sim !== null) {
      if (t > 2.5) enqueue('vitreous', null);
      if (walked > 9) enqueue('muller', null);
      const near = (p: THREE.Vector3, r: number) => Math.hypot(p.x - pos.x, p.z - pos.z) < r && stage.health.sample(p.x, p.z) > 0.55;
      if (near(stage.points.nucleus, 20)) enqueue('endothelial', stage.points.nucleus);
      if (near(stage.points.pericyte, 20)) enqueue('pericyte', stage.points.pericyte);
      if (stage.flowing() > 0.12) enqueue('rbc', stage.points.rbc().clone());
      if (cardCur) { cardT += dt; (card.querySelector('.p i') as HTMLElement).style.width = `${Math.min(100, (cardT / cardDur) * 100)}%`; if (cardCur === 'rbc') focus.copy(stage.points.rbc()); if (cardT > cardDur) hideCard(); }
      else if ((cardGap -= dt) <= 0 && queue.length && !firing && subT <= 0 && t > 1.5) { const q = queue.shift()!; showCard(q.id, q.at); }
    }
    if (subT > 0) { subT -= dt; if (subT <= 0) subs.classList.remove('on'); }
    const prog = Math.min(1, mean / tuning.health.doneAt);
    $('hv').textContent = String(Math.round(prog * 100)); $('hm').style.width = `${prog * 100}%`;
    patientView(prog); $('reticle').classList.toggle('on', firing);
    audio.update(mean, stage.flowing(), firing, stage.u.heartPhase.value as number);
    if (!finished && prog >= 1 && !debugCam) finish();
  }
  // ---- 区域の回復 → 患者の変化 ----
  function finish() {
    finished = true; audio.resolve(); stage.health.setAll(1); hideCard(); queue.length = 0;
    say('血流が戻りました。網膜が、透明さを取り戻していきます。', 5);
    if (sim !== null) return;
    setTimeout(() => { $('patient').classList.add('full'); say('患者の視界です。ぼやけていた光が、形を結びはじめました。', 7); }, 4500);
    setTimeout(() => { $('patient').classList.remove('full'); $('done').classList.remove('hide'); $('donetext').textContent = 'ここは、ステージ1「目」の最初の一区画です。'; document.exitPointerLock?.(); }, 13000);
  }
  $('b-cont').onclick = () => { $('done').classList.add('hide'); finished = true; };

  // ---- 開始 ----
  camPos.set(pos.x - 6, 4, pos.z - 3);
  step(0.016);
  try { await renderer.compileAsync(stage.scene, camera); } catch { /* 事前準備に失敗しても、そのまま描く */ }
  progress(1); clearInterval(tipTimer);
  const begin = () => {
    if (started) return; started = true; audio.start();
    $('title').style.opacity = '0'; setTimeout(() => $('title').classList.add('hide'), 900);
    for (const id of ['hud', 'patient', 'hint', 'topbtns']) $(id).classList.remove('hide');
    setKind(input.kind); if (device === 'pc') canvas.requestPointerLock?.();
    say('こちらオペレーター。網膜の内側の面に着きました。足もとの白い濁りは、血流が止まった組織です。浄化で、流れを取り戻してください。', 9);
  };
  $('start').classList.remove('hide'); $('load').classList.add('hide'); $('start').addEventListener('click', begin);
  if (device !== 'pc') input.kind = 'touch';

  if (debugCam || sim !== null) {
    $('title').classList.add('hide');
    if (sim !== null) { for (const id of ['hud', 'patient', 'hint']) $(id).classList.remove('hide'); setKind('kbm'); $('reticle').classList.remove('hide'); const n = Math.round(sim * 30); for (let i = 0; i < n; i++) step(1 / 30); }
    else { const c = debugCam!.split(',').map(Number); diver.root.visible = false; for (let i = 0; i < 40; i++) stage.update(0.1, i * 0.1, camera); camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3], c[4], c[5]); camera.updateMatrixWorld(); stage.update(0, 4, camera); }
  }
  let last = performance.now();
  renderer.setAnimationLoop(() => {
    const now = performance.now(); const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!debugCam && sim === null && !paused) { if (started) step(dt); else { t += dt; stage.update(dt, t, camera); } }
    renderer.render(stage.scene, camera);
    hud.tick();
    W.__irFrames = ((W.__irFrames as number) || 0) + 1;
    if (Q.has('frames') && (W.__irFrames as number) >= Number(Q.get('frames'))) { renderer.setAnimationLoop(null); W.__irDone = true; }
  });
  W.__stage = stage; W.__begin = begin; W.__advance = (n: number) => { for (let i = 0; i < n; i++) step(1 / 30); };
  W.__irReady = { backend: backendLabel, tier, device };
}
main().catch((e) => { errors.push(String(e)); console.error(e); const el = document.querySelector('#load .tip'); if (el) el.textContent = '読み込みに失敗しました：' + String(e); });

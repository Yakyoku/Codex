// 画面版の本体（M1：網膜の一区画）
import * as THREE from 'three/webgpu';
import '../ui/ui.css';
import { createRenderer, fitRenderer, backendPrefFromURL } from '../core/renderer';
import { detectDevice, DEVICE_LABEL, pickTier, TIER_LABEL } from '../core/device';
import { Hud } from '../core/hud';
import { DynamicResolution } from '../core/dynres';
import { createPost } from '../core/post';
import { rumble, buzz } from '../core/feel';
import { Input } from '../core/input';
import { GameAudio, speak } from '../core/audio';
import { ZONES } from '../stages/zone';
import { loadSave, writeSave } from '../core/save';
import { Diver } from '../game/diver';
import { PurifyBeam } from '../game/beam';
import { Diagnosis } from '../game/diagnosis';
import { tunePanel } from '../game/tune';
import { bindSettings, applyVB } from '../game/settings';
import { voiceSettings, setVoice } from '../core/voice';
import { AtlasViewer, hasModel } from '../game/viewer';
import { buildUI, renderAtlas, ATLAS, TIPS } from '../game/ui';
import tuning from '../data/tuning.json';

const W = window as unknown as Record<string, unknown>;
const errors: string[] = (W.__irErrors = []) as string[];
addEventListener('error', (e) => errors.push(String(e.message)));
addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));
const Q = new URLSearchParams(location.search);
/* voice-buddy：音声会話の先生への連絡（読み込みに失敗しても、ゲームはそのまま動く） */
const vbNotify = (t: string, p?: object) => { try { (window as unknown as { VoiceBuddy?: { notify: (t: string, p?: object) => void } }).VoiceBuddy?.notify(t, p); } catch { /* 何もしない */ } };
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
  ($('o-post') as HTMLSelectElement).value = store.get('ir.post') ?? 'on';
  $('o-post').addEventListener('change', (e) => { store.set('ir.post', (e.target as HTMLSelectElement).value); location.reload(); });
  $('o-backend').addEventListener('change', (e) => { store.set('ir.backend', (e.target as HTMLSelectElement).value); location.reload(); });
  const introSel = $('o-intro') as HTMLSelectElement, ttsSel = $('o-tts') as HTMLSelectElement;
  introSel.value = store.get('ir.intro') ?? 'all'; if (store.get('ir.tts') === 'off') setVoice({ on: false }); ttsSel.value = voiceSettings.on ? 'on' : 'off';
  introSel.addEventListener('change', () => store.set('ir.intro', introSel.value)); ttsSel.addEventListener('change', () => store.set('ir.tts', ttsSel.value));
  // 設定画面（タイトルと一時停止から）
  const settingsUI = bindSettings($, () => {});
  $('b-settings').onclick = (e) => { e.stopPropagation(); settingsUI.open(); };
  // 音声会話の先生（voice-buddy）：読み込まれたらボタンの表示を設定に合わせる
  const vbOn = () => (store.get('ir.vb') ?? 'on') === 'on';
  { let n = 0; const t = setInterval(() => { applyVB(vbOn()); if (++n > 40 || document.body.classList.contains('vb')) clearInterval(t); }, 500); }

  progress(0.1);
  let info = await createRenderer(canvas, { pref: backendPrefFromURL() });
  const { renderer, isWebGPU, backendLabel } = info;
  const tier = pickTier(device, isWebGPU);
  const camera = new THREE.PerspectiveCamera(tuning.camera.fov, 1, 0.08, 700);
  const dprMax = Math.min(window.devicePixelRatio || 1, tier === 'pc-high' ? 1.5 : tier === 'compat' ? 1.25 : 1.5);
  fitRenderer(renderer, camera, dprMax);
  // モバイルは画素数が多いので、最初は控えめな解像度から始め、速さを見て上げ下げする
  const dyn = Q.has('frames') || Q.has('sim') ? null : new DynamicResolution(renderer, 0.6, dprMax, tier === 'mobile-high' ? Math.min(1.1, dprMax) : dprMax);
  W.__dyn = dyn;
  progress(0.3);
  // 区域：URL の ?zone= か、保存した続きから。区域ごとに別のファイルを後から読み込む
  const save = loadSave();
  let zi = ZONES.findIndex((z) => z.id === (Q.get('zone') ?? save.zone ?? 'retina')); if (zi < 0) zi = 0;
  const entrance = zi === 0 && !save.arrived && !Q.has('h') && !Q.has('noentry') && !debugCam && sim === null;
  const stage = await (await ZONES[zi].load()).build(renderer, tier, { entrance });
  const M = stage.meta;
  progress(0.7);
  const diver = await Diver.load(tier === 'pc-high' || tier === 'mobile-high');
  stage.scene.add(diver.root);
  const diag = new Diagnosis(stage.health, stage.size as [number, number], stage.floorHeight, (x: number, z: number) => stage.causeAt(x, z), 1, stage.plugs, M.plugDiag); stage.scene.add(diag.group);
  // 仕上げ（浅いピント・光のにじみ・色調）。?post=off で切れる
  // 映像の仕上げは設定で切れる（ir.post=off）。失敗したら自動で切って、そのまま描き続ける
  let post = Q.get('post') === 'off' || (store.get('ir.post') === 'off' && !Q.has('post')) ? null : createPost(renderer, stage.scene, camera, Q.get('post') === 'full' ? 'pc-high' : tier);
  const audio = new GameAudio();
  const input = new Input(canvas);
  input.sens = { mouse: tuning.camera.mouseSens, pad: tuning.camera.padSens, touch: tuning.camera.touchSens };

  // 浄化ビーム（治療の光）。原色を避け、淡い白にわずかな青緑
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png'); noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping;
  const purify = new PurifyBeam(noiseTex); stage.scene.add(purify.group);
  const beamFrom = new THREE.Vector3(), beamTo = new THREE.Vector3();


  if (Q.has('h')) stage.health.setAll(Number(Q.get('h')));
  if (Q.has('heal')) { const [x, z, r] = Q.get('heal')!.split(',').map(Number); for (let i = 0; i < 40; i++) stage.health.heal(x, z, r, 0.1); }

  // ---- 状態 ----
  const [SX, SZ] = stage.size;
  const pos = stage.start.pos.clone(), vel = new THREE.Vector3();
  let yaw = stage.start.yaw, pitch = 0.22, facing = yaw, firstPerson = false, paused = false, started = false, finished = false, t = 0, walked = 0;
  const known = new Set<string>((store.get('ir.known') ?? '').split(',').filter(Boolean));
  const camTarget = new THREE.Vector3(), camPos = new THREE.Vector3(), tmp = new THREE.Vector3(), dir = new THREE.Vector3(), hit = new THREE.Vector3(), focus = new THREE.Vector3();
  let patientDone = false; let edgeT = 0; let swimming = stage.start.swimming, arrived = !stage.start.swimming; const swimVel = new THREE.Vector3(); let scanWas = false, diagT = 0;
  const F = tuning.feel; let hitStop = 0, shake = 0, rumbleT = 0, wasHitting = false, lastStep = -1;
  let focusAmt = 0; let focusOn = false; let scanT = 0; let curSpeed = 0;
  const hud = new Hud(`${backendLabel} · ${TIER_LABEL[tier]} · ${DEVICE_LABEL[device]}`, () => dyn ? `解像度 ×${dyn.scale.toFixed(2)}` : '');
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
    vbNotify('lesson_shown', { title: e.ja });                                          /* voice-buddy */
    if (at) { focus.copy(at); focusOn = true; } else focusOn = false;
  }
  let cardGap = 0;
  const hideCard = () => { card.classList.remove('on'); cardCur = null; cardGap = 6; focusOn = false; try { speechSynthesis.cancel(); } catch { /* 読み上げのない機器 */ } };
  card.addEventListener('click', hideCard);
  const enqueue = (id: string, at: THREE.Vector3 | null) => { if (!known.has(id) && !queue.some((q) => q.id === id) && cardCur !== id) queue.push({ id, at }); };

  // ---- UI の操作 ----
  const hints: Record<string, string> = {
    kbm: 'WASD：移動　Space／C：上へ／下へ泳ぐ　マウス：視点　左クリック長押し：浄化　右クリック／Q：スキャン　Tab：図鑑　V：視点　Esc：一時停止',
    pad: '左スティック：移動　A／B：上へ／下へ泳ぐ　右スティック：視点　RT：浄化　LT：スキャン　L3：速く　Select：図鑑　Start：一時停止',
    touch: '左側：移動　右側をドラッグ：視点　上へ／下へ：泳ぐ　浄化ボタンを長押し（コントローラーはボタンを1回押すと使えます）',
  };
  const setKind = (k: string) => { $('hint').textContent = hints[k]; $('touch').classList.toggle('hide', k !== 'touch' || !started); $('reticle').classList.toggle('hide', !started); };
  input.onKind = setKind;
  input.onStick = (on, ox, oy, dx, dy) => { const s = $('stick'); s.classList.toggle('hide', !on); if (on) { s.style.left = ox + 'px'; s.style.top = oy + 'px'; (s.firstElementChild as HTMLElement).style.transform = `translate(${dx}px,${dy}px)`; } };
  const hold = (id: string, set: (v: boolean) => void) => { const b = $(id); const on = (e: Event) => { e.preventDefault(); set(true); b.classList.add('on'); }; const off = () => { set(false); b.classList.remove('on'); };
    b.addEventListener('touchstart', on, { passive: false }); b.addEventListener('touchend', off); b.addEventListener('touchcancel', off); b.addEventListener('mousedown', on); b.addEventListener('mouseup', off); };
  hold('tb-fire', (v) => (input.touchFire = v)); hold('tb-scan', (v) => (input.touchScan = v)); hold('tb-up', (v) => (input.touchUp = v)); hold('tb-down', (v) => (input.touchDown = v));
  const setPause = (p: boolean) => { if (!started || finished) return; paused = p; $('pause').classList.toggle('hide', !p); audio.suspend(p); if (p) document.exitPointerLock?.(); };
  const openAtlas = (o: boolean) => { if (o) renderAtlas($('atlas').querySelector('.grid') as HTMLElement, known, openViewer, hasModel); $('atlas').classList.toggle('hide', !o); if (o) { paused = true; document.exitPointerLock?.(); } else if ($('pause').classList.contains('hide')) paused = false; };
  const full = () => { const d = document as Document & { webkitFullscreenElement?: Element }; const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
    if (document.fullscreenElement || d.webkitFullscreenElement) void document.exitFullscreen?.(); else (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.()); };
  input.onAction = (a) => {
    if (a === 'skip') hideCard(); if (a === 'replay' && lastCard && !cardCur) showCard(lastCard, null, true);
    if (a === 'atlas') openAtlas($('atlas').classList.contains('hide')); if (a === 'pause') setPause(!paused); if (a === 'view') firstPerson = !firstPerson;
  };
  $('p-settings').onclick = () => settingsUI.open();
  $('p-resume').onclick = () => setPause(false); $('p-atlas').onclick = () => openAtlas(true); $('a-close').onclick = () => openAtlas(false);
  $('p-full').onclick = full; $('b-full').onclick = full; $('b-atlas').onclick = () => openAtlas(true); $('b-pause').onclick = () => setPause(true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) setPause(true); });

  // ---- 図鑑の3Dビューア ----
  const viewer = new AtlasViewer(renderer, canvas);
  const openViewer = (id: string) => { const e = ATLAS.find((x) => x.id === id)!; $('viewer').classList.remove('hide'); $('atlas').classList.add('hide'); input.blocked = true; document.body.classList.add('viewing');
    ($('viewer').querySelector('.vt b') as HTMLElement).textContent = e.ja; ($('viewer').querySelector('.vt span') as HTMLElement).textContent = `${e.en}　${e.size}（${e.compare}）`; void viewer.show(id); };
  $('v-close').onclick = () => { viewer.hide(); input.blocked = false; document.body.classList.remove('viewing'); $('viewer').classList.add('hide'); openAtlas(true); };
  // ---- 患者の視界 ----
  const pImg = $('patient').querySelector('img') as HTMLImageElement, pSpot = $('patient').querySelector('.spot') as HTMLElement;
  function patientView(m: number) {
    if ($('patient').classList.contains('waking')) return;
    const k = 1 - m;
    pImg.style.filter = `blur(${(k * 0.9).toFixed(2)}em) brightness(${(0.4 + 0.6 * m).toFixed(2)}) saturate(${(0.35 + 0.65 * m).toFixed(2)}) contrast(${(0.75 + 0.25 * m).toFixed(2)})`;
    pSpot.style.background = `radial-gradient(ellipse 38% 42% at 46% 52%, rgba(20,16,14,${(0.85 * k).toFixed(2)}) 0%, rgba(20,16,14,0) 100%), radial-gradient(ellipse 22% 26% at 72% 36%, rgba(20,16,14,${(0.6 * k).toFixed(2)}) 0%, rgba(20,16,14,0) 100%)`;
  }

  // ---- スキャン診断の表示（病巣の札と、左の一覧）----
  const tags = Array.from($('tags').children) as HTMLElement[], dxEl = $('dx'), dxList = dxEl.querySelector('.l') as HTMLElement; let dxKey = '';
  const pv = new THREE.Vector3();
  function showDiag() {
    const on = diag.show > 0.05 && started;
    dxEl.classList.toggle('hide', !on); dxEl.style.opacity = String(Math.min(1, diag.show * 1.5));
    if (on) {
      const fl = stage.flowing();
      const key = diag.findings.map((f) => `${f.short}${Math.round(f.health * 20)}${Math.round(f.dist / 5)}`).join('|') + Math.round(fl * 20);
      if (key !== dxKey) { dxKey = key;
        dxList.innerHTML = (diag.findings.length ? diag.findings.map((f, i) => `<div><b>病巣${i + 1}</b>　${f.short}　${f.health < 0 ? '' : `健康度 ${Math.round(f.health * 100)}%・`}${Math.round(f.dist)}µm<small>${f.cause}</small></div>`).join('') : '<div>この近くに大きな病巣はありません</div>')
          + `<div><small>区域の回復 ${Math.round(fl * 100)}%　／　主な原因：${M.causeMain}</small></div>`; }
    }
    for (let i = 0; i < 3; i++) {
      const f = diag.findings[i], el = tags[i];
      if (!f || !on) { el.style.opacity = '0'; continue; }
      pv.set(f.x, f.y + 6, f.z).project(camera);
      if (pv.z > 1 || Math.abs(pv.x) > 1.1 || Math.abs(pv.y) > 1.1) { el.style.opacity = '0'; continue; }
      el.style.left = `${Math.min(0.9, Math.max(0.1, pv.x * 0.5 + 0.5)) * innerWidth}px`; el.style.top = `${Math.min(0.85, Math.max(0.3, -pv.y * 0.5 + 0.5)) * innerHeight}px`; el.style.opacity = String(diag.show);
      el.innerHTML = `<b>病巣${i + 1}</b> ${f.short}　${Math.round(f.dist)}µm`;
    }
  }

  // ---- 1コマぶんの更新 ----
  function demoInput(time: number) {   // 自動操作（確認用の決まった経路）
    const cyc = time % 11; input.moveX = 0; input.moveY = cyc < 2.6 ? 1 : 0; input.fire = cyc >= 2.9 && cyc < 10.6; input.scan = time > 4.2 && time < 5.4; input.dash = false; input.swimUp = false; input.swimDown = false;
    const way = [[-40, -4], [-22, 6], [-6, 16], [14, 22], [32, 24]]; const w = way[Math.min(way.length - 1, Math.floor(time / 11))];
    const want = Math.atan2(w[0] - pos.x, w[1] - pos.z); let d = want - yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); yaw += d * 0.08; pitch += (0.34 - pitch) * 0.1;
  }
  function step(dt: number) {
    t += dt;
    const force = W.__force as { x: number; y: number; up?: boolean; down?: boolean; pitch?: number; yaw?: number; scan?: boolean; fire?: boolean } | undefined;   // 確認用：入力を固定して1コマずつ進める
    const look = force ? (input.moveX = force.x, input.moveY = force.y, input.fire = !!force.fire, input.scan = !!force.scan, input.dash = false, input.swimUp = !!force.up, force.yaw !== undefined && (yaw = force.yaw), input.swimDown = !!force.down, force.pitch !== undefined && (pitch = force.pitch), { dx: 0, dy: 0 }) : sim !== null || Q.has('demo') ? (demoInput(t), { dx: 0, dy: 0 }) : input.poll(dt);
    yaw -= look.dx; pitch = Math.min(tuning.camera.pitchMax, Math.max(tuning.camera.pitchMin, pitch + look.dy));
    const P = tuning.player;
    // 移動：カメラの向きを基準に。加速と減速に慣性を持たせる
    const fx = Math.sin(yaw), fz = Math.cos(yaw);
    let turnRate = 0;
    // 床から上へ泳ぎ出す（上へボタン）。床に向かって泳いで着くと、歩きに戻る
    if (!swimming && input.swimUp && !finished) { swimming = true; swimVel.set(vel.x, P.swimLift, vel.z); }
    if (swimming) {
      // 体液の中：視点の向き（上下も含む）へ進む。上へ／下へボタンで浮き沈み。水の抵抗で、ゆっくり加速しゆっくり止まる
      const S = P.swimSpeed * (input.dash ? P.swimDash : 1) * (input.fire ? 0.5 : 1) * (input.scan ? 0.5 : 1);
      dir.set(fx * Math.cos(pitch), -Math.sin(pitch), fz * Math.cos(pitch));
      tmp.set(dir.x * input.moveY - fz * input.moveX, dir.y * input.moveY, dir.z * input.moveY + fx * input.moveX).multiplyScalar(S);
      tmp.y += ((input.swimUp ? 1 : 0) - (input.swimDown ? 1 : 0)) * S * 0.8;
      if (!arrived && !input.swimUp) tmp.y -= S * 0.3;   // 入口：何もしなくても、ゆっくり網膜へ沈んでいく
      const wantMove = tmp.lengthSq() > 0.01;
      swimVel.lerp(tmp, Math.min(1, dt * (wantMove ? P.swimAccel : P.swimDrag)));
      pos.addScaledVector(swimVel, dt);
      const fy = stage.floorHeight(pos.x, pos.z);
      if (pos.y > fy + (M.swimCeil ?? P.swimCeil)) { pos.y = fy + (M.swimCeil ?? P.swimCeil); swimVel.y = Math.min(0, swimVel.y); }
      if (pos.y <= fy + 0.02 && swimVel.y <= 0.05 && !input.swimUp) { pos.y = fy; swimming = false; curSpeed = Math.hypot(swimVel.x, swimVel.z); if (!arrived) { arrived = true; writeSave({ arrived: true }); if (started) say(M.arrive, 10); } }
      else pos.y = Math.max(pos.y, fy);
      const hs = Math.hypot(swimVel.x, swimVel.z), vs = swimVel.length();
      const wantFace = hs > 0.35 ? Math.atan2(swimVel.x, swimVel.z) : input.fire ? yaw : facing;
      let df = wantFace - facing; df = Math.atan2(Math.sin(df), Math.cos(df));
      const dFace = df * Math.min(1, dt * 3.2); facing += dFace; turnRate = dt > 0 ? dFace / dt : 0;
      // 体は進む向きに沿わせる（水平に進むときは水平、まっすぐ上なら立つ）。ただよう間は、ほぼ立ち姿
      const along = Math.min(2.3, Math.atan2(hs, swimVel.y));
      const k = Math.min(1, Math.max(0, (vs - 0.3) / 1.2));
      diver.setSwim(true, (input.fire ? 0.15 : along) * k + 0.08 * (1 - k), Math.max(-0.5, Math.min(0.5, -turnRate * 0.18)) * k);
      curSpeed = vs; walked += vs * dt;
    } else {
    const sp = (input.dash ? P.dashSpeed : P.walkSpeed) * (input.fire ? 0.265 : 1) * (input.scan ? 0.35 : 1);
    tmp.set((fx * input.moveY - fz * input.moveX) * sp, 0, (fz * input.moveY + fx * input.moveX) * sp);
    const moving = tmp.lengthSq() > 0.01;
    // 向き：進みたい方向へ体を回す（速いほどゆっくり曲がる）。構えて止まっている間は狙う方向へ
    const wantFace = moving ? Math.atan2(tmp.x, tmp.z) : input.fire ? yaw : facing;
    let df = wantFace - facing; df = Math.atan2(Math.sin(df), Math.cos(df));
    const maxTurn = (curSpeed > 2 ? 6.5 : 9.5) * dt;
    const dFace = Math.max(-maxTurn, Math.min(maxTurn, df * Math.min(1, dt * P.turnLerp * 1.4))); facing += dFace; turnRate = dt > 0 ? dFace / dt : 0;
    // 進む：体の向いている方向へだけ進む（足が地面を横に滑らないように）。向きが大きくずれている間は、まず向きを変えてから加速する
    const align = Math.cos(df);
    const targetSpeed = moving ? Math.hypot(tmp.x, tmp.z) * Math.min(1, Math.max(0.0, (align + 0.15) / 1.15)) : 0;
    curSpeed += (targetSpeed - curSpeed) * Math.min(1, dt * (targetSpeed > curSpeed ? P.accel : P.decel));
    vel.set(Math.sin(facing) * curSpeed, 0, Math.cos(facing) * curSpeed);
    pos.addScaledVector(vel, dt); walked += curSpeed * dt;
    pos.y = stage.floorHeight(pos.x, pos.z);
    diver.setSwim(false, 0, 0);
    }
    stage.collide?.(pos, 0.45);
    const px0 = pos.x, pz0 = pos.z;
    pos.x = Math.max(-SX / 2 + 14, Math.min(SX / 2 - 14, pos.x)); pos.z = Math.max(-SZ / 2 + 12, Math.min(SZ / 2 - 12, pos.z));
    if ((px0 !== pos.x || pz0 !== pos.z) && (edgeT -= dt) <= 0 && started) { edgeT = 8; toast('区域の端です。向きを変えて、中ほどへ進んでください。'); }
    const speed = curSpeed;
    // 構えて動くとき：脚は進む方向、上半身は狙う方向へひねる
    let aimTwist = 0; if (input.fire) { aimTwist = Math.atan2(Math.sin(yaw - facing), Math.cos(yaw - facing)); aimTwist = Math.max(-1.4, Math.min(1.4, aimTwist)); }
    diver.root.position.copy(pos); diver.root.rotation.y = facing; diver.root.visible = !firstPerson;
    diver.update(dt, speed, input.fire, pitch, turnRate, input.scan, aimTwist);
    // カメラ：肩ごしの三人称。対象の紹介中は、ゆっくり対象のほうへ寄る
    dir.set(Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    focusAmt += ((focusOn ? 1 : 0) - focusAmt) * Math.min(1, dt * 1.6);
    camTarget.copy(pos); camTarget.y += swimming ? P.eyeHeight * 0.7 : P.eyeHeight;
    if (firstPerson) { camPos.copy(camTarget).addScaledVector(dir, 0.2); }
    else { camTarget.x += fz * -0.75; camTarget.z += fx * 0.75; tmp.copy(camTarget).addScaledVector(dir, -tuning.camera.distance * (1 - 0.25 * focusAmt)); tmp.y += tuning.camera.height * 0.35;
      tmp.y = Math.max(tmp.y, stage.floorHeight(tmp.x, tmp.z) + 0.5); camPos.lerp(tmp, started || sim !== null ? Math.min(1, dt * tuning.camera.follow) : 1); }
    camera.position.copy(camPos);
    if (shake > 0.001) { const a = shake * shake * F.shake; camera.position.x += (Math.random() - 0.5) * a; camera.position.y += (Math.random() - 0.5) * a; shake = Math.max(0, shake - dt * 5); }
    tmp.copy(firstPerson ? camPos : camTarget).addScaledVector(dir, 12); if (focusAmt > 0.001 && focus.distanceTo(pos) < 26) tmp.lerp(focus, focusAmt * 0.4);
    camera.lookAt(tmp); camera.fov = tuning.camera.fov - 8 * focusAmt; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    // 浄化ビーム：画面の中心が指す床の一点を治す
    let firing = false;
    if (input.fire && !finished) {
      camera.getWorldDirection(dir); let found = false;
      for (let s = 2; s < tuning.beam.range + tuning.camera.distance; s += 0.4) { hit.copy(camera.position).addScaledVector(dir, s); if (hit.y <= stage.floorHeight(hit.x, hit.z)) { found = true; break; } }
      if (!found) { hit.set(pos.x + fx * 9, 0, pos.z + fz * 9); hit.y = stage.floorHeight(hit.x, hit.z); }
      const hBefore = stage.health.sample(hit.x, hit.z);
      stage.heal(hit.x, hit.z, dt); firing = true;
      // 手応え：病んだ組織に光が触れた瞬間に一瞬の間・小さな揺れ・振動・音。照射中は弱い振動を続ける
      if (!wasHitting && hBefore < 0.6) { hitStop = F.hitStop; shake = 1; rumble(0.35 * F.rumble, 0.8 * F.rumble, 110); buzz(18); audio.hit(); }
      if ((rumbleT -= dt) <= 0) { rumbleT = 0.22; if (hBefore < 0.8) rumble(0.05 * F.rumble, 0.22 * F.rumble, 200); }
      diver.hand.getWorldPosition(beamFrom); beamTo.copy(hit);
      stage.u.beamPos.value.copy(hit);
    }
    wasHitting = firing;
    const bo = stage.u.beamOn.value as number; stage.u.beamOn.value = bo + ((firing ? 1 : 0) - bo) * Math.min(1, dt * 10);
    if (!firing) diver.hand.getWorldPosition(beamFrom);
    purify.update(dt, beamFrom, beamTo, firing, camera);
    const sc = stage.u.scan.value as number; stage.u.scan.value = sc + ((input.scan ? 1 : 0) - sc) * Math.min(1, dt * (input.scan ? tuning.scan.fadeIn : tuning.scan.fadeOut));
    // スキャンの波紋：押している間、主人公から 1.4 秒ごとに輪が広がる
    if (input.scan) { scanT += dt; if (scanT > 1.4) scanT = 0; } else if (scanT > 0) scanT = Math.min(1.4, scanT + dt);
    // 診断：押した瞬間と、押している間は1秒ごとに病巣を調べ直す
    if (input.scan && (!scanWas || (diagT -= dt) <= 0)) { diag.analyze(pos.x, pos.z); diagT = 1; }
    scanWas = input.scan; diag.update(dt, input.scan, pos.x, pos.z); showDiag();
    stage.u.scanR.value = scanT * 48; stage.u.scanOrigin.value.copy(pos); stage.u.scanPulse.value = scanT > 0 && scanT < 1.4 ? 1 - scanT / 1.4 : 0;
    diver.lamp.intensity = tier === 'pc-high' ? 16 : 0;
    stage.update(dt, t, camera);
    // 出会い（落ち着いている時だけ出す）
    const mean = stage.health.mean();
    if (started || sim !== null) {
      for (const e of stage.encounters(pos, t, walked)) enqueue(e.id, e.at);
      if (cardCur) { cardT += dt; (card.querySelector('.p i') as HTMLElement).style.width = `${Math.min(100, (cardT / cardDur) * 100)}%`; { const tp = stage.track?.(cardCur); if (tp) focus.copy(tp); } if (cardT > cardDur) hideCard(); }
      else if ((cardGap -= dt) <= 0 && queue.length && !firing && subT <= 0 && t > 1.5) { const q = queue.shift()!; showCard(q.id, q.at); }
    }
    if (subT > 0) { subT -= dt; if (subT <= 0) subs.classList.remove('on'); }
    const prog = stage.progress();
    // 一区切り（10% ごと）回復するたびに、和音と振動と光の脈で知らせる
    const stepNow = Math.floor(prog * 10);
    if (stepNow > lastStep && lastStep >= 0 && !finished) { audio.restored(stepNow); rumble(0.5 * F.rumble, 0.5 * F.rumble, 180); buzz(30); purify.burst(); shake = Math.max(shake, 0.6); }
    lastStep = Math.max(lastStep, stepNow);
    $('hv').textContent = String(Math.round(prog * 100)); $('hm').style.width = `${prog * 100}%`;
    if (!patientDone) patientView((zi + prog) / ZONES.length); $('reticle').classList.toggle('on', firing);
    audio.update(mean, stage.flowing(), firing, stage.u.heartPhase.value as number);
    if (!finished && prog >= 1 && !debugCam) finish();
  }
  // ---- 区域の回復 → 患者の変化 ----
  function finish() {
    finished = true; audio.resolve(); stage.health.setAll(1); hideCard(); queue.length = 0;
    say(M.done, 5);
    vbNotify('all_clear', { total: stage.plugs.length, firstTry: stage.plugs.length, miss: 0 });   /* voice-buddy */
    const done = [...new Set([...(loadSave().done ?? []), M.id])]; const next = ZONES[zi + 1];
    writeSave({ done, zone: next ? next.id : M.id });
    if (sim !== null) return;
    const last = !next;
    setTimeout(() => {
      // 目が開くように：まぶしい光でにじんだ状態から、ゆっくりピントが合っていく（途中の区域では、少しずつ晴れる）
      const pv = $('patient'); pv.classList.add('full', 'waking');
      const m = (zi + 1) / ZONES.length, blur = (1 - m) * 22;
      pImg.style.transition = 'none'; pImg.style.filter = 'blur(28px) brightness(2.1) saturate(0.4)'; pImg.style.transform = 'scale(1.06)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        pImg.style.transition = 'filter 6s cubic-bezier(.2,.6,.2,1), transform 9s ease-out';
        pImg.style.filter = `blur(${blur.toFixed(1)}px) brightness(${(0.55 + 0.45 * m).toFixed(2)}) saturate(${(0.45 + 0.55 * m).toFixed(2)})`; pImg.style.transform = 'scale(1)';
      }));
      say(last ? '患者の視界です。ぼやけていた光が、くっきりと形を結びました。' : '患者の視界です。ぼやけていた光が、少しずつ形を結びはじめました。', 7);
    }, 4500);
    setTimeout(() => {
      $('patient').classList.remove('full', 'waking'); pImg.style.transition = ''; pImg.style.transform = ''; patientDone = true;
      $('done').classList.remove('hide'); $('done').querySelector('h2')!.textContent = M.doneTitle;
      $('donetext').textContent = next ? `次は ${next.name} です。` : 'ステージ1「目」の治療が終わりました。';
      $('b-next').classList.toggle('hide', !next); document.exitPointerLock?.();
    }, 13000);
  }
  $('b-next').onclick = () => { const next = ZONES[zi + 1]; if (next) location.href = `${location.pathname}?zone=${next.id}`; };
  $('b-cont').onclick = () => { $('done').classList.add('hide'); finished = true; };

  // ---- 開始 ----
  camPos.set(pos.x - 6, 4, pos.z - 3);
  step(0.016);
  try { await renderer.compileAsync(stage.scene, camera); } catch { /* 事前準備に失敗しても、そのまま描く */ }
  progress(1); clearInterval(tipTimer);
  const begin = () => {
    if (started) return; started = true; audio.start(); void audio.bed(`/static/audio/${M.id}.m4a`);
    $('title').style.opacity = '0'; setTimeout(() => $('title').classList.add('hide'), 900);
    for (const id of ['hud', 'patient', 'hint', 'topbtns']) $(id).classList.remove('hide');
    setKind(input.kind); if (device === 'pc') canvas.requestPointerLock?.();
    say(stage.start.swimming && M.enter ? M.enter : M.arrive, 10);
    $('hud').querySelector('.lab')!.textContent = M.hud;
    vbNotify('question_shown', { id: `${M.id}-task`, retry: false });                  /* voice-buddy */
  };
  $('start').classList.remove('hide'); $('load').classList.add('hide'); $('start').addEventListener('click', begin);
  // ゲームパッド：認識したら知らせる（Safari は、ボタンを1回押すまで認識しない）。タイトルでは A／× ボタンでも開始できる
  const toast = (m: string) => { const t = $('toast'); t.textContent = m; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 2600); };
  addEventListener('gamepadconnected', (e) => { toast(`コントローラーを認識しました（${(e as GamepadEvent).gamepad.id.slice(0, 28)}）`); input.kind = 'pad'; setKind('pad'); });
  const padStart = () => { if (started) return; const pad = Array.from(navigator.getGamepads?.() ?? []).find((p) => p && p.connected); if (pad && pad.buttons.some((b) => b.pressed)) begin(); else requestAnimationFrame(padStart); };
  requestAnimationFrame(padStart);
  if (device !== 'pc') input.kind = 'touch';

  if (debugCam || sim !== null) {
    $('title').classList.add('hide');
    if (sim !== null) { for (const id of ['hud', 'patient', 'hint']) $(id).classList.remove('hide'); setKind('kbm'); $('reticle').classList.remove('hide'); const n = Math.round(sim * 30); for (let i = 0; i < n; i++) step(1 / 30); }
    else { const c = debugCam!.split(',').map(Number); diver.root.visible = false; for (let i = 0; i < 40; i++) stage.update(0.1, i * 0.1, camera); camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3], c[4], c[5]); camera.updateMatrixWorld(); stage.update(0, 4, camera); }
  }
  const dbgTarget = new THREE.Vector3(...(debugCam ? debugCam.split(',').map(Number).slice(3, 6) : [0, 0, 0]));
  const sway = new THREE.Vector3();
  const errSeen = new Set<string>();
  const report = (where: string, e: unknown) => { const m = `${where}: ${String((e as Error)?.message ?? e)}`.slice(0, 160); if (errSeen.has(m)) return; errSeen.add(m); errors.push(m); console.error(m, e);
    const el = $('errline'); el.textContent = `内部エラー（${errSeen.size}）${m}　— 設定で「描画方式：WebGL 2」「映像の仕上げ：切る」にすると直る場合があります`; el.classList.remove('hide'); };
  let last = performance.now();
  renderer.setAnimationLoop(() => {
    const now = performance.now(); const dt = Math.min(0.05, (now - last) / 1000); last = now;
    // 1コマの更新で思わぬ失敗が起きても、止まらずに続ける（失敗は画面の右下と __irErrors に残す）
    try { if (!debugCam && sim === null && !paused) { if (started) { if (hitStop > 0) { hitStop -= dt; step(dt * F.hitStopScale); } else step(dt); } else { t += dt; stage.update(dt, t, camera); } dyn?.tick(dt); } }
    catch (e) { report('update', e); }
    // 顕微鏡の映像らしさ：手持ちでない機材でもわずかに揺れ、ピントがかすかに前後し、明るさが心拍に合わせて息づく（確認用の固定撮影では止める）
    const live = !debugCam && sim === null && !Q.has('frames') && !Q.has('still');
    const tt = now / 1000;
    if (live) { sway.set(Math.sin(tt * 0.73) + 0.5 * Math.sin(tt * 1.91 + 1), Math.sin(tt * 0.61 + 2) + 0.4 * Math.sin(tt * 1.37), Math.sin(tt * 0.53 + 4)).multiplyScalar(0.012 * camera.position.distanceTo(diver.root.position)); camera.position.add(sway); }
    if (viewer.active) { viewer.render(renderer, dt); } else if (post) {
      if (post.useDof) post.focus.value += (camera.position.distanceTo(debugCam ? dbgTarget : diver.root.position) + 0.3 + (live ? 0.35 * Math.sin(tt * 0.45) : 0) - post.focus.value) * (debugCam ? 1 : 0.2);
      post.exposure.value = live ? 1 + 0.022 * Math.pow(0.5 + 0.5 * Math.sin(stage.u.heartPhase.value), 3) + 0.015 * Math.sin(tt * 0.21) : 1;
      try { post.render(); } catch (e) { report('post', e); post = null; renderer.render(stage.scene, camera); }
    } else renderer.render(stage.scene, camera);
    if (live) camera.position.sub(sway);
    hud.tick();
    W.__irFrames = ((W.__irFrames as number) || 0) + 1;
    if (Q.has('frames') && (W.__irFrames as number) >= Number(Q.get('frames'))) { renderer.setAnimationLoop(null); W.__irDone = true; }
  });
  // 閉塞点：初めて光が当たったとき・ほぐれたときの手応えと案内
  let plugHelp = false;
  stage.setOnPlug((i, kind) => {
    if (kind === 'hit') { if (!plugHelp) { plugHelp = true; say(M.plugHit, 8); } return; }
    if (kind === 'pulse') { shake = Math.max(shake, 0.7); rumble(0.6 * F.rumble, 0.3 * F.rumble, 260); audio.hit(); return; }
    const left = stage.plugs.filter((p) => !p.cleared).length;
    vbNotify('answered', { id: `${M.id}-plug`, correct: true, choice: `${M.plugName}をほどいた（残り${left}）`, retry: false });   /* voice-buddy */
    hitStop = 0.16; shake = 1; rumble(0.9 * F.rumble, 0.9 * F.rumble, 320); buzz(60); audio.resolve(); purify.burst();
    say(M.plugCleared(left), 7);
  });
  if (Q.has('tune')) tunePanel(tuning as unknown as Record<string, unknown>);
  W.__pos = pos; W.__diver = diver; W.__input = input; W.__stage = stage; W.__begin = begin; W.__advance = (n: number) => { for (let i = 0; i < n; i++) step(1 / 30); };
  W.__irReady = { backend: backendLabel, tier, device };
}
main().catch((e) => { errors.push(String(e)); console.error(e); const el = document.querySelector('#load .tip'); if (el) el.textContent = '読み込みに失敗しました：' + String(e); });

// VR 版（M1）：同じ網膜の区画の中に立ち、見回し、歩き、手のビームで治す。VR 中は WebGL 2。
import * as THREE from 'three/webgpu';
import { createRenderer, fitRenderer } from '../core/renderer';
import { detectDevice, DEVICE_LABEL } from '../core/device';
import { Hud } from '../core/hud';
import { GameAudio } from '../core/audio';
import { ZONES } from '../stages/zone';
import { loadSave, writeSave } from '../core/save';
import { ATLAS } from '../game/ui';
import { PurifyBeam } from '../game/beam';
import tuning from '../data/tuning.json';
import { haptic } from '../core/feel';
import { speak, voiceSettings } from '../core/voice';
import { Diagnosis } from '../game/diagnosis';
import { buildHubModel } from '../game/hub';

const W = window as unknown as Record<string, unknown>;
const errors: string[] = (W.__irErrors = []) as string[];
addEventListener('error', (e) => errors.push(String(e.message)));
addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

/** 世界の中に置く文字パネル（VR では HTML が使えないので、キャンバスに描いて貼る） */
class Panel {
  canvas = document.createElement('canvas'); ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture; mesh: THREE.Mesh;
  constructor(public w: number, public h: number, widthM: number) {
    this.canvas.width = w; this.canvas.height = h; this.ctx = this.canvas.getContext('2d')!;
    this.tex = new THREE.CanvasTexture(this.canvas); this.tex.colorSpace = THREE.SRGBColorSpace; this.tex.anisotropy = 4;
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(widthM, (widthM * h) / w), new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: false, fog: false, toneMapped: false }));
    this.mesh.renderOrder = 60; this.mesh.visible = false;
  }
  wrap(text: string, x: number, y: number, maxW: number, lh: number) {
    let line = ''; for (const ch of text) { if (this.ctx.measureText(line + ch).width > maxW) { this.ctx.fillText(line, x, y); y += lh; line = ch; } else line += ch; }
    this.ctx.fillText(line, x, y); return y + lh;
  }
  clear(bg = 'rgba(6,11,13,0.86)') { const c = this.ctx; c.clearRect(0, 0, this.w, this.h); c.fillStyle = bg; c.fillRect(0, 0, this.w, this.h); }
}
const FONT = '"IRJP","Hiragino Sans","Yu Gothic UI","Noto Sans JP","Noto Sans CJK JP",sans-serif';

async function main() {
  try { await document.fonts?.load('40px IRJP'); } catch { /* 端末のフォントで描く */ }
  const canvas = $('view') as unknown as HTMLCanvasElement, btn = $('entervr') as HTMLButtonElement, msg = $('vrmsg');
  const device = detectDevice();
  const { renderer, backendLabel } = await createRenderer(canvas, { xr: true });
  renderer.xr.enabled = true; renderer.xr.setReferenceSpaceType('local-floor'); renderer.xr.setFoveation(1);
  const xs = new URLSearchParams(location.search).get('xrscale'); if (xs) renderer.xr.setFramebufferScaleFactor(Number(xs));   // 確認用：描画解像度を下げる
  const camera = new THREE.PerspectiveCamera(70, 1, 0.05, 700);
  // 縮尺：現実の 1m = 1.18µm（身長 1.7m の人が、身長 2µm の潜行士になる）。世界は動かさず、足場（rig）だけを動かす
  const K = tuning.player.height / 1.7;
  const rig = new THREE.Group(); rig.scale.setScalar(K); rig.add(camera); camera.position.set(0, 1.25, 0);
  fitRenderer(renderer, camera, 1.5);
  // 区域：URL の ?zone= か、保存した続きから（画面版と同じ並び）
  const save = loadSave(), Qv = new URLSearchParams(location.search);
  let zi = ZONES.findIndex((z) => z.id === (Qv.get('zone') ?? save.zone ?? 'retina')); if (zi < 0) zi = 0;
  const stage = await (await ZONES[zi].load()).build(renderer, 'vr');
  const M = stage.meta;
  stage.scene.add(rig);
  const [SX, SZ] = stage.size;
  rig.position.copy(stage.start.pos).setY(0); rig.rotation.y = Math.PI + stage.start.yaw;
  const audio = new GameAudio();

  // 手：硬質なスーツの前腕（右＝浄化の道具、左＝手首の端末）
  const shell = new THREE.MeshStandardMaterial({ color: 0x7c66c4, roughness: 0.28 }), dark = new THREE.MeshStandardMaterial({ color: 0x1c1236, roughness: 0.45 });
  const hands = [0, 1].map((i) => {
    const grip = renderer.xr.getControllerGrip(i), ray = renderer.xr.getController(i);
    const g = new THREE.Group();
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.042, 0.2, 16), shell); arm.rotation.x = Math.PI / 2; arm.position.z = 0.09;
    const fist = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), dark); fist.scale.set(1, 0.85, 1.2); fist.position.z = -0.03;
    g.add(arm, fist); grip.add(g); rig.add(grip, ray);
    return { grip, ray, on: false };
  });
  const emitter = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.09, 10), new THREE.MeshBasicMaterial({ color: 0xc9a8ff })); emitter.rotation.x = Math.PI / 2; emitter.position.set(0, 0, -0.07);
  const wrist = new Panel(512, 384, 0.11); wrist.mesh.visible = true; wrist.mesh.rotation.x = -Math.PI / 2; wrist.mesh.position.set(0, 0.046, 0.09);
  // 浄化の光線は画面版と同じもの（VR では少し細く）
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png'); noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping;
  const purify = new PurifyBeam(noiseTex, 0.8); stage.scene.add(purify.group);
  const beamFrom = new THREE.Vector3(), beamTo = new THREE.Vector3();

  // 視界の基準になる動かない枠（バイザーの縁）と、移動中に視野の周辺を暗くする幕
  const rim = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.9, 48), new THREE.MeshBasicMaterial({ color: 0x0a0c0e, fog: false, side: THREE.DoubleSide })); rim.position.z = -0.42; rim.renderOrder = 90; camera.add(rim);
  const vigMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false, side: THREE.DoubleSide });
  const vig = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.64, 48), vigMat); vig.position.z = -0.42; vig.renderOrder = 89; camera.add(vig);

  // 世界に置くパネル：紹介カード（対象の横）、字幕（視線の少し下に、ゆるやかについてくる）、患者の視界の窓
  const cardP = new Panel(1024, 560, 1.5 * K), subP = new Panel(1024, 200, 1.5 * K), patP = new Panel(640, 360, 1.0 * K);
  stage.scene.add(cardP.mesh, subP.mesh, patP.mesh);
  const pImg = new Image(); pImg.src = '/static/img/patient_view.jpg';
  let patDrawn = -1;
  function drawPatient(m: number) {
    if (!pImg.complete || Math.abs(m - patDrawn) < 0.02) return; patDrawn = m;
    const c = patP.ctx, k = 1 - m; c.filter = `blur(${(k * 26).toFixed(1)}px) brightness(${0.4 + 0.6 * m}) saturate(${0.35 + 0.65 * m})`; c.drawImage(pImg, 0, 0, patP.w, patP.h); c.filter = 'none';
    const g = c.createRadialGradient(patP.w * 0.46, patP.h * 0.52, 0, patP.w * 0.46, patP.h * 0.52, patP.w * 0.3); g.addColorStop(0, `rgba(20,16,14,${0.85 * k})`); g.addColorStop(1, 'rgba(20,16,14,0)'); c.fillStyle = g; c.fillRect(0, 0, patP.w, patP.h);
    c.fillStyle = '#fff'; c.font = `26px ${FONT}`; c.fillText('患者の視界', 18, patP.h - 18); patP.tex.needsUpdate = true;
  }
  const known = new Set<string>(); const queue: { id: string; at: THREE.Vector3 | null }[] = []; let cardT = 0, subT = 0, cardOn = false;
  function showCard(id: string, at: THREE.Vector3 | null) {
    const e = ATLAS.find((x) => x.id === id)!; const c = cardP.ctx; cardP.clear(); known.add(id); audio.chime();
    c.fillStyle = '#7fe0d2'; c.fillRect(0, 0, 8, cardP.h); c.font = `26px ${FONT}`; c.fillText('初めて出会ったもの', 48, 60);
    c.fillStyle = '#e9eef2'; c.font = `600 76px ${FONT}`; c.fillText(e.ja, 48, 150); c.fillStyle = '#8fa3ad'; c.font = `30px ${FONT}`; c.fillText(e.en, 48, 198);
    c.fillStyle = '#f2b36b'; c.font = `34px ${FONT}`; let y = cardP.wrap(`${e.size}（${e.compare}）`, 48, 262, 930, 46);
    c.fillStyle = '#e9eef2'; c.font = `40px ${FONT}`; cardP.wrap(e.intro, 48, y + 22, 930, 58); cardP.tex.needsUpdate = true;
    // 対象の横（対象がなければ正面 1.8m 相当）に、こちらを向けて置く
    const head = camera.getWorldPosition(new THREE.Vector3()); const fwd = camera.getWorldDirection(new THREE.Vector3()); fwd.y = 0; fwd.normalize();
    const p = at ? at.clone() : head.clone().addScaledVector(fwd, 1.9 * K);
    if (at) { const side = new THREE.Vector3(fwd.z, 0, -fwd.x); p.addScaledVector(side, -1.0 * K); p.y = head.y + 0.05 * K; const d = p.clone().sub(head); d.y = 0; if (d.length() < 1.5 * K || d.length() > 4 * K) p.copy(head).addScaledVector(d.normalize(), 2.0 * K); }
    cardP.mesh.position.copy(p); cardP.mesh.lookAt(head); cardP.mesh.visible = true; cardT = 8; cardOn = true;
  }
  function say(text: string, dur = 7) {
    speak(text);   // 読み上げ（声・速さは画面版の「設定」で選んだもの）
    subP.mesh.userData.off = !voiceSettings.subs; const c = subP.ctx; subP.clear('rgba(4,7,9,0.72)'); c.fillStyle = '#eef3f5'; c.font = `40px ${FONT}`; subP.wrap(text, 36, 70, 950, 56); subP.tex.needsUpdate = true; subP.mesh.visible = voiceSettings.subs; subT = dur; }
  function drawWrist(prog: number, scan: boolean) {
    const c = wrist.ctx; wrist.clear('rgba(4,9,11,0.94)'); c.fillStyle = '#8fa3ad'; c.font = `30px ${FONT}`; c.fillText(M.hud.slice(0, 16), 28, 56);
    c.fillStyle = '#e9eef2'; c.font = `300 120px ${FONT}`; c.fillText(`${Math.round(prog * 100)}%`, 28, 190); c.fillStyle = '#ffffff22'; c.fillRect(28, 222, 456, 10);
    const g = c.createLinearGradient(28, 0, 484, 0); g.addColorStop(0, '#f2b36b'); g.addColorStop(1, '#7fe0d2'); c.fillStyle = g; c.fillRect(28, 222, 456 * prog, 10);
    c.fillStyle = scan ? '#7fe0d2' : '#8fa3ad'; c.font = `28px ${FONT}`; c.fillText(scan ? 'スキャン中' : '端末を見るとスキャン', 28, 290);
    if (scan && diag.findings.length) { c.fillStyle = '#ffc070'; c.font = `26px ${FONT}`; diag.findings.slice(0, 2).forEach((f, i) => c.fillText(`病巣${i + 1} ${f.short} ${Math.round(f.dist)}µm`, 28, 332 + i * 34)); }
    else c.fillText(`知覚加速 ×${tuning.flow.perceptionFactor}`, 28, 340);
    wrist.tex.needsUpdate = true;
  }

  // ---- VR の開始 ----
  const hud = new Hud(`${backendLabel} · VR · ${DEVICE_LABEL[device]}`);
  let session: XRSession | null = null;
  const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
  const supported = !!xr && (await xr.isSessionSupported('immersive-vr').catch(() => false));
  btn.disabled = !supported;
  msg.textContent = supported ? '左スティック：移動　右スティック：向きを変える　右トリガー：浄化　左手首を見る：スキャン　握って引く：泳ぐ　（水晶体では）左トリガー：導きの光'
    : 'このブラウザは VR に対応していません。Meta Quest 3 の標準ブラウザで開いてください。下は確認用の画面表示です（ドラッグで見回し、WASD で移動、F で浄化）。';
  if (!supported) { $('vrui').classList.add('min'); const m2 = document.createElement('div'); m2.className = 'ir-nav'; m2.innerHTML = '<span style="color:var(--dim);font-size:12px">確認モード：ドラッグ＝見回す　WASD＝移動　F＝浄化　Q＝スキャン</span>'; document.body.appendChild(m2); }
  let started = !supported; let t = 0;
  btn.addEventListener('click', async () => {
    if (session) { await session.end(); return; }
    try {
      session = await xr!.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] });
      session.addEventListener('end', () => { session = null; btn.textContent = 'VR で遊ぶ'; W.__irXR = false; });
      await renderer.xr.setSession(session);
      btn.textContent = 'VR を終了'; W.__irXR = true; audio.start(); void audio.bed(`/static/audio/${M.id}.m4a`);
      if (!started) { started = true; say(M.arrive, 12); }
    } catch (e) { msg.textContent = 'VR を開始できませんでした：' + String(e); errors.push(String(e)); }
  });
  // 右手・左手は、つながったコントローラーの種類（handedness）で決める
  let right = hands[1], left = hands[0];
  hands.forEach((h) => {
    h.ray.addEventListener('connected', (e) => { const hd = (e as unknown as { data: XRInputSource }).data.handedness; if (hd === 'right') { right = h; h.grip.add(emitter); } if (hd === 'left') { left = h; h.grip.add(wrist.mesh); } });
    h.ray.addEventListener('selectstart', () => (h.on = true)); h.ray.addEventListener('selectend', () => (h.on = false));
  });
  // 確認モード（ヘッドセットなし）：ドラッグで見回し、キーで移動
  const keys = new Set<string>(); let drag = false, yawD = 0, pitchD = 0;
  addEventListener('keydown', (e) => { keys.add(e.code); audio.start(); }); addEventListener('keyup', (e) => keys.delete(e.code));
  canvas.addEventListener('pointerdown', () => (drag = true)); addEventListener('pointerup', () => (drag = false));
  addEventListener('pointermove', (e) => { if (drag && !session) { yawD -= e.movementX * 0.004; pitchD = Math.max(-1.2, Math.min(1.2, pitchD - e.movementY * 0.004)); } });

  const v = new THREE.Vector3(), d = new THREE.Vector3(), hit = new THREE.Vector3(), q = new THREE.Quaternion(), vel = new THREE.Vector3();
  let snapReady = true, stepReady = true, finished = false, wristT = 0, scanOn = false, lastProg = -1;
  // 区域を選ぶ（画面版と同じ進み具合を使う）
  { const zs = $('v-zone') as HTMLSelectElement; zs.value = Qv.get('zone') ?? ''; zs.onchange = () => { location.href = `${location.pathname}${zs.value ? `?zone=${zs.value}` : ''}`; }; }
  const moveMode = () => ($('v-move') as HTMLSelectElement).value, vigMax = () => Number(($('v-vig') as HTMLSelectElement).value);
  // 酔いにくさの設定は、次に開いたときも同じにする
  for (const id of ['v-intense', 'v-move', 'v-vig', 'v-turn', 'v-eye', 'v-swim']) {
    const el = $(id) as HTMLSelectElement; try { const v = localStorage.getItem('ir.' + id); if (v) el.value = v; } catch { /* 保存できない */ }
    el.addEventListener('change', () => { try { localStorage.setItem('ir.' + id, el.value); } catch { /* 保存できない */ } });
  }
  const turnMode = () => ($('v-turn') as HTMLSelectElement).value, eyeLift = () => Number(($('v-eye') as HTMLSelectElement).value), handSwim = () => ($('v-swim') as HTMLSelectElement).value === 'on';
  // 手で泳ぐ：握った手を引くと、その反対へ体が進む（水をかく）。体液の中では高さも変えられる
  let alt = 0; const swimV = new THREE.Vector3(); const prevHand = [new THREE.Vector3(), new THREE.Vector3()]; const gripOn = [false, false];
  hands.forEach((h, i) => { h.ray.addEventListener('squeezestart', () => { gripOn[i] = true; h.grip.getWorldPosition(prevHand[i]); }); h.ray.addEventListener('squeezeend', () => (gripOn[i] = false)); });
  const srcOf = (h: { grip: THREE.Object3D }) => (session ? Array.from(session.inputSources).find((s) => s.handedness === (h === right ? 'right' : 'left')) : undefined);
  // 導きの光（区域B）：左手から前へ向けた、やわらかな暖かい光
  const guide = new THREE.SpotLight(0xffe6c0, 0, 30 * K, 0.35, 0.6, 1.2); guide.position.set(0, 0, -0.05); guide.target.position.set(0, 0, -1);
  hands[0].ray.add(guide, guide.target);
  const diag = new Diagnosis(stage.health, stage.size as [number, number], stage.floorHeight, (x: number, z: number) => stage.causeAt(x, z), 0.8, stage.plugs); stage.scene.add(diag.group);
  let hubVR: Awaited<ReturnType<typeof buildHubModel>> | null = null; const hq = new THREE.Quaternion();
  let wasHit = false, scanWas = false, diagT = 0, lastStep = -1;
  stage.setOnPlug((i, kind) => {
    if (kind === 'hit' || kind === 'pulse') { if (kind === 'pulse') haptic(srcOf(left), 0.4, 200); return; }
    const rest = stage.plugs.filter((p) => !p.cleared).length; audio.resolve(); purify.burst(); haptic(srcOf(right), 1, 300); haptic(srcOf(left), 0.6, 300);
    say(rest ? `塊がほぐれ、血が流れはじめました。残りの閉塞点は ${rest} か所です。` : 'すべての閉塞点がほぐれました。', 7);
  });
  let last = performance.now();
  renderer.setAnimationLoop(() => {
    const now = performance.now(); const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    // 入力
    let mx = 0, my = 0, turn = 0, fire = right.on;
    if (session) for (const src of session.inputSources) {
      const a = src.gamepad?.axes; if (!a) continue; const x = a[2] ?? a[0] ?? 0, y = a[3] ?? a[1] ?? 0;
      if (src.handedness === 'left') { mx = Math.abs(x) > 0.15 ? x : 0; my = Math.abs(y) > 0.15 ? -y : 0; } else if (src.handedness === 'right') turn = x;
    } else {
      if (keys.has('KeyW')) my += 1; if (keys.has('KeyS')) my -= 1; if (keys.has('KeyD')) mx += 1; if (keys.has('KeyA')) mx -= 1; fire = keys.has('KeyF');
      camera.rotation.set(pitchD, yawD, 0, 'YXZ');
    }
    // 向き：一定の角度ずつ変える（なめらかに回さない）
    if (turnMode() === 'smooth') { if (Math.abs(turn) > 0.2) rig.rotation.y -= turn * 1.2 * dt; }
    else { if (Math.abs(turn) > 0.6 && snapReady) { rig.rotation.y -= Math.sign(turn) * THREE.MathUtils.degToRad(Number(turnMode()) || tuning.vr.snapDeg); snapReady = false; } if (Math.abs(turn) < 0.3) snapReady = true; }
    // 移動：頭の向きを基準に、水平にだけ進む。加速と減速は穏やかに
    camera.getWorldDirection(d); d.y = 0; d.normalize();
    v.set(d.x * my - d.z * mx, 0, d.z * my + d.x * mx);
    if (moveMode() === 'step' && session) { if (v.length() > 0.7 && stepReady) { rig.position.addScaledVector(v.normalize(), 2.2); stepReady = false; } if (v.length() < 0.3) stepReady = true; vel.set(0, 0, 0); }
    else { vel.lerp(v.multiplyScalar(tuning.vr.moveSpeed * K * 1.6), Math.min(1, dt * 4)); rig.position.addScaledVector(vel, dt); }
    stage.collide?.(rig.position, 0.45 * K);
    rig.position.x = Math.max(-SX / 2 + 14, Math.min(SX / 2 - 14, rig.position.x)); rig.position.z = Math.max(-SZ / 2 + 12, Math.min(SZ / 2 - 12, rig.position.z));
    // 手で水をかく：握っている手の動き（世界の中での移動量）の反対へ、体を押し出す。離すと水の抵抗でゆっくり止まる
    if (session && handSwim()) for (let i = 0; i < 2; i++) {
      if (!gripOn[i]) continue; hands[i].grip.getWorldPosition(v); d.subVectors(v, prevHand[i]);
      if (d.length() < 0.5 * K) swimV.addScaledVector(d, -tuning.vr.swimPull / Math.max(dt, 1e-3) * Math.min(1, dt * 6));
      prevHand[i].copy(v);
    }
    swimV.multiplyScalar(Math.max(0, 1 - dt * tuning.vr.swimDrag));
    const sl = swimV.length(), maxS = tuning.vr.moveSpeed * K * 2.2; if (sl > maxS) swimV.multiplyScalar(maxS / sl);
    rig.position.x += swimV.x * dt; rig.position.z += swimV.z * dt; alt = Math.max(0, Math.min(M.swimCeil ?? tuning.player.swimCeil, alt + swimV.y * dt)); if (alt <= 0 && swimV.y < 0) swimV.y = 0;
    for (let i = 0; i < 2; i++) if (gripOn[i]) hands[i].grip.getWorldPosition(prevHand[i]);   // 体が動いたぶんを差し引く
    // 足場は急に上下させない（床の起伏＋泳いだ高さ＋目の高さの設定）
    const wantY = stage.floorHeight(rig.position.x, rig.position.z) + alt + eyeLift() * K;
    rig.position.y += (wantY - rig.position.y) * Math.min(1, dt * 6);
    vigMat.opacity += (Math.min(1, (vel.length() + swimV.length()) / (tuning.vr.moveSpeed * K)) * vigMax() - vigMat.opacity) * Math.min(1, dt * 6);
    rig.updateMatrixWorld(true);
    // 浄化：右手の向きの先の床
    let firing = false;
    if (fire && !finished) {
      const src = session ? right.ray : camera; src.getWorldPosition(v); src.getWorldQuaternion(q); d.set(0, 0, -1).applyQuaternion(q);
      let found = false; for (let s = 0.5; s < tuning.beam.range; s += 0.4) { hit.copy(v).addScaledVector(d, s); if (hit.y <= stage.floorHeight(hit.x, hit.z)) { found = true; break; } }
      if (found) { const hb = stage.health.sample(hit.x, hit.z); if (!wasHit && hb < 0.6) haptic(srcOf(right), 0.6, 90); else if (hb < 0.8 && Math.random() < dt * 4) haptic(srcOf(right), 0.12, 60); stage.heal(hit.x, hit.z, dt); firing = true; if (!session) v.y -= 0.5; beamFrom.copy(v); beamTo.copy(hit); stage.u.beamPos.value.copy(hit); }
    }
    wasHit = firing;
    // 区域B（水晶体）だけ：左手のトリガーで「導きの光」。手のひらから瞳の光を導き、当てた所の濁りを少しずつ晴らす（光を導く遊びを、手で）
    if (M.id === 'lens' && session) {
      if (guide.parent !== left.ray) left.ray.add(guide, guide.target);   // 左手がどちらのコントローラーか分かってから付け替える
      const on = left.on && !finished; guide.intensity += ((on ? 26 : 0) - guide.intensity) * Math.min(1, dt * 8);
      if (on) { left.ray.getWorldPosition(v); left.ray.getWorldQuaternion(q); d.set(0, 0, -1).applyQuaternion(q);
        for (let s2 = 0.5; s2 < tuning.beam.range; s2 += 0.5) { hit.copy(v).addScaledVector(d, s2); if (hit.y <= stage.floorHeight(hit.x, hit.z)) { stage.heal(hit.x, hit.z, dt * 0.5); if (Math.random() < dt * 3) haptic(srcOf(left), 0.08, 40); break; } } }
    }
    const bo = stage.u.beamOn.value as number; stage.u.beamOn.value = bo + ((firing ? 1 : 0) - bo) * Math.min(1, dt * 10);
    purify.update(dt, beamFrom, beamTo, firing, camera);
    // スキャン：左手首の端末を自分の顔に向けている間
    if (session) { left.grip.getWorldQuaternion(q); d.set(0, 1, 0).applyQuaternion(q); left.grip.getWorldPosition(v); camera.getWorldPosition(hit); scanOn = d.dot(hit.sub(v).normalize()) > 0.72; } else scanOn = keys.has('KeyQ');
    const sc = stage.u.scan.value as number; stage.u.scan.value = sc + ((scanOn ? 1 : 0) - sc) * Math.min(1, dt * 4);
    if (scanOn && (!scanWas || (diagT -= dt) <= 0)) { diag.analyze(rig.position.x, rig.position.z); diagT = 1; wristT = 0; lastProg = -1; } scanWas = scanOn; diag.update(dt, scanOn, rig.position.x, rig.position.z);
    stage.update(dt, t, camera);
    // 進み具合、紹介、字幕、患者の窓
    const mean = stage.health.mean(), prog = stage.progress();
    const stepNow = Math.floor(prog * 10); if (stepNow > lastStep && lastStep >= 0 && !finished) { audio.restored(stepNow); purify.burst(); haptic(srcOf(right), 0.8, 160); haptic(srcOf(left), 0.5, 160); } lastStep = Math.max(lastStep, stepNow);
    wristT -= dt; if (wristT <= 0 && (Math.abs(prog - lastProg) > 0.004 || scanOn)) { drawWrist(prog, scanOn); wristT = 0.25; lastProg = prog; }
    if (started) {
      const near = (p: THREE.Vector3, r: number) => Math.hypot(p.x - rig.position.x, p.z - rig.position.z) < r && stage.health.sample(p.x, p.z) > 0.55;
      const enq = (id: string, at: THREE.Vector3 | null) => { if (!known.has(id) && !queue.some((x) => x.id === id)) queue.push({ id, at }); };
      for (const e of stage.encounters(rig.position, t, t * 0.8)) enq(e.id, e.at);
      if (cardOn) { cardT -= dt; if (cardT <= 0) { cardP.mesh.visible = false; cardOn = false; } } else if (queue.length && !firing && subT <= 0) { const x = queue.shift()!; showCard(x.id, x.at); }
    }
    camera.getWorldPosition(v); camera.getWorldDirection(d);
    if (subT > 0) { subT -= dt; hit.copy(v).addScaledVector(d, 1.7 * K); hit.y -= 0.55 * K; subP.mesh.position.lerp(hit, Math.min(1, dt * 2)); subP.mesh.lookAt(v); if (subT <= 0) subP.mesh.visible = false; }
    drawPatient(prog);
    if (!finished && prog >= 1) {
      finished = true; stage.health.setAll(1); audio.resolve();
      const next = ZONES[zi + 1]; writeSave({ done: [...new Set([...(loadSave().done ?? []), M.id])], zone: next ? next.id : M.id });
      say(`${M.done}目の前の窓は、患者の視界です。` + (next ? `次は ${next.name}。VR を終えて「次の区域へ」を押してください。` : 'ステージ1の治療が終わりました。'), 14);
      // 全身マップ：目の前に、立体の人体を浮かべる（治した器官が脈打つ）。のぞき込める大きさで
      void buildHubModel(loadSave()).then((hm) => {
        const side = new THREE.Vector3(d.z, 0, -d.x);
        hm.group.scale.setScalar(0.55 * K); hm.group.position.copy(v).addScaledVector(d, 1.3 * K).addScaledVector(side, 0.9 * K); hm.group.position.y -= 0.9 * K;
        hm.group.lookAt(v.x, hm.group.position.y, v.z); stage.scene.add(hm.group);
        hubVR = hm;   // 動きは毎コマの更新で（VR 中は画面の requestAnimationFrame が動かないため）
      });
      if (next) { const b = document.createElement('button'); b.className = 'btn'; b.textContent = `次の区域へ（${next.name}）`; b.onclick = () => (location.href = `${location.pathname}?zone=${next.id}`); $('vrui').appendChild(b); }
      d.y = 0; d.normalize(); patP.mesh.position.copy(v).addScaledVector(d, 1.8 * K); patP.mesh.position.y += 0.1 * K; patP.mesh.lookAt(v); patP.mesh.scale.setScalar(1.6); patP.mesh.visible = true;   // プレイヤーは動かさず、窓を目の前に出す
    }
    if (hubVR) { hubVR.t.value += dt; camera.getWorldQuaternion(hq); for (const m of hubVR.marks) m.mesh.quaternion.copy(hq); hubVR.group.rotation.y += dt * 0.15; }
    audio.update(mean, stage.flowing(), firing, stage.u.heartPhase.value as number);
    renderer.render(stage.scene, camera);
    hud.tick(); W.__irFrames = ((W.__irFrames as number) || 0) + 1;
  });
  W.__stage = stage; W.__rig = rig;
  W.__irReady = { backend: backendLabel, supported };
}
main().catch((e) => { errors.push(String(e)); console.error(e); });

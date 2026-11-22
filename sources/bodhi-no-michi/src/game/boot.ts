// 起動と全体の進行：題字 → 序章 → 印可。設定・保存・一時停止・静止画モード・絵づくりの調整パネル。
import * as THREE from 'three';
import { Stage, type ArtMode } from '../engine/stage';
import { G } from '../engine/watercolor';
import { createUI } from '../ui/ui';
import { createInput } from './input';
import { createAudio } from './audio';
import { loadSave, writeSave, resetSave } from './save';
import { Prologue } from './prologue';
import { createHowto } from '../ui/howto';
import type { InputState, Settings } from './contracts';

export async function boot(canvas: HTMLCanvasElement, q: URLSearchParams): Promise<void> {
  const stage = new Stage(canvas);
  const uiRoot = document.getElementById('ui')!;
  let save = loadSave();
  const audio = createAudio();
  type Scr = 'title' | 'play' | 'pause' | 'photo';
  let scr: Scr = 'title';
  let vrActive = false;

  const applySettings = (s: Settings) => {
    audio.setVolumes({ music: s.volMusic, sfx: s.volSfx, ambience: s.volAmbience });
    const ql = s.quality;
    stage.maxPixelRatio = ql === 'low' ? 1 : ql === 'mid' ? 1.5 : 2;
    stage.post.kuwahara = ql === 'low' ? 0 : 2;
    autoQ = ql === 'auto'; stage.resize();
  };
  let autoQ = true;
  const ctx = () => ui.setContext({ settings: save.settings, zukan: save.zukan, virtues: save.virtues, reached: save.chapter });

  const ui = createUI(uiRoot, {
    onFirstGesture: () => { void audio.unlock().then(() => { if (scr === 'title') audio.playChapter('title'); }); },
    onTitle: c => {
      audio.sfx('uiSelect');
      if (c === 'new') { const st = save.settings; save = resetSave(); save.settings = st; writeSave(save); void begin('begin'); }
      else if (c === 'continue') void begin(save.checkpoint ? (save.checkpoint.id === 'court' ? 'court' : 'jizo') : 'begin');
      else if (c === 'howto') void howto.show();
      else if (c === 'chapters') ui.showChapterSelect(save.chapter);
      else if (c === 'zukan') ui.showZukanList(save.zukan);
      else if (c === 'settings') ui.showSettings(save.settings);
      else if (c === 'gallery') location.href = './gallery.html';
      else if (c === 'vr') void startVR();
    },
    onSettings: s => { save.settings = s; writeSave(save); applySettings(s); },
    onPause: a => {
      if (a === 'resume') resume();
      else if (a === 'photo') { scr = 'photo'; game.photo = true; ui.setPhotoMode(true); input.setEnabled(true); input.setTouchVisible(false); photoInit(); }
      else if (a === 'retry') { resume(); game.start(save.checkpoint ? 'court' : 'begin'); }
      else if (a === 'title') location.reload();
    },
    onChapterSelect: ch => { if (ch === 0) void begin('begin'); },
    onPhotoExit: () => { game.photo = false; ui.setPhotoMode(false); scr = 'pause'; ui.showPause(); input.setEnabled(false); },
  });
  ctx();
  const input = createInput(canvas, uiRoot);

  const howto = createHowto(uiRoot);
  const showHowto = async () => { const was = scr; if (was === 'play') { audio.setDucked(true); input.setEnabled(false); } await howto.show(); if (scr === 'play') { audio.setDucked(false); input.setEnabled(true); } };
  addEventListener('bodhi-howto', () => { void showHowto(); });
  const game = new Prologue(stage, ui, audio, {
    onHowto: showHowto,
    onCheckpoint: id => { save.checkpoint = { chapter: 0, id }; writeSave(save); },
    onZukan: async id => { if (!save.zukan.includes(id)) { save.zukan.push(id); writeSave(save); ctx(); } audio.sfx('page'); if (!game.bot) await ui.showZukanCard(id); },
    onInka: async () => {
      if (!save.virtues.includes('kokyu')) save.virtues.push('kokyu');
      if (!save.cleared.includes(0)) save.cleared.push(0);
      save.chapter = Math.max(save.chapter, 0); save.checkpoint = undefined; writeSave(save); ctx();
      if (!game.bot) await ui.showInka('呼吸', 'こきゅう', '阿で開き、吽で閉じる。息が整えば、心は澄み、一手は冴える。<br>― 調息が深くなった（心と体の戻りが速くなる）');
    },
    onDone: () => { void ending(); },
    difficulty: () => save.settings.difficulty,
    vr: () => vrActive,
  });

  ui.showLoading(0.02, '紙を広げています');
  await game.load((p, l) => ui.showLoading(p, l));
  applySettings(save.settings);
  ui.hideLoading();

  // ── 絵づくりの調整（?art=1）と案の切り替え（?mode=A|B|C） ──
  if (q.get('mode')) stage.setArt(q.get('mode') as ArtMode);
  if (q.get('artv')) { const v = q.get('artv')!.split(',').map(Number); G.uArt.value.set(v[0] ?? 1, v[1] ?? 1, v[2] ?? 1, v[3] ?? 1); G.uArt2.value.x = v[4] ?? 1; G.uArt2.value.y = v[5] ?? 1; }
  if (q.get('art') === '1') artPanel(stage);

  const titleCam = (t: number) => {
    const a = Math.sin(t * 0.07) * 0.5;
    stage.camera.position.set(2.6 + a * 2.2, 1.9 + Math.sin(t * 0.05) * 0.2, 13.2 - Math.abs(a));
    stage.camera.lookAt(-3.0, 5.0, -9); if (stage.camera.fov !== 50) { stage.camera.fov = 50; stage.camera.updateProjectionMatrix(); }
    (G.uFocus.value as THREE.Vector4).set(0, 3, -8, 14);
  };
  const neutral: InputState = input.update();

  async function begin(from: 'begin' | 'jizo' | 'court'): Promise<void> {
    void audio.unlock();
    await ui.wash(true, 900);
    ui.hideTitle(); scr = 'play';
    game.start(from);
    input.setEnabled(true); input.setTouchVisible(true);
    await ui.wash(false, 1200);
    if (from === 'begin' && !game.bot) await ui.chapterCard('序章　山門', '― 呼吸 ―', 3800);
  }
  async function ending(): Promise<void> {
    await ui.chapterCard('序章　了', '第一章「阿修羅 ― 忍辱」は、ただいま制作中です', 5200);
    await ui.wash(true, 1200);
    location.href = location.pathname + location.search.replace(/[?&](auto|bot)=[^&]*/g, '');
  }
  function clearCue(): void { howto.setCue(null); howto.hideRing(); input.highlight(null); }
  function resume(): void { ui.hidePause(); scr = 'play'; audio.setDucked(false); input.setEnabled(true); }
  function pause(): void { if (scr !== 'play' || ui.anyModalOpen) return; scr = 'pause'; clearCue(); ctx(); ui.showPause(); audio.setDucked(true); input.setEnabled(false); }
  addEventListener('bodhi-pause', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });

  // ── 静止画モード：止めた絵を、構図を変えて眺める ──
  const ph = { yaw: 0, pitch: 0.2, dist: 8, tgt: new THREE.Vector3() };
  function photoInit(): void {
    const c = stage.camera; ph.tgt.set(G.uFocus.value.x, G.uFocus.value.y, G.uFocus.value.z);
    const d = c.position.clone().sub(ph.tgt); ph.dist = d.length(); ph.yaw = Math.atan2(d.x, d.z); ph.pitch = Math.asin(d.y / ph.dist);
  }
  canvas.addEventListener('wheel', e => { if (scr === 'photo') ph.dist = Math.min(40, Math.max(1.5, ph.dist * (1 + e.deltaY * 0.001))); }, { passive: true });

  // ── VR ──
  let vr: import('./vr').VRRig | null = null;
  const vrSupported = !!navigator.xr && await navigator.xr.isSessionSupported('immersive-vr').catch(() => false);
  async function startVR(): Promise<void> {
    const { enterVR } = await import('./vr');
    void audio.unlock();
    vr = await enterVR(stage, game, audio, () => save.settings, () => { vrActive = false; vr = null; location.reload(); });
    vrActive = true; ui.hideTitle(); scr = 'play'; game.start(save.checkpoint ? 'jizo' : 'begin');
  }

  if (!q.get('auto')) ui.showTitle({ canContinue: !!save.checkpoint || save.cleared.length > 0, vrSupported });

  // ── 主ループ ──
  let last = performance.now(), slow = 0, fast = 0, frames = 0, fpsT = 0, fps = 60;
  const speed = +(q.get('speed') ?? 1);
  stage.renderer.setAnimationLoop(now => {
    const raw = (now - last) / 1000; last = now;
    const dt = Math.min(0.05, Math.max(0.001, raw));
    frames++; fpsT += raw; if (fpsT > 0.5) { fps = frames / fpsT; frames = 0; fpsT = 0; }
    // 画質の自動調整：重ければ解像度から落とす（水彩らしさは最後まで残す）
    if (autoQ && !vrActive && scr === 'play') {
      if (raw > 1 / 45) slow++; else slow = Math.max(0, slow - 1);
      if (raw < 1 / 58) fast++; else fast = 0;
      if (slow > 50 && stage.maxPixelRatio > 0.8) { stage.maxPixelRatio = Math.max(0.8, stage.maxPixelRatio - 0.25); stage.resize(); slow = 0; }
      else if (fast > 900 && stage.maxPixelRatio < 2) { stage.maxPixelRatio += 0.25; stage.resize(); fast = 0; }
    }
    const inp = vr ? vr.input(dt) : input.update();
    if (scr === 'play') {
      const frozen = (ui.anyModalOpen || howto.open) && !vrActive;
      if (!frozen) for (let i = 0; i < speed; i++) game.update(dt, i === 0 ? inp : neutral);
      ui.setHud(game.hud());
      const cue = vrActive ? null : game.cue(); howto.setCue(cue); input.highlight(cue?.action ?? null);
      for (const j of game.takeJudges()) if (!vrActive) howto.judge(j.text, j.sub, j.kind);
      const tg = vrActive ? null : game.telegraph();
      if (tg) {
        const p = tg.pos.clone().project(stage.camera), r = canvas.getBoundingClientRect();
        const sc = Math.max(0.55, Math.min(1, r.height / 820));
        howto.setRing((p.x * 0.5 + 0.5) * r.width, (-p.y * 0.5 + 0.5) * r.height, tg.k, tg.hot, sc);
      } else howto.hideRing();
      input.showContext(game.nearJizo && game.mode === 'explore' ? '手を合わせる' : null, 'interact');
      if (inp.pressed.pause) pause();
    } else if (scr === 'title') {
      G.uClarity.value = 1; game.idle(dt);
      titleCam(G.uTime.value);
    } else if (scr === 'photo') {
      ph.yaw -= inp.lookX; ph.pitch = Math.min(1.3, Math.max(-0.2, ph.pitch + inp.lookY));
      ph.tgt.x += (inp.moveX * Math.cos(ph.yaw) + inp.moveY * -Math.sin(ph.yaw)) * dt * 4; ph.tgt.z += (-inp.moveX * Math.sin(ph.yaw) + inp.moveY * -Math.cos(ph.yaw)) * dt * 4;
      stage.camera.position.set(ph.tgt.x + Math.sin(ph.yaw) * Math.cos(ph.pitch) * ph.dist, ph.tgt.y + Math.sin(ph.pitch) * ph.dist, ph.tgt.z + Math.cos(ph.yaw) * Math.cos(ph.pitch) * ph.dist);
      stage.camera.lookAt(ph.tgt);
    }
    if (vr) vr.update(dt);
    const c = stage.camera; c.updateMatrixWorld();
    const f = new THREE.Vector3(0, 0, -1).transformDirection(c.matrixWorld), u = new THREE.Vector3(0, 1, 0).transformDirection(c.matrixWorld), p = new THREE.Vector3().setFromMatrixPosition(c.matrixWorld);
    audio.setListener([p.x, p.y, p.z], [f.x, f.y, f.z], [u.x, u.y, u.z]);
    stage.render();
  });

  // ── 確認用の窓口（自動操作・画面写真） ──
  const api = {
    game, stage, save: () => save, fps: () => fps, info: () => stage.info(),
    state: () => ({ scr, mode: game.mode, phase: game.phase, inka: +game.inka.toFixed(2), mind: +game.mind.toFixed(2), body: +game.body.toFixed(2), pos: game.monk.pos.toArray().map(v => +v.toFixed(1)), stats: game.stats, time: +game.time.toFixed(1), fps: +fps.toFixed(0), ...stage.info() }),
    begin, pause,
  };
  (window as unknown as { __game: typeof api }).__game = api;
  if (q.get('bot') === '1') game.bot = true;
  if (q.get('auto')) { ui.hideTitle(); await begin(q.get('auto') as 'begin' | 'jizo' | 'court'); }
  if (q.get('ui') === '0') uiRoot.style.display = 'none';
  if (q.get('cam')) { const c = q.get('cam')!.split(',').map(Number); ui.hideTitle(); scr = 'photo'; const d = new THREE.Vector3(c[0] - c[3], c[1] - c[4], c[2] - c[5]); ph.tgt.set(c[3], c[4], c[5]); ph.dist = d.length(); ph.yaw = Math.atan2(d.x, d.z); ph.pitch = Math.asin(d.y / ph.dist); stage.camera.fov = +(q.get('fov') ?? 50); stage.camera.updateProjectionMatrix(); G.uFocus.value.set(0, 3, -8, 14); for (let i = 0; i < 150; i++) game.idle(0.03); setInterval(() => game.idle(0.016), 16); }
}

/** 絵づくりの調整パネル：つまみで強さを変え、設定値を文字で書き出す */
function artPanel(stage: Stage): void {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;right:8px;top:8px;z-index:50;background:#f4efe4ee;color:#2b3350;font:13px "Shippori Mincho",serif;padding:10px 12px;border:1px solid #2b335055;width:230px;max-height:92vh;overflow:auto;pointer-events:auto';
  const items: [string, () => number, (v: number) => void][] = [
    ['にじみ', () => G.uArt.value.x, v => (G.uArt.value.x = v)], ['縁の溜まり', () => G.uArt.value.y, v => (G.uArt.value.y = v)],
    ['粒状感', () => G.uArt.value.z, v => (G.uArt.value.z = v)], ['紙目・かすれ', () => G.uArt.value.w, v => (G.uArt.value.w = v)],
    ['輪郭線', () => G.uArt2.value.x, v => (G.uArt2.value.x = v)], ['彩度', () => G.uArt2.value.y, v => (G.uArt2.value.y = v)],
  ];
  const out = document.createElement('textarea'); out.readOnly = true; out.style.cssText = 'width:100%;height:44px;font:11px monospace;margin-top:6px';
  const write = () => { out.value = `artv=${items.map(i => i[1]().toFixed(2)).join(',')}&mode=${stage.art}`; };
  el.innerHTML = '<b>絵づくりの調整</b>';
  for (const [name, get, set] of items) {
    const row = document.createElement('label'); row.style.cssText = 'display:block;margin-top:6px';
    const val = document.createElement('span'); val.textContent = ' ' + get().toFixed(2);
    const r = document.createElement('input'); r.type = 'range'; r.min = '0'; r.max = '2'; r.step = '0.05'; r.value = String(get()); r.style.width = '100%';
    r.oninput = () => { set(+r.value); val.textContent = ' ' + (+r.value).toFixed(2); write(); };
    row.append(name, val, r); el.append(row);
  }
  const modes = document.createElement('div'); modes.style.marginTop = '8px'; modes.append('作り方の案：');
  for (const m of ['A', 'B', 'C'] as ArtMode[]) { const b = document.createElement('button'); b.textContent = m; b.style.cssText = 'margin:0 3px;padding:4px 10px'; b.onclick = () => { stage.setArt(m); write(); }; modes.append(b); }
  const note = document.createElement('div'); note.style.cssText = 'font-size:11px;margin-top:4px'; note.textContent = 'A=物体シェーダーのみ / B=後処理のみ / C=両方（採用）。下の文字を伝えると、そのまま反映できます。';
  el.append(modes, note, out); write();
  document.body.append(el);
}

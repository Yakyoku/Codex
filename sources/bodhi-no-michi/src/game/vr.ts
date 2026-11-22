// VR（WebXR immersive-vr・床基準）。一人称。後処理は使わず、物体シェーダーと空間に置いた絵だけで水彩に見せる。
import * as THREE from 'three';
import type { Stage } from '../engine/stage';
import type { Prologue } from './prologue';
import type { GameAudio } from './audio';
import type { InputState, Settings, Action } from './contracts';
import { PAPER } from '../engine/watercolor';

export interface VRRig { input(dt: number): InputState; update(dt: number): void }
const ACTIONS: Action[] = ['light', 'heavy', 'guard', 'dodge', 'breathe', 'pause', 'interact', 'touchEarth'];
const blank = (): Record<Action, boolean> => Object.fromEntries(ACTIONS.map(a => [a, false])) as Record<Action, boolean>;

export async function enterVR(stage: Stage, game: Prologue, _audio: GameAudio, settings: () => Settings, onEnd: () => void): Promise<VRRig> {
  const r = stage.renderer;
  r.xr.setReferenceSpaceType('local-floor');
  r.xr.setFoveation(1);
  const session = await navigator.xr!.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] });
  await r.xr.setSession(session);
  session.addEventListener('end', onEnd);
  // 体（リグ）：ここを動かして移動・旋回する。カメラは頭の動きだけ（勝手に動かさない）
  const rig = new THREE.Group(); stage.scene.add(rig); rig.add(stage.camera);
  const ctrl = [0, 1].map(i => { const c = r.xr.getController(i); rig.add(c); return c; });
  const grip = [0, 1].map(i => { const g = r.xr.getControllerGrip(i); rig.add(g); return g; });
  // 手もとの印：小さな紙色の珠（腕の位置がわかるように）
  for (const g of grip) g.add(new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: PAPER })));
  // 空間に浮かぶ和紙の板（心・体・印可・拍・字幕）
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const cx = cv.getContext('2d')!;
  const tex = new THREE.CanvasTexture(cv);
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false }));
  panel.renderOrder = 100; rig.add(panel);
  // 移動中に視野の周辺を暗くする筒（切替可）
  const vig = new THREE.Mesh(new THREE.RingGeometry(0.34, 2, 40), new THREE.MeshBasicMaterial({ color: 0x2b3350, transparent: true, opacity: 0, depthTest: false }));
  vig.position.z = -0.5; vig.renderOrder = 99; stage.camera.add(vig);

  const prev = { trig: [false, false], grip: [false, false], a: false, b: false, snap: false };
  const lastHand = [new THREE.Vector3(), new THREE.Vector3()], handV = [0, 0];
  const st: InputState = { moveX: 0, moveY: 0, lookX: 0, lookY: 0, held: blank(), pressed: blank(), usingTouch: false };
  const head = new THREE.Vector3(), hq = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), v2 = new THREE.Vector3();
  let yaw = Math.PI, subT = 0, subText = '', hudT = 0, moving = 0;
  // 字幕を板に写す
  const obs = new MutationObserver(() => { const el = document.querySelector('.bd-subtitle, [class*="subtitle"]') as HTMLElement | null; const t = el?.innerText?.trim() ?? ''; if (t) { subText = t; subT = 6; } });
  obs.observe(document.getElementById('ui')!, { childList: true, subtree: true, characterData: true });

  return {
    input(dt) {
      const s = settings();
      st.pressed = blank(); st.held = blank(); st.moveX = st.moveY = st.lookX = 0;
      let turn = 0;
      for (const src of session.inputSources) {
        const gp = src.gamepad; if (!gp) continue;
        const i = src.handedness === 'left' ? 0 : 1;
        const ax = gp.axes.length >= 4 ? [gp.axes[2], gp.axes[3]] : [gp.axes[0] ?? 0, gp.axes[1] ?? 0];
        const trig = (gp.buttons[0]?.value ?? 0) > 0.5, gr = (gp.buttons[1]?.value ?? 0) > 0.5;
        if (i === 0) { st.moveX = Math.abs(ax[0]) > 0.15 ? ax[0] : 0; st.moveY = Math.abs(ax[1]) > 0.15 ? -ax[1] : 0; }
        else {
          turn = Math.abs(ax[0]) > 0.3 ? ax[0] : 0;
          const a = !!gp.buttons[4]?.pressed, b = !!gp.buttons[5]?.pressed;
          if (a && !prev.a) st.pressed.dodge = true; if (b && !prev.b) st.pressed.interact = true;
          prev.a = a; prev.b = b;
        }
        // トリガーで攻め（右＝軽、左＝重）。実際に腕を振っても反応する
        if (trig && !prev.trig[i]) st.pressed[i === 1 ? 'light' : 'heavy'] = true;
        prev.trig[i] = trig;
        if (gr) st.held.guard = true;
        ctrl[i].getWorldPosition(v);
        const sp = v.distanceTo(lastHand[i]) / Math.max(dt, 0.001); lastHand[i].copy(v);
        if (sp > 3.2 && handV[i] <= 3.2 && i === 1) st.pressed.light = true;
        handV[i] = sp;
      }
      // 両手を胸の前で合わせる＝調息
      ctrl[0].getWorldPosition(v); ctrl[1].getWorldPosition(v2);
      stage.camera.getWorldPosition(head);
      if (v.distanceTo(v2) < 0.14 && v.y < head.y - 0.12 && v.y > head.y - 0.6) st.held.breathe = true;
      // 旋回：なめらか（標準）／30度ずつ
      if (s.vrSnapTurn) { if (Math.abs(turn) > 0.6 && !prev.snap) { yaw -= Math.sign(turn) * Math.PI / 6; prev.snap = true; } if (Math.abs(turn) < 0.3) prev.snap = false; }
      else yaw -= turn * dt * 1.9;
      moving = Math.hypot(st.moveX, st.moveY);
      return st;
    },
    update(dt) {
      const s = settings(), mk = game.monk;
      // 体を蓮の位置へ。頭の向きを移動の基準にする
      stage.camera.getWorldQuaternion(hq); e.setFromQuaternion(hq, 'YXZ');
      game.vrYaw = e.y + Math.PI;
      rig.rotation.y = yaw - Math.PI;
      const lift = (s.vrSeated ? 0.45 : 0) + s.vrHeightOffset;
      // 頭の水平位置が蓮の位置に来るよう、体をずらす
      v.copy(stage.camera.position).setY(0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rig.rotation.y);
      rig.position.set(mk.pos.x - v.x, mk.pos.y + lift, mk.pos.z - v.z);
      mk.root.visible = false; mk.shadow.visible = true;
      (vig.material as THREE.MeshBasicMaterial).opacity += ((s.vrVignette && moving > 0.2 ? 0.85 : 0) - (vig.material as THREE.MeshBasicMaterial).opacity) * Math.min(1, dt * 6);
      // 和紙の板：視線の少し下、体に固定
      panel.position.set(0, 1.05 + (s.vrSeated ? -0.3 : 0), -1.25).applyAxisAngle(new THREE.Vector3(0, 1, 0), e.y - rig.rotation.y);
      panel.position.add(v.copy(stage.camera.position).setY(0)); panel.rotation.set(-0.5, e.y - rig.rotation.y, 0, 'YXZ');
      hudT -= dt; subT -= dt;
      if (hudT <= 0) {
        hudT = 0.1; const h = game.hud();
        cx.clearRect(0, 0, 1024, 512);
        cx.fillStyle = 'rgba(244,239,228,0.88)'; cx.beginPath(); cx.ellipse(512, 256, 500, 240, 0, 0, 7); cx.fill();
        cx.fillStyle = '#2b3350'; cx.font = '600 44px "Shippori Mincho", serif'; cx.textAlign = 'left';
        const bar = (y: number, label: string, val: number, col: string) => { cx.fillStyle = '#2b3350'; cx.fillText(label, 120, y + 14); cx.fillStyle = '#2b335033'; cx.fillRect(200, y - 8, 420, 14); cx.fillStyle = col; cx.fillRect(200, y - 8, 420 * val, 14); };
        bar(130, '心', h.mind, '#3f4a66'); bar(190, '体', h.body, '#6f8f8a'); if (h.phase) bar(250, '印可', h.inka, '#b5432e');
        if (h.breathLabel) { cx.textAlign = 'center'; cx.font = '600 110px "Shippori Mincho", serif'; cx.fillStyle = h.breathLabel === '阿' ? '#b5432e' : '#3f4a66'; cx.fillText(h.breathLabel, 800, 220); cx.beginPath(); cx.lineWidth = 6; cx.strokeStyle = cx.fillStyle; cx.arc(800, 180, 70 + Math.sin(h.breath * Math.PI * 2) * 22, 0, 7); cx.stroke(); }
        cx.textAlign = 'center'; cx.fillStyle = '#2b3350'; cx.font = '36px "Shippori Mincho", serif';
        const line = subT > 0 ? subText : h.hint || h.phaseName;
        line.split('\n').slice(0, 3).forEach((l, i) => cx.fillText(l.slice(0, 26), 512, 340 + i * 46));
        tex.needsUpdate = true;
      }
    },
  };
}

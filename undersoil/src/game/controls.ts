// 移動（M2）：見回しはドラッグ／右スティック、移動は WASD／左スティック／タッチの仮想スティック。粒にはめり込まない。
// ・歩く（乾いた所）：足もとの粒へ引かれ（弱い重力）、きびきび止まる。上下の入力は、登る・下りる
// ・泳ぐ（水のある所）：全方向に進み、止めてもしばらく滑る（水の抵抗でゆっくり止まる）。少し速い
// ・道具：スキャン（E キー／ゲームパッド X）、糖のしずく（Q キー／ゲームパッド Y）。画面のボタンでも使える
import * as THREE from 'three/webgpu';
import type { Collider } from './world';

export interface FreeControls { update(dt: number): void; enabled: boolean; yaw: number; pitch: number; moving: boolean; /** その場所の水の量（0〜1）。0.45 以上で泳ぐ */ water: number; swimming: boolean; onAction?: (a: 'scan' | 'sugar') => void; }

export function pushOut(p: THREE.Vector3, colliders: Collider[], radius: number) {
  for (let it = 0; it < 2; it++) for (const c of colliders) {
    const dx = p.x - c.x, dy = p.y - c.y, dz = p.z - c.z, rr = c.r + radius, d2 = dx * dx + dy * dy + dz * dz;
    if (d2 < rr * rr && d2 > 1e-6) { const d = Math.sqrt(d2), k = (rr - d) / d; p.x += dx * k; p.y += dy * k; p.z += dz * k; }
  }
}

export function makeFreeControls(camera: THREE.Camera, dom: HTMLElement, colliders: Collider[], stick: HTMLElement | null): FreeControls {
  const keys = new Set<string>(); const vel = new THREE.Vector3(); const move = new THREE.Vector2();
  const c: FreeControls = { enabled: true, yaw: 0, pitch: 0, moving: false, water: 0, swimming: false, update };
  let swimK = 0; const padPrev = [false, false];
  const e = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ'); c.yaw = e.y; c.pitch = e.x;
  addEventListener('keydown', (ev) => { keys.add(ev.code); if (c.enabled && !ev.repeat) { if (ev.code === 'KeyE') c.onAction?.('scan'); if (ev.code === 'KeyQ') c.onAction?.('sugar'); } }); addEventListener('keyup', (ev) => keys.delete(ev.code)); addEventListener('blur', () => keys.clear());
  let lookId = -1, lx = 0, ly = 0, stickId = -1, sx = 0, sy = 0;
  dom.addEventListener('pointerdown', (ev) => {
    if (stick && ev.pointerType === 'touch' && ev.clientX < innerWidth * 0.4 && ev.clientY > innerHeight * 0.4) { stickId = ev.pointerId; sx = ev.clientX; sy = ev.clientY; stick.style.left = sx + 'px'; stick.style.top = sy + 'px'; stick.classList.add('on'); }
    else { lookId = ev.pointerId; lx = ev.clientX; ly = ev.clientY; }
    dom.setPointerCapture(ev.pointerId);
  });
  dom.addEventListener('pointermove', (ev) => {
    if (ev.pointerId === lookId) { const k = ev.pointerType === 'touch' ? 0.0045 : 0.003; c.yaw -= (ev.clientX - lx) * k; c.pitch = Math.max(-1.45, Math.min(1.45, c.pitch - (ev.clientY - ly) * k)); lx = ev.clientX; ly = ev.clientY; }
    if (ev.pointerId === stickId) { move.set((ev.clientX - sx) / 60, (ev.clientY - sy) / 60); if (move.length() > 1) move.normalize(); const knob = stick!.firstElementChild as HTMLElement; knob.style.transform = `translate(${move.x * 40}px, ${move.y * 40}px)`; }
  });
  const end = (ev: PointerEvent) => { if (ev.pointerId === lookId) lookId = -1; if (ev.pointerId === stickId) { stickId = -1; move.set(0, 0); stick!.classList.remove('on'); (stick!.firstElementChild as HTMLElement).style.transform = ''; } };
  dom.addEventListener('pointerup', end); dom.addEventListener('pointercancel', end);
  const fwd = new THREE.Vector3(), right = new THREE.Vector3(), want = new THREE.Vector3();
  function update(dt: number) {
    if (!c.enabled) return;
    let mx = move.x, mz = move.y, my = 0;
    if (keys.has('KeyW') || keys.has('ArrowUp')) mz -= 1; if (keys.has('KeyS') || keys.has('ArrowDown')) mz += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) mx -= 1; if (keys.has('KeyD') || keys.has('ArrowRight')) mx += 1;
    if (keys.has('Space')) my += 1; if (keys.has('KeyC') || keys.has('ShiftLeft')) my -= 1;
    const gp = navigator.getGamepads?.()[0];
    if (gp) { const dz = (v: number) => (Math.abs(v) < 0.15 ? 0 : v); mx += dz(gp.axes[0] ?? 0); mz += dz(gp.axes[1] ?? 0); c.yaw -= dz(gp.axes[2] ?? 0) * 2.2 * dt; c.pitch = Math.max(-1.45, Math.min(1.45, c.pitch - dz(gp.axes[3] ?? 0) * 1.6 * dt)); if (gp.buttons[0]?.pressed) my += 1; if (gp.buttons[1]?.pressed) my -= 1; }
    camera.quaternion.setFromEuler(e.set(c.pitch, c.yaw, 0, 'YXZ'));
    fwd.set(0, 0, -1).applyQuaternion(camera.quaternion); right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    want.set(0, 0, 0).addScaledVector(fwd, -mz).addScaledVector(right, mx); want.y += my; if (want.lengthSq() > 1) want.normalize();
    c.moving = want.lengthSq() > 0.01;
    if (gp) { const b = [!!gp.buttons[2]?.pressed, !!gp.buttons[3]?.pressed]; if (b[0] && !padPrev[0]) c.onAction?.('scan'); if (b[1] && !padPrev[1]) c.onAction?.('sugar'); padPrev[0] = b[0]; padPrev[1] = b[1];
      my += (gp.buttons[0]?.pressed ? 1 : 0) - (gp.buttons[1]?.pressed ? 1 : 0); want.y += (gp.buttons[0]?.pressed ? 1 : 0) - (gp.buttons[1]?.pressed ? 1 : 0); }
    // 歩く ⇄ 泳ぐ：水の量でなめらかに切り替える
    c.swimming = c.water > 0.45; swimK += ((c.swimming ? 1 : 0) - swimK) * (1 - Math.exp(-dt * 2.5));
    const speed = 4.6 + 2.4 * swimK;                                   // 歩き 46µm/秒、泳ぎ 70µm/秒
    const accel = c.moving ? 7 - 3.5 * swimK : 6 - 4.8 * swimK;        // 泳ぎは動き出しがゆるく、止めても滑る
    vel.lerp(want.multiplyScalar(speed), 1 - Math.exp(-dt * accel));
    camera.position.addScaledVector(vel, dt);
    camera.position.y -= (1 - swimK) * 1.6 * dt * (my > 0 ? 0 : 1);     // 歩きのときは、足もとの粒へ引かれる（登っている間は効かせない）
    pushOut(camera.position, colliders, 0.9);
  }
  return c;
}

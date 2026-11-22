// M1 用の簡易な移動（M2 で作り込む）：見回しはドラッグ、移動は WASD／左スティック／タッチの仮想スティック。粒にはめり込まない。
import * as THREE from 'three/webgpu';
import type { Collider } from './world';

export interface FreeControls { update(dt: number): void; enabled: boolean; yaw: number; pitch: number; moving: boolean; }

export function pushOut(p: THREE.Vector3, colliders: Collider[], radius: number) {
  for (let it = 0; it < 2; it++) for (const c of colliders) {
    const dx = p.x - c.x, dy = p.y - c.y, dz = p.z - c.z, rr = c.r + radius, d2 = dx * dx + dy * dy + dz * dz;
    if (d2 < rr * rr && d2 > 1e-6) { const d = Math.sqrt(d2), k = (rr - d) / d; p.x += dx * k; p.y += dy * k; p.z += dz * k; }
  }
}

export function makeFreeControls(camera: THREE.Camera, dom: HTMLElement, colliders: Collider[], stick: HTMLElement | null): FreeControls {
  const keys = new Set<string>(); const vel = new THREE.Vector3(); const move = new THREE.Vector2();
  const c: FreeControls = { enabled: true, yaw: 0, pitch: 0, moving: false, update };
  const e = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ'); c.yaw = e.y; c.pitch = e.x;
  addEventListener('keydown', (ev) => keys.add(ev.code)); addEventListener('keyup', (ev) => keys.delete(ev.code)); addEventListener('blur', () => keys.clear());
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
    // 穏やかな加速と減速
    vel.lerp(want.multiplyScalar(6.0), 1 - Math.exp(-dt * (c.moving ? 5 : 3.5)));
    camera.position.addScaledVector(vel, dt);
    pushOut(camera.position, colliders, 0.9);
  }
  return c;
}

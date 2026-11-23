// 入力の共通化：キーボード＋マウス、ゲームパッド、タッチ。（Quest のコントローラーは VR 側で扱う）
export type InputKind = 'kbm' | 'pad' | 'touch';
export class Input {
  moveX = 0; moveY = 0; lookDX = 0; lookDY = 0; fire = false; scan = false; dash = false; swimUp = false; swimDown = false;
  kind: InputKind = 'kbm'; locked = false; blocked = false;   // blocked：図鑑の3Dビューアなどで、画面の操作をゲームに渡さない
  onAction: (a: 'skip' | 'replay' | 'atlas' | 'pause' | 'view') => void = () => {};
  onKind: (k: InputKind) => void = () => {};
  private keys = new Set<string>(); private mouseFire = false; private mouseScan = false;
  private stick = { id: -1, ox: 0, oy: 0, x: 0, y: 0 }; private look = { id: -1, x: 0, y: 0 };
  touchFire = false; touchScan = false; touchUp = false; touchDown = false; private padPrev: boolean[] = [];
  sens = { mouse: 0.0022, pad: 2.2, touch: 0.005 };
  constructor(private el: HTMLElement) {
    addEventListener('keydown', (e) => {
      if (e.code === 'Space') e.preventDefault();
      if (e.repeat) return; this.setKind('kbm'); this.keys.add(e.code);
      if (e.code === 'KeyE') this.onAction('skip'); if (e.code === 'KeyR') this.onAction('replay');
      if (e.code === 'Tab') { e.preventDefault(); this.onAction('atlas'); }
      if (e.code === 'KeyV') this.onAction('view'); if (e.code === 'KeyP') this.onAction('pause');
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => { this.keys.clear(); this.mouseFire = this.mouseScan = false; });
    el.addEventListener('mousedown', (e) => {
      if (this.blocked) return;
      this.setKind('kbm');
      if (!this.locked) { el.requestPointerLock?.(); return; }
      if (e.button === 0) this.mouseFire = true; if (e.button === 2) this.mouseScan = true;
    });
    addEventListener('mouseup', (e) => { if (e.button === 0) this.mouseFire = false; if (e.button === 2) this.mouseScan = false; });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    addEventListener('mousemove', (e) => { if (this.locked) { this.lookDX += e.movementX * this.sens.mouse; this.lookDY += e.movementY * this.sens.mouse; } });
    document.addEventListener('pointerlockchange', () => {
      const was = this.locked; this.locked = document.pointerLockElement === el;
      if (was && !this.locked) { this.mouseFire = this.mouseScan = false; this.onAction('pause'); }   // Esc で解除されたら一時停止
    });
    // タッチ：画面の左半分が移動スティック、右半分のドラッグが視点
    el.addEventListener('touchstart', (e) => {
      this.setKind('touch'); e.preventDefault();
      for (const t of Array.from(e.changedTouches)) {
        if (t.clientX < innerWidth * 0.45 && this.stick.id < 0) this.stick = { id: t.identifier, ox: t.clientX, oy: t.clientY, x: 0, y: 0 };
        else if (this.look.id < 0) this.look = { id: t.identifier, x: t.clientX, y: t.clientY };
      }
      this.onStick?.(this.stick.id >= 0, this.stick.ox, this.stick.oy, 0, 0);
    }, { passive: false });
    el.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === this.stick.id) {
          const R = 56; let dx = (t.clientX - this.stick.ox) / R, dy = (t.clientY - this.stick.oy) / R; const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
          this.stick.x = dx; this.stick.y = dy; this.onStick?.(true, this.stick.ox, this.stick.oy, dx * R, dy * R);
        } else if (t.identifier === this.look.id) {
          this.lookDX += (t.clientX - this.look.x) * this.sens.touch; this.lookDY += (t.clientY - this.look.y) * this.sens.touch; this.look.x = t.clientX; this.look.y = t.clientY;
        }
      }
    }, { passive: false });
    const end = (e: TouchEvent) => {
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === this.stick.id) { this.stick.id = -1; this.stick.x = this.stick.y = 0; this.onStick?.(false, 0, 0, 0, 0); }
        if (t.identifier === this.look.id) this.look.id = -1;
      }
    };
    el.addEventListener('touchend', end); el.addEventListener('touchcancel', end);
  }
  onStick?: (on: boolean, ox: number, oy: number, dx: number, dy: number) => void;
  private setKind(k: InputKind) { if (this.kind !== k) { this.kind = k; this.onKind(k); } }
  /** 毎フレーム呼ぶ。move/look/fire/scan をまとめる。look は読んだら消える */
  poll(dt: number) {
    const k = this.keys; let mx = 0, my = 0;
    if (k.has('KeyW') || k.has('ArrowUp')) my += 1; if (k.has('KeyS') || k.has('ArrowDown')) my -= 1;
    if (k.has('KeyD') || k.has('ArrowRight')) mx += 1; if (k.has('KeyA') || k.has('ArrowLeft')) mx -= 1;
    let fire = this.mouseFire || k.has('KeyF'), scan = this.mouseScan || k.has('KeyQ'), dash = k.has('ShiftLeft');
    let up = k.has('Space') || this.touchUp, down = k.has('KeyC') || k.has('ControlLeft') || this.touchDown;
    if (this.stick.id >= 0) { mx += this.stick.x; my -= this.stick.y; }
    fire ||= this.touchFire; scan ||= this.touchScan;
    const pad = Array.from(navigator.getGamepads?.() ?? []).find((p) => p && p.connected);
    if (pad) {
      const dz = (v: number) => (Math.abs(v) < 0.15 ? 0 : (v - Math.sign(v) * 0.15) / 0.85);
      const ax = dz(pad.axes[0] ?? 0), ay = dz(pad.axes[1] ?? 0), rx = dz(pad.axes[2] ?? 0), ry = dz(pad.axes[3] ?? 0);
      const b = (i: number) => !!pad.buttons[i]?.pressed || (pad.buttons[i]?.value ?? 0) > 0.4;
      if (ax || ay || rx || ry || pad.buttons.some((x) => x.pressed)) this.setKind('pad');
      mx += ax; my -= ay; this.lookDX += rx * this.sens.pad * dt; this.lookDY += ry * this.sens.pad * dt;
      fire ||= b(7) || b(5); scan ||= b(6) || b(2); dash ||= b(10); up ||= b(0); down ||= b(1);
      const edge = (i: number, a: Parameters<Input['onAction']>[0]) => { const p = b(i); if (p && !this.padPrev[i]) this.onAction(a); this.padPrev[i] = p; };
      edge(3, 'skip'); edge(8, 'atlas'); edge(9, 'pause'); edge(11, 'view');
    }
    const l = Math.hypot(mx, my); if (l > 1) { mx /= l; my /= l; }
    this.moveX = mx; this.moveY = my; this.fire = fire; this.scan = scan; this.dash = dash; this.swimUp = up; this.swimDown = down;
    const out = { dx: this.lookDX, dy: this.lookDY }; this.lookDX = this.lookDY = 0; return out;
  }
}

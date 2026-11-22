// 序章「山門」― 金剛力士の試練。学び：呼吸（阿吽）。
// 阿（開く）で攻め、吽（閉じる）で受ける。連打ではなく、観て・息を合わせて・一手を選ぶ。
import * as THREE from 'three';
import type { Stage } from '../engine/stage';
import { G, blotMaterial } from '../engine/watercolor';
import { Humanoid, type Pose } from '../engine/humanoid';
import { buildPrologue, groundY, pathX, COURT_R, GATE_Z, STEP_Z0, STEP_Z1, type PrologueScene } from '../scenes/prologue';
import { createMonk, createNio, MONK_IDLE, NIO_A_STAND, NIO_UN_STAND, NIO_SCALE, type NioKind } from './actors';
import type { GameAudio } from './audio';
import type { InputState, UI, HudState, Difficulty, Vec3 } from './contracts';

type Nio = Humanoid & { kind: NioKind; vajra?: THREE.Mesh };
type Monk = Humanoid & { staff: THREE.Mesh };
type PState = 'free' | 'light' | 'heavy' | 'guard' | 'dodge' | 'breathe' | 'hurt' | 'sit' | 'pray';
type DState = 'rest' | 'approach' | 'windup' | 'strike' | 'recover' | 'receive' | 'calm';
type Mode = 'explore' | 'cutscene' | 'trial' | 'done';

interface Deity {
  h: Nio; st: DState; t: number; active: boolean; home: THREE.Vector3; homeYaw: number;
  move: 'smash' | 'palm' | 'stomp'; impactIn: number; struck: boolean; ring: THREE.Mesh; ringMat: THREE.ShaderMaterial; lastCycle: number;
}

const DIFF: Record<Difficulty, { dmg: number; perfect: number; inka: number }> = {
  story: { dmg: 0.5, perfect: 0.34, inka: 1.5 }, standard: { dmg: 1, perfect: 0.24, inka: 1 }, ascetic: { dmg: 1.5, perfect: 0.15, inka: 0.8 },
};
const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _e = new THREE.Euler();
const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));
const angDiff = (a: number, b: number) => { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; };
const sm = (t: number) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };

// ── 蓮の姿勢 ──
const P_RUN = (ph: number): Pose => ({ chest: [0.16, Math.sin(ph) * 0.12, 0], head: [-0.08, 0, 0], armL: [Math.sin(ph) * 0.5, 0, -1.25], foreL: [0, -0.5, 0], armR: [0.1, 0.3, 1.05], foreR: [0, 1.2, 0] });
const P_GUARD: Pose = { chest: [0.12, 0, 0], spine: [0.08, 0, 0], head: [-0.05, 0, 0], armL: [0, -0.9, -0.75], foreL: [0, -0.9, 0], armR: [0, 0.9, 0.75], foreR: [0, 0.9, 0] };
const P_BREATHE: Pose = { chest: [0.05, 0, 0], head: [0.18, 0, 0], armL: [0, -0.75, -1.05], foreL: [0, -1.7, 0], handL: [0, 0, 0.5], armR: [0.1, 0.3, 1.05], foreR: [0, 1.25, 0] };
const P_PRAY: Pose = { chest: [0.2, 0, 0], head: [0.3, 0, 0], armL: [0, -0.75, -1.05], foreL: [0, -1.75, 0], handL: [0, 0, 0.5], armR: [0, 0.75, 1.05], foreR: [0, 1.75, 0], handR: [0, 0, -0.5] };
const P_HURT: Pose = { chest: [-0.3, 0.2, 0], spine: [-0.15, 0, 0], head: [-0.2, 0, 0], armL: [0, 0.2, -0.8], armR: [0, -0.2, 0.8] };
const P_SIT: Pose = { chest: [0.3, 0, 0], spine: [0.2, 0, 0], head: [0.35, 0, 0], armL: [0.2, -0.3, -1.2], foreL: [0, -0.8, 0], armR: [0.2, 0.3, 1.2], foreR: [0, 0.8, 0] };
const atkPose = (t: number, heavy: boolean): Pose => {
  // 振りかぶり → 一振り → 残心
  const w = heavy ? sm(t / 0.5) : sm(t / 0.16), s = heavy ? sm((t - 0.5) / 0.14) : sm((t - 0.16) / 0.1);
  const tw = -0.7 * w + 1.3 * s, up = heavy ? 1 : 0.6;
  return { spine: [0.1 * s, tw * 0.4, 0], chest: [0.12 * s - 0.1 * w * up, tw * 0.6, 0], head: [0, -tw * 0.5, 0],
    armR: [-0.4 * w * up + 0.5 * s, 0.9 * s + 0.2, 1.05 - 1.5 * w * up + 0.9 * s], foreR: [0, 1.3 - 0.9 * s, 0],
    armL: [0.2, -0.5 - 0.3 * s, -1.0 + 0.5 * w * up - 0.2 * s], foreL: [0, -1.0, 0] };
};
// ── 金剛力士の姿勢 ──
const N_CALM: Pose = { armL: [0.1, 0, -1.15], foreL: [0, -0.3, 0], armR: [0.1, 0, 1.15], foreR: [0, 0.3, 0], head: [0.2, 0, 0], chest: [0.05, 0, 0] };
const N_RECEIVE_A: Pose = { chest: [0.05, -0.3, 0], armR: [0, 1.1, 0.3], foreR: [0, 1.2, 0], armL: [0.2, -0.2, -0.9], foreL: [0, -0.9, 0], head: [0.15, 0, 0] };
const N_RECEIVE_U: Pose = { chest: [0.05, 0.3, 0], armL: [0, -1.1, -0.3], foreL: [0, -1.2, 0], handL: [0, 0, 0.6], armR: [0.3, 0.3, 0.95], foreR: [0, 0.7, 0], head: [0.15, 0, 0] };
const N_SMASH = (w: number, s: number): Pose => ({ hips: [0, 0.2 - 0.5 * s, 0], spine: [-0.15 * w + 0.35 * s, -0.25 * w + 0.3 * s, 0], chest: [-0.25 * w + 0.4 * s, -0.4 * w + 0.5 * s, 0], head: [0.25, 0.2 - 0.2 * s, 0],
  armR: [-0.9 * w + 0.5 * s, 0.3 + 0.9 * s, -0.75 * w + 0.5 * s], foreR: [0, 0.2 + 0.3 * s, -1.5 + 1.3 * s], armL: [0.3, -0.6 + 0.5 * s, -0.7 - 0.3 * s], foreL: [0, -0.8, 0], handL: [0, 0, 0.5] });
const N_PALM = (w: number, s: number): Pose => ({ hips: [0, -0.5 * w + 0.6 * s, 0], spine: [0.1 * s, -0.3 * w + 0.3 * s, 0], chest: [0.15 * s, -0.4 * w + 0.5 * s, 0], head: [0.2, 0.5 * w - 0.4 * s, 0],
  armL: [0, 0.6 * w - 1.5 * s, -1.0 * w - 0.05 * s], foreL: [0, -1.6 * w + 1.5 * s, 0], handL: [0, 0, 1.2], armR: [0.3, 0.5, 1.0], foreR: [0, 1.0, 0] });
const N_STOMP = (w: number, s: number): Pose => ({ spine: [-0.2 * w + 0.4 * s, 0, 0], chest: [-0.3 * w + 0.45 * s, 0, 0], head: [0.3, 0, 0],
  armL: [0, -0.2, 0.9 * w - 1.6 * s], foreL: [0, 0, 1.2 * w - 0.9 * s], armR: [0, 0.2, -0.9 * w + 1.6 * s], foreR: [0, 0, -1.2 * w + 0.9 * s] });

export interface PrologueHooks { onCheckpoint(id: string): void; onZukan(id: string): Promise<void>; onInka(): Promise<void>; onDone(): void; difficulty(): Difficulty; vr(): boolean }

export class Prologue {
  scene!: PrologueScene; monk!: Monk; nio: Deity[] = [];
  mode: Mode = 'explore'; phase = 0;
  // 蓮
  ps: PState = 'free'; pt = 0; mind = 1; body = 1; inka = 0; lastAtkEnd = -9; hitDone = false; runPh = 0;
  staffEuler = new THREE.Euler(0, 0, 0); staffQ = new THREE.Quaternion();
  camYaw = 0; camPitch = 0.22; camPos = new THREE.Vector3(); camLook = new THREE.Vector3(); camInit = false; camOff = 0;
  cine: { from: THREE.Vector3; to: THREE.Vector3; lf: THREE.Vector3; lt: THREE.Vector3; t: number; dur: number } | null = null;
  time = 0; cycleT = 2.2; beatPhase = 0; cycleN = 0; lastPhase = 0;
  checkpointDone = false; hintT = 0; hint = ''; guardPressT = -9; breathHold = 0; busy = false; photo = false;
  flash: THREE.Mesh; flashMat: THREE.ShaderMaterial; flashT = 9;
  bot = false; private botAtk = 0;
  /** VR：頭の向き（移動の基準）と外部入力 */
  vrYaw: number | null = null;
  stats = { perfect: 0, guard: 0, hits: 0, hurt: 0, sat: 0 };

  constructor(private stage: Stage, private ui: UI, private audio: GameAudio, private hooks: PrologueHooks) {
    this.flashMat = blotMaterial({ color: 0xfffaf0, opacity: 0, soft: 0.7, edge: 0.6, billboard: true, white: 0.7 });
    this.flash = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.flashMat); this.flash.renderOrder = 20; this.flash.frustumCulled = false;
  }

  async load(progress: (p: number, label: string) => void): Promise<void> {
    progress(0.1, '紙を湿らせています');
    this.scene = await buildPrologue();
    progress(0.45, '人の形を起こしています');
    this.monk = await createMonk();
    progress(0.65, '金剛力士を彫っています');
    const [a, u] = await Promise.all([createNio('a'), createNio('un')]);
    const root = this.stage.scene; root.add(this.scene.group, this.flash);
    this.monk.groundY = groundY; root.add(this.monk.root, this.monk.shadow);
    this.monk.onStep = () => this.audio.sfx('step', { pos: this.p3(this.monk.pos), surface: this.monk.pos.z > STEP_Z0 || Math.hypot(this.monk.pos.x, this.monk.pos.z) < COURT_R ? 'stone' : 'earth', gain: 0.6 });
    [a, u].forEach((h, i) => {
      h.groundY = groundY; root.add(h.root, h.shadow);
      const ringMat = blotMaterial({ color: 0x3f4a66, opacity: 0, soft: 0.25, edge: 0.9 });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.86, 1, 48).rotateX(-Math.PI / 2), ringMat); ring.renderOrder = 3; ring.visible = false; root.add(ring);
      const home = this.scene.nioHome[i];
      const d: Deity = { h, st: 'rest', t: 0, active: false, home, homeYaw: i === 0 ? -0.3 : 0.3, move: 'smash', impactIn: 0, struck: false, ring, ringMat, lastCycle: -1 };
      h.place(home.x, home.z, d.homeYaw); h.target = i === 0 ? NIO_A_STAND : NIO_UN_STAND; h.rate = 5;
      h.onStep = () => { if (d.st === 'approach') this.audio.sfx('stomp', { pos: this.p3(h.pos), gain: 0.35 }); };
      this.nio.push(d);
    });
    this.monk.place(0.9, 6.5, Math.PI); this.monk.target = MONK_IDLE;
    progress(1, '筆を執ります');
  }

  private p3(v: THREE.Vector3): Vec3 { return [v.x, v.y + 1, v.z]; }

  start(from: 'begin' | 'jizo' | 'court'): void {
    this.mode = 'explore'; this.phase = 0; this.mind = 1; this.body = 1; this.inka = 0; this.ps = 'free'; this.camInit = false;
    if (from === 'begin') { this.monk.place(pathX(STEP_Z1 - 3), STEP_Z1 - 3, Math.PI); this.camYaw = 0; }
    else if (from === 'jizo') { const z = this.scene.jizoPos.z - 1; this.monk.place(pathX(z), z, Math.PI); this.checkpointDone = true; }
    else { this.monk.place(0, COURT_R - 0.5, Math.PI); this.checkpointDone = true; }
    this.camYaw = 0; this.camPitch = 0.16;
    this.audio.playChapter('prologue'); this.audio.setPhase(0);
    this.setHint(from === 'begin' ? '石段を上り、山門へ' : '');
  }
  private setHint(h: string, sec = 7): void { this.hint = h; this.hintT = sec; }

  // ───────── 毎フレーム ─────────
  update(dt: number, inp: InputState): void {
    this.time += dt;
    G.uTime.value = this.time;
    // 拍（阿吽の息）：音楽に合わせる
    const b = this.audio.getBeat();
    if (b.bpm > 0 && this.mode === 'trial') { this.cycleT = 120 / b.bpm; this.beatPhase = b.phase; }
    else { this.cycleT = 2.2; this.beatPhase = (this.beatPhase + dt / this.cycleT) % 1; }
    if (this.beatPhase < this.lastPhase - 0.5) this.cycleN++;
    this.lastPhase = this.beatPhase;

    if (this.bot) inp = this.botInput(inp);
    if (this.mode === 'explore') this.updateExplore(dt, inp);
    if (this.mode !== 'cutscene' || this.ps === 'pray') this.updatePlayer(dt, inp);
    else { this.monk.vel.set(0, 0, 0); this.monk.target = this.ps === 'sit' ? P_SIT : MONK_IDLE; }
    if (this.mode === 'trial') this.updateTrial(dt);
    for (const d of this.nio) this.updateDeity(d, dt);
    this.monk.update(dt);
    this.updateStaff(dt);
    for (const d of this.nio) d.h.update(dt);
    this.scene.update(dt, this.time, this.stage.camera);
    // 心の澄み具合 → 絵と音
    G.uClarity.value = damp(G.uClarity.value, 0.25 + this.mind * 0.75, 3, dt);
    this.audio.setMind(this.mind);
    // 主役の強調：蓮と尊格のあいだ
    const foc = this.focusPoint(_v);
    (G.uFocus.value as THREE.Vector4).set(foc.x, foc.y, foc.z, this.mode === 'explore' ? 9 : 12);
    // 受けの閃き（紙の白の染み）
    this.flashT += dt; this.flashMat.uniforms.uOpacity.value = Math.max(0, 0.9 - this.flashT * 3.2);
    this.flash.scale.setScalar(0.5 + this.flashT * 4);
    if (!this.hooks.vr()) this.updateCamera(dt, inp);
    this.hintT -= dt;
  }

  /** 題字や静止構図のとき：人物と背景だけを生かしておく */
  idle(dt: number): void {
    G.uTime.value += dt; this.time = G.uTime.value;
    this.monk.target = MONK_IDLE; this.staffEuler.set(0.06, 0, 0);
    this.monk.update(dt); this.updateStaff(dt);
    for (const d of this.nio) d.h.update(dt);
    this.scene.update(dt, this.time, this.stage.camera);
  }

  private focusPoint(out: THREE.Vector3): THREE.Vector3 {
    const act = this.nio.filter(d => d.active);
    if (!act.length) return out.copy(this.monk.pos).setY(this.monk.pos.y + 1.2);
    out.set(0, 0, 0); for (const d of act) out.add(d.h.pos); out.multiplyScalar(1 / act.length);
    return out.lerp(this.monk.pos, 0.45).setY(2.4);
  }

  private nearestActive(): Deity | null {
    let best: Deity | null = null, bd = 1e9;
    for (const d of this.nio) { if (!d.active) continue; const dist = d.h.pos.distanceTo(this.monk.pos); if (dist < bd) { bd = dist; best = d; } }
    return best;
  }

  // ───────── 探索 ─────────
  private updateExplore(_dt: number, inp: InputState): void {
    const m = this.monk.pos;
    const dj = Math.hypot(m.x - this.scene.jizoPos.x, m.z - this.scene.jizoPos.z);
    this.nearJizo = dj < 3.4 && !this.busy;
    if (this.nearJizo && !this.checkpointDone && this.hintT <= 0) this.setHint('お地蔵さまに手を合わせる', 0.5);
    if (this.nearJizo && inp.pressed.interact && this.ps === 'free') void this.prayAtJizo();
    if (Math.hypot(m.x, m.z) < COURT_R - 2.5 && !this.busy) void this.introCutscene();
  }
  nearJizo = false;

  private async prayAtJizo(): Promise<void> {
    this.busy = true; this.ps = 'pray'; this.pt = 0;
    this.monk.yaw = Math.atan2(this.scene.jizoPos.x - this.monk.pos.x, this.scene.jizoPos.z - this.monk.pos.z);
    this.audio.sfx('rin', { pos: this.p3(this.scene.jizoPos) });
    await this.wait(1.6);
    const first = !this.checkpointDone; this.checkpointDone = true;
    this.hooks.onCheckpoint('jizo'); this.mind = 1; this.body = 1;
    if (first) { await this.hooks.onZukan('jizo'); await this.ui.subtitle('息を、ゆっくり吐く。それだけで、心は澄んでいく。', '地蔵菩薩', 4200); this.setHint('調息：その場で長押し（息）― 心と体が整う', 9); }
    this.ui.toast('ここまでの歩みを記しました');
    this.ps = 'free'; this.busy = false;
  }

  private wait(sec: number): Promise<void> { const end = this.time + sec; return new Promise(res => { const tick = () => (this.time >= end ? res() : requestAnimationFrame(tick)); tick(); }); }

  private cineTo(from: [number, number, number], to: [number, number, number], lf: [number, number, number], lt: [number, number, number], dur: number): Promise<void> {
    this.cine = { from: new THREE.Vector3(...from), to: new THREE.Vector3(...to), lf: new THREE.Vector3(...lf), lt: new THREE.Vector3(...lt), t: 0, dur };
    return this.wait(dur);
  }

  private async introCutscene(): Promise<void> {
    this.busy = true; this.mode = 'cutscene'; this.setHint('');
    this.audio.sfx('bell');
    // 見せ場の構図：山門と二尊を見上げる
    await this.cineTo([3.2, 1.7, 13.5], [1.6, 2.0, 9.5], [0.5, 5.2, -9], [0.3, 5.0, -10], 5.5);
    await this.hooks.onZukan('kongorikishi');
    this.audio.sfx('voiceA', { pos: this.p3(this.nio[0].h.pos) });
    void this.cineTo([-1.5, 2.4, 2.5], [-0.5, 2.6, 1.5], [6.0, 7.5, -11.6], [6.1, 8.2, -11.6], 9);
    await this.ui.subtitle('来たか、修行の者。', '阿形', 3000);
    await this.ui.subtitle('力を比べるのではない。息を見よ。<br>阿（あ）で開き、吽（うん）で閉じる。', '阿形', 5200);
    this.cine = null;
    await this.beginPhase(1);
    this.busy = false;
  }

  private async beginPhase(n: number): Promise<void> {
    this.phase = n; this.mode = 'trial'; this.inka = 0;
    this.audio.setPhase(n); this.scene.setPhaseLook(n);
    const [a, u] = this.nio;
    a.active = n === 1 || n === 3; u.active = n === 2 || n === 3;
    for (const d of this.nio) { d.st = d.active ? 'approach' : 'rest'; d.t = 0; d.lastCycle = this.cycleN + 1; }
    const names = ['', '第一段　阿 ― 開く', '第二段　吽 ― 閉じる', '第三段　阿吽 ― ひとつの息'];
    this.phaseName = names[n];
    if (n === 1) this.setHint('阿の拍で攻め（攻）、吽の拍で受ける（受）。焦って連打すると心が濁る', 12);
    if (n === 2) this.setHint('打たれる瞬間に受けると、澄んだ音がする ― 印可が進む', 12);
    if (n === 3) this.setHint('二尊の息はひとつ。乱れたら間合いを取り、調息（息）を', 12);
  }
  phaseName = '';

  // ───────── 蓮 ─────────
  private updatePlayer(dt: number, inp: InputState): void {
    const mk = this.monk, tgt = this.mode === 'trial' ? this.nearestActive() : null;
    this.pt += dt;
    const baseYaw = this.vrYaw ?? this.camYaw;
    // 入力 → 移動方向（カメラ基準）
    let mx = inp.moveX, my = inp.moveY; const ml = Math.hypot(mx, my); if (ml > 1) { mx /= ml; my /= ml; }
    const fwdX = -Math.sin(baseYaw), fwdZ = -Math.cos(baseYaw);
    let wx = fwdX * my + -fwdZ * mx, wz = fwdZ * my + fwdX * mx;
    if (this.botDir) { wx = this.botDir.x; wz = this.botDir.z; }
    const wl = Math.hypot(wx, wz);
    let speed = 0;
    const face = (yaw: number, k: number) => { mk.yaw += angDiff(mk.yaw, yaw) * (1 - Math.exp(-k * dt)); };
    const faceTgt = () => { if (tgt) face(Math.atan2(tgt.h.pos.x - mk.pos.x, tgt.h.pos.z - mk.pos.z), 14); };
    const can = this.ps === 'free' || this.ps === 'guard' || this.ps === 'breathe';

    if (can) {
      if (inp.pressed.light || inp.pressed.heavy) {
        const heavy = inp.pressed.heavy;
        // 焦り：間を置かずに打ち続けると心が乱れる
        if (this.time - this.lastAtkEnd < 0.45) this.mind = Math.max(0, this.mind - (heavy ? 0.12 : 0.085));
        this.ps = heavy ? 'heavy' : 'light'; this.pt = 0; this.hitDone = false;
        this.audio.sfx(heavy ? 'swingHeavy' : 'swingLight', { pos: this.p3(mk.pos) });
        mk.kick(Math.sin(mk.yaw) * 1.5, 0.3, Math.cos(mk.yaw) * 1.5);
      } else if (inp.pressed.dodge) {
        this.ps = 'dodge'; this.pt = 0; this.audio.sfx('dodge', { pos: this.p3(mk.pos) });
        const dx = wl > 0.2 ? wx / wl : -Math.sin(mk.yaw), dz = wl > 0.2 ? wz / wl : -Math.cos(mk.yaw);
        this.dodgeDir.set(dx, 0, dz);
      } else if (inp.held.guard) {
        if (this.ps !== 'guard') { this.ps = 'guard'; this.guardPressT = this.time; }
      } else if (inp.held.breathe && wl < 0.2) {
        if (this.ps !== 'breathe') { this.ps = 'breathe'; this.pt = 0; this.audio.sfx('breathIn', { gain: 0.7 }); this.breathHold = 0; }
      } else this.ps = 'free';
    }
    switch (this.ps) {
      case 'free': {
        speed = wl > 0.12 ? 4.4 * Math.min(1, wl) : 0;
        if (speed > 0) face(Math.atan2(wx, wz), 10); else if (tgt && this.mode === 'trial') face(Math.atan2(tgt.h.pos.x - mk.pos.x, tgt.h.pos.z - mk.pos.z), 3);
        this.runPh += dt * speed * 2.3;
        mk.target = speed > 0.3 ? P_RUN(this.runPh) : MONK_IDLE; mk.hipDrop = 0; mk.rate = 12;
        this.staffEuler.set(speed > 0.3 ? 0.25 : 0.06, 0, 0);
        // 静かに立てば、心はゆっくり澄む
        this.mind = Math.min(1, this.mind + dt * (speed > 0 ? 0.02 : 0.045));
        break;
      }
      case 'guard': {
        speed = wl > 0.12 ? 1.6 : 0; faceTgt();
        mk.target = P_GUARD; mk.hipDrop = 0.06; mk.rate = 22; this.staffEuler.set(0.15, 0, Math.PI / 2 - 0.12);
        break;
      }
      case 'breathe': {
        this.breathHold += dt;
        const cyc = (this.breathHold % 3.2) / 3.2;
        if (cyc < dt / 3.2 && this.breathHold > 1) this.audio.sfx('breathIn', { gain: 0.6 });
        if (Math.abs(cyc - 0.5) < dt / 6.4) this.audio.sfx('breathOut', { gain: 0.6 });
        mk.target = { ...P_BREATHE, chest: [0.05 - Math.sin(cyc * Math.PI * 2) * 0.05, 0, 0] }; mk.hipDrop = 0.02; mk.rate = 5;
        this.staffEuler.set(0, 0, 0);
        const k = 1 + (this.virtue ? 0.5 : 0);
        this.mind = Math.min(1, this.mind + dt * 0.3 * k); this.body = Math.min(1, this.body + dt * 0.07 * k);
        break;
      }
      case 'light': case 'heavy': {
        const heavy = this.ps === 'heavy', dur = heavy ? 1.05 : 0.52, hitAt = heavy ? 0.58 : 0.22;
        faceTgt(); mk.target = atkPose(this.pt, heavy); mk.rate = 26; mk.hipDrop = 0.05;
        const w = heavy ? sm(this.pt / 0.5) : sm(this.pt / 0.16), s = heavy ? sm((this.pt - 0.5) / 0.14) : sm((this.pt - 0.16) / 0.1);
        this.staffEuler.set(-0.9 * w * (heavy ? 1.3 : 0.8) + 2.2 * s, 0, -0.5 * w + 0.5 * s);
        if (this.pt < hitAt) speed = 0; if (this.pt > hitAt - 0.1 && this.pt < hitAt + 0.05) { speed = 3; wx = Math.sin(mk.yaw); wz = Math.cos(mk.yaw); }
        if (!this.hitDone && this.pt >= hitAt) { this.hitDone = true; this.tryHit(heavy); }
        if (this.pt >= dur) { this.ps = 'free'; this.lastAtkEnd = this.time; }
        break;
      }
      case 'dodge': {
        const k = 1 - sm(this.pt / 0.42); speed = 9 * k; wx = this.dodgeDir.x; wz = this.dodgeDir.z;
        mk.target = { chest: [0.45, 0, 0], spine: [0.25, 0, 0], armL: [0.6, 0, -1.2], armR: [0.6, 0.2, 1.1], foreR: [0, 1.0, 0] }; mk.hipDrop = 0.22; mk.rate = 20;
        this.staffEuler.set(0.9, 0, 0);
        if (this.pt > 0.45) this.ps = 'free';
        break;
      }
      case 'hurt': {
        const k = 1 - sm(this.pt / 0.5); speed = 5 * k; wx = this.dodgeDir.x; wz = this.dodgeDir.z;
        mk.target = P_HURT; mk.rate = 18; mk.hipDrop = 0.12; this.staffEuler.set(0.5, 0, 0.3);
        if (this.pt > 0.62) this.ps = 'free';
        break;
      }
      case 'sit': mk.target = P_SIT; mk.hipDrop = 0.5; mk.rate = 4; this.staffEuler.set(0.2, 0, 0.2); break;
      case 'pray': mk.target = P_PRAY; mk.hipDrop = 0.04; mk.rate = 5; this.staffEuler.set(0.05, 0, 0); break;
    }
    // 移動と場の境界
    const l = Math.hypot(wx, wz) || 1;
    const vx = (wx / l) * speed, vz = (wz / l) * speed;
    mk.vel.set(damp(mk.vel.x, vx, 14, dt), 0, damp(mk.vel.z, vz, 14, dt));
    let nx = mk.pos.x + mk.vel.x * dt, nz = mk.pos.z + mk.vel.z * dt;
    if (this.mode === 'trial' || (nz < STEP_Z0 && this.mode !== 'explore')) { const r = Math.hypot(nx, nz), R = COURT_R - 0.8; if (r > R) { nx *= R / r; nz *= R / r; } }
    else if (nz > STEP_Z0 - 1) { const px = pathX(nz); nx = Math.min(px + 2.1, Math.max(px - 2.1, nx)); nz = Math.min(STEP_Z1 - 1.5, nz); }
    else { const r = Math.hypot(nx, nz), R = COURT_R - 0.6; if (r > R && !(nz > 0 && Math.abs(nx) < 2.2)) { nx *= R / r; nz *= R / r; } }
    nz = Math.max(GATE_Z + 8.2, nz);
    for (const d of this.nio) { const dx = nx - d.h.pos.x, dz = nz - d.h.pos.z, dd = Math.hypot(dx, dz), R = 1.9; if (dd < R && dd > 0.001) { nx = d.h.pos.x + (dx / dd) * R; nz = d.h.pos.z + (dz / dd) * R; } }
    mk.pos.x = nx; mk.pos.z = nz;
  }
  private dodgeDir = new THREE.Vector3(); private botDir: THREE.Vector3 | null = null;
  virtue = false;

  private updateStaff(dt: number): void {
    // 錫杖の向きは体（根）の空間で決め、手は位置だけを運ぶ
    const mk = this.monk, hand = mk.rig.b('handR');
    this.staffQ.slerp(_q.setFromEuler(this.staffEuler), 1 - Math.exp(-(this.ps === 'light' || this.ps === 'heavy' ? 30 : 10) * dt));
    hand.getWorldQuaternion(_q).invert();
    mk.root.getWorldQuaternion(_q2);
    mk.staff.quaternion.copy(_q).multiply(_q2).multiply(this.staffQ);
    mk.staff.position.set(0, 0, 0);
    // 握る位置を杖の中ほどへ（杖のローカル +y が先端）
    _v.set(0, this.ps === 'guard' ? 0.1 : 0.25, 0).applyQuaternion(mk.staff.quaternion); mk.staff.position.copy(_v);
  }

  /** 蓮の一手が届いたか。尊格は傷つかず、金剛杵や腕で受け止める（印可が進む） */
  private tryHit(heavy: boolean): void {
    const mk = this.monk, d = this.nearestActive(); if (!d) return;
    const dx = d.h.pos.x - mk.pos.x, dz = d.h.pos.z - mk.pos.z, dist = Math.hypot(dx, dz);
    if (dist > 3.9 || Math.abs(angDiff(mk.yaw, Math.atan2(dx, dz))) > 1.2) return;
    const inA = this.beatPhase < 0.5;
    const df = DIFF[this.hooks.difficulty()];
    let gain = (heavy ? 0.1 : 0.045) * (0.35 + 0.65 * this.mind) * (inA ? 1.7 : 0.6) * df.inka;
    if (d.st === 'windup' || d.st === 'strike') gain *= 0.4; // 構えの最中は通らない
    if (this.phase === 2) gain *= 0.6;
    this.inka = Math.min(1, this.inka + gain); this.stats.hits++;
    _v.copy(d.h.pos).lerp(mk.pos, 0.35).setY(mk.pos.y + 1.7);
    this.audio.sfx('hit', { pos: [_v.x, _v.y, _v.z], gain: inA ? 1 : 0.6, pitch: inA ? 1 : 0.85 });
    this.flash.position.copy(_v); this.flashT = inA ? 0 : 0.12;
    if (d.st === 'approach' || d.st === 'recover') { d.st = 'receive'; d.t = 0; }
    if (inA && this.mind > 0.6 && this.hintT <= 0 && this.stats.hits < 4) this.setHint('息が合った', 1.6);
  }

  // ───────── 金剛力士 ─────────
  private updateTrial(_dt: number): void {
    if (this.busy) return;
    if (this.inka >= 1) void this.phaseCleared();
    else if (this.body <= 0) void this.sitAgain();
  }

  private updateDeity(d: Deity, dt: number): void {
    const h = d.h, mk = this.monk, isA = h.kind === 'a';
    d.t += dt;
    const dx = mk.pos.x - h.pos.x, dz = mk.pos.z - h.pos.z, dist = Math.hypot(dx, dz), toP = Math.atan2(dx, dz);
    const turn = (yaw: number, k: number) => { h.yaw += angDiff(h.yaw, yaw) * (1 - Math.exp(-k * dt)); };
    h.vel.set(0, 0, 0); d.ring.visible = false;
    const stand = isA ? NIO_A_STAND : NIO_UN_STAND;
    switch (d.st) {
      case 'rest': case 'calm': {
        // 門の脇へ戻り、構える（calm は構えを解く）
        const hx = d.home.x - h.pos.x, hz = d.home.z - h.pos.z, hd = Math.hypot(hx, hz);
        if (hd > 0.3) { h.vel.set((hx / hd) * 3.2, 0, (hz / hd) * 3.2); turn(Math.atan2(hx, hz), 3); } else turn(d.homeYaw, 2);
        h.target = d.st === 'calm' && hd < 0.5 ? N_CALM : stand; h.rate = 3; h.hipDrop = 0; h.wide = d.st === 'calm' ? 0.1 : 0.5;
        break;
      }
      case 'approach': {
        turn(toP, 2.2); h.target = stand; h.rate = 4; h.hipDrop = 0.12; h.wide = 0.5;
        const want = d.h.kind === 'a' ? 4.6 : 5.4;
        if (dist > want + 0.6) h.vel.set((dx / dist) * 2.6, 0, (dz / dist) * 2.6);
        else if (dist < want - 1.4) h.vel.set((-dx / dist) * 1.5, 0, (-dz / dist) * 1.5);
        // 二尊が重ならないように
        for (const o of this.nio) if (o !== d && o.active) { const ox = h.pos.x - o.h.pos.x, oz = h.pos.z - o.h.pos.z, od = Math.hypot(ox, oz); if (od < 5.5 && od > 0.01) { h.vel.x += (ox / od) * 1.6; h.vel.z += (oz / od) * 1.6; } }
        // 拍に合わせて構えに入る：打ち込みは必ず「吽」の拍に届く
        const every = this.phase === 1 ? 3 : 2;
        const myTurn = this.phase === 3 ? (this.cycleN % 2 === (isA ? 0 : 1)) : (this.cycleN - d.lastCycle) >= every - 1;
        if (myTurn && this.cycleN > d.lastCycle && this.beatPhase < 0.12 && dist < 9.5 && !this.busy) {
          d.st = 'windup'; d.t = 0; d.lastCycle = this.cycleN; d.struck = false;
          d.move = isA ? 'smash' : (this.phase >= 2 && (this.cycleN % 4 < 2 || dist < 4) ? 'stomp' : 'palm');
          d.impactIn = (0.5 - this.beatPhase) * this.cycleT + (this.phase === 1 ? this.cycleT : 0);
          if (this.phase === 1) d.impactIn = (1.5 - this.beatPhase) * this.cycleT;
          this.audio.sfx('windup', { pos: this.p3(h.pos) });
          this.audio.sfx(isA ? 'voiceA' : 'voiceUn', { pos: this.p3(h.pos), gain: 0.5 });
          h.kick(0, 2.5, 0);
        }
        break;
      }
      case 'windup': {
        d.impactIn -= dt;
        const total = Math.max(0.5, d.t + d.impactIn), w = sm(d.t / (total * 0.75));
        if (d.move !== 'stomp') turn(toP, d.impactIn > 0.35 ? 2.5 : 0.3);
        h.target = d.move === 'smash' ? N_SMASH(w, 0) : d.move === 'palm' ? N_PALM(w, 0) : N_STOMP(w, 0);
        h.rate = 6; h.hipDrop = 0.1 + 0.15 * w;
        this.showRing(d, 1 - Math.max(0, d.impactIn) / total);
        if (d.impactIn <= 0.11) { d.st = 'strike'; d.t = 0; h.kick(Math.sin(h.yaw) * 4, -1, Math.cos(h.yaw) * 4); }
        break;
      }
      case 'strike': {
        d.impactIn -= dt;
        const s = sm(d.t / 0.11);
        h.target = d.move === 'smash' ? N_SMASH(1, s) : d.move === 'palm' ? N_PALM(1, s) : N_STOMP(1, s);
        h.rate = 30; h.hipDrop = 0.3 * s;
        this.showRing(d, 1);
        if (!d.struck && d.impactIn <= 0) { d.struck = true; this.resolveStrike(d, dist, toP); }
        if (d.t > 0.5) { d.st = 'recover'; d.t = 0; }
        break;
      }
      case 'recover': {
        h.target = stand; h.rate = 3; h.hipDrop = 0.1; turn(toP, 1.2);
        if (d.t > 0.9) { d.st = d.active ? 'approach' : 'rest'; d.t = 0; }
        break;
      }
      case 'receive': {
        // 蓮の一手を、動じずに受け止める
        h.target = isA ? N_RECEIVE_A : N_RECEIVE_U; h.rate = 16; h.hipDrop = 0.1; turn(toP, 4);
        if (d.t > 0.45) { d.st = 'approach'; d.t = 0; }
        break;
      }
    }
    h.pos.x += h.vel.x * dt; h.pos.z += h.vel.z * dt;
    const r = Math.hypot(h.pos.x, h.pos.z); if (d.active && r > COURT_R - 3) { h.pos.x *= (COURT_R - 3) / r; h.pos.z *= (COURT_R - 3) / r; }
  }

  private reach(d: Deity): { r: number; arc: number } { return d.move === 'smash' ? { r: 6.4, arc: 1.0 } : d.move === 'palm' ? { r: 8.2, arc: 0.42 } : { r: 6.2, arc: 4 }; }

  /** 予兆：打ち込みの届く範囲を、地面の墨の輪で示す（よく観れば受けられる） */
  private showRing(d: Deity, k: number): void {
    const { r, arc } = this.reach(d), h = d.h;
    d.ring.visible = true;
    const fwd = arc < 3 ? r * 0.5 : 0, rad = arc < 3 ? r * 0.5 * (arc < 0.6 ? 0.6 : 1) : r;
    d.ring.position.set(h.pos.x + Math.sin(h.yaw) * fwd, h.pos.y + 0.06, h.pos.z + Math.cos(h.yaw) * fwd);
    d.ring.rotation.y = h.yaw; d.ring.scale.set(rad * (arc < 0.6 ? 0.55 : 1) * (0.5 + 0.5 * k), 1, (arc < 3 ? r * 0.5 : r) * (0.5 + 0.5 * k));
    d.ringMat.uniforms.uOpacity.value = 0.25 + 0.6 * k;
  }

  private resolveStrike(d: Deity, dist: number, toP: number): void {
    const { r, arc } = this.reach(d), h = d.h, mk = this.monk;
    this.audio.sfx('stomp', { pos: this.p3(h.pos), gain: d.move === 'stomp' ? 1 : 0.6 });
    const inArea = dist < r && Math.abs(angDiff(h.yaw, toP)) < arc;
    if (!inArea || this.ps === 'sit') return;                 // 間合いの外：当たらない
    const df = DIFF[this.hooks.difficulty()];
    _v.copy(mk.pos).setY(mk.pos.y + 1.5);
    if (this.ps === 'dodge' && this.pt < 0.36) { this.mind = Math.min(1, this.mind + 0.04); return; }
    if (this.ps === 'guard') {
      const perfect = this.time - this.guardPressT <= df.perfect;
      this.flash.position.copy(_v); this.flashT = 0;
      if (perfect) {
        this.audio.sfx('perfectGuard', { pos: this.p3(mk.pos) }); this.stats.perfect++;
        this.mind = Math.min(1, this.mind + 0.14); this.inka = Math.min(1, this.inka + (this.phase === 2 ? 0.14 : 0.08) * df.inka);
        if (this.stats.perfect <= 2) this.setHint('澄んだ受け ― 吽', 2);
      } else {
        this.audio.sfx('guard', { pos: this.p3(mk.pos) }); this.stats.guard++;
        this.mind = Math.max(0, this.mind - 0.05); this.body = Math.max(0, this.body - 0.035 * df.dmg);
        this.inka = Math.min(1, this.inka + (this.phase === 2 ? 0.05 : 0.02) * df.inka);
      }
      return;
    }
    // 受け損ねた：傷や血は描かない。体勢が崩れ、心が乱れる
    this.audio.sfx('hurt', { pos: this.p3(mk.pos) }); this.stats.hurt++;
    this.body = Math.max(0, this.body - 0.24 * df.dmg); this.mind = Math.max(0, this.mind - 0.22);
    this.ps = 'hurt'; this.pt = 0;
    const kx = mk.pos.x - h.pos.x, kz = mk.pos.z - h.pos.z, kl = Math.hypot(kx, kz) || 1; this.dodgeDir.set(kx / kl, 0, kz / kl);
  }

  private async phaseCleared(): Promise<void> {
    this.busy = true;
    for (const d of this.nio) { if (d.st === 'windup' || d.st === 'strike') d.st = 'recover'; d.t = 0; }
    this.audio.sfx('bell');
    if (this.phase === 1) {
      this.nio[0].active = false; this.nio[0].st = 'rest';
      this.audio.sfx('voiceUn', { pos: this.p3(this.nio[1].h.pos) });
      await this.ui.subtitle('……閉じよ。<br>打たれる、その刹那に受けて、澄ませ。', '吽形', 5000);
      await this.beginPhase(2);
    } else if (this.phase === 2) {
      this.audio.sfx('voiceA', { pos: this.p3(this.nio[0].h.pos) });
      await this.ui.subtitle('阿吽（あうん）、ひとつの息。<br>始まりと終わりは、離れていない。', '阿形', 5000);
      await this.beginPhase(3);
    } else { await this.inkaScene(); return; }
    this.busy = false;
  }

  /** 印可：二尊は静かに構えを解き、徳を授ける */
  private async inkaScene(): Promise<void> {
    this.mode = 'cutscene'; this.ps = 'free'; this.phaseName = '';
    this.audio.setPhase(0); this.scene.setPhaseLook(4);
    for (const d of this.nio) { d.active = false; d.st = 'calm'; d.t = 0; }
    this.mind = 1;
    void this.cineTo([this.monk.pos.x + 3, 1.6, this.monk.pos.z + 5], [1.0, 2.2, 6.5], [0, 4.5, -10], [0, 4.8, -10], 9);
    await this.wait(3.2);
    this.monk.yaw = Math.atan2(-this.monk.pos.x, GATE_Z - this.monk.pos.z); this.ps = 'pray';
    this.audio.sfx('voiceA', { pos: this.p3(this.nio[0].h.pos), gain: 0.6 });
    await this.ui.subtitle('よい息だ。', '阿形', 2800);
    await this.ui.subtitle('……門は、はじめから開いている。', '吽形', 3800);
    this.audio.sfx('inka');
    this.virtue = true;
    await this.hooks.onInka();
    await this.ui.subtitle('山門の向こうへ、道は続く。', '', 3600);
    this.cine = null; this.mode = 'done'; this.busy = false;
    this.hooks.onDone();
  }

  /** 倒れても罰は軽く：「もう一度、座り直す」。その段の始めから */
  private async sitAgain(): Promise<void> {
    this.busy = true; this.ps = 'sit'; this.stats.sat++;
    for (const d of this.nio) { if (d.active) { d.st = 'recover'; d.t = -2.5; } }
    await this.wait(0.9);
    await this.ui.wash(true, 900);
    await this.ui.subtitle('もう一度、座り直す。', '', 2200);
    this.monk.place(0, COURT_R - 3, Math.PI);
    this.body = 1; this.mind = 0.8; this.inka = 0; this.ps = 'free';
    for (const d of this.nio) { d.lastCycle = this.cycleN + 1; }
    await this.ui.wash(false, 900);
    this.busy = false;
  }

  // ───────── カメラ（2D） ─────────
  private updateCamera(dt: number, inp: InputState): void {
    const cam = this.stage.camera, mk = this.monk;
    if (this.cine) {
      const c = this.cine; c.t = Math.min(c.dur, c.t + dt); const k = sm(c.t / c.dur);
      this.camPos.lerpVectors(c.from, c.to, k); this.camLook.lerpVectors(c.lf, c.lt, k);
      cam.position.copy(this.camPos); cam.lookAt(this.camLook); cam.fov = damp(cam.fov, 50, 2, dt); cam.updateProjectionMatrix();
      this.camInit = false;
      return;
    }
    this.camPitch = Math.min(1.1, Math.max(-0.25, this.camPitch + inp.lookY));
    let dist = 5.6, lookY = 1.35, fov = 46;
    _v.copy(mk.pos); _v.y += lookY;
    if (this.mode === 'trial' && !this.photo) {
      // 尊格の全身と蓮が美しく収まる構図を保つ：尊格→蓮の延長線上、蓮の後ろへ
      const f = this.focusPoint(_v2); const act = this.nio.filter(d => d.active);
      const cx = act.reduce((s, d) => s + d.h.pos.x, 0) / (act.length || 1), cz = act.reduce((s, d) => s + d.h.pos.z, 0) / (act.length || 1);
      const want = Math.atan2(mk.pos.x - cx, mk.pos.z - cz);
      this.camOff = damp(this.camOff + inp.lookX * -1, 0, 0.6, dt); this.camOff = Math.max(-1.3, Math.min(1.3, this.camOff));
      this.camYaw += angDiff(this.camYaw, want + this.camOff) * (1 - Math.exp(-2.6 * dt));
      const sep = Math.hypot(mk.pos.x - cx, mk.pos.z - cz);
      dist = 7.6 + sep * 0.3 + (act.length > 1 ? 2.0 : 0); fov = 52;
      _v.lerp(f, 0.4); _v.y = 2.3 + Math.min(1.2, 6 / Math.max(sep, 3));
      // 蓮を画面の左下三分の一に置く（中央下の呼吸の輪と重ねない）
      _v.x += Math.cos(this.camYaw) * 1.6; _v.z -= Math.sin(this.camYaw) * 1.6;
      this.camPitch = damp(this.camPitch, 0.3, 1.5, dt);
    } else this.camYaw -= inp.lookX;
    const cp = Math.cos(this.camPitch), sp = Math.sin(this.camPitch);
    _v2.set(mk.pos.x + Math.sin(this.camYaw) * cp * dist, mk.pos.y + 1.5 + sp * dist + (this.mode === 'trial' ? 0.6 : 0), mk.pos.z + Math.cos(this.camYaw) * cp * dist);
    _v2.y = Math.max(_v2.y, groundY(_v2.x, _v2.z) + 0.5);
    if (!this.camInit) { this.camPos.copy(_v2); this.camLook.copy(_v); this.camInit = true; }
    const k = 1 - Math.exp(-7 * dt);
    this.camPos.lerp(_v2, k); this.camLook.lerp(_v, k);
    cam.position.copy(this.camPos); cam.lookAt(this.camLook);
    if (Math.abs(cam.fov - fov) > 0.05) { cam.fov = damp(cam.fov, fov, 2, dt); cam.updateProjectionMatrix(); }
  }

  hud(): HudState {
    const trial = this.mode === 'trial';
    const breathing = this.ps === 'breathe';
    return {
      visible: (this.mode === 'explore' || trial) && !this.photo,
      mind: this.mind, body: this.body, inka: trial ? this.inka : 0, phase: trial ? this.phase : 0, phaseName: trial ? this.phaseName : '',
      breath: trial ? this.beatPhase : breathing ? (this.breathHold % 3.2) / 3.2 : 0,
      breathLabel: trial ? (this.beatPhase < 0.5 ? '阿' : '吽') : '',
      hint: this.hintT > 0 ? this.hint : '',
    };
  }

  // ───────── 自動操作（通し確認用） ─────────
  private botInput(inp: InputState): InputState {
    const o: InputState = { moveX: 0, moveY: 0, lookX: 0, lookY: 0, usingTouch: false, held: { ...inp.held }, pressed: { ...inp.pressed } };
    (Object.keys(o.held) as (keyof typeof o.held)[]).forEach(k => { o.held[k] = false; o.pressed[k] = false; });
    const mk = this.monk; this.botDir = null;
    if (this.mode === 'explore' && !this.busy) {
      let tx: number, tz: number;
      if (!this.checkpointDone) { tx = this.scene.jizoPos.x + 2.2; tz = this.scene.jizoPos.z; if (this.nearJizo && Math.hypot(mk.pos.x - tx, mk.pos.z - tz) < 1.5) { o.pressed.interact = true; return o; } }
      else { tz = mk.pos.z - 3; tx = mk.pos.z > STEP_Z0 ? pathX(tz) : 0; }
      this.botDir = _v2.set(tx - mk.pos.x, 0, tz - mk.pos.z).clone();
    } else if (this.mode === 'trial' && !this.busy) {
      const threat = this.nio.filter(d => (d.st === 'windup' || d.st === 'strike') && !d.struck).sort((a, b) => a.impactIn - b.impactIn)[0];
      const d = this.nearestActive();
      if (threat && threat.impactIn < 0.16) { o.held.guard = true; return o; }
      if (!d) return o;
      const dx = d.h.pos.x - mk.pos.x, dz = d.h.pos.z - mk.pos.z, dist = Math.hypot(dx, dz);
      if (this.mind < 0.45 && !threat) { o.held.breathe = true; return o; }
      if (dist > 3.4) this.botDir = new THREE.Vector3(dx, 0, dz);
      else if (this.beatPhase > 0.04 && this.beatPhase < 0.3 && this.time - this.botAtk > this.cycleT * 0.8 && this.ps === 'free' && !(threat && threat.impactIn < 0.9)) { o.pressed.light = true; this.botAtk = this.time; }
    }
    return o;
  }

  dispose(): void { this.stage.scene.remove(this.scene.group, this.flash, this.monk.root, this.monk.shadow); for (const d of this.nio) this.stage.scene.remove(d.h.root, d.h.shadow, d.ring); this.scene.dispose(); }
}
export { NIO_SCALE };

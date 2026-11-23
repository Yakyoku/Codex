// スキャンの診断：区域を細かく分けて健康度を調べ、悪い所（病巣）を最大3か所えらび、原因を推定する。
// 表示はスーツの走査表示として扱う（細胞そのものの光ではない）。画面版と VR 版で共用する。
import * as THREE from 'three/webgpu';
import { tsl } from '../core/tsl';
import type { HealthField } from '../core/health';
const { uniform, uv, color, float, smoothstep, abs, sin, mix } = tsl;

export interface Finding { x: number; z: number; y: number; health: number; cause: string; short: string; dist: number }

export class Diagnosis {
  group = new THREE.Group();
  findings: Finding[] = [];
  private cols: THREE.Mesh[] = []; private rings: THREE.Mesh[] = [];
  private uShow = uniform(0); private uTime = uniform(0);
  show = 0; private hold = 0;
  constructor(private health: HealthField, private size: [number, number], private floorAt: (x: number, z: number) => number,
              private causeAt: (x: number, z: number) => { short: string; cause: string }, scale = 1, private plugs: { p: THREE.Vector3; cleared: boolean }[] = [], private plugInfo = { short: '閉塞点（赤血球の塊）', cause: 'ここで赤血球が止まって塊になっています。光を当て続けてほぐすと、流れが戻ります' }) {
    // 光の柱：下ほど濃く、上へ消える。病巣の上に立つ目印
    const cm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });
    const v = uv().y, edge = abs(uv().x.sub(0.5)).mul(2);
    cm.colorNode = color(0xffa848).mul(float(1).sub(v).pow(1.6)).mul(float(1).sub(edge).pow(0.6)).mul(sin(v.mul(30).sub(this.uTime.mul(4))).mul(0.25).add(0.75)).mul(this.uShow).mul(0.9);
    const rm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
    const r = uv().sub(0.5).length().mul(2);
    rm.colorNode = color(0xffb060).mul(smoothstep(0.82, 0.92, r).mul(smoothstep(1.0, 0.94, r)).add(smoothstep(0.5, 0.0, r).mul(0.15))).mul(mix(float(0.6), float(1), sin(this.uTime.mul(3)).mul(0.5).add(0.5))).mul(this.uShow);
    for (let i = 0; i < 3; i++) {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.5 * scale, 1.1 * scale, 14 * scale, 16, 1, true).translate(0, 7 * scale, 0), cm); c.renderOrder = 60; c.frustumCulled = false;
      const g = new THREE.Mesh(new THREE.PlaneGeometry(9 * scale, 9 * scale).rotateX(-Math.PI / 2), rm); g.renderOrder = 59; g.frustumCulled = false;
      this.cols.push(c); this.rings.push(g); this.group.add(c, g);
    }
    this.group.visible = false;
  }
  /** 診断を計算する（スキャンを押したとき・押している間に時々） */
  analyze(px: number, pz: number) {
    const [W, D] = this.size, nx = 10, nz = 7, cells: Finding[] = [];
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      // 区画の中を 4×4 点で調べ、いちばん悪い点を代表にする
      let sum = 0, worst = 2, wx = 0, wz = 0;
      for (let b = 0; b < 4; b++) for (let a = 0; a < 4; a++) {
        const x = ((i + (a + 0.5) / 4) / nx - 0.5) * W * 0.84, z = ((j + (b + 0.5) / 4) / nz - 0.5) * D * 0.8;
        const h = this.health.sample(x, z); sum += h; if (h < worst) { worst = h; wx = x; wz = z; }
      }
      const mean = sum / 16; if (mean > 0.5) continue;
      const c = this.causeAt(wx, wz);
      cells.push({ x: wx, z: wz, y: this.floorAt(wx, wz), health: mean, short: c.short, cause: c.cause, dist: Math.hypot(wx - px, wz - pz) });
    }
    // 閉塞点（止まった赤血球の塊）は、いちばん大事な手がかりとして必ず示す
    for (const pl of this.plugs) if (!pl.cleared) cells.push({ x: pl.p.x, z: pl.p.z, y: this.floorAt(pl.p.x, pl.p.z), health: -1, short: this.plugInfo.short,
      cause: this.plugInfo.cause, dist: Math.hypot(pl.p.x - px, pl.p.z - pz) });
    cells.sort((a, b) => a.health - b.health);
    const out: Finding[] = [];
    for (const c of cells) { if (out.every((o) => Math.hypot(o.x - c.x, o.z - c.z) > 30)) out.push(c); if (out.length === 3) break; }
    out.sort((a, b) => a.dist - b.dist);   // 近い順に番号を振る
    this.findings = out; this.hold = 9;
  }
  update(dt: number, scanning: boolean, px: number, pz: number) {
    this.uTime.value += dt;
    if (scanning) this.hold = 9; else this.hold -= dt;
    // 治った病巣は印を消す
    this.findings = this.findings.filter((f) => f.health < 0 ? this.plugs.some((p) => !p.cleared && p.p.x === f.x && p.p.z === f.z) : this.health.sample(f.x, f.z) < 0.62);
    for (const f of this.findings) f.dist = Math.hypot(f.x - px, f.z - pz);
    const want = this.hold > 0 && this.findings.length ? 1 : 0;
    this.show += (want - this.show) * Math.min(1, dt * (want ? 4 : 1.5)); this.uShow.value = this.show;
    this.group.visible = this.show > 0.01;
    for (let i = 0; i < 3; i++) {
      const f = this.findings[i], on = !!f; this.cols[i].visible = this.rings[i].visible = on;
      if (f) { this.cols[i].position.set(f.x, f.y, f.z); this.rings[i].position.set(f.x, f.y + 0.08, f.z); }
    }
  }
}

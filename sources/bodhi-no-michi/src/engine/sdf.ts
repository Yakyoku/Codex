// 距離関数（SDF）による造形と、Surface Nets によるメッシュ化。
// 粘土を足す・削る感覚で、尊格や人物の曲面をコードで彫る。three.js には依存しない（焼き込みスクリプトから使う）。

export type V3 = [number, number, number];
export type RGB = [number, number, number];

type Kind = 'ell' | 'cone' | 'box' | 'torus';
export interface Prim {
  kind: Kind;
  c: V3;                 // 中心
  m: number[];           // 回転行列（ローカル→ワールド）の転置＝ワールド→ローカル（9要素）
  a: number[];           // 形ごとのパラメータ
  k: number;             // なめらかにつなぐ半径
  sub: boolean;          // 削る
  bone: number;
  col: RGB;
  loose: number;         // 揺れやすさ 0..1
  bc: V3; br: number;    // 包む球
  colOnly?: boolean;     // 形は変えず色だけ塗る
}

const ID = [1, 0, 0, 0, 1, 0, 0, 0, 1];

/** オイラー角（度, XYZ順）→ ワールド→ローカルの行列 */
export function rotM(rx = 0, ry = 0, rz = 0): number[] {
  const d = Math.PI / 180;
  const cx = Math.cos(rx * d), sx = Math.sin(rx * d), cy = Math.cos(ry * d), sy = Math.sin(ry * d), cz = Math.cos(rz * d), sz = Math.sin(rz * d);
  // R = Rz * Ry * Rx （ローカル→ワールド）
  const r = [
    cz * cy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx,
    sz * cy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx,
    -sy, cy * sx, cy * cx,
  ];
  // 転置
  return [r[0], r[3], r[6], r[1], r[4], r[7], r[2], r[5], r[8]];
}

export interface Style { bone?: number; col?: RGB; k?: number; loose?: number; sub?: boolean; rot?: [number, number, number]; colOnly?: boolean }

export class Sdf {
  prims: Prim[] = [];
  /** 以後に足す形の既定値 */
  cur: Required<Omit<Style, 'rot' | 'sub' | 'colOnly'>> = { bone: 0, col: [0.8, 0.8, 0.8], k: 0.02, loose: 0 };
  /** 骨の重みをなじませる半径 */
  skinK = 0.03;

  set(s: Style): this { Object.assign(this.cur, s); return this; }

  private push(kind: Kind, c: V3, a: number[], br: number, s?: Style, bc?: V3): this {
    const st = { ...this.cur, ...s };
    this.prims.push({
      kind, c, a, m: s?.rot ? rotM(...s.rot) : ID, k: st.k, sub: !!s?.sub, bone: st.bone, col: st.col, loose: st.loose,
      bc: bc ?? c, br, colOnly: s?.colOnly,
    });
    return this;
  }
  /** 楕円体 */
  ell(c: V3, r: V3, s?: Style): this { return this.push('ell', c, r, Math.max(r[0], r[1], r[2]), s); }
  /** 球 */
  ball(c: V3, r: number, s?: Style): this { return this.ell(c, [r, r, r], s); }
  /** 両端の太さが違う丸棒（腕・脚・筋肉） */
  cone(a: V3, b: V3, ra: number, rb: number, s?: Style): this {
    const mid: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    return this.push('cone', a, [b[0], b[1], b[2], ra, rb], len / 2 + Math.max(ra, rb), { ...s, rot: undefined }, mid);
  }
  /** 角の丸い箱 */
  box(c: V3, half: V3, round: number, s?: Style): this {
    return this.push('box', c, [half[0], half[1], half[2], round], Math.hypot(half[0], half[1], half[2]) + round, s);
  }
  /** 輪（Y軸まわり）。R=輪の半径, r=太さ */
  torus(c: V3, R: number, r: number, s?: Style): this { return this.push('torus', c, [R, r], R + r, s); }

  /** 左右対称に足す。fn の中で x を sgn 倍して使う。boneL/boneR は呼び出し側で切り替える */
  mirror(fn: (sg: 1 | -1) => void): this { fn(1); fn(-1); return this; }

  private dPrim(p: Prim, x: number, y: number, z: number): number {
    if (p.kind === 'cone') {
      // iq の round cone
      const ax = p.c[0], ay = p.c[1], az = p.c[2];
      const bx = p.a[0] - ax, by = p.a[1] - ay, bz = p.a[2] - az;
      const r1 = p.a[3], r2 = p.a[4];
      const l2 = bx * bx + by * by + bz * bz;
      const rr = r1 - r2, a2 = l2 - rr * rr, il2 = 1 / l2;
      const px = x - ax, py = y - ay, pz = z - az;
      const yv = px * bx + py * by + pz * bz;
      const zv = yv - l2;
      const qx = px * l2 - bx * yv, qy = py * l2 - by * yv, qz = pz * l2 - bz * yv;
      const x2 = qx * qx + qy * qy + qz * qz;
      const y2 = yv * yv * l2, z2 = zv * zv * l2;
      const kk = Math.sign(rr) * rr * rr * x2;
      if (Math.sign(zv) * a2 * z2 > kk) return Math.sqrt(x2 + z2) * il2 - r2;
      if (Math.sign(yv) * a2 * y2 < kk) return Math.sqrt(x2 + y2) * il2 - r1;
      return (Math.sqrt(x2 * a2 * il2) + yv * rr) * il2 - r1;
    }
    const dx = x - p.c[0], dy = y - p.c[1], dz = z - p.c[2];
    const m = p.m;
    const lx = m[0] * dx + m[1] * dy + m[2] * dz, ly = m[3] * dx + m[4] * dy + m[5] * dz, lz = m[6] * dx + m[7] * dy + m[8] * dz;
    if (p.kind === 'ell') {
      const rx = p.a[0], ry = p.a[1], rz = p.a[2];
      const k0 = Math.hypot(lx / rx, ly / ry, lz / rz);
      const k1 = Math.hypot(lx / (rx * rx), ly / (ry * ry), lz / (rz * rz));
      return k1 < 1e-9 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1;
    }
    if (p.kind === 'box') {
      const qx = Math.abs(lx) - p.a[0], qy = Math.abs(ly) - p.a[1], qz = Math.abs(lz) - p.a[2];
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - p.a[3];
    }
    // torus
    const q = Math.hypot(lx, lz) - p.a[0];
    return Math.hypot(q, ly) - p.a[1];
  }

  /** 距離だけ */
  d(x: number, y: number, z: number): number {
    let d = 1e9;
    const ps = this.prims;
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (p.colOnly) continue;
      const bd = Math.hypot(x - p.bc[0], y - p.bc[1], z - p.bc[2]) - p.br;
      if (p.sub) {
        if (bd > p.k) continue;
        const di = -this.dPrim(p, x, y, z);
        const h = Math.max(p.k - Math.abs(d - di), 0) / (p.k || 1e-9);
        d = Math.max(d, di) + h * h * p.k * 0.25;
      } else {
        if (bd > d + p.k) continue;
        const di = this.dPrim(p, x, y, z);
        const h = Math.max(p.k - Math.abs(d - di), 0) / (p.k || 1e-9);
        d = Math.min(d, di) - h * h * p.k * 0.25;
      }
    }
    return d;
  }

  /** 頂点での色・揺れ・骨の重み */
  attr(x: number, y: number, z: number, nBones: number, out: { col: number[]; loose: number; w: Float32Array }): void {
    let d = 1e9;
    let r = 0.8, g = 0.8, b = 0.8, loose = 0;
    const ps = this.prims;
    const w = out.w; w.fill(0);
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      const di0 = this.dPrim(p, x, y, z);
      if (p.colOnly) {
        // 形の内側（＋にじみ幅）を塗る
        const t = Math.min(Math.max(0.5 - di0 / (p.k || 1e-9), 0), 1);
        const tt = t * t * (3 - 2 * t);
        r += (p.col[0] - r) * tt; g += (p.col[1] - g) * tt; b += (p.col[2] - b) * tt;
        continue;
      }
      if (p.sub) {
        const di = -di0;
        if (di > d - p.k) {
          const t = Math.min(Math.max(0.5 + (di - d) / (2 * p.k || 1e-9), 0), 1);
          r += (p.col[0] - r) * t; g += (p.col[1] - g) * t; b += (p.col[2] - b) * t;
          d = Math.max(d, di);
        }
        continue;
      }
      const t = d > 1e8 ? 1 : Math.min(Math.max(0.5 + (d - di0) / (2 * p.k || 1e-9), 0), 1);
      r += (p.col[0] - r) * t; g += (p.col[1] - g) * t; b += (p.col[2] - b) * t; loose += (p.loose - loose) * t;
      const h = Math.max(p.k - Math.abs(d - di0), 0) / (p.k || 1e-9);
      d = Math.min(d, di0) - h * h * p.k * 0.25;
      // 骨の重み：表面に近い形ほど強く
      w[p.bone] += Math.exp(-Math.max(di0, -0.5 * this.skinK) / this.skinK);
    }
    out.col[0] = r; out.col[1] = g; out.col[2] = b; out.loose = loose;
    let s = 0; for (let i = 0; i < nBones; i++) s += w[i];
    if (s > 0) for (let i = 0; i < nBones; i++) w[i] /= s;
  }
}

export interface MeshData {
  pos: Float32Array; nrm: Float32Array; col: Uint8Array; // col: rgb + loose
  skinI: Uint8Array; skinW: Uint8Array; idx: Uint32Array;
  min: V3; max: V3;
}

/** Surface Nets。min/max の箱を cell の大きさで刻む */
export function meshSdf(sdf: Sdf, min: V3, max: V3, cell: number, nBones: number, aoR = cell * 5): MeshData {
  const nx = Math.ceil((max[0] - min[0]) / cell) + 1, ny = Math.ceil((max[1] - min[1]) / cell) + 1, nz = Math.ceil((max[2] - min[2]) / cell) + 1;
  const val = new Float32Array(nx * ny * nz);
  const B = 6; // 粗いブロックで先に遠い所を飛ばす
  const half = (B * cell * Math.sqrt(3)) / 2;
  for (let bz = 0; bz < nz; bz += B) for (let by = 0; by < ny; by += B) for (let bx = 0; bx < nx; bx += B) {
    const cx = min[0] + (bx + B / 2) * cell, cy = min[1] + (by + B / 2) * cell, cz = min[2] + (bz + B / 2) * cell;
    const dc = sdf.d(cx, cy, cz);
    const far = Math.abs(dc) > half * 1.6 + cell;
    for (let z = bz; z < Math.min(bz + B, nz); z++) for (let y = by; y < Math.min(by + B, ny); y++) {
      let o = (z * ny + y) * nx + bx;
      for (let x = bx; x < Math.min(bx + B, nx); x++, o++) {
        val[o] = far ? dc : sdf.d(min[0] + x * cell, min[1] + y * cell, min[2] + z * cell);
      }
    }
  }
  const vid = new Int32Array(nx * ny * nz).fill(-1);
  const pos: number[] = [];
  const idx: number[] = [];
  const cornerOff = [0, 1, nx, nx + 1, nx * ny, nx * ny + 1, nx * ny + nx, nx * ny + nx + 1];
  const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (let z = 0; z < nz - 1; z++) for (let y = 0; y < ny - 1; y++) for (let x = 0; x < nx - 1; x++) {
    const o = (z * ny + y) * nx + x;
    let mask = 0;
    for (let c = 0; c < 8; c++) if (val[o + cornerOff[c]] < 0) mask |= 1 << c;
    if (mask === 0 || mask === 255) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of edges) {
      const va = val[o + cornerOff[a]], vb = val[o + cornerOff[b]];
      if ((va < 0) === (vb < 0)) continue;
      const t = va / (va - vb);
      const ax = a & 1, ay = (a >> 1) & 1, az = (a >> 2) & 1, bx2 = b & 1, by2 = (b >> 1) & 1, bz2 = (b >> 2) & 1;
      sx += ax + (bx2 - ax) * t; sy += ay + (by2 - ay) * t; sz += az + (bz2 - az) * t; n++;
    }
    vid[o] = pos.length / 3;
    pos.push(min[0] + (x + sx / n) * cell, min[1] + (y + sy / n) * cell, min[2] + (z + sz / n) * cell);
  }
  // 面を張る
  for (let z = 1; z < nz - 1; z++) for (let y = 1; y < ny - 1; y++) for (let x = 1; x < nx - 1; x++) {
    const o = (z * ny + y) * nx + x;
    const v0 = val[o] < 0;
    const ax = [1, nx, nx * ny];
    for (let d = 0; d < 3; d++) {
      const v1 = val[o + ax[d]] < 0;
      if (v0 === v1) continue;
      const u = ax[(d + 1) % 3], v = ax[(d + 2) % 3];
      const a = vid[o - u - v], b = vid[o - v], c = vid[o], e = vid[o - u];
      if (a < 0 || b < 0 || c < 0 || e < 0) continue;
      if (v0) idx.push(a, b, c, a, c, e); else idx.push(a, c, b, a, e, c);
    }
  }
  const nv = pos.length / 3;
  const P = new Float32Array(pos), N = new Float32Array(nv * 3), C = new Uint8Array(nv * 4), SI = new Uint8Array(nv * 4), SW = new Uint8Array(nv * 4);
  const out = { col: [0, 0, 0], loose: 0, w: new Float32Array(nBones) };
  const e = cell * 0.5;
  for (let i = 0; i < nv; i++) {
    let x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
    // 勾配＝法線。表面へ少し寄せて形をなめらかにする
    for (let it = 0; it < 2; it++) {
      const gx = sdf.d(x + e, y, z) - sdf.d(x - e, y, z), gy = sdf.d(x, y + e, z) - sdf.d(x, y - e, z), gz = sdf.d(x, y, z + e) - sdf.d(x, y, z - e);
      const gl = Math.hypot(gx, gy, gz) || 1;
      N[i * 3] = gx / gl; N[i * 3 + 1] = gy / gl; N[i * 3 + 2] = gz / gl;
      if (it === 0) {
        const d0 = Math.max(-cell, Math.min(cell, sdf.d(x, y, z)));
        x -= N[i * 3] * d0 * 0.8; y -= N[i * 3 + 1] * d0 * 0.8; z -= N[i * 3 + 2] * d0 * 0.8;
        P[i * 3] = x; P[i * 3 + 1] = y; P[i * 3 + 2] = z;
      }
    }
    sdf.attr(x, y, z, nBones, out);
    {
      // 凹みには顔料が溜まる：法線方向に進んだ先の空き具合を測り、色を重ね塗りで深くする
      let ao = 0;
      for (let k = 1; k <= 3; k++) { const dd = aoR * k / 3; ao += Math.max(0, dd - sdf.d(x + N[i * 3] * dd, y + N[i * 3 + 1] * dd, z + N[i * 3 + 2] * dd)) / dd; }
      const e2 = 1 + Math.min(1, ao / 3 * 1.4) * 0.6;
      for (let k = 0; k < 3; k++) out.col[k] = Math.pow(Math.min(1, Math.max(0.001, out.col[k])), e2);
    }
    C[i * 4] = Math.round(Math.min(1, Math.max(0, out.col[0])) * 255);
    C[i * 4 + 1] = Math.round(Math.min(1, Math.max(0, out.col[1])) * 255);
    C[i * 4 + 2] = Math.round(Math.min(1, Math.max(0, out.col[2])) * 255);
    C[i * 4 + 3] = Math.round(Math.min(1, Math.max(0, out.loose)) * 255);
    // 上位4本の骨
    const w = out.w; const bi = [0, 0, 0, 0], bw = [0, 0, 0, 0];
    for (let b = 0; b < nBones; b++) {
      const wv = w[b]; if (wv <= bw[3]) continue;
      let j = 3; while (j > 0 && bw[j - 1] < wv) { bw[j] = bw[j - 1]; bi[j] = bi[j - 1]; j--; }
      bw[j] = wv; bi[j] = b;
    }
    const s = bw[0] + bw[1] + bw[2] + bw[3] || 1;
    let acc = 0;
    for (let j = 1; j < 4; j++) { SW[i * 4 + j] = Math.round((bw[j] / s) * 255); acc += SW[i * 4 + j]; SI[i * 4 + j] = bi[j]; }
    SW[i * 4] = 255 - acc; SI[i * 4] = bi[0];
  }
  return { pos: P, nrm: N, col: C, skinI: SI, skinW: SW, idx: new Uint32Array(idx), min, max };
}

/** 焼き込み用：1ファイルにまとめる（先頭に JSON ヘッダー） */
export function packMesh(m: MeshData, extra: Record<string, unknown> = {}): Uint8Array {
  const nv = m.pos.length / 3;
  const use16 = nv < 65536;
  const q = new Uint16Array(nv * 3);
  for (let i = 0; i < nv; i++) for (let a = 0; a < 3; a++) q[i * 3 + a] = Math.round(((m.pos[i * 3 + a] - m.min[a]) / (m.max[a] - m.min[a])) * 65535);
  const n8 = new Int8Array(nv * 3);
  for (let i = 0; i < nv * 3; i++) n8[i] = Math.round(m.nrm[i] * 127);
  const idxBuf = use16 ? new Uint16Array(m.idx) : m.idx;
  const head = new TextEncoder().encode(JSON.stringify({ nv, ni: m.idx.length, use16, min: m.min, max: m.max, ...extra }));
  const pad = (n: number) => (n + 3) & ~3;
  const parts: Uint8Array[] = [new Uint8Array(q.buffer), new Uint8Array(n8.buffer), m.col, m.skinI, m.skinW, new Uint8Array(idxBuf.buffer)];
  let total = 4 + pad(head.length);
  for (const p of parts) total += pad(p.length);
  const out = new Uint8Array(total);
  new DataView(out.buffer).setUint32(0, head.length, true);
  out.set(head, 4);
  let o = 4 + pad(head.length);
  for (const p of parts) { out.set(p, o); o += pad(p.length); }
  return out;
}

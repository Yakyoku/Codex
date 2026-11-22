// 序章の舞台：霧の深い山寺。杉木立、苔の石段、石畳の前庭、山門。パレットは青緑と灰、差し色に丹（に）。
import * as THREE from 'three';
import { G, wcMaterial, makeSky, blotMaterial } from '../engine/watercolor';
import { loadMesh } from '../engine/model';

export { PALETTE } from './palette';

// 決定的な乱数
function rng(seed: number): () => number { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }
function vnoise(x: number, z: number): number {
  const h = (i: number, j: number) => { const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return n - Math.floor(n); };
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi, u = xf * xf * (3 - 2 * xf), v = zf * zf * (3 - 2 * zf);
  return (h(xi, zi) * (1 - u) + h(xi + 1, zi) * u) * (1 - v) + (h(xi, zi + 1) * (1 - u) + h(xi + 1, zi + 1) * u) * v;
}
const fbm = (x: number, z: number) => vnoise(x, z) * 0.55 + vnoise(x * 2.1 + 5, z * 2.1) * 0.3 + vnoise(x * 4.3, z * 4.3 + 9) * 0.15;

export const COURT_R = 15;        // 前庭の半径
export const GATE_Z = -19;
export const STEP_Z0 = 17, STEP_Z1 = 47, STEP_RISE = 0.17, STEP_RUN = 1.0;
/** 道の中心の x（ゆるく曲がる参道） */
export const pathX = (z: number) => (z > STEP_Z0 ? Math.sin((z - STEP_Z0) * 0.07) * 3.2 : 0);
/** 地面の高さ */
export function groundY(x: number, z: number): number {
  const r = Math.hypot(x, z);
  let y = 0;
  const onPath = Math.abs(x - pathX(z)) < 2.4;
  if (z > STEP_Z0 - 0.5) {
    const n = Math.min(Math.floor((z - STEP_Z0) / STEP_RUN) + 1, 30);
    const slope = -Math.max(0, z - STEP_Z0) * STEP_RISE / STEP_RUN;
    y = onPath && z < STEP_Z1 ? -Math.max(0, n) * STEP_RISE : Math.max(slope, -30 * STEP_RISE) - 0.12;
  }
  // 前庭の外は起伏
  const out = Math.max(0, r - COURT_R - 2) * (z < STEP_Z0 ? 1 : 0);
  const side = Math.max(0, Math.abs(x - pathX(z)) - 3.2);
  y += (z < STEP_Z0 ? out * 0.12 * (0.6 + fbm(x * 0.05, z * 0.05)) : side * 0.2 * (0.5 + fbm(x * 0.06, z * 0.06)));
  return y;
}

/** 頂点を空間ノイズでわずかに揺らし、定規で引いたような直線を消す */
function wobble(g: THREE.BufferGeometry, amp: number, freq = 0.7): THREE.BufferGeometry {
  const p = g.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    p.setXYZ(i, x + (vnoise(y * freq + 3, z * freq) - 0.5) * amp, y + (vnoise(x * freq, z * freq + 7) - 0.5) * amp, z + (vnoise(x * freq + 11, y * freq) - 0.5) * amp);
  }
  g.computeVertexNormals();
  return g;
}
function colorize(g: THREE.BufferGeometry, fn: (x: number, y: number, z: number, i: number) => [number, number, number, number]): THREE.BufferGeometry {
  const p = g.getAttribute('position') as THREE.BufferAttribute;
  const c = new Float32Array(p.count * 4);
  for (let i = 0; i < p.count; i++) { const v = fn(p.getX(i), p.getY(i), p.getZ(i), i); c.set(v, i * 4); }
  g.setAttribute('color', new THREE.BufferAttribute(c, 4));
  return g;
}
function merge(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let nv = 0, ni = 0;
  for (const g of list) { nv += g.getAttribute('position').count; ni += g.index ? g.index.count : g.getAttribute('position').count; }
  const P = new Float32Array(nv * 3), N = new Float32Array(nv * 3), C = new Float32Array(nv * 4), I = new Uint32Array(ni);
  let vo = 0, io = 0;
  for (const g of list) {
    const p = g.getAttribute('position'), n = g.getAttribute('normal'), c = g.getAttribute('color');
    P.set(p.array as Float32Array, vo * 3); N.set(n.array as Float32Array, vo * 3);
    if (c) C.set(c.array as Float32Array, vo * 4); else C.fill(1, vo * 4, (vo + p.count) * 4);
    if (g.index) for (let i = 0; i < g.index.count; i++) I[io++] = g.index.getX(i) + vo; else for (let i = 0; i < p.count; i++) I[io++] = vo + i;
    vo += p.count;
  }
  const o = new THREE.BufferGeometry();
  o.setAttribute('position', new THREE.BufferAttribute(P, 3)); o.setAttribute('normal', new THREE.BufferAttribute(N, 3));
  o.setAttribute('color', new THREE.BufferAttribute(C, 4)); o.setIndex(new THREE.BufferAttribute(I, 1));
  return o;
}

/** 杉：まっすぐな幹と、垂れ下がる枝葉の層。一本を作って多数に写す */
function cedarGeo(seed: number, detail = 1): THREE.BufferGeometry {
  const r = rng(seed); const parts: THREE.BufferGeometry[] = [];
  const H = 26;
  const trunk = new THREE.CylinderGeometry(0.2, 0.75, H, 8, 6, true).translate(0, H / 2, 0);
  wobble(trunk, 0.22, 0.35);
  colorize(trunk, (_x, y) => { const t = y / H; return [0.34 - t * 0.06, 0.29 - t * 0.03, 0.35, 0]; });
  parts.push(trunk);
  // 枝葉は、筆で置いた染みのような丸いかたまりを段に重ねる
  const tiers = 8;
  for (let i = 0; i < tiers; i++) {
    const t = i / (tiers - 1);
    const y = 9 + t * (H - 9.5), rad = 4.6 * (1 - t * 0.76) * (0.85 + r() * 0.3);
    const n = i < 5 ? 2 : 1, a0 = r() * 6.28;
    for (let k = 0; k < n; k++) {
      const blob = new THREE.IcosahedronGeometry(1, detail);
      const p = blob.getAttribute('position') as THREE.BufferAttribute;
      const sx = rad * (0.75 + r() * 0.3), sy = rad * 0.42 + 0.9, sz = rad * (0.75 + r() * 0.3), ph = r() * 9;
      for (let v = 0; v < p.count; v++) {
        const x = p.getX(v), yy = p.getY(v), z = p.getZ(v);
        const d = 1 + (vnoise(x * 1.7 + ph, z * 1.7 + yy * 1.3) - 0.5) * 0.7;
        const rr = Math.hypot(x, z);
        p.setXYZ(v, x * sx * d, yy * sy * d - rr * rr * rad * 0.28, z * sz * d);   // 枝先が垂れる
      }
      const ang = a0 + k * Math.PI + (r() - 0.5), off = n > 1 ? rad * 0.42 : 0;
      blob.translate(Math.cos(ang) * off, y + (r() - 0.5) * 0.8, Math.sin(ang) * off);
      const g2 = merge([blob.toNonIndexed()].map(g => { g.setIndex([...Array(g.getAttribute('position').count).keys()]); return g; }));
      // なめらかな陰影にするため、中心からの向きを法線にする
      const pp = g2.getAttribute('position') as THREE.BufferAttribute, nn = g2.getAttribute('normal') as THREE.BufferAttribute;
      const cx = Math.cos(ang) * off, cz = Math.sin(ang) * off;
      for (let v = 0; v < pp.count; v++) { const nx = pp.getX(v) - cx, ny = (pp.getY(v) - y) * 2.2 + rad * 0.3, nz = pp.getZ(v) - cz, l = Math.hypot(nx, ny, nz) || 1; nn.setXYZ(v, nx / l, ny / l, nz / l); }
      const tone = 0.82 + r() * 0.34;
      colorize(g2, (x, yy, z) => { const rr = Math.min(1, Math.hypot(x - cx, z - cz) / rad); return [0.4 * tone, 0.58 * tone + 0.04, 0.55 * tone + 0.03, Math.min(1, rr * rr * 0.6 + (yy < y ? 0.15 : 0))]; });
      parts.push(g2);
    }
  }
  return merge(parts);
}

/** 山門の屋根：棟から軒へ流れ、四隅が反り上がる曲面（入母屋風） */
function roofGeo(W: number, D: number, drop: number, lift: number): THREE.BufferGeometry {
  const nu = 40, nv = 20; const pos: number[] = [], idx: number[] = [], col: number[] = [];
  for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
    const u = (i / nu) * 2 - 1, v = (j / nv) * 2 - 1;
    const du = Math.max(0, (Math.abs(u) - 0.5) / 0.5), dv = Math.abs(v);
    const d = Math.pow(Math.pow(du, 3) + Math.pow(dv, 3), 1 / 3);           // 棟からの遠さ
    const corner = Math.pow(Math.abs(u), 3) * Math.pow(Math.abs(v), 1.5);
    const y = -drop * Math.pow(Math.min(d, 1.2), 0.8) + lift * (Math.pow(d, 3) * 0.3 + corner * 1.0) + Math.sin(u * 40) * 0.015;
    pos.push(u * W * (1 + 0.04 * dv * dv), y, v * D * (1 + 0.05 * u * u));
    const stripe = 0.92 + Math.sin(u * 150) * 0.05;
    col.push(0.56 * stripe, 0.63 * stripe, 0.7 * stripe, 0);
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d2 = c + 1; idx.push(a, c, b, b, c, d2); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4)); g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export interface PrologueScene { group: THREE.Group; update(dt: number, t: number, cam: THREE.Camera): void; jizoPos: THREE.Vector3; nioHome: [THREE.Vector3, THREE.Vector3]; setPhaseLook(phase: number): void; dispose(): void }

export async function buildPrologue(): Promise<PrologueScene> {
  const group = new THREE.Group();
  const r = rng(7);
  // 光と空気
  G.uLightDir.value.set(-0.5, 0.72, 0.48).normalize();
  G.uShadowTint.value.setRGB(0.62, 0.7, 0.86);
  G.uAerial.value.setRGB(0.87, 0.915, 0.92);
  G.uAerialK.value = 0.0085;
  const sky = makeSky({ top: 0xa3c3d0, mid: 0xcfe2e5, low: 0xf0f4f1, cloud: 0xfbf9f2, cloudAmt: 0.75, sun: 0xfffdf4, sunDir: new THREE.Vector3(-0.35, 0.42, -0.84) });
  group.add(sky);

  // 地面
  const gg = new THREE.PlaneGeometry(260, 260, 130, 130).rotateX(-Math.PI / 2);
  { const p = gg.getAttribute('position') as THREE.BufferAttribute; for (let i = 0; i < p.count; i++) p.setY(i, groundY(p.getX(i), p.getZ(i)) - (Math.abs(p.getX(i) - pathX(p.getZ(i))) < 2.6 && p.getZ(i) > STEP_Z0 ? 0.25 : 0)); gg.computeVertexNormals(); }
  colorize(gg, (x, _y, z) => {
    const rr = Math.hypot(x, z), n = fbm(x * 0.09, z * 0.09), court = 1 - Math.min(1, Math.max(0, (rr - COURT_R + 1.5) / 3));
    const moss: [number, number, number] = [0.38 + n * 0.12, 0.6 + n * 0.06, 0.44], earth: [number, number, number] = [0.72, 0.7, 0.62], stone: [number, number, number] = [0.8, 0.82, 0.8];
    const m = Math.min(1, Math.max(0, (n - 0.35) * 3));
    const base = [earth[0] + (moss[0] - earth[0]) * m, earth[1] + (moss[1] - earth[1]) * m, earth[2] + (moss[2] - earth[2]) * m];
    return [base[0] + (stone[0] - base[0]) * court, base[1] + (stone[1] - base[1]) * court, base[2] + (stone[2] - base[2]) * court, 0];
  });
  const ground = new THREE.Mesh(gg, wcMaterial({ vertexColors: true, worldAnchor: true, noiseScale: 0.55, bands: [0.5, 0.86], dens: [1.5, 1.0, 0.7], mottle: 1.0, grain: 0.6, dry: 0.22, line: 0.15, rim: 0 }));
  group.add(ground);

  // 石畳（前庭）：不揃いの敷石を写す
  const slab = wobble(new THREE.BoxGeometry(1, 0.12, 1, 3, 1, 3), 0.05, 2.2);
  const slabMat = wcMaterial({ tint: 0xd3d6d0, worldAnchor: true, noiseScale: 0.9, bands: [0.45, 0.8], dens: [1.6, 1.0, 0.55], mottle: 1.0, grain: 0.7, dry: 0.3, line: 0.55, rim: 0.2 });
  const slabs: THREE.Matrix4[] = [];
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), tr = new THREE.Vector3();
  for (let ring = 0; ring < 9; ring++) {
    const rad = 1.0 + ring * 1.62, n = Math.max(5, Math.round((rad * Math.PI * 2) / 2.0));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.37;
      q.setFromEuler(new THREE.Euler(0, -a + (r() - 0.5) * 0.12, 0));
      sc.set(1.42 + r() * 0.12, 1, (rad * Math.PI * 2) / n * 0.94);
      tr.set(Math.cos(a) * rad, -0.035 + r() * 0.015, Math.sin(a) * rad);
      slabs.push(m4.compose(tr, q, sc).clone());
    }
  }
  // 石段
  for (let i = 0; i < 30; i++) {
    const z = STEP_Z0 + i * STEP_RUN + STEP_RUN / 2;
    for (let k = -1; k <= 1; k++) {
      q.setFromEuler(new THREE.Euler(0, (r() - 0.5) * 0.05, 0));
      sc.set(1.55, 2.2, STEP_RUN * 1.04);
      tr.set(pathX(z) + k * 1.58 + (r() - 0.5) * 0.06, -(i + 1) * STEP_RISE - 0.13, z);
      slabs.push(m4.compose(tr, q, sc).clone());
    }
  }
  const slabI = new THREE.InstancedMesh(slab, slabMat, slabs.length);
  slabs.forEach((m, i) => slabI.setMatrixAt(i, m));
  group.add(slabI);

  // 杉木立
  const cedarMat = wcMaterial({ vertexColors: true, noiseScale: 0.42, bands: [0.38, 0.7], soft: 0.2, dens: [2.3, 1.45, 0.85], mottle: 1.5, grain: 0.6, dry: 0.45, rim: 0.6, line: 0.85, wind: 0.5, side: THREE.DoubleSide });
  const spots: [number, number, number][] = [];
  for (let i = 0; i < 400 && spots.length < 110; i++) {
    const x = (r() - 0.5) * 150, z = -60 + r() * 135;
    const rr = Math.hypot(x, z);
    if (rr < COURT_R + 4.5) continue;
    if (z > 8 && Math.abs(x - pathX(z)) < 5.2) continue;
    if (z < GATE_Z + 4 && Math.abs(x) < 15 && z > GATE_Z - 16) continue;
    if (spots.some(s => Math.hypot(s[0] - x, s[1] - z) < 5.5)) continue;
    spots.push([x, z, r()]);
  }
  // 参道の両脇に大杉を並べ、暗い幹で道を縁取る
  for (let z = STEP_Z0 + 2.5; z < STEP_Z1 + 8; z += 5.2) for (const sg of [1, -1]) { const x = pathX(z) + sg * (4.7 + r() * 2.2); if (Math.hypot(x - (pathX(STEP_Z0 + 13) - 3.1), z - (STEP_Z0 + 13)) > 3) spots.push([x, z + r() * 2, 0.5 + r() * 0.5]); }
  const nearOf = (sp: [number, number, number]) => Math.min(Math.hypot(sp[0], sp[1]), sp[1] > STEP_Z0 ? Math.abs(sp[0] - pathX(sp[1])) + 6 : 99) < 34;
  for (let v = 0; v < 4; v++) {
    const near = v >= 2;
    const list = spots.filter((sp, i) => i % 2 === v % 2 && nearOf(sp) === near);
    if (!list.length) continue;
    const im = new THREE.InstancedMesh(cedarGeo(31 + v * 17, near ? 2 : 1), cedarMat, list.length);
    list.forEach((sp, i) => {
      const k = 0.8 + sp[2] * 0.7;
      q.setFromEuler(new THREE.Euler((r() - 0.5) * 0.05, r() * 6.28, (r() - 0.5) * 0.05));
      im.setMatrixAt(i, m4.compose(tr.set(sp[0], groundY(sp[0], sp[1]) - 0.4, sp[1]), q, sc.set(k, k * (0.9 + r() * 0.3), k)));
    });
    im.frustumCulled = false;
    group.add(im);
  }

  // 遠くの山並み：淡い色面を重ねる（遠いほど淡く青く、裾は紙の白へ）
  for (let L = 0; L < 3; L++) {
    const R = 150 + L * 55, seg = 96; const pos: number[] = [], idx: number[] = [];
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      const hgt = 26 + L * 16 + fbm(i * 0.11 + L * 9, L * 3.3) * (46 + L * 22) + Math.sin(i * 0.21 + L) * 8;
      pos.push(Math.cos(a) * R, -12, Math.sin(a) * R, Math.cos(a) * R, hgt, Math.sin(a) * R);
      if (i < seg) { const o = i * 2; idx.push(o, o + 1, o + 2, o + 1, o + 3, o + 2); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const tint = new THREE.Color().setRGB(0.52 + L * 0.1, 0.66 + L * 0.07, 0.68 + L * 0.07);
    const mm = new THREE.Mesh(g, wcMaterial({ tint, worldAnchor: true, noiseScale: 0.05, flat: 1, dens: [1, 1.1 - L * 0.22, 1], mottle: 1.2, grain: 0.3, dry: 0.2, rim: 0, line: 0, aerial: 0.55 + L * 0.2, fadeY: [34 + L * 10, 2], side: THREE.DoubleSide }));
    mm.frustumCulled = false; group.add(mm);
  }

  // 山門
  const gate = new THREE.Group(); gate.position.set(0, 0, GATE_Z);
  const wood = wcMaterial({ tint: 0xbf8a78, worldAnchor: true, noiseScale: 0.8, bands: [0.42, 0.72], dens: [1.9, 1.05, 0.5], mottle: 1.0, grain: 0.32, dry: 0.18, rim: 0.5, line: 0.9 });
  const woodDark = wcMaterial({ tint: 0x7c82a0, worldAnchor: true, noiseScale: 0.8, dens: [1.6, 1.0, 0.6], mottle: 0.9, grain: 0.8, dry: 0.4, line: 0.6 });
  const plaster = wcMaterial({ tint: 0xf3efe6, worldAnchor: true, noiseScale: 0.7, dens: [1.3, 0.7, 0.2], mottle: 0.8, grain: 0.6, dry: 0.3, line: 0.6 });
  const tile = wcMaterial({ vertexColors: true, worldAnchor: true, noiseScale: 0.6, bands: [0.4, 0.74], dens: [1.5, 0.85, 0.35], mottle: 1.1, grain: 0.6, dry: 0.25, rim: 0.7, line: 0.9, side: THREE.DoubleSide });
  const stoneM = wcMaterial({ tint: 0xcdd1cc, worldAnchor: true, noiseScale: 0.9, dens: [1.6, 1.0, 0.5], mottle: 1.0, grain: 0.7, dry: 0.3, line: 0.7 });
  const add = (g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); gate.add(o); return o; };
  add(wobble(new THREE.BoxGeometry(21, 0.9, 9.5, 12, 1, 6), 0.08, 0.9), stoneM, 0, 0.3, 0);
  const colG = wobble(new THREE.CylinderGeometry(0.48, 0.56, 8.2, 12, 6), 0.05, 0.8);
  for (const x of [-8.6, -3.4, 3.4, 8.6]) for (const z of [-3.2, 3.2]) add(colG, wood, x, 4.7, z);
  add(wobble(new THREE.BoxGeometry(19.6, 0.7, 0.6, 14, 1, 1), 0.05, 0.8), wood, 0, 8.3, 3.2);
  add(wobble(new THREE.BoxGeometry(19.6, 0.7, 0.6, 14, 1, 1), 0.05, 0.8), wood, 0, 8.3, -3.2);
  add(wobble(new THREE.BoxGeometry(19.6, 0.45, 0.5, 14, 1, 1), 0.05, 0.8), wood, 0, 6.5, 3.2);
  // 欄間の白壁（鳥居ではなく楼門に見せる）
  add(wobble(new THREE.BoxGeometry(19.0, 1.4, 0.25, 14, 2, 1), 0.04, 0.9), plaster, 0, 7.4, 3.2);
  for (let i = -5; i <= 5; i++) add(new THREE.BoxGeometry(0.16, 1.3, 0.32), wood, i * 1.72, 7.4, 3.22);
  // 脇の間の壁（白壁）と奥の暗がり
  for (const sg of [1, -1]) { add(wobble(new THREE.BoxGeometry(5.0, 5.4, 0.3, 5, 5, 1), 0.04, 0.9), plaster, sg * 6.0, 3.6, -3.2); add(wobble(new THREE.BoxGeometry(0.3, 5.4, 6.2, 1, 5, 5), 0.04, 0.9), plaster, sg * 8.6, 3.6, 0); }
  // 組物の層と屋根
  add(wobble(new THREE.BoxGeometry(20.4, 1.0, 8.2, 12, 1, 6), 0.06, 0.9), woodDark, 0, 9.1, 0);
  add(roofGeo(13.6, 7.6, 4.3, 2.6), tile, 0, 13.7, 0);
  add(wobble(new THREE.BoxGeometry(14.0, 0.55, 0.6, 12, 1, 1), 0.05, 0.9), tile, 0, 13.85, 0);
  // 扁額
  add(new THREE.BoxGeometry(2.6, 1.3, 0.18), wcMaterial({ tint: 0x565d80, worldAnchor: true, dens: [1.8, 1.4, 1.0], line: 1 }), 0, 9.3, 4.25);
  // 石段（門へ上がる三段）
  for (let i = 0; i < 3; i++) add(wobble(new THREE.BoxGeometry(8.5 - i * 0.2, 0.26, 0.7, 8, 1, 1), 0.04, 1.2), stoneM, 0, 0.13 + i * 0.26 - 0.1, 6.2 - i * 0.7);
  group.add(gate);

  // 下草（羊歯）：弧を描く葉を放射状に
  {
    const blades: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 9; i++) {
      const ang = (i / 9) * 6.28 + r() * 0.5, len = 0.7 + r() * 0.5, seg = 5; const pos: number[] = [], col: number[] = [], idx: number[] = [];
      for (let k = 0; k <= seg; k++) {
        const t = k / seg, w = 0.16 * Math.sin(Math.PI * (0.15 + t * 0.85)), rad = len * t, y = Math.sin(t * 2.2) * len * 0.55;
        const cx = Math.cos(ang), cz = Math.sin(ang);
        pos.push(cx * rad - cz * w, y, cz * rad + cx * w, cx * rad + cz * w, y, cz * rad - cx * w);
        const g = 0.52 + t * 0.12 + r() * 0.05; col.push(0.42, g, 0.5, t * 0.6, 0.42, g, 0.5, t * 0.6);
        if (k < seg) { const o = k * 2; idx.push(o, o + 1, o + 2, o + 1, o + 3, o + 2); }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4)); g.setIndex(idx); g.computeVertexNormals();
      blades.push(g);
    }
    const fern = merge(blades);
    const fernMat = wcMaterial({ vertexColors: true, noiseScale: 1.2, bands: [0.4, 0.7], soft: 0.12, dens: [2.1, 1.35, 0.7], mottle: 1.3, grain: 0.5, dry: 0.3, rim: 0.3, line: 0.8, wind: 0.25, side: THREE.DoubleSide });
    const fs: [number, number][] = [];
    for (let i = 0; i < 150; i++) { const z = STEP_Z0 - 1 + r() * (STEP_Z1 - STEP_Z0 + 6), sg = r() < 0.5 ? -1 : 1; fs.push([pathX(z) + sg * (2.9 + r() * r() * 7), z]); }
    for (let i = 0; i < 70; i++) { const a2 = r() * 6.28, rad = COURT_R + 0.8 + r() * 6; const x = Math.cos(a2) * rad, z = Math.sin(a2) * rad; if (!(z < GATE_Z + 6 && Math.abs(x) < 12) && !(z > 0 && Math.abs(x) < 3)) fs.push([x, z]); }
    const fi = new THREE.InstancedMesh(fern, fernMat, fs.length);
    fs.forEach((f, i) => { const k = 0.45 + r() * 0.6; fi.setMatrixAt(i, m4.compose(tr.set(f[0], groundY(f[0], f[1]) - 0.05, f[1]), q.setFromEuler(new THREE.Euler(0, r() * 6.28, 0)), sc.set(k, k, k))); });
    fi.frustumCulled = false; group.add(fi);
  }

  // 石灯籠（参道の両脇）
  const lanternParts = [
    new THREE.CylinderGeometry(0.34, 0.42, 0.25, 8).translate(0, 0.12, 0), new THREE.CylinderGeometry(0.15, 0.2, 1.1, 8).translate(0, 0.8, 0),
    new THREE.CylinderGeometry(0.34, 0.2, 0.2, 8).translate(0, 1.45, 0), new THREE.BoxGeometry(0.44, 0.42, 0.44).translate(0, 1.76, 0),
    new THREE.ConeGeometry(0.6, 0.42, 8).translate(0, 2.18, 0), new THREE.SphereGeometry(0.11, 8, 6).translate(0, 2.45, 0),
  ].map(g => { const n = g.index ? g.toNonIndexed() : g; n.computeVertexNormals(); return n; });
  const lg = wobble(merge(lanternParts.map(g => { g.setIndex([...Array(g.getAttribute('position').count).keys()]); return g; })), 0.035, 2.0);
  const lanterns: [number, number][] = [[-5.2, 14.6], [5.2, 14.6], [-12.5, -6], [12.5, -6]];
  for (let i = 0; i < 5; i++) { const z = STEP_Z0 + 4 + i * 6; lanterns.push([pathX(z) + (i % 2 ? 3.3 : -3.3), z]); }
  const li = new THREE.InstancedMesh(lg, stoneM, lanterns.length);
  lanterns.forEach((l, i) => li.setMatrixAt(i, m4.compose(tr.set(l[0], groundY(l[0], l[1]) - 0.05, l[1]), q.setFromEuler(new THREE.Euler(0, r() * 3, 0)), sc.set(1.25, 1.25, 1.25))));
  group.add(li);

  // 地蔵菩薩（石像）
  const jz = STEP_Z0 + 13, jizoPos = new THREE.Vector3(pathX(jz) - 3.1, 0, jz); jizoPos.y = groundY(jizoPos.x, jizoPos.z);
  const jizo = new THREE.Mesh(await loadMesh('jizo'), wcMaterial({ vertexColors: true, noiseScale: 2.4, bands: [0.42, 0.7], dens: [1.6, 1.0, 0.45], mottle: 0.9, grain: 0.9, dry: 0.5, rim: 0.6, line: 1, emph: 0.5 }));
  jizo.position.copy(jizoPos); jizo.rotation.y = 1.25; jizo.scale.setScalar(1.15);
  group.add(jizo);

  // 霧：空間に置いた染み（紙の白で塗る）。ゆっくり流れる
  const mistMat = blotMaterial({ color: 0xf6f3ea, opacity: 0.5, soft: 0.85, edge: 0.0, billboard: true, drift: 1.0, white: 0.6 });
  const mistN = 46; const mist = new THREE.InstancedMesh(new THREE.PlaneGeometry(2, 2), mistMat, mistN);
  const seeds = new Float32Array(mistN * 4);
  for (let i = 0; i < mistN; i++) {
    const a = r() * 6.28, rad = 22 + r() * 70; let x = Math.cos(a) * rad, z = Math.sin(a) * rad;
    if (i < 12) { z = STEP_Z0 + 2 + r() * 30; x = pathX(z) + (r() < 0.5 ? -1 : 1) * (6 + r() * 12); }
    const w = 14 + r() * 22;
    mist.setMatrixAt(i, m4.compose(tr.set(x, groundY(x, z) + 2 + r() * 7, z), q.identity(), sc.set(w, w * (0.22 + r() * 0.2), 1)));
    seeds.set([r(), r(), r(), i < 12 ? 0.14 + r() * 0.1 : 0.3 + r() * 0.2], i * 4);
  }
  mist.geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4));
  mist.frustumCulled = false; mist.renderOrder = 5; group.add(mist);

  {
    const backMat = blotMaterial({ color: 0xfaf8f1, opacity: 0.85, soft: 0.8, edge: 0, white: 0.8 });
    const back = new THREE.InstancedMesh(new THREE.PlaneGeometry(2, 2), backMat, 3);
    const bs = new Float32Array(12);
    [[0, 5.2, GATE_Z - 6, 17, 7.5], [-9, 4.5, GATE_Z - 1, 9, 6], [9, 4.5, GATE_Z - 1, 9, 6]].forEach((b, i) => { back.setMatrixAt(i, m4.compose(tr.set(b[0], b[1], b[2]), q.identity(), sc.set(b[3], b[4], 1))); bs.set([r(), r(), r(), 0.5], i * 4); });
    back.geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(bs, 4));
    back.frustumCulled = false; back.renderOrder = 4; group.add(back);
  }
  // 木漏れ日の筋：塗り残しの白い筋
  const rayMat = blotMaterial({ color: 0xfffcf0, opacity: 0.2, soft: 0.9, edge: 0, streak: 0, white: 1 });
  const rays = new THREE.InstancedMesh(new THREE.PlaneGeometry(2, 2), rayMat, 7);
  const rs = new Float32Array(7 * 4);
  for (let i = 0; i < 7; i++) {
    const x = -16 + i * 5 + r() * 3, z = -6 + r() * 16;
    q.setFromEuler(new THREE.Euler(0, 0.5, -0.52));
    rays.setMatrixAt(i, m4.compose(tr.set(x, 13, z), q, sc.set(1.0 + r() * 1.2, 20, 1)));
    rs.set([r(), r(), r(), 0.35 + r() * 0.15], i * 4);
  }
  rays.geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(rs, 4));
  rays.frustumCulled = false; rays.renderOrder = 6; group.add(rays);

  // 舞う杉の葉・霧の粒
  const moteMat = blotMaterial({ color: 0x8fa9a2, opacity: 0.55, soft: 0.6, edge: 0.4, billboard: true });
  const moteN = 60; const motes = new THREE.InstancedMesh(new THREE.PlaneGeometry(2, 2), moteMat, moteN);
  const ms = new Float32Array(moteN * 4), mp: number[] = [];
  for (let i = 0; i < moteN; i++) { mp.push((r() - 0.5) * 44, r() * 12, (r() - 0.5) * 44 + 6, r() * 6.28); ms.set([r(), r(), r(), 0.3 + r() * 0.2], i * 4); }
  motes.geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(ms, 4));
  motes.frustumCulled = false; motes.renderOrder = 7; group.add(motes);

  const nioHome: [THREE.Vector3, THREE.Vector3] = [new THREE.Vector3(6.2, 0, GATE_Z + 7.4), new THREE.Vector3(-6.2, 0, GATE_Z + 7.4)];
  let look = 0, lookT = 0;
  return {
    group, jizoPos, nioHome,
    setPhaseLook(p: number) { lookT = p; },
    update(dt, t) {
      look += (lookT - look) * Math.min(1, dt * 0.5);
      // 段階が進むほど霧が晴れ、光が差す
      (mistMat.uniforms.uOpacity.value as number) = 0.5 - look * 0.09;
      mistMat.uniforms.uOpacity.value = 0.5 - look * 0.09;
      rayMat.uniforms.uOpacity.value = 0.12 + look * 0.09;
      G.uAerialK.value = 0.0085 - look * 0.0015;
      for (let i = 0; i < moteN; i++) {
        const o = i * 4, ph = mp[o + 3];
        const y = ((mp[o + 1] - t * (0.25 + (i % 5) * 0.06)) % 12 + 12) % 12;
        const s = 0.05 + (i % 4) * 0.02;
        motes.setMatrixAt(i, m4.compose(tr.set(mp[o] + Math.sin(t * 0.4 + ph) * 1.5, y, mp[o + 2] + Math.cos(t * 0.3 + ph) * 1.2), q.identity(), sc.set(s, s * 1.8, 1)));
      }
      motes.instanceMatrix.needsUpdate = true;
    },
    dispose() { group.traverse(o => { const m = o as THREE.Mesh; if (m.geometry) m.geometry.dispose(); }); },
  };
}

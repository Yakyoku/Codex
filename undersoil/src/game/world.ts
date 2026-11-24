// 種のまわりの土の一区画を、決まった乱数で組み立てる。1 単位 = 10 µm（主人公の身長 約 2 単位 = 20 µm）。
import * as THREE from 'three/webgpu';
import { loadGLB, loadTexture } from '../core/assets';
import { makeRng } from './rng';
import { makeSoilMaterial, type GrainKind } from './soilMaterial';
import { SoilGrid } from '../sim/soil';
import layout from '../data/stage1.layout.json';

export interface Collider { x: number; y: number; z: number; r: number; }
interface Placement { variant: string; lod: 0 | 1 | 2; pos: THREE.Vector3; quat: THREE.Quaternion; scale: THREE.Vector3; cell: number; seed: number; }
const VARIANTS: Record<GrainKind, string[]> = { quartz: ['quartz_a', 'quartz_b', 'quartz_c'], aggregate: ['aggregate_a', 'aggregate_b', 'aggregate_c'], humus: ['humus_a', 'humus_b', 'humus_c'], clay: ['clay_a'] };
const kindOf = (v: string) => v.split('_')[0] as GrainKind;

export interface World {
  group: THREE.Group; samples: THREE.Vector3[]; distToPath(p: THREE.Vector3): number; path: THREE.CatmullRomCurve3; colliders: Collider[]; grid: SoilGrid; cellCount: number;
  cellAt(p: THREE.Vector3): number; cellCenter(i: number): THREE.Vector3;
  /** 区画の状態（水・活力）を粒の見た目に反映する */
  syncWetness(): void;
  stats: { instances: number; triangles: number; drawCalls: number };
  cavern: { center: THREE.Vector3; radius: number };
  /** カメラの前にある、その種類の粒（紹介カードで指し示すため） */
  find(kind: GrainKind, from: THREE.Vector3, fwd: THREE.Vector3): { p: THREE.Vector3; r: number; geo?: THREE.BufferGeometry; matrix?: THREE.Matrix4 } | null;
}

export async function buildWorld(base: string, opts: { grainLod: 0 | 1; density: number; cheap?: boolean }): Promise<World> {
  const rng = makeRng(layout.seed);
  const path = new THREE.CatmullRomCurve3(layout.path.map((p) => new THREE.Vector3(p[0], p[1], p[2])), false, 'catmullrom', 0.5);
  const samples = path.getSpacedPoints(160);
  const N = layout.cells;
  const nearest = (p: THREE.Vector3) => { let bi = 0, bd = 1e9; for (let i = 0; i < samples.length; i++) { const d = samples[i].distanceToSquared(p); if (d < bd) { bd = d; bi = i; } } return { i: bi, d: Math.sqrt(bd) }; };
  const cellOfSample = (i: number) => Math.min(N - 1, Math.floor((i / (samples.length - 1)) * N));
  const seedC = new THREE.Vector3(...(layout.seedCenter as [number, number, number])), seedR = new THREE.Vector3(...(layout.seedRadii as [number, number, number]));
  const cav = layout.cavern as { center: [number, number, number]; radius: number };
  const cavC = new THREE.Vector3(...cav.center);
  const inCavern = (p: THREE.Vector3, pad: number) => p.distanceTo(cavC) < cav.radius + pad;
  const inSeed = (p: THREE.Vector3, pad: number) => { const dx = (p.x - seedC.x) / (seedR.x + pad), dy = (p.y - seedC.y) / (seedR.y + pad), dz = (p.z - seedC.z) / (seedR.z + pad); return dx * dx + dy * dy + dz * dz < 1; };

  const placements: Placement[] = []; const colliders: Collider[] = [];
  const euler = new THREE.Euler();
  const rq = () => new THREE.Quaternion().setFromEuler(euler.set(rng.range(0, 6.28), rng.range(0, 6.28), rng.range(0, 6.28)));
  // 1) 砂粒（石英）：道を空けて、すき間なく詰める。主人公から見れば岩山の大きさ
  const big: Collider[] = [];
  const B = layout.box;
  for (let k = 0; k < layout.bigTries; k++) {
    const r = rng.range(layout.bigRadius[0], layout.bigRadius[1]) * (k < layout.bigTries * 0.4 ? 1 : k < layout.bigTries * 0.75 ? 0.6 : 0.33);   // 大→中→小の順に、すき間を埋める
    const p = new THREE.Vector3(rng.range(B[0], B[1]), rng.range(B[2], B[3]), rng.range(B[4], B[5]));
    const n = nearest(p);
    const rc = layout.corridor * (0.8 + 0.5 * Math.sin(n.i * 0.21) ** 2);
    if (n.d < r * 0.92 + rc || inSeed(p, r * 0.7) || inCavern(p, r * 0.6)) continue;
    if (n.d > layout.shell + r) continue; // 道から遠すぎる粒は見えないので置かない
    if (big.some((o) => Math.hypot(o.x - p.x, o.y - p.y, o.z - p.z) < (o.r + r) * 0.72)) continue;
    big.push({ x: p.x, y: p.y, z: p.z, r });
    const isAgg = rng.next() < 0.22;
    placements.push({ variant: rng.pick(isAgg ? VARIANTS.aggregate : VARIANTS.quartz), lod: n.d < r + 14 ? opts.grainLod : 1, pos: p, quat: rq(),
      scale: new THREE.Vector3(r * rng.range(0.95, 1.12), r * rng.range(0.85, 1.05), r * rng.range(0.95, 1.12)), cell: cellOfSample(n.i), seed: rng.next() });
    colliders.push({ x: p.x, y: p.y, z: p.z, r: r * 0.9 });
  }
  // 1b) 寄せる：一番近い粒とのすき間が空いていたら、道をふさがない範囲で、接するまで寄せる
  const bigPl = placements.slice();
  for (let pass = 0; pass < 3; pass++) for (let i = 0; i < big.length; i++) {
    const a = big[i]; let bj = -1, bg = 1e9;
    for (let j = 0; j < big.length; j++) { if (j === i) continue; const b = big[j]; const g = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) - (a.r + b.r) * 0.95; if (g < bg) { bg = g; bj = j; } }
    if (bj < 0 || bg <= 0 || bg > a.r) continue;
    const b = big[bj], d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z), k = bg / d;
    const np = new THREE.Vector3(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, a.z + (b.z - a.z) * k);
    const nn = nearest(np); if (nn.d < a.r * 0.92 + layout.corridor * 0.8 || inCavern(np, a.r * 0.6)) continue;
    a.x = np.x; a.y = np.y; a.z = np.z; bigPl[i].pos.copy(np); colliders[i].x = np.x; colliders[i].y = np.y; colliders[i].z = np.z;
  }
  // 1c) 奥の壁：見える範囲の外にも粒を詰めて、真っ黒な空間をなくす（軽い LOD2、当たり判定なし）
  for (let k = 0; k < layout.wallTries; k++) {
    const r = rng.range(layout.bigRadius[0], layout.bigRadius[1]) * 0.8;
    const p = new THREE.Vector3(rng.range(B[0] - 30, B[1] + 20), rng.range(B[2] - 30, B[3] + 30), rng.range(B[4] - 30, B[5] + 30));
    const n = nearest(p); if (n.d < layout.shell + r * 0.5 || n.d > layout.shell + 45 || inSeed(p, r * 0.5)) continue;
    placements.push({ variant: rng.pick(rng.next() < 0.3 ? VARIANTS.aggregate : VARIANTS.quartz), lod: 2, pos: p, quat: rq(), scale: new THREE.Vector3(r, r * 0.9, r), cell: cellOfSample(n.i), seed: rng.next() });
  }
  // 2) シルト・団粒・腐植：道から外へ向かって進み、最初に当たった砂粒の表面に置く（下向きを多めに＝積もる）
  const dir = new THREE.Vector3(), q = new THREE.Vector3();
  const cast = (from: THREE.Vector3, d: THREE.Vector3, maxT: number) => { for (let t = 1; t < maxT; t += 0.6) { q.copy(from).addScaledVector(d, t); for (const o of big) if ((q.x - o.x) ** 2 + (q.y - o.y) ** 2 + (q.z - o.z) ** 2 < (o.r * 0.93) ** 2) return { t, o }; if (inSeed(q, 0)) return null; } return null; };
  const scatter = (count: number, kinds: [GrainKind, number][], rr: [number, number], embed: number, collide: boolean, flat = false) => {
    for (let k = 0; k < count; k++) {
      const si = rng.int(0, samples.length - 1);
      dir.set(rng.range(-1, 1), rng.range(-1, 1) - (rng.next() < 0.55 ? 0.9 : 0), rng.range(-1, 1)).normalize();
      const hit = cast(samples[si], dir, layout.shell); if (!hit) continue;
      const r = rr[0] + (rr[1] - rr[0]) * rng.next() ** 2;
      const pos = samples[si].clone().addScaledVector(dir, hit.t - r * embed);
      let x = rng.next(), kind: GrainKind = kinds[0][0]; for (const [kd, w] of kinds) { if (x < w) { kind = kd; break; } x -= w; }
      const nrm = new THREE.Vector3(pos.x - hit.o.x, pos.y - hit.o.y, pos.z - hit.o.z).normalize();
      const quat = flat ? new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), nrm).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rng.range(0, 6.28))) : rq();
      placements.push({ variant: rng.pick(VARIANTS[kind]), lod: (() => { const dp = nearest(pos).d; return r > 2.6 ? (dp < 12 ? opts.grainLod : 1) : dp < 9 ? (r > 0.9 && opts.grainLod === 0 ? 0 : 1) : 2; })(), pos, quat, scale: new THREE.Vector3(r * rng.range(0.85, 1.15), r * rng.range(0.8, 1.1), r * rng.range(0.85, 1.15)), cell: cellOfSample(si), seed: rng.next() });
      if (collide && r > 1.6) colliders.push({ x: pos.x, y: pos.y, z: pos.z, r: r * 0.85 });
    }
  };
  // 2b) 接点：粒と粒が接している所には、細かい粒と団粒がたまる
  for (let i = 0; i < big.length; i++) for (let j = i + 1; j < big.length; j++) {
    const a = big[i], b = big[j], d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z); if (d > (a.r + b.r) * 1.02) continue;
    const t = a.r / (a.r + b.r), c = new THREE.Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
    if (nearest(c).d > 22) continue;
    const ax = new THREE.Vector3(b.x - a.x, b.y - a.y, b.z - a.z).normalize(), u = new THREE.Vector3(rng.range(-1, 1), rng.range(-1, 1), rng.range(-1, 1)).cross(ax).normalize(), w = ax.clone().cross(u);
    const ring = Math.min(a.r, b.r) * 0.45, cnt = Math.round(rng.range(4, 9) * opts.density);
    for (let k = 0; k < cnt; k++) { const ang = rng.range(0, 6.28), rr = ring * rng.range(0.8, 1.15), r = rng.range(0.4, 1.6) * (rng.next() < 0.2 ? 1.8 : 1);
      const pos = c.clone().addScaledVector(u, Math.cos(ang) * rr).addScaledVector(w, Math.sin(ang) * rr);
      const kind: GrainKind = rng.next() < 0.6 ? 'aggregate' : rng.next() < 0.6 ? 'quartz' : 'humus';
      placements.push({ variant: rng.pick(VARIANTS[kind]), lod: r > 1.4 && nearest(pos).d < 10 ? 1 : 2, pos, quat: rq(), scale: new THREE.Vector3(r, r * 0.85, r), cell: cellOfSample(nearest(pos).i), seed: rng.next() }); }
  }
  scatter(Math.round(layout.midCount * opts.density), [['aggregate', 0.5], ['quartz', 0.3], ['humus', 0.2]], layout.midRadius as [number, number], 0.35, true);
  scatter(Math.round(layout.smallCount * opts.density), [['aggregate', 0.45], ['humus', 0.25], ['quartz', 0.3]], layout.smallRadius as [number, number], 0.2, false);
  scatter(Math.round(layout.clayCount * opts.density), [['clay', 1]], layout.clayRadius as [number, number], -0.05, false, true);

  // 3) 素材を読み、種類×LOD ごとにインスタンス描画にまとめる
  const names = [...new Set(placements.map((p) => p.variant))];
  const detail = await loadTexture(base, 'tex/soil_detail.webp', { repeat: true });
  const loaded = new Map<string, { geo: THREE.BufferGeometry[]; na: THREE.Texture[] }>();
  await Promise.all(names.map(async (nm) => {
    const [g, na0, na1, na2] = await Promise.all([loadGLB(base, `models/grains/${nm}.glb`), loadTexture(base, `models/grains/${nm}_na.webp`), loadTexture(base, `models/grains/${nm}_lod1_na.webp`), loadTexture(base, `models/grains/${nm}_lod2_na.webp`)]);
    const geo: THREE.BufferGeometry[] = [];
    for (const l of [0, 1, 2]) { const o = g.scene.getObjectByName(`${nm}_LOD${l}`) as THREE.Mesh; geo[l] = o.geometry; }
    loaded.set(nm, { geo, na: [na0, na1, na2] });
  }));
  const group = new THREE.Group(); group.name = 'soil';
  const batches: { wet: THREE.InstancedBufferAttribute; cells: Uint16Array }[] = [];
  const stats = { instances: placements.length, triangles: 0, drawCalls: 0 };
  const m4 = new THREE.Matrix4();
  for (const nm of names) for (const lod of [0, 1, 2] as const) {
    const list = placements.filter((p) => p.variant === nm && p.lod === lod); if (!list.length) continue;
    const L = loaded.get(nm)!;
    const wet = new THREE.InstancedBufferAttribute(new Float32Array(list.length), 1); wet.setUsage(THREE.DynamicDrawUsage);
    const seedA = new THREE.InstancedBufferAttribute(new Float32Array(list.map((p) => p.seed)), 1);
    const mesh = new THREE.InstancedMesh(L.geo[lod], makeSoilMaterial(kindOf(nm), L.na[lod], detail, wet, seedA, { cheap: opts.cheap, style: nm === 'humus_a' ? 'charcoal' : nm === 'humus_b' ? 'tissue' : nm === 'humus_c' ? 'pellet' : undefined }), list.length);
    list.forEach((p, i) => mesh.setMatrixAt(i, m4.compose(p.pos, p.quat, p.scale)));
    mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); mesh.name = `${nm}_L${lod}`;
    mesh.castShadow = lod === 0; mesh.receiveShadow = true;
    group.add(mesh); batches.push({ wet, cells: Uint16Array.from(list.map((p) => p.cell)) });
    stats.triangles += (L.geo[lod].index!.count / 3) * list.length; stats.drawCalls++;
  }
  // 4) 区画（セル）：道に沿って並べ、隣どうしは「水の橋」がかかるまでつながらない
  const grid = new SoilGrid(N);
  const centers = Array.from({ length: N }, (_, i) => path.getPointAt((i + 0.5) / N));
  const world: World = {
    cavern: { center: cavC, radius: cav.radius }, group, samples, distToPath: (p) => nearest(p).d, path, colliders, grid, cellCount: N, stats,
    cellAt: (p) => cellOfSample(nearest(p).i), cellCenter: (i) => centers[i],
    find(kind, from, fwd) {
      let best: Placement | null = null, bs = -1; const d = new THREE.Vector3();
      for (const pl of placements) {
        if (kindOf(pl.variant) !== kind) continue;
        d.subVectors(pl.pos, from); const dist = d.length(), r = Math.max(pl.scale.x, pl.scale.y, pl.scale.z);
        if (dist < r + 1.5 || dist > 45) continue; const cos = d.dot(fwd) / dist; if (cos < 0.82) continue;
        const sc = (cos - 0.82) * Math.min(1, r / Math.max(0.5, dist * 0.08)) / (1 + dist * 0.04); if (sc > bs) { bs = sc; best = pl; }
      }
      if (!best) return null;
      const b = best as Placement; const L = loaded.get(b.variant);
      return { p: b.pos.clone(), r: Math.max(b.scale.x, b.scale.y, b.scale.z), geo: L?.geo[b.lod], matrix: new THREE.Matrix4().compose(b.pos, b.quat, b.scale) };
    },
    syncWetness() {
      for (const b of batches) {
        const a = b.wet.array as Float32Array; let changed = false;
        for (let i = 0; i < a.length; i++) { const c = grid.cells[b.cells[i]]; const v = Math.min(1, c.water * 0.85 + c.structure * 0.15 * c.water); if (Math.abs(a[i] - v) > 0.004) { a[i] = v; changed = true; } }
        if (changed) b.wet.needsUpdate = true;
      }
    },
  };
  return world;
}

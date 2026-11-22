// SDF の造形をメッシュに焼いて public/models/*.bin に書き出す。 使い方: npx tsx tools/bake.ts [名前...]
import { writeFileSync } from 'node:fs';
import { meshSdf, packMesh, type Sdf, type V3 } from '../src/engine/sdf';
import { BONES } from '../src/models/skeleton';
import { nioBody, nioHead, vajra } from '../src/models/nio.def';

interface Job { name: string; sdf: () => Sdf; min: V3; max: V3; cell: number }
const jobs: Job[] = [
  { name: 'nio-body', sdf: nioBody, min: [-1.2, -0.03, -0.45], max: [1.2, 2.4, 0.4], cell: 0.0165 },
  { name: 'nio-head-a', sdf: () => nioHead(true), min: [-0.16, 1.64, -0.17], max: [0.16, 2.16, 0.2], cell: 0.0046 },
  { name: 'nio-head-un', sdf: () => nioHead(false), min: [-0.16, 1.64, -0.17], max: [0.16, 2.16, 0.2], cell: 0.0046 },
  { name: 'vajra', sdf: vajra, min: [-0.07, -0.37, -0.07], max: [0.07, 0.37, 0.07], cell: 0.008 },
];
try { const m = await import('../src/models/monk.def'); jobs.push(...(m.MONK_JOBS as Job[])); } catch (e) { if (!String(e).includes('Cannot find')) throw e; }
try { const m = await import('../src/models/props.def'); jobs.push(...(m.PROP_JOBS as Job[])); } catch (e) { if (!String(e).includes('Cannot find')) throw e; }
const want = process.argv.slice(2);
for (const j of jobs) {
  if (want.length && !want.some(w => j.name.startsWith(w))) continue;
  const t = Date.now();
  const m = meshSdf(j.sdf(), j.min, j.max, j.cell, BONES.length);
  const bin = packMesh(m);
  writeFileSync(new URL(`../public/models/${j.name}.bin`, import.meta.url), bin);
  console.log(`${j.name}: verts ${m.pos.length / 3}, tris ${m.idx.length / 3}, ${(bin.length / 1024).toFixed(0)}KB, ${Date.now() - t}ms`);
}

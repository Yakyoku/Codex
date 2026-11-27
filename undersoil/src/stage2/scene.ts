// ステージ2「根のまわり」の場面（区域 1：根毛の森）。ステージ1と同じ基盤（土の粒・水の橋・細菌・光）を使い、根と根毛を足す。
import * as THREE from 'three/webgpu';
import quality from '../data/quality.json';
import type { QualityTier } from '../core/platform';
import { buildWorld, type Layout } from '../game/world';
import { buildBridges } from '../game/water';
import { buildSwarm } from '../game/swarm';
import { addLights, makeEnvironment } from '../game/env';
import { buildFibres } from '../game/fibres';
import { buildRoot } from './root';
import zone1 from '../data/stage2.zone1.layout.json';

export async function createStage2(renderer: THREE.WebGPURenderer, base: string, tier: QualityTier) {
  const q = (quality as Record<string, (typeof quality)['pc-high']>)[tier];
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0d0a08); scene.fog = new THREE.FogExp2(0x0d0a08, 0.02);
  const camera = new THREE.PerspectiveCamera(58, 1, 0.08, 400);
  const lite = tier === 'vr' || tier === 'compat';
  const world = await buildWorld(base, { grainLod: q.grainLod as 0 | 1, density: q.grainCount, cheap: tier === 'vr', lite, far3: tier === 'mobile-high', layout: zone1 as unknown as Layout });
  scene.add(world.group);
  const bridges = buildBridges(world.colliders, world.samples, world.cellAt, { refraction: 'env', max: tier === 'vr' ? 60 : 220 }); scene.add(bridges.mesh);
  const nSw = q.swarmGpu ? Math.min(q.swarm, 12000) : q.swarm;
  const swarm = buildSwarm(world.colliders, world.cellAt, world.distToPath, Math.round(nSw * 0.4), 'bacillus');
  const swarm2 = buildSwarm(world.colliders, world.cellAt, world.distToPath, Math.round(nSw * 0.6), 'pseudomonas');   // 根のまわりは、シュードモナスが多い
  scene.add(swarm.mesh, swarm2.mesh);
  scene.add(buildFibres(world.colliders, world.distToPath, lite ? 40 : 90));
  const root = buildRoot((zone1 as unknown as { root: { a: number[]; b: number[]; radius: number } }).root, world.colliders, { hairs: lite ? 500 : 1500 }); scene.add(root.group);
  scene.environment = makeEnvironment(renderer); scene.environmentIntensity = 0.55;
  const lights = addLights(scene, camera, { shadows: q.shadows });
  const syncAll = () => { world.syncWetness(); bridges.sync((c) => world.grid.cells[c].water); swarm.sync((c) => world.grid.cells[c].microbes); swarm2.sync((c) => world.grid.cells[c].microbes); };
  let acc = 0, syncT = 0, grow = 0;
  return {
    scene, camera, world, root, lights, q, tier,
    update(dt: number) {
      acc += Math.min(dt, 0.1); while (acc >= 0.1) { world.grid.step(0.1); acc -= 0.1; }
      syncT += dt; if (syncT > 0.1) { syncT = 0; syncAll(); }
      grow += (world.grid.mean() - grow) * (1 - Math.exp(-dt * 0.4)); root.setGrow(grow);   // 土の活力が上がると、根毛が伸び、根がしっとりする
    },
    setWetAll(v: number) { for (const c of world.grid.cells) { c.water = v; c.structure = 0.15 + 0.85 * v; c.microbes = v; c.carbon = v; } for (let i = 0; i < 6; i++) syncAll(); grow = v; root.setGrow(v); },
  };
}

// 画面版と VR 版で共通のゲーム本体。差し替えるのは、カメラ・操作・UI・描画の密度だけ。
import * as THREE from 'three/webgpu';
import quality from '../data/quality.json';
import type { QualityTier } from '../core/platform';
import { buildWorld, type World } from './world';
import { buildBridges, type WaterBridges } from './water';
import { buildSwarm, type Swarm } from './swarm';
import { buildCreatures, type Creatures } from './creatures';
import { addLights, makeEnvironment, type Lights } from './env';

export interface Game { focus: { value: number }; scene: THREE.Scene; camera: THREE.PerspectiveCamera; world: World; lights: Lights; bridges: WaterBridges; swarm: Swarm; creatures: Creatures; tier: QualityTier; q: (typeof quality)['pc-high']; update(dt: number, t: number): void; setWetAll(v: number): void; }

export async function createGame(renderer: THREE.WebGPURenderer, base: string, tier: QualityTier): Promise<Game> {
  const q = (quality as Record<string, (typeof quality)['pc-high']>)[tier];
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0a08);
  scene.fog = new THREE.FogExp2(0x0d0a08, 0.02);   // 奥は真っ黒ではなく、土の色の暗がりに溶ける
  const camera = new THREE.PerspectiveCamera(58, 1, 0.08, 400);
  const world = await buildWorld(base, { grainLod: q.grainLod as 0 | 1, density: q.grainCount, cheap: tier === 'vr' });
  scene.add(world.group);
  const bridges = buildBridges(world.colliders, world.samples, world.cellAt, { refraction: 'env', max: tier === 'vr' ? 60 : 220 });
  scene.add(bridges.mesh);
  const swarm = buildSwarm(world.colliders, world.cellAt, world.distToPath, q.swarmGpu ? Math.min(q.swarm, 12000) : q.swarm);
  scene.add(swarm.mesh);
  const creatures = await buildCreatures(base, world, { lod: tier === 'vr' ? 1 : 0, count: tier === 'vr' ? 2 : 3 });
  scene.add(creatures.group); if (typeof location !== 'undefined' && new URLSearchParams(location.search).has('nocreatures')) creatures.group.visible = false;
  const syncAll = () => { world.syncWetness(); bridges.sync((c) => world.grid.cells[c].water); swarm.sync((c) => world.grid.cells[c].microbes); };
  scene.environment = makeEnvironment(renderer);
  scene.environmentIntensity = 0.55;
  const lights = addLights(scene, camera, { shadows: q.shadows });
  let acc = 0, syncT = 0;
  return {
    scene, camera, world, lights, bridges, swarm, creatures, tier, q, focus: { value: 12 },
    update(dt, _t) {
      creatures.update(dt, _t);
      acc += Math.min(dt, 0.1);
      while (acc >= 0.1) { world.grid.step(0.1); acc -= 0.1; }
      syncT += dt; if (syncT > 0.1) { syncT = 0; syncAll(); }
    },
    setWetAll(v) { for (const c of world.grid.cells) { c.water = v; c.structure = 0.15 + 0.85 * v; c.microbes = v; c.carbon = v; } for (let i = 0; i < 6; i++) syncAll(); for (let i = 0; i < 30; i++) creatures.update(0.2, 3); },
  };
}

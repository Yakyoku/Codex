// 画面版と VR 版で共通のゲーム本体。差し替えるのは、カメラ・操作・UI・描画の密度だけ。
import * as THREE from 'three/webgpu';
import quality from '../data/quality.json';
import type { QualityTier } from '../core/platform';
import { buildWorld, type World } from './world';
import { buildBridges, type WaterBridges } from './water';
import { buildSwarm, type Swarm } from './swarm';
import { buildCreatures, type Creatures } from './creatures';
import { buildTardigrade, type Tardigrade } from './tardigrade';
import { buildSeed } from './seed';
import { buildSeedLife } from './seedLife';
import { buildHypha, type Hypha, type HyphaOpts } from './hypha';
import HYPHA from '../data/hypha.json';
import { buildFibres } from './fibres';
import layout from '../data/stage1.layout.json';
import { addLights, makeEnvironment, type Lights } from './env';

export interface Game { focus: { value: number }; scene: THREE.Scene; camera: THREE.PerspectiveCamera; world: World; lights: Lights; bridges: WaterBridges; swarm: Swarm; swarm2: Swarm; creatures: Creatures; tardigrade: Tardigrade; tier: QualityTier; q: (typeof quality)['pc-high']; seed: THREE.Mesh; seedLife: ReturnType<typeof buildSeedLife>; hypha: Hypha; readonly wake: number; readonly root: number; update(dt: number, t: number): void; setWetAll(v: number): void; }

export async function createGame(renderer: THREE.WebGPURenderer, base: string, tier: QualityTier): Promise<Game> {
  const q = (quality as Record<string, (typeof quality)['pc-high']>)[tier];
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0a08);
  scene.fog = new THREE.FogExp2(0x0d0a08, 0.02);   // 奥は真っ黒ではなく、土の色の暗がりに溶ける
  const camera = new THREE.PerspectiveCamera(58, 1, 0.08, 400);
  const world = await buildWorld(base, { grainLod: q.grainLod as 0 | 1, density: q.grainCount, cheap: tier === 'vr', lite: tier === 'vr' || tier === 'compat', far3: tier === 'mobile-high' });   // モバイル高画質も、遠くの粒は 80 面の形（iPhone Air の診断：248 万で低い瞬間 22〜29 fps）   // 互換・VR は、中くらいの細かさを道のそばだけに（三角形の予算）
  scene.add(world.group);
  const bridges = buildBridges(world.colliders, world.samples, world.cellAt, { refraction: 'env', max: tier === 'vr' ? 60 : 220 });
  scene.add(bridges.mesh);
  const nSw = q.swarmGpu ? Math.min(q.swarm, 12000) : q.swarm;
  const swarm = buildSwarm(world.colliders, world.cellAt, world.distToPath, Math.round(nSw * 0.65), 'bacillus');
  const swarm2 = buildSwarm(world.colliders, world.cellAt, world.distToPath, Math.round(nSw * 0.35), 'pseudomonas');
  scene.add(swarm.mesh, swarm2.mesh);
  const creatures = await buildCreatures(base, world, { lod: tier === 'vr' ? 1 : 0, count: tier === 'vr' ? 2 : 3 });
  scene.add(creatures.group); if (typeof location !== 'undefined' && new URLSearchParams(location.search).has('nocreatures')) creatures.group.visible = false;
  const tardigrade = await buildTardigrade(base, world, tier === 'vr' ? 1 : 0);
  scene.add(tardigrade.group);
  // 植物の繊維のかけら（腐植の一部）。本物の土の「ごちゃごちゃした細部」
  scene.add(buildFibres(world.colliders, world.distToPath, tier === 'vr' ? 30 : tier === 'compat' ? 50 : 110));
  // 吸水したシロツメクサの種：道の終わりの先。種のまわりは粒を置いていない（world.ts の inSeed）
  const seed = buildSeed(new THREE.Vector3(...(layout.seedCenter as [number, number, number])), { segments: tier === 'vr' || tier === 'compat' ? 64 : 128, knob: new THREE.Vector3(...(layout.seedKnob as [number, number, number])) });
  scene.add(seed);
  const lite = tier === 'vr' || tier === 'compat';
  const seedLife = buildSeedLife(seed, { cells: lite ? 300 : 900, plumes: lite ? 8 : 14 }); scene.add(seedLife.group);
  // 菌根菌の菌糸：区域 A の終わりの胞子から、道に沿って種の岸まで（数値は src/data/hypha.json。出典は Docs/REFERENCE/am-fungus.md）
  const hypha = buildHypha(world, seed.position, { ...(HYPHA as unknown as HyphaOpts), lite }); scene.add(hypha.group);
  let wake = 0, root = 0;
  { const hq = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('hide') : null; if (hq) scene.traverse((o) => { if (hq.split(',').some((h) => o.name.startsWith(h))) o.visible = false; }); }
  const syncAll = () => { world.syncWetness(); bridges.sync((c) => world.grid.cells[c].water); swarm.sync((c) => world.grid.cells[c].microbes); swarm2.sync((c) => world.grid.cells[c].microbes * (world.grid.cells[c].water > 0.6 ? 1 : 0)); };   // シュードモナスは、水が十分にあるときだけ泳ぐ
  scene.environment = makeEnvironment(renderer);
  scene.environmentIntensity = 0.55;
  const lights = addLights(scene, camera, { shadows: q.shadows });
  let acc = 0, syncT = 0;
  return {
    scene, camera, world, lights, bridges, swarm, swarm2, creatures, tardigrade, tier, q, focus: { value: 12 }, seed, seedLife, hypha,
    get wake() { return wake; }, get root() { return root; },
    update(dt, _t) {
      creatures.update(dt, _t); tardigrade.update(dt, _t); bridges.tick(dt); hypha.update(dt, world.grid.mean());
      acc += Math.min(dt, 0.1);
      while (acc >= 0.1) { world.grid.step(0.1); acc -= 0.1; }
      syncT += dt; if (syncT > 0.1) { syncT = 0; syncAll(); }
      // 種の目覚め：道の終わりの区画の水と、区画全体の活力から。十分に目覚めると、幼根が少しずつのぞく
      { const last = world.grid.cells[world.grid.cells.length - 1]; const want = Math.min(1, last.water * 0.55 + world.grid.mean() * 0.6);
        wake += (want - wake) * (1 - Math.exp(-dt * 0.5)); root = Math.min(1, Math.max(0, root + (wake > 0.7 ? dt / 40 : -dt / 60))); seedLife.set(wake, root); }
    },
    setWetAll(v) { for (const c of world.grid.cells) { c.water = v; c.structure = 0.15 + 0.85 * v; c.microbes = v; c.carbon = v; } for (let i = 0; i < 6; i++) syncAll(); for (let i = 0; i < 30; i++) creatures.update(0.2, 3); for (let i = 0; i < 80; i++) tardigrade.update(0.2, 3); wake = v; root = v > 0.9 ? 1 : 0; seedLife.set(wake, root); },
  };
}

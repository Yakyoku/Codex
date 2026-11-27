// ステージ2「根のまわり」（制作中）の確認用ページ。ステージ1とは別のページ・別のかたまりとして、あとから読み込む。
import * as THREE from 'three/webgpu';
import { uniform } from 'three/tsl';
import '../ui/base.css';
import '../ui/game.css';
import { createRenderer } from '../core/renderer';
import { detectDevice, pickTier, rendererPref, type QualityTier } from '../core/platform';
import { savedTier } from '../ui/settings';
import { createStage2 } from '../stage2/scene';
import { makePost } from '../game/post';
import { makeHud } from './hud';

const errors: string[] = []; addEventListener('error', (e) => errors.push(e.message)); addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));
const W = window as unknown as Record<string, unknown>; const $ = (id: string) => document.getElementById(id)!;
async function main() {
  const Q = new URLSearchParams(location.search); const canvas = $('view') as HTMLCanvasElement; const device = detectDevice();
  const { renderer, isWebGPU } = await createRenderer(canvas, rendererPref());
  const tier = (Q.get('tier') as QualityTier | null) ?? (savedTier() as QualityTier | null) ?? pickTier(device, isWebGPU);
  const hud = makeHud($('hud'), { device, isWebGPU, tier });
  const st = await createStage2(renderer, '../', tier); const { scene, camera, world } = st;
  const focus = uniform(14);
  const post = Q.has('nopost') || !st.q.post.length ? null : makePost(renderer, scene, camera, st.q.post, { distance: focus as never, range: 9, bokeh: 2.2 });
  const resize = () => { renderer.setPixelRatio(Math.min(devicePixelRatio, st.q.maxDpr)); renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); };
  addEventListener('resize', resize); resize();
  if (Q.get('wet') !== null) st.setWetAll(Number(Q.get('wet')));
  let target = Q.get('wet') !== null ? Number(Q.get('wet')) : 0, cur = target;
  $('rich').addEventListener('click', () => { target = 1; }); $('poor').addEventListener('click', () => { target = 0; });
  const look = new THREE.Vector3(); const camT = Q.get('cam'), dbg = Q.get('pos'), freeze = Number(Q.get('freeze') ?? 0);
  // カメラ：道に沿ってゆっくり往復し、根のほうを少し向く
  const place = (u: number) => { world.path.getPointAt(Math.min(0.985, u), camera.position); world.path.getPointAt(Math.min(1, u + 0.06), look); camera.position.y += 1.0; const rc = st.root.curve.getPointAt(Math.min(1, 0.27 + u * 0.44)); look.lerp(rc, 0.35); camera.lookAt(look); };
  await renderer.compileAsync(scene, camera);
  let last = 0, frames = 0, tu = 0.02;
  const frame = (now: number) => {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    if (Math.abs(target - cur) > 0.002) { cur += Math.sign(target - cur) * Math.min(Math.abs(target - cur), dt * 0.12); st.setWetAll(cur); }
    if (dbg) { const v = dbg.split(',').map(Number); camera.position.set(v[0], v[1], v[2]); camera.lookAt(v[3], v[4], v[5]); }
    else if (camT !== null) place(Number(camT)); else { tu = (tu + dt * 0.012) % 1; place(0.02 + 0.9 * (0.5 - 0.5 * Math.cos(tu * Math.PI * 2))); }
    st.update(dt);
    if (post) post.render(); else renderer.render(scene, camera);
    hud.tick(now); frames++;
    const frozen = freeze > 0 && frames >= freeze; if (frozen) renderer.setAnimationLoop(null);
    W.__state = { ready: frames > 3, frozen, frames, isWebGPU, tier, device, errors, stats: world.stats, hairs: st.root.hairCount };
  };
  renderer.setAnimationLoop(frame);
}
main().catch((e) => { errors.push(String(e)); console.error(e); W.__state = { ready: false, failed: true, errors }; });

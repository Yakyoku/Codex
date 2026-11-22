import * as THREE from 'three/webgpu';
import '../ui/base.css';
import '../ui/game.css';
import { createRenderer } from '../core/renderer';
import { setProgressListener } from '../core/assets';
import { detectDevice } from '../core/platform';
import { createGame } from '../game/game';
import { makeDemo } from '../game/demo';
import { pushOut } from '../game/controls';
import { makeHud } from './hud';

const errors: string[] = [];
addEventListener('error', (e) => errors.push(e.message));
addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));
const W = window as unknown as Record<string, unknown>;
const $ = (id: string) => document.getElementById(id)!;
/** VR の中での縮尺：身長 1.7 m の人が、土の中では 2 単位（20 µm）になる */
const RIG_SCALE = 2 / 1.7;

async function main() {
  const canvas = $('view') as HTMLCanvasElement;
  const btn = $('enterVR') as HTMLButtonElement; const msg = $('vrMsg');
  const device = detectDevice();
  setProgressListener((d, t) => { msg.textContent = `読み込み中… ${Math.round((d / Math.max(1, t)) * 100)}%`; });
  // VR 中は WebGL 2 で動かす（Quest 3 のブラウザでは VR 中の WebGPU がまだ試験的なため）
  const { renderer, isWebGPU } = await createRenderer(canvas, 'webgl2', { xr: true });
  renderer.xr.enabled = true; renderer.xr.setReferenceSpaceType('local-floor'); renderer.xr.setFoveation(1);
  const hud = makeHud($('hud'), { device, isWebGPU, tier: 'vr' });
  const game = await createGame(renderer, '../', 'vr');
  const { scene, camera, world } = game;
  // リグ：プレイヤーの体の位置。カメラ（頭）はこの中で、ヘッドセットの動きだけで動く。演出でカメラを勝手に動かさない
  const rig = new THREE.Group(); rig.scale.setScalar(RIG_SCALE); scene.add(rig); rig.add(camera);
  const start = world.path.getPointAt(0.03); rig.position.copy(start); rig.position.y -= 1.2;
  const ahead = world.path.getPointAt(0.09); rig.rotation.y = Math.atan2(-(ahead.x - start.x), -(ahead.z - start.z));
  camera.position.set(0, 1.25, 0); // ヘッドセットなしの確認用：座った目の高さ
  const demo = makeDemo(world);
  const resize = () => { if (renderer.xr.isPresenting) return; renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); };
  addEventListener('resize', resize); resize();

  // 画面上での見回し（ヘッドセットなしの確認用）
  let yaw = 0, pitch = 0, drag = false, px = 0, py = 0;
  canvas.addEventListener('pointerdown', (e) => { drag = true; px = e.clientX; py = e.clientY; });
  addEventListener('pointerup', () => { drag = false; });
  addEventListener('pointermove', (e) => { if (!drag || renderer.xr.isPresenting) return; yaw -= (e.clientX - px) * 0.004; pitch = Math.max(-1.2, Math.min(1.2, pitch - (e.clientY - py) * 0.004)); px = e.clientX; py = e.clientY; });

  const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
  let supported = false;
  try { supported = !!xr && await xr.isSessionSupported('immersive-vr'); } catch { supported = false; }
  await renderer.compileAsync(scene, camera);
  if (!supported) { btn.disabled = true; msg.textContent = 'このブラウザは VR に対応していません。Meta Quest 3 の標準ブラウザで開いてください。画面をドラッグすると見回せます。'; }
  else msg.textContent = '座って遊ぶのがおすすめです。左スティックで移動、右スティックで向きを変えます。ときどき休憩をとり、気分が悪くなったらすぐに中断してください。';
  setTimeout(() => demo.start(), 4000);
  let session: XRSession | null = null;
  btn.addEventListener('click', async () => {
    if (session) { await session.end(); return; }
    try {
      session = await xr!.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] });
      session.addEventListener('end', () => { session = null; btn.textContent = 'VR で遊ぶ'; document.body.classList.remove('in-vr'); camera.position.set(0, 1.25, 0); resize(); });
      await renderer.xr.setSession(session);
      btn.textContent = 'VR を終了'; document.body.classList.add('in-vr');
    } catch (e) { msg.textContent = 'VR を開始できませんでした：' + (e as Error).message; errors.push(String(e)); }
  });

  // 移動：左スティックで、頭の向きへなめらかに（速度は控えめ、加減速は穏やか）。右スティックは 30 度ずつ向きを変える
  const vel = new THREE.Vector3(), want = new THREE.Vector3(), head = new THREE.Vector3(), fwd = new THREE.Vector3(), right = new THREE.Vector3(), q = new THREE.Quaternion();
  let snapReady = true, frames = 0, last = 0;
  renderer.setAnimationLoop((now: number) => {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    if (renderer.xr.isPresenting && session) {
      let mx = 0, mz = 0, tx = 0;
      for (const src of session.inputSources) { const a = src.gamepad?.axes; if (!a) continue; const x = a[2] ?? a[0] ?? 0, y = a[3] ?? a[1] ?? 0; if (src.handedness === 'left') { mx = Math.abs(x) > 0.15 ? x : 0; mz = Math.abs(y) > 0.15 ? y : 0; } else if (src.handedness === 'right') tx = x; }
      if (Math.abs(tx) > 0.6 && snapReady) { rig.rotation.y -= Math.sign(tx) * Math.PI / 6; snapReady = false; } else if (Math.abs(tx) < 0.3) snapReady = true;
      const xrCam = renderer.xr.getCamera(); xrCam.getWorldQuaternion(q);
      fwd.set(0, 0, -1).applyQuaternion(q); right.set(1, 0, 0).applyQuaternion(q);
      want.set(0, 0, 0).addScaledVector(fwd, -mz).addScaledVector(right, mx); if (want.lengthSq() > 1) want.normalize();
      vel.lerp(want.multiplyScalar(3.2), 1 - Math.exp(-dt * 3));
      rig.position.addScaledVector(vel, dt);
      // 頭の位置で粒との当たりを取り、ずれた分だけ体を戻す
      xrCam.getWorldPosition(head); const before = head.clone(); pushOut(head, world.colliders, 0.7); rig.position.add(head.sub(before));
    } else camera.rotation.set(pitch, yaw, 0, 'YXZ');
    demo.update(dt); game.update(dt, now / 1000);
    renderer.render(scene, camera);
    hud.tick(now); frames++;
    W.__state = { ready: frames > 3, frames, isWebGPU, supported, presenting: renderer.xr.isPresenting, errors, stats: world.stats };
  });
}
main().catch((e) => { errors.push(String(e)); console.error(e); $('vrMsg').textContent = '起動に失敗しました：' + String(e); W.__state = { ready: false, failed: true, errors }; });

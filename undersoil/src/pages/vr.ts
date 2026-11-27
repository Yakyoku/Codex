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
import { buildSurface } from '../game/surface';
import { makeTools } from '../game/tools';

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
  // 地上の場面（芽生え）：1 単位 = 1 mm。座った目の高さ 1.25 m を、地面から約 14 mm の高さにする（芽を、ひざの前の小さな木のように見下ろす）
  const surface = await buildSurface(renderer, '../', { shadows: false, density: 0.5 });
  // VR では顔を上げると空が見えるので、明け方の淡い空の色にし、地面の端は同じ色の霧に溶かす
  { const sky = new THREE.Color(0xcdd8de); surface.scene.background = sky; if (surface.scene.fog) (surface.scene.fog as THREE.Fog).color = sky; else surface.scene.fog = new THREE.Fog(sky, 18, 34); }
  const sRig = new THREE.Group(); sRig.scale.setScalar(14 / 1.25); surface.scene.add(sRig);
  sRig.position.set(-11, surface.groundY - 0.5, 10); sRig.rotation.y = Math.atan2(-11, 10);   // 芽（原点）のほうを向く（−Z が前なので、向き (11, −10) になる角度）
  let where: 'soil' | 'surface' = 'soil', growT = 0, fadeT = 0, pending: 'soil' | 'surface' | null = null;
  /** 場面の切り替え：一瞬暗くしてから、カメラ（頭）を別のリグに付けかえる。カメラを勝手に動かさない */
  const goTo = (w: 'soil' | 'surface') => { if (w === where || pending) return; pending = w; fadeT = 0.35; };
  const doSwitch = () => { if (!pending) return; where = pending; pending = null; (where === 'surface' ? sRig : rig).add(camera); growT = 0; surface.setGrowth(0); if (!renderer.xr.isPresenting) pitch = where === 'surface' ? -0.75 : 0; toggleBtn.textContent = where === 'soil' ? '地上を見る' : '土の中へ戻る'; };
  const toggleBtn = document.createElement('button'); toggleBtn.className = 'btn'; toggleBtn.textContent = '地上を見る'; document.querySelector('.nav')!.prepend(toggleBtn);
  toggleBtn.addEventListener('click', () => goTo(where === 'soil' ? 'surface' : 'soil'));
  // ---- M2：VR の道具と、酔いにくさの設定
  const tools = makeTools(scene, camera, world, game.seed.position, () => { /* 音は M3 */ }, (p, k) => { game.swarm.attract(p, k); game.swarm2.attract(p, k); });
  const opt = (id: string, key: string) => { const el = $(id) as HTMLSelectElement; try { const v = localStorage.getItem(key); if (v) el.value = v; } catch { /* noop */ } el.addEventListener('change', () => { try { localStorage.setItem(key, el.value); } catch { /* noop */ } }); return el; };
  const optSnap = opt('optSnap', 'undersoil.vr.snap'), optVig = opt('optVig', 'undersoil.vr.vig'), optSpeed = opt('optSpeed', 'undersoil.vr.speed');
  // 視野のまわりを暗くする輪（動いている間だけ。トンネル効果で酔いを減らす）
  const vig = new THREE.Mesh(new THREE.RingGeometry(0.19, 1.2, 48), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false }));
  vig.position.z = -0.3; vig.renderOrder = 999; vig.frustumCulled = false; camera.add(vig);
  // 手：0・1 番のコントローラー。左右は接続時に分かる
  const hands: { left: THREE.Object3D | null; right: THREE.Object3D | null } = { left: null, right: null };
  for (const i of [0, 1]) { const c = renderer.xr.getController(i); rig.add(c);
    c.addEventListener('connected', (e) => { const h = (e as unknown as { data: XRInputSource }).data.handedness; if (h === 'left') { hands.left = c; c.add(wrist); } else if (h === 'right') hands.right = c; });
    c.addEventListener('selectstart', () => { if (c === hands.right && where === 'soil') tools.sugar(c.getWorldPosition(new THREE.Vector3())); });
    c.addEventListener('squeezestart', () => { if (c === hands.right) { if (where === 'soil') tools.water(c.getWorldPosition(new THREE.Vector3())); } else goTo(where === 'soil' ? 'surface' : 'soil'); }); }
  // 手首の画面（スキャン）：左手の甲の上の小さな板。顔のほうへ向けると見える
  const wc = document.createElement('canvas'); wc.width = 512; wc.height = 384; const wctx = wc.getContext('2d')!; const wtex = new THREE.CanvasTexture(wc); wtex.colorSpace = THREE.SRGBColorSpace;
  const wrist = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.12), new THREE.MeshBasicMaterial({ map: wtex, transparent: true, opacity: 0, depthTest: false, fog: false }));
  wrist.position.set(0, 0.07, 0.03); wrist.rotation.x = -Math.PI / 2.6; wrist.renderOrder = 998;
  let wristT = 0;
  const drawWrist = (pos: THREE.Vector3) => {
    const r = tools.read(pos), g = wctx; g.clearRect(0, 0, 512, 384); g.fillStyle = 'rgba(8,20,22,.9)'; g.fillRect(0, 0, 512, 384); g.strokeStyle = '#78dcdc'; g.lineWidth = 3; g.strokeRect(2, 2, 508, 380);
    g.fillStyle = '#8fe6e0'; g.font = 'bold 30px sans-serif'; g.fillText(`スキャン　区画 ${r.cell + 1}`, 20, 44);
    const rows: [string, number][] = [['水', r.water], ['糖', r.carbon], ['微生物', r.microbes], ['団粒', r.structure]];
    rows.forEach(([n, v], k) => { const y = 84 + k * 44; g.fillStyle = '#d8f3f0'; g.font = '26px sans-serif'; g.fillText(n, 20, y + 8); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(130, y - 12, 300, 18); g.fillStyle = '#6fd6cf'; g.fillRect(130, y - 12, 300 * v, 18); g.fillStyle = '#d8f3f0'; g.fillText(String(Math.round(v * 100)), 445, y + 8); });
    g.fillStyle = '#ffd27a'; g.font = 'bold 28px sans-serif'; g.fillText(`土の活力 ${Math.round(r.vitality * 100)}%　水 ${tools.tank}　糖 ${tools.stock}`, 20, 276);
    r.all.forEach((v, k) => { g.fillStyle = `hsl(${Math.round(12 + v * 160)} 55% ${Math.round(22 + v * 22)}%)`; g.fillRect(20 + k * (472 / r.all.length), 296, 472 / r.all.length - 3, 20); if (k === r.cell) { g.strokeStyle = '#ffd27a'; g.strokeRect(20 + k * (472 / r.all.length) - 1, 294, 472 / r.all.length - 1, 24); } });
    g.fillStyle = '#ffe2a8'; g.font = '20px sans-serif'; g.fillText(tools.message.slice(0, 26), 20, 356);
    wtex.needsUpdate = true;
  };
  const demo = makeDemo(world);
  const resize = () => { if (renderer.xr.isPresenting) return; renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); };
  addEventListener('resize', resize); resize();

  // 画面上での見回し（ヘッドセットなしの確認用）
  let yaw = 0, pitch = 0, drag = false, px = 0, py = 0;
  canvas.addEventListener('pointerdown', (e) => { drag = true; px = e.clientX; py = e.clientY; });
  addEventListener('pointerup', () => { drag = false; });
  addEventListener('pointermove', (e) => { if (!drag || renderer.xr.isPresenting) return; yaw -= (e.clientX - px) * 0.004; pitch = Math.max(-1.2, Math.min(1.2, pitch - (e.clientY - py) * 0.004)); px = e.clientX; py = e.clientY; });

  // 確認用：?scene=surface&g=0..1 で、地上の場面から始める
  { const Q = new URLSearchParams(location.search); if (Q.get('scene') === 'surface') { pending = 'surface'; doSwitch(); growT = Number(Q.get('g') ?? 0) * 26; surface.setGrowth(Math.min(1, growT / 26)); } }
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
    if (fadeT > 0) { fadeT -= dt; if (fadeT <= 0.17 && pending) doSwitch(); }
    if (where === 'surface') { growT += dt; surface.setGrowth(Math.min(1, growT / 26)); surface.update(dt, now / 1000); }
    if (renderer.xr.isPresenting && session) {
      if (where === 'surface') { /* 地上では移動しない（向きを変えるだけ） */ }
      let mx = 0, mz = 0, tx = 0;
      for (const src of session.inputSources) { const a = src.gamepad?.axes; if (!a) continue; const x = a[2] ?? a[0] ?? 0, y = a[3] ?? a[1] ?? 0; if (src.handedness === 'left') { mx = Math.abs(x) > 0.15 ? x : 0; mz = Math.abs(y) > 0.15 ? y : 0; } else if (src.handedness === 'right') tx = x; }
      if (Math.abs(tx) > 0.6 && snapReady) { rig.rotation.y -= Math.sign(tx) * Number(optSnap.value) * Math.PI / 180; snapReady = false; } else if (Math.abs(tx) < 0.3) snapReady = true;
      const xrCam = renderer.xr.getCamera(); xrCam.getWorldQuaternion(q);
      fwd.set(0, 0, -1).applyQuaternion(q); right.set(1, 0, 0).applyQuaternion(q);
      want.set(0, 0, 0).addScaledVector(fwd, -mz).addScaledVector(right, mx); if (want.lengthSq() > 1) want.normalize();
      vel.lerp(want.multiplyScalar(3.2 * Number(optSpeed.value)), 1 - Math.exp(-dt * 3));
      if (where === 'soil') rig.position.addScaledVector(vel, dt);
      // 頭の位置で粒との当たりを取り、ずれた分だけ体を戻す
      if (where === 'soil') { xrCam.getWorldPosition(head); const before = head.clone(); pushOut(head, world.colliders, 0.7); rig.position.add(head.sub(before)); }
    } else camera.rotation.set(pitch, yaw, 0, 'YXZ');
    { // 道具と酔いにくさ
      const headW = (renderer.xr.isPresenting ? renderer.xr.getCamera() : camera).getWorldPosition(new THREE.Vector3());
      tools.update(dt, headW);
      // 手ならではのふれ合い：水のある所に手を入れると、まわりの細菌が手から逃げる（糖のしずくを置いていないとき）
      if (renderer.xr.isPresenting && where === 'soil' && tools.stock === 3) { const h = hands.right ?? hands.left; if (h) { const hp = h.getWorldPosition(new THREE.Vector3()); const wet = world.grid.cells[world.cellAt(hp)]?.water ?? 0; const k = wet > 0.4 ? -0.5 : 0; game.swarm.attract(hp, k); game.swarm2.attract(hp, k); } }
      const mvig = vig.material as THREE.MeshBasicMaterial; const wantV = optVig.value === 'on' && renderer.xr.isPresenting && where === 'soil' ? Math.min(0.85, vel.length() / 2.2) : 0; mvig.opacity += (wantV - mvig.opacity) * (1 - Math.exp(-dt * 6)); vig.visible = mvig.opacity > 0.01;
      if (hands.left) { // 手首の板が顔のほうを向いているときだけ出す
        const wp = wrist.getWorldPosition(new THREE.Vector3()), n = new THREE.Vector3(0, 0, 1).transformDirection(wrist.matrixWorld), facing = n.dot(headW.clone().sub(wp).normalize());
        const wm = wrist.material as THREE.MeshBasicMaterial; wm.opacity += ((facing > 0.55 && where === 'soil' ? 1 : 0) - wm.opacity) * (1 - Math.exp(-dt * 8)); wrist.visible = wm.opacity > 0.02;
        wristT -= dt; if (wrist.visible && wristT <= 0) { wristT = 0.4; drawWrist(headW); }
      }
    }
    demo.update(dt); game.update(dt, now / 1000);
    if (fadeT > 0) { renderer.setClearColor(0x000000, 1); renderer.clear(); }   // 切り替えの暗転
    else renderer.render(where === 'soil' ? scene : surface.scene, camera);
    hud.tick(now); frames++;
    W.__state = { ready: frames > 3, frames, isWebGPU, supported, presenting: renderer.xr.isPresenting, errors, stats: world.stats };
  });
}
main().catch((e) => { errors.push(String(e)); console.error(e); $('vrMsg').textContent = '起動に失敗しました：' + String(e); W.__state = { ready: false, failed: true, errors }; });

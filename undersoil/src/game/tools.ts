// 道具（M2）：スキャンと、糖のしずく。どちらもスーツの道具で、表示はスーツの画面の表示として見せる（生き物の性質には見せない）。
// ・スキャン：いまいる区画の、水・糖・微生物・団粒と活力を読み、いちばん足りないものと、その理由を教える
// ・糖のしずく：種からしみ出した糖をためておき、置いた区画の微生物を増やす。しずくは水に溶けて、少しずつ小さくなる
import * as THREE from 'three/webgpu';
import { float, vec3, pow, oneMinus, saturate, dot, normalView, positionViewDirection } from 'three/tsl';
import type { World } from './world';
import { pushOut } from './controls';
import { soilUniforms } from './soilMaterial';

const DBG_SCAN = typeof location !== 'undefined' && location.search.includes('scan=1');   // 確認用
export function makeTools(scene: THREE.Scene, camera: THREE.Camera, world: World, seedPos: THREE.Vector3, chime: () => void, attract?: (p: THREE.Vector3 | null, k: number) => void) {
  // ---- 画面：スキャンの板と、糖の残り
  const panel = document.createElement('div'); panel.className = 'scan'; document.body.append(panel);
  const pulse = document.createElement('div'); pulse.className = 'scan-pulse'; document.body.append(pulse);
  const toast = document.createElement('div'); toast.className = 'tool-toast'; document.body.append(toast);
  let panelT = 0, toastT = 0;
  const say = (t: string) => { toast.textContent = t; toast.classList.add('on'); toastT = 3.2; };
  const bar = (name: string, v: number, hint: string) => `<div class="scan-row"><span>${name}</span><div class="scan-bar"><i style="width:${Math.round(v * 100)}%"></i></div><b>${Math.round(v * 100)}</b><small>${hint}</small></div>`;
  const scan = () => {
    const i = world.cellAt(camera.position), c = world.grid.cells[i], v = world.grid.vitality(i);
    const lacks: [number, string][] = [[c.water, '水が足りません。「水を運ぶ」で、水の橋をつなごう'], [c.microbes, c.water < 0.3 ? '微生物は眠っています。まず水が必要です' : '微生物が少ない。糖のしずくを置くと増えます'], [c.structure, '団粒が育っていません。微生物が増えると、のりで粒がまとまります']];
    lacks.sort((a, b) => a[0] - b[0]);
    panel.innerHTML = `<h3>スキャン<small>スーツの画面・区画 ${i + 1}</small></h3>
      ${bar('水（みず）', c.water, '')}${bar('糖（とう）', c.carbon, '')}${bar('微生物（びせいぶつ）', c.microbes, '')}${bar('団粒（だんりゅう）', c.structure, '')}
      <div class="scan-v">土の活力 <b>${Math.round(v * 100)}%</b></div>
      <p>${v > 0.75 ? 'この区画は、生き物に満ちています。' : lacks[0][0] > 0.55 ? 'もう少しです。水と糖が行きわたると、活力が上がります。' : lacks[0][1]}</p>`;
    panel.classList.add('on'); panelT = 7; pulse.classList.remove('go'); void pulse.offsetWidth; pulse.classList.add('go'); chime();
  };
  // ---- 糖のしずく
  let stock = 3, pull = 0; const MAX = 3;
  const dropGeo = new THREE.SphereGeometry(1, 20, 14);
  const dropMat = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false });
  { const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), float(2.0));
    dropMat.colorNode = vec3(0.55, 0.36, 0.08); dropMat.roughnessNode = float(0.08); dropMat.clearcoatNode = float(1);
    dropMat.emissiveNode = vec3(0.5, 0.3, 0.06).mul(rim.mul(0.6).add(0.12)); dropMat.opacityNode = rim.mul(0.5).add(0.4); }
  const drops: { m: THREE.Mesh; t: number; cell: number }[] = [];
  const sugar = () => {
    if (stock <= 0) { say('糖（とう）がありません。種（たね）のそばで補給できます'); return; }
    const p = camera.position.clone().add(new THREE.Vector3(0, -0.35, -3.0).applyQuaternion(camera.quaternion)); pushOut(p, world.colliders, 0.45);
    const m = new THREE.Mesh(dropGeo, dropMat); m.position.copy(p); m.scale.setScalar(0.22); m.name = 'sugar_drop'; scene.add(m);
    const cell = world.cellAt(p); drops.push({ m, t: 0, cell }); stock--; pull = 0; chime();
    say(world.grid.cells[cell].water < 0.3 ? `糖のしずくを置きました（残り ${stock}）。ここは乾いていて、微生物はまだ眠っています` : `糖のしずくを置きました（残り ${stock}）。微生物が集まって増えます`);
  };
  return {
    scan, sugar,
    get stock() { return stock; },
    update(dt: number) {
      if (panelT > 0) { panelT -= dt; if (panelT <= 0) panel.classList.remove('on'); }
      soilUniforms.scan.value += ((panelT > 0 || DBG_SCAN ? 1 : 0) - soilUniforms.scan.value) * (1 - Math.exp(-dt * 4));   // スキャン中だけ、粒に活力の色
      if (toastT > 0) { toastT -= dt; if (toastT <= 0) toast.classList.remove('on'); }
      // しずくは 25 秒かけて水に溶け、その間、区画に糖を渡す（水がないと溶けない）
      for (let k = drops.length - 1; k >= 0; k--) {
        const d = drops[k], wet = world.grid.cells[d.cell].water;
        const rate = wet > 0.25 ? 1 : 0.08; d.t += dt * rate; world.grid.addCarbon(d.cell, 0.4 * dt * rate / 25);
        const s = 0.22 * Math.max(0, 1 - d.t / 25) ** 0.5;   // 直径 約 4µm のしずく d.m.scale.setScalar(Math.max(0.001, s));
        if (d.t >= 25) { scene.remove(d.m); drops.splice(k, 1); }
      }
      // 細菌は糖の濃いほうへ集まる（走化性）。いちばん新しいしずくへ、数秒かけて寄ってくる。水がないと動けない
      { const d = drops[drops.length - 1]; if (d && world.grid.cells[d.cell].water > 0.25) { pull = Math.min(1, pull + dt / 6); attract?.(d.m.position, pull * Math.max(0, 1 - d.t / 25) ** 0.3); } else { pull = 0; attract?.(null, 0); } }
      // 種のそばで補給（種からしみ出した糖をもらう）
      if (stock < MAX && camera.position.distanceTo(seedPos) < 80) { stock = MAX; say('種（たね）からしみ出した糖を補給しました（3 つ）'); }
    },
  };
}

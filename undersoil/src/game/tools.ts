// 道具（M2）：スキャンと、糖のしずく。どちらもスーツの道具で、表示はスーツの画面の表示として見せる（生き物の性質には見せない）。
// ・スキャン：いまいる区画の、水・糖・微生物・団粒と活力を読み、いちばん足りないものと、その理由を教える
// ・糖のしずく：種からしみ出した糖をためておき、置いた区画の微生物を増やす。しずくは水に溶けて、少しずつ小さくなる
import * as THREE from 'three/webgpu';
import { float, vec3, pow, oneMinus, saturate, dot, normalView, positionViewDirection } from 'three/tsl';
import type { World } from './world';
import { pushOut } from './controls';
import { soilUniforms } from './soilMaterial';

const DBG_SCAN = typeof location !== 'undefined' && location.search.includes('scan=1');   // 確認用
export function makeTools(scene: THREE.Scene, camera: THREE.Camera, world: World, seedPos: THREE.Vector3, chime: () => void, attract?: (p: THREE.Vector3 | null, k: number) => void, fx?: (k: 'pour' | 'link' | 'wind' | 'awake') => void) {
  // ---- 画面：スキャンの板と、糖の残り
  const panel = document.createElement('div'); panel.className = 'scan'; document.body.append(panel);
  const pulse = document.createElement('div'); pulse.className = 'scan-pulse'; document.body.append(pulse);
  const toast = document.createElement('div'); toast.className = 'tool-toast'; document.body.append(toast);
  let panelT = 0, toastT = 0;
  let lastSay = '';
  const say = (t: string) => { lastSay = t; toast.textContent = t; toast.classList.add('on'); toastT = 3.2; };
  const bar = (name: string, v: number, hint: string) => `<div class="scan-row"><span>${name}</span><div class="scan-bar"><i style="width:${Math.round(v * 100)}%"></i></div><b>${Math.round(v * 100)}</b><small>${hint}</small></div>`;
  /** 次にどこへ運ぶとよいか：入口から見て、最初に水の足りない区画 */
  const next = () => { const k = world.grid.cells.findIndex((c) => c.water < 0.4); const here = world.cellAt(camera.position);
    return k < 0 ? '道ぞいの区画すべてに、水が行きわたっています' : k === here ? '▼ ここに水が必要です' : `つぎは <b>区画 ${k + 1}</b>（${k > here ? '種のほう' : '入口のほう'}へ ${Math.abs(k - here)} つ）に水を`; };
  let scans = 0;
  const scan = () => { scans++;
    const i = world.cellAt(camera.position), c = world.grid.cells[i], v = world.grid.vitality(i);
    const lacks: [number, string][] = [[c.water, '水が足りません。「水を運ぶ」で、水の橋をつなごう'], [c.microbes, c.water < 0.3 ? '微生物は眠っています。まず水が必要です' : '微生物が少ない。糖のしずくを置くと増えます'], [c.structure, '団粒が育っていません。微生物が増えると、のりで粒がまとまります']];
    lacks.sort((a, b) => a[0] - b[0]);
    panel.innerHTML = `<h3>スキャン<small>スーツの画面・区画 ${i + 1}</small></h3>
      ${bar('水（みず）', c.water, '')}${bar('糖（とう）', c.carbon, '')}${bar('微生物（びせいぶつ）', c.microbes, '')}${bar('団粒（だんりゅう）', c.structure, '')}
      <div class="scan-strip"><span>入口</span>${world.grid.cells.map((_, k) => { const vv = world.grid.vitality(k); return `<i class="${k === i ? 'me' : ''}" style="background:hsl(${Math.round(12 + vv * 160)} 55% ${Math.round(22 + vv * 22)}%)" title="${Math.round(vv * 100)}"></i>`; }).join('')}<span>種</span></div>
      <div class="scan-next">${next()}</div>
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
  const sugar = (at?: THREE.Vector3) => {
    if (stock <= 0) { say('糖（とう）がありません。種（たね）のそばで補給できます'); return false; }
    const p = at ? at.clone() : camera.position.clone().add(new THREE.Vector3(0, -0.35, -3.0).applyQuaternion(camera.quaternion)); pushOut(p, world.colliders, 0.45);
    const m = new THREE.Mesh(dropGeo, dropMat); m.position.copy(p); m.scale.setScalar(0.22); m.name = 'sugar_drop'; scene.add(m);
    const cell = world.cellAt(p); drops.push({ m, t: 0, cell }); stock--; pull = 0; stats.sugars++; chime();
    say(world.grid.cells[cell].water < 0.3 ? `糖のしずくを置きました（残り ${stock}）。ここは乾いていて、微生物はまだ眠っています` : `糖のしずくを置きました（残り ${stock}）。微生物が集まって増えます`);
    return true;
  };
  // ---- 水を運ぶ（ステージ1の固有の遊び）：水のある区画でくみ、乾いた区画でまく。となりの区画にも水があれば、水の橋がかかってつながる
  let tank = 0; const TANK = 3;
  const stats = { pours: 0, links: 0, sugars: 0, awakened: 0, windSurvived: false };
  // 水をまいた瞬間のしぶき：透明な輪が広がって消える（水の橋が伸びる手ごたえ）
  const splashes: { m: THREE.Mesh; t: number }[] = [];
  const splashMat = new THREE.MeshBasicMaterial({ color: 0x9fd8e8, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide });
  const splash = (p: THREE.Vector3, big: boolean) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), splashMat.clone()); m.position.copy(p); m.scale.setScalar(0.3); m.userData.big = big; scene.add(m); splashes.push({ m, t: 0 }); };
  // 山場「乾きの風」：水が 5 区画に行きわたると、乾いた風が 45 秒吹く。その間、水は 6 倍の速さで乾く。水の橋を保てるか
  let wind: 'wait' | 'on' | 'done' = 'wait', windT = 0, windArmed = false; const awake = new Set<number>();
  const windEl = document.createElement('div'); windEl.className = 'wind'; document.body.append(windEl);
  const water = (pos?: THREE.Vector3) => {
    const i = world.cellAt(pos ?? camera.position), g = world.grid, c = g.cells[i];
    if (wind !== 'on') for (const cc of g.cells) cc.dryness = 1;
    if (tank < TANK && (i === 0 || c.water > 0.6)) {   // 入口の区画には、地上から雨水がしみ込んでくる（いつでもくめる）
      tank = TANK; if (i === 0) { g.addWater(0, 0.7); g.addCarbon(0, 0.15); } else c.water = Math.max(0.45, c.water - 0.1);
      chime(); say(i === 0 ? '入口にしみ込む雨水（あまみず）をくみました（3 回ぶん）' : '水をくみました（3 回ぶん）'); return 'take';
    }
    if (tank <= 0) { say('水がありません。入口（地図の左）か、水のある区画でくめます'); return 'empty'; }
    tank--; g.addWater(i, 0.55); g.addCarbon(i, 0.08); (fx ? fx('pour') : chime()); stats.pours++;
    let linked = false; for (const j of [i - 1, i + 1]) if (j >= 0 && j < g.count && g.cells[j].water > 0.3 && !g.links[i].has(j)) { g.link(i, j); linked = true; stats.links++; }
    splash(pos ?? camera.position.clone().add(new THREE.Vector3(0, -0.4, -2.5).applyQuaternion(camera.quaternion)), linked); if (linked) setTimeout(() => (fx ? fx('link') : chime()), 180);
    say(linked ? `水をまきました（残り ${tank}）。となりの区画と、水の橋（はし）がつながりました！` : `水をまきました（残り ${tank}）。となりにも水があると、水の橋がかかります`); return 'pour';
  };
  return {
    scan, sugar, water, stats, get tank() { return tank; }, get wind() { return wind; }, get scans() { return scans; }, /** 山場を始める（道しるべから呼ぶ） */ startWind() { if (wind === 'wait') windArmed = true; }, /** 風のあと、種のまわりが乾いていたら、もう一度挑める */ retryWind() { if (wind === 'done' && !stats.windSurvived) { wind = 'wait'; windArmed = true; say('種のまわりに水が戻りました。もう一度、乾きの風が来ます'); } }, get message() { return lastSay; },
    /** VR の手首の画面用：いまいる区画の数字 */
    read(pos?: THREE.Vector3) { const i = world.cellAt(pos ?? camera.position), c = world.grid.cells[i]; return { cell: i, water: c.water, carbon: c.carbon, microbes: c.microbes, structure: c.structure, vitality: world.grid.vitality(i), all: world.grid.cells.map((_, k) => world.grid.vitality(k)) }; },
    get stock() { return stock; },
    /** pos：プレイヤーの位置（VR では頭の位置を渡す） */
    update(dt: number, pos?: THREE.Vector3) {
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
      for (let k = splashes.length - 1; k >= 0; k--) { const sp = splashes[k]; sp.t += dt; const u = sp.t / (sp.m.userData.big ? 1.4 : 0.8); sp.m.scale.setScalar(0.3 + u * (sp.m.userData.big ? 5 : 2.2)); (sp.m.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - u); if (u >= 1) { scene.remove(sp.m); splashes.splice(k, 1); } }
      // 区画の目覚め：活力がしきい値を超えた区画を、はじめての 1 回だけ知らせる
      { const g = world.grid; for (let k = 0; k < g.count; k++) if (!awake.has(k) && g.awakened(k)) { awake.add(k); stats.awakened = awake.size; if (stats.pours > 0) { (fx ? fx('awake') : chime()); say(k < 4 ? `区画 ${k + 1} が目覚めました。眠っていた細菌が、泳ぎ出しています` : k < 8 ? `区画 ${k + 1} が目覚めました。細菌を食べるコルポダが、殻から出てきます` : `区画 ${k + 1} が目覚めました。種（たね）まで、あと少しです`); } } }
      // 乾きの風（設計 GDD 4 の 5）：地表から乾いた空気が下りてきて、入口の側から順に水の膜が切れていく。
      // 切れる前に水を補い、種のまわり（区画 10〜12）の水をつなぎ続ける。失敗しても、乾いた所が休眠に戻るだけで、やり直せる
      { const g = world.grid, N = g.count, DUR = 60;
        if (wind === 'wait' && windArmed) { wind = 'on'; windT = DUR; windEl.innerHTML = '<b>乾（かわ）きの風（かぜ）</b><span>入口の側から、水の膜が切れていきます。水を補って、種のまわりの水を守ろう</span><i></i>'; windEl.classList.add('on'); (fx ? fx('wind') : chime()); }
        if (wind === 'on') { windT -= dt; (windEl.querySelector('i') as HTMLElement).style.width = Math.max(0, windT / DUR * 100) + '%';
          const front = (1 - windT / DUR) * (N + 2);                       // 乾いた空気の先頭（区画の番号）。入口から種へ進む
          for (let k = 0; k < N; k++) { g.cells[k].dryness = k < front ? 12 : 1.5; if (g.cells[k].water < 0.15) for (const o of [...g.links[k]]) g.unlink(k, o); }   // 乾ききった区画は、水の橋が切れる
          if (windT <= 0) { wind = 'done'; for (const c of g.cells) c.dryness = 1; windEl.classList.remove('on'); stats.windSurvived = g.cells.slice(N - 3).every((c) => c.water > 0.35);
            say(stats.windSurvived ? '乾きの風を乗りきりました！ 種のまわりの水は保たれています' : '風はやみました。種のまわりが乾いています。もう一度、水を運ぼう'); (fx ? fx(stats.windSurvived ? 'link' : 'awake') : chime()); } } }
      // 細菌は糖の濃いほうへ集まる（走化性）。いちばん新しいしずくへ、数秒かけて寄ってくる。水がないと動けない
      { const d = drops[drops.length - 1]; if (d && world.grid.cells[d.cell].water > 0.25) { pull = Math.min(1, pull + dt / 6); attract?.(d.m.position, pull * Math.max(0, 1 - d.t / 25) ** 0.3); } else { pull = 0; attract?.(null, 0); } }
      // 種のそばで補給（種からしみ出した糖をもらう）
      if (stock < MAX && (pos ?? camera.position).distanceTo(seedPos) < 80) { stock = MAX; say('種（たね）からしみ出した糖を補給しました（3 つ）'); }
    },
  };
}

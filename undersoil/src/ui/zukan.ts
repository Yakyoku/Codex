// 図鑑（依頼書の「初登場時の紹介と図鑑」）：一度紹介した生き物と土の要素を登録し、いつでも開ける。
//   ・3D モデルを指やマウスで回して、細部まで見られる（ゆっくり自動で回る）
//   ・実際の大きさを、主人公（20 µm）や身近なものと並べて比べられる
//   ・姿の特徴、動き方、土の中での働き、関係を、短い文章で読める（文章は台帳 SPECIES.md から scripts/zukan-text.py で写したもの）
//   ・出会っていないものは、輪郭（黒い影）だけを表示する
// 3D の表示には、図鑑を開いている間だけ小さな描画を 1 つ作り、閉じると捨てる（本体の描画は、その間止める）。
import { askOf } from './card';
import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SPECIES, type Species } from '../game/species';
import { loadGLB } from '../core/assets';
import { buildSeed } from '../game/seed';

const KEY = 'undersoil.zukan';
const makeRngZ = (seed: number) => { let x = seed * 9301 + 49297; return () => ((x = (x * 9301 + 49297) % 233280) / 233280); };
const ORDER = ['water-film', 'aggregate', 'sand', 'humus', 'clay', 'bacillus-subtilis', 'pseudomonas-fluorescens', 'colpoda', 'paramacrobiotus-metropolitanus', 'rhizophagus-irregularis', 'clover-seed', 'trifolium-repens'];
/** 大きさくらべ用のおおよその大きさ（µm）。カードの「実際の大きさ」と同じ値 */
const UM: Record<string, number> = { 'water-film': 0.015, aggregate: 250, sand: 200, humus: 50, clay: 1, 'bacillus-subtilis': 3, 'pseudomonas-fluorescens': 2.5, colpoda: 60, 'rhizophagus-irregularis': 90, 'paramacrobiotus-metropolitanus': 500, 'clover-seed': 1200, 'trifolium-repens': 4000 };
const fmt = (x: number) => (x >= 10 ? Math.round(x).toLocaleString() : x >= 1 ? x.toFixed(1).replace(/\.0$/, '') : x >= 0.01 ? x.toFixed(2) : x.toFixed(3));

type Model = { group: THREE.Object3D; animate?: (t: number) => void };
const physical = (c: number, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.55, ...o });

async function makeModel(base: string, id: string): Promise<Model> {
  const g = new THREE.Group();
  const glb = async (path: string, pick: (name: string) => THREE.Material | null) => {
    const m = await loadGLB(base, path); const meshes: THREE.Mesh[] = [];
    m.scene.traverse((o) => { const me = o as THREE.Mesh; if (!me.isMesh) return; const mat = pick(me.name); if (!mat) { me.visible = false; return; } me.material = mat; meshes.push(me); });
    g.add(m.scene); return meshes;
  };
  const grain = (file: string, mat: THREE.Material) => glb(`models/grains/${file}.glb`, (n) => (n.endsWith('_LOD0') ? mat : null));
  if (id === 'sand') await grain('quartz_a', physical(0x9aa3b4, { roughness: 0.25, transmission: 0.35, thickness: 1.5, ior: 1.54, clearcoat: 0.6 }));
  else if (id === 'aggregate') await grain('aggregate_a', physical(0x5b4330, { roughness: 0.95 }));
  else if (id === 'humus') await grain('humus_a', physical(0x231a14, { roughness: 0.95 }));
  else if (id === 'clay') await grain('clay_a', physical(0x8a6a2c, { roughness: 0.8 }));
  else if (id === 'water-film') {
    // 2 つの粒の接点にかかる水の橋（鼓の形）
    const q = physical(0x8d96a8, { roughness: 0.3, clearcoat: 0.8 });
    for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 4), q); b.position.x = s * 1.02; g.add(b); }
    const pts: THREE.Vector2[] = []; for (let i = 0; i <= 18; i++) { const t = i / 18 * 2 - 1; pts.push(new THREE.Vector2(0.28 + 0.42 * Math.abs(t) ** 2.4, t * 0.35)); }
    const w = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), physical(0xbfd8e6, { roughness: 0.02, transmission: 0.9, thickness: 0.4, ior: 1.33, transparent: true, opacity: 0.85 })); w.rotation.z = Math.PI / 2; g.add(w);
  } else if (id === 'bacillus-subtilis' || id === 'pseudomonas-fluorescens') {
    const bac = id === 'bacillus-subtilis', R = bac ? 0.4 : 0.36, L = bac ? 3.2 : 2.2;
    const cellM = physical(bac ? 0x8f8c84 : 0x8e8f74, { roughness: 0.4, transmission: 0.35, thickness: 0.6, transparent: true, opacity: 0.9 });
    const flagM = new THREE.MeshStandardMaterial({ color: 0x9a988e, roughness: 0.6 });
    const n = bac ? 3 : 1;
    for (let k = 0; k < n; k++) {
      const c = new THREE.Mesh(new THREE.CapsuleGeometry(R, L - 2 * R, 8, 20), cellM); c.rotation.z = Math.PI / 2; c.position.x = (k - (n - 1) / 2) * (L + 0.05); g.add(c);
      if (bac && k === 1) { const sp = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), physical(0xe8e4d2, { roughness: 0.2 })); sp.scale.set(0.5, 0.26, 0.26); sp.position.copy(c.position); g.add(sp); }
      const flags = bac ? 4 : 2;
      for (let f = 0; f < flags; f++) {   // 枯草菌：体のまわりから数本　シュードモナス：片方の端から 1〜2 本
        const pts: THREE.Vector3[] = []; const a = (f / flags) * Math.PI * 2;
        const o = bac ? new THREE.Vector3(c.position.x + (f - 1.5) * 0.5, Math.cos(a) * R, Math.sin(a) * R) : new THREE.Vector3(c.position.x - L / 2, 0, 0);
        for (let i = 0; i <= 30; i++) { const s = i / 30; const d = bac ? new THREE.Vector3(-0.6, Math.cos(a), Math.sin(a)).normalize() : new THREE.Vector3(-1, 0, 0);
          pts.push(o.clone().addScaledVector(d, s * (bac ? 3 : 5)).add(new THREE.Vector3(0, Math.sin(s * 14 + f) * 0.18 * s, Math.cos(s * 14 + f) * 0.18 * s))); }
        g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.025, 5), flagM));
      }
    }
  } else if (id === 'colpoda') {
    const body = physical(0x9a9264, { roughness: 0.35, transmission: 0.45, thickness: 1.5, transparent: true, opacity: 0.8 });
    const vac = physical(0x6f6440, { roughness: 0.5 }), nuc = physical(0x8a8676, { roughness: 0.5 });
    await glb('models/creatures/colpoda.glb', (n) => (n === 'colpoda_body_LOD0' ? body : n === 'colpoda_vacuoles_LOD0' ? vac : n === 'colpoda_macronucleus' ? nuc : null));
  } else if (id === 'paramacrobiotus-metropolitanus') {
    const body = physical(0xa5926c, { roughness: 0.45, transmission: 0.3, thickness: 3, transparent: true, opacity: 0.9 });
    const inner = physical(0x4d3f1c, { roughness: 0.6 });
    const ms = await glb('models/creatures/tardigrade.glb', (n) => (n.startsWith('tardigrade_body_LOD0') ? body : n.startsWith('tardigrade_inner_LOD0') ? inner : null));
    const KEYS = ['walk_a', 'walk_b', 'walk_c', 'walk_d'];
    return { group: g, animate: (t) => { const x = (t * 1.6) % 4, i = Math.floor(x), f = x - i; for (const m of ms) { const d = m.morphTargetDictionary!, inf = m.morphTargetInfluences!; inf.fill(0); inf[d[KEYS[i]]] = 1 - f; inf[d[KEYS[(i + 1) % 4]]] = f; } } };
  } else if (id === 'rhizophagus-irregularis') {
    // 胞子（直径 約 90 µm）と、柄から伸びる菌糸（太さ 約 8 µm）。大きさの比は本物どおり
    const wall = physical(0xd8b46a, { roughness: 0.3, transmission: 0.35, thickness: 0.4, transparent: true, opacity: 0.7 });
    g.add(new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), wall));
    const lip = physical(0xe6cf8c, { roughness: 0.2 }); const r = makeRngZ(5);
    for (let i = 0; i < 90; i++) { const v = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1); if (v.length() > 1) continue; const m = new THREE.Mesh(new THREE.SphereGeometry(0.08 + r() * 0.04, 10, 8), lip); m.position.copy(v.multiplyScalar(0.8)); g.add(m); }
    const hy = physical(0xe0dccb, { roughness: 0.2, transmission: 0.7, thickness: 0.1, transparent: true, opacity: 0.55 });
    const stub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.6, 16), wall); stub.rotation.z = Math.PI / 2; stub.position.x = 1.25; g.add(stub);
    const pts: THREE.Vector3[] = []; for (let i = 0; i <= 40; i++) { const s = i / 40; pts.push(new THREE.Vector3(1.5 + s * 5, Math.sin(s * 9) * 0.18 + s * 0.3, Math.cos(s * 7) * 0.12)); }
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.09, 10), hy));
    g.position.x = -2.2;
  } else if (id === 'clover-seed') {
    g.add(buildSeed(new THREE.Vector3(), { segments: 96 }));
  } else if (id === 'trifolium-repens') {
    await glb('models/plants/clover_seedling.glb', (n) => (n === 'clover_seedling' ? physical(0x7fa24a, { roughness: 0.6, side: THREE.DoubleSide }) : n === 'clover_leaf1' ? physical(0x4f8a3e, { roughness: 0.7, side: THREE.DoubleSide }) : null));
  }
  return { group: g };
}

export function makeZukan(base: string, onOpenChange: (open: boolean) => void) {
  let met = new Set<string>(); try { met = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { /* その場かぎり */ }
  const dlg = document.createElement('dialog'); dlg.className = 'zukan'; document.body.append(dlg);
  let r3: { renderer: THREE.WebGPURenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera; controls: OrbitControls; model: THREE.Object3D | null; anim?: (t: number) => void; shadow: boolean } | null = null;
  let cur = ORDER.find((id) => met.has(id)) ?? ORDER[0], loadSeq = 0;

  const list = () => ORDER.filter((id) => SPECIES[id]).map((id) => {
    const s = SPECIES[id], on = met.has(id);
    return `<button type="button" class="zk-item ${on ? '' : 'off'} ${id === cur ? 'cur' : ''}" data-id="${id}">${on ? (s.title ?? s.nameJa) : '？？？'}<small>${s.kind === 'organism' ? '生き物' : '土のしくみ'}</small></button>`;
  }).join('');
  const sizeRow = (id: string) => {
    const um = UM[id] ?? 1, me = 20, hair = 80;
    const rel = (x: number, name: string) => x / um >= 1.05 ? `${name}の ${fmt(x / um)} 分の 1` : um / x >= 1.05 ? `${name}の ${fmt(um / x)} 倍` : `${name}と同じくらい`;
    const lo = -2, hi = 4, X = (v: number) => ((Math.log10(Math.max(v, 0.01)) - lo) / (hi - lo)) * 100;
    return `<div class="zk-size"><div class="zk-bar"><i style="left:${X(um)}%" class="me-this"></i><i style="left:${X(me)}%" class="me-hero"></i><i style="left:${X(hair)}%" class="me-hair"></i></div>
      <div class="zk-legend"><span class="a">● これ</span><span class="b">● 主人公（20 µm）</span><span class="c">● 髪の毛の太さ（80 µm）</span><small>目盛りは 1 つ右へ行くごとに 10 倍（0.01 µm 〜 10 mm）</small></div>
      <p>${rel(me, '主人公')}、${rel(hair, '髪の毛の太さ')}。</p></div>`;
  };
  const detail = (s: Species) => {
    const on = met.has(s.id);
    if (!on) return `<h3>？？？</h3><p class="zk-lock">まだ出会っていません。土の中を巡って、この生き物（もの）に出会うと、図鑑に登録されます。</p>`;
    const row = (k: string, v?: string) => (v ? `<dt>${k}</dt><dd>${v}</dd>` : '');
    return `<h3>${s.title ?? s.nameJa}</h3>${s.sci ? `<p class="zk-sci"><i>${s.sci}</i>　${s.taxon ?? ''}</p>` : ''}
      <p class="zk-size-t"><b>${s.size}</b>　${s.sizeCompare}</p>${sizeRow(s.id)}
      <dl>${row('姿（すがた）', s.look)}${row('動き方', s.motion)}${row('土の中での働き', s.role)}${row('関係', s.relations)}</dl>${(() => { const k = askOf(s.id); return k ? `<details class="zk-ask"><summary><b>考えてみよう</b>${k.q}<span>答えを見る</span></summary><p>${k.a}</p></details>` : ''; })()}`;
  };
  const render = () => {
    dlg.innerHTML = `<div class="zk-head"><h2>図鑑（ずかん）<small>${ORDER.filter((id) => met.has(id)).length} / ${ORDER.length}</small></h2><button type="button" class="btn" data-close>とじる</button></div>
      <div class="zk-body"><nav class="zk-list">${list()}</nav>
      <section class="zk-main"><div class="zk-3d"><canvas></canvas><span class="zk-hint">${met.has(cur) ? '指やマウスで回せます' : '輪郭（りんかく）だけ表示しています'}</span></div><div class="zk-text">${detail(SPECIES[cur])}</div></section></div>`;
    dlg.querySelector('[data-close]')!.addEventListener('click', () => dlg.close());
    dlg.querySelectorAll<HTMLButtonElement>('.zk-item').forEach((b) => b.addEventListener('click', () => { cur = b.dataset.id!; render(); void show3d(); }));
  };
  const setupRenderer = async () => {
    const canvas = dlg.querySelector('.zk-3d canvas') as HTMLCanvasElement;
    if (r3) { r3.renderer.setAnimationLoop(null); r3.renderer.dispose(); r3 = null; }
    const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, alpha: true }); await renderer.init();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.toneMapping = THREE.NeutralToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfff4e6, 0x2a2018, 1.4)); const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 5); scene.add(key); const rim = new THREE.DirectionalLight(0xbfd6ff, 1.2); rim.position.set(-4, 1, -3); scene.add(rim);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100); camera.position.set(0, 0.6, 5.2);
    const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.autoRotate = true; controls.autoRotateSpeed = 1.2; controls.enablePan = false; controls.minDistance = 2.2; controls.maxDistance = 10;
    r3 = { renderer, scene, camera, controls, model: null, shadow: false };
    const size = () => { const w = canvas.clientWidth || 300, h = canvas.clientHeight || 300; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }; size();
    const t0 = performance.now();
    renderer.setAnimationLoop(() => { if (!r3) return; size(); r3.controls.update(); r3.anim?.((performance.now() - t0) / 1000); renderer.render(scene, camera); });
  };
  const show3d = async () => {
    await setupRenderer(); if (!r3) return;
    const seq = ++loadSeq, id = cur, on = met.has(id);
    const m = await makeModel(base, id); if (seq !== loadSeq || !r3) return;
    // 大きさをそろえて、真ん中に置く
    const box = new THREE.Box3().setFromObject(m.group), c = box.getCenter(new THREE.Vector3()), s = 2.1 / Math.max(...box.getSize(new THREE.Vector3()).toArray());
    const holder = new THREE.Group(); m.group.position.sub(c); holder.add(m.group); holder.scale.setScalar(s);
    if (!on) holder.traverse((o) => { const me = o as THREE.Mesh; if (me.isMesh) me.material = new THREE.MeshBasicMaterial({ color: 0x0b0907 }); });   // 出会う前は、黒い影だけ
    r3.scene.add(holder); r3.model = holder; r3.anim = on ? m.animate : undefined; r3.controls.autoRotate = true;
  };
  dlg.addEventListener('close', () => { if (r3) { r3.renderer.setAnimationLoop(null); r3.renderer.dispose(); r3 = null; } onOpenChange(false); });
  return {
    /** 紹介カードが出たときに呼ぶ */
    meet(id: string) { if (ORDER.includes(id) && !met.has(id)) { met.add(id); try { localStorage.setItem(KEY, JSON.stringify([...met])); } catch { /* noop */ } } },
    open(id?: string) { if (id && ORDER.includes(id)) cur = id; onOpenChange(true); render(); dlg.showModal(); void show3d(); },
    get isOpen() { return dlg.open; },
  };
}

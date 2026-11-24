// 拡大像（スーツの拡大鏡）：生き物の紹介カードが出ている間、画面の隅に「光学顕微鏡で見た姿」を大きく映す。
// 土の中は暗く、生き物は小さく半透明なので、見たことがない人にも「これがその生き物だ」と分かるようにするため。
// 姿は持ち主から受け取った資料（明視野の顕微鏡像）と、文献の写真に合わせる：明るい背景に、半透明の体、細く暗い輪郭線。
import * as THREE from 'three/webgpu';
import { abs, attribute, dot, float, mix, mx_noise_float, normalView, oneMinus, positionLocal, positionViewDirection, pow, saturate, smoothstep, vec3 } from 'three/tsl';
import { loadGLB } from '../core/assets';

const BG = new THREE.Color(0.86, 0.86, 0.84);   // 明視野の背景（sRGB #F0F0EE を少し落とした値）

/** 明視野の見え方：光を少し吸う半透明の体。縁ほど暗い線になる。光の当たり方には左右されない */
function bf(tint: [number, number, number], opts: { speck?: number; speckScale?: number; speckCol?: [number, number, number]; edge?: number; opacity?: number } = {}) {
  const m = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, side: THREE.FrontSide });
  const rim = oneMinus(saturate(abs(dot(normalView, positionViewDirection))));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let col: any = vec3(...tint);
  if (opts.speck) {
    const sp = smoothstep(0.6, 0.9, mx_noise_float(positionLocal.mul(opts.speckScale ?? 8)).add(0.5)).add(smoothstep(0.72, 0.95, mx_noise_float(positionLocal.mul((opts.speckScale ?? 8) * 2.3)).add(0.5)).mul(0.6)).min(1.0);
    col = mix(col, vec3(...(opts.speckCol ?? [0.45, 0.4, 0.3])), sp.mul(opts.speck));
  }
  col = mix(col, vec3(0.16, 0.15, 0.13), smoothstep(0.55, 0.95, pow(rim, float(1.2))).mul(opts.edge ?? 0.9));
  m.colorNode = col; m.opacityNode = mix(float(opts.opacity ?? 0.55), float(0.95), smoothstep(0.5, 0.95, rim)); m.toneMapped = false;
  return m;
}

/** 波打つ細い管（鞭毛） */
function flagellum(from: THREE.Vector3, dir: THREE.Vector3, len: number, amp: number, waves: number, r = 0.035) {
  const side = new THREE.Vector3(0, 0, 1).cross(dir).normalize(); const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 40; i++) { const s = i / 40; pts.push(from.clone().addScaledVector(dir, s * len).addScaledVector(side, Math.sin(s * Math.PI * 2 * waves) * amp * Math.min(1, s * 3))); }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, r, 5, false);
}

function rod(len: number, rad: number, mat: THREE.Material) { return new THREE.Mesh(new THREE.CapsuleGeometry(rad, len - rad * 2, 6, 16), mat); }

export async function buildMicroscope(base: string) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200); camera.position.set(0, 0, 22); camera.lookAt(0, 0, 0);
  const groups: Record<string, THREE.Group> = {};
  const flagMat = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false }); flagMat.colorNode = vec3(0.45, 0.45, 0.42); flagMat.opacityNode = float(0.85); flagMat.toneMapped = false;

  // 枯草菌：両端の丸い棒（2.5 µm）。鎖と単独。多くは中に楕円の芽胞。まわりに細い鞭毛が数本
  {
    const g = new THREE.Group(); const cell = bf([0.66, 0.63, 0.62], { speck: 0.9, speckScale: 9, speckCol: [0.5, 0.48, 0.44], opacity: 0.75 });
    const spore = bf([0.46, 0.42, 0.33], { edge: 1.0, opacity: 0.9 });
    const L = 3.4, R = 0.62;
    const layout: [number, number, number, boolean][] = [[-5.4, 1.2, 0.5, true], [-2.6, 3.8, 1.25, true], [1.8, 4.2, 1.0, true], [-3.2, -1.6, 0.25, false], [-0.4, -0.4, 0.62, true], [1.8, 1.1, 0.62, false], [0.6, -1.5, 0.35, true], [4.3, -0.9, 0.15, true], [3.0, -3.6, -0.45, true]];
    for (const [x, y, a, sp] of layout) {
      const c = rod(L, R, cell); c.position.set(x, y, 0); c.rotation.z = a + Math.PI / 2; g.add(c);
      if (sp) { const s = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), spore); s.scale.set(R * 0.62, L * 0.2, R * 0.62); s.position.copy(c.position).add(new THREE.Vector3(Math.cos(a), Math.sin(a), 0).multiplyScalar((Math.random() - 0.3) * 0.6)); s.rotation.z = c.rotation.z; s.renderOrder = 2; g.add(s); }
      for (let k = 0; k < 3; k++) { const ang = a + Math.PI / 2 + (k - 1) * 1.1 + 0.4; const d = new THREE.Vector3(Math.cos(ang), Math.sin(ang), 0); const p0 = new THREE.Vector3(x, y, -0.1).addScaledVector(new THREE.Vector3(Math.cos(a), Math.sin(a), 0), (k - 1) * L * 0.35).addScaledVector(d, R * 0.9);
        g.add(new THREE.Mesh(flagellum(p0, d, 2.6 + Math.random(), 0.25, 1.6), flagMat)); }
    }
    groups['bacillus-subtilis'] = g;
  }
  // シュードモナス：やや短い棒（1.9 µm）。わずかに黄緑。片方の端から、長く波打つ鞭毛が 1 本
  {
    const g = new THREE.Group(); const cell = bf([0.58, 0.56, 0.42], { speck: 0.8, speckScale: 9, speckCol: [0.52, 0.52, 0.4], opacity: 0.75 });
    const L = 2.7, R = 0.55;
    const layout: [number, number, number][] = [[-4.6, -0.6, 1.2], [-1.0, 3.4, 0.0], [-0.6, 0.7, 0.35], [1.3, -0.6, 1.3], [2.3, -0.4, 1.4], [3.0, 2.2, 1.2], [3.6, -1.6, 0.9], [4.6, 1.2, 0.5]];
    for (const [x, y, a] of layout) {
      const c = rod(L, R, cell); c.position.set(x, y, 0); c.rotation.z = a + Math.PI / 2; g.add(c);
      const d = new THREE.Vector3(Math.cos(a), Math.sin(a), 0).multiplyScalar(-1);
      g.add(new THREE.Mesh(flagellum(new THREE.Vector3(x, y, -0.1).addScaledVector(d, L / 2), d, 5.5 + Math.random() * 1.5, 0.35, 2.2), flagMat));
    }
    groups['pseudomonas-fluorescens'] = g;
  }
  // コルポダ：腎臓形。中は粒々で、黄褐色の食胞がたくさん、灰色の大核が 1 つ、口のくぼみ。縁に細かい繊毛
  {
    const gl = await loadGLB(base, 'models/creatures/colpoda.glb'); const g = new THREE.Group();
    const body = bf([0.56, 0.48, 0.38], { speck: 1.0, speckScale: 30, speckCol: [0.36, 0.28, 0.16], opacity: 0.6 });
    const vac = bf([0.40, 0.30, 0.13], { speck: 0.8, speckScale: 40, speckCol: [0.22, 0.16, 0.06], edge: 1.0, opacity: 0.85 });
    const nuc = bf([0.42, 0.38, 0.29], { speck: 0.9, speckScale: 50, speckCol: [0.28, 0.25, 0.18], edge: 0.8, opacity: 0.7 });
    const cil = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
    { const rim = oneMinus(saturate(abs(dot(normalView, positionViewDirection)))); const u = attribute('uv', 'vec2'); const row = u.x.mul(80.0).fract();
      cil.colorNode = vec3(0.5, 0.5, 0.48); cil.opacityNode = smoothstep(0.75, 0.99, rim).mul(smoothstep(0.35, 0.5, row).mul(smoothstep(0.65, 0.5, row))).mul(0.8); cil.toneMapped = false; }
    gl.scene.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const n = m.name;
      if (n.endsWith('_LOD1') || n.startsWith('colpoda_cyst')) { m.visible = false; return; }
      m.material = n.startsWith('colpoda_body') ? body : n.startsWith('colpoda_cilia') ? cil : n.startsWith('colpoda_vacuoles') ? vac : nuc; m.renderOrder = n.startsWith('colpoda_body') ? 1 : n.startsWith('colpoda_cilia') ? 3 : 2; });
    gl.scene.scale.setScalar(1.05); gl.scene.rotation.set(Math.PI / 2, 0, 0.25);   // 平たい面をこちらに向ける
    g.add(gl.scene); groups['colpoda'] = g;
  }
  // クマムシ：黄褐色がかった半透明。体節のしわ、粒々の貯蔵細胞、短い脚と灰白色の鉤爪。眼はない種
  {
    const gl = await loadGLB(base, 'models/creatures/tardigrade.glb'); const g = new THREE.Group();
    const body = bf([0.44, 0.35, 0.20], { speck: 0.9, speckScale: 70, speckCol: [0.25, 0.18, 0.08], opacity: 0.7 });
    const inner = bf([0.30, 0.21, 0.09], { speck: 0.8, speckScale: 30, speckCol: [0.18, 0.12, 0.05], opacity: 0.85 });
    const meshes: THREE.Mesh[] = [];
    gl.scene.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; if (m.name.endsWith('_LOD1')) { m.visible = false; return; }
      m.material = m.name.startsWith('tardigrade_body') ? body : inner; m.renderOrder = m.name.startsWith('tardigrade_body') ? 2 : 1; meshes.push(m); });
    const s = 9.5 / 56; gl.scene.scale.setScalar(s); gl.scene.rotation.set(0.25, Math.PI / 2 - 0.35, 0); gl.scene.position.set(0, -1.0, 0);   // 横から見る（頭が右）
    g.add(gl.scene); g.userData.meshes = meshes; groups['paramacrobiotus-metropolitanus'] = g;
  }
  for (const g of Object.values(groups)) { g.visible = false; scene.add(g); }

  const frame = document.createElement('div'); frame.className = 'scope'; frame.innerHTML = '<div class="scope-tag">拡大像<small>光学顕微鏡で見た姿</small></div><div class="scope-name"></div><div class="scope-scale"></div>'; document.body.append(frame);
  let cur: string | null = null, t = 0;
  const SCALE: Record<string, string> = { 'bacillus-subtilis': '― 5 µm', 'pseudomonas-fluorescens': '― 5 µm', colpoda: '― 20 µm', 'paramacrobiotus-metropolitanus': '― 100 µm' };
  return {
    has: (id: string) => id in groups,
    show(id: string, name: string) { if (!(id in groups)) return; cur = id; t = 0; for (const [k, g] of Object.entries(groups)) g.visible = k === id; frame.querySelector('.scope-name')!.textContent = name; frame.querySelector('.scope-scale')!.textContent = SCALE[id] ?? ''; frame.classList.add('on'); },
    hide() { cur = null; frame.classList.remove('on'); for (const g of Object.values(groups)) g.visible = false; },
    /** 本体を描いたあとに呼ぶ。画面の右上に、枠の中だけ描き足す */
    render(renderer: THREE.WebGPURenderer, dt: number) {
      if (!cur) return; t += dt; const g = groups[cur];
      if (cur === 'paramacrobiotus-metropolitanus') {   // ゆっくり歩く
        const ph = t * 1.6, KEYS = ['walk_a', 'walk_b', 'walk_c', 'walk_d'];
        for (const m of g.userData.meshes as THREE.Mesh[]) { const d = m.morphTargetDictionary!, inf = m.morphTargetInfluences!; inf.fill(0); const x = ph % 4, i = Math.floor(x), f = x - i; inf[d[KEYS[i]]] = 1 - f; inf[d[KEYS[(i + 1) % 4]]] = f; }
        g.rotation.y = Math.sin(t * 0.3) * 0.35;
      } else if (cur === 'colpoda') g.rotation.z = Math.sin(t * 0.25) * 0.15; else g.rotation.z = Math.sin(t * 0.2) * 0.06;
      const r = frame.getBoundingClientRect(), dpr = renderer.getPixelRatio(), H = renderer.domElement.height / dpr;
      const x = r.left, y = r.top, w = r.width, h = r.height;   // WebGPURenderer の表示領域は左上が原点（WebGL 2 で動いているときも同じ） if (w < 10) return;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      const ac = renderer.autoClear, cc = renderer.getClearColor(new THREE.Color()), ca = renderer.getClearAlpha();
      renderer.setScissorTest(true); renderer.setScissor(x, y, w, h); renderer.setViewport(x, y, w, h);
      renderer.setClearColor(BG, 1); renderer.autoClear = false; renderer.clear();
      renderer.render(scene, camera);
      renderer.setScissorTest(false); renderer.setViewport(0, 0, renderer.domElement.width / dpr, H); renderer.setClearColor(cc, ca); renderer.autoClear = ac;
    },
  };
}

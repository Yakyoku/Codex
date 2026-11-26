// トウキョウチョウメイムシ（Paramacrobiotus metropolitanus）。モデルは assets/blender/creatures/tardigrade.py。
// GLB は −Z が前、+Y が上、1 単位 = 10 µm（体長 約 56）。シェイプキー：tun（乾眠の樽）、walk_a〜d（歩き）。
// 見た目（写真で確認）：乳白色がかった青白い半透明の体（#B6BED4）に、腸の中身の橙褐色（#DDC8C0）が透け、丸い貯蔵細胞がたくさん見える。眼はない。
import * as THREE from 'three/webgpu';
import { attribute, dot, float, mix, mx_noise_float, normalView, oneMinus, positionLocal, positionViewDirection, pow, saturate, sin, smoothstep, vec3 } from 'three/tsl';
import { loadGLB, loadTexture } from '../core/assets';
import type { World } from './world';

export interface Tardigrade { group: THREE.Group; update(dt: number, t: number): void; active(): boolean; target(): { p: THREE.Vector3; r: number } | null; }

export async function buildTardigrade(base: string, world: World, lod: 0 | 1): Promise<Tardigrade> {
  const [gltf] = await Promise.all([loadGLB(base, 'models/creatures/tardigrade.glb'), loadTexture(base, 'models/creatures/tardigrade_na.webp')]);
  const L = `_LOD${lod}`;
  const vc = attribute('color', 'vec4');
  // 体：半透明。縁ほど白く濃く、中央は透ける。中に丸い貯蔵細胞の模様
  const body = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false });
  // 持ち主の資料と顕微鏡写真：黄褐色がかった半透明の体（#A5926C）。体節ごとのしわが細い線で見え、
  // 中に黄褐色の粒々の貯蔵細胞のかたまりが透ける。脚は短く太く、先に灰白色の鉤爪
  { const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 1.6);
    const claw = vc.g;
    const clump = smoothstep(0.1, 0.45, mx_noise_float(positionLocal.mul(3.0)).add(0.2));
    const grain = smoothstep(0.55, 0.85, mx_noise_float(positionLocal.mul(60.0)).add(0.5));
    const fold = smoothstep(0.75, 0.98, sin(positionLocal.z.mul(14.0)).abs());   // 体節の境の細いしわ
    // 2026-11-26：本物の写真と並べると、中の粒のかたまりがもっと濃く（暗い黄褐色〜こげ茶）、体じゅうにぎっしり見える
    let col = mix(vec3(0.44, 0.37, 0.22), vec3(0.22, 0.16, 0.06), clump.mul(0.9));
    col = mix(col, vec3(0.10, 0.075, 0.03), grain.mul(clump.mul(0.7).add(0.3)).mul(0.75));
    col = mix(col, vec3(0.16, 0.13, 0.08), fold.mul(0.45).add(smoothstep(0.55, 0.9, rim).mul(0.7)).min(0.85));
    body.colorNode = mix(col, vec3(0.14, 0.12, 0.09), claw);   // 鉤爪：写真では細く暗い（灰褐色の硬いクチクラ）
    body.roughnessNode = float(0.4); body.metalnessNode = float(0); body.clearcoat = 0.3; body.clearcoatRoughness = 0.3;
    body.opacityNode = mix(mix(float(0.6), float(0.95), rim).max(clump.mul(0.55)).max(clump.mul(grain).mul(0.9)), float(0.9), claw);
    body.emissiveNode = col.mul(0.18).mul(oneMinus(claw)); }
  // 中身：口の管と咽頭（硬い部分）は明るい灰、腸は橙褐色
  const inner = new THREE.MeshStandardNodeMaterial();
  { const hard = vc.g; inner.colorNode = mix(vec3(0.20, 0.17, 0.07), vec3(0.42, 0.40, 0.34), smoothstep(0.5, 0.9, hard)); inner.roughnessNode = float(0.6); }   // 腸は食べたもので暗い緑褐色
  const meshes: THREE.Mesh[] = [];
  gltf.scene.traverse((o) => {
    const m = o as THREE.Mesh; if (!m.isMesh) return;
    if (!m.name.endsWith(L)) { m.visible = false; return; }
    m.material = m.name.startsWith('tardigrade_body') ? body : inner; m.renderOrder = m.name.startsWith('tardigrade_body') ? 7 : 6; m.frustumCulled = false; meshes.push(m);
  });
  const group = new THREE.Group(); group.add(gltf.scene); group.name = 'tardigrade';
  // 空洞の底に置く
  const C = world.cavern.center.clone(); const floorY = C.y - world.cavern.radius * 0.78;   // 空洞の底（まわりの粒の上）
  group.position.set(C.x, floorY, C.z);
  const cellIdx = world.cellAt(C);
  let wake = 0, walkPh = 0, ang = 0, feedT = 0, nextFeed = 7, feedW = 0;
  const KEYS = ['walk_a', 'walk_b', 'walk_c', 'walk_d'];
  const setKeys = (tun: number, ph: number) => {
    for (const m of meshes) {
      const d = m.morphTargetDictionary!, inf = m.morphTargetInfluences!; inf.fill(0);
      const x = ((ph % 4) + 4) % 4, i = Math.floor(x), f = x - i, w = 1 - tun;
      inf[d[KEYS[i]]] = (1 - f) * w; inf[d[KEYS[(i + 1) % 4]]] = f * w; inf[d['tun']] = tun;
    }
  };
  setKeys(1, 0);
  return {
    group,
    active: () => wake > 0.8,
    // 見せる位置：空洞の中、道の側の少し上から見下ろす
    // 2026-11-26：前は空洞の端から見下ろしていたので、お尻と腹ばかりが見えていた。本物の写真と同じく、横から（少し上から）見る
    target: () => { const head = new THREE.Vector3(0, 0, -1).applyQuaternion(group.quaternion).setY(0).normalize(); const side = new THREE.Vector3(-head.z, 0, head.x);
      const toPath = world.path.getPointAt(0.5).sub(C).setY(0).normalize(); if (side.dot(toPath) < 0) side.negate();   // 道の側の横から
      return { p: group.position.clone().add(new THREE.Vector3(0, 7, 0)), r: 24, view: group.position.clone().addScaledVector(side, 48).add(new THREE.Vector3(0, 13, 0)) }; },
    update(dt) {
      const c = world.grid.cells[cellIdx];
      // 水が戻ると、乾眠の樽から元の姿に戻る（実際は数十分〜数時間。ゲームでは早回し）
      const target = c.water > 0.45 ? 1 : 0; wake += Math.sign(target - wake) * Math.min(Math.abs(target - wake), dt * 0.12);
      const ss = (a: number, b: number, x: number) => { const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
      const tun = 1 - ss(0.1, 0.9, wake);
      if (wake > 0.9) {
        // ゆっくり歩く：1 周期（約 1.6 秒）で約 9.4 単位進む。空洞の底を大きな円を描いて歩く
        // ときどき立ち止まり、頭を下げて口を粒の表面に当て、食べる（口の管と咽頭で吸い込む。本物の動画でよく見られるしぐさ）
        nextFeed -= dt; if (nextFeed <= 0 && feedT <= 0) { feedT = 3.5 + Math.random() * 2; nextFeed = 8 + Math.random() * 6; }
        if (feedT > 0) feedT -= dt;
        feedW += ((feedT > 0 ? 1 : 0) - feedW) * (1 - Math.exp(-dt * 3));
        walkPh += dt * 2.5 * (1 - feedW); ang += dt * 0.12 * (1 - feedW);
        const R = world.cavern.radius * 0.12;
        const pump = Math.sin(performance.now() / 1000 * 2 * Math.PI * 2.2) * 0.35 * feedW;   // 咽頭のポンプ（毎秒 約 2 回）に合わせて、頭が小さく前後する
        group.position.set(C.x + Math.cos(ang) * R, floorY - feedW * 0.8, C.z + Math.sin(ang) * R);
        group.rotation.set(0, -ang + Math.PI, 0);   // 進む向き（円の接線）へ頭を向ける
        group.rotateX(-0.16 * feedW); group.translateZ(-pump);
      }
      setKeys(tun, walkPh);
    },
  };
}

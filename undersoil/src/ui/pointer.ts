// 紹介カードが「画面のどれ」を説明しているかを示す：対象を丸印で囲み、カードからその丸印へ線を引く。
// 対象が画面の外にあるときは、画面の端に矢印を出す。
import * as THREE from 'three/webgpu';
import './pointer.css';
import type { Target } from '../game/encounters';
import { dot, float, mix, normalView, oneMinus, positionViewDirection, pow, saturate, time, vec3 } from 'three/tsl';

/** 説明している物そのものの輪郭を光らせる（裏返して少し大きくした形＝輪郭線、表は縁だけ光る） */
function makeHighlight(scene: THREE.Scene) {
  const t = time.mul(3.0).sin().mul(0.5).add(0.5);
  // 縁だけが金色に光る（形を太らせた殻は使わない。粒が大きいと殻が厚い黄色の塊に見えた）
  const rim = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  rim.colorNode = vec3(1.0, 0.62, 0.22).mul(pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 2.2)).mul(mix(float(0.6), float(1.3), t));
  const group = new THREE.Group(); group.matrixAutoUpdate = false; group.renderOrder = 20; scene.add(group);
  const b = new THREE.Mesh(undefined, rim); b.renderOrder = 20; group.add(b); group.visible = false;
  return {
    set(geo: THREE.BufferGeometry | undefined, m: THREE.Matrix4 | undefined) { if (!geo || !m) { group.visible = false; return; } b.geometry = geo; group.matrix.copy(m); group.matrixWorldNeedsUpdate = true; group.visible = true; },
    hide() { group.visible = false; },
  };
}

export function makePointer(camera: THREE.PerspectiveCamera, scenes: THREE.Scene[] = []) {
  const hl = scenes.map(makeHighlight);
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.classList.add('pointer'); svg.setAttribute('aria-hidden', 'true');
  const line = document.createElementNS(NS, 'path'); line.classList.add('pl');
  const ring = document.createElementNS(NS, 'circle'); ring.classList.add('pr');
  const ring2 = document.createElementNS(NS, 'circle'); ring2.classList.add('pr2');
  const ticks = document.createElementNS(NS, 'path'); ticks.classList.add('pt');
  const arrow = document.createElementNS(NS, 'path'); arrow.classList.add('pa');
  const tag = document.createElementNS(NS, 'text'); tag.classList.add('ptag');
  svg.append(line, ring2, ring, ticks, arrow, tag); document.body.append(svg);
  let get: (() => Target) | null = null, cached: Target = null, refresh = 0, t0 = 0;
  const v = new THREE.Vector3(), e = new THREE.Vector3(), right = new THREE.Vector3();
  return {
    /** 指し示し始める（相手が動くもののときは、毎フレーム位置を取り直す） */
    show(fn: (() => Target) | null, label = '') { tag.textContent = label; get = fn; cached = fn ? fn() : null; refresh = 0; t0 = performance.now(); svg.classList.toggle('on', !!cached); hl.forEach((h) => h.set(cached?.geo, cached?.matrix)); },
    hide() { get = null; cached = null; svg.classList.remove('on'); hl.forEach((h) => h.hide()); },
    /** カメラが向くべき位置（自動で巡っている間だけ使う） */
    focus(): THREE.Vector3 | null { return cached ? cached.p : null; },
    update(dt: number) {
      if (!get) return;
      refresh -= dt; if (refresh <= 0 && !cached?.geo) { const n = get(); if (n) cached = n; refresh = 0.1; }
      if (!cached) { svg.classList.remove('on'); return; }
      svg.classList.add('on');
      const W = innerWidth, H = innerHeight;
      v.copy(cached.p).project(camera);
      const behind = v.z > 1;
      // 丸の半径：対象の大きさを画面に写した長さ
      right.set(1, 0, 0).applyQuaternion(camera.quaternion); e.copy(cached.p).addScaledVector(right, cached.r).project(camera);
      let x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H;
      const r = Math.max(18, Math.min(H * 0.22, Math.abs(e.x - v.x) * 0.5 * W * (cached.geo ? 0.95 : 1.05)));
      const off = behind || x < 0 || x > W || y < 0 || y > H;
      if (behind) { x = W - x; y = H - y; }
      const pulse = 1 + 0.06 * Math.sin((performance.now() - t0) / 260);
      const card = document.querySelector('.card.show') as HTMLElement | null; const cr = card?.getBoundingClientRect();
      if (off) {
        // 画面の外：端に矢印
        const cx = Math.max(40, Math.min(W - 40, x)), cy = Math.max(40, Math.min(H - 40, y)), a = Math.atan2(y - H / 2, x - W / 2);
        const tip = (d: number, s: number) => `${cx + Math.cos(a + s) * d},${cy + Math.sin(a + s) * d}`;
        arrow.setAttribute('d', `M${tip(18, 0)} L${tip(14, 2.5)} L${tip(14, -2.5)} Z`); arrow.style.display = '';
        ring.style.display = ring2.style.display = ticks.style.display = 'none'; line.setAttribute('d', ''); tag.setAttribute('x', String(cx)); tag.setAttribute('y', String(cy - 26));
        return;
      }
      arrow.style.display = 'none'; ring.style.display = ring2.style.display = cached.geo ? 'none' : ''; ticks.style.display = '';
      ring.setAttribute('cx', String(x)); ring.setAttribute('cy', String(y)); ring.setAttribute('r', String(r * pulse));
      tag.setAttribute('x', String(x)); tag.setAttribute('y', String(Math.max(28, y - r * 1.22 - 16)));
      ring2.setAttribute('cx', String(x)); ring2.setAttribute('cy', String(y)); ring2.setAttribute('r', String(r * 1.22));
      const t = r * 1.22, k = 9;
      ticks.setAttribute('d', `M${x - t - k},${y} h${k} M${x + t},${y} h${k} M${x},${y - t - k} v${k} M${x},${y + t} v${k}`);
      if (cr) {
        // カードのいちばん近い辺から、丸の縁まで、折れ線で結ぶ
        const sx = Math.max(cr.left, Math.min(cr.right, x)), sy = x > cr.left && x < cr.right ? (y < cr.top ? cr.top : cr.bottom) : Math.max(cr.top + 18, Math.min(cr.bottom - 18, y));
        const fx = x > cr.right ? cr.right : x < cr.left ? cr.left : sx;
        const ang = Math.atan2(sy - y, fx - x), ex = x + Math.cos(ang) * r * pulse, ey = y + Math.sin(ang) * r * pulse;
        const mx = fx + (ex - fx) * 0.35;
        line.setAttribute('d', `M${fx},${sy} L${mx},${sy} L${ex},${ey}`);
      } else line.setAttribute('d', '');
    },
  };
}

// 紹介カードが「画面のどれ」を説明しているかを示す：対象を丸印で囲み、カードからその丸印へ線を引く。
// 対象が画面の外にあるときは、画面の端に矢印を出す。
import * as THREE from 'three/webgpu';
import './pointer.css';
import type { Target } from '../game/encounters';

export function makePointer(camera: THREE.PerspectiveCamera) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.classList.add('pointer'); svg.setAttribute('aria-hidden', 'true');
  const line = document.createElementNS(NS, 'path'); line.classList.add('pl');
  const ring = document.createElementNS(NS, 'circle'); ring.classList.add('pr');
  const ring2 = document.createElementNS(NS, 'circle'); ring2.classList.add('pr2');
  const ticks = document.createElementNS(NS, 'path'); ticks.classList.add('pt');
  const arrow = document.createElementNS(NS, 'path'); arrow.classList.add('pa');
  svg.append(line, ring2, ring, ticks, arrow); document.body.append(svg);
  let get: (() => Target) | null = null, cached: Target = null, refresh = 0, t0 = 0;
  const v = new THREE.Vector3(), e = new THREE.Vector3(), right = new THREE.Vector3();
  return {
    /** 指し示し始める（相手が動くもののときは、毎フレーム位置を取り直す） */
    show(fn: (() => Target) | null) { get = fn; cached = fn ? fn() : null; refresh = 0; t0 = performance.now(); svg.classList.toggle('on', !!cached); },
    hide() { get = null; cached = null; svg.classList.remove('on'); },
    /** カメラが向くべき位置（自動で巡っている間だけ使う） */
    focus(): THREE.Vector3 | null { return cached ? cached.p : null; },
    update(dt: number) {
      if (!get) return;
      refresh -= dt; if (refresh <= 0) { const n = get(); if (n) cached = n; refresh = 0.1; }
      if (!cached) { svg.classList.remove('on'); return; }
      svg.classList.add('on');
      const W = innerWidth, H = innerHeight;
      v.copy(cached.p).project(camera);
      const behind = v.z > 1;
      // 丸の半径：対象の大きさを画面に写した長さ
      right.set(1, 0, 0).applyQuaternion(camera.quaternion); e.copy(cached.p).addScaledVector(right, cached.r).project(camera);
      let x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H;
      const r = Math.max(26, Math.min(H * 0.28, Math.abs(e.x - v.x) * 0.5 * W * 1.25));
      const off = behind || x < 0 || x > W || y < 0 || y > H;
      if (behind) { x = W - x; y = H - y; }
      const pulse = 1 + 0.06 * Math.sin((performance.now() - t0) / 260);
      const card = document.querySelector('.card.show') as HTMLElement | null; const cr = card?.getBoundingClientRect();
      if (off) {
        // 画面の外：端に矢印
        const cx = Math.max(40, Math.min(W - 40, x)), cy = Math.max(40, Math.min(H - 40, y)), a = Math.atan2(y - H / 2, x - W / 2);
        const tip = (d: number, s: number) => `${cx + Math.cos(a + s) * d},${cy + Math.sin(a + s) * d}`;
        arrow.setAttribute('d', `M${tip(18, 0)} L${tip(14, 2.5)} L${tip(14, -2.5)} Z`); arrow.style.display = '';
        ring.style.display = ring2.style.display = ticks.style.display = 'none'; line.setAttribute('d', '');
        return;
      }
      arrow.style.display = 'none'; ring.style.display = ring2.style.display = ticks.style.display = '';
      ring.setAttribute('cx', String(x)); ring.setAttribute('cy', String(y)); ring.setAttribute('r', String(r * pulse));
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

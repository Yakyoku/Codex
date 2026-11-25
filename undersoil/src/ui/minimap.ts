// 小さな地図：土の中の区画を真上から見た図。道（右へ進む）、ゴールの種、クマムシのいる洞、いまの位置と向き。
// 自動で巡るときも自分で動くときも、「いまどこにいて、どこへ向かっているか」が分かるようにする。
import * as THREE from 'three/webgpu';

export function makeMinimap(path: THREE.Curve<THREE.Vector3>, seed: { c: THREE.Vector3; r: number }, cavern: { center: THREE.Vector3; radius: number }) {
  const W = 168, H = 104, pts: THREE.Vector3[] = []; for (let i = 0; i <= 60; i++) pts.push(path.getPointAt(i / 60));
  const all = [...pts, seed.c.clone().addScaledVector(new THREE.Vector3(1, 0, 0), seed.r), seed.c.clone().addScaledVector(new THREE.Vector3(-1, 0, 0), seed.r), cavern.center.clone().add(new THREE.Vector3(0, 0, -cavern.radius)), cavern.center.clone().add(new THREE.Vector3(0, 0, cavern.radius))];
  const x0 = Math.min(...all.map((p) => p.x)) - 10, x1 = Math.max(...all.map((p) => p.x)) + 10, z0 = Math.min(...all.map((p) => p.z)) - 10, z1 = Math.max(...all.map((p) => p.z)) + 10;
  const s = Math.min((W - 16) / (x1 - x0), (H - 26) / (z1 - z0));
  const X = (x: number) => 8 + (x - x0) * s, Y = (z: number) => 20 + (z - z0) * s;
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)},${Y(p.z).toFixed(1)}`).join('');
  const el = document.createElement('div'); el.className = 'minimap';
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-label="小さな地図">
    <text x="8" y="13" class="mm-t">地図（ちず）・真上から</text>
    <circle cx="${X(cavern.center.x)}" cy="${Y(cavern.center.z)}" r="${cavern.radius * s}" class="mm-cave"/>
    <text x="${X(cavern.center.x)}" y="${Y(cavern.center.z) + 3}" class="mm-l" text-anchor="middle">クマムシ</text>
    <path d="${d}" class="mm-path"/>
    <ellipse cx="${X(seed.c.x)}" cy="${Y(seed.c.z)}" rx="${seed.r * s}" ry="${seed.r * 0.85 * s}" class="mm-seed"/>
    <text x="${X(seed.c.x)}" y="${Y(seed.c.z) + 3}" class="mm-l mm-goal" text-anchor="middle">種（ゴール）</text>
    <text x="${X(pts[0].x)}" y="${Y(pts[0].z) - 5}" class="mm-l" text-anchor="middle">入口</text>
    <g class="mm-me"><path d="M0,0 L-9,-5 L-9,5 Z" class="mm-cone"/><circle r="3.2" class="mm-dot"/></g>
  </svg>`;
  document.body.append(el);
  const me = el.querySelector('.mm-me') as SVGGElement; const f = new THREE.Vector3();
  return {
    el,
    update(cam: THREE.Camera, visible: boolean) {
      el.classList.toggle('on', visible); if (!visible) return;
      cam.getWorldDirection(f); const a = Math.atan2(f.z, f.x) * 180 / Math.PI + 180;
      me.setAttribute('transform', `translate(${X(cam.position.x).toFixed(1)},${Y(cam.position.z).toFixed(1)}) rotate(${a.toFixed(0)})`);
    },
  };
}

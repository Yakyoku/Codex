// 造形の確認用（?view=nio など）。公開物にも含め、見本帳の「回して見る」に使う。
import * as THREE from 'three';
import { Stage, type ArtMode } from '../engine/stage';
import { G, wcMaterial, makeSky } from '../engine/watercolor';
import { loadMesh, Rig } from '../engine/model';
import { NIO_J } from '../models/nio.def';
import { MONK_J } from '../models/monk.def';
import type { Joints } from '../models/skeleton';
import { buildPrologue, groundY } from '../scenes/prologue';
import { createMonk, createNio, MONK_IDLE, NIO_A_STAND, NIO_UN_STAND } from '../game/actors';

/** 序章の見せ場（山門の前の金剛力士と蓮）を静止構図で見る。?cam=x,y,z,tx,ty,tz */
async function sceneView(st: Stage, q: URLSearchParams): Promise<void> {
  st.scene.children.length = 0;
  const sc = await buildPrologue(); st.scene.add(sc.group);
  const monk = await createMonk(), a = await createNio('a'), un = await createNio('un');
  for (const h of [monk, a, un]) { h.groundY = groundY; st.scene.add(h.root); }
  monk.place(0.6, 7.5, Math.PI); a.place(sc.nioHome[0].x, sc.nioHome[0].z, -0.25); un.place(sc.nioHome[1].x, sc.nioHome[1].z, 0.25);
  monk.target = MONK_IDLE; a.target = NIO_A_STAND; un.target = NIO_UN_STAND;
  const c = (q.get('cam') || '4.5,2.6,15,0,4.4,-8').split(',').map(Number);
  st.camera.fov = +(q.get('fov') ?? 46); st.camera.updateProjectionMatrix();
  G.uFocus.value.set(0, 3, -6, 13);
  let last = 0;
  st.renderer.setAnimationLoop(t => {
    const dt = Math.min(0.05, (t - last) / 1000) || 0.016; last = t;
    G.uTime.value = t / 1000;
    for (const h of [monk, a, un]) h.update(dt);
    sc.update(dt, t / 1000, st.camera);
    const sw = q.get('orbit') === '1' ? Math.sin(t / 1500) * 3 : 0;
    st.camera.position.set(c[0] + sw, c[1], c[2]); st.camera.lookAt(c[3], c[4], c[5]);
    st.render();
    (window as unknown as { __ready: boolean; __info: unknown }).__info = st.info();
  });
}

export async function runViewer(canvas: HTMLCanvasElement, q: URLSearchParams): Promise<void> {
  const st = new Stage(canvas);
  st.setArt((q.get('mode') as ArtMode) || 'C');
  st.scene.add(makeSky({ top: 0xb9c9cf, mid: 0xdfe6e0, low: 0xf1ede2 }));
  const what = q.get('view') || 'nio';
  if (what === 'scene') { await sceneView(st, q); return; }
  const monk = what === 'monk', un = what === 'un';
  const mat = wcMaterial({ vertexColors: true, skinned: true, noiseScale: 2.2, emph: 1, grain: 0.35, dry: 0.12, mottle: 0.4 });
  let rig: Rig;
  if (monk) {
    const body = await loadMesh('monk-bl');
    rig = new Rig((body.userData.joints as Joints) ?? MONK_J);
    rig.add(body, wcMaterial({ vertexColors: true, skinned: true, bands: [0.36, 0.66], soft: 0.08, dens: [1.3, 0.92, 0.45], mottle: 0.22, grain: 0.08, dry: 0.05, rim: 0.6, noiseScale: 1.4, emph: 1 }));
  } else {
    const body = await loadMesh(un ? 'nio-bl-un' : 'nio-bl-a');
    rig = new Rig((body.userData.joints as Joints) ?? NIO_J);
    rig.add(body, wcMaterial({ vertexColors: true, skinned: true, noiseScale: 1.9, bands: [0.36, 0.66], soft: 0.06, dens: [1.6, 1.05, 0.5], mottle: 0.5, grain: 0.3, dry: 0.12, rim: 0.8, emph: 1 }));
  }
  st.scene.add(rig.root);
  // 腕を下ろした仮の構え
  rig.b('armL').rotation.z = -1.0; rig.b('armR').rotation.z = 1.0; rig.b('foreR').rotation.z = 0.6;
  const ground = new THREE.Mesh(new THREE.CircleGeometry(6, 48).rotateX(-Math.PI / 2), wcMaterial({ tint: 0xb8c0b4, worldAnchor: true, flat: 1, dens: [1, 1, 1], line: 0, noiseScale: 0.4 }));
  st.scene.add(ground);
  const tgt = new THREE.Vector3(0, +(q.get('ty') ?? 1.1), 0);
  let yaw = +(q.get('yaw') ?? 0.5), pitch = +(q.get('pitch') ?? 0.05), dist = +(q.get('dist') ?? 5);
  let drag = false, px = 0, py = 0;
  canvas.addEventListener('pointerdown', e => { drag = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!drag) return; yaw -= (e.clientX - px) * 0.008; pitch = Math.max(-0.3, Math.min(1.2, pitch + (e.clientY - py) * 0.006)); px = e.clientX; py = e.clientY; });
  canvas.addEventListener('pointerup', () => { drag = false; });
  canvas.addEventListener('wheel', e => { dist = Math.max(0.6, Math.min(12, dist * (1 + e.deltaY * 0.001))); });
  const auto = q.get('spin') === '1';
  st.renderer.setAnimationLoop(t => {
    G.uTime.value = t / 1000;
    if (auto && !drag) yaw += 0.004;
    st.camera.position.set(tgt.x + Math.sin(yaw) * Math.cos(pitch) * dist, tgt.y + Math.sin(pitch) * dist, tgt.z + Math.cos(yaw) * Math.cos(pitch) * dist);
    st.camera.lookAt(tgt);
    st.render();
    (window as unknown as { __ready: boolean }).__ready = true;
  });
}

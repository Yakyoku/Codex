// 第1部の最小シーン：土の粒を1つ表示する（画面版・VR版・診断で共通）
import * as THREE from 'three/webgpu';
import { loadGLB } from '../core/assets';

export async function buildMinScene(base: string, opts: { vr?: boolean; count?: number } = {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070504);
  scene.fog = new THREE.FogExp2(0x070504, opts.vr ? 0.12 : 0.05);
  const gltf = await loadGLB(base, 'models/soil_grain_test.glb');
  const grain = gltf.scene;
  grain.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
    if (m) { m.color.set(0x6b4426); m.roughness = 0.82; m.aoMapIntensity = 1.0; }
  });
  const group = new THREE.Group();
  group.add(grain);
  scene.add(group);
  // 光：主人公のライト役の暖色1灯＋縁を拾う寒色1灯＋わずかな環境光
  const key = new THREE.PointLight(0xffd9a8, 40, 0, 2); key.position.set(2.2, 2.4, 3.0); scene.add(key);
  const rim = new THREE.DirectionalLight(0x86a8ff, 1.2); rim.position.set(-3, 1.5, -2.5); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0x8a7a66, 0x120c08, 0.35));
  // まわりの粒（インスタンス描画）
  const n = opts.count ?? 40;
  let mesh: THREE.Mesh | null = null;
  grain.traverse((o) => { if ((o as THREE.Mesh).isMesh && !mesh) mesh = o as THREE.Mesh; });
  if (mesh && n > 0) {
    const src = mesh as THREE.Mesh;
    const inst = new THREE.InstancedMesh(src.geometry, src.material, n);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3();
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, r = 3 + rnd() * 7, y = (rnd() - 0.5) * 6;
      p.set(Math.cos(a) * r, y, Math.sin(a) * r); e.set(rnd() * 6, rnd() * 6, rnd() * 6); q.setFromEuler(e);
      s.setScalar(0.5 + rnd() * 1.6); m4.compose(p, q, s); inst.setMatrixAt(i, m4);
    }
    scene.add(inst);
  }
  return { scene, group };
}

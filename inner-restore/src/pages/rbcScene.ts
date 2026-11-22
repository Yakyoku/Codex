import * as THREE from 'three/webgpu';
import { loadGLB, lodMeshes, makeEnvironment } from '../core/assets';
import { makeCellMaterial, keyLightDirView } from '../materials/cell';

/** 第1部の経路確認用：赤血球を漂わせる場面。画面版・VR 版・診断で共用する。 */
export async function buildRbcScene(renderer: THREE.WebGPURenderer, count: number, lod = 0, spread = 30) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0405);
  scene.fog = new THREE.FogExp2(0x1a0606, 0.022);
  scene.environment = makeEnvironment(renderer);
  scene.environmentIntensity = 0.35;
  const gltf = await loadGLB('/static/models/rbc.glb');
  const meshes = lodMeshes(gltf);
  const src = meshes[Math.min(lod, meshes.length - 1)];
  const srcMat = src.material as THREE.MeshPhysicalMaterial;
  const mat = makeCellMaterial({ color: 0x7a1410, transmit: 0xff3a1c, orm: srcMat.aoMap, absorption: 2.4, wet: 0.5 });
  const inst = new THREE.InstancedMesh(src.geometry, mat, count);
  inst.frustumCulled = false;
  const rnd = mulberry(7);
  const cells = Array.from({ length: count }, (_, i) => ({
    p: i === 0 ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3((rnd() - 0.5) * spread, (rnd() - 0.5) * spread * 0.6, (rnd() - 0.5) * spread - (count > 1 ? 4 : 0)),
    axis: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
    rot: rnd() * 6.28, spin: 0.15 + rnd() * 0.35, ph: rnd() * 6.28,
  }));
  scene.add(inst);
  const key = new THREE.DirectionalLight(0xfff1e0, 3.2);
  key.position.set(4, 9, -6);
  scene.add(key);
  const fill = new THREE.PointLight(0xff8a70, 40, 60);
  fill.position.set(-8, -4, 6);
  scene.add(fill);
  const q = new THREE.Quaternion(), m4 = new THREE.Matrix4(), one = new THREE.Vector3(1, 1, 1), v = new THREE.Vector3();
  const tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.9, 0, 0.3));
  function update(t: number, camera: THREE.Camera) {
    for (let i = 0; i < count; i++) {
      const c = cells[i];
      q.setFromAxisAngle(c.axis, c.rot + t * c.spin);
      if (i === 0) q.setFromAxisAngle(v.set(0, 1, 0), t * 0.35).multiply(tilt);
      v.copy(c.p); v.y += Math.sin(t * 0.4 + c.ph) * 0.4;
      inst.setMatrixAt(i, m4.compose(v, q, one));
    }
    inst.instanceMatrix.needsUpdate = true;
    keyLightDirView.value.copy(key.position).normalize().transformDirection(camera.matrixWorldInverse);
  }
  return { scene, update, tris: (src.geometry.index!.count / 3) * count };
}

export function mulberry(a: number) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

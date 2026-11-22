import * as THREE from 'three/webgpu';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const cache = new Map<string, Promise<GLTF>>();
export let bytesLoaded = 0;

export function loadGLB(url: string): Promise<GLTF> {
  let p = cache.get(url);
  if (!p) {
    p = loader.loadAsync(url, (e) => { if (e.loaded === e.total) bytesLoaded += e.total; });
    cache.set(url, p);
  }
  return p;
}

/** LOD をまとめた GLB から、名前の末尾 _lodN のメッシュを取り出す */
export function lodMeshes(gltf: GLTF): THREE.Mesh[] {
  const out: THREE.Mesh[] = [];
  gltf.scene.traverse((o) => { if ((o as THREE.Mesh).isMesh) out.push(o as THREE.Mesh); });
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

/** 映り込み用の環境を、外部素材なしでその場で作る（暗い体内＋やわらかな面光） */
export function makeEnvironment(renderer: THREE.WebGPURenderer, tint = new THREE.Color(0.9, 0.55, 0.45)): THREE.Texture {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0.012, 0.008, 0.01);
  const geo = new THREE.SphereGeometry(1, 16, 8);
  const add = (pos: [number, number, number], scale: number, color: THREE.Color, intensity: number) => {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: color.clone().multiplyScalar(intensity) }));
    m.position.set(...pos); m.scale.setScalar(scale); s.add(m);
  };
  add([0, 8, 2], 3.2, new THREE.Color(1, 0.97, 0.92), 6);
  add([-7, -1, -4], 2.5, tint, 1.6);
  add([6, -3, 5], 3, tint.clone().multiplyScalar(0.6), 1.0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(s, 0.04);
  pmrem.dispose();
  return rt.texture;
}

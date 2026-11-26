import * as THREE from 'three/webgpu';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const cache = new Map<string, Promise<GLTF>>();
export let bytesLoaded = 0;

export function loadGLB(url: string, keepHierarchy = false): Promise<GLTF> {
  let p = cache.get(url);
  if (!p) {
    p = loader.loadAsync(url, (e) => { if (e.loaded === e.total) bytesLoaded += e.total; }).then((g) => { if (!keepHierarchy) dequantize(g.scene); return g; });
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
  // 小さく強い光（内視鏡や顕微鏡の照明の映りこみ）。濡れた面に、点の照り返しが出る
  add([3.5, 6, -5], 0.7, new THREE.Color(1, 0.98, 0.95), 14);
  add([-4, 5.5, 5], 0.55, new THREE.Color(1, 0.96, 0.9), 11);
  add([0, -8, 0], 5, tint.clone().multiplyScalar(0.5), 0.5);   // 下からの、組織の色の照り返し
  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(s, 0.04);
  pmrem.dispose();
  return rt.texture;
}

/** 圧縮のために量子化された頂点（整数＋ノードの拡大率）を、実寸（µm）の浮動小数に戻す。
 *  こうしておくと、シェーダーの中の頂点アニメーションを実寸の単位で書ける。 */
export function dequantize(root: THREE.Object3D) {
  root.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const g = m.geometry, nm = new THREE.Matrix3().getNormalMatrix(m.matrixWorld);
    for (const name of Object.keys(g.attributes)) {
      const a = g.attributes[name] as THREE.BufferAttribute;
      const out = new Float32Array(a.count * a.itemSize);
      for (let i = 0; i < a.count; i++) {
        if (name === 'position' || name === 'normal') {
          v.fromBufferAttribute(a, i);
          if (name === 'position') v.applyMatrix4(m.matrixWorld); else v.applyMatrix3(nm).normalize();
          out[i * 3] = v.x; out[i * 3 + 1] = v.y; out[i * 3 + 2] = v.z;
        } else for (let k = 0; k < a.itemSize; k++) out[i * a.itemSize + k] = a.getComponent(i, k);
      }
      g.setAttribute(name, new THREE.BufferAttribute(out, a.itemSize));
    }
    g.computeBoundingSphere(); g.computeBoundingBox();
  });
  root.traverse((o) => { o.position.set(0, 0, 0); o.quaternion.identity(); o.scale.set(1, 1, 1); o.updateMatrix(); });
  root.updateMatrixWorld(true);
}

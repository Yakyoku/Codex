import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

let loader: GLTFLoader | null = null;
/** base: ページから見たサイト直下への相対パス（'./' か '../'） */
export function gltfLoader(base: string): GLTFLoader {
  if (!loader) {
    const draco = new DRACOLoader();
    draco.setDecoderPath(base + 'draco/');
    loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
  }
  return loader;
}
export function loadGLB(base: string, path: string): Promise<GLTF> {
  return gltfLoader(base).loadAsync(base + path);
}

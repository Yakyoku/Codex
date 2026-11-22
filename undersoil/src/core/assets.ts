import * as THREE from 'three/webgpu';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

let loader: GLTFLoader | null = null;
const texLoader = new THREE.TextureLoader();
export const loadStats = { files: 0, done: 0 };
type Progress = (done: number, total: number) => void;
let onProgress: Progress | null = null;
export function setProgressListener(fn: Progress | null) { onProgress = fn; }
const track = <T>(p: Promise<T>): Promise<T> => { loadStats.files++; onProgress?.(loadStats.done, loadStats.files); return p.then((v) => { loadStats.done++; onProgress?.(loadStats.done, loadStats.files); return v; }); };

/** base: ページから見たサイト直下への相対パス（'./' か '../'） */
export function loadGLB(base: string, path: string): Promise<GLTF> {
  if (!loader) { loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder); }
  return track(loader.loadAsync(base + path));
}
export function loadTexture(base: string, path: string, opts: { srgb?: boolean; repeat?: boolean } = {}): Promise<THREE.Texture> {
  return track(texLoader.loadAsync(base + path).then((t) => {
    t.colorSpace = opts.srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    if (opts.repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.flipY = false; t.anisotropy = 4;
    return t;
  }));
}

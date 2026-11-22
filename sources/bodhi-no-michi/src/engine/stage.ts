// 描画の土台：レンダラー、後処理、画質、絵づくりの案（A/B/C）の切り替え。
import * as THREE from 'three';
import { G, makeNoise3D, PAPER } from './watercolor';
import { Post } from './post';

export type ArtMode = 'A' | 'B' | 'C';
export class Stage {
  renderer: THREE.WebGLRenderer;
  post: Post;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 600);
  pixelRatio = 1; maxPixelRatio = 2;
  art: ArtMode = 'C';
  constructor(public canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'high-performance', xrCompatible: false });
    if (!gl) throw new Error('この端末のブラウザは WebGL2 に対応していないため、絵を描けません。Safari / Chrome を最新版にしてお試しください。');
    this.renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: true });
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // 色は「紙の上の見た目の値」で直接あつかう
    this.renderer.setClearColor(PAPER, 1);
    this.renderer.xr.enabled = true;
    this.renderer.info.autoReset = false;
    G.uNoise.value = makeNoise3D(64);
    this.post = new Post(this.renderer);
    this.setArt('C');
    this.resize();
    addEventListener('resize', () => this.resize());
    addEventListener('orientationchange', () => setTimeout(() => this.resize(), 250));
  }
  setArt(m: ArtMode): void {
    this.art = m;
    G.uArt2.value.z = m === 'B' ? 0 : 1;   // B は物体の水彩効果なし
    this.post.enabled = m !== 'A';         // A は後処理なし
    this.post.mat.uniforms.uPostFx.value = m === 'B' ? 1.6 : 1;
    this.post.kuwahara = m === 'B' ? 4 : 2;
  }
  resize(): void {
    const w = this.canvas.clientWidth || innerWidth, h = this.canvas.clientHeight || innerHeight;
    this.pixelRatio = Math.min(devicePixelRatio || 1, this.maxPixelRatio);
    if (this.renderer.xr.isPresenting) return;
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(w, h, false);
    this.post.setSize(Math.round(w * this.pixelRatio), Math.round(h * this.pixelRatio));
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  render(): void {
    this.last = { calls: this.renderer.info.render.calls, tris: this.renderer.info.render.triangles }; this.renderer.info.reset();
    if (this.renderer.xr.isPresenting) { this.renderer.render(this.scene, this.camera); return; }
    this.post.render(this.scene, this.camera);
  }
  last = { calls: 0, tris: 0 };
  info(): { calls: number; tris: number } { return this.last; }
}

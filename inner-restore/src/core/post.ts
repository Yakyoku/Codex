// 映像の仕上げ（実写の生体顕微鏡の映像に近づける）
//   浅いピント（主人公に合わせ、手前と奥はぼける）／強い光のにじみ／暖かく低いコントラストの色調／
//   周辺の減光／細かな粒子感。重さは端末の段階で切り替える。
import * as THREE from 'three/webgpu';
import { tsl } from './tsl';
import { dof } from 'three/examples/jsm/tsl/display/DepthOfFieldNode.js';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import { gaussianBlur } from 'three/examples/jsm/tsl/display/GaussianBlurNode.js';
import { ao } from 'three/examples/jsm/tsl/display/GTAONode.js';
const { pass, uniform, uv, vec2, vec3, vec4, float, mix, smoothstep, length, dot, fract, sin, time, screenUV } = tsl;

export type Tier = 'pc-high' | 'mobile-high' | 'compat' | 'mobile' | string;

export function createPost(renderer: THREE.WebGPURenderer, scene: THREE.Scene, camera: THREE.Camera, tier: Tier, opts: { ao?: boolean } = {}) {
  const pipe = new THREE.RenderPipeline(renderer);
  const sp = pass(scene, camera);
  const src = sp.getTextureNode('output');
  let col = src;
  // レンズの色のにじみ：画面の縁ほど、赤と青がわずかにずれる（本物のレンズの映像の癖）
  if (tier === 'pc-high' || tier === 'mobile-high') {
    const off = screenUV.sub(0.5), k = dot(off, off).mul(0.012);
    col = vec4(src.sample(screenUV.sub(off.mul(k))).r, src.g, src.sample(screenUV.add(off.mul(k))).b, 1);
  }
  // すき間の陰（GTAO）：細胞どうしが接する所、くぼみ、柱の根元が自然に暗くなる。高画質のみ
  let aoPass: { radius: { value: number }; resolutionScale: number; getTextureNode(): { r: unknown } } | null = null;
  if (opts.ao) {
    aoPass = (ao as unknown as (d: unknown, n: unknown, c: THREE.Camera) => typeof aoPass)(sp.getTextureNode('depth'), null, camera); aoPass!.radius.value = 3.2; aoPass!.resolutionScale = 0.5;
    col = col.mul(mix(float(1), gaussianBlur(aoPass!.getTextureNode() as never, 2, 3).r, float(0.8)));   // ざらつきが出ないよう、陰はぼかしてから掛ける
  }
  const focus = uniform(5.5);
  const exposure = uniform(1);   // 露出のゆらぎ（顕微鏡のカメラが明るさを追いかける感じ）
  const useDof = tier === 'pc-high';
  const useBloom = tier === 'pc-high' || tier === 'mobile-high';
  if (useDof) col = dof(col, sp.getViewZNode(), focus, float(12), float(0.55));
  if (useBloom) col = col.add(bloom(col, 0.32, 0.7, 0.55));
  // 色調：黒を暖かく持ち上げ、彩度とコントラストを少し下げる（顕微鏡の映像は、暗部も光に満ちている）
  const c = col.rgb.mul(exposure);
  const lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  let g = mix(vec3(lum, lum, lum), c, float(1.04));
  // 黒は持ち上げすぎない（白っぽく眠い絵になる）。中間をわずかに締めて、明暗の幅を出す
  g = g.mul(g.mul(0.22).add(0.86)).add(vec3(0.006, 0.003, 0.002));
  // 周辺の減光（顕微鏡の視野のように、縁がやわらかく暗く暖かい）
  const r = length(screenUV.sub(0.5).mul(vec2(1.25, 1)));
  g = g.mul(mix(float(1), float(0.62), smoothstep(0.35, 0.85, r)));
  // 細かな粒子感
  const n = fract(sin(dot(uv().add(fract(time.mul(0.37))), vec2(12.9898, 78.233))).mul(43758.5453));
  g = g.add(n.sub(0.5).mul(0.022));
  pipe.outputNode = vec4(g, 1);
  return {
    pipe, focus, exposure, useDof,
    render() { pipe.render(); },
  };
}

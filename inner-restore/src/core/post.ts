// 映像の仕上げ（実写の生体顕微鏡の映像に近づける）
//   浅いピント（主人公に合わせ、手前と奥はぼける）／強い光のにじみ／暖かく低いコントラストの色調／
//   周辺の減光／細かな粒子感。重さは端末の段階で切り替える。
import * as THREE from 'three/webgpu';
import { tsl } from './tsl';
import { dof } from 'three/examples/jsm/tsl/display/DepthOfFieldNode.js';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
const { pass, uniform, uv, vec2, vec3, vec4, float, mix, smoothstep, length, dot, fract, sin, time, screenUV } = tsl;

export type Tier = 'pc-high' | 'mobile-high' | 'compat' | 'mobile' | string;

export function createPost(renderer: THREE.WebGPURenderer, scene: THREE.Scene, camera: THREE.Camera, tier: Tier) {
  const pipe = new THREE.RenderPipeline(renderer);
  const sp = pass(scene, camera);
  let col = sp.getTextureNode('output');
  const focus = uniform(5.5);
  const useDof = tier === 'pc-high';
  const useBloom = tier === 'pc-high' || tier === 'mobile-high';
  if (useDof) col = dof(col, sp.getViewZNode(), focus, float(12), float(0.55));
  if (useBloom) col = col.add(bloom(col, 0.32, 0.7, 0.55));
  // 色調：黒を暖かく持ち上げ、彩度とコントラストを少し下げる（顕微鏡の映像は、暗部も光に満ちている）
  const c = col.rgb;
  const lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  let g = mix(vec3(lum, lum, lum), c, float(1.04));
  g = g.mul(0.96).add(vec3(0.018, 0.01, 0.006));
  // 周辺の減光（顕微鏡の視野のように、縁がやわらかく暗く暖かい）
  const r = length(screenUV.sub(0.5).mul(vec2(1.25, 1)));
  g = g.mul(mix(float(1), float(0.62), smoothstep(0.35, 0.85, r)));
  // 細かな粒子感
  const n = fract(sin(dot(uv().add(fract(time.mul(0.37))), vec2(12.9898, 78.233))).mul(43758.5453));
  g = g.add(n.sub(0.5).mul(0.022));
  pipe.outputNode = vec4(g, 1);
  return {
    pipe, focus, useDof,
    render() { pipe.render(); },
  };
}

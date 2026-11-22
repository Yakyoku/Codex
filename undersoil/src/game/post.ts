// 後処理（画面版のみ。VR では使わない）：ブルーム、色調整、周辺減光、わずかな粒状感
import * as THREE from 'three/webgpu';
import { pass, screenUV, smoothstep, mix, float, vec3, time, fract, sin, dot, vec2 } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

export function makePost(renderer: THREE.WebGPURenderer, scene: THREE.Scene, camera: THREE.Camera, effects: string[]) {
  const pipe = new THREE.RenderPipeline(renderer);
  const scenePass = pass(scene, camera);
  const color = scenePass.getTextureNode('output');
  let out = color.rgb;
  if (effects.some((e) => e.startsWith('bloom'))) {
    const lite = effects.includes('bloom-lite');
    out = out.add(bloom(color, lite ? 0.22 : 0.3, lite ? 0.4 : 0.65, 0.9).rgb);
  }
  if (effects.includes('grade')) {
    // 暗部をわずかに寒色へ、明部を暖色へ（映画的な分離）。彩度は上げない
    const l = dot(out, vec3(0.2126, 0.7152, 0.0722));
    out = mix(out.mul(vec3(0.98, 1.0, 1.03)), out.mul(vec3(1.06, 1.0, 0.92)), smoothstep(0.02, 0.6, l));
  }
  if (effects.includes('vignette')) { const d = screenUV.sub(0.5).length(); out = out.mul(mix(float(1), float(0.42), smoothstep(0.32, 0.86, d))); }
  if (effects.includes('grain')) { const n = fract(sin(dot(screenUV.add(fract(time)), vec2(12.9898, 78.233))).mul(43758.5453)); out = out.mul(mix(float(0.965), float(1.035), n)); }
  pipe.outputNode = out;
  return pipe;
}

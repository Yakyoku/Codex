// 後処理（画面版のみ。VR では使わない）。2026-11-27 に「本物の接写・顕微鏡の映像」に近づけるため作り直した。
// 作り物っぽさの原因と対策（Docs/REFERENCE/realism-pass-2026-11-27.md）：
//   ・粒どうしの接点やすき間が暗くならず、粒が浮いて見える → 画面空間の環境光の遮り（GTAO）。接点・くぼみ・すき間が自然に暗くなる
//   ・後処理を通すと縁がギザギザ（ちらつき）→ 最後に FXAA でなめらかに
//   ・明るい所の色が変わり、写真から測った色とずれる → 色を保つトーンマッピング（ニュートラル）を後処理の中で行い、そのあとにレンズの癖を足す
//     （AgX も試したが、地上の場面が白くかすんで、コントラストが落ちたのでやめた）
//   ・レンズの癖：周辺のわずかな色ずれ（色収差）、周辺減光、にじみ（ブルーム）、粒状感
import * as THREE from 'three/webgpu';
import { sample, pass, mrt, output, normalView, directionToColor, colorToDirection, screenUV, smoothstep, mix, float, vec3, vec4, time, fract, sin, dot, vec2, renderOutput } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { dof } from 'three/addons/tsl/display/DepthOfFieldNode.js';
import { ao } from 'three/addons/tsl/display/GTAONode.js';
import { fxaa } from 'three/addons/tsl/display/FXAANode.js';
import { chromaticAberration } from 'three/addons/tsl/display/ChromaticAberrationNode.js';

type N = ReturnType<typeof float>;
export function makePost(renderer: THREE.WebGPURenderer, scene: THREE.Scene, camera: THREE.Camera, effects: string[], focus?: { distance: N; range: number | N; bokeh: number | N }) {
  const pipe = new THREE.RenderPipeline(renderer);
  const scenePass = pass(scene, camera);
  const useAO = effects.includes('ao') || effects.includes('ao-half');
  if (useAO) scenePass.setMRT(mrt({ output, normal: directionToColor(normalView) }));
  const color = scenePass.getTextureNode('output');
  let base = color;
  if (useAO) {
    // GTAO は法線を「読み出せるもの」として受け取る（中で .sample(uv) する）。色に詰めた法線を、読み出すたびに向きへ戻す（three.js の例と同じ形）。
    // 2026-11-28 に直した：前は colorToDirection(...) をそのまま渡していて、高画質の段階で TSL の組み立てエラーが出ていた
    const normalTex = scenePass.getTextureNode('normal');
    const sceneNormal = sample((uv: Parameters<typeof normalTex.sample>[0]) => colorToDirection(normalTex.sample(uv)));
    const aoPass = ao(scenePass.getTextureNode('depth'), sceneNormal, camera);
    aoPass.resolutionScale = effects.includes('ao-half') ? 0.5 : 1;
    // 土の粒は半径が数単位〜数十単位。遮りを見る範囲は、細かい粒のすき間がちょうど暗くなる大きさ
    (aoPass as unknown as { radius: { value: number }; thickness: { value: number }; scale: { value: number }; samples: { value: number } }).radius.value = 1.6;
    (aoPass as unknown as { thickness: { value: number } }).thickness.value = 1.2;
    (aoPass as unknown as { samples: { value: number } }).samples.value = effects.includes('ao-half') ? 8 : 16;
    const occ = aoPass.getTextureNode().r;
    base = vec4(color.rgb.mul(mix(float(1), occ, 0.85)), color.a) as unknown as typeof color;
  }
  // 被写界深度：接写のように、ピントの合った所だけがくっきりし、手前と奥がぼける
  if (focus && effects.some((e) => e.startsWith('dof'))) {
    const num = (v: number | N) => (typeof v === 'number' ? float(v) : v); const bk = num(focus.bokeh);
    base = dof(base, scenePass.getViewZNode(), focus.distance, num(focus.range), effects.includes('dof-lite') ? bk.mul(0.6) : bk) as unknown as typeof color;
  }
  let out = base.rgb;
  if (effects.some((e) => e.startsWith('bloom'))) {
    const lite = effects.includes('bloom-lite');
    out = out.add(bloom(vec4(base.rgb.min(vec3(1.5)), float(1)) as unknown as typeof base, lite ? 0.18 : 0.24, lite ? 0.3 : 0.45, 1.15).rgb);
  }
  if (effects.includes('grade')) {
    // 暗部をわずかに寒色へ、明部を暖色へ（映画的な分離）。彩度は上げない
    const l = dot(out, vec3(0.2126, 0.7152, 0.0722));
    out = mix(out.mul(vec3(0.98, 1.0, 1.03)), out.mul(vec3(1.06, 1.0, 0.92)), smoothstep(0.02, 0.6, l));
  }
  // ここで写真の明るさの曲線（トーンマッピング）と sRGB に直す。このあとはレンズとカメラの癖
  // 明るさの曲線はニュートラル（Khronos PBR Neutral）：写真から測って合わせた色が、ほとんど変わらずに出る。少しだけ明るくする
  let disp = renderOutput(vec4(out.mul(1.15), float(1)) as never) as unknown as typeof color;
  if (effects.includes('ca')) disp = chromaticAberration(disp, float(0.35), vec2(0.5, 0.5), float(1.0)) as unknown as typeof color;   // 周辺だけ、ごくわずか
  // 写真の現像と同じ、ごく弱い S 字の曲線（黒を締め、白を少し伸ばす）。ニュートラルの曲線は暗部が少し浮くため
  let fin = mix(disp.rgb, smoothstep(vec3(0.0), vec3(1.0), disp.rgb), 0.38);
  if (effects.includes('vignette')) { const d = screenUV.sub(0.5).length(); fin = fin.mul(mix(float(1), float(0.5), smoothstep(0.32, 0.86, d))); }
  if (effects.includes('grain')) { const n = fract(sin(dot(screenUV.add(fract(time)), vec2(12.9898, 78.233))).mul(43758.5453)); fin = fin.mul(mix(float(0.97), float(1.03), n)); }
  let res: unknown = vec4(fin, float(1));
  if (effects.includes('fxaa')) res = fxaa(res as never);   // 最後に縁をなめらかに（後処理を通すと MSAA が効かないため）
  pipe.outputColorTransform = false;
  pipe.outputNode = res as never;
  return pipe;
}

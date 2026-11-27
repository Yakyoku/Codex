// 土の粒のマテリアル（TSL）。WebGPU と WebGL 2 で同じ記述が動く。
// 「濡れ」（0=乾いて粉をふいた状態、1=水の膜に覆われた状態）を粒ごとに持ち、色・粗さ・クリアコートを同時に動かす。
import * as THREE from 'three/webgpu';
import { texture, uv, vec3, float, mix, normalMap, positionWorld, positionLocal, normalWorld, triplanarTexture, instancedBufferAttribute, saturate, uniform, positionViewDirection, normalView, dot, pow, oneMinus, smoothstep, fract, floor, min, mx_worley_noise_float, time } from 'three/tsl';

export type GrainKind = 'quartz' | 'aggregate' | 'humus' | 'clay';
interface Look { dry: [number, number, number]; wet: [number, number, number]; roughDry: number; roughWet: number; coat: number; detail: number; bump: number; }
// 色は肉眼・光学顕微鏡で見える土の色を基準にした線形 RGB
export const LOOKS: Record<GrainKind, Look> = {
  // 石英：写真では、厚い中央は乳白色がかった青灰（#79849A〜#8F94A2）、縁は暖色（#ACA28C）。半透明でガラスのよう
  quartz:    { dry: [0.16, 0.17, 0.20], wet: [0.10, 0.105, 0.125], roughDry: 0.55, roughWet: 0.2, coat: 0.6, detail: 2.5, bump: 0.35 },
  // 団粒：けば立った、孔の多い、つやのない土のかたまり
  aggregate: { dry: [0.20, 0.15, 0.10], wet: [0.075, 0.05, 0.032], roughDry: 0.97, roughWet: 0.82, coat: 0.08, detail: 3.5, bump: 1.0 },
  // 腐植：赤みのある暗い茶色で、つやはない
  humus:     { dry: [0.09, 0.05, 0.03], wet: [0.035, 0.02, 0.012], roughDry: 0.98, roughWet: 0.88, coat: 0.0, detail: 4.0, bump: 1.2 },
  // 粘土：黄褐色（薄片の写真 #7C6332）
  clay:      { dry: [0.30, 0.21, 0.07], wet: [0.15, 0.10, 0.03], roughDry: 0.9, roughWet: 0.55, coat: 0.35, detail: 5.0, bump: 0.4 },
};

export const soilUniforms = {
  /** 全体に足す濡れ（確認用。通常 0） */
  wetBias: uniform(0),
  detailStrength: uniform(1),
  /** スキャン表示（0〜1）：区画の活力を、粒の表面のうすい色で見せる。スーツの画面の表示 */
  scan: uniform(0),
};

export function makeSoilMaterial(kind: GrainKind, na: THREE.Texture, detail: THREE.Texture, wetAttr: THREE.InstancedBufferAttribute, seedAttr: THREE.InstancedBufferAttribute, opts: { vit?: THREE.InstancedBufferAttribute; cheap?: boolean; mottle?: number; tint?: [number, number, number]; style?: 'charcoal' | 'tissue' | 'pellet' } = {}) {
  const L = LOOKS[kind];
  const m = new THREE.MeshPhysicalNodeMaterial();
  type F = ReturnType<typeof float>;
  const wetI = instancedBufferAttribute(wetAttr) as unknown as F;
  const seed = instancedBufferAttribute(seedAttr) as unknown as F;
  const naT = texture(na, uv());
  const ao = naT.b;
  // 細部：世界に固定した3方向投影を、大小2つの縮尺で重ねる（R=粒状感 G=むら B=孔）。粒の大きさに関係なく同じ細かさになる
  const wp = positionWorld.add(seed.mul(9.0));
  const dA = triplanarTexture(texture(detail), null, null, float(0.085 * L.detail / 3), wp, normalWorld);
  const dB = triplanarTexture(texture(detail), null, null, float(0.47 * L.detail / 3), wp.zxy, normalWorld.zxy);
  const d = vec3(dA.r.mul(0.45).add(dB.r.mul(0.55)), dA.g.mul(0.65).add(dB.g.mul(0.35)), dB.b.mul(dA.g.add(0.35)));
  // 水はくぼみ（AO の暗い所）から先にたまる
  const wet = saturate(wetI.add(soilUniforms.wetBias).mul(1.35).sub(ao.mul(0.35)).add(d.g.sub(0.5).mul(0.25 * (opts.mottle ?? 1))));
  const tint = mix(float(0.86), float(1.14), seed);
  const dryCol = vec3(...L.dry).mul(mix(float(0.78), float(1.2), d.g)).mul(tint);
  // 乾いた粒は、上を向いた面に粉（細かい粘土）が積もって白っぽい
  const dust = saturate(normalWorld.y.mul(0.6).add(0.35)).mul(saturate(d.r.mul(1.6).sub(0.3))).mul(oneMinus(wet));
  const dusty = mix(dryCol, vec3(0.40, 0.35, 0.29), dust.mul(kind === 'quartz' ? 0.3 : 0.55));
  const wetCol = vec3(...L.wet).mul(mix(float(0.7), float(1.25), d.g)).mul(tint);
  const col = mix(dusty, wetCol, wet).mul(mix(float(1), float(0.55), d.b.mul(kind === 'quartz' ? 0.2 : 1)));
  let colF = opts.tint ? col.mul(vec3(...opts.tint)) : col;
  const pl = positionLocal;
  if (opts.style === 'charcoal') {
    // 炭：黒く、細かい孔の格子（木の細胞の名残）。孔はさらに暗い
    const pores = smoothstep(0.08, 0.02, mx_worley_noise_float(pl.mul(vec3(22.0, 22.0, 6.0))));
    colF = mix(vec3(0.018, 0.016, 0.015), vec3(0.045, 0.04, 0.036), d.g).mul(oneMinus(pores.mul(0.8)));
  } else if (opts.style === 'tissue') {
    // 植物のかけら：赤茶色。細長い細胞の網目（細胞壁の線が明るい）
    const cx = fract(pl.x.mul(14.0)), cy = fract(pl.z.mul(5.0).add(floor(pl.x.mul(14.0)).mul(0.37)));
    const walls = smoothstep(0.08, 0.0, min(min(cx, oneMinus(cx)), min(cy, oneMinus(cy))));
    colF = mix(mix(vec3(0.16, 0.07, 0.03), vec3(0.24, 0.12, 0.05), d.g), vec3(0.36, 0.22, 0.11), walls.mul(0.7));
  } else if (opts.style === 'pellet') {
    // ふん：黒褐色で、細かい粒が固まった表面
    colF = mix(vec3(0.035, 0.024, 0.016), vec3(0.07, 0.05, 0.035), d.r);
  } else if (kind === 'aggregate') {
    // 団粒：中に明るいシルトの粒が点々と見える
    const silt = smoothstep(0.06, 0.02, mx_worley_noise_float(positionWorld.mul(3.2)));
    colF = mix(colF, vec3(0.42, 0.38, 0.32), silt.mul(0.7).mul(oneMinus(wet.mul(0.5))));
  }
  m.colorNode = colF;
  m.roughnessNode = saturate(mix(float(L.roughDry), float(L.roughWet), wet).add(d.r.sub(0.5).mul(0.25)));
  m.metalnessNode = float(0);
  const DBG = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
  m.aoNode = DBG.has('noao') ? float(1) : mix(ao, float(1), 0.15);
  const n = normalMap(vec3(naT.r, naT.g, float(1)));
  if (!DBG.has('nonormal')) m.normalNode = n;
  // 水の膜：クリアコートの二層反射。膜は滑らかなので、下地の凹凸は拾わせない
  m.clearcoatNode = kind === 'quartz' ? wet.mul(L.coat).mul(oneMinus(ao).mul(1.5).add(0.15).min(1.0)) : wet.mul(L.coat);
  m.clearcoatRoughnessNode = mix(float(0.25), float(0.12), wet);
  if (kind === 'quartz') {
    // 石英は半透明：縁で光が抜けて明るむ（厚みの代わりに視線と法線の角度で近似する）
    const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 2.0);
    m.emissiveNode = vec3(0.40, 0.36, 0.28).mul(rim).mul(0.35);                   // 縁の暖かい透け
    const stain = saturate(oneMinus(ao).mul(2.2).sub(0.3)).mul(saturate(d.g.mul(1.5).sub(0.2)));
    // 2026-11-26：石英は透き通った鉱物なので、正面（光が奥へ抜ける所）は奥の暗さが透けて暗く、縁ほど反射で明るい（ガラス玉の見え方）
    const face = saturate(dot(normalView, positionViewDirection));
    const glass = mix(float(1.0), float(0.38), smoothstep(0.35, 0.95, face));
    // 粘土の膜（薄片の写真）：一部の粒の表面を、黄褐色の薄い膜がおおう。くぼみほど厚い
    const coatOn = smoothstep(0.55, 0.75, seed).mul(saturate(oneMinus(ao).mul(1.4).add(d.g.sub(0.4)))).mul(0.55);
    m.colorNode = mix(mix(colF.mul(glass), vec3(0.32, 0.20, 0.07), stain.mul(0.6)), vec3(0.26, 0.15, 0.05), coatOn);   // くぼみの鉄のしみ、粘土の膜
    m.transmission = 0; m.thickness = 0;
    m.ior = 1.54;
  }
  // 水面がつくる光のゆらめき（コースティクス）：水の膜や水の橋を通った光が、ぬれた粒の表面で細かい網目になって揺れる。
  // 2 つの網目模様をずらして重ね、細い明るい線だけを残す。ぬれた所だけ。軽い段階（VR）では使わない
  if (!opts.cheap) {
    const cp = positionWorld.mul(0.55);
    const c1 = mx_worley_noise_float(cp.add(vec3(time.mul(0.11), time.mul(0.07), 0))), c2 = mx_worley_noise_float(cp.mul(1.37).add(vec3(0, time.mul(-0.09), time.mul(0.12))));
    const caus = pow(saturate(oneMinus(min(c1, c2).mul(1.6))), 6.0).mul(wet).mul(saturate(normalWorld.y.mul(0.5).add(0.6)));
    const prev = m.emissiveNode as ReturnType<typeof vec3> | null;
    const add = vec3(0.30, 0.28, 0.22).mul(caus).mul(0.5);
    m.emissiveNode = prev ? prev.add(add) : add;
  }
  if (opts.vit) {
    // スキャン表示：元気な区画は青緑、足りない区画は赤茶。細い等高線のような縞をゆっくり流して、「画面の表示」だと分かるようにする
    const vit = instancedBufferAttribute(opts.vit) as unknown as F;
    const band = smoothstep(0.75, 0.95, fract(positionWorld.y.mul(0.8).sub(time.mul(0.25)))).mul(0.6).add(0.4);
    const sc = mix(vec3(0.42, 0.13, 0.05), vec3(0.08, 0.42, 0.40), smoothstep(0.25, 0.75, vit)).mul(band).mul(soilUniforms.scan).mul(0.32);
    const prev = m.emissiveNode as ReturnType<typeof vec3> | null; m.emissiveNode = prev ? prev.add(sc) : sc;
  }
  m.envMapIntensity = 1;
  return m;
}

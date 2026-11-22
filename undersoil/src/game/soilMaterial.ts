// 土の粒のマテリアル（TSL）。WebGPU と WebGL 2 で同じ記述が動く。
// 「濡れ」（0=乾いて粉をふいた状態、1=水の膜に覆われた状態）を粒ごとに持ち、色・粗さ・クリアコートを同時に動かす。
import * as THREE from 'three/webgpu';
import { texture, uv, vec3, float, mix, normalMap, positionWorld, normalWorld, triplanarTexture, instancedBufferAttribute, saturate, uniform, positionViewDirection, normalView, dot, pow, oneMinus } from 'three/tsl';

export type GrainKind = 'quartz' | 'aggregate' | 'humus' | 'clay';
interface Look { dry: [number, number, number]; wet: [number, number, number]; roughDry: number; roughWet: number; coat: number; detail: number; bump: number; }
// 色は肉眼・光学顕微鏡で見える土の色を基準にした線形 RGB
export const LOOKS: Record<GrainKind, Look> = {
  quartz:    { dry: [0.36, 0.33, 0.29], wet: [0.15, 0.14, 0.125], roughDry: 0.7, roughWet: 0.12, coat: 1.0, detail: 2.5, bump: 0.35 },
  aggregate: { dry: [0.27, 0.215, 0.165], wet: [0.060, 0.038, 0.024], roughDry: 0.96, roughWet: 0.62, coat: 0.5, detail: 3.5, bump: 1.0 },
  humus:     { dry: [0.085, 0.066, 0.052], wet: [0.016, 0.011, 0.008], roughDry: 0.98, roughWet: 0.5, coat: 0.7, detail: 4.0, bump: 1.2 },
  clay:      { dry: [0.44, 0.36, 0.27], wet: [0.17, 0.115, 0.07], roughDry: 0.9, roughWet: 0.35, coat: 0.85, detail: 5.0, bump: 0.4 },
};

export const soilUniforms = {
  /** 全体に足す濡れ（確認用。通常 0） */
  wetBias: uniform(0),
  detailStrength: uniform(1),
};

export function makeSoilMaterial(kind: GrainKind, na: THREE.Texture, detail: THREE.Texture, wetAttr: THREE.InstancedBufferAttribute, seedAttr: THREE.InstancedBufferAttribute, opts: { cheap?: boolean; mottle?: number } = {}) {
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
  m.colorNode = col;
  m.roughnessNode = saturate(mix(float(L.roughDry), float(L.roughWet), wet).add(d.r.sub(0.5).mul(0.25)));
  m.metalnessNode = float(0);
  m.aoNode = mix(ao, float(1), 0.15);
  const n = normalMap(vec3(naT.r, naT.g, float(1)));
  m.normalNode = n;
  // 水の膜：クリアコートの二層反射。膜は滑らかなので、下地の凹凸は拾わせない
  m.clearcoatNode = wet.mul(L.coat);
  m.clearcoatRoughnessNode = mix(float(0.22), float(0.05), wet);
  if (kind === 'quartz') {
    // 石英は半透明：縁で光が抜けて明るむ（厚みの代わりに視線と法線の角度で近似する）
    const rim = pow(oneMinus(saturate(dot(normalView, positionViewDirection))), 2.5);
    m.emissiveNode = col.mul(rim).mul(mix(float(0.12), float(0.5), wet));
    m.ior = 1.54;
  }
  m.envMapIntensity = 1;
  return m;
}

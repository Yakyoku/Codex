// 透明水彩の物体シェーダー。
// 下塗り → 2〜3段の柔らかい陰影 → 濃淡のむら → 粒状感 → 縁の溜まり → かすれ → 空気遠近 の順に重ねる。
// 模様はすべて「物体か空間に固定」した3Dノイズから取る（画面に貼りつかない＝動かしても泳がない）。
import * as THREE from 'three';

export const PAPER = new THREE.Color(0.957, 0.937, 0.894);

/** 全マテリアルで共有する値（調整パネル・心の状態・光） */
export const G = {
  uNoise: { value: null as unknown as THREE.Data3DTexture },
  uLightDir: { value: new THREE.Vector3(0.45, 0.8, 0.35).normalize() },
  uShadowTint: { value: new THREE.Color(0.66, 0.72, 0.9) },   // 暖かい光には冷たい影
  uWarm: { value: new THREE.Color(1.0, 0.985, 0.95) },
  uPaper: { value: PAPER.clone() },
  uAerial: { value: new THREE.Color(0.86, 0.9, 0.93) },
  uAerialK: { value: 0.012 },
  uClarity: { value: 1 },                                      // 心の澄み具合
  uArt: { value: new THREE.Vector4(1, 1, 1, 1) },              // にじみ, 縁の溜まり, 粒状感, 紙目
  uArt2: { value: new THREE.Vector4(1, 1, 1, 0) },             // 輪郭線, 彩度, 物体効果の強さ, -
  uFocus: { value: new THREE.Vector4(0, 0, 0, 0) },            // 主役の位置(xyz)と効き(w)
  uTime: { value: 0 },
  uWind: { value: new THREE.Vector3(1, 0, 0.3) },
};

/** 繰り返しのきく 3D ノイズ（R,G=なめらか  B=紙の目  A=繊維）。ミップ付きなので遠くでもちらつかない */
export function makeNoise3D(size = 64): THREE.Data3DTexture {
  const data = new Uint8Array(size * size * size * 4);
  const rnd = (seed: number) => { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); };
  const lattice = (period: number, seed: number) => { const r = rnd(seed); const a = new Float32Array(period ** 3); for (let i = 0; i < a.length; i++) a[i] = r(); return a; };
  const sm = (t: number) => t * t * (3 - 2 * t);
  const sample = (lat: Float32Array, p: number, x: number, y: number, z: number) => {
    const fx = x * p, fy = y * p, fz = z * p;
    const x0 = Math.floor(fx), y0 = Math.floor(fy), z0 = Math.floor(fz);
    const tx = sm(fx - x0), ty = sm(fy - y0), tz = sm(fz - z0);
    const at = (i: number, j: number, k: number) => lat[(((z0 + k) % p) * p + ((y0 + j) % p)) * p + ((x0 + i) % p)];
    const l = (a: number, b: number, t: number) => a + (b - a) * t;
    return l(l(l(at(0, 0, 0), at(1, 0, 0), tx), l(at(0, 1, 0), at(1, 1, 0), tx), ty), l(l(at(0, 0, 1), at(1, 0, 1), tx), l(at(0, 1, 1), at(1, 1, 1), tx), ty), tz);
  };
  const A = [lattice(4, 1), lattice(8, 2), lattice(16, 3)], Bq = [lattice(4, 11), lattice(8, 12), lattice(16, 13)];
  const C = [lattice(16, 21), lattice(32, 22)], D = [lattice(8, 31), lattice(32, 32)];
  let o = 0;
  for (let z = 0; z < size; z++) for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size, w = z / size;
    const a = sample(A[0], 4, u, v, w) * 0.55 + sample(A[1], 8, u, v, w) * 0.3 + sample(A[2], 16, u, v, w) * 0.15;
    const b = sample(Bq[0], 4, u, v, w) * 0.55 + sample(Bq[1], 8, u, v, w) * 0.3 + sample(Bq[2], 16, u, v, w) * 0.15;
    const c = sample(C[0], 16, u, v, w) * 0.45 + sample(C[1], 32, u, v, w) * 0.55;
    const d = Math.abs(sample(D[0], 8, u, v, w) - 0.5) * 2 * 0.6 + sample(D[1], 32, u, v, w) * 0.4;
    const st = (t: number, lo: number, hi: number) => Math.min(1, Math.max(0, (t - lo) / (hi - lo)));
    data[o++] = st(a, 0.22, 0.78) * 255; data[o++] = st(b, 0.22, 0.78) * 255; data[o++] = st(c, 0.2, 0.8) * 255; data[o++] = st(d, 0.1, 0.8) * 255;
  }
  const t = new THREE.Data3DTexture(data, size, size, size);
  t.format = THREE.RGBAFormat; t.type = THREE.UnsignedByteType;
  t.wrapS = t.wrapT = t.wrapR = THREE.RepeatWrapping;
  t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true; t.needsUpdate = true;
  return t;
}

export interface WcOpts {
  tint?: THREE.ColorRepresentation;
  /** 陰影の境目（0..1 の半ランバート値）。x=影/中間, y=中間/明 */
  bands?: [number, number];
  soft?: number;            // 境目の柔らかさ
  dens?: [number, number, number]; // 影・中間・明 の顔料の濃さ（明が小さいほど紙の白が残る）
  mottle?: number;          // 濃淡のむら
  grain?: number;           // 粒状感
  rim?: number;             // 輪郭側の溜まり
  dry?: number;             // かすれ（紙の山に顔料が乗らない）
  noiseScale?: number;      // 模様の細かさ
  line?: number;            // 輪郭線の出やすさ（後処理へ渡す）0..1
  aerial?: number;          // 空気遠近の効き
  worldAnchor?: boolean;    // 模様を空間に固定（動かない物）。false は物体に固定
  skinned?: boolean;
  sway?: number;            // 揺れの大きさ（頂点色αの「揺れやすさ」に掛ける）
  wind?: number;            // 風のゆらぎ
  vertexColors?: boolean;
  side?: THREE.Side;
  fadeY?: [number, number]; // この高さより下を紙の白へ溶かす [開始, 終了]
  flag?: [number, number, number, number]; // 敷石：中心x, 中心z, 半径, 石の大きさ
  alphaBlot?: boolean;      // 染みの形で抜く（霧・花びらなどの板）
  transparent?: boolean;
  opacity?: number;
  depthWrite?: boolean;
  flat?: number;            // 1 で陰影なし（遠景の色面）
  emph?: number;            // 主役の強調 0..1
}

export const NOISE_GLSL = /* glsl */`
uniform highp sampler3D uNoise;
vec4 nz(vec3 p){ return texture(uNoise, p); }
`;

const VERT = /* glsl */`
#include <common>
#include <skinning_pars_vertex>
uniform float uTime; uniform vec3 uWind;
uniform vec3 uSwayVec; uniform float uSway; uniform float uWindAmt; uniform float uNoiseScale;
#ifdef USE_VC
attribute vec4 color;
#endif
varying vec3 vCol; varying vec3 vRest; varying vec3 vWorld; varying vec3 vN; varying vec3 vVN; varying float vViewZ; varying float vLoose;
${NOISE_GLSL}
void main(){
  vec3 transformed = position; vec3 objectNormal = normal;
  #ifdef USE_VC
    vCol = color.rgb; vLoose = color.a;
  #else
    vCol = vec3(1.0); vLoose = 0.0;
  #endif
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <skinning_vertex>
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
    mm = modelMatrix * instanceMatrix;
  #endif
  vec4 wp = mm * vec4(transformed, 1.0);
  // 揺れもの：遅れて付いてくる量（CPU のばね）＋風のゆらぎ
  float lz = vLoose;
  vec3 wn = nz(wp.xyz * 0.035 + vec3(uTime * 0.05, uTime * 0.02, 0.0)).rgb - 0.5;
  wp.xyz += uSwayVec * (lz * lz) * uSway;
  wp.xyz += (uWind * (wn.r * 1.6 + sin(uTime * 0.9 + wp.x * 0.3 + wp.z * 0.2) * 0.35) + vec3(0.0, wn.g * 0.4, 0.0)) * lz * uWindAmt;
  vWorld = wp.xyz;
  #ifdef ANCHOR_WORLD
    vRest = wp.xyz * uNoiseScale;
  #else
    vRest = position * uNoiseScale;
    #ifdef USE_INSTANCING
      vRest += instanceMatrix[3].xyz * 0.37;
    #endif
  #endif
  vN = normalize(mat3(mm) * objectNormal);
  vec4 mv = viewMatrix * wp;
  vVN = normalize(mat3(viewMatrix) * vN);
  vViewZ = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */`
precision highp float;
layout(location = 0) out highp vec4 oCol;
layout(location = 1) out highp vec4 gBuf;
uniform vec3 uLightDir, uShadowTint, uWarm, uPaper, uAerial, uTint;
uniform float uAerialK, uClarity, uAerialAmt, uSoft, uMottle, uGrain, uRim, uDry, uLine, uFlat, uOpacity, uEmph;
uniform vec4 uArt, uArt2, uFocus;
uniform vec2 uBands, uFadeY; uniform vec3 uDens; uniform vec4 uFlag;
varying vec3 vCol; varying vec3 vRest; varying vec3 vWorld; varying vec3 vN; varying vec3 vVN; varying float vViewZ; varying float vLoose;
${NOISE_GLSL}
void main(){
  vec3 N = normalize(vN); if(!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld);
  float fx = uArt2.z;                       // 物体効果の強さ（案Bでは 0）
  vec4 n1 = nz(vRest * 0.13);
  vec4 n2 = nz(vRest * 0.53 + 0.31);
  float tooth = nz(vRest * 2.7).b;          // 紙の目（細かい）
  float fiber = nz(vRest * vec3(1.1, 3.9, 1.1)).a;
  float bleed = uArt.x * fx, pool = uArt.y * fx, gran = uArt.z * fx, ptex = uArt.w * fx;
  float unclear = 1.0 - uClarity;

  // 2〜3段の柔らかい陰影。境目はノイズで揺らし、筆で置いた色面にする
  float l = dot(N, uLightDir) * 0.5 + 0.5;
  l = mix(l, 0.62, uFlat);
  l += ((n1.r - 0.5) * 0.16 + (n2.g - 0.5) * 0.08) * bleed * (1.0 + unclear);
  float s = uSoft * (1.0 + bleed * 0.6);
  float b1 = smoothstep(uBands.x - s, uBands.x + s, l);
  float b2 = smoothstep(uBands.y - s, uBands.y + s, l);
  float dens = mix(mix(uDens.x, uDens.y, b1), uDens.z, b2);

  // 縁の溜まり：色面の境目の暗い側と、輪郭側に顔料が集まる
  float e1 = b1 * (1.0 - b1) * 4.0, e2 = b2 * (1.0 - b2) * 4.0;
  dens += pool * (e1 * 0.34 + e2 * 0.2) * (1.0 - uFlat);
  float fr = 1.0 - abs(dot(N, V));
  dens += pool * uRim * smoothstep(0.5, 0.96, fr + (n2.r - 0.5) * 0.25) * 0.5;

  // 濃淡のむら（水の多い所は薄く、乾き際は濃く）
  float mot = (n1.g - 0.5) * 1.0 + (n2.r - 0.5) * 0.55;
  dens *= 1.0 + mot * uMottle * bleed * (1.0 + unclear * 1.2);
  // 主役のまわりは濃く鮮明に、離れるほど淡く
  float foc = 1.0 - smoothstep(uFocus.w, uFocus.w * 3.2, distance(vWorld, uFocus.xyz));
  dens *= mix(1.0, mix(0.78, 1.0, foc), step(0.001, uFocus.w)) * (1.0 + uEmph * 0.15);

  // 粒状感：紙の谷に顔料が沈む（上から重ねず、濃さに作用させる）
  float g = (0.5 - tooth) * 1.5 + (0.5 - fiber) * 0.5;
  dens *= 1.0 + g * uGrain * gran * smoothstep(0.15, 0.9, dens);
  // かすれ：紙の山には顔料が乗らず、紙の白が残る
  float dry = smoothstep(0.58, 0.82, tooth * 0.75 + fiber * 0.25 + (1.0 - min(dens, 1.0)) * 0.3) * uDry * ptex;
  dens *= 1.0 - dry;
  dens = max(dens, 0.0);

  // 顔料の色：影は冷たく、光は暖かく
  vec3 pig = clamp(vCol * uTint, 0.002, 1.0);
  pig = mix(pig * mix(vec3(1.0), uShadowTint, 1.0 - uFlat), pig, b1);
  pig = mix(pig, pig * uWarm, b2);
  #ifdef FLAG
  {
    // 不揃いの敷石：段ごとに幅とずれを変えた石組み。目地は濃く、苔がのる
    float fm = 1.0 - smoothstep(uFlag.z - 1.2, uFlag.z + 0.6, distance(vWorld.xz, uFlag.xy) + (n1.r - 0.5) * 2.0);
    vec2 fp = (vWorld.xz + (n1.rg - 0.5) * 0.6) / uFlag.w;
    float row = floor(fp.y);
    fp.x = fp.x * (0.6 + 0.32 * fract(sin(row * 91.7) * 4375.85)) + fract(sin(row * 12.9898) * 43758.5);
    vec2 fid = floor(fp), ff = fract(fp);
    float fr2 = fract(sin(dot(fid, vec2(127.1, 311.7))) * 43758.5453);
    float fe = min(min(ff.x, 1.0 - ff.x) * 1.5, min(ff.y, 1.0 - ff.y));
    float gap = (1.0 - smoothstep(0.008, 0.04, fe + (n2.r - 0.5) * 0.03)) * fm;
    float nearG = (1.0 - smoothstep(0.03, 0.3, fe + (n2.g - 0.5) * 0.16)) * fm;
    vec3 stone = vec3(0.8, 0.79, 0.74) * mix(0.84, 1.06, fr2) + vec3(0.03, 0.0, -0.03) * (fract(fr2 * 7.3) - 0.5);
    pig = mix(pig, stone, fm);
    // 苔は目地から石の上へ、染みのように広がる
    float mossy = smoothstep(0.42, 0.72, n1.b * 0.5 + n2.b * 0.3 + n1.g * 0.3);
    pig = mix(pig, vec3(0.52, 0.62, 0.4), clamp(nearG * mossy * 1.1 + mossy * 0.12, 0.0, 0.85) * fm);
    // 目地は土と影の色（藍を含んだ焦げ茶）
    pig = mix(pig, vec3(0.5, 0.47, 0.47), gap * 0.85);
    dens += gap * 1.2 + nearG * 0.3 + (fr2 - 0.5) * 0.3 * fm;
  }
  #endif
  // 重ね塗り（透明水彩）：C' = C^d。濃い所は深く、薄い所は紙の白へ
  vec3 col = pow(pig, vec3(dens));
  // 彩度
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, uArt2.y);
  // 心が乱れると色が濁る
  vec3 mud = mix(vec3(lum), col, 0.45) * vec3(0.93, 0.88, 0.8);
  col = mix(col, mud, unclear * 0.8);

  // 空気遠近：遠いほど淡く青く
  float dist = length(cameraPosition - vWorld);
  float aer = (1.0 - exp(-dist * uAerialK)) * uAerialAmt;
  col = mix(col, uAerial, clamp(aer, 0.0, 1.0));
  // 足元を紙の白へ溶かす（霧）
  float fadeAmt = 0.0;
  if (uFadeY.x != uFadeY.y) {
    fadeAmt = smoothstep(uFadeY.x, uFadeY.y, vWorld.y + (n1.b - 0.5) * 3.0);
    col = mix(col, vec3(1.0), fadeAmt);
  }
  col *= uPaper;

  float alpha = uOpacity;
  oCol = vec4(col, alpha);
  float lineAmt = uLine * (1.0 - clamp(aer * 1.4, 0.0, 1.0)) * (1.0 - fadeAmt);
  gBuf = vec4(normalize(vVN).xy * 0.5 + 0.5, clamp(vViewZ / 400.0, 0.0, 1.0), lineAmt);
}`;

export function wcMaterial(o: WcOpts = {}): THREE.ShaderMaterial {
  const defines: Record<string, string> = {};
  if (o.vertexColors) defines.USE_VC = '';
  if (o.worldAnchor) defines.ANCHOR_WORLD = '';
  if (o.flag) defines.FLAG = '';
  const m = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    defines,
    uniforms: {
      ...G,
      uTint: { value: new THREE.Color(o.tint ?? 0xffffff) },
      uBands: { value: new THREE.Vector2(...(o.bands ?? [0.4, 0.68])) },
      uSoft: { value: o.soft ?? 0.035 },
      uDens: { value: new THREE.Vector3(...(o.dens ?? [1.75, 1.0, 0.38])) },
      uMottle: { value: o.mottle ?? 0.5 },
      uGrain: { value: o.grain ?? 0.5 },
      uRim: { value: o.rim ?? 0.6 },
      uDry: { value: o.dry ?? 0.35 },
      uLine: { value: o.line ?? 1 },
      uFlat: { value: o.flat ?? 0 },
      uEmph: { value: o.emph ?? 0 },
      uOpacity: { value: o.opacity ?? 1 },
      uAerialAmt: { value: o.aerial ?? 1 },
      uNoiseScale: { value: o.noiseScale ?? 1 },
      uFadeY: { value: new THREE.Vector2(...(o.fadeY ?? [0, 0])) },
      uFlag: { value: new THREE.Vector4(...(o.flag ?? [0, 0, 0, 1])) },
      uSwayVec: { value: new THREE.Vector3() },
      uSway: { value: o.sway ?? 0 },
      uWindAmt: { value: o.wind ?? 0 },
    },
    vertexShader: VERT, fragmentShader: FRAG,
    side: o.side ?? THREE.FrontSide,
    transparent: !!o.transparent, depthWrite: o.depthWrite ?? true,
  });
  return m;
}

// ───────── 空：濡れた紙に色を流したグラデーションとにじみ ─────────
export interface SkyOpts { top: THREE.ColorRepresentation; mid: THREE.ColorRepresentation; low: THREE.ColorRepresentation; cloud?: THREE.ColorRepresentation; cloudAmt?: number; sun?: THREE.ColorRepresentation; sunDir?: THREE.Vector3 }
export function makeSky(o: SkyOpts): THREE.Mesh {
  const mat = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
      ...G,
      uTop: { value: new THREE.Color(o.top) }, uMid: { value: new THREE.Color(o.mid) }, uLow: { value: new THREE.Color(o.low) },
      uCloud: { value: new THREE.Color(o.cloud ?? 0xffffff) }, uCloudAmt: { value: o.cloudAmt ?? 0.6 },
      uSun: { value: new THREE.Color(o.sun ?? 0xffffff) }, uSunDir: { value: (o.sunDir ?? new THREE.Vector3(0.3, 0.5, -0.8)).clone().normalize() },
    },
    vertexShader: /* glsl */`varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0); gl_Position = p.xyww; }`,
    fragmentShader: /* glsl */`
precision highp float;
layout(location = 0) out highp vec4 oCol;
layout(location = 1) out highp vec4 gBuf;
uniform vec3 uTop, uMid, uLow, uCloud, uSun, uSunDir, uPaper; uniform float uCloudAmt, uTime, uClarity; uniform vec4 uArt, uArt2;
varying vec3 vDir;
${NOISE_GLSL}
void main(){
  vec3 d = normalize(vDir);
  // 方向に固定した模様（頭を回しても空に貼りついたまま）
  vec3 q = d * 1.4;
  vec4 a = nz(q * 0.35 + vec3(uTime * 0.0015, 0.0, 0.0));
  vec4 b = nz(q * 0.9 + (a.rgb - 0.5) * 0.5);
  float h = d.y + (a.r - 0.5) * 0.22 * uArt.x + (b.g - 0.5) * 0.08;
  // 濡れた紙の上で色が流れ落ちる
  vec3 col = mix(uLow, uMid, smoothstep(-0.05, 0.28, h));
  col = mix(col, uTop, smoothstep(0.22, 0.85, h));
  // 雲：塗り残した紙の白。縁に水の溜まり
  vec4 c1 = nz(q * vec3(0.55, 1.3, 0.55) + vec3(uTime * 0.004, 0.0, uTime * 0.002) + (a.gbr - 0.5) * 0.6);
  float cl = smoothstep(0.52 - uCloudAmt * 0.2, 0.74, c1.r * 0.7 + b.r * 0.3) * smoothstep(-0.02, 0.25, d.y);
  float edge = cl * (1.0 - cl) * 4.0;
  col = mix(col, uCloud, cl * 0.85);
  col *= 1.0 - edge * 0.07 * uArt.y;
  // 日輪のにじみ（発光の足し算ではなく、色を抜いて紙の白を見せる）
  float sd = max(dot(d, uSunDir), 0.0);
  float halo = smoothstep(0.86, 0.995, sd + (b.b - 0.5) * 0.03);
  col = mix(col, uSun, halo * 0.75);
  // 顔料のむらと粒
  float gr = nz(q * 3.1).b;
  col *= 1.0 + ((a.g - 0.5) * 0.07 * uArt.x) + (0.5 - gr) * 0.045 * uArt.z;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, uArt2.y);
  col = mix(col, mix(vec3(lum), col, 0.45) * vec3(0.93, 0.88, 0.8), (1.0 - uClarity) * 0.8);
  oCol = vec4(col * uPaper, 1.0);
  gBuf = vec4(0.5, 0.5, 1.0, 0.0);
}`,
    side: THREE.BackSide, depthWrite: false, depthTest: true,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), mat);
  mesh.frustumCulled = false; mesh.renderOrder = -1000;
  return mesh;
}

// ───────── 染み（霧・光・花びら・しぶき）：空間に置いた筆の跡 ─────────
// 板を「にじんだ染みの形」で抜く。加算で光らせず、紙の白か顔料の色で塗る。
export interface BlotOpts { color: THREE.ColorRepresentation; opacity?: number; soft?: number; edge?: number; streak?: number; billboard?: boolean; drift?: number; white?: number }
export function blotMaterial(o: BlotOpts): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: {
      ...G, uColor: { value: new THREE.Color(o.color) }, uOpacity: { value: o.opacity ?? 0.6 }, uSoftB: { value: o.soft ?? 0.5 },
      uEdge: { value: o.edge ?? 0.3 }, uStreak: { value: o.streak ?? 0 }, uDrift: { value: o.drift ?? 0 }, uWhite: { value: o.white ?? 0 },
    },
    defines: o.billboard ? { BILLBOARD: '' } : {},
    vertexShader: /* glsl */`
uniform float uTime, uDrift; uniform vec3 uWind;
attribute vec4 aSeed; // インスタンスごとの乱数
varying vec2 vUv; varying vec3 vWorld; varying vec4 vSeed;
void main(){
  vUv = uv; vSeed = vec4(0.5);
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
    mm = modelMatrix * instanceMatrix; vSeed = aSeed;
  #endif
  vec3 c = (mm * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  c += uWind * uDrift * sin(uTime * 0.11 + vSeed.x * 6.28) * 2.0;
  #ifdef BILLBOARD
    vec2 sc = vec2(length(mm[0].xyz), length(mm[1].xyz));
    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 wp = c + right * position.x * sc.x + up * position.y * sc.y;
  #else
    vec3 wp = (mm * vec4(position, 1.0)).xyz + (c - (mm * vec4(0.0, 0.0, 0.0, 1.0)).xyz);
  #endif
  vWorld = wp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,
    fragmentShader: /* glsl */`
precision highp float;
layout(location = 0) out highp vec4 oCol;
layout(location = 1) out highp vec4 gBuf;
uniform vec3 uColor, uPaper; uniform float uOpacity, uSoftB, uEdge, uStreak, uTime, uWhite, uClarity; uniform vec4 uArt;
varying vec2 vUv; varying vec3 vWorld; varying vec4 vSeed;
${NOISE_GLSL}
void main(){
  vec2 p = vUv * 2.0 - 1.0;
  // 染みの輪郭を空間ノイズで歪ませる
  vec4 n = nz(vWorld * 0.045 + vSeed.xyz * 3.0 + vec3(0.0, uTime * 0.004, 0.0));
  vec4 n2 = nz(vWorld * 0.19 + vSeed.zyx);
  float r = length(p * vec2(1.0, 1.0 + uStreak * 2.0)) + (n.r - 0.5) * 0.55 + (n2.g - 0.5) * 0.2;
  float a = 1.0 - smoothstep(1.0 - uSoftB, 1.0, r);
  if (a < 0.004) discard;
  float edge = smoothstep(1.0 - uSoftB * 1.0, 1.0 - uSoftB * 0.35, r) * a;   // 縁の溜まり
  float body = a * (0.75 + (n.g - 0.5) * 0.6 * uArt.x);
  float tooth = nz(vWorld * 0.9).b;
  body *= 1.0 + (0.5 - tooth) * 0.35 * uArt.z;
  vec3 col = mix(uColor, vec3(1.0), uWhite) * uPaper;
  col *= 1.0 - edge * uEdge * uArt.y;
  oCol = vec4(col, clamp(body * uOpacity * vSeed.w * 2.0, 0.0, 1.0));
  gBuf = vec4(0.0);
}`,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  });
}

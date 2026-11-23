// 2D 用の軽い後処理：筆の面へのまとめ（Kuwahara）・途切れる輪郭線・色面の縁の溜まり・紙端の塗り残し。
// VR では使わない（物体側のシェーダーだけで水彩に見せる）。模様は深度から復元した空間位置に固定する。
import * as THREE from 'three';
import { G, NOISE_GLSL } from './watercolor';

export class Post {
  target: THREE.WebGLRenderTarget;
  private scene = new THREE.Scene();
  private cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  mat: THREE.ShaderMaterial;
  enabled = true;
  /** 0=切 1=弱 2=強（Kuwahara の半径） */
  kuwahara = 2;

  constructor(private renderer: THREE.WebGLRenderer) {
    this.target = new THREE.WebGLRenderTarget(4, 4, { count: 2, samples: 4, depthBuffer: true, type: THREE.UnsignedByteType });
    this.target.textures[0].minFilter = this.target.textures[0].magFilter = THREE.LinearFilter;
    this.target.textures[1].minFilter = this.target.textures[1].magFilter = THREE.NearestFilter;
    this.mat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        ...G,
        tCol: { value: this.target.textures[0] }, tG: { value: this.target.textures[1] },
        uPx: { value: new THREE.Vector2() }, uInvVP: { value: new THREE.Matrix4() }, uCamPos: { value: new THREE.Vector3() },
        uCamFwd: { value: new THREE.Vector3() }, uLightV: { value: new THREE.Vector3() },
        uKuw: { value: 2 }, uPostFx: { value: 1 }, uVignette: { value: 1 }, uLineCol: { value: new THREE.Color(0.2, 0.2, 0.34) }, uScale: { value: 1 },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: /* glsl */`
precision highp float;
layout(location = 0) out highp vec4 oCol;
uniform sampler2D tCol, tG; uniform vec2 uPx; uniform mat4 uInvVP; uniform vec3 uCamPos, uCamFwd, uLightV, uPaper, uLineCol;
uniform float uKuw, uPostFx, uClarity, uVignette, uScale; uniform vec4 uArt, uArt2;
varying vec2 vUv;
${NOISE_GLSL}
vec3 worldAt(vec2 uv, float z){ // z = viewZ/400
  vec4 f = uInvVP * vec4(uv * 2.0 - 1.0, 1.0, 1.0); vec3 dir = normalize(f.xyz / f.w - uCamPos);
  return uCamPos + dir * (z * 400.0 / max(dot(dir, uCamFwd), 0.05));
}
vec3 kuw(vec2 uv, float rad){
  // 4象限のうち、ばらつきの最も小さい面の平均を採る＝細部が筆の面にまとまる
  vec3 best = vec3(0.0); float bv = 1e9;
  for (int q = 0; q < 4; q++) {
    vec2 sg = vec2(q == 0 || q == 2 ? 1.0 : -1.0, q < 2 ? 1.0 : -1.0);
    vec3 m = vec3(0.0), m2 = vec3(0.0);
    for (int j = 0; j < 3; j++) for (int i = 0; i < 3; i++) {
      vec3 c = texture(tCol, uv + sg * vec2(float(i), float(j)) * rad * 0.5 * uPx).rgb; m += c; m2 += c * c;
    }
    m /= 9.0; m2 = abs(m2 / 9.0 - m * m);
    float v = m2.r + m2.g + m2.b;
    if (v < bv) { bv = v; best = m; }
  }
  return best;
}
void main(){
  vec4 g0 = texture(tG, vUv);
  float fx = uPostFx;
  vec3 wp = worldAt(vUv, g0.z);
  float sky = step(0.999, g0.z);
  // 紙の凹凸による輪郭のわずかな揺れ（空間に固定）
  vec4 wn = nz(wp * 0.6);
  vec2 uv = vUv + (wn.rg - 0.5) * uPx * 2.2 * uArt.w * fx * (1.0 - sky) * uScale * (1.0 + (1.0 - uClarity) * 2.0);
  vec3 col = uKuw > 0.5 ? kuw(uv, uKuw * uScale) : texture(tCol, uv).rgb;
  vec3 raw = texture(tCol, uv).rgb;
  col = mix(raw, col, fx);

  // 色面の縁の溜まり：周りより明るい側との境で顔料を濃くする
  vec3 blur = (texture(tCol, uv + vec2(2.5, 0.0) * uPx * uScale).rgb + texture(tCol, uv - vec2(2.5, 0.0) * uPx * uScale).rgb
             + texture(tCol, uv + vec2(0.0, 2.5) * uPx * uScale).rgb + texture(tCol, uv - vec2(0.0, 2.5) * uPx * uScale).rgb) * 0.25;
  float lc = dot(col, vec3(0.33)), lb = dot(blur, vec3(0.33));
  float poolE = clamp((lb - lc) * 6.0, 0.0, 1.0);
  col *= 1.0 - poolE * 0.22 * uArt.y * fx;
  // にじみ：水の多い所では色が隣へ染み出す（線の立つ主役は避け、木立・地面・遠景に効かせる）
  float wet = smoothstep(0.42, 0.75, nz(wp * 0.11 + 0.7).g) * (1.0 - g0.a) * (1.0 - sky);
  vec3 far4 = (texture(tCol, uv + vec2(5.0, 3.0) * uPx * uScale).rgb + texture(tCol, uv - vec2(5.0, 3.0) * uPx * uScale).rgb
             + texture(tCol, uv + vec2(-3.0, 5.0) * uPx * uScale).rgb + texture(tCol, uv - vec2(-3.0, 5.0) * uPx * uScale).rgb) * 0.25;
  col = mix(col, mix(blur, far4, 0.6), wet * 0.75 * uArt.x * fx);

  // 墨の線：深度・法線の段差と、塗り分けの境（目・眉・筋）。筆圧で太さと濃さが揺れ、所々でかすれる。
  float w = (0.75 + wn.b * 0.9) * uScale;
  vec4 gL = texture(tG, uv - vec2(w, 0.0) * uPx), gR = texture(tG, uv + vec2(w, 0.0) * uPx);
  vec4 gD = texture(tG, uv - vec2(0.0, w) * uPx), gU = texture(tG, uv + vec2(0.0, w) * uPx);
  float zc = g0.z;
  float dz = max(max(abs(gL.z - zc), abs(gR.z - zc)), max(abs(gD.z - zc), abs(gU.z - zc))) / max(zc, 0.002);
  float dn = max(max(distance(gL.xy, g0.xy), distance(gR.xy, g0.xy)), max(distance(gD.xy, g0.xy), distance(gU.xy, g0.xy)));
  float lineMask = max(max(gL.a, gR.a), max(max(gD.a, gU.a), g0.a));
  // 塗りの境：元の絵の明るさの段差
  float l0 = dot(raw, vec3(0.33));
  float dl = max(max(abs(dot(texture(tCol, uv - vec2(w, 0.0) * uPx).rgb, vec3(0.33)) - l0), abs(dot(texture(tCol, uv + vec2(w, 0.0) * uPx).rgb, vec3(0.33)) - l0)),
                 max(abs(dot(texture(tCol, uv - vec2(0.0, w) * uPx).rgb, vec3(0.33)) - l0), abs(dot(texture(tCol, uv + vec2(0.0, w) * uPx).rgb, vec3(0.33)) - l0)));
  float e = max(max(smoothstep(0.03, 0.075, dz), smoothstep(0.2, 0.46, dn) * 0.9), smoothstep(0.13, 0.3, dl) * 0.75 * g0.a);
  vec3 vn = vec3(g0.xy * 2.0 - 1.0, 0.0); vn.z = sqrt(max(1.0 - dot(vn.xy, vn.xy), 0.0));
  float lit = smoothstep(0.3, 0.9, dot(vn, uLightV));
  vec4 bn = nz(wp * 0.23 + 0.5);
  float breakup = smoothstep(0.14, 0.42, bn.r * 0.6 + wn.a * 0.4);        // かすれ・途切れ
  float lineA = e * lineMask * breakup * (1.0 - lit * 0.45) * (0.72 + bn.g * 0.5) * uArt2.x;
  vec3 ink = mix(col * uLineCol, vec3(0.27, 0.22, 0.24), 0.62);          // 黒ではなく、藍を含んだ墨
  col = mix(col, ink, clamp(lineA, 0.0, 0.86));

  // 紙の端は塗り残す（不定形の白へ溶かす）
  vec2 p = vUv * 2.0 - 1.0;
  float vg = smoothstep(0.86, 1.12, length(p * vec2(0.93, 0.98)) + (nz(vec3(vUv * 1.3, 0.37)).r - 0.5) * 0.22);
  col = mix(col, uPaper, vg * uVignette);
  oCol = vec4(col, 1.0);
}`,
      depthTest: false, depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mat);
    quad.frustumCulled = false;
    this.scene.add(quad);
  }

  setSize(w: number, h: number): void {
    this.target.setSize(w, h);
    this.mat.uniforms.uPx.value.set(1 / w, 1 / h);
    this.mat.uniforms.uScale.value = Math.max(0.75, h / 1080);
  }

  render(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    const r = this.renderer;
    if (!this.enabled) { r.setRenderTarget(null); r.render(scene, camera); return; }
    r.setRenderTarget(this.target);
    r.render(scene, camera);
    r.setRenderTarget(null);
    const u = this.mat.uniforms;
    u.uKuw.value = this.kuwahara;
    u.uInvVP.value.multiplyMatrices(camera.matrixWorld, camera.projectionMatrixInverse);
    camera.getWorldPosition(u.uCamPos.value);
    camera.getWorldDirection(u.uCamFwd.value);
    u.uLightV.value.copy(G.uLightDir.value).transformDirection(camera.matrixWorldInverse);
    r.render(this.scene, this.cam);
  }
}

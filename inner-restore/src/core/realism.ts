// 映像のリアリティを上げる、全区域共通のしかけ（画面版・VR 版で共用）。
//   1. 探照灯：潜行士の頭の上の小さな光。濡れた面（粘液・糖の衣）に、内視鏡の映像のような点の照り返しが動く。
//   2. 接地の影：潜行士の足もとの、やわらかい影。体が床から浮いて見えるのを防ぐ。
//   3. 漂う粒：液の中の細かな粒（たんぱく質のかたまりや細胞のかけら）。ブラウン運動で揺れ、流れに運ばれ、奥行きと水の感じを出す。
//   4. 影（高画質のみ）：主光源の影。細胞や線維が、床やおたがいに影を落とす。
//   5. 表面の細かな凹凸と、光の透け（organic）：なめらかすぎる面に、細胞の膜のような細かな起伏と、薄い所が光に透ける感じを足す。
import * as THREE from 'three/webgpu';
import { tsl, type N } from './tsl';
import type { ZoneStage } from '../stages/zone';
import { keyLightDirView } from '../materials/cell';
const { uv, float, color, length, smoothstep, uniform, texture, positionWorld, bumpMap, normalView, positionViewDirection, dot, saturate, pow, vec2 } = tsl;

export interface Realism { update(dt: number, t: number, diver: THREE.Vector3, camPos: THREE.Vector3): void; lamp: THREE.PointLight }

export function addRealism(stage: ZoneStage, renderer: THREE.WebGPURenderer, tier: string, opts: { shadows?: boolean; motes?: number } = {}): Realism {
  const scene = stage.scene, vr = tier === 'vr';
  // ---- 1. 探照灯 ----
  const lamp = new THREE.PointLight(0xfff2e4, 20, 52, 2); scene.add(lamp);
  // 明るさの基調：全体を白っぽく均一に照らさない。まわりの光を落とし、探照灯の届く所が明るく、遠くは沈む（内視鏡・顕微鏡の映像の明暗）
  const LOOK = { hemi: 0.55, sun: 0.8, fog: 0.72, env: 0.8 };
  scene.traverse((o) => { if ((o as THREE.HemisphereLight).isHemisphereLight) (o as THREE.HemisphereLight).intensity *= LOOK.hemi; });
  scene.environmentIntensity *= LOOK.env;
  const fogOut = new THREE.Color(-1, -1, -1), bgOut = new THREE.Color(-1, -1, -1); let sunOut = -1;
  // ---- 2. 接地の影 ----
  const sm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const sStr = uniform(0.5); const d = length(uv().sub(0.5)).mul(2);
  sm.colorNode = color(0x1a0806); sm.opacityNode = smoothstep(1.0, 0.1, d).pow(1.6).mul(sStr);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), sm); shadow.renderOrder = 4; scene.add(shadow);
  // ---- 3. 漂う粒 ----
  const NM = opts.motes ?? (vr ? 110 : tier === 'pc-high' ? 420 : 240), BOX = 36;
  const mm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false });
  mm.colorNode = color(0xfff0e2); mm.opacityNode = pow(saturate(dot(normalView, positionViewDirection)), float(1.5)).mul(0.3);   // 縁へ向かって消える、やわらかい粒
  const motes = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), mm, NM); motes.frustumCulled = false; motes.renderOrder = 30; scene.add(motes);
  let sd = 77; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const mp = Array.from({ length: NM }, () => ({ p: new THREE.Vector3(rnd() * BOX, rnd() * BOX, rnd() * BOX), s: 0.03 + rnd() ** 4 * 0.09, ph: rnd() * 6.28, f: 0.4 + rnd() * 0.8 }));
  const flow = new THREE.Vector3(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3();
  // ---- 4. 影（高画質のみ）----
  if (opts.shadows) {
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const sun = stage.sun, [W, D] = stage.size, R = Math.max(W, D) * 0.6;
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.25; sun.shadow.radius = 3;
    const sc = sun.shadow.camera as THREE.OrthographicCamera; sc.left = -R; sc.right = R; sc.top = R; sc.bottom = -R; sc.near = 1; sc.far = 400; sc.updateProjectionMatrix();
    scene.traverse((o) => {
      const m = o as THREE.Mesh; if (!m.isMesh || m === shadow || m === motes) return;
      const mat = m.material as THREE.Material; const solid = !mat.transparent && mat.blending === THREE.NormalBlending;
      // 大きな面（床・壁）は影を受けるだけ。細胞・線維・潜行士は影を落とす
      const big = m.geometry.boundingSphere ? m.geometry.boundingSphere.radius * Math.max(m.scale.x, m.scale.y, m.scale.z) > R : false;
      m.receiveShadow = solid; m.castShadow = solid && !big;
    });
  }
  return {
    lamp,
    update(dt, t, diver, camPos) {
      // 区域が毎コマ書き直す値（主光源・霧・背景）に、基調を掛ける。書き直されていないコマでは掛け直さない
      const sun = stage.sun; if (sun.intensity !== sunOut) { sun.intensity *= LOOK.sun; sunOut = sun.intensity; }
      const fog = scene.fog as THREE.FogExp2 | null; if (fog && !fog.color.equals(fogOut)) { fog.color.multiplyScalar(LOOK.fog); fogOut.copy(fog.color); }
      const bg = scene.background as THREE.Color | null; if (bg?.isColor && !bg.equals(bgOut)) { bg.multiplyScalar(LOOK.fog); bgOut.copy(bg); }
      // 探照灯は、頭の少し上・カメラ寄り。照り返しがカメラの動きで動く
      v.copy(camPos).sub(diver).setY(0); if (v.lengthSq() > 1e-4) v.normalize();
      lamp.position.set(diver.x + v.x * 2.6, diver.y + 3.6, diver.z + v.z * 2.6);
      const fy = stage.floorHeight(diver.x, diver.z), h = Math.max(0, diver.y - fy);
      shadow.position.set(diver.x, fy + 0.04, diver.z); const s = 1.7 + h * 0.5; shadow.scale.set(s, 1, s); sStr.value = 0.72 * Math.exp(-h * 0.35);
      // 粒：流れに乗り、ブラウン運動で小刻みに揺れる。カメラのまわりの箱の中を回りこむ
      if (stage.drift) flow.copy(stage.drift(diver)); else flow.set(0, 0, 0);
      const cx = camPos.x - BOX / 2, cy = camPos.y - BOX / 2, cz = camPos.z - BOX / 2;
      for (let i = 0; i < NM; i++) {
        const m = mp[i];
        m.p.x += (flow.x * 0.8 + Math.sin(t * m.f + m.ph) * 0.12) * dt; m.p.y += (flow.y * 0.8 + Math.sin(t * m.f * 1.3 + m.ph * 2) * 0.1) * dt; m.p.z += (flow.z * 0.8 + Math.cos(t * m.f * 0.9 + m.ph) * 0.12) * dt;
        const x = cx + ((((m.p.x - cx) % BOX) + BOX) % BOX), y = cy + ((((m.p.y - cy) % BOX) + BOX) % BOX), z = cz + ((((m.p.z - cz) % BOX) + BOX) % BOX);
        // 箱の端では小さくして、出入りを目立たせない
        const e = Math.min(x - cx, cx + BOX - x, y - cy, cy + BOX - y, z - cz, cz + BOX - z) / 4;
        motes.setMatrixAt(i, m4.compose(v.set(x, y, z), q, sv.setScalar(m.s * Math.min(1, e))));
      }
      motes.instanceMatrix.needsUpdate = true;
    },
  };
}

/** 表面の細かな凹凸と、光の透け。区域の主な面の材質に足す（色や光り方の式は変えない）。
 *  scale：凹凸の細かさ（µm）。bump：起伏の強さ。sss：薄い縁が主光源に透ける色と強さ。 */
export function organic(mat: THREE.MeshPhysicalNodeMaterial, noiseTex: THREE.Texture, o: { scale?: number; bump?: number; sss?: THREE.ColorRepresentation; sssAmt?: number; planar?: 'xz' | 'xy' | 'tri' } = {}) {
  const s = o.scale ?? 2.4, P = positionWorld;
  const uvA = o.planar === 'xy' ? vec2(P.x, P.y) : o.planar === 'tri' ? vec2(P.x.add(P.y.mul(0.5)), P.z.add(P.y.mul(0.5))) : vec2(P.x, P.z);
  // 2つの細かさを重ねた高さ（細胞の膜の、ゆるい起伏＋ごく細かいざらつき）
  const hgt: N = texture(noiseTex, uvA.div(s * 3.1)).r.mul(0.65).add(texture(noiseTex, uvA.div(s).add(0.37)).g.mul(0.35));
  mat.normalNode = bumpMap(hgt, float(o.bump ?? 0.55));
  if (o.sss !== undefined) {
    // 光の透け：主光源を背にした薄い縁が、内側から明るむ（組織は光を通す）
    const L = keyLightDirView, V = positionViewDirection;
    const back = pow(saturate(dot(V, L.negate()).mul(0.5).add(0.5)), float(2)), rim = pow(float(1).sub(saturate(dot(normalView, V))), float(2.2));
    const add = color(new THREE.Color(o.sss)).mul(rim.mul(back).mul(o.sssAmt ?? 0.35));
    mat.emissiveNode = mat.emissiveNode ? (mat.emissiveNode as N).add(add) : add;
  }
  return mat;
}

import * as THREE from 'three/webgpu';
import { tsl } from '../core/tsl';
const { color, texture, uniform, uv, normalView, positionViewDirection, float, dot, pow, saturate, exp, mix, normalize } = tsl;

/** 半透明の細胞のマテリアル。厚みテクスチャ（G）で光の透けを、AO（R）で陰を作る。
 *  WebGL 2 と WebGPU の両方で同じ見た目になる記述だけを使う（基本の見た目の土台）。 */
export interface CellMaterialOpts {
  color: THREE.ColorRepresentation;       // 反射で見える色
  transmit: THREE.ColorRepresentation;    // 透過光の色
  orm?: THREE.Texture | null;             // R=AO, G=厚み
  absorption?: number;                    // 厚みによる減衰の強さ
  wet?: number;                           // 濡れ（クリアコート）
}
export const keyLightDirView = uniform(new THREE.Vector3(0, 1, 0)); // 主光源の向き（ビュー空間）。毎フレーム更新する
export const keyLightColor = uniform(new THREE.Color(1, 0.95, 0.9));

export function makeCellMaterial(o: CellMaterialOpts): THREE.MeshPhysicalNodeMaterial {
  const m = new THREE.MeshPhysicalNodeMaterial();   // クリアコート 0 のときは中で省かれる
  const orm = o.orm ? texture(o.orm, uv()) : null;
  const ao = orm ? orm.r : float(1);
  const thick = orm ? orm.g : float(0.6);
  m.colorNode = color(new THREE.Color(o.color));
  m.roughnessNode = float(0.38);
  m.metalnessNode = float(0);
  if ((o.wet ?? 0.6) > 0) { m.clearcoatNode = float(o.wet ?? 0.6); m.clearcoatRoughnessNode = float(0.18); }
  m.aoNode = ao;
  // 透過：光源の反対側から見たとき、薄い所ほど明るく透ける（Beer-Lambert 風）
  const L = keyLightDirView;
  const V = positionViewDirection;
  const H = normalize(L.add(normalView.mul(0.35)));
  const back = pow(saturate(dot(V, H.negate())), float(3.0));
  const wrap = saturate(dot(normalView.negate(), L).mul(0.5).add(0.5));
  const atten = exp(thick.mul(-(o.absorption ?? 2.2)));
  const rim = pow(float(1).sub(saturate(dot(normalView, V))), float(3.0));
  const trans = color(new THREE.Color(o.transmit)).mul(keyLightColor).mul(back.mul(1.6).add(wrap.mul(0.25))).mul(atten);
  m.emissiveNode = trans.add(color(new THREE.Color(o.transmit)).mul(rim).mul(mix(float(0.05), float(0.22), atten)));
  return m;
}

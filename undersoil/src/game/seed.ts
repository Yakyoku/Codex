// 吸水したシロツメクサの種：区画の奥（道の終わりの先）に置く。1 単位 = 10 µm。
// 形と色の根拠は Docs/REFERENCE/species/trifolium-repens.md「種子（休眠中）」「S1 吸水」：
//   ・幅の広いハート形。くぼみの位置に「へそ」（さやについていた跡）、その横に、中の幼根の先が張り出した「こぶ」がある（非対称）
//   ・長さ 1.0〜1.5mm、厚さは長さの約 6 割。ここでは長さ 約 1.15mm × 幅 0.95mm × 厚さ 0.7mm（吸水してふくらんだ姿）
//   ・表面はなめらかで、鈍いつや。模様・毛・すじはない。色は黄〜山吹色（写真 RGB(222,190,80)〜(226,150,50)）
//   ・種皮の表面には、柵状の細胞（直径 10〜15µm）の、ごく浅いでこぼこ（この大きさの世界では見える）
import * as THREE from 'three/webgpu';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { bumpMap, float, mix, mx_noise_float, mx_worley_noise_float, positionLocal, saturate, smoothstep, vec3 } from 'three/tsl';

export function buildSeed(center: THREE.Vector3, opts: { segments?: number } = {}) {
  const seg = opts.segments ?? 128;
  // 球の極（線が集まる点）が出ないよう、正二十面体を細かく割った球から作る
  const g = mergeVertices(new THREE.IcosahedronGeometry(1, Math.round(seg / 3)).deleteAttribute('normal').deleteAttribute('uv'));
  const pos = g.attributes.position as THREE.BufferAttribute; const v = new THREE.Vector3();
  const notch = new THREE.Vector3(-0.15, 1, 0).normalize(), knob = new THREE.Vector3(-0.75, 0.66, 0).normalize(), tip = new THREE.Vector3(0.1, -1, 0).normalize();
  const bump = (d: THREE.Vector3, axis: THREE.Vector3, w: number) => { const a = Math.acos(Math.min(1, Math.max(-1, d.dot(axis)))); return Math.exp(-((a / w) ** 2)); };
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize(); const d = v.clone();
    let r = 1 - 0.16 * bump(d, notch, 0.30) + 0.13 * bump(d, knob, 0.42) + 0.06 * bump(d, tip, 0.55);   // へその くぼみ、幼根のこぶ、とがり気味の下端
    r *= 1 + 0.012 * Math.sin(d.x * 7 + d.y * 5) * Math.cos(d.z * 6);                                    // わずかなゆがみ
    v.multiplyScalar(r).multiply(new THREE.Vector3(48, 57, 35));                                         // 幅 0.95 × 長さ 1.15 × 厚さ 0.7 mm（半径、単位 10µm）
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();

  const m = new THREE.MeshPhysicalNodeMaterial();
  const p = positionLocal;
  // 色：黄〜山吹のゆるいむら。へその まわりは少し濃く、吸水で全体がわずかに明るい（線形の値）
  const patch = saturate(mx_noise_float(p.mul(0.035)).mul(0.9).add(0.5));
  let col = mix(vec3(0.52, 0.27, 0.035), vec3(0.62, 0.40, 0.06), patch);   // 写真の黄〜山吹（照明に当たる前の色なので、やや濃いめ）
  const hil = smoothstep(14.0, 4.0, p.sub(vec3(-8.0, 55.0, 0.0)).length());
  col = mix(col, vec3(0.36, 0.20, 0.06), hil.mul(0.8));
  // 柵状細胞のごく浅い網目（直径 1〜1.5 単位）。細胞の境目がわずかに暗い
  const cell = mx_worley_noise_float(p.mul(0.8));
  col = col.mul(mix(float(1.0), float(0.86), smoothstep(0.25, 0.55, cell).mul(0.6)));
  m.colorNode = col;
  m.roughnessNode = mix(float(0.5), float(0.62), patch);      // 鈍いつや
  m.clearcoatNode = float(0.25); m.clearcoatRoughnessNode = float(0.38);   // 吸水した種皮の、しっとりした光沢
  m.normalNode = bumpMap(cell.mul(-0.35).add(mx_noise_float(p.mul(0.2)).mul(0.25)), float(0.6));
  m.sheenNode = float(0.06); m.sheenColor = new THREE.Color(1.0, 0.85, 0.5);
  const mesh = new THREE.Mesh(g, m); mesh.name = 'seed';
  mesh.position.copy(center); mesh.rotation.set(0.2, 0.0, 1.35);   // へそとこぶを、道の終わり（−X）のほうへ向ける
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}

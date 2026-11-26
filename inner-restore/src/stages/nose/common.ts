// ステージ2「鼻」の共通部品：線毛の森（呼吸上皮の線毛）、粘液の層、上皮の床。単位は µm。
// 事実（Docs/REFERENCE/nose.md）：線毛は長さ 5〜7µm・太さ 0.2〜0.3µm、表面 1µm² あたり 6〜8本、1秒に 約 10〜12回打つ。
//   打ち方は「まっすぐ伸びて力強く前へ払う（有効打）」と「曲がって低く戻る（回復打）」。隣どうしが少しずつ遅れて打つので、波（メタクロナール波）が走る。
//   線毛のまわりの層（PCL）は 約 6〜7µm、その上を粘液のゲルの層が流れる（鼻の粘液全体で 10〜15µm、運ばれる速さ 5〜10mm/分）。
// 簡略化：線毛の本数は実物の約半分（描く負荷のため）。潜行士は粘液のゲルの上に立ち、透ける粘液ごしに下の線毛の森を見る（線毛の間は狭すぎて歩けない）。
import * as THREE from 'three/webgpu';
import { organic } from '../../core/realism';
import { tsl, type N } from '../../core/tsl';

const { attribute, uniform, float, vec3, color, mix, sin, cos, fract, smoothstep, saturate, positionWorld, texture, vec2, length, exp, cameraPosition, max, pow, dot, normalView, positionViewDirection } = tsl;

export const PCL = 6.5;          // 線毛の層の厚み（µm）
export const GEL = 5;            // 粘液のゲルの層の厚み（見せる分）
export const CILIUM = 6;         // 線毛の長さ

export interface CiliaOpts { W: number; D: number; density: number; Hat: (xz: N) => N; time: N; wave: N; diver: N; beatHz: number; goblet?: (x: number, z: number) => boolean; seed?: number }
/** 線毛の森：1本を細い帯2枚（十字）で描き、曲げ方は頂点の計算で決める（1枚の形にまとめて描く） */
export function ciliaField(o: CiliaOpts) {
  const n = Math.round(o.W * o.D * o.density), SEG = 6, SIDES = 5;
  const pos: number[] = [], sAttr: number[] = [], base: number[] = [], ph: number[] = [], idx: number[] = [];
  let sd = o.seed ?? 7; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  let v = 0;
  for (let i = 0; i < n; i++) {
    const x = (rnd() - 0.5) * o.W, z = (rnd() - 0.5) * o.D;
    if (o.goblet?.(x, z)) continue;                         // 杯細胞の上には線毛がない
    const r = rnd();
    // 1本を、丸い断面（5角）の細い管として作る。先は丸くすぼめる
    for (let k = 0; k <= SEG; k++) for (let j = 0; j < SIDES; j++) { pos.push(x, 0, z); sAttr.push(k / SEG, (j / SIDES) * Math.PI * 2, 0); base.push(x, 0, z); ph.push(r); }
    for (let k = 0; k < SEG; k++) for (let j = 0; j < SIDES; j++) {
      const a = v + k * SIDES + j, b = v + k * SIDES + (j + 1) % SIDES;
      idx.push(a, b, b + SIDES, a, b + SIDES, a + SIDES);
    }
    v += (SEG + 1) * SIDES;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aS', new THREE.Float32BufferAttribute(sAttr, 3));
  g.setAttribute('aBase', new THREE.Float32BufferAttribute(base, 3));
  g.setAttribute('aRnd', new THREE.Float32BufferAttribute(ph, 1));
  g.setIndex(idx); g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Math.hypot(o.W, o.D));
  const m = new THREE.MeshStandardNodeMaterial({ side: THREE.DoubleSide, transparent: true, depthWrite: true });
  const aS = attribute('aS', 'vec3'), b = attribute('aBase', 'vec3'), rr = attribute('aRnd', 'float');
  const s = aS.x;
  const Hc: N = o.Hat(b.xz);   // 健康度（根元の場所で。頂点の位置から引くと、位置の計算が自分を参照してしまう）
  const sick = float(1).sub(Hc);
  // 位相：時間とともに進み、x の向きに少しずつ遅れる（波が +x へ走る）。病んだ所は、ばらばら
  const phase = fract(o.time.mul(o.beatHz).sub(b.x.div(o.wave)).add(rr.mul(sick.mul(3))));
  // 有効打（位相 0〜0.35）：まっすぐのまま -1.0 → +1.1 rad。回復打（0.35〜1）：根元から曲がって低く戻る
  const eff = smoothstep(0.0, 0.35, phase);
  const rec = smoothstep(0.35, 1.0, phase);
  const isEff = phase.lessThan(0.35);
  const th0 = isEff.select(mix(float(-1.0), float(1.1), eff), mix(float(1.1), float(-1.0), rec));
  const kap = isEff.select(float(0.15), sin(rec.mul(Math.PI)).mul(-2.2));
  // 病んだ線毛は寝て、ほとんど動かない。抜け落ちた線毛は長さ 0
  const lost = smoothstep(0.55, 0.9, sick.mul(rr.mul(0.6).add(0.55)));
  const lie = mix(th0.mul(mix(float(1), float(0.15), sick)), float(1.25).add(rr.mul(0.3)), sick.mul(0.85));
  const kk = mix(kap, float(0.6), sick);
  const L = float(CILIUM).mul(rr.mul(0.3).add(0.85)).mul(float(1).sub(lost));
  const thm = lie.add(kk.mul(s).mul(0.5));
  // 潜行士のすぐ下の線毛は、押されて少しよける
  const away = b.xz.sub(o.diver.xz); const dd = length(away);
  const push = exp(dd.mul(dd).mul(-0.25)).mul(0.6);
  const off = vec3(sin(thm).mul(L).mul(s), cos(thm).mul(L).mul(s), float(0)).add(vec3(away.x.div(dd.add(0.01)).mul(push).mul(s).mul(2), float(0), away.y.div(dd.add(0.01)).mul(push).mul(s).mul(2)));
  // 管の断面：線毛の向き（接線）に直交する向きへ、半径ぶん広げる。光の当たり方（法線）も同じ向き
  const ang = aS.y;
  const nrm = vec3(cos(thm), sin(thm).negate(), float(0));
  const radial = nrm.mul(cos(ang)).add(vec3(0, 0, 1).mul(sin(ang)));
  const rad = float(0.13).mul(float(1).sub(smoothstep(0.82, 1.0, s).mul(0.75)));   // 太さ 約0.25µm、先は丸く
  m.positionNode = b.add(off).add(radial.mul(rad));
  m.normalNode = tsl.transformNormalToView(radial);
  m.colorNode = mix(color(0xbfb2a2), color(0xf2ebe4), Hc).mul(mix(float(0.75), float(1.05), s));
  m.roughnessNode = float(0.45); m.metalnessNode = float(0);
  m.opacityNode = mix(float(0.55), float(0.85), Hc).mul(smoothstep(1.2, 3.5, length(positionWorld.sub(cameraPosition))));
  m.emissiveNode = color(0xfff4e6).mul(Hc.mul(0.06).mul(s));
  const mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false; mesh.renderOrder = 10;
  return { mesh, count: n };
}

/** 上皮の床：線毛細胞と杯細胞の頂面（ゆるい丸み）。杯細胞は粘液の粒をためた口が開いている */
export function epithelium(W: number, D: number, H: N, noise: THREE.Texture) {
  const g = new THREE.PlaneGeometry(W * 1.2, D * 1.2, 1, 1); g.rotateX(-Math.PI / 2);
  const m = new THREE.MeshStandardNodeMaterial();
  const cells = texture(noise, positionWorld.xz.mul(1 / 18)).r;   // 細胞の境目（焼き込みのノイズの R）
  const fine = texture(noise, positionWorld.xz.mul(1 / 3)).g;
  const border = smoothstep(0.62, 0.9, cells);
  // 生体の鼻の粘膜は淡い桃色。炎症では赤く腫れる（血管が広がる）
  m.colorNode = mix(color(0xd98c84), color(0xe8b4a8), H).mul(mix(float(1), float(0.78), border)).mul(fine.mul(0.12).add(0.9));
  m.roughnessNode = float(0.5);
  m.emissiveNode = color(0xb83a2a).mul(float(1).sub(H).mul(0.12));
  organic(m as unknown as THREE.MeshPhysicalNodeMaterial, noise, { scale: 2.4, bump: 0.6 });   // 細胞の上面の細かな起伏
  const mesh = new THREE.Mesh(g, m); mesh.position.y = -0.05; return mesh;
}

/** 粘液のゲルの層：透ける上面（潜行士が立つ面）。流れの向き（+x）へ模様が動く。健康：澄んで流れる／病：濁って黄みを帯び、止まる */
export function mucusLayer(W: number, D: number, H: N, noise: THREE.Texture, flowX: N, rich: boolean) {
  const g = new THREE.PlaneGeometry(W * 1.2, D * 1.2, 64, 48); g.rotateX(-Math.PI / 2);
  const m = new THREE.MeshPhysicalNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const p = positionWorld.xz.add(vec2(flowX.negate(), 0));
  const swirl = texture(noise, p.mul(1 / 22)).b, fine = texture(noise, p.mul(1 / 5)).a;
  const sick = float(1).sub(H);
  const fres = pow(float(1).sub(saturate(dot(normalView, positionViewDirection).abs())), float(3));
  m.colorNode = mix(color(0xe8eef0), color(0xd8cc9a), sick.mul(0.8)).mul(swirl.mul(0.15).add(0.9));
  m.roughnessNode = float(0.12); m.metalnessNode = float(0);
  // 濡れた粘膜のつや：ゆるいうねりの面に、光がなめらかに映る
  m.clearcoatNode = float(rich ? 0.9 : 0.6); m.clearcoatRoughnessNode = float(0.08);
  m.positionNode = tsl.positionLocal.add(vec3(0, sin(tsl.positionLocal.x.mul(0.16).add(flowX.mul(0.16))).mul(0.25).add(cos(tsl.positionLocal.z.mul(0.21)).mul(0.18)), 0));
  m.opacityNode = saturate(mix(float(0.12), float(0.62), sick.mul(swirl.mul(0.5).add(0.6))).add(fres.mul(0.3)).add(fine.mul(0.04)));
  m.emissiveNode = color(0xfff8f0).mul(fres.mul(0.05));
  const mesh = new THREE.Mesh(g, m); mesh.position.y = 0; mesh.renderOrder = 30; return mesh;
}
void max; void uniform;

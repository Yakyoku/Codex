// ステージ1「目」— 区域A：網膜の内側の面（M1 の区画）
// 足もとは内境界膜。その下の透明な網膜の中を、浅い毛細血管網が走る。単位は µm。
import * as THREE from 'three/webgpu';
import { tsl, type N } from '../../core/tsl';
import { loadGLB, makeEnvironment } from '../../core/assets';
import { HealthField, flowFactor } from '../../core/health';
import type { ZoneStage, ZoneMeta } from '../zone';
import { makeCellMaterial, keyLightDirView } from '../../materials/cell';
import type { Tier } from '../../core/device';
import tuning from '../../data/tuning.json';

const { uniform, texture, positionWorld, positionLocal, normalLocal, normalView, positionViewDirection, vec2, vec3, vec4, float, color, mix, smoothstep,
  sin, cos, exp, pow, dot, saturate, abs, vertexColor, mx_worley_noise_float, mx_fractal_noise_float, uv, length, max, min, Fn } = tsl;

const RETINA_META: ZoneMeta = {
  id: 'retina', hud: '網膜・内側の面　血流の回復', swimCeil: 50,
  enter: 'こちらオペレーター。硝子体の中に入りました。ほとんどが水の、透明なゼリーの中です。上から差す瞳の光の柱をたどって、網膜まで泳いで降りてください。',
  arrive: 'こちらオペレーター。網膜の内側の面に着きました。足もとの白い濁りは、血流が止まった組織です。スキャンで閉塞点を探し、浄化で流れを取り戻してください。',
  plugName: '閉塞点', plugHit: '塊に当たっています。止まった赤血球の塊です。そのまま当て続けて、ほぐしてください。',
  plugCleared: (left) => (left ? `塊がほぐれ、血が流れはじめました。残りの閉塞点は ${left} か所です。スキャンで探してください。` : 'すべての閉塞点がほぐれました。網膜の血流が戻りつつあります。'),
  done: '血流が戻りました。網膜が、透明さを取り戻していきます。', doneTitle: '区域の血流が戻りました', causeMain: '毛細血管の血流停止（虚血）',
};
interface RetinaData { size: [number, number]; rOuter: number; rLumen: number; edges: number[][][]; nuclei: { edge: number; s: number; p: number[] }[]; pericytes: { edge: number; s: number; p: number[] }[]; floor: { bulge: number; sigma: number }; }

export interface RetinaStage extends ZoneStage {
  vesselDist(x: number, z: number): number;
  cores: THREE.Vector3[];
  points: { rbc: () => THREE.Vector3; nucleus: THREE.Vector3; pericyte: THREE.Vector3 };
}

export async function buildRetina(renderer: THREE.WebGPURenderer, tier: Tier, opts: { entrance?: boolean } = {}): Promise<RetinaStage> {
  const noiseTex = new THREE.TextureLoader().load('/static/img/noise.png');
  noiseTex.wrapS = noiseTex.wrapT = THREE.RepeatWrapping; noiseTex.colorSpace = THREE.NoColorSpace; noiseTex.anisotropy = 4;
  const [gltf, rbcGltf, data] = await Promise.all([
    loadGLB('/static/models/retina.glb'), loadGLB('/static/models/rbc.glb'),
    fetch('/static/data/retina.json').then((r) => r.json() as Promise<RetinaData>),
  ]);
  const [W, D] = data.size;
  const scene = new THREE.Scene();
  const vr = tier === 'vr';
  const rich = tier === 'pc-high';   // 重い表現（クリアコート、光の筋、たくさんの光）は PC 高画質だけ
  // 焼き込み済みのノイズを引く（毎コマ計算しない）。R=細胞の境目 G=細かい B=雲 A=中くらい。1枚で約29µm
  const nz = (scale: number, off = vec2(0, 0)): N => texture(noiseTex, positionWorld.xz.mul(scale / 28.8).add(off));
  // 空気と背景：本物の生体の映像では、組織も空間も拡散した光に満ちていて、遠くは光に溶ける（真っ暗な背景はない）
  scene.background = new THREE.Color(0x2a1a14);
  const fogCol = new THREE.Color(0x9c7462);
  scene.fog = new THREE.FogExp2(fogCol.getHex(), 0.0085);
  scene.environment = makeEnvironment(renderer, new THREE.Color(0.9, 0.5, 0.4));
  scene.environmentIntensity = 0.22;

  // ---- 健康度 ----
  const hc = tuning.health;
  const health = new HealthField(hc.gridW, hc.gridH, W, D, 0.04);
  const hBytes = new Uint8Array(hc.gridW * hc.gridH);
  const hTex = new THREE.DataTexture(health.toBytes(hBytes), hc.gridW, hc.gridH, THREE.RedFormat, THREE.UnsignedByteType);
  hTex.magFilter = hTex.minFilter = THREE.LinearFilter; hTex.needsUpdate = true;
  let hVersion = health.version;

  const u = {
    time: uniform(0), scan: uniform(0), lightIn: uniform(0.35), heartPhase: uniform(0),
    beamPos: uniform(new THREE.Vector3(0, -999, 0)), beamOn: uniform(0),
    scanR: uniform(0), scanOrigin: uniform(new THREE.Vector3()), scanPulse: uniform(0),
  };
  const hUV = vec2(positionWorld.x.div(W).add(0.5), positionWorld.z.div(D).add(0.5));
  const H: N = texture(hTex, hUV).r;                                  // その場所の健康度
  const edgeFade = smoothstep(0.0, 0.08, hUV.x).mul(smoothstep(1.0, 0.92, hUV.x)).mul(smoothstep(0.0, 0.1, hUV.y)).mul(smoothstep(1.0, 0.9, hUV.y));
  const fres = pow(float(1).sub(saturate(dot(normalView, positionViewDirection))), float(4.0));
  // 浄化ビームの当たっている所の淡い光（治療の光）
  const beamGlow = exp(length(positionWorld.xz.sub(u.beamPos.xz)).div(tuning.beam.radius * 0.55).pow(2).negate()).mul(u.beamOn);
  // スキャン表示（スーツの画面表示。健康度を色で示す。細胞そのものの性質ではない）
  const scanCol = mix(color(0xffa040), color(0x5fe8d0), H);
  // スキャンの波紋（スーツの走査表示）：主人公から広がる細い輪。健康度に応じて色が変わる
  const scanRing = exp(length(positionWorld.xz.sub(u.scanOrigin.xz)).sub(u.scanR).div(0.9).pow(2).negate()).mul(u.scanPulse);
  const pulse = sin(u.heartPhase.sub(positionWorld.x.mul(0.05))).mul(0.5).add(0.5).pow(3.0);   // 心拍に同期した脈動
  // 光の散乱の焼き込み：組織の中で光は数十µm 散ってから戻るため、血管のまわりは血液を通った赤い光でほのかに染まる。
  //   読み込み時に1回だけ、血管の中心線からの距離で「にじみの強さ」を計算してテクスチャにする（毎コマの計算はしない）
  const scatterTex = (() => {
    const gw = 128, gh = Math.round(128 * D / W), out = new Uint8Array(gw * gh * 4);
    const pts: number[] = []; for (const e of data.edges) for (let i = 0; i < e.length; i += 1) pts.push(e[i][0], e[i][2]);
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
      const x = (i / (gw - 1) - 0.5) * W, z = (j / (gh - 1) - 0.5) * D;
      let near = 1e9, sum = 0;
      for (let k = 0; k < pts.length; k += 2) { const dx = pts[k] - x, dz = pts[k + 1] - z, d2 = dx * dx + dz * dz; if (d2 < near) near = d2; if (d2 < 400) sum += Math.exp(-d2 / 90); }
      const o = (j * gw + i) * 4;
      out[o] = Math.min(255, Math.exp(-near / 30) * 255);        // R：血管のすぐそば（強いにじみ）
      out[o + 1] = Math.min(255, Math.exp(-near / 260) * 255);   // G：広い範囲のにじみ
      out[o + 2] = Math.min(255, sum * 18);                        // B：血管の密度
      out[o + 3] = 255;
    }
    const t = new THREE.DataTexture(out, gw, gh, THREE.RGBAFormat, THREE.UnsignedByteType);
    t.magFilter = t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t;
  })();
  const scatter: N = texture(scatterTex, hUV);
  // 血が流れているほど赤く光がにじむ（止まった血は暗く沈む）
  const bloodGlow: N = color(0xd8341c).mul(scatter.r.mul(0.55).add(scatter.g.mul(0.35))).mul(H.mul(H)).mul(u.lightIn.mul(0.7).add(0.3));

  // ---- 内境界膜（透明な床）----
  const meshes: Record<string, THREE.Mesh> = {};
  gltf.scene.traverse((o) => { if ((o as THREE.Mesh).isMesh) meshes[o.name] = o as THREE.Mesh; });
  const ilmMat = new (rich ? THREE.MeshPhysicalNodeMaterial : THREE.MeshStandardNodeMaterial)({ transparent: true, depthWrite: false, side: THREE.FrontSide });
  {
    // ミュラー細胞の終足が作る敷石模様（約 4µm）と、網膜の表面を走る神経線維の細い筋（一方向に伸びた模様）
    const n1 = nz(1), n2 = nz(0.12, vec2(0.37, 0.71));
    const border = smoothstep(0.62, 0.92, n1.r);
    const fibers = texture(noiseTex, vec2(positionWorld.x.mul(0.6 / 28.8), positionWorld.z.mul(9 / 28.8))).g;   // 細い筋
    const cloud = n2.b;
    const sick = float(1).sub(H);
    // 虚血の網膜は乳白色に濁るが、光は通す（砂のような不透明にはしない）
    const haze = sick.mul(mix(float(0.3), float(0.52), cloud));
    ilmMat.colorNode = mix(color(0xe8ddd2), color(0xf6eee6), cloud).mul(mix(float(0.92), float(1.0), fibers));
    ilmMat.roughnessNode = mix(float(0.22), float(0.5), sick);
    ilmMat.metalnessNode = float(0);
    if (rich) { const pm = ilmMat as THREE.MeshPhysicalNodeMaterial; pm.clearcoatNode = mix(float(0.55), float(0.1), sick); pm.clearcoatRoughnessNode = float(0.22); pm.specularIntensityNode = float(0.35); }
    const op = haze.add(fres.mul(mix(float(0.12), float(0.25), sick))).add(border.mul(0.02)).add(fibers.mul(0.03)).add(0.03);
    ilmMat.opacityNode = saturate(op.mul(float(1).sub(u.scan.mul(0.6)))).mul(edgeFade);
    // 濁りは光を散らして、ほのかに明るく光る（生体の映像の乳白色の光）
    ilmMat.emissiveNode = bloodGlow.mul(0.16).add(color(0xf2d9c4).mul(haze.mul(0.16))).mul(u.lightIn.mul(0.8).add(0.35)).add(color(0xffe9c8).mul(beamGlow.mul(0.5))).add(scanCol.mul(u.scan).mul(border.mul(0.25).add(0.03))).add(scanCol.mul(scanRing.mul(0.9)));
    const ilm = meshes.ilm; ilm.material = ilmMat; ilm.renderOrder = 30; scene.add(ilm);
  }

  // ---- 網膜の深部：眼底のように、奥から橙赤色の光が透けて見える（健康なほど強く）。脈絡膜の血管のまだら模様 ----
  {
    const g = new THREE.PlaneGeometry(W * 2.6, D * 2.6, 1, 1); g.rotateX(-Math.PI / 2);
    const m = new THREE.MeshBasicNodeMaterial({ fog: false });
    const mott = nz(0.35).b, mott2 = nz(1.4, vec2(0.2, 0.6)).a;
    const healthy = mix(color(0x9a1c08), color(0xe8541e), mott.mul(0.6).add(mott2.mul(0.4)));
    const ill = mix(color(0x4a3a36), color(0x7c6a62), mott);
    m.colorNode = mix(ill, healthy, smoothstep(0.1, 0.8, H)).mul(u.lightIn.mul(0.75).add(0.3)).add(bloodGlow.mul(0.6));
    const deep = new THREE.Mesh(g, m); deep.position.y = -16; scene.add(deep);
    // 網膜の厚み（約 0.2mm）の中の、光を散らす層。薄い半透明の層を重ねて、奥行きと「中から光る」感じを出す（病むと濁る）
    for (const [yy, k] of [[-6, 0.12], [-11, 0.16]] as [number, number][]) {
      const lg = new THREE.PlaneGeometry(W * 2.2, D * 2.2, 1, 1); lg.rotateX(-Math.PI / 2);
      const lm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, fog: true });
      const ln = nz(0.5 + Math.abs(yy) * 0.05, vec2(yy * 0.01, 0.3)).b;
      lm.colorNode = mix(color(0xf0b090), color(0xffd0b0), ln).mul(u.lightIn.mul(0.6).add(0.4));
      lm.opacityNode = float(k).mul(mix(float(0.15), float(1.0), float(1).sub(H))).mul(ln.mul(0.6).add(0.4));
      const lay = new THREE.Mesh(lg, lm); lay.position.y = yy; lay.renderOrder = 5; scene.add(lay);
    }
  }

  // ---- 毛細血管の壁（内皮細胞）----
  const vesselMat = new (rich ? THREE.MeshPhysicalNodeMaterial : THREE.MeshStandardNodeMaterial)({ transparent: true, depthWrite: true, side: THREE.FrontSide });
  {
    const vc = vertexColor();
    const nucleus = vc.r;
    const sick = float(1).sub(H);
    // 脈動（健康なほど規則正しく）。流れのない血管はわずかに細い
    vesselMat.positionNode = positionLocal.add(normalLocal.mul(pulse.mul(0.07).mul(H).sub(sick.mul(0.22))));
    // 内皮細胞の輪郭（流れの向きに長い菱形の敷石）
    const edgeLine = smoothstep(0.55, 0.9, texture(noiseTex, vec2(uv().x.mul(10 / 9 / 8), uv().y.mul(3.2 / 8))).r);
    vesselMat.colorNode = mix(color(0xd0beb4), color(0xe8b4a4), H).mul(mix(float(1), float(0.9), edgeLine)).mul(mix(float(1), float(0.85), nucleus));
    vesselMat.roughnessNode = float(0.32);
    if (rich) { const pm = vesselMat as THREE.MeshPhysicalNodeMaterial; pm.clearcoatNode = float(0.12); pm.clearcoatRoughnessNode = float(0.3); pm.specularIntensityNode = float(0.4); }
    vesselMat.opacityNode = saturate(float(0.025).add(sick.mul(0.1)).add(nucleus.mul(0.14)).add(fres.mul(0.1)).add(edgeLine.mul(0.025))).mul(edgeFade);
    vesselMat.emissiveNode = color(0xffd8c0).mul(fres.mul(0.08)).add(color(0xffe9c8).mul(beamGlow.mul(0.35))).add(scanCol.mul(u.scan).mul(fres.mul(0.9).add(0.15))).add(scanCol.mul(scanRing.mul(0.7)));
    const v = meshes.vessel; v.material = vesselMat; v.renderOrder = 20; scene.add(v);
  }
  // ---- 周皮細胞（血管の外に巻き付く）----
  {
    const m = makeCellMaterial({ color: 0xd8c2b2, transmit: 0xffc8a8, absorption: 1.2, wet: 0 });
    m.transparent = true;
    m.opacityNode = saturate(float(0.05).add(fres.mul(0.1))).mul(edgeFade);
    const base = m.emissiveNode as N;
    m.emissiveNode = base.mul(0.6).add(color(0xffe9c8).mul(beamGlow.mul(0.3))).add(scanCol.mul(u.scan).mul(0.25));
    const p = meshes.pericyte; p.material = m; p.renderOrder = 22; scene.add(p);
  }

  // ---- 赤血球の流れ ----
  const edges = data.edges.map((pts) => {
    const P = pts.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    const arc = [0]; for (let i = 1; i < P.length; i++) arc.push(arc[i - 1] + P[i].distanceTo(P[i - 1]));
    return { P, arc, len: arc[arc.length - 1], next: [] as number[] };
  });
  edges.forEach((e, i) => edges.forEach((f, j) => { if (i !== j && e.P[e.P.length - 1].distanceTo(f.P[0]) < 0.5) e.next.push(j); }));
  const allPts: THREE.Vector3[] = edges.flatMap((e) => e.P.filter((_, i) => i % 2 === 0));
  // 初めの病み方：毛細血管が詰まった所（閉塞点）を核に、その先の組織ほど酸素が届かず濁る。
  // 区域を横に3つに分け、それぞれの中ほどにある血管の点を閉塞点にする
  const cores = [-0.3, 0.02, 0.3].map((fx) => {
    const tx = fx * W, tz = (fx > 0 ? -0.12 : 0.1) * D;
    return allPts.reduce((b, p) => (Math.hypot(p.x - tx, p.z - tz) < Math.hypot(b.x - tx, b.z - tz) ? p : b), allPts[0]).clone();
  });
  health.setFn((x, z) => { let k = 0; for (const c of cores) k = Math.max(k, Math.exp(-((x - c.x) ** 2 + (z - c.z) ** 2) / (26 * 26))); return 0.24 - 0.23 * k + 0.03 * Math.sin(x * 0.11) * Math.cos(z * 0.13); });
  const startMean = health.mean();
  /** 回復の進み具合（始めの状態＝0、目標＝1） */
  // 閉塞点がすべてほぐれるまでは、9割で止まる
  const progress = () => Math.min(plugsLeft() ? 0.9 : 1, Math.max(0, (health.mean() - startMean) / (hc.doneAt - startMean)));
  let plugsLeft = () => 0;
  const src = (() => { const out: THREE.Mesh[] = []; rbcGltf.scene.traverse((o) => { if ((o as THREE.Mesh).isMesh) out.push(o as THREE.Mesh); }); return out.sort((a, b) => a.name.localeCompare(b.name)); })();
  const rbcGeo = src[vr ? 1 : tier === 'compat' ? 1 : 0].geometry.clone();
  { // 形を CPU 側で変形しておく：細い毛細血管の中の「パラシュート形」。進む向き（+y）は丸い弾頭、後ろは浅いくぼみ。
    // 直径 7.8µm の円盤が内径 5µm ほどの管に入るため、幅は約 4.7µm に縮み、そのぶん流れの向きに伸びる（体積はほぼ保つ）
    const pa = rbcGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
      const r2 = Math.min(1, (x * x + z * z) / (3.91 * 3.91)), k = 1 - r2;
      const dome = 1.7 * Math.pow(k, 0.85);                // 前の面
      const th = 2.0 * Math.pow(k, 0.6);                   // 厚み（中心が厚く、縁で0）
      const ny = (y >= 0 ? dome : dome - th) - r2 * 1.25;   // 縁は後ろへなびく
      pa.setXYZ(i, x * 0.6, ny + 0.6, z * 0.6);
    }
    rbcGeo.computeVertexNormals(); rbcGeo.computeBoundingSphere();
  }
  const rbcSrcMat = src[0].material as THREE.MeshPhysicalMaterial;
  const rbcMat = makeCellMaterial({ color: 0x7a0812, transmit: 0xe01420, orm: rbcSrcMat.aoMap, absorption: 1.6, wet: 0 });
  {
    // 細い毛細血管の中では、赤血球はパラシュート形に変形して一列で通る（内径 5.2µm < 直径 7.8µm）
    // 流れていない赤血球は酸素を手放して暗い赤になる
    const baseC = rbcMat.colorNode as N;
    rbcMat.colorNode = mix(baseC.mul(vec3(0.5, 0.42, 0.6)), baseC, H);
    rbcMat.roughnessNode = float(0.62); rbcMat.specularIntensityNode = float(0.22);   // 生体の映像の赤血球は、つやより「濃い赤の影」に見える
    const em = rbcMat.emissiveNode as N;
    // 赤血球は光を吸う濃い赤。周りの光を少し透かして、内側から深紅に見える（灰色の映り込みは抑える）
    rbcMat.envMapIntensity = 0.15;
    rbcMat.emissiveNode = em.mul(mix(float(0.35), float(1.0), H)).add(color(0x6a0410).mul(mix(float(0.15), float(0.55), H)).mul(u.lightIn.mul(0.6).add(0.4))).mul(edgeFade);
  }
  const totalLen = edges.reduce((a, e) => a + e.len, 0);
  const count = Math.floor(totalLen / tuning.flow.spacing);
  const rbc = new THREE.InstancedMesh(rbcGeo, rbcMat, count);
  rbc.frustumCulled = false; rbc.renderOrder = 10; scene.add(rbc);
  const cells: { e: number; s: number; roll: number; wob: number; pref: number; vel: number }[] = [];
  { // 病んだ状態では、止まった赤血球が不ぞろいに詰まっている
    let seed = 5; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    let k = 0;
    for (let ei = 0; ei < edges.length && k < count; ei++) {
      const n = Math.round((edges[ei].len / totalLen) * count);
      for (let i = 0; i < n && k < count; i++, k++) cells.push({ e: ei, s: ((i + 0.2 + rnd() * 0.6) / n) * edges[ei].len, roll: rnd() * 6.28, wob: rnd() * 6.28, pref: rnd(), vel: 0 });
    }
    while (cells.length < count) cells.push({ e: 0, s: rnd() * edges[0].len, roll: 0, wob: 0, pref: 0.5, vel: 0 });
  }
  const tmpP = new THREE.Vector3(), tmpT = new THREE.Vector3(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion(), m4 = new THREE.Matrix4(), one = new THREE.Vector3(1, 1, 1), sc = new THREE.Vector3(1, 1, 1), up = new THREE.Vector3(0, 1, 0);
  function pathAt(ei: number, s: number, outP: THREE.Vector3, outT: THREE.Vector3) {
    const e = edges[ei]; const f = Math.min(e.P.length - 1.001, Math.max(0, (s / e.len) * (e.P.length - 1)));
    const i = Math.floor(f), t = f - i;
    outP.lerpVectors(e.P[i], e.P[i + 1], t); outT.subVectors(e.P[i + 1], e.P[i]).normalize();
  }
  // ---- 閉塞点：止まった赤血球が血管の中で塊になり、その先へ血が届かない（区域の病巣）----
  //   浄化の光を塊に当て続けると、ほぐれて流れが戻る。ほぐれるまで、そのまわりの組織は治りきらない
  const plugMat = makeCellMaterial({ color: 0x4a0a10, transmit: 0x901018, orm: rbcSrcMat.aoMap, absorption: 2.4, wet: 0 });
  plugMat.roughnessNode = float(0.7); plugMat.envMapIntensity = 0.1;
  const PER = 9;
  const plugs = cores.map((c) => {
    // いちばん近い血管の向きに沿って、赤血球を不ぞろいに重ねる
    let best = { e: 0, s: 0, d: 1e9 };
    edges.forEach((e, ei) => e.P.forEach((p, i) => { const d = p.distanceTo(c); if (d < best.d) best = { e: ei, s: e.arc[i], d }; }));
    const mesh = new THREE.InstancedMesh(rbcGeo, plugMat, PER); mesh.frustumCulled = false; mesh.renderOrder = 11; scene.add(mesh);
    const base: THREE.Matrix4[] = [];
    let sd = best.e * 31 + 7; const r = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
    for (let i = 0; i < PER; i++) {
      pathAt(best.e, Math.max(0, Math.min(edges[best.e].len, best.s + (i - PER / 2) * 2.1)), tmpP, tmpT);
      q.setFromUnitVectors(up, tmpT); q2.setFromEuler(new THREE.Euler((r() - 0.5) * 1.2, r() * 6.28, (r() - 0.5) * 1.2)); q.multiply(q2);
      tmpP.x += (r() - 0.5) * 0.9; tmpP.y += (r() - 0.5) * 0.7; tmpP.z += (r() - 0.5) * 0.9;
      base.push(new THREE.Matrix4().compose(tmpP.clone(), q.clone(), new THREE.Vector3(1, 0.85, 1).multiplyScalar(0.95 + r() * 0.15)));
    }
    return { p: c, hp: 1, cleared: false, mesh, base, e: best.e, shake: 0, gone: 0 };
  });
  const capAround = (x: number, z: number) => { let cap = 1; for (const pl of plugs) if (!pl.cleared) { const d = Math.hypot(x - pl.p.x, z - pl.p.z); if (d < 22) cap = Math.min(cap, 0.3 + 0.7 * Math.max(0, (d - 12) / 10)); } return cap; };
  const sc2 = new THREE.Vector3(), mtmp = new THREE.Matrix4();
  function updatePlugs(dt: number, t: number) {
    for (const pl of plugs) {
      if (pl.cleared) pl.gone = Math.min(1, pl.gone + dt * 0.8);
      pl.shake = Math.max(0, pl.shake - dt * 3);
      for (let i = 0; i < PER; i++) {
        mtmp.copy(pl.base[i]); mtmp.decompose(tmpP, q, sc2);
        // 当てている間は小刻みに震え、ほぐれると流れの向きへ散って消える
        const j = pl.shake * 0.12; tmpP.x += Math.sin(t * 40 + i) * j; tmpP.y += Math.cos(t * 37 + i * 2) * j;
        if (pl.gone > 0) { tmpP.addScaledVector(tmpT.set(Math.sin(i * 1.7), 0.15, Math.cos(i * 1.7)), pl.gone * 4); sc2.multiplyScalar(1 - pl.gone); }
        pl.mesh.setMatrixAt(i, mtmp.compose(tmpP, q, sc2));
      }
      pl.mesh.instanceMatrix.needsUpdate = true; pl.mesh.visible = pl.gone < 1;
    }
  }
  let onPlug: (i: number, kind: 'hit' | 'cleared') => void = () => {};
  plugsLeft = () => plugs.filter((p) => !p.cleared).length;
  let flowSum = 0;
  // 区間ごとの速さのゆらぎ（数秒で変わる）。速い所で間が空き、遅い所で詰まって列になる
  const edgePhase = edges.map((_, i) => i * 2.399);
  const byEdge: number[][] = edges.map(() => []);
  const minGap = 4.4;   // 前の赤血球との最小の間（µm）。これより近づくと追いつけない
  function updateFlow(dt: number, t: number) {
    flowSum = 0;
    for (const l of byEdge) l.length = 0;
    for (let i = 0; i < count; i++) byEdge[cells[i].e].push(i);
    for (const l of byEdge) l.sort((a, b) => cells[b].s - cells[a].s);   // 先頭から順に
    for (let ei = 0; ei < edges.length; ei++) {
      const list = byEdge[ei], e = edges[ei];
      const wave = 0.55 + 0.45 * Math.sin(t * 0.35 + edgePhase[ei]) + 0.25 * Math.sin(t * 0.9 + edgePhase[ei] * 1.7);
      let ahead = Infinity;   // 前の赤血球の位置
      for (const i of list) {
        const c = cells[i];
        pathAt(c.e, c.s, tmpP, tmpT);
        const h = health.sample(tmpP.x, tmpP.z);
        const f = flowFactor(h, hc.flowStart, hc.flowFull);
        flowSum += f;
        // 心拍に合わせた速さの変化＋区間のゆらぎ＋1個ずつの癖
        const beat = 0.75 + 0.5 * Math.pow(0.5 + 0.5 * Math.sin(u.heartPhase.value - tmpP.x * 0.05), 3);
        let v = tuning.flow.speed * f * beat * Math.max(0.15, wave) * (0.85 + 0.3 * c.pref);
        let ns = c.s + v * dt;
        if (ns > ahead - minGap) { ns = Math.max(c.s, ahead - minGap); v = (ns - c.s) / Math.max(dt, 1e-4); }
        c.vel += (v - c.vel) * Math.min(1, dt * 6);
        c.s = ns; ahead = c.s;
        if (c.s >= e.len) {
          const nx = e.next;
          c.e = nx.length ? nx[(i + Math.floor(t)) % nx.length] : 0; c.s = 0; ahead = Infinity;
          pathAt(c.e, c.s, tmpP, tmpT);
        }
        q.setFromUnitVectors(up, tmpT);
        q2.setFromAxisAngle(up, c.roll + t * 0.25 * f);
        q.multiply(q2);
        tmpP.y += Math.sin(t * 1.3 + c.wob) * 0.06 * f;
        // 速いほど流れの向きに伸び、詰まると縮んで丸くなる（赤血球はやわらかい）
        const sp = Math.min(1, c.vel / Math.max(1e-3, tuning.flow.speed));
        sc.set(1 - 0.06 * sp, 0.92 + 0.16 * sp, 1 - 0.06 * sp);
        rbc.setMatrixAt(i, m4.compose(tmpP, q, sc));
      }
    }
    rbc.instanceMatrix.needsUpdate = true;
  }

  // ---- 光 ----
  // 瞳から入る光：はるか上（硝子体の向こう）から網膜に届く。光の通り道が戻るほど強くなる
  const sun = new THREE.DirectionalLight(0xfff0dc, 1.0);
  // 眼底で反射して下から戻る橙赤色の光は、半球光の地面側の色で表す（光の数を減らす）
  sun.position.set(-30, 90, 22); scene.add(sun);
  const hemi = new THREE.HemisphereLight(0xffe2cc, 0x8a3a1c, 0.8); scene.add(hemi);
  // 瞳の光の見た目（遠くのやわらかな光の円盤と、もやの中の光の筋）
  {
    const g = new THREE.PlaneGeometry(1, 1);
    const m = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
    const d = length(uv().sub(0.5)).mul(2);
    m.colorNode = color(0xfff3e0).mul(exp(d.mul(d).mul(-7)).mul(1.6).add(exp(d.mul(-3.2)).mul(0.25))).mul(u.lightIn.mul(0.8).add(0.12));
    const disc = new THREE.Mesh(g, m); disc.scale.setScalar(150); disc.position.copy(sun.position).multiplyScalar(2.6); disc.lookAt(0, 0, 0); disc.renderOrder = 1; scene.add(disc);
    if (rich) {
      // 光の筋（円錐の内側をごく淡く加算）
      const cg = new THREE.CylinderGeometry(14, 60, 240, 40, 1, true); cg.translate(0, -120, 0);
      const cm = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });
      const streak = texture(noiseTex, vec2(uv().x.mul(3), u.time.mul(0.002))).g;
      cm.colorNode = color(0xffe2c0).mul(streak.mul(0.022)).mul(u.lightIn).mul(smoothstep(0.0, 0.25, uv().y)).mul(smoothstep(1.0, 0.6, uv().y)).mul(pow(saturate(dot(normalView, positionViewDirection).abs()), 1.5));
      const cone = new THREE.Mesh(cg, cm); cone.position.copy(sun.position).multiplyScalar(2.2);
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), sun.position.clone().multiplyScalar(-1).normalize()); cone.renderOrder = 2; scene.add(cone);
    }
  }
  // ---- 硝子体：コラーゲンの細い線維（太さ 10〜20nm。この縮尺では糸のように見える）と、ただよう微粒子 ----
  {
    let seed = 9; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const nF = 0, pos: number[] = [];
    for (let i = 0; i < nF; i++) {
      const c = new THREE.Vector3((rnd() - 0.5) * W * 1.3, 5 + rnd() * rnd() * 46, (rnd() - 0.5) * D * 1.3);
      const d = new THREE.Vector3(rnd() - 0.5, (rnd() - 0.5) * 0.35, rnd() - 0.5).normalize();
      const len = 14 + rnd() * 40, segs = 6; let p = c.clone().addScaledVector(d, -len / 2);
      for (let s = 0; s < segs; s++) { const p2 = p.clone().addScaledVector(d, len / segs); p2.y += (rnd() - 0.5) * 1.6; p2.x += (rnd() - 0.5) * 1.2; pos.push(p.x, p.y, p.z, p2.x, p2.y, p2.z); p = p2; }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const m = new THREE.LineBasicNodeMaterial({ transparent: true, depthWrite: false });
    m.colorNode = color(0xcfd8e0); m.opacityNode = float(0.04).mul(u.lightIn.mul(0.8).add(0.5));
    const lines = new THREE.LineSegments(g, m); lines.renderOrder = 40; scene.add(lines);
    const nP = vr ? 120 : rich ? 260 : 160, pp = new Float32Array(nP * 3);
    for (let i = 0; i < nP; i++) { pp[i * 3] = (rnd() - 0.5) * W * 1.2; pp[i * 3 + 1] = 1.5 + rnd() * 34; pp[i * 3 + 2] = (rnd() - 0.5) * D * 1.2; }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    const pm = new THREE.PointsNodeMaterial({ transparent: true, depthWrite: false, sizeAttenuation: true });
    pm.colorNode = color(0xfff0e0); pm.opacityNode = float(0.16).mul(u.lightIn.mul(0.7).add(0.35)); pm.sizeNode = float(vr ? 0.015 : 0.07);
    const pts = new THREE.Points(pg, pm); pts.renderOrder = 41; scene.add(pts);
    (scene.userData as { motes: THREE.Points }).motes = pts;
  }

  function floorHeight(x: number, z: number): number {
    let d2 = 1e9;
    for (let i = 0; i < allPts.length; i++) { const p = allPts[i]; const dx = p.x - x, dz = p.z - z; const d = dx * dx + dz * dz; if (d < d2) d2 = d; }
    const base = 0.35 * Math.sin(x * 0.09 + 1.3) * Math.cos(z * 0.11) + 0.2 * Math.sin(x * 0.23 + z * 0.17);
    return base + data.floor.bulge * Math.exp(-d2 / (data.floor.sigma * data.floor.sigma));
  }
  const v3 = (p: number[]) => new THREE.Vector3(p[0], p[1], p[2]);
  const nearest = (list: { p: number[] }[], x: number, z: number) => list.map((n) => v3(n.p)).sort((a, b) => a.distanceToSquared(new THREE.Vector3(x, a.y, z)) - b.distanceToSquared(new THREE.Vector3(x, b.y, z)))[0];
  const rbcPoint = new THREE.Vector3();
  let heart = 0;
  const vDist = (x: number, z: number) => { let d2 = 1e9; for (let i = 0; i < allPts.length; i++) { const p = allPts[i]; const dx = p.x - x, dz = p.z - z; const d = dx * dx + dz * dz; if (d < d2) d2 = d; } return Math.sqrt(d2); };
  const pts = { rbc: () => { rbc.getMatrixAt(Math.floor(count * 0.18), m4); return rbcPoint.setFromMatrixPosition(m4); }, nucleus: nearest(data.nuclei, -40, -6), pericyte: nearest(data.pericytes, -30, -10) };
  return {
    meta: RETINA_META, scene, health, size: [W, D], u, floorHeight, sun, cores, progress,
    // 入口：硝子体の高い所から、瞳の光の柱をたどって泳いで降りる
    // 向き：区域の中ほど（＋x）を向いて始める（以前は外の縁を向いていて、前へ進むとすぐ端で止まった）
    start: { pos: new THREE.Vector3(-58, opts.entrance ? floorHeight(-58, 6) + 34 : 0, 6), yaw: Math.atan2(58, -6), swimming: !!opts.entrance },
    causeAt(x, z) { const near = vDist(x, z) < 9; return near ? { short: '毛細血管の閉塞', cause: '赤血球が止まって詰まり、この先へ血が届いていません' } : { short: '虚血（血が届かない）', cause: '近くの血管が止まり、酸素が届かず濁っています' }; },
    encounters(pos, t, walked) {
      const out: { id: string; at: THREE.Vector3 | null }[] = [];
      const near = (p: THREE.Vector3, r: number) => Math.hypot(p.x - pos.x, p.z - pos.z) < r && health.sample(p.x, p.z) > 0.55;
      if (t > 2.5) out.push({ id: 'vitreous', at: null });
      if (walked > 9 && pos.y - floorHeight(pos.x, pos.z) < 1) out.push({ id: 'muller', at: null });
      if (near(pts.nucleus, 20)) out.push({ id: 'endothelial', at: pts.nucleus });
      if (near(pts.pericyte, 20)) out.push({ id: 'pericyte', at: pts.pericyte });
      if (flowSum / count > 0.12) out.push({ id: 'rbc', at: pts.rbc().clone() });
      return out;
    },
    /** いちばん近い毛細血管の中心線までの水平距離（µm） */
    vesselDist: vDist,
    track(id) { return id === 'rbc' ? pts.rbc() : null; },
    points: pts,
    flowing: () => flowSum / count,
    heal(x, z, dt) {
      // 閉塞点に光が当たっていれば、塊をほぐす
      plugs.forEach((pl, i) => {
        if (pl.cleared || Math.hypot(x - pl.p.x, z - pl.p.z) > 7) return;
        if (pl.hp === 1) onPlug(i, 'hit');
        pl.hp = Math.max(0, pl.hp - dt / 3.2); pl.shake = 1;
        if (pl.hp <= 0) { pl.cleared = true; onPlug(i, 'cleared'); health.heal(pl.p.x, pl.p.z, 20, 0.35); }
      });
      const got = health.heal(x, z, tuning.beam.radius, tuning.beam.rate * dt);
      // ほぐれていない閉塞点のまわりは、治りきらない（血が届かないため）
      health.clampFn(capAround);
      return got;
    },
    plugs, setOnPlug(f) { onPlug = f; },
    update(dt, t, camera) {
      const mean = health.mean();
      const bpm = tuning.heart.bpmSick + (tuning.heart.bpmHealthy - tuning.heart.bpmSick) * mean;
      heart += dt * (bpm / 60) * Math.PI * 2 / 2.2;   // 知覚加速ぶん、見かけの拍動はゆっくりにしてある
      u.heartPhase.value = heart; u.time.value = t;
      u.lightIn.value += ((0.35 + 0.65 * progress()) - u.lightIn.value) * Math.min(1, dt * 1.5);
      sun.intensity = 0.7 + 2.4 * u.lightIn.value;
      // 病むと光は青白く沈み、血流が戻ると下から橙赤色の光が透けて満ちる
      hemi.groundColor.setRGB(0.32 + 0.4 * mean, 0.2 + 0.06 * mean, 0.16 - 0.06 * mean);
      hemi.intensity = 1.0 + 0.9 * u.lightIn.value;
      // 遠くは光に溶ける：病の間は乳白色の灰、血流が戻ると明るい桃色の光
      scene.fog!.color.setRGB(0.5 + 0.3 * mean, 0.42 - 0.06 * mean, 0.38 - 0.14 * mean).multiplyScalar(0.55 + 0.4 * u.lightIn.value);
      (scene.background as THREE.Color).copy(scene.fog!.color).multiplyScalar(0.8);
      scene.environmentIntensity = 0.16 + 0.22 * u.lightIn.value;
      health.spread(dt, hc.regrow); health.clampFn(capAround); updatePlugs(dt, t);
      updateFlow(dt, t);
      if (health.version !== hVersion) { health.toBytes(hBytes); hTex.needsUpdate = true; hVersion = health.version; }
      keyLightDirView.value.copy(sun.position).normalize().transformDirection(camera.matrixWorldInverse);
    },
  };
}

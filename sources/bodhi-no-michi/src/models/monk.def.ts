// 主人公・蓮（れん）。二十歳前後の修行僧。剃髪、墨染めの衣（黒は使わず濃い藍で）、白い襟、脚絆と草鞋、錫杖。
import { Sdf, type V3, type RGB } from '../engine/sdf';
import { B, joints } from './skeleton';

export const MONK_PROP = { H: 1.7, shoulderW: 0.185, hipW: 0.085, armLen: 0.6 };
export const MONK_J = joints(MONK_PROP);
const SKIN: RGB = [0.93, 0.8, 0.68];
const SKIN_D: RGB = [0.82, 0.62, 0.52];
const ROBE: RGB = [0.44, 0.48, 0.62];      // 墨染め＝濃い藍
const ROBE_L: RGB = [0.55, 0.6, 0.72];
const WHITE: RGB = [0.97, 0.96, 0.92];
const KESA: RGB = [0.72, 0.6, 0.42];      // 絡子（らくす）：黄土
const STRAW: RGB = [0.82, 0.74, 0.52];
const HAIRSH: RGB = [0.7, 0.72, 0.74];    // 剃りあとの青み

export function monkBody(): Sdf {
  const s = new Sdf(); s.skinK = 0.03;
  s.set({ col: ROBE, k: 0.04, loose: 0 });
  // 胴（衣の上から）
  s.ell([0, 0.92, 0], [0.155, 0.11, 0.115], { bone: B.hips });
  s.ell([0, 1.06, 0.005], [0.15, 0.13, 0.11], { bone: B.spine });
  s.ell([0, 1.24, 0], [0.175, 0.15, 0.115], { bone: B.chest });
  s.ell([0, 1.36, -0.01], [0.17, 0.07, 0.1], { bone: B.chest });
  // 首（肌）と白い襟
  s.cone([0, 1.38, -0.005], [0, 1.5, 0.01], 0.05, 0.046, { bone: B.neck, col: SKIN, k: 0.02 });
  s.torus([0, 1.405, 0.0], 0.062, 0.02, { bone: B.chest, col: WHITE, k: 0.008, rot: [-18, 0, 0] });
  // 襟の合わせ（V字）と絡子
  s.cone([0.06, 1.4, 0.06], [-0.05, 1.12, 0.115], 0.02, 0.02, { bone: B.chest, col: ROBE_L, k: 0.012 });
  s.cone([-0.06, 1.4, 0.06], [0.0, 1.22, 0.118], 0.02, 0.02, { bone: B.chest, col: ROBE_L, k: 0.012 });
  s.box([0, 1.2, 0.118], [0.055, 0.06, 0.008], 0.008, { bone: B.chest, col: KESA, k: 0.008 });
  s.mirror(sg => { s.cone([sg * 0.05, 1.26, 0.118], [sg * 0.075, 1.4, 0.04], 0.008, 0.008, { bone: B.chest, col: KESA, k: 0.005 }); });
  // 帯
  s.torus([0, 0.99, 0], 0.142, 0.022, { bone: B.spine, col: [0.3, 0.33, 0.47], k: 0.006 });
  s.mirror(sg => {
    const L = sg > 0;
    const arm = L ? B.armL : B.armR, fore = L ? B.foreL : B.foreR, hand = L ? B.handL : B.handR;
    const thigh = L ? B.thighL : B.thighR, shin = L ? B.shinL : B.shinR, foot = L ? B.footL : B.footR;
    // 肩〜腕（袖の中）
    s.ell([sg * 0.19, 1.385, 0], [0.07, 0.06, 0.07], { bone: arm, k: 0.035 });
    s.cone([sg * 0.19, 1.385, 0], [sg * 0.47, 1.385, 0], 0.058, 0.06, { bone: arm, k: 0.03, loose: 0.1 });
    s.cone([sg * 0.47, 1.385, 0], [sg * 0.62, 1.385, 0], 0.06, 0.066, { bone: fore, k: 0.03, loose: 0.3 });
    // 広い袖：前腕の下に垂れる
    s.box([sg * 0.5, 1.26, 0], [0.095, 0.1, 0.012], 0.022, { bone: fore, k: 0.04, loose: 0.7 });
    s.box([sg * 0.52, 1.14, 0], [0.075, 0.06, 0.01], 0.02, { bone: fore, k: 0.03, loose: 1 });
    s.ell([sg * 0.64, 1.385, 0], [0.03, 0.05, 0.05], { bone: fore, sub: true, k: 0.01, col: [0.25, 0.28, 0.42] }); // 袖口
    // 手
    s.cone([sg * 0.6, 1.385, 0], [sg * 0.7, 1.385, 0], 0.03, 0.027, { bone: fore, col: SKIN, k: 0.01 });
    s.ell([sg * 0.745, 1.385, 0], [0.045, 0.02, 0.04], { bone: hand, col: SKIN, k: 0.012 });
    for (let f = 0; f < 4; f++) {
      const z = 0.03 - f * 0.02;
      s.cone([sg * 0.775, 1.387, z], [sg * 0.815, 1.365, z], 0.0105, 0.0095, { bone: hand, col: SKIN, k: 0.006 });
      s.cone([sg * 0.815, 1.365, z], [sg * 0.795, 1.34, z], 0.0095, 0.0085, { bone: hand, col: SKIN, k: 0.006 });
    }
    s.cone([sg * 0.735, 1.38, 0.035], [sg * 0.78, 1.36, 0.05], 0.013, 0.011, { bone: hand, col: SKIN, k: 0.008 });
    // 衣の下半分：腰から脛へ。裾は揺れる
    s.cone([sg * 0.075, 0.9, 0], [sg * 0.1, 0.6, 0.005], 0.125, 0.14, { bone: thigh, k: 0.06, loose: 0.3 });
    s.cone([sg * 0.1, 0.6, 0.005], [sg * 0.12, 0.34, 0.0], 0.14, 0.15, { bone: thigh, k: 0.06, loose: 0.75 });
    for (let i = 0; i < 3; i++) {
      const a = (i - 1) * 0.7 + sg * 0.35;
      s.cone([sg * 0.08 + Math.sin(a) * 0.13, 0.9, Math.cos(a) * 0.13], [sg * 0.1 + Math.sin(a) * 0.2, 0.32, Math.cos(a) * 0.18], 0.008, 0.022, { bone: thigh, sub: true, k: 0.03, col: [0.28, 0.31, 0.46] });
    }
  });
  s.ell([0, 0.52, 0.01], [0.11, 0.22, 0.1], { bone: B.hips, loose: 0.7, k: 0.07 });
  // 裾を水平に切る（袋状にしない）
  s.box([0, 0.13, 0], [0.6, 0.15, 0.6], 0.0, { sub: true, k: 0.012, col: [0.28, 0.31, 0.46] });
  s.mirror(sg => {
    const L = sg > 0; const shin = L ? B.shinL : B.shinR, foot = L ? B.footL : B.footR;
    s.set({ col: WHITE, k: 0.02, loose: 0 });
    s.cone([sg * 0.085, 0.48, 0], [sg * 0.085, 0.1, 0], 0.05, 0.036, { bone: shin, col: WHITE, k: 0.02 });
    s.ell([sg * 0.087, 0.36, -0.02], [0.045, 0.09, 0.045], { bone: shin, col: WHITE, k: 0.02 });
    s.ell([sg * 0.09, 0.045, 0.045], [0.043, 0.036, 0.1], { bone: foot, col: WHITE, k: 0.02 });
    s.ball([sg * 0.087, 0.06, -0.03], 0.04, { bone: foot, col: WHITE, k: 0.02 });
    s.box([sg * 0.09, 0.012, 0.04], [0.042, 0.006, 0.115], 0.008, { bone: foot, col: STRAW, k: 0.006 });
  });
  return s;
}

export function monkHead(): Sdf {
  const s = new Sdf(); s.skinK = 0.03;
  const y0 = 1.585;
  const P = (x: number, y: number, z: number): V3 => [x, y0 + y, z + 0.01];
  s.set({ col: SKIN, k: 0.025, bone: B.head });
  s.cone([0, 1.4, -0.005], [0, 1.5, 0.01], 0.05, 0.046, { bone: B.neck, k: 0.02 });
  s.ell(P(0, 0.03, -0.012), [0.078, 0.092, 0.095]);                 // 頭蓋（剃髪）
  s.ell(P(0, -0.035, 0.02), [0.066, 0.07, 0.072], { k: 0.035 });     // 顔の下半分
  s.ell(P(0, -0.088, 0.048), [0.032, 0.026, 0.03], { k: 0.028 });    // 頤（細め）
  s.ell(P(0, 0.035, 0.05), [0.064, 0.04, 0.045], { k: 0.03 });       // 額
  s.mirror(sg => {
    s.ell(P(sg * 0.046, -0.022, 0.058), [0.026, 0.026, 0.024], { k: 0.028 });   // 頬
    s.cone(P(sg * 0.014, 0.012, 0.086), P(sg * 0.056, 0.02, 0.07), 0.011, 0.009, { k: 0.018 }); // 眉骨
    s.cone(P(sg * 0.016, 0.02, 0.097), P(sg * 0.058, 0.03, 0.078), 0.0045, 0.003, { colOnly: true, k: 0.003, col: [0.35, 0.33, 0.4] }); // 眉
    s.ell(P(sg * 0.033, -0.003, 0.09), [0.019, 0.009, 0.011], { sub: true, k: 0.01, col: [0.9, 0.74, 0.63] });
    s.ball(P(sg * 0.033, -0.004, 0.071), 0.0165, { k: 0.003, col: WHITE });
    s.ball(P(sg * 0.033, -0.005, 0.087), 0.0068, { colOnly: true, k: 0.002, col: [0.25, 0.22, 0.3] });
    // まぶた（やや伏せた静かな目）
    s.cone(P(sg * 0.014, 0.001, 0.084), P(sg * 0.034, 0.008, 0.088), 0.0055, 0.006, { k: 0.006 });
    s.cone(P(sg * 0.034, 0.008, 0.088), P(sg * 0.053, 0.002, 0.078), 0.006, 0.0045, { k: 0.006 });
    s.cone(P(sg * 0.016, 0.004, 0.09), P(sg * 0.052, 0.005, 0.08), 0.0022, 0.0022, { colOnly: true, k: 0.002, col: [0.4, 0.3, 0.33] });
    s.ell(P(sg * 0.014, -0.036, 0.094), [0.01, 0.009, 0.011], { k: 0.01 });     // 小鼻
    s.ell(P(sg * 0.079, -0.008, 0.0), [0.01, 0.028, 0.018], { k: 0.01 });       // 耳
    s.ell(P(sg * 0.086, -0.005, 0.003), [0.005, 0.016, 0.009], { sub: true, k: 0.006, col: SKIN_D });
    // 口（わずかに結ぶ）
    s.cone(P(0, -0.058, 0.089), P(sg * 0.02, -0.059, 0.08), 0.0045, 0.003, { k: 0.008, col: [0.9, 0.68, 0.62] });
    s.cone(P(0, -0.067, 0.087), P(sg * 0.016, -0.065, 0.08), 0.005, 0.003, { k: 0.008, col: [0.9, 0.68, 0.62] });
    s.cone(P(0, -0.0625, 0.094), P(sg * 0.022, -0.0605, 0.082), 0.0014, 0.0014, { colOnly: true, k: 0.0012, col: [0.66, 0.42, 0.42] });
  });
  s.cone(P(0, 0.005, 0.088), P(0, -0.03, 0.106), 0.009, 0.011, { k: 0.014 });   // 鼻筋
  s.ball(P(0, -0.032, 0.105), 0.0115, { k: 0.01 });
  // 剃りあとの青み
  s.ell(P(0, 0.055, -0.03), [0.085, 0.08, 0.098], { colOnly: true, k: 0.03, col: HAIRSH });
  return s;
}

/** 錫杖（しゃくじょう）：木の柄、頭に輪と遊環 */
export function shakujo(): Sdf {
  const s = new Sdf();
  s.set({ col: [0.6, 0.45, 0.33], k: 0.008, bone: 0 });
  s.cone([0, -1.0, 0], [0, 0.5, 0], 0.016, 0.015);
  s.set({ col: [0.84, 0.7, 0.4] });
  s.cone([0, 0.5, 0], [0, 0.56, 0], 0.018, 0.016);
  s.torus([0, 0.63, 0], 0.062, 0.011, { rot: [90, 0, 0], k: 0.006 });
  s.ball([0, 0.705, 0], 0.014); s.ball([0, 0.63, 0], 0.012);
  for (const sg of [1, -1]) for (let i = 0; i < 2; i++) s.torus([sg * 0.062, 0.6 - i * 0.045, 0], 0.022, 0.0075, { rot: [90, 0, 0], k: 0.003, loose: 1 });
  s.cone([0, -1.0, 0], [0, -1.04, 0], 0.012, 0.004);
  return s;
}

export const MONK_JOBS = [
  { name: 'monk-body', sdf: monkBody, min: [-0.9, -0.01, -0.3] as V3, max: [0.9, 1.5, 0.3] as V3, cell: 0.0135 },
  { name: 'monk-head', sdf: monkHead, min: [-0.11, 1.38, -0.12] as V3, max: [0.11, 1.72, 0.14] as V3, cell: 0.0044 },
  { name: 'shakujo', sdf: shakujo, min: [-0.1, -1.06, -0.04] as V3, max: [0.1, 0.74, 0.04] as V3, cell: 0.0062 },
];

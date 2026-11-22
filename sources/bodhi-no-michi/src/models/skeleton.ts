// 人型の骨組み（僧と尊格で共通）。すべての骨は安静時に軸がワールドと平行（回転なし）。+z が正面、+x が本人の左。
import type { V3 } from '../engine/sdf';

export const BONES = ['hips', 'spine', 'chest', 'neck', 'head', 'clavL', 'armL', 'foreL', 'handL', 'clavR', 'armR', 'foreR', 'handR',
  'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR', 'extra'] as const;
export type BoneName = typeof BONES[number];
export const B = Object.fromEntries(BONES.map((n, i) => [n, i])) as Record<BoneName, number>;
export const PARENT: Record<BoneName, BoneName | null> = {
  hips: null, spine: 'hips', chest: 'spine', neck: 'chest', head: 'neck',
  clavL: 'chest', armL: 'clavL', foreL: 'armL', handL: 'foreL', clavR: 'chest', armR: 'clavR', foreR: 'armR', handR: 'foreR',
  thighL: 'hips', shinL: 'thighL', footL: 'shinL', thighR: 'hips', shinR: 'thighR', footR: 'shinR', extra: 'chest',
};
export type Joints = Record<BoneName, V3>;

export interface Proportion { H: number; shoulderW: number; hipW: number; armLen: number }
/** T字の基本姿勢での関節位置 */
export function joints(p: Proportion): Joints {
  const { H, shoulderW: sw, hipW: hw, armLen: al } = p;
  const side = (sg: number, n: 'L' | 'R') => ({
    ['clav' + n]: [sg * 0.03 * H, 0.815 * H, 0], ['arm' + n]: [sg * sw, 0.815 * H, 0],
    ['fore' + n]: [sg * (sw + al * 0.47), 0.815 * H, 0], ['hand' + n]: [sg * (sw + al * 0.86), 0.815 * H, 0],
    ['thigh' + n]: [sg * hw, 0.52 * H, 0], ['shin' + n]: [sg * hw, 0.285 * H, 0], ['foot' + n]: [sg * hw, 0.05 * H, 0],
  });
  return {
    hips: [0, 0.53 * H, 0], spine: [0, 0.6 * H, 0], chest: [0, 0.7 * H, 0], neck: [0, 0.845 * H, 0], head: [0, 0.885 * H, 0],
    extra: [0, 0.9 * H, 0], ...side(1, 'L'), ...side(-1, 'R'),
  } as Joints;
}

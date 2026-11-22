// TSL（Three.js のノード式シェーダー）の型定義は厳しすぎて式の合成に向かないため、
// シェーダー記述の中だけ型を緩めて使う。
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as T from 'three/tsl';
export const tsl = T as any;
export type N = any;

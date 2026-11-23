// 細かい土の模様（0.03〜0.1 mm の粒）を、面の上に描く。地面と、芽が押し上げる土の山で共通に使う。
// 一粒ずつの砂粒（sand.ts）より細かい粒は、ここで描く。粒ごとに色が少しずつ違い、粒のすき間は暗い。
import { float, mix, mx_noise_float, mx_worley_noise_float, saturate, smoothstep, vec2, vec3 } from 'three/tsl';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type N = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type V2 = any;

export function soilMicro(xz: V2, wet: N) {
  const wA = mx_worley_noise_float(xz.mul(26.0)), wB = mx_worley_noise_float(xz.mul(11.0).add(vec2(3.7, 1.9)));
  // 粒ごとの色：粒の大きさの雑音を、段階に区切って「粒ごとに違う色」に見せる
  const idA = saturate(mx_noise_float(xz.mul(26.0)).mul(1.6).add(0.5)), idB = saturate(mx_noise_float(xz.mul(11.0).add(vec2(9.1, 2.3))).mul(1.6).add(0.5));
  const dryA = mix(vec3(0.16, 0.12, 0.085), vec3(0.30, 0.24, 0.18), idA), dryB = mix(vec3(0.12, 0.09, 0.065), vec3(0.26, 0.20, 0.15), idB);
  let col = mix(dryB, dryA, smoothstep(0.45, 0.2, wA));
  col = mix(col, col.mul(vec3(0.42, 0.40, 0.42)), wet.mul(0.7));                            // 湿ると暗い
  const gap = smoothstep(0.35, 0.8, wA).mul(0.6).add(smoothstep(0.45, 0.9, wB).mul(0.5)).min(1.0);
  col = col.mul(mix(float(1.0), float(0.25), gap));                                          // 粒のすき間の影
  const bump = wA.mul(-0.5).add(wB.mul(-0.6));
  return { col, bump, rough: mix(float(0.95), float(0.7), wet) };
}

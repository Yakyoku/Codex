/** 毎回同じ並びになる乱数（区画の配置を固定するため） */
export function makeRng(seed: number) {
  let s = seed >>> 0 || 1;
  const next = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  return { next, range: (a: number, b: number) => a + (b - a) * next(), int: (a: number, b: number) => Math.floor(a + (b - a + 1) * next()), pick: <T>(arr: T[]) => arr[Math.floor(next() * arr.length)] };
}

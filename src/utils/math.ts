export const TAU = Math.PI * 2;

export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const approach = (v: number, target: number, d: number): number =>
  v < target ? Math.min(target, v + d) : Math.max(target, v - d);
export function smooth(e0: number, e1: number, x: number): number {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}
export const ease = {
  outExpo: (t: number): number => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
  outQuad: (t: number): number => 1 - (1 - t) * (1 - t),
  outCubic: (t: number): number => 1 - (1 - t) ** 3,
  outBack: (t: number): number => {
    const c = 1.70158;
    return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
  },
};
/** the upward speed that rises this many pixels before gravity stops it */
export const riseSpeed = (rise: number, gravity: number): number => Math.sqrt(2 * gravity * rise);

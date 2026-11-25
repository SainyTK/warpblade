import type { Enemy } from "../../../types/enemy";

export const HULK_HITS = { slam: 22, wave: 18, glob: 14, rush: 20 } as const;
export const HULK_WINDUP = { slam: 0.65, wave: 0.7, globs: 0.8, rush: 0.9 } as const;
export const HULK_TIMES = { strike: 0.35, recover: 0.75, sink: 1.6, rise: 0.45, stuck: 1.1, afterRise: 0.5 } as const;
export const HULK_WALK = { speed: 18, enraged: 26, stop: 12 } as const;
export const HULK_COOLDOWN = { least: 1, most: 1.8, enraged: 0.7 } as const;
export const HULK_REACH = { slam: 46, slamHeight: 40, near: 40, wave: 140, waveChance: 0.6 } as const;
export const HULK_ENRAGED = { windup: 0.75, secondWave: 0.55 } as const;
export const HULK_GLOBS = { calm: [-26, 0, 26], enraged: [-36, -12, 12, 36] } as const;
export const SINKING = { at: 0.5, taken: 1.5, drop: 6, settle: 0.25, bubbleEvery: 0.12, warn: 0.5 } as const;
export const RISE = {
  pop: 0.1,
  overshoot: 2,
  ring: 56,
  voltRing: 40,
  light: 80,
  flash: 18,
  chunks: 14,
  embers: 8,
} as const;
export const RUSH = {
  shortest: 40,
  wade: 1.2,
  first: 2,
  every: 7,
  length: 150,
  speed: 170,
  most: 0.9,
  slideHalfWidth: 18,
  slideHeight: 16,
  rearBack: 3,
} as const;
export const HULK_GLOW = { calm: 40, enraged: 52 } as const;
export const STUCK_AFTER_RUSH = 1;

export const cracked = (e: Enemy): boolean => e.phase === 2 && e.state !== "burrow";

export const lying = (e: Enemy): boolean => e.state === "lunge" || (e.state === "recover" && e.n === STUCK_AFTER_RUSH);

export const steadyHulk = (e: Enemy): boolean => e.state === "burrow" || e.state === "hop";

export const hulkTakes = (e: Enemy, dmg: number): number => (e.state === "burrow" ? dmg * SINKING.taken : dmg);

export function hulkWindup(e: Enemy): number {
  const fast = e.phase === 2 ? HULK_ENRAGED.windup : 1;
  if (e.state === "wind") return HULK_WINDUP.slam * fast;
  if (e.state === "charge") return HULK_WINDUP.wave * fast;
  if (e.state === "volley") return HULK_WINDUP.globs * fast;
  if (e.state === "dive") return HULK_WINDUP.rush;
  return 0;
}

import type { Element } from "../types/spell";

export const MAX_HP = 100;
export const MAX_MP = 100;
export const COST = { warp: 10, cast: 18 } as const;
export const ELEMENTS: readonly Element[] = ["fire", "ice", "volt"];
/** MP per second, standing and hanging from a crystal */
export const MP_REGEN = { normal: 3, hanging: 14 } as const;
export const MP_PER_HIT = 2;

export const HERO_MOVE = {
  runSpeed: 115,
  groundAccel: 900,
  airAccel: 650,
  gravity: 900,
  maxFall: 420,
  jump: 335,
  doubleJump: 300,
  hangJump: 260,
  dodgeSpeed: 270,
  dodgeTime: 0.24,
  dodgeCooldown: 0.5,
} as const;

export const WARP = { speed: 560, maxFlight: 0.6, reach: 180, anchorReach: 220, fallback: 110 } as const;

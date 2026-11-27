import type { HitWeight, HitWeightFeel } from "../types/hit";

export const HIT_WEIGHTS: Readonly<Record<HitWeight, HitWeightFeel>> = {
  crowd: { flash: 0.5, stop: 0.012, shake: null, spark: 0.7, impact: false, pulse: false, squash: 0.08, recoil: 0.8 },
  spell: { flash: 0.55, stop: 0.02, shake: null, spark: 0.8, impact: false, pulse: false, squash: 0.1, recoil: 0.8 },
  light: {
    flash: 0.62,
    stop: 0.042,
    shake: [0.08, 0.8],
    spark: 1,
    impact: true,
    pulse: false,
    squash: 0.12,
    recoil: 1,
  },
  heavy: {
    flash: 0.68,
    stop: 0.07,
    shake: [0.14, 1.6],
    spark: 1.35,
    impact: true,
    pulse: true,
    squash: 0.18,
    recoil: 1.5,
  },
  crit: {
    flash: 0.72,
    stop: 0.085,
    shake: [0.16, 2.2],
    spark: 1.55,
    impact: true,
    pulse: true,
    squash: 0.22,
    recoil: 1.7,
  },
};

export const HIT_CROWD = { halfLife: 0.12, from: 5, fullAtOnce: 3, sparksAtOnce: 8 } as const;

export const STAGE_PULSE = { radius: 96, strength: 0.2, life: 0.2, whiteRadius: 26, whiteStrength: 0.35 } as const;

export const HIT_SPARK = {
  life: 0.12,
  open: 0.025,
  length: 11,
  width: 2.4,
  back: 0.2,
  cross: 0.5,
  tilt: 0.35,
} as const;

export const REDUCED_SQUASH = 0.5;

export const SQUASH_BY_RANK = { minion: 1, mini: 0.65, boss: 0.4 } as const;

export const BIG_KILL = {
  stop: 0.09,
  bossStop: 0.14,
  life: 0.32,
  core: 5,
  coreUntil: 0.25,
  ring: 30,
  bossRing: 46,
  rays: 10,
} as const;

export const HEAVY_SHAKE = { topSources: 5, share: 0.6, window: 0.15, hurtShare: 0.2 } as const;

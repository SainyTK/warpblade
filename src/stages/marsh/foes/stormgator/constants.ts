export const GATOR = {
  walk: 13,
  turnPace: 0.45,
  rushSpeed: 200,
  rushReach: 150,
  rushMost: 1,
  skid: 520,
  slamReach: 52,
  slamFront: 16,
  slamHeight: 14,
  waveFrom: 38,
  bellowAfter: 3,
  bellowChance: 0.45,
  near: 54,
  far: 170,
} as const;

export const GATOR_TIMES = {
  rushWind: 0.85,
  slamWind: 0.8,
  slam: 0.35,
  bellowWind: 0.9,
  bellow: 0.55,
  rest: 1.2,
} as const;

export const GATOR_HITS = { rush: 28, slam: 24, wave: 18, touch: 10 } as const;

export const GATOR_SUMMON = { each: 2, most: 3, xp: 0.15, gap: 20, fling: 70 } as const;

export const GATOR_ARMOR = 0.5;

export const GATOR_REACH = { back: 30, front: 34, tall: 26 } as const;

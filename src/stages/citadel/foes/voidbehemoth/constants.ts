export const BEHEMOTH = {
  pace: 14,
  keep: 34,
  slamReach: 56,
  chargeReach: 170,
  slamWind: 1.05,
  slamTime: 0.35,
  slamHalf: 30,
  chargeWind: 0.95,
  chargeSpeed: 205,
  chargeRun: 150,
  recover: 1.45,
  armour: 0.4,
  exposed: 1.4,
} as const;

export const BEHEMOTH_HITS = { slam: 24, wave: 18, charge: 22, touch: 9 } as const;

export const BEHEMOTH_MOVE = { slam: 1, charge: 2 } as const;

export const SLAM_WAVE = { speed: 150, height: 9, reach: 110 } as const;

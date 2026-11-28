export const COLOSSUS = {
  walk: 14,
  near: 50,
  far: 170,
  slamWind: 1.15,
  slamActive: 0.3,
  exposed: 1.6,
  slamReach: 36,
  slamHeight: 28,
  spikeGaps: [46, 64, 82],
  spikeDelay: 0.16,
  callWind: 0.95,
  callRecover: 0.9,
  icicleGap: 30,
  icicleWarn: 0.85,
} as const;
export const COLOSSUS_HITS = { slam: 28, spike: 18, icicle: 20, touch: 9 } as const;
export const COLOSSUS_TAKES = { armoured: 0.55, exposed: 1.6 } as const;

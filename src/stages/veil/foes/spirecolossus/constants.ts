export const COLOSSUS = {
  pace: 13,
  near: 42,
  far: 150,
  slamWind: 1.05,
  slam: 0.3,
  callWind: 0.8,
  call: 0.5,
  recover: 1.5,
  fall: 1,
  slamReach: 36,
  spikes: [26, 44, 62],
  spikeEvery: 0.12,
  spikeLife: 0.42,
  stoneSpread: 26,
  stoneHalf: 7,
  guarded: 0.5,
  exposed: 1.25,
} as const;
export const COLOSSUS_HITS = { slam: 28, spike: 18, stone: 20, touch: 10 } as const;
export const SLAM = 0;
export const CALL = 1;

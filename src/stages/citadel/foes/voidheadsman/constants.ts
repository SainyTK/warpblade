export const HEADSMAN = {
  pace: 16,
  keep: 36,
  chopReach: 62,
  stepReach: 210,
  chopWind: 1.05,
  chopTime: 0.3,
  chopFrom: 4,
  chopTo: 60,
  stepWind: 0.75,
  stepBehind: 30,
  sweepWind: 0.5,
  sweepTime: 0.28,
  sweepHalf: 50,
  sweepHeight: 22,
  callWind: 1,
  callTime: 0.35,
  callMost: 2,
  callXp: 0.15,
  recover: 1.3,
  summonArmour: 0.5,
} as const;

export const HEADSMAN_HITS = { chop: 28, fissure: 20, sweep: 24, touch: 10 } as const;

export const HEADSMAN_MOVE = { chop: 1, step: 2, call: 3 } as const;

export const FISSURE = { speed: 170, height: 12, reach: 130 } as const;

export const BEAR_HITS = { slam: 28, wave: 17, roar: 9, touch: 8 } as const;

export const BEAR_TIMES = { rear: 1.0, slam: 0.3, slump: 1.4, howl: 0.55, roar: 0.6, rest: 0.8 } as const;

export const BEAR_MOVE = {
  walk: 13,
  slamTrigger: 42,
  roarTrigger: 96,
  slamReach: 34,
  slamHeight: 30,
  exposed: 1.5,
} as const;

export const SHOCK = { from: 8, step: 10, segments: 4, beat: 0.06, burst: 0.32, height: 15, half: 3.5 } as const;

export const ROAR_CLOUDS = { offsets: [-28, 0, 28], radius: 14, life: 2.4, rise: 11 } as const;

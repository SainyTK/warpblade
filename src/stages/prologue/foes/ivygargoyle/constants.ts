export const GARGOYLE = {
  hover: 34,
  height: 56,
  sense: 110,
  fold: 0.85,
  lock: 0.65,
  climb: 34,
  fall: 1100,
  fallMost: 340,
  grounded: 1.5,
  takeoff: 0.6,
  armour: 0.3,
  sit: 11,
  slamHalf: 14,
  rubble: { speed: 105, life: 0.55, half: 4, height: 8 },
} as const;

export const GARGOYLE_HITS = { slam: 21, rubble: 10 } as const;

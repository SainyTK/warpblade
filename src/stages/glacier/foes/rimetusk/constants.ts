export const TUSK = {
  walk: 22,
  near: 58,
  far: 170,
  wind: 1,
  speed: 235,
  reach: 150,
  skid: 1,
  dazed: 1.7,
  toss: 0.65,
  tossActive: 0.25,
  tossRecover: 0.9,
  tossReach: 34,
  tossHeight: 30,
} as const;
export const TUSK_HITS = { charge: 21, toss: 19, touch: 8 } as const;
export const TUSK_TAKES = { charging: 0.5, dazed: 1.35 } as const;

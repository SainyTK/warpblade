export const SEER_MOVE = {
  pace: 20,
  near: 56,
  far: 130,
  spearRange: 190,
  spearGap: 26,
  hopRest: 2.4,
  hopBack: 120,
  hopUp: 170,
  gravity: 700,
} as const;

export const SEER_TIMES = { raise: 0.75, cast: 1, release: 0.35, recover: 0.8 } as const;

export const SEER_CAST = { spears: 0, ward: 1 } as const;

export const WARD = { reach: 120, life: 5, share: 0.6 } as const;

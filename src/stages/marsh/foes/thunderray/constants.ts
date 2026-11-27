export const RAY = {
  hover: 74,
  height: 66,
  drift: 55,
  charge: 0.95,
  chargeTop: 40,
  chargeRise: 12,
  strikes: 5,
  strikeGap: 0.12,
  strikeWarn: 0.45,
  strikeTop: 18,
  linger: 1,
  tuck: 0.6,
  swoop: 0.95,
  swoopSpan: [110, 210],
  swoopLow: 20,
  recover: 0.8,
  armour: 0.35,
  sense: 170,
} as const;

export const RAY_HITS = { strike: 24, swoop: 20, touch: 8 } as const;

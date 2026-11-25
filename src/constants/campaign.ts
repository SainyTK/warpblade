export const CAMPAIGN_THREAT = {
  prologue: 1,
  firstRift: 3,
  perRiftCleared: 2.2,
  citadel: 21,
} as const;

export const PIT_FALL = { hpShare: 0.15, below: 40, invulnerable: 1.4 } as const;

export const SURGE = {
  spawnMargin: 26,
  refill: 0.3,
  opening: 0.2,
  heroGap: 48,
  eliteEvery: 18,
  baseCapShare: 0.6,
  capPerThreat: 0.9,
  mostCap: 30,
  countPerThreat: 0.02,
  growsFromThreat: 3,
  reachableY: 100,
  stragglerSink: 18,
} as const;

export const MAP_HEAL = 1;

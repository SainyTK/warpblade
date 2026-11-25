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
  capPerThreat: 0.7,
  mostCap: 30,
  countPerThreat: 0.05,
  reachableY: 100,
  stragglerSink: 18,
} as const;

export const MAP_HEAL = 1;

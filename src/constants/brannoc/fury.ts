/** Fury: every point of missing HP makes him hit harder, swing faster and walk faster */
export const FURY = {
  /** at 0 HP: damage +60%, attack rate +30%, walk +15% */
  damage: 0.6,
  rate: 0.3,
  walk: 0.15,
  /** Bloodied at or under this share of max HP */
  bloodied: 0.35,
  /** while Bloodied, a kill heals this share of max HP, outside the debt (Bloodthirst) */
  thirst: 0.03,
  /** the red steam over his shoulders while Bloodied, every this many seconds, and the rim flash on crossing in */
  steam: 0.5,
  rim: 1 / 30,
} as const;

/** The debt: HP he spends on I or bleeds through his guard, which he wins back by landing blows before a foe lands one on him */
export const DEBT = {
  /** the most it holds, as a share of max HP; HP spent past it is gone */
  cap: 0.4,
  /** each foe a blow lands on returns this share of max HP, a crit this much, a kill this much more */
  repay: 0.025,
  crit: 0.05,
  kill: 0.05,
  /** at most this many foes a blow repay */
  foes: 3,
  /** after this many seconds without a blow landed it fades at this share of max HP a second */
  idle: 3,
  fade: 0.05,
  /** the segment brightens this long on a repay, and flashes white then breaks into shards over these on a forfeit */
  repayFlash: 0.1,
  forfeitFlash: 0.08,
  forfeitShards: 0.2,
} as const;

/** the motes that fly from a struck foe into his chest on each repay */
export const DEBT_MOTES = { min: 2, max: 3, flight: 0.25 } as const;

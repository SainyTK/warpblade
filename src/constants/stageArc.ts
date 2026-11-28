import type { StageTier } from "../types/campaign";

export const TIER_SCALE: Readonly<Record<StageTier, { hp: number; damage: number }>> = {
  1: { hp: 1, damage: 1 },
  2: { hp: 1.3, damage: 1.1 },
  3: { hp: 1.7, damage: 1.25 },
  4: { hp: 2.2, damage: 1.4 },
  5: { hp: 3, damage: 1.6 },
};

export const EXPECTED_HERO_DAMAGE: readonly (readonly [level: number, times: number])[] = [
  [1, 1],
  [15, 3],
  [30, 40],
  [50, 300],
  [80, 24000],
  [99, 150000],
];

export const CROWD_TOUGHNESS: readonly (readonly [level: number, times: number])[] = [
  [1, 1],
  [45, 1],
  [55, 5.8],
  [80, 0.97],
  [99, 0.36],
];

export const HERO_DPS_AT_LEVEL_1 = 30;

export const TIME_TO_KILL = { elite: 20, mini: 170, boss: 150 } as const;

export const FOE_HIT = 10;

export const OFF_LADDER_HITS = 4;

export const LADDER_RUNGS = [
  { level: 1, hits: 1 },
  { level: 15, hits: 20 },
  { level: 26, hits: 26 },
  { level: 38, hits: 30 },
  { level: 48, hits: 32 },
  { level: 53, hits: 34 },
  { level: 62, hits: 38 },
  { level: 78, hits: 42 },
] as const;

export const FLYER_TOUGHNESS = 0.5;

export const FOE_BAND = {
  damagePerLevel: 0.015,
  eliteWeight: 3,
  goldShare: 0.4,
  summonXpOfLevel: 0.1,
} as const;

export const BIG_FOE_POWER = 1.25;

export const HYPER = { foePace: 1.25, coins: 2 } as const;

export const LADDER_PICK = [4, 2, 1] as const;

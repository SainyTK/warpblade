import type { ShardKind } from "../types/game";
import type { SkillPact } from "../types/skill";

export const SHARD_GAIN: Readonly<Record<ShardKind, number>> = { heart: 3, mana: 2 };

export const SHARD_DROP = {
  eliteChance: 0.1,
  minionChance: 0.0015,
} as const;

export const SHARD_MOTION = {
  gravity: 420,
  bounce: 0.35,
  pull: 7,
  reach: 13,
  pullAccel: 700,
  pullSpeed: 200,
} as const;

export const SHARD_NAME: Readonly<Record<ShardKind, string>> = { heart: "Heart Shard", mana: "Mana Shard" };

export const PACT = {
  blood: { hp: -0.4, power: 0.06 },
  mending: { hp: 0.3, mp: -0.25 },
  focus: { mp: 0.35, power: -0.03 },
} as const satisfies Record<string, SkillPact>;

export const DRAIN_FLOOR = 1;

export const VITAL_BAR = { start: 0.6, fullShards: { heart: 36, mana: 21 } } as const;

import { BOSS_PHASES } from "../../../../constants/bossFight";
export const CLAW_TIMES = {
  crouch: 0.75,
  recrouch: 0.38,
  flight: 0.62,
  tailWind: 0.7,
  tailSwing: 0.28,
  roarWind: 0.65,
  roar: 0.6,
  breathWind: 0.7,
  breath: 0.75,
  ringWind: 0.8,
  ring: 0.35,
  shift: 1.5,
  rest: 0.75,
} as const;

export const CLAW_HITS = { pounce: 22, landing: 14, tail: 18, icicle: 16, breath: 15, shard: 12 } as const;

export const CLAW = {
  gravity: 900,
  stalk: 30,
  tailReach: 58,
  tailHeight: 11,
  breathReach: 124,
  breathHeight: 14,
  slick: 6,
  landing: 34,
  enrage: BOSS_PHASES.second,
  ringShards: 12,
} as const;

export const ATTACK = { pounce: 1, tail: 2, roar: 3, breath: 4, ring: 5 } as const;
export type Attack = (typeof ATTACK)[keyof typeof ATTACK];

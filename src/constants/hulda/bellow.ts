import { frame } from "../hero";

/** I: a roar that drags foes in and stuns minions, paid with MP */
export const BELLOW = {
  mp: 20,
  cooldown: 4,
  dur: frame(12),
  roar: frame(5),
  reach: 80,
  /** pixels each foe is dragged toward her, over this many seconds */
  pull: 36,
  pullTime: 0.25,
  /** damage as a multiple of ability power */
  power: 0.6,
  stun: 0.5,
  /** the three rings: how long each takes to reach its size, and the gap between them */
  ringTime: 0.3,
  ringGap: 0.06,
} as const;

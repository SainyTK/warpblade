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
  /** a flying minion is also dragged down, up to this many pixels, toward this height above her feet: her hands */
  drop: 48,
  dropTo: -14,
  /** damage as a multiple of ability power */
  power: 3,
  stun: 0.5,
  /** a flier she drags down reels longer, so she can step in and grab it */
  flierStun: 0.9,
  /** the three rings: how long each takes to reach its size, and the gap between them */
  ringTime: 0.3,
  ringGap: 0.09,
} as const;

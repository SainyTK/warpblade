/** Whirlwall: the chain spun over his head, a ring that cuts foes and breaks their shots */
export const WHIRLWALL = {
  mp: 20,
  cooldown: 5,
  time: 1.2,
  radius: 46,
  /** ability power a tick, ticks every `every` seconds */
  power: 0.35,
  every: 0.2,
  push: 20,
  /** he walks at this share of his speed while it spins */
  walk: 0.5,
} as const;

/** Anchor Pin: the hook hurled down through the foe ahead, nailing it to the floor */
export const ANCHOR_PIN = {
  mp: 24,
  cooldown: 6,
  reach: 90,
  power: 2.0,
  root: 1.8,
  bigRoot: 0.6,
  /** with no foe in reach the hook strikes the floor this far ahead, for half the MP */
  miss: 60,
  /** frames before the hook drives down */
  hit: 8 / 30,
  dur: 16 / 30,
} as const;

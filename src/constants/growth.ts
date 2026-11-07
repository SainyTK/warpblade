/** In-run growth: slots, experience, hero level power, cards, Flow and chests. Design: docs/growth-design.md */
export const RELIC_SLOTS = 5;
export const CHARM_SLOTS = 5;
export const RELIC_MAX_LEVEL = 8;
/** experience for the next level: base + step x (level - 1) */
export const XP_CURVE = { base: 15, step: 10 } as const;
export const MAX_LEVEL = 99;
/** attack damage and ability power multiply by this every level */
export const HERO_LEVEL_POWER = 1.025;
/** card weights: owned relics and charms count `owned` times; every available skill shares `skills` */
export const CARD_WEIGHT = { relic: 100, skills: 300, owned: 3 } as const;
export const PICK_COUNT = 3;
/** a run's rerolls, skips and banishes before the shop adds more */
export const PICK_TOOLS = { rerolls: 2, skips: 2, banishes: 1 } as const;
/** Flow: stacks from the hero's own hits, each adding `perStack` damage on every source */
export const FLOW = {
  cap: 25,
  perStack: 0.04,
  perHit: 1,
  perfectDodge: 5,
  /** seconds after the last hero hit before the stacks drain */
  grace: 2.5,
  drainPerSecond: 4,
  /** share kept when the hero is hurt */
  keptOnHurt: 0.5,
} as const;
/** chests: evolutions only from this wave, and the chance of 3 or 5 upgrades before luck */
export const CHEST = { evolveFromWave: 8, three: 0.1, five: 0.03 } as const;
/** a dropped chest: it pops up, falls and bounces once, then waits on the floor to be touched */
export const CHEST_MOTION = {
  pop: 120,
  gravity: 520,
  bounce: 0.3,
  /** seconds before a chest can be opened, so it is seen first */
  settle: 0.4,
  /** how close a hero's feet must come, in art pixels */
  reach: 11,
  /** seconds between glints */
  glint: 1.4,
} as const;

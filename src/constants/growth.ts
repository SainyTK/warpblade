/** In-run growth: slots, experience, hero level power, cards, Flow and chests. Design: docs/growth-design.md and
 *  docs/skill-design.md */
export const SKILL_SLOT_LEVELS: readonly number[] = [1, 1, 1, 1, 15, 30, 45, 60];
export const SKILL_SLOTS = SKILL_SLOT_LEVELS.length;
export const SKILL_MAX_LEVEL = 8;
export const PICK_SCHEDULE = { everyLevelTo: 30, thenEvery: 2, milestones: [50, 75, 99] } as const;
export const MASTERY = { levels: 4, resonance: 2, power: 0.05 } as const;
export const CHARGE_RANK = { ranks: 6, damage: 0.15, chargeRate: 0.06 } as const;
export const ATTUNEMENT = { levels: 3, resonance: 3 } as const;
/** a skill at its top level evolves once its partner is held at this level or higher */
export const EVOLVE_PARTNER_LEVEL = 4;
/** foes one pull-off of a precise skill pays off on: the foe the hard move was aimed at (docs/skill-design.md) */
export const PRECISE_TARGETS = 1;
/** experience for the next level: base + step x (level - 1) */
export const XP_CURVE = { base: 15, step: 10 } as const;
export const MAX_LEVEL = 99;
/** attack damage and ability power multiply by this every level */
export const HERO_LEVEL_POWER = 1.025;
export const CARD_WEIGHT = {
  newSkill: 100,
  skillLevel: 14,
  mastery: 10,
  chargeRank: 10,
  attunement: 8,
  artLevel: 45,
  honing: 2,
  resonancePull: 0.03,
} as const;
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

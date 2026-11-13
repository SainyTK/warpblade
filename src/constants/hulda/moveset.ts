/**
 * J held, her warp: the chained gauntlet clamps on the foe and hauls her in. A minion arrives in her hands; a flier, or
 * any minion with Comet Grab, is ridden down into a slam; a big foe is crushed in both hands.
 */
export const WARP_GRAB = {
  /** the arrival blow's box ahead of her, from her feet; a short shove, so a minion stays at her hands */
  box: [-4, -36, 24, 2] as const,
  kx: 40,
  ky: -20,
  /** Comet Grab: she arrives this far over a minion on the floor, already clamped on, and rides it down */
  comet: 30,
  /** Chain Haul: foes near the landing reel this long and are dragged this far toward her */
  reelStun: 0.6,
  drag: 20,
} as const;

/** her thrown gauntlet: its length from the cuff to the knuckles, the fist's half width and the chain's link step */
export const THROWN_GAUNTLET = { length: 7, fist: 2.6, cuff: 1.8, link: 3 } as const;

/**
 * K, her iron guard: almost nothing gets through and a block costs little. Iron Catch, the parry, takes a minion
 * attacker within `reach` into her hands, and answers a big foe with a haymaker of this power.
 */
export const IRON_GUARD = { chip: 0.05, blockCost: 10, reach: 40, haymaker: 2 } as const;

/** I held with Bull Rush selected: a charge this much longer, for this much more stamina */
export const RUSH_SLOT = { wideTime: 1.6, wideCost: 1.5 } as const;

/** I held with Bellow selected: a wider roar that pulls from further, for more MP */
export const WIDE_BELLOW = { reach: 1.6, pull: 1.5, mp: 1.5 } as const;

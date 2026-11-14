/** Vesper's crossed blades: an average block, and a parry that turns the blow aside and opens the foes */

/** a blocked blow lets this share through and costs this much stamina */
export const VESPER_BLOCK = { chip: 0.25, cost: 14 } as const;
/** the parry: the short blade cuts the attacker at once this hard, a sure crit, and for this many seconds every blow of
 *  hers counts as from behind and breaks guards */
export const TURN_ASIDE = { power: 0.9, open: 1.4 } as const;

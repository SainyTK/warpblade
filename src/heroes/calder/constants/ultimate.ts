/** Cylinder Break, Calder's ultimate: a run of exploding cuts, more with a fuller chamber */

/** cuts with an empty chamber; each round in it adds one */
export const BREAK_BASE_CUTS = 3;
/** seconds between cuts, and before the first */
export const BREAK_GAP = 0.11;
export const BREAK_FIRST = 0.12;
/** each cut's share of a charge level's power, before the chamber's bonus */
export const BREAK_SHARE = 0.12;
/** how far the cuts reach at each charge level; level 4 crosses the screen */
export const BREAK_REACH = [50, 75, 110, 340] as const;

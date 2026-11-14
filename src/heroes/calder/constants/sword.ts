/** Calder's chamber sword in pixels along it from the hand (`d`) and across it toward the edge (`w`) */

/** from the hand to the tip */
export const SWORD_REACH = 19;
/** where the cylinder sits along the sword, how far it swings out to the spine side when open, and its half width */
export const DRUM = { from: 1.2, to: 4.4, swing: 2.6, half: 2.1 } as const;
/** the barrel under the spine ends in the muzzle, where every round leaves the sword */
export const MUZZLE = { d: 10.5, w: -1.35 } as const;

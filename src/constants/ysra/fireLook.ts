/** Pyre Wave's wall of flame: how far its fire trails behind the front and how fast it falls away there, how far its
 *  crest curls ahead, how see-through the trailing fire is, and the speed its tongues lick in radians a second */
export const PYRE_WALL = { trail: 52, falloff: 24, lead: 4, curl: 7, thin: 0.8, lick: 20 } as const;

/** a tongue of flame drawn in image pixels: its width at the root in image pixels, and how far the tip leans */
export const TONGUE = { root: 5, lean: 2.5 } as const;

/** Cinder Lash's whip: licks of flame standing on it, their height, and the seconds its crack burns white */
export const LASH_LOOK = { licks: 9, lickHeight: 4, crack: 0.05 } as const;

/** a burning stake: half its width at the floor, and the flame at its point */
export const STAKE_LOOK = { half: 1.3, flame: 4 } as const;

/** Kael's sword guard: a light block, and a parry that cuts back and opens a counter */

/** a blocked blow lets this share through and costs this much stamina */
export const KAEL_BLOCK = { chip: 0.2, cost: 14 } as const;
/** the parry's riposte: a cut at once at what struck Kael, this hard, and his next blows hit as a riposte for a while */
export const RIPOSTE = { power: 1.6, blows: 2, time: 1.2 } as const;
/** after a parry, J tapped within this many seconds blinks to the attacker's back and strikes it this hard, a sure crit */
export const COUNTER = { window: 0.7, power: 2 } as const;
/** the mark at the attacker's back while the counter is open: its size, how fast it pulses, and Kael's distance from the
 *  foe's edge when he lands there */
export const COUNTER_MARK = { arm: 3, pulse: 18, gap: 9 } as const;
/** Crystal Aegis: the crystals set in the guard float this far round the sword hand, and the shatter's look */
export const AEGIS_LOOK = { orbit: 9, spin: 3, size: 2.8, shards: 6 } as const;
/** Crystal Aegis: a foe beside the one the shatter is aimed at takes this share of it */
export const AEGIS_SPLASH = 0.4;

/** Calder's guard on the spine of the blade: an average block */
export const GUARD = { chip: 0.25, blockCost: 14 } as const;

/** the parry's point-blank counter shot: its power, the stagger, the push and the rounds it loads */
export const COUNTER_SHOT = { power: 2, stagger: 1, kx: 150, rounds: 2, reach: 34 } as const;

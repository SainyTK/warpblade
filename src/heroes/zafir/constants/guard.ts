/** Zafir's guard, a veil of sand: a middling block */
export const SAND_VEIL = { chip: 0.25, cost: 14 } as const;
/**
 * His parry leaves a mirage where he stood: minions near it lose sight of him and strike at it, and it bursts into sand
 * blades after `life` seconds, cutting every foe within `reach` for `power` times attack damage and opening wounds.
 * Zafir slips `slip` pixels back from it, and his next blow is Keen.
 */
export const MIRAGE = { life: 0.6, reach: 44, blind: 1.1, power: 1.4, wounds: 2, slip: 14 } as const;

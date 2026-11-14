/** Sword Screen: a block lets this share through and costs this much stamina */
export const YUN_GUARD = { chip: 0.3, blockCost: 14 } as const;

/** Deflecting Qi: the parry's qi wave flies `reach` pixels at `speed` and cuts each foe once for `power` times attack
 *  damage */
export const QI_WAVE = { reach: 120, speed: 300, power: 1.2, half: 10 } as const;

/** the warp's extra: each held spirit sword strikes the foe once on arrival for this much attack damage */
export const ARRIVAL_SWORD = { power: 0.12, gap: 0.05, rise: 30 } as const;

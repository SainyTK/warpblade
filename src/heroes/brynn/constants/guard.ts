/** the flat of the blade: a blocked blow lets this share through and costs this much stamina */
export const BRYNN_BLOCK = { chip: 0.1, cost: 22 } as const;
/** the Counter Cleave a parry answers with: its power, knockdown and reach in front and behind */
export const COUNTER_CLEAVE = { power: 2.4, stun: 0.9, box: [-6, -44, 44, 4] } as const;

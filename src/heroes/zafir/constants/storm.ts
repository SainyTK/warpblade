/** Sandstorm, Zafir's ultimate: a storm that follows him at each charge level, for this many seconds and this far */
export const STORM_TIME = [3, 4, 5, 6] as const;
export const STORM_REACH = [44, 58, 72, 96] as const;
/** it cuts every foe in it this often; over its whole life a foe in it takes this share of the charge level's power */
export const STORM_CUT = { every: 0.25, share: 1.1, wounds: 1, pull: 30 } as const;
/** its look: grains in the wind, how fast they turn, the storm's height and the bands of blown sand in it */
export const STORM_LOOK = { grains: 60, spin: 3.2, height: 46, bands: 5 } as const;

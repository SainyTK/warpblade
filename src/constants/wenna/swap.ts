/** L: Swap, a trade of places with a Wick */
export const SWAP = {
  range: 160,
  stamina: 15,
  cooldown: 1,
  /** seconds both are gone before they appear at the other's spot */
  gone: 0.08,
  /** seconds she cannot be hit after she arrives */
  untouchable: 0.15,
  /** a blow that would have reached her this soon after the press is a perfect dodge */
  dodge: 0.1,
  /** the arriving Wick's flare: ability power, reach and knockback */
  flare: 0.6,
  flareReach: 24,
  flareKnock: 60,
  /** the pose's length */
  dur: 0.22,
} as const;

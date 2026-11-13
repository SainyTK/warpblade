/** Kindle: the Wick nearest her bursts */
export const KINDLE = {
  mp: 16,
  cooldown: 3,
  reach: 120,
  power: 2,
  radius: 36,
  kx: 100,
  ky: -60,
  /** the flame swells this long before it bursts */
  swell: 0.15,
  /** Wax back for the spent Wick */
  refund: 12,
  /** held: every Wick in reach bursts at this share of the power, for this many times the MP */
  wideShare: 0.7,
  wideMp: 1.75,
  /** the cast pose */
  dur: 10 / 30,
} as const;

/** Beckon: every Wick near her hops to a ring round her */
export const BECKON = {
  mp: 12,
  cooldown: 6,
  reach: 200,
  /** seconds they hold the ring, the damage they take meanwhile, and the ring's radius */
  hold: 2,
  hurt: 0.5,
  radius: 18,
  /** seconds each Wick's hop to its place in the ring takes */
  leap: 0.4,
  dur: 10 / 30,
} as const;

/** the cast pose of her spell skills, and when they go off */
export const WENNA_SPELL = { dur: 12 / 30, hit: 6 / 30 } as const;

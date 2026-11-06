/**
 * The reload: O or an empty J starts it, and a second O inside the bright window finishes it at once and primes the
 * bolts. A second O outside the window jams the crank and costs extra time.
 */
export const RELOAD = {
  /** seconds a plain reload takes, cut by attack speed */
  dur: 1.05,
  /** the bright window, as parts of the reload's own length */
  window: [0.42, 0.62] as const,
  /** Perfect Rhythm widens the window this much on each side per rank */
  windowPerRank: 0.03,
  /** a jam adds this many seconds */
  jam: 0.45,
  /** a perfect reload primes this many bolts, Perfect Rhythm adds this many per rank */
  primed: 4,
  primedPerRank: 3,
  /** Hunter's Focus: a perfect reload gives this back */
  focusStamina: 25,
  focusMp: 10,
  /** seconds the HUD flashes after a perfect reload, a jam or an empty quiver */
  flash: 0.5,
} as const;

/**
 * The release: when Saya's blade goes home, every foe she cut takes its stored cuts in one hit. A keyed sheathe pays
 * them in full and knocks the foes it lands on down; a blade that goes home without one pays the early share.
 */
export const RELEASE = {
  /** share of the stored cuts paid when the blade goes home without a sheathe of its own */
  early: 0.6,
  /** seconds the blade must rest before stored cuts release on their own: the string's link */
  grace: 0.25,
  /** a full release knocks foes down this long, and throws them back and up this hard */
  stun: 0.8,
  kx: 70,
  ky: -90,
  /** an early release only staggers */
  stagger: 0.35,
  /** seconds a foe holding cuts stays slowed while Ink Flow slows it */
  slow: 0.2,
} as const;

/** how the stored cuts look on a foe: the lines' length, the most lines drawn on one foe and how long a release's ink
 *  burst lasts */
export const STORE_LOOK = { line: 9, lines: 4, burst: 0.4 } as const;

/** a second release (Perfect Stillness, New Moon) follows the first after this many seconds */
export const ECHO_DELAY = 0.25;

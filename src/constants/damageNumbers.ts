/** Damage numbers over the foes: how they merge, stack and stay readable when many hits land at once. */
export const DAMAGE_NUMBERS = {
  /** hits on the same foe within this many seconds of a number popping add into it */
  merge: 0.3,
  /** at most this many numbers show at once; the oldest quiet one, then the oldest plain one, then the oldest gives way */
  cap: 28,
  /** numbers over the same spot this recent stack upward instead of overlapping */
  stackNear: 12,
  stackFresh: 0.25,
  stackStep: 9,
  /** seconds a number lives, plain and big */
  life: 0.7,
  bigLife: 0.9,
  /** rise speed, plain and big */
  rise: -45,
  bigRise: -60,
  /** relic numbers rise slower, so the hero's own hits read first */
  quietRise: -32,
  /** from this value on a number is drawn in thousands, as 123K */
  thousandsFrom: 100_000,
} as const;

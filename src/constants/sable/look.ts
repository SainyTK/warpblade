/** How Sable's effects look. Nothing here changes play. */

/**
 * The lights of her bolts and bursts, as radius, strength and seconds. They are small and take a saturated step of her
 * ramp, so a struck foe keeps its shape and its colors.
 */
export const JADE_LIGHT = {
  hit: [8, 0.35, 0.1],
  primedHit: [12, 0.4, 0.12],
  muzzle: [7, 0.4, 0.07],
  primedMuzzle: [10, 0.45, 0.08],
  bounce: [8, 0.4, 0.1],
  burst: [24, 0.45, 0.2],
  perfect: [20, 0.45, 0.25],
  snareSet: [10, 0.4, 0.2],
  snareShut: [14, 0.45, 0.18],
} as const;
export type JadeLight = keyof typeof JADE_LIGHT;

/** a bolt in flight: its trail, fletching, the flicker of its spin and how a stuck one shivers */
export const BOLT_LOOK = {
  /** how far behind the head the fading trail reaches, and how much longer a primed bolt's is */
  trail: 26,
  primedTrail: 34,
  /** the fletching flares this far out and back from the tail */
  fletch: 1.5,
  /** pixels flown for one turn of the shaft, which shows as the fletching opening and closing */
  spin: 14,
  /** a stuck bolt shivers this long, by this many radians at first */
  shiver: 0.18,
  shiverAngle: 0.35,
  /** the soft light on a primed or heavy head */
  headLight: 5,
  heavyLight: 7,
} as const;

/**
 * The wake of a heavy bolt: seconds it lingers after the bolt has gone, the length of each piece it breaks into, how
 * far the pieces drift apart, the motes along it, and the ring at the muzzle with its life.
 */
export const WAKE_LOOK = { linger: 0.3, piece: 6, drift: 3, motes: 14, ring: 9, ringLife: 0.16 } as const;

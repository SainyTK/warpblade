import { frame } from "../hero";

/** Sable's crossbow bolts: how they fly, what they deal and how fast she looses them */
export const BOLT = {
  /** bolts the quiver holds before a reload */
  quiver: 8,
  /** Deep Quiver adds this many per rank */
  quiverPerRank: 3,
  /** pixels a second */
  speed: 430,
  /** pixels a bolt flies before it drops away */
  range: 250,
  /** damage as a multiple of attack damage */
  power: 0.95,
  /** a perfect reload's bolts deal this much more */
  primedScale: 1.35,
  /** foes a bolt passes through before it stops, before Piercing Bolts */
  pierce: 0,
  /** seconds from one shot to the next at attack speed 1 */
  interval: 0.24,
  /** the hop back's free bolt deals this share of a normal bolt */
  hopShare: 0.8,
  /** Scattershot: the side bolts fan this far off the aim, in radians, and deal this share each */
  scatterSpread: 0.16,
  scatterShare: 0.55,
  /** knockback of one bolt */
  kx: 55,
  ky: -15,
  stagger: 0.18,
  /** pixels of shaft drawn behind the head */
  shaft: 9,
  /** a stuck bolt stays in the floor this long */
  stuck: 0.6,
} as const;

/** where the bolt leaves the crossbow, pixels from her feet facing right, for each aim */
export const MUZZLE = {
  level: { x: 13, y: -18 },
  up: { x: 11, y: -24 },
  /** kneeling on the floor */
  low: { x: 13, y: -11 },
  /** slanted down in the air */
  air: { x: 11, y: -14 },
} as const;

/**
 * A bolt bends toward the foe nearest the aim: within `cone` radians of it at range, widening to `closeCone` for a foe
 * `close` pixels away or nearer, so a flier right over her can still be shot.
 */
export const AIM_ASSIST = { cone: 0.4, closeCone: 1.35, close: 70 } as const;

/** the angle of each aim in radians, positive down */
export const AIM_ANGLE = { level: 0, up: -0.5, low: 0, air: 0.62 } as const;

/** the shoot clip: the bolt leaves on this frame, and J held fires again once the interval has run */
export const SHOOT_TIMES = { fire: frame(2), dur: frame(8) } as const;

/** A Wick, the wax figure her lamp lights: its body, life, bite, walk, hold and guard. */
export const WICK = {
  /** share of her max HP a Wick has */
  hpShare: 0.3,
  /** seconds a Wick lives, and the last seconds over which its flame and body shrink */
  life: 18,
  shrink: 6,
  /** Wicks that light for free at the start of a wave when she has none */
  waveStart: 2,
  /** Wicks per Wenna at base */
  cap: 4,
  /** seconds a Wick takes to rise out of its pool; it cannot be hit and does not bite meanwhile */
  rise: 0.35,
  /** seconds a Wick takes to melt into a puddle */
  melt: 0.4,
  /** seconds between bites, and on her Quarry */
  biteEvery: 0.8,
  quarryBiteEvery: 0.55,
  /** a bite reaches a foe this far ahead of the Wick and this far above its feet (a small hop) */
  biteReach: 24,
  biteRise: 30,
  /** ability power of one bite, and its knockback */
  bitePower: 0.4,
  biteKnock: 20,
  /** seconds a Wick sinks and draws its flame back before a bite lands, then seconds of the lean and flame lunge after */
  load: 0.08,
  lunge: 0.18,
  /** seconds it crouches before a hop or a leap leaves the floor, and seconds its body squashes when it lands */
  hopLoad: 0.08,
  landSquash: 0.14,
  /** how fast it gathers into its walk and brakes out of it, pixels per second each second */
  accel: 400,
  /** seconds Pack Lunge's leap flies, and the share of the way to the Quarry it covers */
  packLeap: 0.12,
  packReach: 0.4,
  /** a Wick goes after foes this near when she has no Quarry it can reach */
  seek: 140,
  /** with no foe of its own, it stands guard this far in front of her, toward the nearest foe, where blows come from */
  guardNear: 12,
  guardFar: 24,
  /** with two or more out, the Wick nearest her stays her guard: it only goes after foes this near her */
  guardHold: 40,
  /** her guard leaps straight up from its post to bite a flier hovering over it, its body's bottom up to this far above
   *  the guard's feet */
  guardLeap: 56,
  /** walking speed before her move stat */
  walk: 55,
  /** it hops up to a floor this far above toward its target */
  hopUp: 50,
  /** half the width of its body, the edge a held foe stops at */
  half: 4,
  /** its height */
  height: 12,
  /** a held foe burns it for this much, before the wave's scaling, once a second; heavier foes push it this far and
   *  burn it twice as hard */
  holdBurn: 7,
  holdEvery: 1,
  pushBack: 20,
  /** it intercepts a blow aimed at her from a foe on its side when it stands this near her, once each `guard` seconds */
  guardReach: 20,
  /** a blow from this near her middle came from above, and a Wick on either side may take it */
  fromAbove: 4,
  /** a Wick takes a blow for her from this far below her feet up to this far above them (a guard leaping over her
   *  meets a falling shot) */
  guardBelow: 16,
  guardAbove: 40,
  guard: 0.3,
  /** seconds it gutters sideways after a hurt */
  hurt: 0.1,
  /** a Wick nobody has tended for this long is let go: it holds no foe and is not drawn (its owner fell or left) */
  untended: 0.25,
  /** gravity on a hopping or falling Wick */
  gravity: 600,
} as const;

/** Wax, the WX bar: what lighting Wicks costs, how it trickles in and what foes drip */
export const WAX_BAR = {
  max: 100,
  /** a run starts with this much */
  start: 60,
  /** Wax a second, always */
  trickle: 3,
} as const;

/** Wax a defeated foe drips: a minion, an elite, a mini boss or the Warden */
export const WAX_DRIP = {
  minion: 10,
  elite: 20,
  mini: 40,
  boss: 40,
  /** a drip flies to her when she is this near; Lodestone pulls from twice as far */
  pull: 80,
  lodestonePull: 160,
  /** it lies on the floor this long, blinking for the last seconds */
  life: 6,
  blink: 1.5,
  /** flight speed toward her, gravity while it falls, and how near her chest it is taken */
  speed: 170,
  gravity: 420,
  reach: 8,
} as const;

/** K: lighting a Wick */
export const LIGHT = {
  cost: 25,
  /** a relight at the cap */
  relight: 10,
  /** the cast pose, and when the drop of flame leaves the lamp */
  dur: 0.25,
  release: 0.12,
  /** the drop lands this far ahead */
  ahead: 20,
} as const;

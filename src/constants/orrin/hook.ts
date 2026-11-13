/** J held with Up: the swing hook and the swing under it. Speeds in pixels a second, accelerations in pixels a second squared. */
export const HOOK = {
  /** stamina a hook costs */
  cost: 18,
  speed: 420,
  range: 84,
  /** aim angles above level, toward the facing side: with Up and a side held, and with Up alone */
  aim: 40,
  aimUp: 75,
  /** a crystal this close to the hook's path catches it */
  /** air hooks per airtime; latches on crystals and platforms give the hook back */
  perAir: 2,
  /** the hand the chain hangs from, above his feet, while he swings */
  grip: 24,
  /** the bottom of the arc keeps this far off the floor */
  clearance: 6,
  minLength: 24,
  /** an air bite's tear: seconds it holds, and when it starts to flicker */
  bite: 1.2,
  biteWarn: 0.9,
  /** frames of the throw before the hook leaves the hand */
  windup: 2 / 30,
} as const;

/** the pendulum */
export const SWING = {
  /** A or D held pumps along the swing this hard */
  pump: 260,
  maxSpeed: 300,
  /** a latch from the floor yanks him onto the arc this fast along it, over this long */
  yankSpeed: 170,
  yankTime: 0.12,
  /** letting go while rising in the forward half of the arc adds this share: the fling */
  fling: 0.15,
  /** Up while swinging lets go with this much more upward speed */
  hopUp: 80,
  /** faster than this, his body kicks every foe he passes, `kick` times attack damage times speed over `kickPer`,
   *  capped at `kickCap` */
  kickFrom: 140,
  kick: 0.7,
  kickPer: 200,
  kickCap: 1.2,
  /** a Slip: a blow this soon after letting go at this speed or more misses */
  slipWindow: 0.12,
  slipSpeed: 120,
} as const;

/** the reel: J held down again while swinging pulls the chain in */
export const REEL = {
  speed: 160,
  /** speed may rise to this many times what it was when the reel started */
  boost: 1.6,
  /** stamina a second */
  cost: 10,
} as const;

/** a ledge pull up onto a platform too low to swing under: its speed, and the longest it may take */
export const CLIMB = {
  speed: 360,
  most: 0.5,
} as const;

/** after he lets go, his flight keeps its speed: Left or Right add this much air control */
export const FLIGHT = {
  accel: 260,
  /** without a side held his speed eases off by this share a second */
  drag: 0.35,
} as const;

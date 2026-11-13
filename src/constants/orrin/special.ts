/** Grand Pendulum, his special: wide passes under a rift tear, then a crash; Grand Pendulum the skill adds to it */
export const GRAND_PENDULUM = {
  /** the tear opens this far above him */
  height: 70,
  radius: 90,
  windup: 0.2,
  /** passes with no skill, and seconds each takes */
  passes: 2,
  pass: 0.6,
  /** each pass strikes every foe it meets for this share of the level's power, and the crash ring this share */
  power: 0.5,
  crash: 1,
  /** most time the crash may take to reach the floor */
  fall: 0.5,
  /** the tear keeps this far plus the chain's length in from the stage's sides */
  edge: 8,
  /** the widest angle of a pass either side of straight down, in radians */
  amplitude: (65 * Math.PI) / 180,
  /** a full turn round the tear: seconds it takes, the top of the screen it keeps under, and seconds the tear takes to
   *  drop to the middle of the stage for the turns */
  turn: 0.42,
  top: 14,
  settle: 0.15,
} as const;

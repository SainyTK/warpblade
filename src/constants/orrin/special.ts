/** Grand Pendulum, his special: two wide passes under a rift tear, then a crash */
export const GRAND_PENDULUM = {
  /** the tear opens this far above him */
  height: 70,
  radius: 90,
  windup: 0.2,
  /** seconds for both passes */
  passes: 1.2,
  /** each pass strikes every foe it meets for this share of the level's power */
  pass: 0.5,
  /** the crash: screen shake, hit-stop */
  shake: [0.3, 4] as const,
  stop: 0.08,
  /** most time the crash may take to reach the floor */
  fall: 0.5,
} as const;

/** Maelstrom, the ultimate skill: full vertical turns round a rift tear */
export const MAELSTROM = {
  height: 60,
  /** seconds a turn takes */
  turn: 0.42,
  windup: 0.2,
} as const;

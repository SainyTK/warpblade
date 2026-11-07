import { frame } from "../hero";

/** Quake Drop, her special: the fists fall on this frame of the ultimate's clip, and minions are thrown up this fast */
export const QUAKE = { slam: frame(7), launch: -260, bigStun: 0.6, shake: [0.35, 4] as const } as const;

/** Titan Throw: tethers pull the heap in, she spins once, then hurls it */
export const TITAN = {
  pull: 0.25,
  spin: frame(8),
  /** the heap flies at this speed, this high, and bursts where it lands */
  speed: 260,
  lift: -150,
  burst: 34,
  /** Mountain Hurl: two turns over this long at this radius strike foes this near, then the heap flies flat this fast */
  swing: frame(20),
  swingRadius: 18,
  swingReach: 60,
  hurl: 320,
  /** the scattered heap's bodies fly out this fast */
  scatter: 200,
  /** where the heap sits in her arms, from her feet */
  heap: { x: 8, y: -26 },
} as const;

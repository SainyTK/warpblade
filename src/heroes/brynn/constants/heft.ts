/**
 * Heft, Brynn's meter (HF): built by blows that land, spent whole by a fissure. `most` is full; a blow adds `blow` and
 * `perFoe` for each foe past the first up to `blowMost`; a heavy swing adds `heavy` more and a parry `parry`. After `wait`
 * seconds without a blow landing it drains `drain` a second.
 */
export const HEFT = {
  most: 100,
  cells: 4,
  blow: 14,
  perFoe: 4,
  blowMost: 26,
  heavy: 10,
  parry: 30,
  wait: 3,
  drain: 15,
} as const;

/** the fissure full Heft turns the next slam into: how far it runs, how fast, its power, and the knockdown */
export const FISSURE = { reach: 170, speed: 360, power: 2.4, stun: 1.1, launch: -150 } as const;

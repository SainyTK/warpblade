/**
 * How the jian's tassel swings: the pommel's distance behind the hand, the swing it trails by per pixel a second the
 * pommel moves, the most it swings either way (radians), the spring that pulls it toward that trail, its damping, the
 * kick a sudden change of speed gives it, and caps on the speed and change of speed it reads.
 */
export const TASSEL = {
  pommel: 3.6,
  trail: 0.012,
  most: 1.35,
  spring: 70,
  damp: 7,
  kick: 0.0004,
  fastest: 400,
  hardest: 6000,
} as const;

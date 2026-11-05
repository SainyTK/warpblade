import type { EnemyType } from "../types/enemy";

/** coins each foe drops; the basis for these numbers is in docs/meta-progress.md */
export const COIN_DROP: Record<EnemyType, number> = {
  wisp: 1,
  husk: 2,
  brute: 8,
  warden: 25,
  thornback: 2,
  moth: 1,
  oakheart: 8,
  mire: 2,
  stormkite: 1,
  boghulk: 8,
  golem: 2,
  sprite: 1,
  stalker: 2,
  eye: 1,
  maw: 9,
};

/** every foe drops this share more than its base; Lodestone's bonus adds to it */
export const COIN_BONUS = 0.25;

/** how dropped coins move: they pop out, fall and bounce, lie still, then fly to Kael */
export const COIN_MOTION = {
  gravity: 520,
  /** part of the speed kept after a bounce */
  bounce: 0.45,
  /** seconds before a coin can be picked up by touch */
  settle: 0.25,
  /** seconds before a coin flies to Kael on its own, so none is left behind */
  pull: 1.6,
  /** the same with Lodestone */
  magnetPull: 0.3,
  /** how close to Kael's chest a coin is picked up, in art pixels */
  reach: 12,
  pullAccel: 1100,
  pullSpeed: 260,
} as const;

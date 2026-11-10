import type { KnifeBlow } from "../../types/tallis";
import { frame } from "../hero";

/** one blow of his knives: a box between two distances ahead, its middle `y` above his feet and `height` tall */
export interface KnifeBlowSpec {
  dur: number;
  hit: number;
  near: number;
  far: number;
  y: number;
  height: number;
  /** damage as a multiple of attack damage */
  power: number;
  kx: number;
  /** a foe struck stops walking this long */
  stagger?: number;
  /** breaks a guard and a wind-up */
  heavy?: boolean;
  /** a hit throws a minion up this fast (negative is up) */
  launch?: number;
  /** hit-stop and shake when it lands */
  stop?: number;
  shake?: number;
  /** he hops back this far as it ends (Heel Kick) */
  hop?: number;
  /** the knockback points away from him whatever side the foe stands on (Gut Slash) */
  away?: boolean;
}

/** every blow of his knives */
export const KNIFE_BLOWS: Readonly<Record<KnifeBlow, KnifeBlowSpec>> = {
  flick: { dur: frame(8), hit: frame(3), near: 8, far: 20, y: 15, height: 10, power: 0.8, kx: 20 },
  cross: { dur: frame(9), hit: frame(4), near: 6, far: 22, y: 15, height: 12, power: 0.92, kx: 30, stagger: 0.3 },
  heelKick: {
    dur: frame(13),
    hit: frame(6),
    near: 4,
    far: 24,
    y: 14,
    height: 14,
    power: 1,
    kx: 90,
    heavy: true,
    shake: 1.5,
    hop: 10,
  },
  backstab: {
    dur: frame(10),
    hit: frame(5),
    near: 4,
    far: 20,
    y: 16,
    height: 14,
    power: 1.2,
    kx: 0,
    stagger: 0.5,
    stop: 0.04,
    shake: 1,
  },
  twist: { dur: frame(9), hit: frame(4), near: 4, far: 18, y: 15, height: 12, power: 1, kx: 0 },
  gutSlash: {
    dur: frame(12),
    hit: frame(5),
    near: 4,
    far: 24,
    y: 12,
    height: 14,
    power: 1.3,
    kx: 70,
    launch: -90,
    away: true,
    shake: 2,
  },
  dropStab: { dur: frame(10), hit: frame(4), near: -7, far: 7, y: 6, height: 14, power: 1.1, kx: 0, stop: 0.04 },
  risingCut: {
    dur: frame(11),
    hit: frame(3),
    near: 2,
    far: 20,
    y: 18,
    height: 24,
    power: 1,
    kx: 40,
    launch: -150,
    heavy: true,
    stop: 0.05,
    shake: 1.5,
  },
  hamstring: { dur: frame(12), hit: frame(5), near: 6, far: 30, y: 3, height: 8, power: 0, kx: 10 },
};

/** the string in front of a foe, and the one behind a foe's back */
export const FRONT_STRING: readonly KnifeBlow[] = ["flick", "cross", "heelKick"];
export const BEHIND_STRING: readonly KnifeBlow[] = ["backstab", "twist", "gutSlash"];

/** seconds after a blow ends in which J carries the string on */
export const KNIFE_LINK = 0.3;

/** a ground foe this near with its back to him makes J play the behind string, and wears the back-open chevron */
export const BACK_REACH = 26;

/** his kit adds this much to every knife blow from behind, on top of the shared back bonus: 1.5 x 1.5 = 2.25 */
export const BACK_BONUS = 0.5;

/**
 * Springing Cut: J on the floor with a flier hovering over him and no ground foe in reach springs into Rising Cut this
 * high; a flier this far above his feet (and this near across) calls it. Rising Cut's slash stays live `live` seconds
 * after its hit frame, so it meets a foe the spring carries it up to.
 */
export const SPRING = { rise: 34, above: [16, 64], across: 22, live: 3 / 30 } as const;

/** Drop Stab: the dive's speed, and the most it may last before it gives up */
export const DROP_STAB = { speed: 300, most: 0.8 } as const;

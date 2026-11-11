import type { HitFeel } from "../../types/move";
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
  /** a minion struck staggers this long; left out, the shared `COMBO.stagger` */
  stagger?: number;
  /** breaks a guard and a wind-up */
  heavy?: boolean;
  /** a hit throws a minion up this fast (negative is up) */
  launch?: number;
  /** hit-stop, shake and the pitch of the hit sound when it lands */
  feel: HitFeel;
}

/**
 * Every blow of his knives. The string's hit-stop, shake and pitch grow from Flick to Heel Kick, the finisher clearly
 * the heaviest.
 */
export const KNIFE_BLOWS: Readonly<Record<KnifeBlow, KnifeBlowSpec>> = {
  flick: {
    dur: frame(10),
    hit: frame(5),
    near: 8,
    far: 20,
    y: 18,
    height: 22,
    power: 0.88,
    kx: 8,
    feel: { stop: 0.05, shake: [0.06, 1], pitch: 1.35 },
  },
  cross: {
    dur: frame(10),
    hit: frame(5),
    near: 6,
    far: 22,
    y: 16,
    height: 20,
    power: 0.97,
    kx: 10,
    feel: { stop: 0.07, shake: [0.1, 1.4], pitch: 1.15 },
  },
  heelKick: {
    dur: frame(14),
    hit: frame(6),
    near: 2,
    far: 24,
    y: 26,
    height: 44,
    power: 1.24,
    kx: 10,
    heavy: true,
    launch: -170,
    feel: { stop: 0.12, shake: [0.2, 2.5], pitch: 0.8 },
  },
  dropStab: {
    dur: frame(12),
    hit: frame(5),
    near: -7,
    far: 7,
    y: 6,
    height: 14,
    power: 1.1,
    kx: 0,
    feel: { stop: 0.06, shake: [0.08, 1.2], pitch: 1.1 },
  },
  risingCut: {
    dur: frame(13),
    hit: frame(5),
    near: 2,
    far: 20,
    y: 24,
    height: 36,
    power: 1,
    kx: 40,
    launch: -150,
    heavy: true,
    feel: { stop: 0.08, shake: [0.12, 1.6], pitch: 0.95 },
  },
  hamstring: {
    dur: frame(12),
    hit: frame(5),
    near: 6,
    far: 30,
    y: 3,
    height: 8,
    power: 0,
    kx: 10,
    feel: { stop: 0.04, shake: [0.08, 1], pitch: 0.9 },
  },
};

/** his string on the floor: the same three blows in the same order every time */
export const STRING: readonly KnifeBlow[] = ["flick", "cross", "heelKick"];

/** seconds after a blow ends in which J carries the string on */
export const KNIFE_LINK = 0.3;

/** a ground foe this near ahead of him with its back to him wears the back-open chevron */
export const BACK_REACH = 26;

/** his kit adds this much to every knife blow from behind, on top of the shared back bonus: 1.5 x 1.5 = 2.25 */
export const BACK_BONUS = 0.5;

/** Drop Stab: the dive's speed, and the most it may last before it gives up */
export const DROP_STAB = { speed: 300, most: 0.8 } as const;

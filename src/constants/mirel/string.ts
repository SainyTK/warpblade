import type { StaffBlow } from "../../types/mirel";
import type { HitFeel } from "../../types/move";
import { frame } from "../hero";

/**
 * Where one staff blow strikes, from her shoulder (`SHOULDER_Y` above her feet), facing right with up negative:
 * a straight jab between two distances ahead (its middle `y` above her feet, low enough for short foes), an arc of a radius swept between two angles (radians, 0 straight ahead,
 * -PI/2 straight up), or a ring of a radius round a point ahead.
 */
export type StaffShape =
  | { kind: "jab"; near: number; far: number; height: number; y: number }
  | { kind: "arc"; radius: number; a0: number; a1: number }
  | { kind: "ring"; ahead: number; radius: number };

/** one blow of her staff string */
export interface StaffBlowSpec {
  dur: number;
  hit: number;
  shape: StaffShape;
  /** damage as a multiple of attack damage */
  power: number;
  kx: number;
  ky: number;
  /** seconds a struck minion staggers; unset uses `COMBO.stagger` */
  stagger?: number;
  /** a hit throws a minion up this fast and it lies stunned where it lands */
  lift?: number;
  /** hit-stop, screen shake and hit pitch when it lands */
  feel: HitFeel;
}

/** where her blows strike from, above her feet */
export const SHOULDER_Y = 18;

const DEG = Math.PI / 180;

/**
 * Tick, Tock and Toll on the floor, and Pendant Strike in the air. Tick and Tock push a foe a few pixels and stagger it
 * past the next blow's hit; Toll knocks it down, out of the fight until the next Tick lands. At the 0.8 pace the hit
 * frames fall 0.5 to 0.6 real seconds apart with each blow's hit-stop, and Toll's recovery leaves 0.78 s to the next
 * Tick's hit.
 */
export const STAFF_BLOWS: Readonly<Record<StaffBlow, StaffBlowSpec>> = {
  tick: {
    dur: frame(12),
    hit: frame(5),
    shape: { kind: "jab", near: 8, far: 38, height: 10, y: 12 },
    power: 1,
    kx: 8,
    ky: -10,
    stagger: 0.55,
    feel: { stop: 0.05, shake: [0.08, 1], pitch: 1.2 },
  },
  tock: {
    dur: frame(10),
    hit: frame(5),
    shape: { kind: "arc", radius: 34, a0: 0, a1: -100 * DEG },
    power: 1.1,
    kx: 6,
    ky: -30,
    stagger: 0.6,
    feel: { stop: 0.07, shake: [0.11, 1.5], pitch: 1 },
  },
  toll: {
    dur: frame(18),
    hit: frame(7),
    shape: { kind: "ring", ahead: 18, radius: 30 },
    power: 1.45,
    kx: 15,
    ky: -20,
    lift: -110,
    stagger: 0.7,
    feel: { stop: 0.11, shake: [0.2, 2.6], pitch: 0.75 },
  },
  pendant: {
    dur: frame(12),
    hit: frame(5),
    shape: { kind: "arc", radius: 30, a0: -20 * DEG, a1: 100 * DEG },
    power: 0.95,
    kx: 30,
    ky: 80,
    feel: { stop: 0.06, shake: [0.1, 1.3], pitch: 1.1 },
  },
};

/** the ground string's order */
export const STAFF_STRING: readonly StaffBlow[] = ["tick", "tock", "toll"];

/** an echo's hit-stop, shake and pitch: lighter than any blow */
export const ECHO_FEEL: HitFeel = {
  stop: 0.02,
  shake: [0.06, 1.2],
  pitch: 1.35,
};

/** seconds after a blow ends in which J carries the string on */
export const STAFF_LINK = 0.35;

/** Pendant Strikes per airtime */
export const PENDANTS_PER_AIR = 1;

/** the echo: every blow repeats this long after its hit frame, at this share of its power and knockback; on a foe in
 *  her Stillfield or stopped it hits at `still` */
export const ECHO = { delay: 0.5, power: 0.5, knock: 0.5, still: 1 } as const;

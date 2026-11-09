import type { StaffBlow } from "../../types/mirel";
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
  stagger?: number;
  stun?: number;
  /** a hit lifts a minion this fast */
  lift?: number;
  /** hit-stop when it lands */
  stop?: number;
}

/** where her blows strike from, above her feet */
export const SHOULDER_Y = 18;

const DEG = Math.PI / 180;

/** Tick, Tock and Toll on the floor, and Pendant Strike in the air */
export const STAFF_BLOWS: Readonly<Record<StaffBlow, StaffBlowSpec>> = {
  tick: {
    dur: frame(9),
    hit: frame(4),
    shape: { kind: "jab", near: 8, far: 38, height: 10, y: 12 },
    power: 0.9,
    kx: 50,
    ky: -10,
    stagger: 0.3,
  },
  tock: {
    dur: frame(11),
    hit: frame(5),
    shape: { kind: "arc", radius: 34, a0: 0, a1: -100 * DEG },
    power: 1.0,
    kx: 30,
    ky: -70,
    lift: -120,
  },
  toll: {
    dur: frame(16),
    hit: frame(7),
    shape: { kind: "ring", ahead: 18, radius: 30 },
    power: 1.3,
    kx: 120,
    ky: -20,
    stun: 0.3,
    stop: 0.05,
  },
  pendant: {
    dur: frame(10),
    hit: frame(4),
    shape: { kind: "arc", radius: 30, a0: -20 * DEG, a1: 100 * DEG },
    power: 0.8,
    kx: 30,
    ky: 80,
  },
};

/** the ground string's order */
export const STAFF_STRING: readonly StaffBlow[] = ["tick", "tock", "toll"];

/** seconds after a blow ends in which J carries the string on */
export const STAFF_LINK = 0.35;

/** Pendant Strikes per airtime */
export const PENDANTS_PER_AIR = 1;

/** the echo: every blow repeats this long after its hit frame, at this share of its power and knockback; on a foe in
 *  her Stillfield or stopped it hits at `still` */
export const ECHO = { delay: 0.5, power: 0.5, knock: 0.5, still: 1 } as const;

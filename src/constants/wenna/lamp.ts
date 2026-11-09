import type { LampBlow } from "../../types/wenna";
import { frame } from "../hero";

/**
 * Where one lamp blow strikes, from her shoulder (`SHOULDER_Y` above her feet), facing right with up negative: a straight
 * jab between two distances ahead (its middle `y` above her feet), an arc of a radius swept between two angles (radians,
 * 0 straight ahead, -PI/2 straight up), or a cone of flame between two distances ahead within a half angle.
 */
export type LampShape =
  | { kind: "jab"; near: number; far: number; height: number; y: number }
  | { kind: "arc"; radius: number; a0: number; a1: number }
  | { kind: "cone"; near: number; far: number; half: number };

/** one blow of her lamp string */
export interface LampBlowSpec {
  dur: number;
  hit: number;
  shape: LampShape;
  /** damage as a multiple of attack damage, and of ability power */
  power: number;
  spell: number;
  kx: number;
  ky: number;
  stagger?: number;
  /** hit-stop when it lands */
  stop?: number;
}

/** where her blows strike from, above her feet */
export const SHOULDER_Y = 17;

const DEG = Math.PI / 180;

/** Tap, Swing and Flare on the floor, and Lamp Drop in the air */
export const LAMP_BLOWS: Readonly<Record<LampBlow, LampBlowSpec>> = {
  tap: {
    dur: frame(9),
    hit: frame(4),
    shape: { kind: "jab", near: 8, far: 30, height: 10, y: 12 },
    power: 0.8,
    spell: 0,
    kx: 40,
    ky: -10,
    stagger: 0.25,
  },
  swing: {
    dur: frame(11),
    hit: frame(5),
    shape: { kind: "arc", radius: 30, a0: 50 * DEG, a1: 0 },
    power: 0.9,
    spell: 0,
    kx: 60,
    ky: -30,
  },
  flare: {
    dur: frame(15),
    hit: frame(7),
    shape: { kind: "cone", near: 12, far: 46, half: 30 * DEG },
    power: 0.6,
    spell: 0.6,
    kx: 90,
    ky: -30,
    stop: 0.04,
  },
  drop: {
    dur: frame(10),
    hit: frame(4),
    shape: { kind: "arc", radius: 26, a0: -20 * DEG, a1: 100 * DEG },
    power: 0.8,
    spell: 0,
    kx: 30,
    ky: 70,
  },
};

/** the ground string's order */
export const LAMP_STRING: readonly LampBlow[] = ["tap", "swing", "flare"];

/** seconds after a blow ends in which J carries the string on */
export const LAMP_LINK = 0.35;

/** Lamp Drops per airtime */
export const DROPS_PER_AIR = 1;

/** the Quarry: seconds it lasts, and the Flare's call to every Wick this near its first foe */
export const QUARRY = { life: 4, flareCall: 100 } as const;

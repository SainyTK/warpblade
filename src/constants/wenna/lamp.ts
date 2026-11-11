import type { HitFeel } from "../../types/move";
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
  /** seconds a struck minion staggers; each blow before the last holds it until the next one lands */
  stagger: number;
  /** the finisher throws the foe off its feet this fast, up */
  launch?: number;
  /** hit-stop, screen shake and sound pitch on contact, growing through the string */
  feel: HitFeel;
}

/** where her blows strike from, above her feet */
export const SHOULDER_Y = 17;

const DEG = Math.PI / 180;

/**
 * Tap, Swing and Flare on the floor, and Lamp Drop in the air. Each ground blow holds a wind-up of three calm frames
 * before its hit frame. Tap to Swing takes 0.5 s on screen, Swing to Flare 0.58 s, and the Flare is the heaviest: it
 * throws the foe off its feet and keeps it down until the next string's Tap lands.
 */
export const LAMP_BLOWS: Readonly<Record<LampBlow, LampBlowSpec>> = {
  tap: {
    dur: frame(11),
    hit: frame(5),
    shape: { kind: "jab", near: 8, far: 30, height: 10, y: 12 },
    power: 0.88,
    spell: 0,
    kx: 15,
    ky: -10,
    stagger: 0.5,
    feel: { stop: 0.045, shake: [0.08, 1], pitch: 1.2 },
  },
  swing: {
    dur: frame(11),
    hit: frame(5),
    shape: { kind: "arc", radius: 30, a0: 50 * DEG, a1: 0 },
    power: 0.99,
    spell: 0,
    kx: 20,
    ky: -30,
    stagger: 0.55,
    feel: { stop: 0.055, shake: [0.11, 1.4], pitch: 1 },
  },
  flare: {
    dur: frame(16.5),
    hit: frame(6.5),
    shape: { kind: "cone", near: 12, far: 46, half: 30 * DEG },
    power: 0.66,
    spell: 0.66,
    kx: 6,
    ky: -30,
    stagger: 0.6,
    launch: -170,
    feel: { stop: 0.12, shake: [0.22, 2.6], pitch: 0.8 },
  },
  drop: {
    dur: frame(12),
    hit: frame(5),
    shape: { kind: "arc", radius: 26, a0: -20 * DEG, a1: 100 * DEG },
    power: 0.8,
    spell: 0,
    kx: 30,
    ky: 70,
    stagger: 0.45,
    feel: { stop: 0.06, shake: [0.1, 1.2], pitch: 1.05 },
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

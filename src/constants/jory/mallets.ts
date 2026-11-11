import type { MalletBlow } from "../../types/jory";
import type { HitFeel } from "../../types/move";
import { frame } from "../hero";

/** a blow's shape: a box between two distances ahead, from `low` to `high` above his feet */
export interface MalletBox {
  near: number;
  far: number;
  low: number;
  high: number;
}

/** a knockdown: a short throw that drops a minion on its back, where it lies stunned */
export const KNOCKDOWN = -120;

/** one blow of his mallets, timed in clip frames at 96 beats a minute */
export interface MalletBlowSpec {
  dur: number;
  /** the hit frames: Roll strikes twice */
  hits: readonly number[];
  box: MalletBox;
  /** damage as a multiple of attack damage, for each hit */
  power: number;
  kx: number;
  /** breaks a guard and a wind-up */
  heavy?: boolean;
  /** throws a minion up this fast (negative is up) */
  launch?: number;
  /** hit-stop, shake and the pitch of the hit sound when it lands */
  feel: HitFeel;
}

/**
 * Every blow of his mallets. A blow played through lasts one beat at any tier (Crash a beat and a quarter), and each
 * hit frame comes early, so the impact lands close to the beat the player pressed on.
 */
export const MALLET_BLOWS: Readonly<Record<MalletBlow, MalletBlowSpec>> = {
  tap: {
    dur: frame(15),
    hits: [frame(2)],
    box: { near: 6, far: 26, low: 4, high: 30 },
    power: 0.95,
    kx: 6,
    feel: { stop: 0.05, shake: [0.06, 1], pitch: 1.2 },
  },
  roll: {
    dur: frame(15),
    hits: [frame(2), frame(5)],
    box: { near: 6, far: 26, low: 4, high: 30 },
    power: 0.55,
    kx: 4,
    feel: { stop: 0.04, shake: [0.05, 1], pitch: 1.3 },
  },
  crash: {
    dur: frame(19),
    hits: [frame(3)],
    box: { near: 4, far: 44, low: 0, high: 36 },
    power: 1.45,
    kx: 60,
    heavy: true,
    launch: KNOCKDOWN,
    feel: { stop: 0.12, shake: [0.2, 3], pitch: 0.75 },
  },
  kick: {
    dur: frame(15),
    hits: [frame(3)],
    box: { near: 4, far: 28, low: 0, high: 30 },
    power: 1.2,
    kx: 20,
    launch: -190,
    feel: { stop: 0.08, shake: [0.12, 2], pitch: 0.95 },
  },
  downstroke: {
    dur: frame(12),
    hits: [frame(4)],
    box: { near: 4, far: 22, low: -30, high: 4 },
    power: 1.1,
    kx: 20,
    feel: { stop: 0.06, shake: [0.08, 1.5], pitch: 1 },
  },
};

/** his string on the floor: the same three blows in the same order every time */
export const MALLET_STRING: readonly MalletBlow[] = ["tap", "roll", "crash"];

/** the share of a blow's clip after which the next J may start the next blow; Crash's next string starts at one beat */
export const MALLET_CANCEL = 0.8;
export const CRASH_CANCEL = frame(15);

/** the share of a beat after a blow ends in which J carries the string on */
export const MALLET_LINK = 0.6;

/** Accents: how much harder a blow started on the beat lands, and at Crescendo */
export const ACCENT = { power: 1.4, crescendo: 1.6 } as const;

/** Crash's cone reaches further at tier 2, and its sound wave along the floor from tier 3 */
export const CRASH_REACH = [44, 54, 54, 54] as const;
export const CRASH_WAVE = {
  speed: 300,
  /** reach and power (attack damage) at tier 3 and at Crescendo */
  reach: [0, 0, 90, 150],
  power: [0, 0, 0.6, 0.8],
  height: 20,
} as const;

/** Downstroke: on the beat it bounces him this far up */
export const DOWNSTROKE = { bounce: 18, fall: 220 } as const;

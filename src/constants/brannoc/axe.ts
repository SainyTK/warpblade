import type { AxeBlow } from "../../types/brannoc";
import type { HitFeel } from "../../types/move";
import { frame } from "../hero";

/** a blow's shape: a box from `near` to `far` ahead of him (negative is behind), from `low` to `high` above his feet */
export interface AxeBox {
  near: number;
  far: number;
  low: number;
  high: number;
}

/** a knockdown: a short throw that drops a minion on its back, where it lies stunned */
export const KNOCKDOWN = -120;

/** one blow of his great axe, timed in clip frames at 30 a game second */
export interface AxeBlowSpec {
  dur: number;
  /** the hit frames: the Bloodied Cleave strikes twice */
  hits: readonly number[];
  /** the frame from which a kept J starts the next blow */
  next: number;
  box: AxeBox;
  /** damage as a multiple of attack damage, for each hit */
  power: readonly number[];
  /** knockback for each hit, toward his front for Reave and away from him for the rest */
  kx: readonly number[];
  /** breaks a guard and a wind-up */
  heavy?: boolean;
  /** throws a minion up this fast on the first hit (negative is up) */
  launch?: number;
  /** hit-stop, shake and the pitch of the hit sound for each hit */
  feel: readonly HitFeel[];
}

/** hit feel of his blows: the plan's numbers, not the shared presets */
const FIRM: HitFeel = { stop: 0.08, shake: [0.12, 1.5], pitch: 0.9 };
const SWEEP: HitFeel = { stop: 0.07, shake: [0.1, 1.2], pitch: 0.95 };
const CRUSH: HitFeel = { stop: 0.13, shake: [0.24, 3], pitch: 0.6 };
const SECOND_SPIN: HitFeel = { stop: 0.09, shake: [0.16, 2], pitch: 0.7 };
const HATCHET: HitFeel = { stop: 0.07, shake: [0.1, 1.5], pitch: 0.85 };
const CHOP: HitFeel = { stop: 0.07, shake: [0.1, 1.2], pitch: 0.9 };

/** the Cleave's reach on each side of him */
export const CLEAVE_REACH = 36;

/**
 * Every blow of his great axe. Hew and Reave load long and land early in the second half; the Cleave has the longest load
 * in his kit and spins a full turn on its hit frame.
 */
export const AXE_BLOWS: Readonly<Record<AxeBlow | "bloodiedCleave", AxeBlowSpec>> = {
  hew: {
    dur: frame(18),
    hits: [frame(8)],
    next: frame(13),
    box: { near: 8, far: 30, low: 0, high: 40 },
    power: [1.15],
    kx: [12],
    feel: [FIRM],
  },
  reave: {
    dur: frame(18),
    hits: [frame(7)],
    next: frame(13),
    box: { near: -14, far: 32, low: 4, high: 30 },
    power: [1],
    kx: [16],
    feel: [SWEEP],
  },
  cleave: {
    dur: frame(26),
    hits: [frame(11)],
    next: frame(22),
    box: { near: -CLEAVE_REACH, far: CLEAVE_REACH, low: 0, high: 36 },
    power: [1.9],
    kx: [70],
    heavy: true,
    launch: KNOCKDOWN,
    feel: [CRUSH],
  },
  bloodiedCleave: {
    dur: frame(32),
    hits: [frame(11), frame(17)],
    next: frame(28),
    box: { near: -CLEAVE_REACH, far: CLEAVE_REACH, low: 0, high: 36 },
    power: [1.9, 0.8],
    kx: [70, 30],
    heavy: true,
    launch: KNOCKDOWN,
    feel: [CRUSH, SECOND_SPIN],
  },
  hatchet: {
    dur: frame(14),
    hits: [frame(6)],
    next: frame(14),
    box: { near: 4, far: 24, low: -30, high: 6 },
    power: [1.2],
    kx: [20],
    heavy: true,
    feel: [HATCHET],
  },
  huntChop: {
    dur: frame(10),
    hits: [frame(3)],
    next: frame(10),
    box: { near: 4, far: 26, low: 0, high: 34 },
    power: [0.8],
    kx: [10],
    feel: [CHOP],
  },
};

/** his string on the floor: the same three blows in the same order every time */
export const AXE_STRING: readonly AxeBlow[] = ["hew", "reave", "cleave"];

/** seconds after a blow ends in which J carries the string on */
export const AXE_LINK = 0.3;

/** Reave sweeps a foe behind him round to this far in front */
export const REAVE_SWEEP = 12;

/** Hatchet Drop falls this fast once it strikes */
export const HATCHET_FALL = 240;

/** the crack decal the Cleave leaves: its width, and how long it fades */
export const CLEAVE_CRACK = { width: 12, life: 0.6 } as const;

/** Spinning Reap: each extra turn of a Cleave lasts this long */
export const REAP_TURN = frame(6);

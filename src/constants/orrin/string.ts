import type { HitFeel } from "../../types/move";
import type { ChainBlow } from "../../types/orrin";
import { frame } from "../hero";

/**
 * One blow of his chain string. The chain sweeps an arc round his shoulder: a foe between `inner` and `reach` pixels
 * from it, at an angle inside the arc, is struck. The last `TIP_BAND` pixels of the reach are the tip, which deals
 * `tipPower` times attack damage; closer in the chain deals `innerPower`.
 * Angles are in radians facing right with up negative: 0 is straight ahead, -PI/2 straight up.
 */
export interface ChainBlowSpec {
  /** the whole clip, recovery to his stance included, when no press carries the string on */
  dur: number;
  /** the first and last frame the chain strikes on; a quick blow strikes on one frame */
  hit: number;
  hitEnd: number;
  /** a string blow: a press already made starts the next blow from this frame, out of the follow-through */
  link?: number;
  inner: number;
  reach: number;
  /** the arc swept, from `a0` to `a1`; a full turn covers every angle */
  a0: number;
  a1: number;
  tipPower: number;
  innerPower: number;
  kx: number;
  ky: number;
  /** a tip hit's hook catches the foe and drags it toward him this fast, in place of `kx` */
  pull?: number;
  stagger?: number;
  stun?: number;
  /** a tip hit lifts a minion this fast */
  lift?: number;
  /** breaks a guard on a tip hit */
  breaks?: boolean;
  /** hit-stop, shake and sound on contact; a tip hit adds `TIP_FEEL` */
  feel: HitFeel;
}

/** the last pixels of every blow's reach: the tip */
export const TIP_BAND = 18;

/** where the chain sweeps from, above his feet */
export const SHOULDER_Y = 18;

/** the chain's whoosh starts this long before a blow's hit frame, as it whips out of the wind-up */
export const WHOOSH_LEAD = frame(2);

/** what a tip hit adds to a blow's feel: more shake, a higher ring */
export const TIP_FEEL = { shake: 0.5, pitch: 0.12 } as const;

const DEG = Math.PI / 180;

/**
 * The string's blows. Each winds up for four frames against the blow, snaps on its hit frame, holds, and follows
 * through to its `link` frame; a press made by then starts the next blow there, and without one the clip settles back
 * to his stance by `dur`. The hit feel grows through the string to Full Circle, which trips the foe flat.
 */
export const CHAIN_BLOWS: Readonly<Record<ChainBlow, ChainBlowSpec>> = {
  lash: {
    dur: frame(16),
    hit: frame(7),
    hitEnd: frame(7),
    link: frame(11),
    inner: 0,
    reach: 64,
    a0: -20 * DEG,
    a1: 10 * DEG,
    tipPower: 1.1,
    innerPower: 0.55,
    kx: 30,
    ky: -10,
    pull: 110,
    stagger: 0.6,
    feel: { stop: 0.06, shake: [0.1, 1.2], pitch: 1.15 },
  },
  rising: {
    dur: frame(18),
    hit: frame(7),
    hitEnd: frame(8),
    link: frame(11),
    inner: 0,
    reach: 62,
    a0: 30 * DEG,
    a1: -120 * DEG,
    tipPower: 1.2,
    innerPower: 0.6,
    kx: 20,
    ky: -80,
    lift: -140,
    stagger: 0.65,
    feel: { stop: 0.08, shake: [0.13, 1.6], pitch: 0.98 },
  },
  circle: {
    dur: frame(28),
    hit: frame(8),
    hitEnd: frame(14),
    link: frame(16),
    inner: 0,
    reach: 60,
    a0: 0,
    a1: Math.PI * 2,
    tipPower: 1.5,
    innerPower: 0.6,
    kx: 70,
    ky: -30,
    stun: 0.8,
    breaks: true,
    feel: { stop: 0.13, shake: [0.22, 2.8], pitch: 0.72 },
  },
};

/** the ground string, the same three blows in the same order every time */
export const CHAIN_STRING: readonly ChainBlow[] = ["lash", "rising", "circle"];

/** seconds after a blow ends in which J carries the string on */
export const CHAIN_LINK = 0.35;

/** J in the air: the Hanging Arc, a downward sweep ahead, one per airtime and one more for each latch */
export const HANGING_ARC: ChainBlowSpec = {
  dur: frame(15),
  hit: frame(7),
  hitEnd: frame(8),
  inner: 8,
  reach: 54,
  a0: -40 * DEG,
  a1: 80 * DEG,
  tipPower: 1.0,
  innerPower: 0.5,
  kx: 40,
  ky: 90,
  feel: { stop: 0.07, shake: [0.1, 1.4], pitch: 1.02 },
};

/** at 50 Momentum or more every blow reaches this much further, its tip band with it */
export const MOMENTUM_REACH = 8;

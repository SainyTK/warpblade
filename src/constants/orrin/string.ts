import type { ChainBlow } from "../../types/orrin";
import { frame } from "../hero";

/**
 * One blow of his chain string. The chain sweeps an arc round his shoulder: a foe between `inner` and `reach` pixels
 * from it, at an angle inside the arc, is struck. The last `TIP_BAND` pixels of the reach are the tip, which deals
 * `tipPower` times attack damage; closer in the chain deals `innerPower`.
 * Angles are in radians facing right with up negative: 0 is straight ahead, -PI/2 straight up.
 */
export interface ChainBlowSpec {
  dur: number;
  /** the first and last frame the chain strikes on; a quick blow strikes on one frame */
  hit: number;
  hitEnd: number;
  inner: number;
  reach: number;
  /** the arc swept, from `a0` to `a1`; a full turn covers every angle */
  a0: number;
  a1: number;
  tipPower: number;
  innerPower: number;
  kx: number;
  ky: number;
  stagger?: number;
  stun?: number;
  /** a tip hit lifts a minion this fast */
  lift?: number;
  /** hit-stop on a tip hit */
  stop?: number;
  /** breaks a guard on a tip hit */
  breaks?: boolean;
}

/** the last pixels of every blow's reach: the tip */
export const TIP_BAND = 18;

/** where the chain sweeps from, above his feet */
export const SHOULDER_Y = 18;

const DEG = Math.PI / 180;

/** the string's blows and the knee that stands in for the lash up close */
export const CHAIN_BLOWS: Readonly<Record<ChainBlow, ChainBlowSpec>> = {
  lash: {
    dur: frame(10),
    hit: frame(5),
    hitEnd: frame(5),
    inner: 12,
    reach: 64,
    a0: -20 * DEG,
    a1: 10 * DEG,
    tipPower: 1.1,
    innerPower: 0.55,
    kx: 60,
    ky: -10,
    stagger: 0.35,
  },
  knee: {
    dur: frame(9),
    hit: frame(4),
    hitEnd: frame(4),
    inner: 0,
    reach: 20,
    a0: -60 * DEG,
    a1: 40 * DEG,
    tipPower: 0.7,
    innerPower: 0.7,
    kx: 160,
    ky: -20,
    stagger: 0.4,
  },
  rising: {
    dur: frame(12),
    hit: frame(6),
    hitEnd: frame(7),
    inner: 10,
    reach: 56,
    a0: 30 * DEG,
    a1: -120 * DEG,
    tipPower: 1.2,
    innerPower: 0.6,
    kx: 30,
    ky: -80,
    lift: -140,
  },
  circle: {
    dur: frame(18),
    hit: frame(6),
    hitEnd: frame(12),
    inner: 8,
    reach: 58,
    a0: 0,
    a1: Math.PI * 2,
    tipPower: 1.5,
    innerPower: 0.6,
    kx: 200,
    ky: -30,
    stun: 0.4,
    stop: 0.06,
    breaks: true,
  },
};

/** the ground string's order from the start; the knee takes the lash's place when a foe is right against him */
export const CHAIN_STRING: readonly ChainBlow[] = ["lash", "rising", "circle"];

/** a foe ahead this close turns the lash into the knee */
export const KNEE_RANGE = 18;

/** seconds after a blow ends in which J carries the string on */
export const CHAIN_LINK = 0.35;

/** J in the air: the Hanging Arc, a downward sweep ahead, one per airtime and one more for each latch */
export const HANGING_ARC: ChainBlowSpec = {
  dur: frame(11),
  hit: frame(5),
  hitEnd: frame(6),
  inner: 8,
  reach: 54,
  a0: -40 * DEG,
  a1: 80 * DEG,
  tipPower: 1.0,
  innerPower: 0.5,
  kx: 40,
  ky: 90,
};

/** at 50 Momentum or more every blow reaches this much further, its tip band with it */
export const MOMENTUM_REACH = 8;

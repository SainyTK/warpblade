import type { SlashShape } from "../../types/effect";
import type { FistBlow } from "../../types/hulda";
import type { HitFeel } from "../../types/move";
import { FEEL } from "../combo";
import { frame } from "../hero";

/** a step she takes into a blow: the distance her feet cover from one clip time to another, at an even speed */
export interface FistStep {
  from: number;
  to: number;
  distance: number;
}

/** one blow of her fist string: its clip times and what it does to the foe */
export interface FistSpec {
  /** the clip's whole length, settled back to her guard */
  dur: number;
  hit: number;
  /** from this time a queued J starts the next blow, from the pose the follow-through has reached */
  next: number;
  /** the box ahead of her feet the fist passes through */
  box: readonly [number, number, number, number];
  /** the arc a big blow leaves behind, in her ramp */
  arc?: SlashShape;
  /** the step into the blow; without one her feet stay planted */
  step?: FistStep;
  /** damage as a multiple of attack damage */
  power: number;
  /** knockback and lift; the knockback only nudges a foe, so it stays in reach of the next blow */
  kx: number;
  ky: number;
  /** seconds a minion staggers, long enough to reach the next blow; 0 leaves it to the blow's stun */
  stagger: number;
  /** seconds a minion lies knocked down */
  stun?: number;
  heavy?: boolean;
  /** hit-stop, shake and pitch, heavier with each blow of the string */
  feel: HitFeel;
}

/** straight blows reach this box ahead of her feet at head height: the shortest reach in the game */
const STRAIGHT = [2, -22, 16, -8] as const;
/** the hook comes from the rear hip and carries through the body, so it reaches past where the jab pushed the foe */
const HOOK = [2, -22, 20, -6] as const;
/**
 * The overhand haymaker travels up through the space over her head, so its box reaches as high as the fist goes; this
 * is how her string touches a flier hovering over her, reaching just past the hook.
 */
const OVERHAND = [0, -42, 22, -8] as const;

/**
 * The string's three blows. Each lands about 0.6 to 0.75 real seconds after the last when J is pressed in time, and
 * the haymaker comes slowest and hits hardest. The jab and hook nudge the foe under 2 px and stagger it until the
 * next blow; the haymaker steps in by as much as the string pushed and knocks the foe down until the next string's jab.
 */
export const FISTS: Record<FistBlow, FistSpec> = {
  jab: {
    dur: frame(16),
    hit: frame(5),
    next: frame(11),
    box: STRAIGHT,
    power: 1.2,
    kx: 16,
    ky: -10,
    stagger: 0.55,
    feel: FEEL.light,
  },
  hook: {
    dur: frame(20),
    hit: frame(8),
    next: frame(13),
    box: HOOK,
    power: 1.7,
    kx: 22,
    ky: -20,
    stagger: 0.6,
    /** the body hook breaks a guard, so her short string can open a blocking foe */
    heavy: true,
    feel: FEEL.firm,
  },
  haymaker: {
    dur: frame(26),
    hit: frame(10),
    next: frame(21),
    box: OVERHAND,
    /** the front foot steps in as the overhand falls, carrying her after the foe the string nudged back */
    step: { from: frame(9), to: frame(12), distance: 9 },
    arc: { cx: 3, cy: -24, R: 17, sy: 0.85, rot: 0, a0: -2.5, a1: 0.45, W: 6, sweep: 0.04, trail: 0.16 },
    power: 3.67,
    kx: 55,
    ky: -60,
    stagger: 0,
    stun: 0.8,
    heavy: true,
    feel: FEEL.crush,
  },
};

/** the string's order from the start */
export const STRING: readonly FistBlow[] = ["jab", "hook", "haymaker"];

/** the haymaker's wind-up is armoured from this point until its hit */
export const HAYMAKER_ARMOUR = frame(2);

/** seconds after a blow ends in which J carries the string on */
export const STRING_LINK = 0.35;

/** J in the air: one hammer fist down, once per airtime; the fists hang overhead three frames before they fall */
export const HAMMER = {
  dur: frame(16),
  hit: frame(6),
  box: [0, -10, 16, 8] as const,
  power: 0.9,
  feel: FEEL.firm,
} as const;

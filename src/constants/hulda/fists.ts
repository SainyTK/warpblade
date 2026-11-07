import type { SlashShape } from "../../types/effect";
import type { FistBlow } from "../../types/hulda";
import { frame } from "../hero";

/** one blow of her fist string: its clip length, its hit frame and what it does to the foe */
export interface FistSpec {
  dur: number;
  hit: number;
  /** the box ahead of her feet the fist passes through */
  box: readonly [number, number, number, number];
  /** the arc a big blow leaves behind, in her ramp */
  arc?: SlashShape;
  /** she steps in this fast (pixels a second, slowing on the floor) this long into the blow; 0 keeps her planted */
  step: number;
  stepAt: number;
  /** damage as a multiple of attack damage */
  power: number;
  kx: number;
  ky: number;
  stagger?: number;
  stun?: number;
  launch?: number;
  heavy?: boolean;
  /** hit-stop and screen shake when it lands, over the usual light feel */
  stop?: number;
  shake?: readonly [number, number];
}

/** straight blows reach this box ahead of her feet at head height: the shortest reach in the game */
const STRAIGHT = [2, -22, 16, -8] as const;
/**
 * The overhand haymaker travels up through the space over her head, so their boxes reach as high as the
 * fist goes; this is how her string touches a flier hovering over her, still no further ahead than her jab.
 */
const OVERHAND = [0, -42, 18, -8] as const;

/** the string's three blows */
export const FISTS: Record<FistBlow, FistSpec> = {
  jab: { dur: frame(8), hit: frame(3), box: STRAIGHT, step: 0, stepAt: 0, power: 0.6, kx: 40, ky: -10, stagger: 0.3 },
  hook: {
    dur: frame(11),
    hit: frame(5),
    box: STRAIGHT,
    step: 0,
    stepAt: 0,
    power: 0.9,
    kx: 90,
    ky: -20,
    stagger: 0.6,
  },
  haymaker: {
    dur: frame(16),
    hit: frame(8),
    box: OVERHAND,
    /** the lunge that carries the overhand into a foe the string has pushed back */
    step: 130,
    stepAt: frame(7),
    arc: { cx: 3, cy: -24, R: 17, sy: 0.85, rot: 0, a0: -2.5, a1: 0.45, W: 6, sweep: 0.04, trail: 0.16 },
    power: 1.5,
    kx: 240,
    ky: -60,
    stun: 0.5,
    heavy: true,
    stop: 0.07,
    shake: [0.18, 2],
  },
};

/** the string's order from the start */
export const STRING: readonly FistBlow[] = ["jab", "hook", "haymaker"];

/** the haymaker's wind-up is armoured from this point until its hit */
export const HAYMAKER_ARMOUR = frame(2);

/** seconds after a blow ends in which J carries the string on */
export const STRING_LINK = 0.35;

/** J in the air: one hammer fist down, once per airtime */
export const HAMMER = { dur: frame(10), hit: frame(4), box: [0, -10, 16, 8] as const, power: 0.9 } as const;

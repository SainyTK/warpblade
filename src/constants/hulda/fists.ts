import type { FistBlow } from "../../types/hulda";
import { frame } from "../hero";

/** one blow of her fist string: its clip length, its hit frame and what it does to the foe */
export interface FistSpec {
  dur: number;
  hit: number;
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

/** every fist blow reaches this box ahead of her feet: the shortest reach in the game */
export const FIST_BOX = [2, -22, 16, -8] as const;

/** the string from the start, then what Uppercut and Knuckle Rush add after the haymaker */
export const FISTS: Record<FistBlow, FistSpec> = {
  jab: { dur: frame(8), hit: frame(3), power: 0.55, kx: 40, ky: -10, stagger: 0.3 },
  cross: { dur: frame(9), hit: frame(3), power: 0.65, kx: 60, ky: -10 },
  hook: { dur: frame(11), hit: frame(5), power: 0.85, kx: 90, ky: -20, stagger: 0.6 },
  haymaker: {
    dur: frame(16),
    hit: frame(8),
    power: 1.4,
    kx: 240,
    ky: -60,
    stun: 0.5,
    heavy: true,
    stop: 0.07,
    shake: [0.18, 2],
  },
  uppercut: { dur: frame(14), hit: frame(6), power: 1.2, kx: 40, ky: 0, launch: -300, heavy: true },
  /** one of the knuckle rush's punches; `KNUCKLES` sets how many and how fast */
  knuckles: { dur: frame(3), hit: frame(1), power: 0.35, kx: 30, ky: -5, stagger: 0.3 },
};

/** the string's order from the start */
export const STRING: readonly FistBlow[] = ["jab", "cross", "hook", "haymaker"];

/** Knuckle Rush: J held as the haymaker ends throws this many punches, this many seconds apart */
export const KNUCKLES = { count: 6, every: 0.08 } as const;

/** the haymaker's wind-up is armoured from this point until its hit */
export const HAYMAKER_ARMOUR = frame(2);

/** seconds after a blow ends in which J carries the string on */
export const STRING_LINK = 0.35;

/** J in the air: one hammer fist down, once per airtime */
export const HAMMER = { dur: frame(10), hit: frame(4), box: [0, -10, 16, 8] as const, power: 0.9 } as const;

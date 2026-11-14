import type { HitFeel } from "../../../types/move";

/**
 * Seconds after each blow of Yun's ground string before the next may cut in, so the cut shows its follow-through first.
 * With the wind-ups this sets a tempo of about 0.45 real seconds a blow and 0.6 from Returning Tide to the next string.
 */
export const STRING_CANCEL = {
  willowCut: 0.11,
  turningLeaf: 0.11,
  craneWheel: 0.1,
  finisher: 0.15,
} as const;

/** each blow's power as a multiple of attack damage */
export const STRING_POWER = {
  willowCut: 0.95,
  turningLeaf: 1,
  craneWheel: 1.15,
  returningTide: 2.1,
  driftingCut: 0.9,
  fallingPetal: 1.05,
} as const;

/** hit-stop, shake and sound of each blow, growing to Returning Tide */
export const STRING_FEEL = {
  willowCut: { stop: 0.055, shake: [0.1, 1.1], pitch: 1.2 },
  turningLeaf: { stop: 0.06, shake: [0.11, 1.3], pitch: 1.1 },
  craneWheel: { stop: 0.07, shake: [0.13, 1.6], pitch: 1 },
  returningTide: { stop: 0.15, shake: [0.26, 3], pitch: 0.7 },
  air: { stop: 0.055, shake: [0.1, 1.2], pitch: 1.15 },
} as const satisfies Record<string, HitFeel>;

/** seconds after an air blow before the next may cut in */
export const AIR_CANCEL = 0.07;
/** air cuts per jump */
export const AIR_LIMIT = 2;

/** Returning Tide's qi crescent along the floor: it runs `reach` pixels at `speed` and cuts each foe once for `power`
 *  times attack damage, `half` pixels tall each way; High Tide's throws foes up at `launch` and its second crescent
 *  follows `twinDelay` seconds later */
export const TIDE_WAVE = { reach: 60, speed: 240, power: 0.5, half: 7, launch: 180, twinDelay: 0.12 } as const;

/** his fall is floatier: gravity while he falls in a jump, as a share of the shared */
export const FLOAT_FALL = 0.8;

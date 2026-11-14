import type { HitFeel } from "../../../types/move";

/**
 * Seconds after each blow of Calder's string before the next may cut in. With each blow's wind-up this sets his tempo:
 * about 0.5 real seconds from one blow landing to the next, and about 0.65 from Breaker to the next string's Hew, when
 * Breaker closes the combo.
 */
export const STRING_CANCEL = { hew: 0.13, rip: 0.13, breaker: 0.16 } as const;

/** seconds after an air blow before the next may cut in */
export const AIR_CANCEL = 0.07;

/** hit-stop, shake and sound of each blow, growing to Breaker, the heaviest by far */
export const STRING_FEEL = {
  hew: { stop: 0.07, shake: [0.11, 1.4], pitch: 0.95 },
  rip: { stop: 0.075, shake: [0.12, 1.6], pitch: 1.05 },
  breaker: { stop: 0.17, shake: [0.3, 3.6], pitch: 0.6 },
  airHew: { stop: 0.06, shake: [0.1, 1.2], pitch: 1 },
  dropCut: { stop: 0.1, shake: [0.18, 2.4], pitch: 0.8 },
} as const satisfies Record<string, HitFeel>;

/** the power of each blow, as a multiple of attack damage */
export const STRING_POWER = { hew: 1.45, rip: 1.5, breaker: 2.8, airHew: 1.6, dropCut: 1.9 } as const;

/** Breaker's step in, and the speed Drop cut falls at */
export const BREAKER_STEP = 210;
export const DROP_FALL = 330;

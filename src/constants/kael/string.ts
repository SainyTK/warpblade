import type { HitFeel } from "../../types/move";

/**
 * Seconds after each blow of Kael's ground string before the next may cut in, so the blow holds its strike and shows
 * its follow-through first. With the next blow's wind-up this sets the tempo: about 0.45 real seconds from one blow
 * landing to the next, about 0.5 into the smash, and about 0.6 from the smash to the next string's step cut, when the
 * smash closes the combo.
 */
export const STRING_CANCEL = {
  stepCut: 0.12,
  risingBackhand: 0.12,
  twinFang: 0.08,
  /** the last blow, whichever finisher it is: past this the combo is closed and J starts the next string */
  finisher: 0.145,
} as const;

/** Hit-stop, shake and sound of each blow of the ground string, growing to the smash, the heaviest by far. */
export const STRING_FEEL = {
  stepCut: { stop: 0.06, shake: [0.1, 1.2], pitch: 1.15 },
  risingBackhand: { stop: 0.065, shake: [0.11, 1.4], pitch: 1.05 },
  twinFangFirst: { stop: 0.045, shake: [0.06, 1], pitch: 1.2 },
  twinFangSecond: { stop: 0.075, shake: [0.14, 1.8], pitch: 0.95 },
  smash: { stop: 0.16, shake: [0.28, 3.4], pitch: 0.65 },
} as const satisfies Record<string, HitFeel>;

/** seconds after a blow of the air string before the next may cut in, so its strike holds and its follow-through shows */
export const AIR_CANCEL = 0.06;

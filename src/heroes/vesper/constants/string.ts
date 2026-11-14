import type { HitFeel } from "../../../types/move";

/**
 * Seconds after the second blow of each press before the next press may cut in. With the next press's wind-up this sets
 * the fastest string in the roster: about 0.25 real seconds between blows inside a press and about 0.45 from one press
 * to the next, before Tempo makes it quicker still.
 */
export const STRING_CANCEL = {
  duskCross: 0.07,
  risingPair: 0.07,
  scissorTurn: 0.06,
  /** the last press: past this the combo is closed and J starts the next string, or the air string while she rises */
  finisher: 0.1,
} as const;

/** seconds after an air blow before the next may cut in */
export const AIR_CANCEL = 0.05;

/** hit-stop, shake and sound of her blows: short and light, so the pace stays high, with the launch the heaviest */
export const STRING_FEEL = {
  long: { stop: 0.045, shake: [0.08, 1.1], pitch: 1.1 },
  short: { stop: 0.03, shake: [0.05, 0.8], pitch: 1.35 },
  scissor: { stop: 0.05, shake: [0.09, 1.3], pitch: 1.05 },
  launch: { stop: 0.12, shake: [0.2, 2.6], pitch: 0.8 },
  dive: { stop: 0.13, shake: [0.24, 3], pitch: 0.7 },
} as const satisfies Record<string, HitFeel>;

/** the leap of the last press: she rises this many pixels on its blow, and throws the foe up this fast */
export const MOONRISE = { rise: 30, launch: -300 } as const;

/** air blows before she lands, with no skill: the longest air string in the roster */
export const AIR_HITS = 4;

/** the nightfall dive drops at this speed after its tuck, and its landing cuts this far to each side */
export const NIGHTFALL = { dive: 480, reach: 34 } as const;

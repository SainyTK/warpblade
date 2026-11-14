import type { HitFeel } from "../../../types/move";

/** The string's blows: the share each deals at once and the share it stores in the foe, as multiples of attack damage */
export const STRING_POWER = {
  drawCut: { now: 0.55, store: 1.35 },
  returnCut: { now: 0.55, store: 1.35 },
  /** the sheathe's click, a short blow ahead before the release */
  sheathe: { now: 0.4 },
  airDraw: { now: 0.6, store: 1.3 },
} as const;

/** seconds after each blow before the next may cut in, so the strike holds and its follow-through shows */
export const STRING_CANCEL = { drawCut: 0.12, returnCut: 0.11, sheathe: 0.16, airDraw: 0.08 } as const;

/** hit-stop, shake and sound of each blow, growing to the sheathe's click */
export const STRING_FEEL = {
  drawCut: { stop: 0.065, shake: [0.1, 1.3], pitch: 1.1 },
  returnCut: { stop: 0.065, shake: [0.11, 1.4], pitch: 1.0 },
  sheathe: { stop: 0.05, shake: [0.08, 1], pitch: 1.5 },
  airDraw: { stop: 0.08, shake: [0.14, 1.8], pitch: 0.95 },
} as const satisfies Record<string, HitFeel>;

/** the falling draw: one per airtime */
export const AIR_DRAWS = 1;

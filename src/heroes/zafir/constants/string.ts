import type { HitFeel } from "../../../types/move";

/**
 * Seconds after each spin of Zafir's string before the next may cut in. With the next spin's coil this sets the tempo:
 * about 0.42 real seconds from one spin landing to the next, and about 0.55 from the cyclone to the next string's
 * first spin, when the cyclone closes the combo.
 */
export const STRING_CANCEL = {
  sweepTurn: 0.1,
  risingTurn: 0.1,
  twinTurn: 0.08,
  /** the cyclone: past this the combo is closed and J starts the next string */
  duneCyclone: 0.16,
} as const;

/** Hit-stop, shake and sound of each spin, growing to the cyclone */
export const STRING_FEEL = {
  sweepTurn: { stop: 0.05, shake: [0.08, 1], pitch: 1.2 },
  risingTurn: { stop: 0.055, shake: [0.1, 1.2], pitch: 1.1 },
  twinTurnFirst: { stop: 0.04, shake: [0.06, 0.9], pitch: 1.25 },
  twinTurnSecond: { stop: 0.06, shake: [0.11, 1.4], pitch: 1 },
  duneCyclone: { stop: 0.14, shake: [0.26, 3], pitch: 0.7 },
  spinDrop: { stop: 0.03, shake: [0.05, 0.8], pitch: 1.3 },
  spinLanding: { stop: 0.1, shake: [0.2, 2.2], pitch: 0.8 },
} as const satisfies Record<string, HitFeel>;

/** he walks through his string at this share of his walk speed, either way, still facing where he faces */
export const WALK_THROUGH = 0.55;
/** the cyclone hops this high and drifts at this speed with the walk held */
export const CYCLONE_HOP = { rise: 16, drift: 40 } as const;
/** the spinning descent: dropped into at this speed, and the ring it cuts on landing, each side */
export const SPIN_DROP = { fall: 140, ring: 30 } as const;

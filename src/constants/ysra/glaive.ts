import type { HitFeel } from "../../types/move";

/** air sweeps lift a foe at this speed once she may sweep twice, and lift her this many pixels with it */
export const REAPER = { launch: -170, lift: 22 } as const;

/** contact feel of the glaive, from the thrust to the impale; heavier and lower than Kael's */
export const GLAIVE_FEEL = {
  thrust: { stop: 0.09, shake: [0.14, 1.8], pitch: 0.9 },
  sweep: { stop: 0.1, shake: [0.16, 2], pitch: 0.82 },
  rise: { stop: 0.12, shake: [0.2, 2.6], pitch: 0.72 },
  windmill: { stop: 0.07, shake: [0.1, 1.4], pitch: 1 },
  impale: { stop: 0.2, shake: [0.32, 3.8], pitch: 0.55 },
  lunge: { stop: 0.11, shake: [0.2, 2.6], pitch: 0.75 },
  counter: { stop: 0.24, shake: [0.36, 4.2], pitch: 0.5 },
} as const satisfies Record<string, HitFeel>;

/** Warpath's running impale: she keeps this speed for this long into it, then digs in */
export const WARPATH_RUN = { speed: 170, time: 0.26, brake: 0.85 } as const;

/**
 * The ground string's rhythm. A queued blow cuts in this long after the hip thrust or the middle blow lands, once its
 * hold and the start of its follow-through have shown; the middle blow hands over sooner, since the impale's wind-up is
 * the longest. Every blow before the impale staggers a minion past the next blow of the string. Game seconds.
 */
export const GLAIVE_STRING = { cancel: { hip: 0.16, sweep: 0.14 }, stagger: 0.65 } as const;

import type { HitFeel } from "../../../types/move";

/** the Prism Knight's job id, as the save and `heroJob()` name it */
export const PRISM_JOB = "prism";

/** prism shards in a foe: the stack's id, the most a foe carries, and the seconds they stay after the last one lodged */
export const SHARDS = { source: "k_prism", most: 3, last: 6, blinkFrom: 1, blinkRate: 6 } as const;

/** how shards sit on a foe: each 3 by 5 art pixels, 2 apart */
export const SHARD_LOOK = { w: 3, h: 5, gap: 2 } as const;

/** a finisher shatters every shard within `reach` of where it lands, each shard dealing `power` times attack */
export const SHATTER = { reach: 56, ahead: 22, power: 0.55, light: 0.25, flecks: [4, 6] } as const;

/** Prism Thrust's lunge and Shatterfall's step, in px per second between two frames */
export const PRISM_STRIDE = {
  thrust: { from: 3, to: 6, speed: 120 },
  shatterfall: { from: 3, to: 7, speed: 200 },
} as const;

/** seconds after each Prism Knight blow before the next may cut in */
export const PRISM_CANCEL = { prismThrust: 0.1 } as const;

/** hit-stop, shake and sound of the Prism Knight's two blows */
export const PRISM_FEEL = {
  prismThrust: { stop: 0.08, shake: [0.14, 1.8], pitch: 1.1 },
  shatterfall: { stop: 0.15, shake: [0.26, 3.2], pitch: 0.7 },
} as const satisfies Record<string, HitFeel>;

/** the four motes that gather on the blade's tip through Shatterfall's wind-up: how far out they start */
export const SHATTER_MOTES = { count: 4, spread: 14 } as const;

/**
 * Crystal Nova's prism beams: they fire this long after the ring, at these angles each side, `reach` times the ring's
 * radius long and `width` art pixels wide; they grow, hold and fade over these seconds, and each foe a beam crosses
 * takes `share` of the ring's blow once per beam
 */
export const PRISM_BEAMS = {
  delay: 0.12,
  angles: [0, 35, -35],
  reach: 1.5,
  width: 3,
  grow: 0.08,
  hold: 0.1,
  fade: 0.25,
  share: 0.2,
  /** the beams leave from Kael's chest */
  chest: 18,
} as const;

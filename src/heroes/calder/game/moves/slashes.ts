import type { SlashShape } from "../../../../types/effect";

/** the slash shapes of Calder's blows, in local pixels facing right: broad and heavy, as his blade is */
export const SLASHES = {
  /** a falling diagonal from over the far shoulder down past the foe */
  hew: { cx: 5, cy: -20, R: 23, sy: 0.6, rot: -0.4, a0: -2.6, a1: 0.9, W: 9, hold: 0.04 },
  /** a rising backhand from low behind to high over the head */
  rip: { cx: 6, cy: -19, R: 22, sy: 0.72, rot: 0.3, a0: 1.5, a1: -1.95, W: 8, hold: 0.04 },
  /** an overhead slam into the floor ahead */
  breaker: {
    cx: 7,
    cy: -20,
    R: 27,
    sy: 0.85,
    rot: -0.05,
    a0: -2.3,
    a1: 1.3,
    W: 13,
    sweep: 0.06,
    hold: 0.07,
    trail: 0.3,
  },
  /** a flat cut in the air */
  airHew: { cx: 4, cy: -20, R: 22, sy: 0.45, rot: 0.1, a0: -2.7, a1: 0.7, W: 8 },
  /** a cut down past the feet */
  dropCut: { cx: 6, cy: -14, R: 21, sy: 0.9, rot: 0.1, a0: -1.9, a1: 1.6, W: 9, hold: 0.05 },
} as const satisfies Record<string, SlashShape>;

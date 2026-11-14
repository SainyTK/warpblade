import type { SlashShape } from "../../../../types/effect";

/** the slash shapes of Brynn's blows, in local pixels facing right: wide and heavy, as long as her blade */
export const SLASH = {
  /** a flat, wide ellipse round her waist from behind to far in front */
  sweep: { cx: 6, cy: -17, R: 34, sy: 0.32, rot: 0, a0: 2.95, a1: 0.1, W: 11, hold: 0.05, trail: 0.24 },
  /** from the floor behind, up through the front and over her head */
  heave: { cx: 6, cy: -24, R: 30, sy: 0.8, rot: 0.15, a0: 2.2, a1: -1.7, W: 11, hold: 0.05, trail: 0.24 },
  /** from high behind her head, over the top and down into the floor in front */
  slam: { cx: 10, cy: -22, R: 30, sy: 0.85, rot: 0.1, a0: -2.5, a1: 1.05, W: 13, hold: 0.08, trail: 0.3 },
  /** straight down under her as she drops */
  airSlam: { cx: 4, cy: -14, R: 22, sy: 0.4, rot: 1.35, a0: -1.2, a1: 1.2, W: 9, hold: 0.04, trail: 0.2 },
  /** the Counter Cleave: over the top and down across the front */
  cleave: { cx: 8, cy: -20, R: 32, sy: 0.7, rot: 0.2, a0: -2.6, a1: 0.9, W: 13, hold: 0.07, trail: 0.28 },
  /** the warp's arrival chop */
  chop: { cx: 8, cy: -20, R: 26, sy: 0.85, rot: 0.1, a0: -2.2, a1: 1.1, W: 11, hold: 0.06, trail: 0.24 },
} as const satisfies Record<string, SlashShape>;

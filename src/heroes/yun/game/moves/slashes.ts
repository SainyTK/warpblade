import type { SlashShape } from "../../../../types/effect";

/**
 * Yun's slash shapes in local pixels facing right: long round arcs for a long blade. Each trails a little longer than
 * Kael's so his cuts read as circles.
 */
export const WILLOW: SlashShape = { cx: 5, cy: -22, R: 24, sy: 0.55, rot: -0.2, a0: -2.6, a1: 0.8, W: 7, trail: 0.24 };
export const LEAF: SlashShape = { cx: 6, cy: -22, R: 23, sy: 0.8, rot: 0.3, a0: 1.7, a1: -2.2, W: 7, trail: 0.24 };
export const CRANE: SlashShape = { cx: 1, cy: -21, R: 28, sy: 0.32, rot: 0, a0: 3.1, a1: -0.5, W: 7, trail: 0.24 };
export const TIDE: SlashShape = {
  cx: 6,
  cy: -20,
  R: 27,
  sy: 0.85,
  rot: -0.1,
  a0: -2.5,
  a1: 1.3,
  W: 11,
  sweep: 0.06,
  hold: 0.07,
  trail: 0.3,
};
export const DRIFT: SlashShape = { cx: 2, cy: -22, R: 25, sy: 0.3, rot: 0, a0: 3, a1: -0.3, W: 6, trail: 0.2 };
export const PETAL: SlashShape = { cx: 6, cy: -22, R: 24, sy: 0.75, rot: 0.2, a0: -2.1, a1: 1.2, W: 7, trail: 0.22 };

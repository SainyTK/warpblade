import type { SlashShape } from "../../../../types/effect";

/** the glaive's slashes, in local pixels facing right, in Ysra's ember ramp; longer arcs than any sword cut */
export const G_THRUST: SlashShape = {
  cx: 14,
  cy: -15,
  R: 26,
  sy: 0.12,
  rot: 0,
  a0: -2.6,
  a1: 0.2,
  W: 4,
  sweep: 0.03,
  trail: 0.14,
};
/** the reverse sweep: from low behind her, across the front and up over her head */
export const G_SWEEP: SlashShape = { cx: 2, cy: -22, R: 36, sy: 0.6, rot: 0.04, a0: 2.8, a1: -1.25, W: 8, sweep: 0.07 };
export const G_IMPALE: SlashShape = {
  cx: 14,
  cy: -14,
  R: 22,
  sy: 0.2,
  rot: 0.85,
  a0: -2.6,
  a1: 0.2,
  W: 6,
  sweep: 0.03,
  hold: 0.12,
};
export const G_SKYHOOK: SlashShape = { cx: 8, cy: -22, R: 27, sy: 0.75, rot: 0.3, a0: 1.6, a1: -1.8, W: 9 };
export const G_WINDMILL_FRONT: SlashShape = { cx: 0, cy: -34, R: 32, sy: 0.25, rot: 0, a0: -1.57, a1: 1.57, W: 6 };
export const G_WINDMILL_BACK: SlashShape = { ...G_WINDMILL_FRONT, a0: 1.57, a1: 4.71 };
export const G_COUNTER: SlashShape = { ...G_THRUST, cx: 16, cy: -13, R: 32, W: 7, hold: 0.08 };
export const G_RUN: SlashShape = { ...G_THRUST, cy: -16, R: 28, W: 5 };
export const G_AIR_REAP: SlashShape = { cx: 4, cy: -18, R: 30, sy: 0.8, rot: 0, a0: -2.4, a1: 1.3, W: 10 };
export const G_AIR_RISE: SlashShape = { cx: 6, cy: -18, R: 28, sy: 0.8, rot: 0, a0: 2, a1: -1.6, W: 9 };
/** the wrench that tears the planted glaive free on a warp's arrival: from low ahead, up and back over her head */
export const G_WRENCH: SlashShape = { cx: 8, cy: -18, R: 30, sy: 0.7, rot: 0.2, a0: 1.3, a1: -2, W: 9, hold: 0.06 };

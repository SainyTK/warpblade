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
export const G_POKE: SlashShape = { ...G_THRUST, cx: 12, R: 24, W: 3 };
export const G_SWEEP: SlashShape = { cx: 2, cy: -16, R: 37, sy: 0.3, rot: 0.04, a0: 3, a1: -0.3, W: 8, sweep: 0.07 };
export const G_CLEAVE: SlashShape = { cx: 10, cy: -18, R: 28, sy: 0.85, rot: 0.1, a0: -2.1, a1: 1, W: 11, hold: 0.08 };
export const G_TWIRL_FRONT: SlashShape = { cx: 6, cy: -19, R: 22, sy: 0.9, rot: 0, a0: -1.6, a1: 1.3, W: 7 };
export const G_TWIRL_BACK: SlashShape = { cx: -4, cy: -19, R: 22, sy: 0.9, rot: 0, a0: 1.6, a1: 4.4, W: 7 };
export const G_RAM: SlashShape = {
  cx: -8,
  cy: -15,
  R: 20,
  sy: 0.14,
  rot: 0,
  a0: 5.74,
  a1: 2.89,
  W: 4,
  sweep: 0.03,
  trail: 0.12,
};
/** the sky thrust: a long stab slanting steeply up ahead */
export const G_SKY: SlashShape = { ...G_THRUST, cx: 10, cy: -30, R: 30, rot: -1.1, W: 5 };
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
export const G_LASH: SlashShape = { cx: 6, cy: -5, R: 36, sy: 0.16, rot: 0, a0: 0.1, a1: 1.9, W: 6, sweep: 0.08 };
export const G_WINDMILL_FRONT: SlashShape = { cx: 0, cy: -34, R: 32, sy: 0.25, rot: 0, a0: -1.57, a1: 1.57, W: 6 };
export const G_WINDMILL_BACK: SlashShape = { ...G_WINDMILL_FRONT, a0: 1.57, a1: 4.71 };
export const G_COUNTER: SlashShape = { ...G_THRUST, cx: 16, cy: -13, R: 32, W: 7, hold: 0.08 };
export const G_RUN: SlashShape = { ...G_THRUST, cy: -16, R: 28, W: 5 };
export const G_AIR_REAP: SlashShape = { cx: 4, cy: -18, R: 30, sy: 0.8, rot: 0, a0: -2.4, a1: 1.3, W: 10 };
export const G_AIR_RISE: SlashShape = { cx: 6, cy: -18, R: 28, sy: 0.8, rot: 0, a0: 2, a1: -1.6, W: 9 };

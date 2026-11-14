import type { SlashShape } from "../../../../types/effect";

/** a thrust's streak: a long, flat sliver along the line from the hand to past the point, in the hero's rose */
export const THRUST: SlashShape = {
  cx: 14,
  cy: -17,
  R: 30,
  sy: 0.1,
  rot: 0,
  a0: -2.7,
  a1: 0.2,
  W: 3,
  sweep: 0.03,
  trail: 0.12,
};
/** the rising thrust's streak, tilted up along the point */
export const RISING: SlashShape = { ...THRUST, cy: -20, rot: -0.3 };
/** the lunge's streak: longer and heavier */
export const LUNGE_STREAK: SlashShape = {
  cx: 20,
  cy: -16,
  R: 40,
  sy: 0.12,
  rot: 0,
  a0: -2.8,
  a1: 0.18,
  W: 5,
  sweep: 0.04,
  hold: 0.05,
  trail: 0.22,
};
/** the diving thrust's streak, down along the slant */
export const DIVE_STREAK: SlashShape = {
  cx: 10,
  cy: -6,
  R: 24,
  sy: 0.12,
  rot: 0.85,
  a0: -2.7,
  a1: 0.2,
  W: 4,
  sweep: 0.03,
  trail: 0.16,
};

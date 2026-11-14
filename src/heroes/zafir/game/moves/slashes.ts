import type { SlashShape } from "../../../../types/effect";

/** a flat ring of cut round his waist: one sweep that circles him from behind, round the front and back again */
export const RING_CUT: SlashShape = { cx: 0, cy: -18, R: 28, sy: 0.3, rot: 0, a0: 3.1, a1: -3.1, W: 7, sweep: 0.07 };
/** a ring that climbs: tilted up toward the front, ending high over his head */
export const RISING_RING: SlashShape = {
  cx: 0,
  cy: -22,
  R: 27,
  sy: 0.42,
  rot: -0.35,
  a0: 3.1,
  a1: -3.1,
  W: 7,
  sweep: 0.07,
};
/** the low ring of the double turn, at the knees */
export const LOW_RING: SlashShape = { cx: 0, cy: -11, R: 28, sy: 0.24, rot: 0, a0: 3.1, a1: -3.1, W: 5, sweep: 0.06 };
/** the high ring of the double turn, at the chest */
export const HIGH_RING: SlashShape = { cx: 0, cy: -22, R: 29, sy: 0.3, rot: 0, a0: 3.1, a1: -3.1, W: 6, sweep: 0.06 };
/** the cyclone: a wide ring tilted the other way, thick and held */
export const CYCLONE_RING: SlashShape = {
  cx: 0,
  cy: -24,
  R: 34,
  sy: 0.5,
  rot: 0.3,
  a0: 3.1,
  a1: -3.1,
  W: 12,
  sweep: 0.07,
  hold: 0.06,
  trail: 0.28,
};
/** one half turn of the descent */
export const DROP_CUT: SlashShape = { cx: 0, cy: -18, R: 22, sy: 0.55, rot: 0.5, a0: -2.6, a1: 0.9, W: 6, sweep: 0.04 };

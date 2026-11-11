import { STAB_RAMP } from "../../../constants/combo";
import type { SlashShape } from "../../../types/effect";

/** slash shapes shared by several moves, in local pixels facing right */
export const CROSS: SlashShape = { cx: 4, cy: -21, R: 22, sy: 0.62, rot: -0.35, a0: -2.5, a1: 0.95, W: 8 };
export const RISING: SlashShape = { cx: 6, cy: -20, R: 21, sy: 0.7, rot: 0.25, a0: 1.4, a1: -1.9, W: 7 };
export const STAB: SlashShape = {
  cx: 10,
  cy: -18,
  R: 22,
  sy: 0.14,
  rot: 0,
  a0: -2.6,
  a1: 0.25,
  W: 4,
  sweep: 0.03,
  trail: 0.12,
  ramp: STAB_RAMP,
};
export const THRUST_SLASH: SlashShape = { cx: 10, cy: -18, R: 20, sy: 0.16, rot: 0, a0: -2.6, a1: 0.25, W: 5 };
export const UPPERCUT: SlashShape = { cx: 5, cy: -22, R: 22, sy: 0.75, rot: 0.3, a0: 1.6, a1: -1.7, W: 8 };
/** a near-vertical arc from over the head down to the floor in front */
export const CLEAVE: SlashShape = { cx: 6, cy: -18, R: 24, sy: 0.9, rot: 0, a0: -2.2, a1: 1.25, W: 10, hold: 0.06 };
export const FLAT_FRONT: SlashShape = { cx: 0, cy: -18, R: 26, sy: 0.3, rot: 0, a0: 3.0, a1: 0, W: 7 };
export const FLAT_BACK: SlashShape = { ...FLAT_FRONT, a0: 0, a1: -3.0, W: 6 };

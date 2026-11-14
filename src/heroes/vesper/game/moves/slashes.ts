import type { SlashShape } from "../../../../types/effect";
import { NIGHT_RAMP } from "../../look/colors";

/** slash shapes of her blows, in local pixels facing right: wide arcs for the long blade, tight quick ones for the short */
export const FALLING: SlashShape = {
  cx: 5,
  cy: -21,
  R: 25,
  sy: 0.6,
  rot: -0.35,
  a0: -2.5,
  a1: 0.95,
  W: 8,
  sweep: 0.05,
};
export const RISING: SlashShape = { cx: 6, cy: -22, R: 24, sy: 0.75, rot: 0.25, a0: 1.5, a1: -1.9, W: 7, sweep: 0.05 };
export const LEVEL: SlashShape = { cx: 2, cy: -18, R: 26, sy: 0.3, rot: 0, a0: 3, a1: 0.1, W: 7, sweep: 0.05 };
export const LAUNCH: SlashShape = {
  cx: 5,
  cy: -26,
  R: 26,
  sy: 0.85,
  rot: 0.15,
  a0: 1.7,
  a1: -1.6,
  W: 10,
  hold: 0.06,
  trail: 0.3,
};
export const BACKHAND: SlashShape = {
  cx: 6,
  cy: -19,
  R: 16,
  sy: 0.55,
  rot: 0.3,
  a0: -2.2,
  a1: 0.6,
  W: 5,
  sweep: 0.035,
  trail: 0.16,
  ramp: NIGHT_RAMP,
};
export const STAB: SlashShape = {
  cx: 10,
  cy: -18,
  R: 18,
  sy: 0.14,
  rot: 0,
  a0: -2.6,
  a1: 0.25,
  W: 4,
  sweep: 0.03,
  trail: 0.12,
  ramp: NIGHT_RAMP,
};
export const SWEEP_SHORT: SlashShape = {
  cx: 3,
  cy: -19,
  R: 18,
  sy: 0.32,
  rot: 0,
  a0: 3,
  a1: 0.2,
  W: 5,
  sweep: 0.035,
  trail: 0.16,
  ramp: NIGHT_RAMP,
};
export const LOW_FLICK: SlashShape = {
  cx: 7,
  cy: -12,
  R: 15,
  sy: 0.4,
  rot: 0.2,
  a0: -2.4,
  a1: 0.5,
  W: 4,
  sweep: 0.03,
  trail: 0.14,
  ramp: NIGHT_RAMP,
};
export const SWOOP: SlashShape = {
  cx: 3,
  cy: -20,
  R: 22,
  sy: 0.85,
  rot: 0,
  a0: -2.4,
  a1: 1.4,
  W: 7,
  sweep: 0.06,
  hold: 0.03,
  trail: 0.22,
};
export const UNDERCUT: SlashShape = {
  cx: 4,
  cy: -18,
  R: 18,
  sy: 0.8,
  rot: 0,
  a0: 2.6,
  a1: -0.8,
  W: 5,
  trail: 0.18,
  ramp: NIGHT_RAMP,
};
export const WHEEL_LONG: SlashShape = {
  cx: 1,
  cy: -20,
  R: 21,
  sy: 1,
  rot: 0,
  a0: -2.8,
  a1: 0.6,
  W: 6,
  sweep: 0.06,
  trail: 0.2,
};
export const WHEEL_SHORT: SlashShape = {
  cx: 2,
  cy: -16,
  R: 16,
  sy: 1,
  rot: 0,
  a0: 0.4,
  a1: 2.6,
  W: 5,
  trail: 0.18,
  ramp: NIGHT_RAMP,
};
export const DIVE_A: SlashShape = { cx: 8, cy: -14, R: 22, sy: 0.5, rot: 0.8, a0: -2.4, a1: 0.8, W: 6, trail: 0.2 };
export const DIVE_B: SlashShape = { ...DIVE_A, rot: -0.2, a0: -2, a1: 1.1, ramp: NIGHT_RAMP };
/** the warp arrival's cross: the long blade's arc and the short blade's arc crossing on the foe */
export const ARRIVE_A: SlashShape = {
  cx: 10,
  cy: -20,
  R: 22,
  sy: 0.9,
  rot: 0.75,
  a0: -2.5,
  a1: 0.9,
  W: 8,
  hold: 0.06,
  trail: 0.26,
};
export const ARRIVE_B: SlashShape = { ...ARRIVE_A, rot: -0.75, W: 6, ramp: NIGHT_RAMP };

import type { Pose } from "../types/pose";
import { pose } from "./hero";

type LeftArm = Pick<Pose, "bx" | "by" | "be">;

export const rearHand = (x: number, y: number): LeftArm => ({ bx: x, by: y, be: 1 });
export const frontHand = (x: number, y: number): LeftArm => ({ bx: x, by: y, be: 0 });

export const DRILL_STANCE = pose({
  hx: -1,
  hy: -12,
  nx: 1,
  ny: -22,
  fx: 6,
  fy: -15,
  ...rearHand(-6, -14),
  ffx: 6,
  bfx: -6,
  sa: 1.03,
});

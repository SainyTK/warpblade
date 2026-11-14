import { frame } from "../../../../constants/hero";
import type { Pose, PoseKeyframe } from "../../../../types/pose";
import { grip } from "./grip";

/** a key on animation frame `n` with both hands on the grip; `snap` jumps to it on that frame (a hit frame) */
export const twoHand = (n: number, o: Partial<Pose>, snap = false): PoseKeyframe =>
  snap ? [frame(n), grip(o), "snap"] : [frame(n), grip(o)];

/**
 * Brynn's ready stance between blows: sunk a little on wide feet, both hands on the grip at her chest and Anvilheart
 * raised in front of her, point up and forward. Every blow of her string starts and ends on it.
 */
export const BRYNN_READY = {
  hx: -0.5,
  hy: -12.8,
  cb: 0.3,
  nx: 1.2,
  ny: -22.8,
  fx: 7,
  fy: -17.5,
  sa: -1.05,
  ffx: 5.5,
  bfx: -5.5,
  ba: 0.25,
} as const satisfies Partial<Pose>;

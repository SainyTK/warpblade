import { ANIM_FPS } from "../../../constants/hero";
import type { DrillMotion } from "../../../types/drill";
import { clamp, ease, smooth } from "../../../utils/math";
import { DEFENSE } from "../../constants";

export const BRAKING_TIME = 0.104;
export const LANDING_TIME = 0.118;
export const LANDING_SETTLE = 0.038;
export const PARRY_SETTLE = 0.052;
export const APEX_BLEND = 0.62;
const FALL_SPAN = 0.6;

export const landRecovery = (age: number, landing: number): number =>
  ease.outCubic(smooth(LANDING_SETTLE * landing, LANDING_TIME * landing, age));

export const parryRecovery = (age: number): number => smooth(PARRY_SETTLE, DEFENSE.parryPoseTime, age);

const risingSeconds = (numbers: DrillMotion): number => numbers.rise / numbers.riseGravity;
const fallingSeconds = (numbers: DrillMotion): number => (FALL_SPAN * numbers.rise) / numbers.fallGravity;

/** the seconds from takeoff, through the top, to the last frame of the jump clip */
export const airSeconds = (numbers: DrillMotion): number => risingSeconds(numbers) + fallingSeconds(numbers);

function airSpan(numbers: DrillMotion) {
  const rising = risingSeconds(numbers);
  const falling = fallingSeconds(numbers);
  return { rising: rising / (rising + falling), frames: Math.round((rising + falling) * ANIM_FPS) + 1 };
}

export const airFrames = (numbers: DrillMotion): number => airSpan(numbers).frames;

export function airProgress(vy: number, numbers: DrillMotion): number {
  const { rising } = airSpan(numbers);
  return vy < 0
    ? rising * clamp(1 + vy / numbers.rise)
    : rising + (1 - rising) * clamp(vy / (FALL_SPAN * numbers.rise));
}

export function airBlend(progress: number, numbers: DrillMotion): number {
  const { rising } = airSpan(numbers);
  return progress <= rising
    ? APEX_BLEND * (progress / rising) ** 2
    : APEX_BLEND + (1 - APEX_BLEND) * smooth(rising, 1, progress);
}

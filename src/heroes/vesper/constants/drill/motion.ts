import type { DrillMotion } from "../../../../types/drill";

export const VESPER_MOTION: Partial<DrillMotion> = {
  run: 118,
  groundAccel: 3500,
  airAccel: 1560,
  airBrake: 900,
  riseGravity: 880,
  fallGravity: 1080,
  rise: 344,
  release: 136,
  fall: 360,
  dash: 292,
  dashBurst: 46,
  dashJump: 236,
  wallSlide: 54,
  wallKick: 186,
  jumpGrace: 0.085,
};

import { KEEN } from "../constants/combo";
import type { DrillMotion } from "../types/drill";

export const TARGET_RADIUS = 6;
export const SPELL_HEIGHT = 15;
export const DEFENSE = { parryWindow: 0.12, parryPoseTime: 0.19, cueLife: 0.31, stun: 0.22 };

export const MOTION: DrillMotion = {
  run: 110,
  groundAccel: 3200,
  groundBrake: 3800,
  airAccel: 1380,
  airBrake: 1050,
  riseGravity: 940,
  fallGravity: 1200,
  rise: 331,
  release: 122,
  fall: 390,
  dash: 278,
  dashBurst: 40,
  dashTime: 0.16,
  dashRecovery: 0.26,
  dashJump: 220,
  wallSlide: 62,
  wallKick: 176,
  wallLock: 0.11,
  jumpGrace: 0.075,
  buffer: 0.11,
  landing: 1,
};

export const DASH_LOCKOUT = MOTION.dashTime + MOTION.dashRecovery;
export const WARP_TRACE_LIFE = 0.32;
export const SPELL_PREPARATION = 3;
export const INFUSION_HITS = 3;
export const SPELL_SELECTION_CUE = 0.9;
export const SPELL_RELEASE_RECOVERY = 0.19;
export const SPELL_IMPACT_TIME = 0.38;
export const KEEN_WINDOW = KEEN.window;
export const CHARGE_START = 0.2;

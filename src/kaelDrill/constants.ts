export const TRAINING_ATTACK_DAMAGE = 10;
export const TARGET_RADIUS = 6;
export const SPELL_HEIGHT = 15;
export const DEFENSE = { parryWindow: 0.12, parryPoseTime: 0.19, cueLife: 0.31, stun: 0.22 };

export const CHAIN = {
  enhancedWindow: 0.23,
};

export const MOTION = {
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
};

export const DASH_LOCKOUT = MOTION.dashTime + MOTION.dashRecovery;
export const WARP_SLASH = {
  cx: 2,
  cy: -20,
  R: 24,
  sy: 0.5,
  rot: -0.5,
  a0: -2.6,
  a1: 0.8,
  W: 10,
  hold: 0.06,
  trail: 0.24,
};
export const WARP_TRACE_LIFE = 0.32;

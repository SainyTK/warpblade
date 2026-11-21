import { frontHand, rearHand } from "../../../../constants/drillPose";
import { pose } from "../../../../constants/hero";
import type { DrillPoseId } from "../../../../types/drill";
import type { Pose } from "../../../../types/pose";

const SHOULDER_BLADE = { fx: 2.5, fy: -21, sa: 2.95 };
const SASH_HAND = rearHand(-1.5, -13.5);

const STANCE = pose({
  hx: -0.5,
  hy: -13.8,
  cb: 0.6,
  nx: 0.5,
  ny: -23.8,
  ...SHOULDER_BLADE,
  ...SASH_HAND,
  ffx: 4.5,
  bfx: -3.5,
  ba: 0.15,
});

const BREATHE = { ...STANCE, cb: 0.9, hy: -13.5, ny: -24.2, fy: -21.4, by: -13.3, sa: 2.91 };

const BRAKE = pose({
  hx: -3.5,
  hy: -10.5,
  cb: -0.6,
  nx: -1.5,
  ny: -20.5,
  fx: 1,
  fy: -19,
  sa: 2.75,
  ...rearHand(-4, -12),
  ffx: 10,
  fa: -0.3,
  bfx: -6,
  ba: 0.4,
});

const LOW = pose({
  hx: -1,
  hy: -8.5,
  cb: -0.8,
  nx: 3,
  ny: -18,
  fx: 3,
  fy: -16.5,
  sa: 3.05,
  ...frontHand(7, -8),
  ffx: 7,
  bfx: -7,
  ba: 0.5,
});

const TOUCHDOWN = { ...LOW, hy: -11.5, nx: 2, ny: -21, fy: -19, by: -12, fa: -0.2 };

const DASH = pose({
  tw: 1,
  hx: -2,
  hy: -8.5,
  cb: -1,
  nx: 4,
  ny: -16.5,
  fx: -7,
  fy: -12,
  sa: 3.25,
  ...frontHand(9, -13),
  ffx: 7,
  ffy: -1,
  fa: 0.5,
  bfx: -10,
  bfy: -1.5,
  ba: 0.9,
});

const AIR_DASH = pose({
  hx: -3,
  hy: -12,
  cb: 0.4,
  nx: 6,
  ny: -18,
  fx: -9,
  fy: -15,
  sa: 3.12,
  ...frontHand(12, -17),
  ffx: 2,
  ffy: -5,
  fa: 0.7,
  bfx: -13,
  bfy: -6,
  ba: 0.9,
});

const RISE = pose({
  hy: -15,
  cb: 0.8,
  nx: 1.5,
  ny: -25,
  fx: 0,
  fy: -27,
  sa: -2.55,
  ...frontHand(6, -21),
  ffx: 5,
  ffy: -8,
  fa: 0.5,
  bfx: -3,
  bfy: -2,
  ba: 0.7,
});

const LEAP = pose({
  hx: -2,
  hy: -13,
  cb: 1,
  nx: 6,
  ny: -22,
  fx: -6,
  fy: -18,
  sa: 3.1,
  ...frontHand(10, -20),
  ffx: 7,
  ffy: -9,
  fa: 0.4,
  bfx: -12,
  bfy: -3,
  ba: 0.9,
});

const KICK = { ...LEAP, bfx: -12, bfy: -9, ba: 1.2, ffx: 5, ffy: -4, bx: 10, by: -23 };

const FALL = pose({
  hx: -0.5,
  hy: -14.5,
  cb: 0.4,
  nx: 1.5,
  ny: -24.5,
  fx: -4,
  fy: -22,
  sa: 2.55,
  ...frontHand(8, -19),
  ffx: 5,
  ffy: -2,
  fa: 0.35,
  bfx: -5,
  bfy: -5,
  ba: 0.6,
});

const WALL = pose({
  hx: -4,
  hy: -12,
  cb: -0.4,
  nx: -1.5,
  ny: -22,
  fx: -1,
  fy: -21,
  sa: 2.9,
  ...frontHand(6, -21),
  ffx: 6,
  ffy: -7,
  fa: -0.6,
  bfx: 3,
  bfy: -1,
});

const SPELL = pose({
  hx: -1,
  hy: -12.5,
  cb: 0.8,
  nx: 2.5,
  ny: -22.5,
  ...SHOULDER_BLADE,
  sa: 3.02,
  ...frontHand(15, -18),
  ffx: 7,
  bfx: -6,
  ba: 0.3,
});

export const ZAFIR_POSES: Readonly<Record<DrillPoseId, Pose>> = {
  stance: STANCE,
  breathe: BREATHE,
  brake: BRAKE,
  low: LOW,
  touchdown: TOUCHDOWN,
  dash: DASH,
  airDash: AIR_DASH,
  rise: RISE,
  leap: LEAP,
  kick: KICK,
  fall: FALL,
  wall: WALL,
  spell: SPELL,
};

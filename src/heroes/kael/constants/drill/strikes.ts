import { frontHand, rearHand, DRILL_STANCE as STANCE } from "../../../../constants/drillPose";
import { pose } from "../../../../constants/hero";
import type { DrillStrike, DrillStrikeId } from "../../../../types/drill";

const FIRST_LOAD = pose({
  hx: -3,
  hy: -12,
  nx: -4,
  ny: -22,
  cb: -1,
  fx: -8,
  fy: -26,
  ...frontHand(4, -17),
  ffx: 7,
  bfx: -8,
  sa: -2.17,
});
const FIRST_CUT = pose({
  hx: 2,
  hy: -11,
  nx: 6,
  ny: -21,
  fx: 13,
  fy: -17,
  ...rearHand(-4, -12),
  ffx: 9,
  bfx: -9,
  sa: 0.9,
});
const FIRST_FINISH = { ...FIRST_CUT, hx: 3, hy: -10, nx: 7, ny: -20, fx: 12, fy: -13, sa: 0.6 };

const SWEEP_LOAD = { ...FIRST_FINISH, hx: 0, nx: 1, fx: 11, fy: -15, ...rearHand(-5, -14), sa: 0.08 };
const SWEEP_CUT = pose({
  hx: 0,
  hy: -11,
  nx: 1,
  ny: -21,
  cb: -0.5,
  fx: 13,
  fy: -16,
  ...rearHand(-5, -13),
  ffx: 7,
  bfx: -7,
  sa: 0.05,
});
const SWEEP_FINISH = { ...SWEEP_CUT, nx: -2, fx: -10, fy: -16, ...frontHand(5, -15), sa: 3.14, tw: 1 };

const OVERHEAD_LOAD = pose({
  hx: -4,
  hy: -12,
  nx: -2,
  ny: -23,
  fx: -3,
  fy: -31,
  ...frontHand(5, -17),
  ffx: 4,
  ffy: -4,
  bfx: -8,
  sa: -2.85,
});
const OVERHEAD_CUT = pose({
  hx: 3,
  hy: -11,
  nx: 7,
  ny: -20,
  fx: 14,
  fy: -19,
  ...rearHand(-4, -12),
  ffx: 10,
  bfx: -12,
  ba: 0.6,
  sa: 0.61,
});
const OVERHEAD_FINISH = {
  ...OVERHEAD_CUT,
  hx: 4,
  hy: -8.5,
  nx: 10,
  ny: -17,
  fx: 13,
  fy: -12,
  bfx: -11,
  bfy: -1,
  sa: 0.53,
};

const AIR_READY = pose({
  hx: -1,
  nx: 3,
  fx: 5,
  fy: -20,
  ...rearHand(-5, -15),
  ffx: 7,
  ffy: -6,
  bfx: -6,
  bfy: -2,
  sa: 0.2,
});
const AIR_LOAD = { ...AIR_READY, hx: -3, nx: -1, fx: -1, fy: -31, by: -18, ffy: -10, bfy: -5, sa: -1.87 };
const AIR_CUT = {
  ...AIR_READY,
  hx: 2,
  hy: -12,
  nx: 7,
  ny: -21,
  fx: 14,
  fy: -18,
  ...rearHand(-4, -13),
  ffx: 6,
  bfx: -10,
  bfy: -9,
  ba: 0.85,
  sa: 0.53,
};
const AIR_FINISH = { ...AIR_CUT, nx: 8, fx: 12, fy: -13, ffy: -3, bfy: -6, sa: 1.08 };

const POSES = {
  first: { ready: STANCE, load: FIRST_LOAD, cut: FIRST_CUT, finish: FIRST_FINISH, settle: 0.65 },
  second: { ready: FIRST_FINISH, load: SWEEP_LOAD, cut: SWEEP_CUT, finish: SWEEP_FINISH, settle: 0.64 },
  third: { ready: SWEEP_FINISH, load: OVERHEAD_LOAD, cut: OVERHEAD_CUT, finish: OVERHEAD_FINISH, settle: 0.7 },
  air: { ready: AIR_READY, load: AIR_LOAD, cut: AIR_CUT, finish: AIR_FINISH, settle: 0.52 },
};

export const KAEL_STRIKES: Readonly<Record<DrillStrikeId, DrillStrike>> = {
  first: {
    hit: 0.075,
    duration: 0.29,
    reach: 32,
    height: 14,
    step: 3,
    next: "second",
    damage: 1,
    finisher: false,
    poses: POSES.first,
    arc: { cx: 5, cy: -19, sy: 0.82, rot: -0.19, a0: -1.63, a1: 1.14, W: 12 },
  },
  second: {
    hit: 0.075,
    duration: 0.25,
    reach: 34,
    height: 14,
    step: 0,
    next: "third",
    damage: 1,
    finisher: false,
    poses: POSES.second,
    arc: { cx: 0, cy: -15, sy: 0.23, rot: -0.06, a0: 3.38, a1: -0.22, W: 8, sweep: 0.036 },
  },
  third: {
    hit: 0.117,
    duration: 0.37,
    reach: 35,
    height: 14,
    step: 11,
    next: null,
    damage: 1.6,
    finisher: true,
    poses: POSES.third,
    arc: { cx: 3, cy: -23, sy: 0.72, rot: 0.13, a0: -3.12, a1: 0.91, W: 13, hold: 0.055 },
  },
  air: {
    hit: 0.058,
    duration: 0.25,
    reach: 32,
    height: 22,
    step: 0,
    next: null,
    damage: 1,
    finisher: false,
    poses: POSES.air,
    arc: { cx: 5, cy: -16, sy: 0.9, rot: -0.1, a0: -1.88, a1: 1.32, W: 10, sweep: 0.038, trail: 0.11 },
  },
};

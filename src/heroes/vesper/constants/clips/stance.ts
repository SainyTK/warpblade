import { pose } from "../../../../constants/hero";
import type { Pose } from "../../../../types/pose";

/**
 * Vesper's ready stance, where every one of her clips starts and ends: sunk low and wide, the long blade held level and
 * forward at the waist, the short blade in a reverse grip low by the far hip with its point to the back.
 */
export const VESPER_READY: Pose = pose({
  hx: -0.5,
  hy: -13,
  cb: 0.3,
  nx: 1.5,
  ny: -23,
  fx: 7,
  fy: -16,
  sa: 0.35,
  bx: -6,
  by: -15,
  oa: 2.2,
  ffx: 5,
  bfx: -5,
});

/** a pose that changes only some joints of her ready stance */
export const vp = (o: Partial<Pose>): Pose => ({ ...VESPER_READY, ...o });

/** the angle of the short blade in the shared clips (walk, run, jump, fall): reverse grip, point back along the forearm */
export const SHORT_CARRY = 2.3;

/** the crouch she sinks into while a jump loads from a stand: both blades swept low behind */
export const VESPER_CROUCH: Pose = vp({
  hy: -10.5,
  nx: 3,
  ny: -20,
  cb: 0.6,
  fx: 2,
  fy: -12,
  sa: 2.6,
  bx: -5,
  by: -12,
  oa: 2.6,
  ffx: 5,
  bfx: -5,
  ba: 0.3,
});

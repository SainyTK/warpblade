import { pose } from "../../../../constants/hero";

/**
 * Cerise en garde, the pose her blows start from and settle back to: side on, knees soft, the rapier level at chest
 * height with its point toward the foe, and the off hand raised behind for balance.
 */
export const EN_GARDE = pose({
  hx: -0.5,
  hy: -13,
  nx: 0,
  ny: -23,
  fx: 8,
  fy: -18,
  sa: -0.1,
  bx: -6,
  by: -21,
  ffx: 6,
  bfx: -5,
  ba: 0.3,
});

/** at rest: the weight on the back leg, the front foot pointed at the foe, the rapier low with its point down by the
 *  front foot, and the off hand on her hip */
export const AT_REST = pose({
  hx: -1.5,
  hy: -14,
  cb: 0.3,
  nx: -1,
  ny: -24,
  fx: 6,
  fy: -14.5,
  sa: 1.05,
  bx: -4,
  by: -13.5,
  be: 1,
  ffx: 5,
  fa: -0.05,
  bfx: -3.5,
});

import { frame, pose } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";
import { RELOAD } from "../chamber";
import { CALDER_READY as READY } from "./ready";

/** the cylinder held open by the drum, the head bowed over it */
const OPEN = {
  hy: -13.6,
  nx: 1.5,
  ny: -23.4,
  fx: 6,
  fy: -18.5,
  sa: -0.9,
  bs: 1,
  bx: 5,
  by: -21.5,
  ffx: 4.5,
  bfx: -4.5,
};

/**
 * The reload: the blade tips up, the cylinder swings out (`bs` to 1), the far thumb feeds rounds in twice, and a flick of
 * the wrist snaps it shut on `RELOAD.loaded`; the blade drops back to the ready stance.
 */
export const RELOAD_CLIP: ActionClip = {
  dur: RELOAD.dur,
  hit: RELOAD.loaded,
  keys: [
    [0, READY],
    [frame(2), pose({ ...READY, fx: 6.2, fy: -18, sa: -0.5, bs: 0.35, bx: 1.5, by: -17.5 })],
    [frame(4), pose(OPEN)],
    [frame(6), pose({ ...OPEN, bx: 5.6, by: -22.2, ny: -23.2 })],
    [frame(8), pose({ ...OPEN, bx: 4.4, by: -21 })],
    [frame(10), pose({ ...OPEN, bx: 5.6, by: -22.3, ny: -23.2 })],
    [RELOAD.loaded - 0.001, pose({ ...OPEN, bx: 4.8, by: -21.2 })],
    [
      RELOAD.loaded,
      pose({ ...READY, hy: -13.8, nx: 1.2, ny: -23.8, fx: 8, fy: -19.5, sa: -0.25, bx: -2.5, by: -16.5 }),
      "snap",
    ],
    [RELOAD.loaded + frame(2), pose({ ...READY, fx: 7.8, fy: -18.5, sa: 0.05 })],
    [RELOAD.dur, READY],
  ],
};

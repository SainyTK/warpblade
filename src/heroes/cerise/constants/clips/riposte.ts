import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose } from "../../../../types/pose";
import { EN_GARDE } from "./base";

const g = (o: Partial<Pose>): Pose => pose({ ...EN_GARDE, ...o });

/**
 * A riposte link: out of the parry's high line the point drops onto the line and drives straight in on frame 2, held
 * through the hit-stop, then drawn back to en garde, so the next link can start from where this one left the body.
 */
export const RIPOSTE_CLIP: ActionClip = {
  dur: frame(10),
  hit: frame(2),
  keys: [
    [0, g({ hx: -1, nx: 0.5, fx: 8, fy: -20.5, sa: -0.55, bx: -6.5, by: -22.5 })],
    [frame(1), g({ hx: -1.3, nx: -0.5, fx: 6, fy: -19, sa: -0.15, bx: -7, by: -23 })],
    [
      frame(2),
      g({ hx: 2, hy: -12.3, nx: 5, ny: -21.8, cb: 0.7, fx: 19, fy: -18, sa: 0, bx: -8.5, by: -18.5, ffx: 8 }),
      "snap",
    ],
    [
      frame(5),
      g({ hx: 2.2, hy: -12.2, nx: 5.2, ny: -21.7, cb: 0.8, fx: 19.5, fy: -17.8, sa: 0.02, bx: -8.5, by: -18, ffx: 8 }),
    ],
    [frame(7), g({ hx: 1, nx: 2.5, fx: 13, sa: -0.05, bx: -7, by: -20.5, ffx: 7 })],
    [frame(10), EN_GARDE],
  ],
};

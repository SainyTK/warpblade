import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { m, STANCE } from "./stance";

/**
 * Her weight before and after travel: the jump's push-off, and the landing that takes the fall on bent knees with the
 * staff's foot dropping toward the floor, then rises back into the stance her idle starts from.
 */
export const MIREL_SETTLE: Record<"takeoff" | "land", ActionClip> = {
  /** the knees bend and the staff hand drops as she sinks to push off */
  takeoff: {
    dur: frame(2),
    hit: 0,
    keys: [
      [0, STANCE],
      [frame(1), m({ hy: -13, nx: 1, ny: -23, cb: 0.3, fx: 6.3, fy: -15, sa: -1.43, by: -12.3 })],
      [frame(2), m({ hy: -11.8, nx: 1.6, ny: -21.8, cb: 0.7, fx: 6.6, fy: -13.8, sa: -1.4, by: -11.4, ba: 0.2 })],
    ],
  },
  land: {
    dur: frame(7),
    hit: 0,
    keys: [
      [
        0,
        m({ hy: -12.5, nx: 1.5, ny: -22.5, cb: 0.4, fx: 7, fy: -16, sa: -1.32, bx: 4.5, by: -13.5, ffx: 4, bfx: -3 }),
      ],
      [
        frame(2),
        m({ hx: 0.5, hy: -10.5, nx: 2.5, ny: -20.5, cb: 1, fx: 7.5, fy: -13.5, sa: -1.38, bx: 4.5, by: -11, ffx: 4.5 }),
      ],
      [
        frame(4),
        m({ hy: -12.5, nx: 1.2, ny: -22.5, cb: 0.5, fx: 6.5, fy: -15, sa: -1.43, bx: 4.2, by: -12.5, ffx: 3.5 }),
      ],
      [frame(7), STANCE],
    ],
  },
};

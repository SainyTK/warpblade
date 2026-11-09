import type { StaffBlow } from "../../../types/mirel";
import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { STAFF_BLOWS } from "../../mirel/string";
import { HANG_LEGS, m, STANCE } from "./stance";

/**
 * Her staff string. Each blow draws the staff back the other way first, snaps to a new silhouette on its hit frame,
 * follows through and settles back to the stance, so the next blow starts where this one left her.
 */
export const STAFF_CLIPS: Record<StaffBlow, ActionClip> = {
  /** two calm frames drawing the staff back level at the hip, a snap to full reach, three frames of follow-through */
  tick: {
    dur: STAFF_BLOWS.tick.dur,
    hit: STAFF_BLOWS.tick.hit,
    keys: [
      [0, STANCE],
      [frame(2), m({ nx: -0.5, hx: -0.5, fx: 1, fy: -14, sa: 0.05, bx: -2, by: -14, be: 0, ffx: 4, bfx: -3 })],
      [frame(3), m({ nx: -1, hx: -1, cb: -0.5, fx: 0, fy: -14, sa: 0.05, bx: -3, by: -14, be: 0, ffx: 4, bfx: -3 })],
      [
        frame(4),
        m({ nx: 3, hx: 1, cb: 1, ny: -23.5, fx: 11, fy: -14, sa: 0, bx: 5, by: -15, be: 0, ffx: 6, bfx: -4, ba: 0.3 }),
        "snap",
      ],
      [
        frame(6),
        m({ nx: 2.5, hx: 1, cb: 0.8, ny: -23.5, fx: 10, fy: -14, sa: 0.04, bx: 5, by: -15, be: 0, ffx: 6, bfx: -4 }),
      ],
      [frame(9), STANCE],
    ],
  },
  /** a crouch with the staff low ahead, one curve up and over, the staff resting on her shoulder two frames */
  tock: {
    dur: STAFF_BLOWS.tock.dur,
    hit: STAFF_BLOWS.tock.hit,
    keys: [
      [0, STANCE],
      [
        frame(2),
        m({ hy: -12.5, ny: -22.5, nx: 1.5, cb: 0.5, fx: 8, fy: -10, sa: 0.45, bx: 4, by: -11, ffx: 5, bfx: -3 }),
      ],
      [frame(4), m({ hy: -12, ny: -22, nx: 2, cb: 0.8, fx: 9, fy: -9, sa: 0.55, bx: 5, by: -10, ffx: 5, bfx: -4 })],
      [
        frame(5),
        m({ hy: -14.5, ny: -25, nx: 0.5, cb: -0.8, fx: 4, fy: -27, sa: -1.75, bx: 1, by: -24, be: 1, ffx: 4, bfx: -3 }),
        "snap",
      ],
      [
        frame(7),
        m({ hy: -14.5, ny: -24.8, nx: 0, cb: -0.8, fx: 2, fy: -24, sa: -2.4, bx: 0, by: -21, ffx: 4, bfx: -3 }),
      ],
      [
        frame(9),
        m({ hy: -14.2, ny: -24.5, nx: 0, cb: -0.5, fx: 2, fy: -23, sa: -2.5, bx: 1, by: -19, ffx: 4, bfx: -3 }),
      ],
      [frame(11), STANCE],
    ],
  },
  /** four calm frames lifting the staff in both hands, the plant with the ring ringing, four frames of settle */
  toll: {
    dur: STAFF_BLOWS.toll.dur,
    hit: STAFF_BLOWS.toll.hit,
    keys: [
      [0, STANCE],
      [frame(2), m({ ny: -24.3, nx: 0, fx: 6, fy: -21, sa: -1.5, bx: 4, by: -19, be: 1, ffx: 3, bfx: -3 })],
      [
        frame(4),
        m({ ny: -24.6, nx: -0.5, cb: -0.5, fx: 5, fy: -25, sa: -1.55, bx: 3, by: -23, be: 1, ffx: 3, bfx: -3 }),
      ],
      [
        frame(6),
        m({ ny: -24.8, nx: -0.5, cb: -0.6, fx: 5, fy: -26, sa: -1.55, bx: 3, by: -24, be: 1, ffx: 4, bfx: -3 }),
      ],
      [
        frame(7),
        m({ hy: -12.5, ny: -22.5, nx: 2.5, cb: 1, fx: 10, fy: -12, sa: -1.35, bx: 8, by: -14, be: 0, ffx: 6, bfx: -4 }),
        "snap",
      ],
      [
        frame(9),
        m({ hy: -12.8, ny: -22.8, nx: 2.2, cb: 0.9, fx: 10, fy: -12.5, sa: -1.38, bx: 8, by: -14.5, ffx: 6, bfx: -4 }),
      ],
      [
        frame(12),
        m({ hy: -13.5, ny: -23.5, nx: 1.2, cb: 0.4, fx: 8, fy: -14.5, sa: -1.42, bx: 6, by: -14, ffx: 4, bfx: -3 }),
      ],
      [frame(16), STANCE],
    ],
  },
  /** in the air: the staff raised, then swung down and ahead in one arc, legs together */
  pendant: {
    dur: STAFF_BLOWS.pendant.dur,
    hit: STAFF_BLOWS.pendant.hit,
    keys: [
      [0, m({ ...HANG_LEGS, fx: 6, fy: -22, sa: -1.2, bx: 3, by: -19 })],
      [frame(2), m({ ...HANG_LEGS, nx: -0.5, cb: -0.6, fx: 3, fy: -28, sa: -1.9, bx: 1, by: -24, be: 1 })],
      [frame(3), m({ ...HANG_LEGS, nx: -1, cb: -0.8, fx: 2, fy: -29, sa: -2.1, bx: 0, by: -25, be: 1 })],
      [frame(4), m({ ...HANG_LEGS, nx: 3, cb: 1.2, fx: 10, fy: -15, sa: 0.95, bx: 7, by: -16, be: 0 }), "snap"],
      [frame(6), m({ ...HANG_LEGS, nx: 2.5, cb: 1, fx: 9, fy: -14, sa: 1.15, bx: 6, by: -15 })],
      [frame(10), m({ ...HANG_LEGS, fx: 7, fy: -18, sa: -0.15, bx: 3, by: -18 })],
    ],
  },
};

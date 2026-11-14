import { frame, pose } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";
import { BREAK_FIRST, BREAK_GAP } from "../ultimate";
import { CALDER_READY as READY } from "./ready";

/** a falling cut, the blade down and forward past the foe */
const LOW = pose({
  hx: 3.5,
  hy: -11.2,
  nx: 7,
  ny: -20.8,
  cb: 1.2,
  fx: 16,
  fy: -12,
  sa: 0.95,
  bx: -6,
  by: -17,
  ffx: 11,
  bfx: -7,
  bfy: -1,
  ba: 0.6,
});
/** a rising cut, the blade up over the foe */
const HIGH = pose({
  hx: 2,
  hy: -14.8,
  nx: 4,
  ny: -25,
  cb: 1.4,
  fx: 12,
  fy: -26,
  sa: -1.1,
  bx: -6,
  by: -19,
  ffx: 9,
  bfx: -6,
  ba: 0.3,
});

/** Cylinder Break's wind-up: the cylinder spun with the thumb and the blade hauled back, held to the first cut */
export const BREAK_START: ActionClip = {
  dur: BREAK_FIRST,
  hit: BREAK_FIRST,
  keys: [
    [0, READY],
    [
      frame(2),
      pose({
        hx: -2.5,
        hy: -12.6,
        nx: -3,
        ny: -22.6,
        cb: -1.6,
        fx: -2,
        fy: -25,
        sa: -2.4,
        bs: 0.3,
        bx: 2,
        by: -21,
        ffx: 7,
        ffy: -2,
        fa: 0.4,
        bfx: -5,
        ba: 0.4,
      }),
    ],
    [
      BREAK_FIRST,
      pose({
        hx: -2.8,
        hy: -12.4,
        nx: -3.6,
        ny: -22.4,
        cb: -1.8,
        fx: -2.6,
        fy: -26,
        sa: -2.5,
        bx: 3,
        by: -21.5,
        ffx: 7,
        ffy: -2.5,
        fa: 0.5,
        bfx: -5,
        ba: 0.4,
      }),
    ],
  ],
};

/**
 * Cylinder Break's run of cuts, one pair of cuts long and looped: each cut snaps from the last one's end, falling then
 * rising, each with its round's blast, and the last flows into the first.
 */
export const BREAK_LOOP: ActionClip = {
  dur: BREAK_GAP * 2,
  hit: 0,
  keys: [
    [0, LOW, "snap"],
    [BREAK_GAP * 0.6, pose({ ...LOW, fy: -10.5, sa: 1.15, cb: 1.4 })],
    [BREAK_GAP, HIGH, "snap"],
    [BREAK_GAP * 1.6, pose({ ...HIGH, fy: -27.5, sa: -1.35 })],
  ],
};

/** after the last cut: the blade swung down and back onto the shoulder as the chamber reloads */
export const BREAK_END: ActionClip = {
  dur: frame(12),
  hit: 0,
  keys: [
    [0, HIGH],
    [
      frame(4),
      pose({
        hx: 0.5,
        hy: -13.5,
        nx: 1.5,
        ny: -23.5,
        fx: 7,
        fy: -19,
        sa: -1.9,
        bs: 1,
        bx: 4,
        by: -20,
        ffx: 6,
        bfx: -5,
      }),
    ],
    [
      frame(8),
      pose({
        hx: 0,
        hy: -13.7,
        nx: 1,
        ny: -23.7,
        fx: 6,
        fy: -19.5,
        sa: -2.3,
        bs: 0,
        bx: -2.5,
        by: -15,
        ffx: 5,
        bfx: -4.5,
      }),
    ],
    [frame(12), READY],
  ],
};

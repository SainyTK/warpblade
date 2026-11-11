import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { y, yFree } from "./stanceBase";

/** the glaive trailing low behind her in the near hand, its point near the floor */
const TRAIL = { fx: 2, fy: -12, sa: 2.75 } as const;

/**
 * Ysra on her feet and in the air. Walk and run hold one stride each, sampled by the stride's phase.
 */
export const STANCE_FEET_CLIPS = {
  /** heavy breathing in her guard: two deep breaths, the shoulders heaving and the blade rising and sinking with them */
  idle: {
    dur: frame(48),
    hit: 0,
    keys: [
      [0, y({})],
      [frame(4), y({ ny: -23.5, cb: 0, fy: -16.5, sa: -0.88 })],
      [frame(8), y({ hy: -13.5, ny: -24, cb: 0.5, nx: 1, fy: -17, sa: -0.92 })],
      [frame(12), y({ hy: -13.5, ny: -24, cb: 0.5, nx: 1, fy: -17, sa: -0.92 })],
      [frame(16), y({ hy: -12.5, ny: -22.5, cb: -1, nx: 2, fy: -15.5, sa: -0.82 })],
      [frame(20), y({ hy: -12.5, ny: -22.5, cb: -1, nx: 2, fy: -15.5, sa: -0.8 })],
      [frame(24), y({})],
      [frame(28), y({ ny: -23.5, cb: 0, fy: -16.5, sa: -0.88, bfx: -5.5 })],
      [frame(32), y({ hy: -13.5, ny: -24, cb: 0.5, nx: 1, fy: -17, sa: -0.93, bfx: -5.5 })],
      [frame(36), y({ hy: -13.5, ny: -24, cb: 0.5, nx: 1, fy: -17, sa: -0.93, bfx: -5.5 })],
      [frame(40), y({ hy: -12.5, ny: -22.5, cb: -1, nx: 2, fy: -15.5, sa: -0.81 })],
      [frame(44), y({ hy: -12.5, ny: -22.5, cb: -1, nx: 2, fy: -15.5, sa: -0.8 })],
    ],
  },
  /** planted, heavy steps: each foot lands flat and the hips sink onto it, the glaive dragging low behind, the far arm swinging */
  walk: {
    dur: frame(24),
    hit: 0,
    keys: [
      [0, yFree({ ...TRAIL, hy: -12, nx: 3, ny: -22, bx: 4, by: -15, ffx: 6, fa: 0, bfx: -5, bfy: 0, ba: 0.3 })],
      [
        frame(2),
        yFree({ ...TRAIL, hy: -11.5, nx: 3, ny: -21.5, bx: 4.5, by: -14.5, ffx: 5, bfx: -6, bfy: -0.5, ba: 0.5 }),
      ],
      [frame(4), yFree({ ...TRAIL, hy: -12.5, nx: 3, ny: -22.5, bx: 3, by: -15, ffx: 3, bfx: -4, bfy: -2.5, ba: 0.3 })],
      [
        frame(6),
        yFree({
          ...TRAIL,
          fy: -12.5,
          hy: -13.5,
          nx: 3,
          ny: -23.5,
          bx: 1,
          by: -15.5,
          ffx: 1,
          bfx: -1,
          bfy: -3.5,
          ba: 0,
        }),
      ],
      [
        frame(8),
        yFree({
          ...TRAIL,
          fy: -12.5,
          hy: -13.5,
          nx: 3,
          ny: -23.5,
          bx: -1,
          by: -15.5,
          ffx: -1,
          bfx: 2,
          bfy: -3,
          ba: -0.2,
        }),
      ],
      [
        frame(10),
        yFree({
          ...TRAIL,
          hy: -13,
          nx: 3,
          ny: -23,
          bx: -2.5,
          by: -15,
          ffx: -3,
          fa: 0.2,
          bfx: 4.5,
          bfy: -1.5,
          ba: -0.3,
        }),
      ],
      [
        frame(12),
        yFree({ ...TRAIL, hy: -12, nx: 3, ny: -22, bx: -4, by: -15, ffx: -5, fa: 0.3, bfx: 6, bfy: 0, ba: 0 }),
      ],
      [
        frame(14),
        yFree({ ...TRAIL, hy: -11.5, nx: 3, ny: -21.5, bx: -4.5, by: -14.5, ffx: -6, ffy: -0.5, fa: 0.5, bfx: 5 }),
      ],
      [
        frame(16),
        yFree({ ...TRAIL, hy: -12.5, nx: 3, ny: -22.5, bx: -3, by: -15, ffx: -4, ffy: -2.5, fa: 0.3, bfx: 3 }),
      ],
      [
        frame(18),
        yFree({
          ...TRAIL,
          fy: -12.5,
          hy: -13.5,
          nx: 3,
          ny: -23.5,
          bx: -1,
          by: -15.5,
          ffx: -1,
          ffy: -3.5,
          fa: 0,
          bfx: 1,
        }),
      ],
      [
        frame(20),
        yFree({
          ...TRAIL,
          fy: -12.5,
          hy: -13.5,
          nx: 3,
          ny: -23.5,
          bx: 1,
          by: -15.5,
          ffx: 2,
          ffy: -3,
          fa: -0.2,
          bfx: -1,
        }),
      ],
      [
        frame(22),
        yFree({ ...TRAIL, hy: -13, nx: 3, ny: -23, bx: 2.5, by: -15, ffx: 4.5, ffy: -1.5, fa: -0.3, bfx: -3, ba: 0.2 }),
      ],
    ],
  },
  /** the Warpath charge: shoulder dropped and head down, the glaive tucked back along the body in both hands, long driving strides */
  run: {
    dur: frame(16),
    hit: 0,
    keys: [
      [
        0,
        y(
          {
            hx: 1,
            hy: -12,
            cb: 1,
            nx: 7,
            ny: -20.5,
            fx: 2,
            fy: -14,
            sa: 2.95,
            ffx: 8,
            ffy: -1,
            fa: -0.2,
            bfx: -7,
            bfy: -1,
            ba: 0.6,
          },
          -5,
        ),
      ],
      [
        frame(2),
        y(
          { hx: 1, hy: -11.5, cb: 1, nx: 7, ny: -20, fx: 2, fy: -13.5, sa: 2.95, ffx: 6, bfx: -8, bfy: -3, ba: 0.8 },
          -5,
        ),
      ],
      [
        frame(4),
        y(
          { hx: 1, hy: -12.5, cb: 1, nx: 7.5, ny: -21, fx: 2, fy: -14.5, sa: 2.95, ffx: 2, bfx: -4, bfy: -6, ba: 0.4 },
          -5,
        ),
      ],
      [
        frame(6),
        y(
          {
            hx: 1,
            hy: -13,
            cb: 1,
            nx: 7.5,
            ny: -21.5,
            fx: 2,
            fy: -15,
            sa: 2.95,
            ffx: -3,
            ffy: -1,
            fa: 0.4,
            bfx: 3,
            bfy: -5,
            ba: -0.2,
          },
          -5,
        ),
      ],
      [
        frame(8),
        y(
          {
            hx: 1,
            hy: -12,
            cb: 1,
            nx: 7,
            ny: -20.5,
            fx: 2,
            fy: -14,
            sa: 2.95,
            ffx: -7,
            ffy: -1,
            fa: 0.6,
            bfx: 8,
            bfy: -1,
            ba: -0.2,
          },
          -5,
        ),
      ],
      [
        frame(10),
        y(
          { hx: 1, hy: -11.5, cb: 1, nx: 7, ny: -20, fx: 2, fy: -13.5, sa: 2.95, ffx: -8, ffy: -3, fa: 0.8, bfx: 6 },
          -5,
        ),
      ],
      [
        frame(12),
        y(
          { hx: 1, hy: -12.5, cb: 1, nx: 7.5, ny: -21, fx: 2, fy: -14.5, sa: 2.95, ffx: -4, ffy: -6, fa: 0.4, bfx: 2 },
          -5,
        ),
      ],
      [
        frame(14),
        y(
          {
            hx: 1,
            hy: -13,
            cb: 1,
            nx: 7.5,
            ny: -21.5,
            fx: 2,
            fy: -15,
            sa: 2.95,
            ffx: 3,
            ffy: -5,
            fa: -0.2,
            bfx: -3,
            bfy: -1,
            ba: 0.4,
          },
          -5,
        ),
      ],
    ],
  },
  /** the heavy jump: a squat that loads the legs, a deep push off the floor onto the toes, then the knees drawn up and
   *  the glaive hoisted flat over her head */
  jump: {
    dur: frame(12),
    hit: 0,
    keys: [
      [0, y({ hy: -11, cb: 1, nx: 3.5, ny: -20.5, fx: 7, fy: -17, sa: -0.4, ffx: 3, bfx: -3 }, 7)],
      [
        frame(2),
        y(
          { hy: -15, nx: 2.5, ny: -25, fx: 7, fy: -21, sa: -0.5, ffx: 2, ffy: 0, fa: 0.8, bfx: -2, bfy: 0, ba: 0.8 },
          7,
        ),
      ],
      [
        frame(4),
        y(
          { hy: -15, nx: 2, ny: -25, fx: 6, fy: -25, sa: -0.25, ffx: 3, ffy: -3, fa: 0.5, bfx: -3, bfy: -1, ba: 0.6 },
          8,
        ),
      ],
      [
        frame(6),
        y(
          { hy: -15, nx: 1.5, ny: -25, fx: 5, fy: -28, sa: -0.15, ffx: 4, ffy: -6, fa: 0.3, bfx: -3, bfy: -3, ba: 0.5 },
          8,
        ),
      ],
      [
        frame(8),
        y(
          {
            hy: -15,
            cb: 0.5,
            nx: 1.5,
            ny: -25,
            fx: 5,
            fy: -28.5,
            sa: -0.12,
            ffx: 4.5,
            ffy: -7,
            fa: 0.2,
            bfx: -2.5,
            bfy: -4,
            ba: 0.4,
          },
          8,
        ),
      ],
      [
        frame(10),
        y(
          {
            hy: -15,
            cb: 0.5,
            nx: 1.5,
            ny: -25,
            fx: 5,
            fy: -28.5,
            sa: -0.1,
            ffx: 4.5,
            ffy: -7.5,
            fa: 0.2,
            bfx: -2.5,
            bfy: -4.5,
            ba: 0.4,
          },
          8,
        ),
      ],
      [
        frame(12),
        y(
          {
            hy: -15,
            cb: 0.5,
            nx: 1.5,
            ny: -25,
            fx: 5,
            fy: -28,
            sa: -0.12,
            ffx: 4.5,
            ffy: -7,
            fa: 0.2,
            bfx: -2.5,
            bfy: -4,
            ba: 0.4,
          },
          8,
        ),
      ],
    ],
  },
  /** coming down: the glaive swung down to point ahead and low, the legs stretched for the floor */
  fall: {
    dur: frame(12),
    hit: 0,
    keys: [
      [0, y({ hy: -15, nx: 1.5, ny: -25, fx: 5, fy: -27, sa: -0.1, ffx: 4.5, ffy: -6, bfx: -2.5, bfy: -4 }, 8)],
      [frame(2), y({ hy: -15, nx: 2, ny: -25, fx: 7, fy: -23, sa: 0.3, ffx: 4.5, ffy: -5, bfx: -3, bfy: -3 }, 7)],
      [
        frame(4),
        y(
          {
            hy: -15,
            nx: 2.5,
            ny: -25,
            fx: 8,
            fy: -19,
            sa: 0.65,
            ffx: 4,
            ffy: -3,
            fa: 0.3,
            bfx: -3.5,
            bfy: -2,
            ba: 0.4,
          },
          6,
        ),
      ],
      [
        frame(6),
        y(
          {
            hy: -15,
            nx: 2.5,
            ny: -25,
            fx: 8,
            fy: -18,
            sa: 0.75,
            ffx: 4,
            ffy: -2,
            fa: 0.4,
            bfx: -4,
            bfy: -1.5,
            ba: 0.5,
          },
          6,
        ),
      ],
      [
        frame(9),
        y(
          {
            hy: -15,
            nx: 2.5,
            ny: -25.5,
            fx: 8,
            fy: -18.5,
            sa: 0.72,
            ffx: 4,
            ffy: -1.5,
            fa: 0.5,
            bfx: -4.5,
            bfy: -1,
            ba: 0.5,
          },
          6,
        ),
      ],
      [
        frame(12),
        y(
          {
            hy: -15,
            nx: 2.5,
            ny: -25,
            fx: 8,
            fy: -18,
            sa: 0.75,
            ffx: 4,
            ffy: -1,
            fa: 0.5,
            bfx: -4.5,
            bfy: -1,
            ba: 0.5,
          },
          6,
        ),
      ],
    ],
  },
} satisfies Record<string, ActionClip>;

import type { ActionClip, Pose } from "../../../types/pose";
import { frame } from "../../hero";
import { ACTION_CLIPS } from "../actions";
import { LOCOMOTION_CLIPS } from "../locomotion";
import { y, yFree } from "./stanceBase";

/** the follow-through after the glaive: the throwing arm whipped through low across the front, the far arm swung back,
 *  the chest over the front foot */
const THROWN: Pose = yFree({
  hx: 2,
  hy: -12,
  cb: 1.5,
  nx: 6,
  ny: -21.5,
  fx: 10,
  fy: -15,
  sa: 0.4,
  bx: -6,
  by: -18,
  ffx: 8,
  bfx: -7,
  bfy: -0.5,
  ba: 0.8,
});

/** the glaive driven point first into the foe or the floor ahead, her hands low on the haft as she lands on it */
const ON_HAFT: Pose = y({
  hx: 1,
  hy: -10,
  cb: 1.5,
  nx: 5,
  ny: -19.5,
  fx: 9,
  fy: -14,
  sa: 0.9,
  ffx: 8,
  bfx: -7,
  ba: 0.8,
});

/** the shared times the warp and the dodge run on, so her clips line up with them */
const { throw: THROW, warpStrike: WARP_STRIKE } = ACTION_CLIPS;
const DASH = LOCOMOTION_CLIPS.dash;

/** Ysra's warp, the glaive hurled like a javelin and wrenched free on arrival, and her front dodge */
export const STANCE_WARP_CLIPS = {
  /** drawn back over the shoulder in one hand, the far hand pointing at the mark, then whipped forward off the front
   *  foot; the times match the shared throw, so the glaive leaves on the same frame */
  throw: {
    dur: THROW.dur,
    hit: THROW.hit,
    keys: [
      [0, y({ hy: -13, nx: 1, ny: -23, fx: 4, fy: -19, sa: -0.5, ffx: 5, bfx: -5 })],
      [
        frame(1),
        yFree({
          hx: -1,
          hy: -13,
          cb: -1,
          nx: -1,
          ny: -23.5,
          fx: -3,
          fy: -24,
          sa: -0.25,
          bx: 6,
          by: -20,
          ffx: 6,
          bfx: -6,
        }),
      ],
      [
        frame(2),
        yFree({
          hx: -1.5,
          hy: -12.5,
          cb: -1.5,
          nx: -2.5,
          ny: -23,
          fx: -6,
          fy: -25,
          sa: -0.2,
          bx: 7,
          by: -21,
          ffx: 7,
          bfx: -6,
          ba: 0.3,
        }),
      ],
      [frame(3), THROWN, "snap"],
      [THROW.dur, THROWN],
    ],
  },
  /** the throwing arm out after the glaive, breathing while it flies */
  throwWait: {
    dur: frame(36),
    hit: 0,
    keys: [
      [0, THROWN],
      [frame(18), { ...THROWN, hy: THROWN.hy + 0.5, ny: THROWN.ny + 0.5, fy: THROWN.fy + 1, by: THROWN.by + 0.5 }],
      [frame(36), THROWN],
    ],
  },
  /** she lands on the haft and wrenches the glaive up out of the foe and over her head, then settles into her stance */
  warpStrike: {
    dur: WARP_STRIKE.dur,
    hit: 0,
    keys: [
      [0, ON_HAFT],
      [
        frame(1),
        y({ hx: 1, hy: -11, cb: 1, nx: 4.5, ny: -20.5, fx: 9, fy: -17, sa: 0.3, ffx: 8, bfx: -7, ba: 0.7 }),
        "snap",
      ],
      [frame(2), y({ hy: -13, cb: 0.5, nx: 3, ny: -23, fx: 7, fy: -22, sa: -0.8, ffx: 7, bfx: -6, ba: 0.4 })],
      [frame(4), y({ hy: -14, cb: -0.5, nx: 1, ny: -24.5, fx: 3, fy: -27, sa: -1.9, ffx: 6, bfx: -6 })],
      [frame(6), y({ hy: -14, cb: -0.5, nx: 1, ny: -24.5, fx: 3, fy: -27, sa: -2, ffx: 6, bfx: -6 })],
      [frame(9), y({ hy: -13.5, nx: 1.5, ny: -23.5, fx: 5, fy: -20, sa: -1.1, ffx: 5.5, bfx: -5.5 })],
      [WARP_STRIKE.dur, y({})],
    ],
  },
  /** low and flat along the floor, the glaive carried point first ahead of her in both hands, braking on the front heel */
  dash: {
    dur: DASH.dur,
    hit: 0,
    keys: [
      [0, y({ hx: 0.5, hy: -12.5, cb: 0.5, nx: 4, ny: -21.5, fx: 7, fy: -14, sa: 0.3, ffx: 5, bfx: -6, ba: 0.6 })],
      [
        frame(1),
        y({
          hx: 1,
          hy: -11.5,
          cb: 1,
          nx: 6,
          ny: -20.5,
          fx: 9,
          fy: -13,
          sa: 0.2,
          ffx: 6,
          ffy: -0.5,
          bfx: -7.5,
          bfy: -1,
          ba: 0.9,
        }),
      ],
      [
        frame(3),
        y({
          hx: 1.5,
          hy: -11,
          cb: 1.5,
          nx: 7.5,
          ny: -19.5,
          fx: 10,
          fy: -12.5,
          sa: 0.15,
          ffx: 6.5,
          ffy: -1.5,
          fa: -0.2,
          bfx: -8.5,
          bfy: -2.5,
          ba: 1.1,
        }),
      ],
      [
        frame(6),
        y({ hx: 1, hy: -11.5, cb: 1, nx: 6, ny: -20.5, fx: 9, fy: -13, sa: 0.2, ffx: 7, fa: -0.3, bfx: -7, ba: 0.8 }),
      ],
      [
        frame(8),
        y({ hx: 0.5, hy: -12.5, cb: 0.5, nx: 3, ny: -22, fx: 7, fy: -14.5, sa: 0.3, ffx: 6, bfx: -6, ba: 0.4 }),
      ],
      [DASH.dur, y({ hy: -13.5, nx: 0.5, ny: -23.5, fx: 6, fy: -15.5, sa: 0.35, ffx: 5, bfx: -5 })],
    ],
  },
} satisfies Record<string, ActionClip>;

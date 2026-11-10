import type { ActionClip, Pose } from "../../../types/pose";
import { frame } from "../../hero";
import { SMOKE_KNOT, SPELL_CAST } from "../../tallis/abilities";
import { SINK } from "../../tallis/sink";
import { CHARGE_POSE, STANCE, s } from "./stance";

/** the body pouring down into the pool: the knees bend and the cloak folds in as he sinks, three frames */
export const SINK_POUR: ActionClip = {
  dur: SINK.pour,
  hit: 0,
  keys: [
    [0, STANCE],
    [frame(1), s({ hy: -10.5, ny: -20, nx: 1.5, cb: 1, fx: 5, fy: -12, bx: 4, by: -15, ffx: 5, bfx: -5 })],
    [
      frame(3),
      s({ hx: -0.5, hy: -6.5, ny: -14, nx: 1.5, cb: 1.4, fx: 4, fy: -5, sa: 2.6, bx: 3, by: -7, ffx: 6, bfx: -6 }),
    ],
  ],
};

/** the rise out of the pool: the pour run backwards, from the crouch up into the stance */
export const SINK_RISE: ActionClip = {
  dur: SINK.rise,
  hit: 0,
  keys: [
    [0, s({ hx: -0.5, hy: -6.5, ny: -14, nx: 1.5, cb: 1.4, fx: 4, fy: -5, sa: 2.6, bx: 3, by: -7, ffx: 6, bfx: -6 })],
    [frame(2), s({ hy: -10, ny: -19.5, nx: 1.8, cb: 1, fx: 5, fy: -12, bx: 4, by: -15, ffx: 5, bfx: -5 })],
    [SINK.rise, STANCE],
  ],
};

/** Smoke Knot: the near hand dips to his feet and lets the knot fall, then he comes back up into the stance */
export const KNOT_CLIP: ActionClip = {
  dur: SMOKE_KNOT.dur,
  hit: SMOKE_KNOT.hit,
  keys: [
    [0, STANCE],
    [frame(2), s({ hy: -11, ny: -20.5, cb: 1, fx: 7, fy: -10, sa: 2.2 })],
    [frame(4), s({ hy: -10.5, ny: -20, cb: 1.1, fx: 8, fy: -5, sa: 2.8, fe: 1 }), "snap"],
    [frame(6), s({ hy: -11, ny: -20.5, cb: 0.9, fx: 7, fy: -8, sa: 2.4 })],
    [frame(9), STANCE],
  ],
};

/** a spell skill: the far hand flung forward, open, the spell leaving it on its frame */
export const SPELL_CLIP: ActionClip = {
  dur: SPELL_CAST.dur,
  hit: SPELL_CAST.hit,
  keys: [
    [0, STANCE],
    [frame(2), s({ nx: 1, cb: 0.2, bx: 0, by: -20, be: 1, fx: 4, fy: -17 })],
    [frame(4), s({ nx: 3.5, cb: 1.2, bx: 11.5, by: -18.5, be: 0, fx: 3, fy: -17, ffx: 5.5, bfx: -5 }), "snap"],
    [frame(6), s({ nx: 3.2, cb: 1.1, bx: 11, by: -18, be: 0, fx: 3.5, fy: -17, ffx: 5.5, bfx: -5 })],
    [frame(10), STANCE],
  ],
};

/** Gloaming's wind-up is the charge's crouch with the knives crossed */
export const GLOAM_CROUCH: Pose = CHARGE_POSE;

/** a Gloaming slash behind a foe: lunged in with the near knife swept through */
export const GLOAM_SLASH: Pose = s({
  hx: 0.5,
  hy: -11.5,
  nx: 4.5,
  ny: -21,
  cb: 1.4,
  fx: 12,
  fy: -15,
  sa: 0.1,
  bx: 7,
  by: -17,
  be: 0,
  ffx: 7,
  bfx: -5.5,
});

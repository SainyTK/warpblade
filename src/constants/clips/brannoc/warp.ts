import type { ActionClip, Pose } from "../../../types/pose";
import { CLIPS } from "../../clips";
import { frame } from "../../hero";
import { free, STANCE, s } from "./stance";

/** the axe wound up over his far shoulder for the hurl, the head down behind his back, weight on the back foot */
const WIND: Pose = s({
  hx: -1.6,
  hy: -13.4,
  cb: -0.9,
  nx: -0.8,
  ny: -23.6,
  fx: 0.4,
  fy: -25.6,
  sa: -2.75,
  ffx: 5.4,
  bfx: -4.4,
  ba: 0.3,
});
/** the hands a moment after the hurl, sinking a little */
const AFTER: Partial<Pose> = { fx: 11, fy: -16.6, bx: 9.4, by: -15.8 };

/** the hurl let go: both arms flung out in front at chest height, chest driven over the front knee */
const FLUNG: Partial<Pose> = {
  hx: 1.2,
  hy: -12.6,
  cb: 1.3,
  nx: 4.6,
  ny: -21.6,
  fx: 11.6,
  fy: -17.4,
  sa: -0.2,
  bx: 10,
  by: -16.4,
  ffx: 6.2,
  ffy: 0,
  fa: 0.2,
  bfx: -5.2,
  ba: 0.5,
};

/**
 * J held, the Hunt: the great axe wound up over the shoulder, then hurled two handed. The hurl lands on the frame before
 * the axe leaves the hands on the hit, so the flung pose is on screen as the throw ends.
 */
export const HUNT_THROW_CLIP: ActionClip = {
  dur: CLIPS.throw.dur,
  hit: CLIPS.throw.hit,
  keys: [
    [0, STANCE],
    [frame(1), WIND],
    [frame(1.8), free(FLUNG), "snap"],
    [CLIPS.throw.dur, free({ ...FLUNG, ...AFTER })],
  ],
};

/** while the axe flies: both hands still out after it, the chest heaving, ready to leap after it */
export const HUNT_WAIT_CLIP: ActionClip = {
  dur: frame(24),
  hit: 0,
  keys: [
    [0, free({ ...FLUNG, ...AFTER })],
    [frame(12), free({ ...FLUNG, ...AFTER, hy: -12.9, ny: -21.9, fy: -16.2, by: -15.4, cb: 1.1 })],
    [frame(24), free({ ...FLUNG, ...AFTER })],
  ],
};

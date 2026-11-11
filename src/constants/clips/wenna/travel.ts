import type { ActionClip, PoseKeyframe } from "../../../types/pose";
import { frame, pose } from "../../hero";
import { SWAP } from "../../wenna/swap";
import { STATE_CLIPS } from "../states";
import { m, STANCE } from "./stance";

/** frames of the jump clip her take-off crouch takes before the shared rise begins */
const TAKE_OFF = 2;

/** the knees bent deep and the arms dropped, the weight loaded onto both feet as she leaves the floor */
const CROUCH = pose({
  hy: -11.5,
  cb: 0.8,
  nx: 2.5,
  ny: -21.5,
  fx: 6,
  fy: -14,
  bx: -3.5,
  by: -13,
  ffx: 3.5,
  bfx: -3,
  ba: 0.5,
  sa: 0.6,
});

/**
 * Her jump: the shared rise, opened by a crouch that pushes off into it over the first frames, so the jump loads before
 * it travels. Its clock still follows the rise, so the last key lands on the top of the arc.
 */
export const WENNA_JUMP: ActionClip = {
  dur: STATE_CLIPS.jump.dur,
  hit: 0,
  keys: [
    [0, CROUCH],
    ...STATE_CLIPS.jump.keys.map(
      ([t, p]): PoseKeyframe => [
        frame(TAKE_OFF) + (t * (STATE_CLIPS.jump.dur - frame(TAKE_OFF))) / STATE_CLIPS.jump.dur,
        p,
      ],
    ),
  ],
};

/** gathered small as she vanishes and arrives, the pole drawn in close and upright, knees bent */
const GATHERED = m({
  hy: -12,
  ny: -21.6,
  nx: 1.5,
  cb: 0.6,
  fx: 5,
  fy: -15,
  sa: -1.5,
  bx: 4,
  by: -11.5,
  ffx: 4,
  bfx: -3,
});

/**
 * L: she sinks small as she vanishes, arrives gathered, sinks a little further into the weight of the arrival and rises
 * back to her stance through keyed poses
 */
export const SWAP_CLIP: ActionClip = {
  dur: SWAP.dur,
  hit: SWAP.gone,
  keys: [
    [0, GATHERED],
    [SWAP.gone, GATHERED],
    [
      SWAP.gone + frame(2),
      m({ hy: -11.2, ny: -20.9, nx: 2, cb: 0.8, fx: 5.4, fy: -14.4, sa: -1.45, bx: 4.3, by: -11, ffx: 4, bfx: -3 }),
    ],
    [
      SWAP.gone + frame(4),
      m({ hy: -12.8, ny: -22.7, nx: 1.4, cb: 0.2, fx: 5.6, fy: -16.2, sa: -1.4, ffx: 3.5, bfx: -2.8 }),
    ],
    [SWAP.dur, STANCE],
  ],
};

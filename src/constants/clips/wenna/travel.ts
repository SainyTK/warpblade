import type { ActionClip, PoseKeyframe } from "../../../types/pose";
import { frame, pose } from "../../hero";
import { STATE_CLIPS } from "../states";

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

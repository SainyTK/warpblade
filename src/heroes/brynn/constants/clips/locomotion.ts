import { STATE_CLIPS } from "../../../../constants/clips";
import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, PoseKeyframe } from "../../../../types/pose";
import { shouldered } from "./grip";

/** a shared stride or jump clip with Anvilheart on her shoulder: her body follows the shared gait, the sword rides */
const carried = (clip: ActionClip): ActionClip => ({
  ...clip,
  keys: clip.keys.map(([t, p, snap]): PoseKeyframe => (snap ? [t, shouldered(p), snap] : [t, shouldered(p)])),
});

/** at rest: weight on the far leg with the hip cocked, Anvilheart on her shoulder and the off hand on her hip */
const rest = (breath: number) =>
  shouldered(
    pose({
      hx: -0.5,
      hy: -14 + breath * 0.25,
      cb: -0.3 + breath * 0.4,
      nx: 0.5,
      ny: -24 + breath * 0.5,
      bx: -4.5,
      by: -13.5 + breath * 0.25,
      be: 1,
      ffx: 4,
      fa: -0.15,
      bfx: -3.5,
    }),
    -breath * 0.3,
  );

/** her free states: the idle, the walk, the run, the jump and the fall, each with the sword carried */
export const BRYNN_LOCOMOTION = {
  idle: {
    dur: frame(64),
    hit: 0,
    keys: [0, 0.3, 0.7, 1, 1, 0.8, 0.55, 0.3, 0.1, 0].map((b, i): PoseKeyframe => [frame(i * 7), rest(b)]),
  },
  walk: carried(STATE_CLIPS.walk),
  run: carried(STATE_CLIPS.run),
  jump: carried(STATE_CLIPS.jump),
  fall: carried(STATE_CLIPS.fall),
  /** the knees bent under her before a jump from a stand */
  crouch: {
    dur: 0,
    hit: 0,
    keys: [
      [0, shouldered(pose({ hy: -11.5, cb: 0.8, nx: 1.5, ny: -21.5, bx: -4, by: -13, ffx: 4.5, bfx: -4.5, ba: 0.2 }))],
    ],
  },
} satisfies Record<string, ActionClip>;

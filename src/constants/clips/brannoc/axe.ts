import type { AxeBlow } from "../../../types/brannoc";
import type { ActionClip, Pose } from "../../../types/pose";
import { AXE_BLOWS } from "../../brannoc/axe";
import { frame } from "../../hero";
import { STANCE, s } from "./stance";

/** the clip's length and first hit frame come from the blow's own numbers */
const timed = (blow: AxeBlow | "bloodiedCleave", keys: ActionClip["keys"]): ActionClip => ({
  dur: AXE_BLOWS[blow].dur,
  hit: AXE_BLOWS[blow].hits[0],
  keys,
});

/** Hew's load: the axe climbed over the far shoulder until its head is behind his head, weight on the back foot */
const HEW_LOAD_AT: Partial<Pose> = {
  hx: -1.3,
  hy: -13.6,
  cb: -0.7,
  nx: -0.4,
  ny: -24,
  fx: 1.2,
  fy: -25,
  sa: -2.6,
  ffx: 5.2,
  bfx: -4.2,
  ba: 0.2,
};
const HEW_LOAD = s(HEW_LOAD_AT);
/** Hew's bite: a diagonal chop from high behind to low in front, the head in the floor ahead, the front knee bent */
const HEW_BITE_AT: Partial<Pose> = {
  hx: 0.8,
  hy: -11.4,
  cb: 1.5,
  nx: 4.4,
  ny: -20.6,
  fx: 9.4,
  fy: -11.8,
  sa: 0.72,
  ffx: 6.4,
  bfx: -4.4,
  ba: 0.4,
};
const HEW_BITE = s(HEW_BITE_AT);

/** Reave's load: the axe low behind the hip, the torso twisted away from the foe */
const REAVE_LOAD_AT: Partial<Pose> = {
  hx: -1.2,
  hy: -12.8,
  cb: -0.8,
  nx: -1.4,
  ny: -22.4,
  fx: -4,
  fy: -13,
  sa: 2.85,
  ffx: 5.4,
  bfx: -4.6,
  fa: -0.2,
  ah: 1,
};
const REAVE_LOAD = s(REAVE_LOAD_AT);
/** Reave's sweep: flat at the waist, from behind him round to the front */
const REAVE_SWEEP_AT: Partial<Pose> = {
  hx: 0.8,
  hy: -13,
  cb: 0.9,
  nx: 3,
  ny: -22.8,
  fx: 9.6,
  fy: -17,
  sa: 0.04,
  ffx: 5.6,
  bfx: -4.4,
  ah: 1,
};
const REAVE_SWEEP = s(REAVE_SWEEP_AT);

/** the Cleave's load: the deepest crouch he has, the axe wound all the way back and down, head low */
const CLEAVE_LOAD_AT: Partial<Pose> = {
  hx: -0.8,
  hy: -10.2,
  cb: -1,
  nx: -1.6,
  ny: -19.6,
  fx: -5,
  fy: -12.2,
  sa: 2.7,
  ffx: 6.2,
  bfx: -6,
  ba: 0.3,
  ah: 1,
};
const CLEAVE_LOAD = s(CLEAVE_LOAD_AT);
/** the turn on the front foot: out in front, back to us, out behind (mirrored), and back again */
const TURN: Partial<Pose> = { hy: -12, cb: 0.5, nx: 1.4, ny: -21.6, fx: 10, fy: -16, sa: 0.05, ffx: 5.6, bfx: -5.6 };
const TURN_FRONT = s(TURN);
const TURN_BACK = s({ ...TURN, tw: 1, fx: 3 });
const TURN_BEHIND = s({ ...TURN, mr: 1 });
const TURN_AWAY = s({ ...TURN, mr: 1, tw: 1, fx: 3 });
/** the slam: the axe driven into the floor ahead, both knees bent */
const SLAM_AT: Partial<Pose> = {
  hx: 0.6,
  hy: -10.8,
  cb: 1.4,
  nx: 4,
  ny: -20,
  fx: 9,
  fy: -11,
  sa: 0.82,
  ffx: 6.4,
  bfx: -5.6,
  ba: 0.4,
};
const SLAM = s(SLAM_AT);
/** heaving the axe back out of the floor */
const HEAVE_AT: Partial<Pose> = {
  hx: -0.6,
  hy: -12.6,
  cb: 0.2,
  nx: 1.2,
  ny: -22.4,
  fx: 6.4,
  fy: -15.6,
  sa: -0.35,
  ffx: 5,
  bfx: -5,
};
const HEAVE = s(HEAVE_AT);

/** Hatchet Drop's tuck: knees drawn up, the axe raised straight overhead */
const TUCK_AT: Partial<Pose> = {
  hy: -16,
  ny: -25.6,
  nx: 1,
  cb: -0.4,
  fx: 2.4,
  fy: -27,
  sa: -1.7,
  ffx: 3,
  ffy: -5,
  fa: 0.4,
  bfx: -2.4,
  bfy: -3.6,
  ba: 0.5,
};
const TUCK = s(TUCK_AT);
/** Hatchet Drop's chop: straight down in front of him, held to the landing */
const DROP_AT: Partial<Pose> = {
  hy: -14.6,
  ny: -23.6,
  nx: 3,
  cb: 1.2,
  fx: 8.4,
  fy: -12.6,
  sa: 1.25,
  ffx: 4,
  ffy: -2,
  bfx: -3,
  bfy: -3,
  ba: 0.4,
};
const DROP = s(DROP_AT);

/**
 * His axe blows, to docs/motion-standard.md: each loads the other way for several calm frames, snaps to a new
 * silhouette on its hit frame, holds while the hit-stop runs, follows through and settles back into his stance, where
 * the next blow starts.
 */
export const AXE_CLIPS: Record<AxeBlow | "bloodiedCleave", ActionClip> = {
  /** the axe climbs over the far shoulder and holds three frames, then chops diagonally into the floor ahead */
  hew: timed("hew", [
    [0, STANCE],
    [frame(2), s({ hx: -0.8, cb: -0.2, nx: 0.6, fx: 3, fy: -22.5, sa: -2, ffx: 5 })],
    [frame(4), HEW_LOAD],
    [frame(7), s({ ...HEW_LOAD_AT, fy: -25.3, sa: -2.66 })],
    [frame(8), HEW_BITE, "snap"],
    [frame(10), s({ ...HEW_BITE_AT, hy: -11.2 })],
    [frame(13), s({ hx: 0.4, hy: -12.2, cb: 1, nx: 3.2, ny: -21.8, fx: 8, fy: -14, sa: 0.2, ffx: 5.6 })],
    [frame(16), s({ cb: 0.7, nx: 2, ny: -23, fx: 6, fy: -16.4, sa: -0.7 })],
    [frame(18), STANCE],
  ]),
  /** the axe dropped low behind the hip, then a flat sweep round from behind to the front, carried past the shoulder */
  reave: timed("reave", [
    [0, STANCE],
    [frame(2), s({ hx: -0.6, cb: -0.2, nx: 0.4, fx: 1, fy: -14, sa: 2.2, ah: 1 })],
    [frame(4), REAVE_LOAD],
    [frame(6), s({ ...REAVE_LOAD_AT, fx: -4.4, sa: 2.9 })],
    [frame(7), REAVE_SWEEP, "snap"],
    [
      frame(9),
      s({ hx: 0.6, hy: -13.2, cb: 0.8, nx: 2.6, ny: -23, fx: 7.6, fy: -21.4, sa: -0.95, ffx: 5.4, ba: 0.4, ah: 1 }),
    ],
    [frame(11), s({ hx: 0.2, cb: 0.6, nx: 2, fx: 5.6, fy: -23.6, sa: -1.55, ba: 0.3, ah: 1 })],
    [frame(13), s({ cb: 0.6, nx: 1.8, fx: 5.2, fy: -21, sa: -1.4, ah: 0 })],
    [frame(16), s({ fx: 5, fy: -18, sa: -1.2 })],
    [frame(18), STANCE],
  ]),
  /** the longest load in his kit, a full turn on the front foot with the axe out, and the slam into the floor */
  cleave: timed("cleave", [
    [0, STANCE],
    [
      frame(2),
      s({ hx: -0.6, hy: -12.4, cb: -0.3, nx: 0.2, ny: -22.2, fx: 0, fy: -14, sa: 2.1, ffx: 5.4, bfx: -5.2, ah: 1 }),
    ],
    [frame(5), CLEAVE_LOAD],
    [frame(9), s({ ...CLEAVE_LOAD_AT, hy: -10, ny: -19.4, fx: -5.4, sa: 2.78 })],
    [frame(10), TURN_BACK],
    [frame(11), TURN_BEHIND, "snap"],
    [frame(12), TURN_AWAY],
    [frame(13), TURN_FRONT],
    [frame(14), SLAM, "snap"],
    [frame(16), s({ ...SLAM_AT, hy: -10.6 })],
    [frame(19), HEAVE],
    [frame(22), s({ fx: 5.6, fy: -16.6, sa: -0.9 })],
    [frame(26), STANCE],
  ]),
  /** Bloodied: the same load, then two full turns before the slam, the second striking on frame 17 */
  bloodiedCleave: timed("bloodiedCleave", [
    [0, STANCE],
    [
      frame(2),
      s({ hx: -0.6, hy: -12.4, cb: -0.3, nx: 0.2, ny: -22.2, fx: 0, fy: -14, sa: 2.1, ffx: 5.4, bfx: -5.2, ah: 1 }),
    ],
    [frame(5), CLEAVE_LOAD],
    [frame(9), s({ ...CLEAVE_LOAD_AT, hy: -10, ny: -19.4, fx: -5.4, sa: 2.78 })],
    [frame(10), TURN_BACK],
    [frame(11), TURN_BEHIND, "snap"],
    [frame(12), TURN_AWAY],
    [frame(13), TURN_FRONT],
    [frame(15), TURN_BACK],
    [frame(17), TURN_BEHIND, "snap"],
    [frame(18), TURN_AWAY],
    [frame(19), TURN_FRONT],
    [frame(20), SLAM, "snap"],
    [frame(22), s({ ...SLAM_AT, hy: -10.6 })],
    [frame(25), HEAVE],
    [frame(28), s({ fx: 5.6, fy: -16.6, sa: -0.9 })],
    [frame(32), STANCE],
  ]),
  /** a tuck with the axe overhead at the top of the jump, then a straight chop down held to the landing */
  hatchet: timed("hatchet", [
    [0, s({ hy: -15, fx: 4, fy: -22, sa: -1.4 })],
    [frame(2), TUCK],
    [frame(5), s({ ...TUCK_AT, fy: -27.6, sa: -1.8 })],
    [frame(6), DROP, "snap"],
    [frame(14), DROP],
  ]),
  /** the chop Hunt lands into: a short overhead chop out of the lunge */
  huntChop: timed("huntChop", [
    [0, s({ hx: 0.4, hy: -12.4, cb: 0.4, nx: 2.4, ny: -22, fx: 2.6, fy: -24, sa: -1.9, ffx: 6, bfx: -5 })],
    [frame(2), s({ hx: 0.2, hy: -12.6, cb: 0.2, nx: 2, ny: -22.4, fx: 2, fy: -25, sa: -2.05, ffx: 6, bfx: -5 })],
    [
      frame(3),
      s({ hx: 0.8, hy: -11.6, cb: 1.4, nx: 4.2, ny: -20.8, fx: 9.2, fy: -12.4, sa: 0.62, ffx: 6.4, bfx: -5 }),
      "snap",
    ],
    [frame(6), s({ hx: 0.6, hy: -11.8, cb: 1.2, nx: 3.8, ny: -21.2, fx: 8.6, fy: -13, sa: 0.5, ffx: 6.2, bfx: -5 })],
    [frame(10), s({ hy: -12.8, cb: 0.8, nx: 2.4, ny: -22.4, fx: 6.4, fy: -15.6, sa: -0.4, ffx: 5.4, bfx: -5 })],
  ]),
};

/** one of Spinning Reap's turns, looped while the turns run: out in front, back to us, out behind, away, and round */
export const REAP_TURN_KEYS: ActionClip["keys"] = [
  [0, TURN_FRONT],
  [0.25, TURN_BACK],
  [0.5, TURN_BEHIND, "snap"],
  [0.75, TURN_AWAY],
  [1, TURN_FRONT],
];

import { type ActionClip, POSE_KEYS, type Pose } from "../../../types/pose";
import { frame } from "../../hero";
import { BEATS, COCK } from "../../sable/bolt";
import { hold } from "./stance";

/** a change to some joints of a stance, in pixels and radians */
type Delta = Partial<Pose>;

/** one beat's keys: the draw two frames before the release, the release, the recoil it holds and overshoots into this
 *  many frames on, and the pose it ends in, where the next beat starts */
interface BeatPoses {
  draw: Delta;
  loose: Delta;
  hold: number;
  recoil: Delta;
  end: Delta;
}

/**
 * The string's beats as changes from the stance, so every aim plays the same string. Each beat draws the crossbow in
 * against the shot and holds it, lets go with a snap that kicks the crossbow up and the body back, holds the recoil a
 * hair past the snap, then the weight rolls forward onto the front foot, where the next beat starts. The feet stay on
 * their spots; the knees, the heels and the toes take the weight.
 *
 * - The first bolt is a shoulder shot: a short draw and a quick kick upward.
 * - The second sinks low and hunched over the stock, and the recoil drives her back and down.
 * - The closing bolt rocks back onto the rear heel and sinks into a brace, and the recoil throws the crossbow high and
 *   lifts her front toes before her weight drops forward after the bolt.
 */
const BEAT_POSES: readonly BeatPoses[] = [
  {
    draw: { hx: -0.5, hy: 0.5, nx: -1, ny: 0.5, cb: -0.5, fx: -1.5, fy: 0.5, sa: 0.04, fa: 0.05, ba: 0.1 },
    loose: { hx: -1, nx: -2, cb: -1, fx: -3, fy: -1, sa: -0.2, fa: -0.12, ba: 0.25 },
    hold: frame(1),
    recoil: { hx: -1, nx: -2.5, ny: -0.5, cb: -1.2, fx: -3.5, fy: -1.5, sa: -0.26, fa: -0.15, ba: 0.3 },
    end: { hx: 0.5, hy: 0.5, nx: 1, ny: 0.5, cb: 0.5, fy: 0.5, sa: -0.04, fa: 0.05, ba: 0.2 },
  },
  {
    draw: { hx: -0.5, hy: 2, ny: 2.5, cb: 1, fx: -1, fy: 2, sa: 0.06, fa: 0.1, ba: 0.45 },
    loose: { hx: -1.5, hy: 2, nx: -2.5, ny: 2, cb: -0.5, fx: -3, fy: 2, sa: -0.14, fa: -0.1, ba: 0.5 },
    hold: frame(1),
    recoil: { hx: -1.5, hy: 1.5, nx: -3, ny: 1.5, cb: -0.8, fx: -3.5, fy: 1.5, sa: -0.18, fa: -0.12, ba: 0.5 },
    end: { hx: 0.5, hy: 0.5, nx: 1.5, ny: 0.5, cb: 0.5, fx: 0.5, fa: 0.1, ba: 0.25 },
  },
  {
    draw: { hx: -1.5, hy: 1, nx: -2, ny: 1, cb: 1, fx: -1.5, fy: -0.5, sa: -0.02, fa: -0.15, ba: 0.35 },
    loose: { hx: -2, hy: 1, nx: -4, ny: 0.5, cb: -1.5, fx: -4.5, fy: -2, sa: -0.4, fa: -0.35, ba: 0.5 },
    hold: frame(2),
    recoil: { hx: -2.5, hy: 1, nx: -4.5, cb: -1.8, fx: -5, fy: -2.5, sa: -0.48, fa: -0.4, ba: 0.55 },
    end: { hx: 0.5, hy: 1.5, nx: 1.5, ny: 1.5, cb: 0.5, fy: 1, sa: 0.12, fa: 0.1, ba: 0.35 },
  },
];

/** where the crossbow sits when each beat's string lets go: its draw */
export const BEAT_DRAW: readonly { fx: number; fy: number }[] = BEAT_POSES.map(({ draw }) => ({
  fx: draw.fx ?? 0,
  fy: draw.fy ?? 0,
}));

/** the stance with a change added to its joints, both hands on the crossbow */
function shift(stance: Pose, d: Delta): Pose {
  const p = { ...stance };
  for (const k of POSE_KEYS) p[k] += d[k] ?? 0;
  return hold(p);
}

/** a beat's clip from a stance, starting where the beat before it ended */
function beatClip(stance: Pose, beat: number): ActionClip {
  const { draw, loose, hold: held, recoil, end } = BEAT_POSES[beat];
  const { fire, dur } = BEATS[beat];
  const before = BEAT_POSES[beat - 1];
  return {
    dur,
    hit: fire,
    keys: [
      [0, before ? shift(stance, before.end) : stance],
      [fire - frame(2), shift(stance, draw)],
      [fire, shift(stance, loose), "snap"],
      [fire + held, shift(stance, recoil)],
      [dur, shift(stance, end)],
    ],
  };
}

/**
 * The cock after the closing bolt: the muzzle tips down, the far hand takes the string and hauls it back to the nut with
 * the hips sinking under the pull, then the crossbow comes back up to the stance the next string starts from.
 */
function cockClip(stance: Pose): ActionClip {
  const last = BEAT_POSES[BEAT_POSES.length - 1];
  const reach = shift(stance, { hy: 1.5, nx: 1.5, ny: 2, cb: 1.5, fx: -1, fy: 3, sa: 0.75, fa: 0.05, ba: 0.3 });
  const haul = shift(stance, { hx: -0.5, hy: 2, ny: 1.5, cb: 0.5, fx: -0.5, fy: 3.5, sa: 0.8, ba: 0.35 });
  return {
    dur: COCK,
    hit: 0,
    keys: [
      [0, shift(stance, last.end)],
      [frame(2), { ...reach, bx: reach.fx + 2.5, by: reach.fy - 1.5 }],
      [frame(4), { ...haul, bx: haul.fx - 3, by: haul.fy - 2.5 }],
      [COCK, stance],
    ],
  };
}

/** the string from one stance: a clip for each beat, and the cock after the closing bolt */
export interface StringClips {
  beats: readonly ActionClip[];
  cock: ActionClip;
}

export function stringClips(stance: Pose): StringClips {
  return { beats: BEATS.map((_, i) => beatClip(stance, i)), cock: cockClip(stance) };
}

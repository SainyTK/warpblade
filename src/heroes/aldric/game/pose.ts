import { STATE_CLIPS } from "../../../constants/clips";
import { STAND } from "../../../constants/hero";
import { STRIDE } from "../../../constants/motion";
import { clipPose } from "../../../game/hero/clipPose";
import { jumpClock, type MotionFrame, motionPose } from "../../../game/hero/motion";
import { woundedIdle, woundWeight } from "../../../game/hero/wound";
import type { Hero } from "../../../types/hero";
import type { ActionClip, Pose } from "../../../types/pose";
import { sampleKeys } from "../../../utils/sampleKeys";
import { ALDRIC_ACTION_CLIPS } from "../constants/clips";
import {
  ALDRIC_CHARGE,
  ALDRIC_CROUCH,
  ALDRIC_GUARD_CLIP,
  ALDRIC_IDLE,
  ALDRIC_WOUNDED_IDLE,
} from "../constants/clips/rest";
import { aldric } from "./state";

/** the guard walk's step is this share of a walking stride, and the hips dip this share of the walk's */
const GUARD_STEP = { feet: 0.65, hips: 0.5, moving: 4 } as const;

/** the walk's legs under the guard's upper body, stepping by the ground the guard walk has covered */
function guardLegs(h: Hero, p: Pose): Pose {
  if (Math.abs(h.vx) < GUARD_STEP.moving) return p;
  const clip = STATE_CLIPS.walk;
  const phase = (((aldric.guardStride / STRIDE.walk) % 1) + 1) % 1;
  const w = sampleKeys(clip.keys, phase * clip.dur);
  const f = GUARD_STEP.feet;
  return {
    ...p,
    hy: p.hy + (w.hy - STAND.hy) * GUARD_STEP.hips,
    ffx: p.ffx * 0.4 + w.ffx * f,
    ffy: w.ffy,
    fa: w.fa,
    bfx: p.bfx * 0.4 + w.bfx * f,
    bfy: w.bfy,
    ba: w.ba,
  };
}

/** the guard: its own clip, the Guard bash over it while one runs, and the walk's legs under it */
function guardPose(h: Hero): Pose {
  const top =
    aldric.bashT >= 0
      ? sampleKeys(ALDRIC_ACTION_CLIPS.guardBash.keys, aldric.bashT)
      : sampleKeys(ALDRIC_GUARD_CLIP.keys, h.st);
  return guardLegs(h, top);
}

const play = (clip: ActionClip, t: number): Pose => sampleKeys(clip.keys, t);

/** the clip Aldric's state plays: his own for his rest, guard, abilities, warp and ultimate, the shared ones otherwise */
function statePose(h: Hero, t: number, frame: MotionFrame): Pose {
  switch (h.state) {
    case "jump":
      return sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, frame.fresh, frame.dt));
    case "guard":
      return guardPose(h);
    case "idle": {
      const calm = play(ALDRIC_IDLE, h.st % ALDRIC_IDLE.dur);
      const wounded = play(ALDRIC_WOUNDED_IDLE, h.st % ALDRIC_WOUNDED_IDLE.dur);
      return woundedIdle(calm, wounded, woundWeight(t));
    }
    case "rush":
      return play(ALDRIC_ACTION_CLIPS.rush, h.st);
    case "call":
      return play(ALDRIC_ACTION_CLIPS.call, h.st);
    case "throw":
      return play(ALDRIC_ACTION_CLIPS.throw, h.st);
    case "warpStrike":
      return play(ALDRIC_ACTION_CLIPS.arrive, h.st);
    case "charge": {
      const p = play(ALDRIC_CHARGE, h.st % ALDRIC_CHARGE.dur);
      const tremble = h.chargeLevel >= 3 && Math.floor(t * 30) % 2 ? 0.5 : 0;
      return { ...p, nx: p.nx + tremble };
    }
    case "ultimate":
      return play(ALDRIC_ACTION_CLIPS.plant, h.st);
    default:
      return clipPose(h, t);
  }
}

/** Aldric's pose: his clips, carried through the motion layer every hero shares, loading his jump over the shield */
export const aldricPose = (h: Hero, t: number): Pose => motionPose(h, t, statePose, ALDRIC_CROUCH);

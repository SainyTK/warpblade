import { frame } from "../../../../constants/hero";
import type { ActionClip, Pose, PoseKeyframe } from "../../../../types/pose";
import { VESPER_READY, vp } from "./stance";

/** the keyed poses of one press of two blows, each a change from her ready stance */
export interface TwinBlow {
  /** the clip's length and the frames the two blows strike on */
  frames: number;
  first: number;
  second: number;
  /** the wind-up against the first blow, reached by frame 2 and held */
  windFirst: Partial<Pose>;
  strikeFirst: Partial<Pose>;
  /** the other blade cocks while the first follows through */
  windSecond: Partial<Pose>;
  strikeSecond: Partial<Pose>;
  /** the second blow carries on past its mark, then the body comes back through a keyed recovery */
  over: Partial<Pose>;
  recover: Partial<Pose>;
}

/**
 * A press of two blows on the plain move clock: the wind-up reached by frame 2 and held to the first strike, a snap to
 * the first blow, the other blade cocking over two even frames, a snap to the second blow, its overshoot, a keyed
 * recovery and the ready stance, so the next press starts where this one ends.
 */
export function twinBlowClip(b: TwinBlow): ActionClip {
  const wind = vp(b.windFirst);
  const keys: PoseKeyframe[] = [
    [0, VESPER_READY],
    [frame(2), wind],
    [frame(b.first - 1), wind],
    [frame(b.first), vp(b.strikeFirst), "snap"],
    [frame(b.second - 1), vp(b.windSecond)],
    [frame(b.second), vp(b.strikeSecond), "snap"],
    [frame(b.second + 2), vp(b.over)],
    [frame(b.second + 5), vp(b.recover)],
    [frame(b.frames), VESPER_READY],
  ];
  return { dur: frame(b.frames), hit: frame(b.first), keys };
}

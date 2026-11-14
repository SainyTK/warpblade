import { frame, pose } from "../../../../constants/hero";
import type { Pose, PoseKeyframe } from "../../../../types/pose";

/** a key on animation frame `n`: the pose from the joints it changes, snapped when it is a hit frame */
export const key = (n: number, joints: Partial<Pose>, snap?: "snap"): PoseKeyframe =>
  snap ? [frame(n), pose(joints), snap] : [frame(n), pose(joints)];

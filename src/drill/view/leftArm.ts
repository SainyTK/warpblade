import { armReach } from "../../rig";
import type { Pose } from "../../types/pose";
import type { Vec } from "../../types/rig";
import { drawnPoint, farShoulder, isElbowFlipped } from "../../utils/poseFrame";

export function drawnLeftHand(pose: Pose): Vec {
  const [, hand] = armReach(farShoulder(pose), [pose.bx, pose.by], isElbowFlipped(pose.be));
  return drawnPoint(pose, ...hand);
}

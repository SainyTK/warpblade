import { armReach } from "../../rig";
import type { Pose } from "../../types/pose";
import type { Vec } from "../../types/rig";
import { drawnPoint, farShoulder, isElbowFlipped } from "../../utils/poseFrame";

type LeftArm = Pick<Pose, "bx" | "by" | "be">;

export const rearHand = (x: number, y: number): LeftArm => ({ bx: x, by: y, be: 1 });
export const frontHand = (x: number, y: number): LeftArm => ({ bx: x, by: y, be: 0 });

export function drawnLeftHand(pose: Pose): Vec {
  const [, hand] = armReach(farShoulder(pose), [pose.bx, pose.by], isElbowFlipped(pose.be));
  return drawnPoint(pose, ...hand);
}

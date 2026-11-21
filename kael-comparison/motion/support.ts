import { BODY } from "../../src/constants/hero";
import type { Pose } from "../../src/types/pose";
import { atHip } from "../../src/utils/poseFrame";

const REACH = BODY.thigh + BODY.shin - 0.18;

export function support(pose: Pose, contacts: readonly [boolean, boolean]): Pose {
  if (!contacts.some(Boolean)) {
    return pose;
  }
  const hips = [atHip(pose, 1.5, 0), atHip(pose, -1.5, 0)];
  const targets = [
    [pose.ffx, pose.ffy - 1],
    [pose.bfx, pose.bfy - 1],
  ];
  let drop = 0;
  for (const [index, [x, y]] of hips.entries()) {
    if (!contacts[index]) {
      continue;
    }
    const [tx, ty] = targets[index];
    const horizontal = Math.min(REACH, Math.abs(x - tx));
    drop = Math.max(drop, ty - y - Math.sqrt(REACH * REACH - horizontal * horizontal));
  }
  return { ...pose, hy: pose.hy + drop, ny: pose.ny + drop, fy: pose.fy + drop, by: pose.by + drop };
}

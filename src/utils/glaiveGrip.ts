import type { Pose } from "../types/pose";

/** the pose with the far hand on the glaive's haft, this many pixels from the near hand toward the butt; negative goes toward the blade */
export function grip(p: Pose, d: number): Pose {
  return { ...p, bx: p.fx - Math.cos(p.sa) * d, by: p.fy - Math.sin(p.sa) * d };
}

/** the glaive angle from the near hand to a point, for a point driven into the floor */
export const aimAt = (fx: number, fy: number, x: number, y: number): number => Math.atan2(y - fy, x - fx);

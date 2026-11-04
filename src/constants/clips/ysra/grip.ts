import type { Pose } from "../../../types/pose";
import { grip } from "../../../utils/glaiveGrip";
import { pose } from "../../hero";

/**
 * A pose with both hands on the glaive: the far hand rides the haft this many pixels from the near hand, behind it
 * toward the butt when positive, ahead of it toward the blade when negative.
 */
export function held(o: Partial<Pose>, d = 5): Pose {
  return grip(pose(o), d);
}

/** her guard between blows: a low, wide-set stance with the glaive angled down ahead, both hands on the haft */
export const GLAIVE_READY: Pose = held({
  hx: -0.5,
  hy: -13.5,
  nx: 0.5,
  ny: -23.5,
  fx: 6,
  fy: -15.5,
  sa: 0.35,
  ffx: 5,
  bfx: -5,
});

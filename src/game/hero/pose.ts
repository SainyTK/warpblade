import type { Hero } from "../../types/hero";
import type { Pose } from "../../types/pose";
import { clipPose } from "./clipPose";
import { kit } from "./kits";

/** the hero's pose: their kit's own when it has one, otherwise the shared clips */
export function heroPose(h: Hero, t: number): Pose {
  return kit().pose(h, t) ?? clipPose(h, t);
}

import { HERO_IDLES } from "../constants/clips/rest";
import { STAND } from "../constants/hero";
import type { KitId } from "../types/kit";
import type { Pose } from "../types/pose";
import { sampleKeys } from "./sampleKeys";

/** a hero at rest: the first frame of their own idle clip, or the shared standing pose */
export function restPose(kit: KitId): Pose {
  const idle = HERO_IDLES[kit];
  return idle ? sampleKeys(idle.keys, 0) : STAND;
}

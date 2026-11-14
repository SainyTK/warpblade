import { STAND } from "../constants/hero";
import type { CharacterDef } from "../types/character";
import type { Pose } from "../types/pose";
import { sampleKeys } from "./sampleKeys";

/** a hero at rest: the first frame of their own idle clip, or the shared standing pose */
export function restPose(c: CharacterDef): Pose {
  const idle = c.clips.idle;
  return idle ? sampleKeys(idle.keys, 0) : STAND;
}

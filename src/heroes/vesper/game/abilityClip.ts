import type { ActionClip } from "../../../types/pose";
import { VESPER_ACTION_CLIPS } from "../constants/clips";
import type { VesperAbility } from "../types/ability";

/** the clip an ability plays: the stitch's dart, or the crossing swing of both blades (held, its turning sweep) */
export const clipOf = (a: VesperAbility, wide: boolean): ActionClip =>
  a === "stitch" ? VESPER_ACTION_CLIPS.stitch : wide ? VESPER_ACTION_CLIPS.crescentWide : VESPER_ACTION_CLIPS.crescent;

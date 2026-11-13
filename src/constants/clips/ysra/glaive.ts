import type { ActionClip } from "../../../types/pose";
import type { GlaiveClipName } from "../../../types/ysra/glaive";
import { GLAIVE_AIR_CLIPS } from "./glaive/air";
import { GLAIVE_STRING_CLIPS } from "./glaive/string";
import { GLAIVE_VARIANT_CLIPS } from "./glaive/variants";

/** Ysra's glaive string and its variants */
export const GLAIVE_CLIPS = {
  ...GLAIVE_STRING_CLIPS,
  ...GLAIVE_VARIANT_CLIPS,
  ...GLAIVE_AIR_CLIPS,
} satisfies Record<GlaiveClipName, ActionClip>;

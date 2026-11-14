import type { SpriteCanvas } from "../../../../engine/sprite";
import { CALDER_EVOLVED_ICONS } from "./evolved";
import { CALDER_SKILL_BASE_ICONS } from "./skills";
import { CALDER_SOURCE_ICONS } from "./sources";

/** Calder's skill icons, their evolved forms (`<id>_evo`), and his own damage sources */
export const CALDER_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...CALDER_SKILL_BASE_ICONS,
  ...CALDER_EVOLVED_ICONS,
  ...CALDER_SOURCE_ICONS,
};

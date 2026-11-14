import type { SpriteCanvas } from "../../../../engine/sprite";
import { ALDRIC_EVOLVED_ICONS } from "./evolved";
import { ALDRIC_SKILL_BASE_ICONS } from "./skills";
import { ALDRIC_SOURCE_ICONS } from "./sources";

/** Aldric's skill icons, their evolved forms (`<id>_evo`), and his own damage sources */
export const ALDRIC_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...ALDRIC_SKILL_BASE_ICONS,
  ...ALDRIC_EVOLVED_ICONS,
  ...ALDRIC_SOURCE_ICONS,
};

import type { SpriteCanvas } from "../../../../engine/sprite";
import { YUN_EVOLVED_ICONS } from "./evolved";
import { YUN_SKILL_BASE_ICONS } from "./skills";
import { YUN_SOURCE_ICONS } from "./sources";

/** Yun's icons: his skills, their evolved forms (`<id>_evo`) and his own damage sources */
export const YUN_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...YUN_SKILL_BASE_ICONS,
  ...YUN_EVOLVED_ICONS,
  ...YUN_SOURCE_ICONS,
};

import type { SpriteCanvas } from "../../../../engine/sprite";
import { ZAFIR_EVOLVED_ICONS } from "./evolved";
import { ZAFIR_SKILL_BASE_ICONS } from "./skills";
import { ZAFIR_SOURCE_ICONS } from "./sources";

/** Zafir's skill icons, their evolved forms (`<id>_evo`), and his own damage sources */
export const ZAFIR_SKILL_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...ZAFIR_SKILL_BASE_ICONS,
  ...ZAFIR_EVOLVED_ICONS,
  ...ZAFIR_SOURCE_ICONS,
};

import type { SpriteCanvas } from "../../../../engine/sprite";
import { BRYNN_EVOLVED_ICONS } from "./evolved";
import { BRYNN_SKILL_BASE_ICONS } from "./skills";
import { BRYNN_SOURCE_ICONS } from "./sources";

/** Brynn's skill icons, their evolved forms (`<id>_evo`), and her own damage sources */
export const BRYNN_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...BRYNN_SKILL_BASE_ICONS,
  ...BRYNN_EVOLVED_ICONS,
  ...BRYNN_SOURCE_ICONS,
};

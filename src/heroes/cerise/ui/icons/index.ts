import type { SpriteCanvas } from "../../../../engine/sprite";
import { CERISE_EVOLVED_ICONS } from "./evolved";
import { CERISE_BASE_ICONS } from "./skills";

/** Cerise's skill icons, their evolved forms (`<id>_evo`), and her own damage sources */
export const CERISE_SKILL_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...CERISE_BASE_ICONS,
  ...CERISE_EVOLVED_ICONS,
};

import type { SpriteCanvas } from "../../../../engine/sprite";
import { VESPER_EVOLVED_ICONS } from "./evolved";
import { VESPER_SKILL_BASE_ICONS } from "./skills";

/** Vesper's skill icons, their evolved forms (`<id>_evo`), and her own damage sources */
export const VESPER_SKILL_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...VESPER_SKILL_BASE_ICONS,
  ...VESPER_EVOLVED_ICONS,
};

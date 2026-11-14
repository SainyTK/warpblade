import type { SpriteCanvas } from "../../../../engine/sprite";
import { SAYA_EVOLVED_ICONS } from "./evolved";
import { SAYA_SKILL_BASE_ICONS } from "./skills";
import { SAYA_SOURCE_ICONS } from "./sources";

/** Saya's skill icons, their evolved forms (`<id>_evo`), and her own damage sources */
export const SAYA_SKILL_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...SAYA_SKILL_BASE_ICONS,
  ...SAYA_EVOLVED_ICONS,
  ...SAYA_SOURCE_ICONS,
};

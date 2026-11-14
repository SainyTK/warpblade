import type { SpriteCanvas } from "../../../../engine/sprite";
import { SAYA_SOURCE_ICONS } from "./sources";

/** Saya's skill icons, their evolved forms (`<id>_evo`), and her own damage sources */
export const SAYA_SKILL_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...SAYA_SOURCE_ICONS,
};

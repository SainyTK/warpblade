import type { SpriteCanvas } from "../../../../engine/sprite";
import { ALDRIC_SOURCE_ICONS } from "./sources";

/** Aldric's skill icons, their evolved forms (`<id>_evo`), and his own damage sources */
export const ALDRIC_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...ALDRIC_SOURCE_ICONS,
};

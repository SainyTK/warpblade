import type { SpriteCanvas } from "../../../../engine/sprite";
import { CALDER_SOURCE_ICONS } from "./sources";

/** Calder's skill icons, their evolved forms (`<id>_evo`), and his own damage sources */
export const CALDER_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  ...CALDER_SOURCE_ICONS,
};

import type { SpriteCanvas } from "../../../../engine/sprite";
import { ZAFIR_SOURCE_ICONS } from "./sources";

/** Zafir's skill icons, their evolved forms (`<id>_evo`), and his own damage sources */
export const ZAFIR_SKILL_ICONS: Record<string, (s: SpriteCanvas) => void> = { ...ZAFIR_SOURCE_ICONS };

import type { SpriteCanvas } from "../../../../engine/sprite";
import { BRYNN_SOURCE_ICONS } from "./sources";

/** Brynn's skill icons, their evolved forms (`<id>_evo`), and her own damage sources */
export const BRYNN_ICONS: Record<string, (s: SpriteCanvas) => void> = { ...BRYNN_SOURCE_ICONS };

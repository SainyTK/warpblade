import type { SpriteCanvas } from "../../../../engine/sprite";
import { YUN_SOURCE_ICONS } from "./sources";

/** Yun's icons: his skills, their evolved forms (`<id>_evo`) and his own damage sources */
export const YUN_ICONS: Record<string, (s: SpriteCanvas) => void> = { ...YUN_SOURCE_ICONS };

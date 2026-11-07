import { PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { ring } from "../parts";

/** The relic's icon and its evolution's icon. Relics owns this file; the rings stand in until then. */
export const BELL_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  relic_bell: (s) => ring(s, 8, 8, 6, PAL.crystal[3]),
  relic_bell_evo: (s) => ring(s, 8, 8, 6, PAL.heal[3]),
};

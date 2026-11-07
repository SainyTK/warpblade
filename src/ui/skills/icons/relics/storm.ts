import { PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { ring } from "../parts";

/** The relic's icon and its evolution's icon. Relics owns this file; the rings stand in until then. */
export const STORM_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  relic_storm: (s) => ring(s, 8, 8, 6, PAL.crystal[3]),
  relic_storm_evo: (s) => ring(s, 8, 8, 6, PAL.heal[3]),
};

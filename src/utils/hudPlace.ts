import { HUD_PLACE } from "../constants/hudPlace";
import type { HudPlace } from "../types/layout";

/**
 * Above the stage when the HUD, laid out there, fits between the pause button and the stage's top edge; in CSS pixels.
 * The pause button sits at the safe area's top or 8 px down, whichever is lower.
 */
export function hudPlace(stageTop: number, safeTop: number, hudHeight: number): HudPlace {
  const pauseBottom = Math.max(HUD_PLACE.pauseTop, safeTop) + HUD_PLACE.pause;
  const needed = pauseBottom + HUD_PLACE.belowPause + hudHeight + HUD_PLACE.aboveStage;
  return needed <= stageTop ? "outside" : "inside";
}

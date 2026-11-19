import { HUD_PLACE } from "../constants/hudPlace";
import type { HudHeights, HudPlace } from "../types/layout";

/**
 * Where the HUD goes, from its height in each layout above the stage, in CSS pixels.
 * The full HUD sits above when it fits between the pause button and the stage's top edge; the compact HUD sits beside
 * the pause button, so it needs only the room from the button's top down to the stage.
 * The pause button sits at the safe area's top or 8 px down, whichever is lower.
 */
export function hudPlace(stageTop: number, safeTop: number, heights: HudHeights): HudPlace {
  const pauseTop = Math.max(HUD_PLACE.pauseTop, safeTop);
  const outside = pauseTop + HUD_PLACE.pause + HUD_PLACE.belowPause + heights.outside + HUD_PLACE.aboveStage;
  if (outside <= stageTop) return "outside";
  const compact = pauseTop + heights.compact + HUD_PLACE.aboveStage;
  return compact <= stageTop ? "compact" : "inside";
}

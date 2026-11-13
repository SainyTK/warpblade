import { MOVE_TABS } from "../constants/keys";
import type { HudSnapshot, HudTab } from "../types/snapshot";

const usable = (tab: HudTab): boolean => tab.visible && tab.ready;
const isSpellTab = (tab: HudTab): boolean => !MOVE_TABS.includes(tab.id);

/** the warp tab (J held) is shown and recharged */
export const warpReady = (hud: HudSnapshot): boolean => hud.tabs.some((tab) => tab.id === "warpTab" && usable(tab));

/** "cast" when the selected spell is ready, "cycle" when another learned one is, else null; I casts the next ready one
 *  on its own, so "cycle" only keeps the HUD selection near what is ready */
export function spellChoice(hud: HudSnapshot): "cast" | "cycle" | null {
  const spells = hud.tabs.filter(isSpellTab);
  if (spells.some((tab) => tab.selected && usable(tab))) {
    return "cast";
  }
  return spells.some(usable) ? "cycle" : null;
}

export const ultimateReady = (hud: HudSnapshot): boolean => hud.ultVisible && hud.ultPips > 0;

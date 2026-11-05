import { HUD_TAB_KEYS } from "../constants/keys";
import type { HudSnapshot, HudTab } from "../types/snapshot";

const usable = (tab: HudTab): boolean => tab.visible && tab.ready;
const isSpellTab = (tab: HudTab): boolean => !(tab.id in HUD_TAB_KEYS);

/** the keys of HUD tabs other than spells that are learned and recharged, such as WARP on K */
export const readyMoveKeys = (hud: HudSnapshot): string[] =>
  hud.tabs.filter((tab) => !isSpellTab(tab) && usable(tab)).map((tab) => HUD_TAB_KEYS[tab.id]);

/** "cast" when the selected spell is ready, "cycle" when another learned one is, else null */
export function spellChoice(hud: HudSnapshot): "cast" | "cycle" | null {
  const spells = hud.tabs.filter(isSpellTab);
  if (spells.some((tab) => tab.selected && usable(tab))) {
    return "cast";
  }
  return spells.some(usable) ? "cycle" : null;
}

export const ultimateReady = (hud: HudSnapshot): boolean => hud.ultVisible && hud.ultPips > 0;

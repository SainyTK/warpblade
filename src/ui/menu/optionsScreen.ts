import { VOLUME_STEPS } from "../../constants/settings";
import { canFullscreen, isFullscreen, toggleFullscreen } from "../../services/fullscreen";
import { setSetting, settings } from "../../store/settings";
import type { MenuView } from "../../types/menu";
import { backItem } from "./backItem";
import { levelRow, toggleRow } from "./optionRow";

/** sound, volume, screen shake, damage numbers and fullscreen; every change is saved at once */
export function optionsScreen(): MenuView {
  const list = document.createElement("div");
  list.className = "menu-list options";
  list.append(
    toggleRow("Sound", settings.sound, (on) => setSetting("sound", on)),
    levelRow("Volume", settings.volume, VOLUME_STEPS, (level) => setSetting("volume", level)),
    toggleRow("Screen shake", settings.shake, (on) => setSetting("shake", on)),
    toggleRow("Damage numbers", settings.damageNumbers, (on) => setSetting("damageNumbers", on)),
  );
  if (canFullscreen()) list.append(toggleRow("Fullscreen", isFullscreen(), toggleFullscreen));
  list.append(backItem());
  return { title: "Options", subtitle: "Saved in this browser.", content: list };
}

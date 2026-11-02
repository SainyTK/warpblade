import { KEYMAP, MENU_KEYMAP } from "../constants/input";
import { press, release, releaseAll } from "../game/input";
import { game, showBanner } from "../game/state";
import { sfx } from "../services/audio";
import { toggleFullscreen } from "../services/fullscreen";
import { settings, toggleSound } from "../store/settings";
import { menuCommand } from "./menu/bindMenu";
import { pauseGame } from "./menu/menuActions";
import { isMenuOpen } from "./menu/menuState";

/** M and F work everywhere; the menu gets its own keys while open; the level-up pick handles its keys itself */
export function bindKeyboard(): void {
  addEventListener("keydown", (ev) => {
    sfx.start();
    const action = KEYMAP[ev.code];
    if (action === "mute" || action === "fullscreen") {
      ev.preventDefault();
      if (ev.repeat) return;
      if (action === "fullscreen") {
        toggleFullscreen();
        return;
      }
      toggleSound();
      showBanner(settings.sound ? "Sound on" : "Sound off", 1);
      return;
    }
    if (isMenuOpen()) {
      const command = MENU_KEYMAP[ev.code];
      if (!command) return;
      ev.preventDefault();
      menuCommand(command, ev.repeat);
      return;
    }
    if (!action || game.mode === "pick") return;
    ev.preventDefault();
    if (ev.repeat) return;
    if (action === "pause") pauseGame();
    else press(action);
  });
  // a button activated by keyboard would click again on Space's key up
  addEventListener("keyup", (ev) => {
    if (isMenuOpen() && ev.code === "Space") ev.preventDefault();
    const action = KEYMAP[ev.code];
    if (action) release(action);
  });
  addEventListener("blur", () => {
    releaseAll();
    pauseGame();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseGame();
  });
}

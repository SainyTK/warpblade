import { KEYMAP, MENU_KEYMAP } from "../constants/input";
import { press, release, releaseAll } from "../game/input";
import { game, showBanner } from "../game/state";
import { sfx } from "../services/audio";
import { toggleFullscreen } from "../services/fullscreen";
import { settings, toggleSound } from "../store/settings";
import { menuCommand } from "./menu/bindMenu";
import { pauseGame } from "./menu/menuActions";
import { isMenuOpen } from "./menu/menuState";

/** keys that leave a text box for the menu */
const TYPING_EXITS = ["Enter", "Escape", "ArrowUp", "ArrowDown"];

/** M and F work everywhere; the menu gets its own keys while open; the level-up pick handles its keys itself */
export function bindKeyboard(): void {
  addEventListener("keydown", (ev) => {
    sfx.start();
    // typing in a box, such as a room code, types; only Enter, Escape and the arrows still move through the menu
    if (ev.target instanceof HTMLInputElement && !TYPING_EXITS.includes(ev.code)) return;
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
    if (!action) return;
    if (action === "pause") {
      ev.preventDefault();
      if (!ev.repeat) pauseGame();
      return;
    }
    if (game.mode === "pick" || game.mode === "chest") return;
    ev.preventDefault();
    if (ev.repeat) return;
    press(action);
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

import { KEYMAP } from "../constants/input";
import { press, release, releaseAll } from "../game/input";
import { game } from "../game/state";
import { sfx } from "../services/audio";
import { toggleSound } from "./soundButton";

export function bindKeyboard(): void {
  addEventListener("keydown", (ev) => {
    const action = KEYMAP[ev.code];
    if (!action || game.mode === "skills") return;
    ev.preventDefault();
    sfx.start();
    if (ev.repeat) return;
    if (action === "mute") {
      toggleSound();
      return;
    }
    press(action);
  });
  addEventListener("keyup", (ev) => {
    const action = KEYMAP[ev.code];
    if (action) release(action);
  });
  addEventListener("blur", releaseAll);
}

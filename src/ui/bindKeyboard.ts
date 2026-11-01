import { KEYMAP } from "../constants/input";
import { isHeld, press, release, releaseAll } from "../game/input";
import { hero } from "../game/state";
import { sfx } from "../services/audio";
import { toggleSound } from "./soundButton";

export function bindKeyboard(): void {
  addEventListener("keydown", (ev) => {
    const action = KEYMAP[ev.code];
    if (!action) return;
    ev.preventDefault();
    sfx.start();
    if (ev.repeat) return;
    if (action === "mute") {
      toggleSound();
      return;
    }
    // up doubles as jump in the air, so W and the up arrow can double jump
    if (action === "up" && !isHeld("up") && !hero.ground && hero.state !== "hang") press("jump");
    press(action);
  });
  addEventListener("keyup", (ev) => {
    const action = KEYMAP[ev.code];
    if (action) release(action);
  });
  addEventListener("blur", releaseAll);
}

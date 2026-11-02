import { TOUCH_BUTTONS } from "../constants/input";
import { press, release } from "../game/input";
import { sfx } from "../services/audio";
import type { TouchButton } from "../types/input";
import { byId } from "./dom";
import { pauseGame } from "./menu/menuActions";

/** one on-screen button that holds its action while pressed */
function touchButton({ action, label }: TouchButton): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  const down = (ev: PointerEvent) => {
    ev.preventDefault();
    sfx.start();
    button.classList.add("active");
    button.setPointerCapture(ev.pointerId);
    press(action);
  };
  const up = (ev: PointerEvent) => {
    ev.preventDefault();
    button.classList.remove("active");
    release(action);
  };
  button.addEventListener("pointerdown", down);
  button.addEventListener("pointerup", up);
  button.addEventListener("pointercancel", up);
  return button;
}

/** the on-screen buttons for touch screens, built from the one list the Controls screen also shows, and the pause button */
export function bindTouch(): void {
  const pad = byId("touchPad");
  const acts = byId("touchActs");
  for (const b of TOUCH_BUTTONS) (b.side === "pad" ? pad : acts).append(touchButton(b));
  byId("pauseButton").addEventListener("click", pauseGame);
}

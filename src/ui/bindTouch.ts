import { press, release } from "../game/input";
import { sfx } from "../services/audio";
import type { InputAction } from "../types/input";

/** on-screen buttons for touch screens; each holds its action while pressed */
export function bindTouch(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>(".touch button")) {
    const action = button.dataset.action as InputAction;
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
  }
}

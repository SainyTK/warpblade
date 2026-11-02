import type { InputAction } from "../types/input";

export const KEYMAP: Record<string, InputAction> = {
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  KeyJ: "attack",
  KeyK: "warp",
  KeyL: "dash",
  KeyI: "cast",
  KeyO: "cycle",
  KeyU: "ultimate",
  KeyM: "mute",
};
/** two presses of a side within this many seconds start a run */
export const DOUBLE_TAP = 0.25;
/** a press is kept this many simulation steps (120 a second) until it can be used: about 0.15 seconds */
export const INPUT_BUFFER_STEPS = 18;
/** during an attack, Up waits this many steps for a J before it jump-cancels, so Up + J reads as the launcher */
export const LAUNCH_WAIT_STEPS = 8;

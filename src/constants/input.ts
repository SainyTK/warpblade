import type { InputAction, MenuCommand, TouchButton } from "../types/input";

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
  Escape: "pause",
  KeyP: "pause",
  KeyF: "fullscreen",
};
/** what each action does, as the Controls screen tells it */
export const ACTION_TEXT: Record<InputAction, string> = {
  left: "Walk left. Tap twice and hold to run",
  right: "Walk right. Tap twice and hold to run",
  up: "Jump",
  down: "Hold and jump to drop through a ledge",
  attack: "Sword combo. Mix with up, down, a jump, a dash or a run",
  dash: "Dash. Nothing can touch you while you dash",
  warp: "Warp strike (10 MP)",
  cast: "Cast the selected spell (18 MP)",
  cycle: "Switch element: fire, ice, bolt",
  ultimate: "Hold to charge the special, release to strike",
  mute: "Sound on or off",
  pause: "Pause and open the menu",
  fullscreen: "Fullscreen on or off",
};
/** the on-screen buttons, in the order they are laid out */
export const TOUCH_BUTTONS: readonly TouchButton[] = [
  { action: "up", label: "JUMP", side: "pad" },
  { action: "down", label: "DOWN", side: "pad" },
  { action: "left", label: "LEFT", side: "pad" },
  { action: "right", label: "RIGHT", side: "pad" },
  { action: "attack", label: "SLASH", side: "acts" },
  { action: "warp", label: "WARP", side: "acts" },
  { action: "dash", label: "DASH", side: "acts" },
  { action: "cast", label: "SPELL", side: "acts" },
  { action: "ultimate", label: "ULT", side: "acts" },
  { action: "cycle", label: "ELEM", side: "acts" },
];
/** keys inside the menu */
export const MENU_KEYMAP: Record<string, MenuCommand> = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  KeyJ: "select",
  Enter: "select",
  Space: "select",
  Escape: "back",
  KeyP: "back",
};
/** two presses of a side within this many seconds start a run */
export const DOUBLE_TAP = 0.25;
/** a press is kept this many simulation steps (120 a second) until it can be used: about 0.15 seconds */
export const INPUT_BUFFER_STEPS = 18;
/** during an attack, Up waits this many steps for a J before it jump-cancels, so Up + J reads as the launcher */
export const LAUNCH_WAIT_STEPS = 8;

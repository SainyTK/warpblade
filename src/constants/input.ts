import type { HeldAction, InputAction, MenuCommand } from "../types/input";

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
  KeyK: "guard",
  KeyL: "dash",
  KeyI: "cast",
  KeyO: "cycle",
  KeyU: "ultimate",
  KeyM: "mute",
  Escape: "pause",
  KeyP: "pause",
  KeyF: "fullscreen",
};
/** what the moveset every hero shares does, as the Controls screen tells it; each hero's own lines go over it
 *  (`CharacterDef.controls.actions`) */
export const SHARED_ACTION_TEXT: Record<InputAction, string> = {
  left: "Walk left. Tap twice and hold to run",
  right: "Walk right. Tap twice and hold to run",
  up: "Jump. Press again in the air to jump again",
  down: "Hold and jump to drop through a ledge",
  attack: "Attack",
  warp: "Warp: throw your weapon at the nearest foe ahead, warp to it and strike as you land (10 MP)",
  guard: "Guard: hold to block blows from the front. Press just as a blow lands to parry",
  dash: "Dodge forward. Nothing can touch you while you dodge, and each dodge spends stamina",
  run: "Run toward the side held",
  cast: "Cast the selected ability. If it is recharging, the next ready one goes",
  castWide: "Cast the selected ability, wider where it has a wide form",
  cycle: "Switch ability",
  ultimate: "Hold to charge the ultimate, release to strike",
  mute: "Sound on or off",
  pause: "Pause and open the menu",
  fullscreen: "Fullscreen on or off",
};
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
/** J and I: let go sooner than this many simulation steps (0.25 seconds) and the press is a tap; hold this long for the long press */
export const HOLD_STEPS = 30;
/** the long press each tap-or-hold key queues */
export const HOLD_ACTIONS: Readonly<Record<HeldAction, InputAction>> = { attack: "warp", cast: "castWide" };
/** presses that wait out a whole move: a jump pressed while a blow winds up or strikes jumps out of its follow-through */
export const KEPT_DURING_MOVE: readonly InputAction[] = ["up"];

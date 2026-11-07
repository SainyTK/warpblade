import type { InputAction, MenuCommand } from "../types/input";
import type { KitId } from "../types/kit";
import { RITES } from "./ysra/rites";

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
/** what each of Kael's actions does, as the Controls screen tells it */
const KAEL_ACTION_TEXT: Record<InputAction, string> = {
  left: "Walk left. Tap twice and hold to run",
  right: "Walk right. Tap twice and hold to run",
  up: "Jump",
  down: "Hold and jump to drop through a ledge",
  attack: "Sword combo. Each hit fits where the foes are. Mix with up, down, a jump, a dash or a run",
  dash: "Dash. Nothing can touch you while you dash, and each dash spends stamina",
  run: "Run toward the side held",
  warp: "Warp strike (10 MP)",
  cast: "Cast the selected spell (18 MP)",
  cycle: "Switch element: fire, ice, bolt",
  ultimate: "Hold to charge the ultimate, release to strike",
  mute: "Sound on or off",
  pause: "Pause and open the menu",
  fullscreen: "Fullscreen on or off",
};
/** the rites O cycles through, as the controls name them */
export const RITE_NAMES = RITES.map((r) => r.name).join(", ");
/** what each action does for each hero, as the Controls screen tells it; Ysra differs where her kit does */
export const ACTION_TEXT: Record<KitId, Record<InputAction, string>> = {
  kael: KAEL_ACTION_TEXT,
  ysra: {
    ...KAEL_ACTION_TEXT,
    left: "Walk left. With Warpath, tap twice and hold to charge",
    right: "Walk right. With Warpath, tap twice and hold to charge",
    up: "Jump. One heavy jump, no double jump",
    attack:
      "Glaive string that pierces the whole line. Hold to wind a lunge, let go to lunge. With up a skyhook, with down a ground lash",
    dash: "Hold to brace and block blows from the front. Press just before a blow to parry. With the side behind you held, step back",
    run: "Charge toward the side held, once Warpath is learned",
    warp: "Pole vault over foes, also out of a brace or a backstep. In the air, dive glaive first",
    cast: "Call the selected rite, paid with Heat",
    cycle: `Switch rite: ${RITE_NAMES}`,
  },
  sable: {
    ...KAEL_ACTION_TEXT,
    up: "Jump. One light jump, also out of a shot",
    down: "With jump, drop through a ledge",
    attack: "Shoot a string of three bolts at the foe ahead, the last a closing bolt. Hold to keep shooting. An empty quiver reloads",
    dash: "Hop back and shoot at the top of the hop. Walking or running ahead, slide forward under blows. Both spend stamina",
    warp: "Kick foes away from you",
    cast: "Cast the selected spell: a snare at your feet (20 MP) at first. The next ready spell is selected after each cast",
    cycle: "Reload. Press again in the bright window for a perfect reload and primed bolts",
  },
  hulda: {
    ...KAEL_ACTION_TEXT,
    left: "Walk left. No run",
    right: "Walk right. No run",
    up: "Jump. One low, heavy jump. Held as you throw, toss the foe straight up",
    down: "With jump, drop through a ledge. Held as you throw, Giant Swing once learned",
    attack: "Fist string: jab, cross, body hook, haymaker. In the air, a hammer fist. While holding a foe, a knee",
    dash: "Bull Rush: an armoured shoulder charge that spends stamina",
    run: "Walk toward the side held",
    warp: "Grab a foe ahead; big foes are crushed. While holding, throw: forward, or suplex with the side behind held. In the air, Skyfall Grab",
    cast: "Bellow: drag nearby foes in and stun minions (20 MP)",
    cycle: "Taunt: slap your chest twice for Grit",
  },
};
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
/** presses that wait out a whole move: a jump pressed while a blow winds up or strikes jumps out of its follow-through */
export const KEPT_DURING_MOVE: readonly InputAction[] = ["up"];
/** during a ground combo with Launcher, Up waits for a J this many steps after the press, and for as long as Up is held, before it jump-cancels; so Up + J reads as the launcher and a tapped Up still jumps */
export const LAUNCH_WAIT_STEPS = 8;

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
  up: "Jump. Press again in the air to jump again",
  down: "Hold and jump to drop through a ledge",
  attack: "Sword combo of four hits, the same every time. Press again just as a blow lands for a Keen hit",
  dash: "Dash. Nothing can touch you while you dash, and each dash spends stamina",
  run: "Run toward the side held",
  warp: "Warp strike (10 MP). Hold up to warp to a crystal",
  cast: "Cast the selected ability. During a combo it leaves the hand at once",
  cycle: "Switch ability: lance, burst and the spells you learn",
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
    left: "Walk left. With Warpath, keep walking to charge",
    right: "Walk right. With Warpath, keep walking to charge",
    up: "Jump. One heavy jump, no double jump",
    attack:
      "Glaive string of three blows that pierce the whole line, picked by the foes around you. Hold to wind a lunge, let go to lunge. In a vault, crash down",
    dash: "Hold to brace and block blows from the front. Press just before a blow to parry. With the side behind you held, step back",
    run: "Charge toward the side held at once, once Warpath is learned",
    warp: "Pole vault over foes, also out of a brace or a backstep. In the air, dive glaive first",
    cast: "Call the selected rite, paid with Heat",
    cycle: `Switch rite: ${RITE_NAMES}`,
  },
  sable: {
    ...KAEL_ACTION_TEXT,
    up: "Jump. One light jump, also out of a shot",
    down: "With jump, drop through a ledge",
    attack:
      "Shoot a string of three bolts at the foe ahead, the last a closing bolt. Hold to keep shooting. An empty quiver reloads",
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
    attack: "Fist string: jab, body hook, haymaker. In the air, a hammer fist. While holding a foe, a knee",
    dash: "Bull Rush: an armoured shoulder charge that spends stamina",
    run: "Walk toward the side held",
    warp: "Grab a foe ahead; big foes are crushed. While holding, throw: forward, or suplex with the side behind held. In the air, Skyfall Grab",
    cast: "Bellow: drag nearby foes in and stun minions (20 MP)",
    cycle: "Taunt: slap your chest twice for Grit",
  },
  orrin: {
    ...KAEL_ACTION_TEXT,
    left: "Walk left. No run. While swinging, pump the swing",
    right: "Walk right. No run. While swinging, pump the swing",
    up: "Jump. One light jump, no double jump. While swinging, let go with a hop",
    down: "With jump, drop through a ledge. While swinging, Plumb Drop once learned",
    attack: "Chain string: Lash, Rising Arc, Full Circle, hardest at the chain's tip. In the air, a Hanging Arc",
    dash: "While swinging, hold to reel the chain in and swing faster. On the floor, Backline: yank yourself back",
    run: "Walk toward the side held",
    warp: "Hook: hold to swing from a crystal, a platform or the air, let go to fling. On a foe, zip to it and kick. Hold up to aim steeper, down in the air to aim low",
    cast: "Use the selected ability: Whirlwall, Anchor Pin or a spell skill (MP)",
    cycle: "Switch to the next ability",
  },
  mirel: {
    ...KAEL_ACTION_TEXT,
    left: "Walk left. No run",
    right: "Walk right. No run",
    up: "Jump. One jump, no double jump. Hold past the top of the jump to hover, spending stamina",
    down: "With jump, drop through a ledge. Held as you press K, open the Stillfield on yourself",
    attack:
      "Staff string: Tick, Tock, Toll. Every blow strikes again half a second later as an echo. In the air, Pendant Strike",
    dash: "Rewind: go back along your path and get back part of the HP you lost (40 Sand)",
    run: "Walk toward the side held",
    warp: "Hold to keep the Stillfield open ahead, where foes and their shots crawl; let go to snap it shut (Sand). Hold up to open it above you",
    cast: "Use the selected ability: Stopped Clock, Second Hand or a spell skill (MP)",
    cycle: "Switch to the next ability",
  },
  wenna: {
    ...KAEL_ACTION_TEXT,
    left: "Walk left. No run",
    right: "Walk right. No run",
    up: "Jump. One jump, no double jump",
    down: "With jump, drop through a ledge. Held as you press K, light the Wick at your feet",
    attack:
      "Lamp string: Tap, Swing, Flare. The foe it hits becomes your Quarry and every Wick turns on it. In the air, Lamp Drop",
    dash: "Swap places with the Wick farthest ahead (stamina). The Wick arrives in a flare",
    run: "Walk toward the side held",
    warp: "Light a Wick from your lamp (25 Wax). With four out, relight the weakest",
    cast: "Use the selected ability: Kindle, Beckon or a spell skill (MP)",
    cycle: "Switch to the next ability",
  },
  tallis: {
    ...KAEL_ACTION_TEXT,
    left: "Walk left. Tap twice and hold to run. In the shadow pool, glide left",
    right: "Walk right. Tap twice and hold to run. In the shadow pool, glide right",
    up: "Jump. One jump, no double jump",
    down: "With jump, drop through a ledge",
    attack: "Knife string: Flick, Cross, Heel Kick. In the air, Drop Stab. Out of the pool, Rising Cut",
    dash: "Hold to sink into a shadow pool and glide under foes (stamina); let go to rise. In the air, drop straight down",
    warp: "Veil on or off: minions lose sight of you (20 Gloam, then Gloam over time). Your first blow out of it is an Ambush",
    cast: "Use the selected ability: Smoke Knot, Hamstring or a spell skill (MP)",
    cycle: "Switch to the next ability",
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

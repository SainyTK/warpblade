import type { HeldAction, InputAction, MenuCommand } from "../types/input";
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
/** what the moveset every hero shares does, as the Controls screen tells it; each hero's own lines go over it */
const SHARED_ACTION_TEXT: Record<InputAction, string> = {
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
/** what each of Kael's actions does, as the Controls screen tells it */
const KAEL_ACTION_TEXT: Record<InputAction, string> = {
  ...SHARED_ACTION_TEXT,
  up: "Jump. Press again in the air to jump again",
  attack:
    "Sword combo of four hits, the same every time. Press again just as a blow lands for a Keen hit. Just after a parry, blink to the attacker's back and strike",
  warp: "Warp strike: throw the sword at the nearest foe ahead and warp to it (10 MP)",
  guard:
    "Guard: hold to block blows from the front. Press just as a blow lands to parry: a riposte cut, then Attack blinks you behind the attacker",
  cast: "Cast the selected ability: Crystal Lance, Crystal Burst or a spell you learn. If it is recharging, the next ready one goes",
  castWide:
    "Wide form for half again the MP: three lances, a burst that pulls foes in, a wall of fire, an ice field, a chain of bolts",
  cycle: "Switch ability: lance, burst and the spells you learn",
};
/** the rites O cycles through, as the controls name them */
export const RITE_NAMES = RITES.map((r) => r.name).join(", ");
/** what each action does for each hero, as the Controls screen tells it; Ysra differs where her kit does */
export const ACTION_TEXT: Record<KitId, Record<InputAction, string>> = {
  kael: KAEL_ACTION_TEXT,
  ysra: {
    ...SHARED_ACTION_TEXT,
    left: "Walk left. With Warpath, keep walking to charge",
    right: "Walk right. With Warpath, keep walking to charge",
    up: "Jump. One heavy jump, no double jump",
    attack:
      "Glaive string of three blows that pierce the whole line, the same every time. Right after a parry, a counter thrust. In a vault, crash down",
    warp: "Hurl the glaive like a javelin, warp to its haft and wrench it free in a burst of embers that builds Heat (10 MP)",
    guard:
      "Guard: hold to block blows from the front, cheaply. Press just as a blow lands to parry: Heat, and J is a counter thrust. Hold the side behind you to step back",
    run: "Charge toward the side held at once, once Warpath is learned",
    cast: "Vault over foes, or dive glaive first in the air. Rites are paid with Heat. If one is not ready, the next ready one goes",
    castWide: "The high vault, a wider Flare, a Cinder Lash both ways, more Flame Pillars",
    cycle: `Switch ability: the vault, ${RITE_NAMES}`,
  },
  sable: {
    ...SHARED_ACTION_TEXT,
    up: "Jump. One light jump, also out of a shot",
    down: "With jump, drop through a ledge. With J on the floor, reload",
    attack:
      "Shoot the next bolt of a three-bolt string at the foe ahead, the third a closing bolt. An empty quiver reloads. While reloading, tap in the bright window for a perfect reload and primed bolts",
    warp: "Grapple: shoot a line away from the nearest foe, zip along it and fire a heavy bolt back through the line (10 MP). The zip loads a bolt",
    guard:
      "Guard with the crossbow stock: hold to block blows from the front, a lot gets through. Press just as a blow lands for Point-Blank: kick the attacker away and fill the quiver with primed bolts",
    cast: "Cast the selected ability: the hop back and its shot, the snare and the spells you learn. If it is recharging, the next ready one goes",
    castWide:
      "Wide form: the hop becomes a slide forward under blows, the snare is tossed under the foe ahead, nets fan wider",
    cycle: "Switch ability: hop, snare and the spells you learn",
  },
  hulda: {
    ...SHARED_ACTION_TEXT,
    left: "Walk left. No run",
    right: "Walk right. No run",
    up: "Jump. One low, heavy jump",
    run: "Walk toward the side held",
    attack: "Fist string: jab, body hook, haymaker. In the air, a hammer fist. While holding a foe, a knee",
    warp: "Chain warp: hurl a chained gauntlet at the nearest foe ahead and haul yourself in, already holding it (10 MP). Big foes are crushed. While holding, throw: forward, or a suplex with the side behind held",
    guard:
      "Iron guard: hold to block blows from the front for little stamina and earn Grit. Press just as a blow lands for Iron Catch: seize the attacker, or answer a big foe with a haymaker. While holding a foe, throw it",
    cast: "Use the selected ability: Bull Rush (in the air, Skyfall Grab), Bellow, the taunt or a spell skill",
    castWide: "Use the selected ability's wide form: a longer Bull Rush, a wider Bellow",
    cycle: "Switch ability: Bull Rush, Bellow, the taunt and the spells you learn",
  },
  orrin: {
    ...SHARED_ACTION_TEXT,
    left: "Walk left. No run. While swinging, pump the swing",
    right: "Walk right. No run. While swinging, pump the swing",
    up: "Jump. One light jump, no double jump. While swinging, let go with a fling",
    down: "With jump, drop through a ledge. While swinging, Plumb Drop once learned",
    attack:
      "Chain string: Lash, Rising Arc, Full Circle, hardest at the chain's tip. In the air or swinging, a Hanging Arc. Hold while swinging to reel in",
    run: "Walk toward the side held",
    warp: "Hook: throw the hook at the nearest foe ahead, land on it with a flying kick that binds it (10 MP). With Up held, hook a platform or the air and swing",
    guard:
      "Guard: hold to spin the chain into a shield. Press just as a blow lands for Chain Bind: the attacker is hauled to your chain's tip and held",
    castWide: "Cast the selected ability's wide form: Whirlpool, Stake Line, Stockade or Anchor Ring (more MP)",
    cycle: "Switch ability: Whirlwall, Anchor Pin and the spells you learn",
  },
  mirel: {
    ...SHARED_ACTION_TEXT,
    left: "Walk left. No run",
    right: "Walk right. No run",
    up: "Jump. One jump, no double jump. Hold past the top of the jump to hover, spending stamina. Held as you open the Stillfield, open it above you",
    down: "With jump, drop through a ledge. Held as you open the Stillfield, open it on yourself",
    attack:
      "Staff string: Tick, Tock, Toll. Every blow strikes again half a second later as an echo. In the air, Pendant Strike",
    warp: "Warp: fling the staff at the nearest foe ahead, skip to it and strike, and the blow echoes (10 MP)",
    guard:
      "Guard in a time bubble that slows blows near you. Press just as a blow lands for a Stopped Moment: the attacker stops in time and the HP you lost rewinds",
    run: "Walk toward the side held",
    cast: "Cast the selected ability: the Stillfield (Sand), Stopped Clock, Second Hand or a spell skill (MP). If it is recharging, the next ready one goes",
    castWide: "Keep the Stillfield open until you let go, then it snaps shut. Stopped Clock stops every foe round you",
    cycle: "Switch ability: Stillfield, Stopped Clock, Second Hand and the spells you learn",
  },
  wenna: {
    ...SHARED_ACTION_TEXT,
    left: "Walk left. No run",
    right: "Walk right. No run",
    up: "Jump. One jump, no double jump",
    down: "With jump, drop through a ledge",
    attack:
      "Lamp string: Tap, Swing, Flare. The foe it hits becomes your Quarry and every Wick turns on it. In the air, Lamp Drop",
    warp: "Throw a lit candle at the foe ahead and trade places with it (10 MP): the foe becomes your Quarry and the candle burns on as a Wick. With no foe ahead, trade places with your farthest Wick",
    guard:
      "Raise the lantern: hold to block blows from the front. Press just as a blow lands for Flare Back: it blinds the foes ahead and lights a Wick at your feet",
    run: "Walk toward the side held",
    cast: "Use the selected ability: Light a Wick (Wax), Kindle, Beckon or a spell skill (MP). If it is not ready, the next ready one goes",
    castWide: "Hold to light the Wick at your feet, or Kindle every Wick near you at once",
    cycle: "Switch ability: Light, Kindle, Beckon and the spells you learn",
  },
  tallis: {
    ...SHARED_ACTION_TEXT,
    left: "Walk left. Tap twice and hold to run. In the shadow pool, glide left",
    right: "Walk right. Tap twice and hold to run. In the shadow pool, glide right",
    up: "Jump. One jump, no double jump",
    down: "With jump, drop through a ledge",
    attack: "Knife string: Flick, Cross, Heel Kick. In the air, Drop Stab. In the shadow pool, rise with Rising Cut",
    warp: "Throw a knife into the foe ahead and step out of its shadow at its back to strike (10 MP)",
    guard: "Crossed knives: hold to block blows from the front. Press just as a blow lands to Fade into the Veil",
    cast: "Cast the selected ability: Smoke Knot, Hamstring or a spell (MP), the Veil (Gloam) or Sink (stamina)",
    castWide: "Sink: stay in the shadow pool until you let go. Smoke Knot and Hamstring: the wide form, for more MP",
    cycle: "Switch ability: Smoke Knot, Hamstring, the spells you learn, the Veil and Sink",
  },
  jory: {
    ...SHARED_ACTION_TEXT,
    up: "Jump. One jump, no double jump",
    down: "With jump, drop through a ledge",
    attack:
      "Mallet string: Tap, Roll, Crash. On the beat a blow is an Accent and builds Groove; off it, Groove falls. In the air, Downstroke",
    warp: "Warp: spin a mallet at the nearest foe ahead and arrive with a crash (10 MP). Thrown on the beat, it lands as an Accent",
    guard:
      "Guard: hold to block with the drum. Press just as a blow lands for Counterbeat, a Boom off the drum. On the beat it lifts Groove a tier",
    dash: "Dodge forward. Nothing can touch you while you dodge. On the beat it builds Groove",
    cast: "Use the selected ability: Boom (stamina), Steady Hand, Thunder Skin or a spell skill (MP). Judged on the beat",
    castWide: "Use the selected ability. Thunder Skin sends a wave each way",
    cycle: "Switch ability: Boom, Steady Hand, Thunder Skin and the spells you learn",
  },
  brannoc: {
    ...SHARED_ACTION_TEXT,
    up: "Jump. One jump, no double jump",
    down: "With jump, drop through a ledge",
    attack:
      "Axe string: Hew, Reave, Cleave. The Cleave hits both sides, and spins twice when you are Bloodied. In the air, Hatchet Drop",
    warp: "Hunt: hurl the great axe into the nearest foe ahead, leap after it and rip it out with a chop (10 MP). It wins back some spent HP",
    guard:
      "Guard: hold to take blows from the front on the haft. Half bleeds through into your spent HP. Press just as a blow lands to parry: Blood Answer wins back all spent HP and starts Frenzy for free",
    cast: "Use the selected ability, paid with HP: Frenzy, War Cry, Red Crescent or a spell skill. If it is recharging, the next ready one goes",
    castWide: "War Cry reaches further and Red Crescent goes both ways, for more HP",
    cycle: "Switch ability: Frenzy, War Cry, Red Crescent and the spells you learn",
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
/** J and I: let go sooner than this many simulation steps (0.25 seconds) and the press is a tap; hold this long for the long press */
export const HOLD_STEPS = 30;
/** the long press each tap-or-hold key queues */
export const HOLD_ACTIONS: Readonly<Record<HeldAction, InputAction>> = { attack: "warp", cast: "castWide" };
/** presses that wait out a whole move: a jump pressed while a blow winds up or strikes jumps out of its follow-through */
export const KEPT_DURING_MOVE: readonly InputAction[] = ["up"];

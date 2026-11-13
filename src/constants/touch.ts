import type { KitId } from "../types/kit";
import type { StickDirectionSpec, TouchButtonAction, TouchButtonSpec, TouchButtonText } from "../types/touch";
import { RITE_NAMES } from "./input";

/**
 * The touch controller layout, the one source the controller and the Controls screen both read.
 * Sizes and distances are in controller art pixels: whole CSS pixels per art pixel, picked from the screen's short side.
 */
export const TOUCH_SCALE = { min: 3, max: 4, shortSidePerPixel: 120 } as const;

/** Action buttons on the right, in a thumb arc around the attack button. */
export const TOUCH_BUTTONS: readonly TouchButtonSpec[] = [
  { action: "attack", key: "J", size: 24, angle: 0, reach: 0 },
  { action: "up", key: "W", size: 17, angle: 190, reach: 30 },
  { action: "dash", key: "L", size: 17, angle: 150, reach: 30 },
  { action: "guard", key: "K", size: 17, angle: 110, reach: 30 },
  { action: "cast", key: "I", size: 17, angle: 70, reach: 30 },
  { action: "ultimate", key: "U", size: 19, angle: 129, reach: 54 },
  { action: "cycle", key: "O", size: 15, angle: 80, reach: 54 },
];

/** the front dodge every hero shares */
const DODGE_BUTTON: TouchButtonText = {
  label: "Dodge",
  hint: "Dodge forward. Nothing can touch you while you dodge, and each dodge spends stamina",
  accent: "#b4a8ff",
};

const SPECIAL: TouchButtonText = {
  label: "Special",
  hint: "Hold to charge, the ring fills one quarter per level. Let go to strike",
  accent: "#ff7ae0",
};

/** what each button is called and does for each hero */
export const TOUCH_TEXT: Record<KitId, Record<TouchButtonAction, TouchButtonText>> = {
  kael: {
    attack: {
      label: "Attack",
      hint: "Tap: sword combo of four hits, the same every time; tap again just as a blow lands for a Keen hit. Hold: throw the sword and warp to it (10 MP)",
      accent: "#7fe3ff",
    },
    up: { label: "Jump", hint: "Jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to block blows from the front. Tap just as a blow lands to parry with a riposte cut",
      accent: "#a8ecff",
    },
    cast: { label: "Spell", hint: "Tap to cast the selected spell. Hold for its wide form", accent: null },
    ultimate: SPECIAL,
    cycle: { label: "Ability", hint: "Switch ability: lance, burst and the spells you learn", accent: null },
  },
  ysra: {
    attack: {
      label: "Attack",
      hint: "Glaive string of three blows that pierce the whole line. Hold to wind a lunge, let go to lunge. In a vault, crash down",
      accent: "#ffae48",
    },
    up: {
      label: "Jump",
      hint: "One heavy jump, no double jump. Hold the stick down to drop through a ledge",
      accent: "#e8e6f6",
    },
    dash: DODGE_BUTTON,
    guard: {
      label: "Vault",
      hint: "Pole vault over foes, also out of a brace or a backstep. In the air, dive glaive first",
      accent: "#ec7228",
    },
    cast: { label: "Rite", hint: "Call the selected rite, paid with Heat", accent: null },
    ultimate: SPECIAL,
    cycle: { label: "Next rite", hint: `Switch rite: ${RITE_NAMES}`, accent: null },
  },
  sable: {
    attack: {
      label: "Shoot",
      hint: "Shoot a bolt. Hold to keep shooting. Push the stick up or down while you hold it to aim",
      accent: "#6ee0a0",
    },
    up: { label: "Jump", hint: "One light jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: DODGE_BUTTON,
    guard: { label: "Kick", hint: "Kick foes away from you", accent: "#ccb88c" },
    cast: { label: "Spell", hint: "Cast the selected spell, a snare at first", accent: "#e88a4c" },
    ultimate: SPECIAL,
    cycle: {
      label: "Reload",
      hint: "Reload. Tap again in the bright window for a perfect reload and primed bolts",
      accent: "#c4ffd8",
    },
  },
  hulda: {
    attack: {
      label: "Punch",
      hint: "Tap: fist string of jab, body hook and haymaker; in the air a hammer fist; while holding a foe, a knee. Hold: hurl the chained gauntlet and haul yourself in holding the foe (10 MP); while holding, throw it",
      accent: "#ff5f6d",
    },
    up: {
      label: "Jump",
      hint: "One low, heavy jump. Hold the stick down to drop through a ledge",
      accent: "#e8e6f6",
    },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to block blows from the front for little stamina. Tap just as a blow lands for Iron Catch: seize the attacker, or a haymaker on a big foe",
      accent: "#b4bcc4",
    },
    cast: {
      label: "Ability",
      hint: "Tap: Bull Rush (Skyfall Grab in the air), Bellow, the taunt or a spell skill. Hold: a longer rush, a wider Bellow",
      accent: "#ffc2b8",
    },
    ultimate: SPECIAL,
    cycle: {
      label: "Switch",
      hint: "Switch ability: Bull Rush, Bellow, the taunt and the spells you learn",
      accent: "#e0ac48",
    },
  },
  orrin: {
    attack: {
      label: "Lash",
      hint: "Chain string: Lash, Rising Arc, Full Circle, hardest at the tip. In the air, a Hanging Arc",
      accent: "#e8b04a",
    },
    up: {
      label: "Jump",
      hint: "One light jump. While swinging, let go with a hop. Hold the stick down to drop through a ledge",
      accent: "#e8e6f6",
    },
    dash: DODGE_BUTTON,
    guard: {
      label: "Hook",
      hint: "Hold to swing from a crystal, a platform or the air, lift to let go. On a foe, zip to it. Stick up aims steeper, down in the air aims low",
      accent: "#b8c0cc",
    },
    cast: {
      label: "Ability",
      hint: "Use the selected ability: Whirlwall, Anchor Pin or a spell skill",
      accent: "#ffe08a",
    },
    ultimate: SPECIAL,
    cycle: { label: "Switch", hint: "Turn to the next ability", accent: "#e0ac48" },
  },
  mirel: {
    attack: {
      label: "Staff",
      hint: "Staff string: Tick, Tock, Toll, each echoing half a second later. In the air, Pendant Strike",
      accent: "#6fe0c8",
    },
    up: {
      label: "Jump",
      hint: "One jump. Hold past the top to hover. Hold the stick down to drop through a ledge",
      accent: "#e8e6f6",
    },
    dash: DODGE_BUTTON,
    guard: {
      label: "Still",
      hint: "Hold to keep the Stillfield open, lift to snap it shut (Sand). Stick up opens it above you, down on you",
      accent: "#8ae6cf",
    },
    cast: {
      label: "Ability",
      hint: "Use the selected ability: Stopped Clock, Second Hand or a spell skill",
      accent: "#e6fff6",
    },
    ultimate: SPECIAL,
    cycle: { label: "Switch", hint: "Turn to the next ability", accent: "#e8d6a0" },
  },
  wenna: {
    attack: {
      label: "Lamp",
      hint: "Lamp string: Tap, Swing, Flare. The foe it hits becomes the Quarry every Wick turns on. In the air, Lamp Drop",
      accent: "#b48cff",
    },
    up: { label: "Jump", hint: "One jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Light",
      hint: "Light a Wick ahead (25 Wax). Stick down lights it at your feet. With four out, relight the weakest",
      accent: "#e8dcc4",
    },
    cast: {
      label: "Ability",
      hint: "Use the selected ability: Kindle, Beckon or a spell skill",
      accent: "#f8eeff",
    },
    ultimate: SPECIAL,
    cycle: { label: "Switch", hint: "Turn to the next ability", accent: "#d8b4ff" },
  },
  tallis: {
    attack: {
      label: "Knife",
      hint: "Knife string: Flick, Cross, Heel Kick. In the air, Drop Stab. Out of the pool, Rising Cut",
      accent: "#f08ad0",
    },
    up: { label: "Jump", hint: "One jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Veil",
      hint: "Veil on or off: minions lose sight of you (Gloam). Your first blow out of it is an Ambush",
      accent: "#ffb8dc",
    },
    cast: {
      label: "Ability",
      hint: "Use the selected ability: Smoke Knot, Hamstring or a spell skill",
      accent: "#ffe4f2",
    },
    ultimate: SPECIAL,
    cycle: { label: "Switch", hint: "Turn to the next ability", accent: "#e8b4d0" },
  },
  jory: {
    attack: {
      label: "Mallets",
      hint: "Mallet string: Tap, Roll, Crash. On the beat a blow is an Accent and builds Groove. In the air, Downstroke",
      accent: "#5a82ff",
    },
    up: { label: "Jump", hint: "One jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Boom",
      hint: "Push foes away (stamina). On the beat it is bigger, drowns foe shots and nothing can touch you",
      accent: "#eef3ff",
    },
    cast: {
      label: "Ability",
      hint: "Use the selected ability: Steady Hand, Thunder Skin or a spell skill. Judged on the beat",
      accent: "#dce6ff",
    },
    ultimate: SPECIAL,
    cycle: { label: "Switch", hint: "Turn to the next ability", accent: "#8eaaf0" },
  },
  brannoc: {
    attack: {
      label: "Axe",
      hint: "Axe string: Hew, Reave, Cleave. The Cleave hits both sides. In the air, Hatchet Drop",
      accent: "#ff6a5a",
    },
    up: { label: "Jump", hint: "One jump. Hold the stick down to drop through a ledge", accent: "#f2eadb" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Frenzy",
      hint: "Spend 12% HP: blows do not stagger you and you swing faster. Strike to win the HP back",
      accent: "#d0283a",
    },
    cast: {
      label: "Ability",
      hint: "Use the selected ability: War Cry, Red Crescent or a spell skill (HP)",
      accent: "#ffd8c8",
    },
    ultimate: SPECIAL,
    cycle: { label: "Switch", hint: "Turn to the next ability", accent: "#c8a890" },
  },
};

/** where the attack button's center sits, art pixels in from the bottom right corner of the safe area */
export const CLUSTER_ANCHOR = { right: 22, bottom: 20 } as const;

/**
 * The floating stick on the left: it appears where the thumb lands and follows it when pushed past its reach.
 * Thresholds are parts of the reach; each turns off a little below where it turns on, so a resting thumb does not flicker.
 */
export const STICK = {
  base: 34,
  knob: 14,
  reach: 13,
  /** the center of the faded stick shown before the first touch, art pixels in from the bottom left of the safe area */
  rest: { left: 28, bottom: 27 },
  deadzone: 0.28,
  run: { on: 0.85, off: 0.6 },
  vertical: { on: 0.55, off: 0.4 },
  /** up and down need the push to be at least this steep: vertical over horizontal */
  steep: 0.7,
} as const;

/** The stick's directions as the Controls screen lists them, for each hero. */
export const STICK_DIRECTIONS: Record<KitId, readonly StickDirectionSpec[]> = {
  kael: [
    { direction: "side", label: "Walk" },
    { direction: "far side", label: "Run" },
    { direction: "up", label: "Jump, and the up variants of attacks" },
    { direction: "down", label: "Down variants. With Jump, drop through a ledge" },
  ],
  ysra: [
    { direction: "side", label: "Walk" },
    { direction: "far side", label: "Charge, once Warpath is learned" },
    { direction: "up", label: "Jump" },
    { direction: "down", label: "With Jump, drop through a ledge" },
  ],
  sable: [
    { direction: "side", label: "Walk" },
    { direction: "far side", label: "Run" },
    { direction: "up", label: "Jump" },
    { direction: "down", label: "With Jump, drop through a ledge" },
  ],
  hulda: [
    { direction: "side", label: "Walk" },
    { direction: "far side", label: "Walk, she never runs" },
    { direction: "up", label: "Jump" },
    { direction: "down", label: "With Jump, drop through a ledge" },
  ],
  orrin: [
    { direction: "side", label: "Walk. While swinging, pump the swing" },
    { direction: "far side", label: "Walk, he never runs" },
    { direction: "up", label: "Jump. With Hook, aim steeper" },
    {
      direction: "down",
      label: "With Jump, drop through a ledge. With Hook in the air, aim low. While swinging, Plumb Drop",
    },
  ],
  mirel: [
    { direction: "side", label: "Walk. While hovering, drift" },
    { direction: "far side", label: "Walk, she never runs" },
    { direction: "up", label: "Jump, hold to hover. With Still, open the field above you" },
    { direction: "down", label: "With Jump, drop through a ledge. With Still, open the field on you" },
  ],
  wenna: [
    { direction: "side", label: "Walk" },
    { direction: "far side", label: "Walk, she never runs" },
    { direction: "up", label: "Jump" },
    { direction: "down", label: "With Jump, drop through a ledge. With Light, light the Wick at your feet" },
  ],
  tallis: [
    { direction: "side", label: "Walk. In the shadow pool, glide" },
    { direction: "far side", label: "Run" },
    { direction: "up", label: "Jump" },
    { direction: "down", label: "With Jump, drop through a ledge" },
  ],
  jory: [
    { direction: "side", label: "Walk. With Step, step that way; with none held, step back" },
    { direction: "far side", label: "Run" },
    { direction: "up", label: "Jump" },
    { direction: "down", label: "With Jump, drop through a ledge" },
  ],
  brannoc: [
    { direction: "side", label: "Walk. With Hunt, lunge that way" },
    { direction: "far side", label: "Run" },
    { direction: "up", label: "Jump" },
    { direction: "down", label: "With Jump, drop through a ledge" },
  ],
};

/** the top part of the screen takes no touches, so the HUD and any buttons there stay reachable */
export const TOUCH_ZONE_TOP = 0.16;

/** vibration lengths in milliseconds */
export const HAPTIC_MS = { press: 8, slide: 5, run: 6, chargeLevel: 14 } as const;

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
      hint: "Tap: sword combo of four hits; tap again just as a blow lands for a Keen hit, or just after a parry to blink behind the attacker. Hold: throw the sword and warp to it (10 MP)",
      accent: "#7fe3ff",
    },
    up: { label: "Jump", hint: "Jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to block blows from the front. Tap just as a blow lands to parry: a riposte cut, then Attack blinks you behind the attacker",
      accent: "#a8ecff",
    },
    cast: {
      label: "Spell",
      hint: "Tap to cast the selected ability; if it is recharging, the next ready one goes. Hold for its wide form, for half again the MP",
      accent: null,
    },
    ultimate: SPECIAL,
    cycle: { label: "Ability", hint: "Switch ability: lance, burst and the spells you learn", accent: null },
  },
  ysra: {
    attack: {
      label: "Attack",
      hint: "Tap: glaive string of three blows that pierce the whole line; right after a parry, a counter thrust; in a vault, crash down. Hold: hurl the glaive and warp to it (10 MP)",
      accent: "#ffae48",
    },
    up: {
      label: "Jump",
      hint: "One heavy jump, no double jump. Hold the stick down to drop through a ledge",
      accent: "#e8e6f6",
    },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to block blows from the front. Tap just as a blow lands to parry: Heat, and Attack is a counter thrust. Hold the stick away to step back",
      accent: "#ec7228",
    },
    cast: {
      label: "Ability",
      hint: "Tap: the selected ability, the vault or a rite paid with Heat; in the air the vault dives. Hold: its wide form",
      accent: null,
    },
    ultimate: SPECIAL,
    cycle: { label: "Next", hint: `Switch ability: the vault, ${RITE_NAMES}`, accent: null },
  },
  sable: {
    attack: {
      label: "Shoot",
      hint: "Tap: the next bolt of the string; with the stick down on the floor, reload; while reloading, tap in the bright window for a perfect reload. Hold: grapple away from the foe and fire a heavy bolt back (10 MP)",
      accent: "#6ee0a0",
    },
    up: { label: "Jump", hint: "One light jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to block blows from the front with the crossbow stock. Tap just as a blow lands for Point-Blank: a kick and a full, primed quiver",
      accent: "#ccb88c",
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability: the hop back, the snare or a spell. Hold for its wide form: the hop slides forward",
      accent: null,
    },
    ultimate: SPECIAL,
    cycle: { label: "Switch", hint: "Switch ability: hop, snare and the spells you learn", accent: null },
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
      hint: "Tap: chain string, hardest at the tip; in the air, a Hanging Arc. Hold: throw the hook at a foe and kick it (10 MP); with the stick up, hook above and swing",
      accent: "#e8b04a",
    },
    up: {
      label: "Jump",
      hint: "One light jump. While swinging, let go with a fling. Hold the stick down to drop through a ledge",
      accent: "#e8e6f6",
    },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to spin the chain into a shield. Tap just as a blow lands for Chain Bind: the attacker is hauled in and held",
      accent: "#b8c0cc",
    },
    cast: {
      label: "Ability",
      hint: "Tap to use the selected ability: Whirlwall, Anchor Pin or a spell skill. Hold for its wide form",
      accent: "#ffe08a",
    },
    ultimate: SPECIAL,
    cycle: { label: "Switch", hint: "Turn to the next ability", accent: "#e0ac48" },
  },
  mirel: {
    attack: {
      label: "Staff",
      hint: "Tap: staff string Tick, Tock, Toll, each echoing half a second later; in the air, Pendant Strike. Hold: fling the staff, skip to the foe and strike, and the blow echoes (10 MP)",
      accent: "#6fe0c8",
    },
    up: {
      label: "Jump",
      hint: "One jump. Hold past the top to hover. Hold the stick down to drop through a ledge",
      accent: "#e8e6f6",
    },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to guard in a time bubble. Tap just as a blow lands for a Stopped Moment: the attacker stops and your lost HP rewinds",
      accent: "#8ae6cf",
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability; the Stillfield stands a while. Hold to keep the Stillfield open until you lift, or to stop every foe round you with Stopped Clock",
      accent: "#e6fff6",
    },
    ultimate: SPECIAL,
    cycle: { label: "Switch", hint: "Turn to the next ability", accent: "#e8d6a0" },
  },
  wenna: {
    attack: {
      label: "Lamp",
      hint: "Tap: lamp string, Tap, Swing, Flare; the foe it hits becomes the Quarry every Wick turns on. In the air, Lamp Drop. Hold: throw a lit candle and trade places with it (10 MP)",
      accent: "#b48cff",
    },
    up: { label: "Jump", hint: "One jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to raise the lantern and block blows from the front. Tap just as a blow lands for Flare Back: it blinds the foes ahead and lights a Wick",
      accent: "#d8b4ff",
    },
    cast: {
      label: "Ability",
      hint: "Tap: Light a Wick (Wax), Kindle, Beckon or a spell skill. Hold: Light at your feet, or Kindle every Wick near you",
      accent: "#f8eeff",
    },
    ultimate: SPECIAL,
    cycle: {
      label: "Switch",
      hint: "Switch ability: Light, Kindle, Beckon and the spells you learn",
      accent: "#d8b4ff",
    },
  },
  tallis: {
    attack: {
      label: "Knife",
      hint: "Tap: knife string, Flick, Cross, Heel Kick; in the air, Drop Stab. Hold: throw a knife and step out of the foe's shadow at its back (10 MP)",
      accent: "#f08ad0",
    },
    up: { label: "Jump", hint: "One jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to block blows from the front with crossed knives. Tap just as a blow lands to Fade into the Veil",
      accent: "#ffb8dc",
    },
    cast: {
      label: "Ability",
      hint: "Tap to cast the selected ability. Hold to stay in the shadow pool, or for a wider Smoke Knot or Hamstring",
      accent: "#ffe4f2",
    },
    ultimate: SPECIAL,
    cycle: {
      label: "Switch",
      hint: "Switch ability: Smoke Knot, Hamstring, the spells you learn, the Veil and Sink",
      accent: "#e8b4d0",
    },
  },
  jory: {
    attack: {
      label: "Mallets",
      hint: "Tap: mallet string Tap, Roll, Crash; on the beat a blow is an Accent and builds Groove. In the air, Downstroke. Hold: spin a mallet at a foe and arrive with a crash (10 MP)",
      accent: "#5a82ff",
    },
    up: { label: "Jump", hint: "One jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to block with the drum. Tap just as a blow lands for Counterbeat, a Boom off the drum; on the beat it lifts Groove a tier",
      accent: "#eef3ff",
    },
    cast: {
      label: "Ability",
      hint: "Tap: the selected ability, Boom, Steady Hand, Thunder Skin or a spell skill, judged on the beat. Hold: Thunder Skin sends a wave each way",
      accent: "#dce6ff",
    },
    ultimate: SPECIAL,
    cycle: {
      label: "Switch",
      hint: "Switch ability: Boom, Steady Hand, Thunder Skin and the spells you learn",
      accent: "#8eaaf0",
    },
  },
  brannoc: {
    attack: {
      label: "Axe",
      hint: "Tap: axe string Hew, Reave, Cleave; in the air, Hatchet Drop. Hold: Hunt, hurl the axe into a foe and rip it out with a chop (10 MP)",
      accent: "#ff6a5a",
    },
    up: { label: "Jump", hint: "One jump. Hold the stick down to drop through a ledge", accent: "#f2eadb" },
    dash: DODGE_BUTTON,
    guard: {
      label: "Guard",
      hint: "Hold to take blows on the haft; half bleeds through into your spent HP. Tap just as a blow lands: Blood Answer wins all spent HP back and starts Frenzy",
      accent: "#d0283a",
    },
    cast: {
      label: "Ability",
      hint: "Tap: the selected ability, paid with HP. Hold: War Cry reaches further, Red Crescent goes both ways",
      accent: "#ffd8c8",
    },
    ultimate: SPECIAL,
    cycle: {
      label: "Switch",
      hint: "Switch ability: Frenzy, War Cry, Red Crescent and the spells you learn",
      accent: "#c8a890",
    },
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
    { direction: "up", label: "Jump" },
    { direction: "down", label: "With Jump, drop through a ledge" },
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
    { direction: "down", label: "With Jump, drop through a ledge. With Shoot on the floor, reload" },
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
    { direction: "up", label: "Jump. Held with a long press of Attack, hook above and swing" },
    { direction: "down", label: "With Jump, drop through a ledge. While swinging, Plumb Drop" },
  ],
  mirel: [
    { direction: "side", label: "Walk. While hovering, drift" },
    { direction: "far side", label: "Walk, she never runs" },
    { direction: "up", label: "Jump, hold to hover. With the Stillfield, open it above you" },
    { direction: "down", label: "With Jump, drop through a ledge. With the Stillfield, open it on you" },
  ],
  wenna: [
    { direction: "side", label: "Walk" },
    { direction: "far side", label: "Walk, she never runs" },
    { direction: "up", label: "Jump" },
    { direction: "down", label: "With Jump, drop through a ledge" },
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
    { direction: "side", label: "Walk" },
    { direction: "far side", label: "Run" },
    { direction: "up", label: "Jump" },
    { direction: "down", label: "With Jump, drop through a ledge" },
  ],
};

/** the top part of the screen takes no touches, so the HUD and any buttons there stay reachable */
export const TOUCH_ZONE_TOP = 0.16;

/** vibration lengths in milliseconds */
export const HAPTIC_MS = { press: 8, slide: 5, run: 6, chargeLevel: 14 } as const;

import type { StickDirectionSpec, TouchButtonAction, TouchButtonSpec, TouchButtonText } from "../types/touch";
import { COST } from "./combat";

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

/**
 * What each button is called and does in the moveset every hero shares; a hero's own text goes over it
 * (`CharacterDef.controls.touch`). A null accent takes the colour of the selected ability.
 */
export const SHARED_TOUCH_TEXT: Readonly<Record<TouchButtonAction, TouchButtonText>> = {
  attack: {
    label: "Attack",
    hint: `Tap: attack. Hold: throw your sword at the nearest foe ahead and warp to it (${COST.warp} MP)`,
    accent: null,
  },
  up: { label: "Jump", hint: "Jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
  dash: {
    label: "Dodge",
    hint: "Dodge forward. Nothing can touch you while you dodge, and each dodge spends stamina",
    accent: "#b4a8ff",
  },
  guard: {
    label: "Guard",
    hint: "Hold to block blows from the front. Tap just as a blow lands to parry",
    accent: null,
  },
  cast: {
    label: "Ability",
    hint: "Tap to cast the selected ability; if it is recharging, the next ready one goes. Hold for its wide form",
    accent: null,
  },
  ultimate: {
    label: "Ultimate",
    hint: "Hold to charge, the ring fills one quarter per level. Let go to strike",
    accent: "#ff7ae0",
  },
  cycle: { label: "Switch", hint: "Next ability", accent: null },
};

export const DRILL_WARP_ACCENT = 0x7fe3ff;

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

/** The stick's directions as the Controls screen lists them; a hero whose stick differs lists its own. */
export const SHARED_STICK_DIRECTIONS: readonly StickDirectionSpec[] = [
  { direction: "side", label: "Walk" },
  { direction: "far side", label: "Run" },
  { direction: "up", label: "Jump" },
  { direction: "down", label: "With Jump, drop through a ledge" },
];

/** the top part of the screen takes no touches, so the HUD and any buttons there stay reachable */
export const TOUCH_ZONE_TOP = 0.16;

/** vibration lengths in milliseconds */
export const HAPTIC_MS = { press: 8, slide: 5, run: 6, chargeLevel: 14 } as const;

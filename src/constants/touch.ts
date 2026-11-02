import type { StickDirectionSpec, TouchButtonSpec } from "../types/touch";

/**
 * The touch controller layout, the one source the controller and the Controls screen both read.
 * Sizes and distances are in controller art pixels: whole CSS pixels per art pixel, picked from the screen's short side.
 */
export const TOUCH_SCALE = { min: 3, max: 4, shortSidePerPixel: 120 } as const;

/** Action buttons on the right, in a thumb arc around the attack button. */
export const TOUCH_BUTTONS: readonly TouchButtonSpec[] = [
  {
    action: "attack",
    label: "Attack",
    key: "J",
    hint: "Sword combo. Push the stick up or down, jump, dash or run for the variants",
    size: 24,
    angle: 0,
    reach: 0,
    accent: "#7fe3ff",
  },
  {
    action: "up",
    label: "Jump",
    key: "W",
    hint: "Jump. Hold the stick down to drop through a ledge",
    size: 17,
    angle: 190,
    reach: 30,
    accent: "#e8e6f6",
  },
  {
    action: "dash",
    label: "Dash",
    key: "L",
    hint: "Dash. Nothing can touch you while you dash",
    size: 17,
    angle: 150,
    reach: 30,
    accent: "#b4a8ff",
  },
  {
    action: "warp",
    label: "Warp",
    key: "K",
    hint: "Warp strike (10 MP)",
    size: 17,
    angle: 110,
    reach: 30,
    accent: "#a8ecff",
  },
  {
    action: "cast",
    label: "Spell",
    key: "I",
    hint: "Cast the selected spell (18 MP)",
    size: 17,
    angle: 70,
    reach: 30,
    accent: null,
  },
  {
    action: "ultimate",
    label: "Special",
    key: "U",
    hint: "Hold to charge, the ring fills one quarter per level. Let go to strike",
    size: 19,
    angle: 129,
    reach: 54,
    accent: "#ff7ae0",
  },
  {
    action: "cycle",
    label: "Element",
    key: "O",
    hint: "Switch element: fire, ice, bolt",
    size: 15,
    angle: 80,
    reach: 54,
    accent: null,
  },
];

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

/** The stick's directions as the Controls screen lists them. */
export const STICK_DIRECTIONS: readonly StickDirectionSpec[] = [
  { direction: "side", label: "Walk" },
  { direction: "far side", label: "Run" },
  { direction: "up", label: "Jump, and the up variants of attacks" },
  { direction: "down", label: "Down variants. With Jump, drop through a ledge" },
];

/** the top part of the screen takes no touches, so the HUD and any buttons there stay reachable */
export const TOUCH_ZONE_TOP = 0.16;

/** vibration lengths in milliseconds */
export const HAPTIC_MS = { press: 8, slide: 5, run: 6, chargeLevel: 14 } as const;

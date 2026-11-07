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
  { action: "warp", key: "K", size: 17, angle: 110, reach: 30 },
  { action: "cast", key: "I", size: 17, angle: 70, reach: 30 },
  { action: "ultimate", key: "U", size: 19, angle: 129, reach: 54 },
  { action: "cycle", key: "O", size: 15, angle: 80, reach: 54 },
];

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
      hint: "Sword combo. Each hit fits where the foes are. Push the stick up or down, jump, dash or run for the variants",
      accent: "#7fe3ff",
    },
    up: { label: "Jump", hint: "Jump. Hold the stick down to drop through a ledge", accent: "#e8e6f6" },
    dash: {
      label: "Dash",
      hint: "Dash. Nothing can touch you while you dash, and each dash spends stamina",
      accent: "#b4a8ff",
    },
    warp: { label: "Warp", hint: "Warp strike (10 MP)", accent: "#a8ecff" },
    cast: { label: "Spell", hint: "Cast the selected spell (18 MP)", accent: null },
    ultimate: SPECIAL,
    cycle: { label: "Ability", hint: "Switch ability: lance, burst and the spells you learn", accent: null },
  },
  ysra: {
    attack: {
      label: "Attack",
      hint: "Glaive string that pierces the whole line. Hold to wind a lunge, let go to lunge. Push the stick up for a skyhook, down for a ground lash",
      accent: "#ffae48",
    },
    up: {
      label: "Jump",
      hint: "One heavy jump, no double jump. Hold the stick down to drop through a ledge",
      accent: "#e8e6f6",
    },
    dash: {
      label: "Guard",
      hint: "Hold to brace and block blows from the front. Tap just before a blow to parry. With the stick pushed behind you, step back",
      accent: "#d08a3c",
    },
    warp: {
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
    dash: {
      label: "Hop",
      hint: "Hop back and shoot at the top. With the stick pushed ahead, slide forward under blows. Both spend stamina",
      accent: "#3fc06a",
    },
    warp: { label: "Kick", hint: "Kick foes away from you", accent: "#ccb88c" },
    cast: { label: "Snare", hint: "Set a snare at your feet (20 MP)", accent: "#e88a4c" },
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
      hint: "Fist string: jab, cross, body hook, haymaker. In the air, a hammer fist. While holding a foe, a knee",
      accent: "#ff5f6d",
    },
    up: {
      label: "Jump",
      hint: "One low, heavy jump. Hold the stick down to drop through a ledge",
      accent: "#e8e6f6",
    },
    dash: { label: "Rush", hint: "Bull Rush: an armoured shoulder charge that spends stamina", accent: "#c43848" },
    warp: {
      label: "Grab",
      hint: "Grab a foe ahead; big foes are crushed. While holding, throw it: push the stick behind you to suplex, up to toss it up. In the air, Skyfall Grab",
      accent: "#b4bcc4",
    },
    cast: { label: "Bellow", hint: "Drag nearby foes in and stun minions (20 MP)", accent: "#ffc2b8" },
    ultimate: SPECIAL,
    cycle: { label: "Taunt", hint: "Slap your chest twice for Grit", accent: "#e0ac48" },
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
    { direction: "up", label: "Jump. With Attack, a skyhook" },
    { direction: "down", label: "With Attack, a ground lash. With Jump, drop through a ledge" },
  ],
  sable: [
    { direction: "side", label: "Walk" },
    { direction: "far side", label: "Run" },
    { direction: "up", label: "Jump. While shooting, aim up" },
    { direction: "down", label: "While shooting, aim low. With Jump, drop through a ledge" },
  ],
  hulda: [
    { direction: "side", label: "Walk. While holding a foe, behind you picks the suplex" },
    { direction: "far side", label: "Walk, she never runs" },
    { direction: "up", label: "Jump. While holding a foe, Grab tosses it up" },
    { direction: "down", label: "With Jump, drop through a ledge. While holding, Grab swings with Giant Swing" },
  ],
};

/** the top part of the screen takes no touches, so the HUD and any buttons there stay reachable */
export const TOUCH_ZONE_TOP = 0.16;

/** vibration lengths in milliseconds */
export const HAPTIC_MS = { press: 8, slide: 5, run: 6, chargeLevel: 14 } as const;

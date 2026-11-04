import type { InputAction } from "./input";

/** The actions that have a button on the touch controller. */
export type TouchButtonAction = Extract<InputAction, "attack" | "up" | "dash" | "warp" | "cast" | "cycle" | "ultimate">;

/** One action button: what it does and where it sits around the attack button. */
export interface TouchButtonSpec {
  action: TouchButtonAction;
  /** the matching keyboard key */
  key: string;
  /** diameter in controller art pixels */
  size: number;
  /** direction from the attack button's center, degrees counterclockwise from the right */
  angle: number;
  /** distance from the attack button's center, controller art pixels */
  reach: number;
}

/** How one hero's button is named and drawn. */
export interface TouchButtonText {
  label: string;
  /** what the button does on a touch screen, for the Controls screen */
  hint: string;
  /** rim color, or null for the color of the selected element or rite */
  accent: string | null;
}

/** One way to push the stick, for the Controls screen. */
export interface StickDirectionSpec {
  direction: "side" | "far side" | "up" | "down";
  label: string;
}

/** What the stick asks for after reading how far the thumb pushed it. */
export interface StickInput {
  /** -1 left, 1 right, 0 neither */
  dir: number;
  run: boolean;
  up: boolean;
  down: boolean;
}

/** How a button looks in one frame; the face is redrawn only when this changes. */
export interface ButtonLook {
  pressed: boolean;
  /** false when the action cannot happen now, for example without enough MP */
  ready: boolean;
  /** part of a cooldown still to wait, 0 to 1 */
  cooldown: number;
  /** rim color as 0xRRGGBB */
  accent: number;
  /** ultimate only: levels the MP bar pays for, 0 to 4 */
  affordable: number;
  /** ultimate only: charge progress across the four levels, 0 to 4, or -1 when not charging */
  charge: number;
}

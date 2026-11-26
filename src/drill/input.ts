import { KEYMAP } from "../constants/input";
import { horizontalDirection, isHeld, take } from "../game/input";
import type { DrillInput } from "../types/drill";
import type { InputAction } from "../types/input";

export const DRILL_KEYMAP: Readonly<Record<string, InputAction>> = {
  ...KEYMAP,
  Space: "up",
  ShiftLeft: "dash",
  ShiftRight: "dash",
  KeyU: "warp",
};

export function readDrillInput(): DrillInput {
  const dir = horizontalDirection();
  return {
    dir: dir < 0 ? -1 : dir > 0 ? 1 : 0,
    jumpHeld: isHeld("up"),
    jump: take("up"),
    dash: take("dash"),
    attack: take("attack"),
    attackHeld: isHeld("attack"),
    cast: take("cast"),
    cycle: take("cycle"),
    warp: take("warp"),
    guardHeld: isHeld("guard"),
    guard: take("guard"),
    drop: take("down"),
  };
}

import type { InputAction } from "../types/input";

export const KEYMAP: Record<string, InputAction> = {
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  Space: "jump",
  KeyJ: "attack",
  KeyZ: "attack",
  KeyK: "warp",
  KeyX: "warp",
  KeyL: "cast",
  KeyC: "cast",
  KeyQ: "cycle",
  KeyV: "cycle",
  ShiftLeft: "dodge",
  ShiftRight: "dodge",
  KeyM: "mute",
};

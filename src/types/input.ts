export type InputAction =
  | "left"
  | "right"
  | "up"
  | "down"
  | "attack"
  | "warp"
  | "cast"
  | "ultimate"
  | "cycle"
  | "dash"
  | "mute"
  | "pause"
  | "fullscreen";

/** what a key does inside the menu */
export type MenuCommand = "up" | "down" | "left" | "right" | "select" | "back";

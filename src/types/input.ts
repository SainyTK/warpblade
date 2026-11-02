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

/** an on-screen button for touch screens; the pad holds movement, the other side the moves */
export interface TouchButton {
  action: InputAction;
  label: string;
  side: "pad" | "acts";
}

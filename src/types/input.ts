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
  /** a one-shot press that counts as a double tap toward the held side, from the touch stick */
  | "run"
  | "mute";

export type InputAction =
  | "left"
  | "right"
  | "up"
  | "down"
  /** J let go before a long press: the normal attack */
  | "attack"
  /** J held to a long press: the warp move */
  | "warp"
  /** K: guard, and a perfect guard (parry) at the moment a blow lands */
  | "guard"
  /** I let go before a long press: the selected ability */
  | "cast"
  /** I held to a long press: the selected ability's wide form */
  | "castWide"
  | "ultimate"
  | "cycle"
  /** L: the front dodge */
  | "dash"
  /** a one-shot press that counts as a double tap toward the held side, from the touch stick */
  | "run"
  | "mute"
  | "pause"
  | "fullscreen";

/** a key that is a tap when let go quickly and its long press when held: J and I */
export type HeldAction = "attack" | "cast";

/** what a key does inside the menu */
export type MenuCommand = "up" | "down" | "left" | "right" | "select" | "back";

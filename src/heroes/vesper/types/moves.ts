/** Vesper's combo moves: the ground string of four presses and the air string of four */
export type VesperMoveId =
  | "duskCross"
  | "risingPair"
  | "scissorTurn"
  | "moonrise"
  | "swallowCut"
  | "wingCut"
  | "twinWheel"
  | "nightfall";

/** the action clips Vesper's moves and states play */
export type VesperClipName =
  | VesperMoveId
  | "guard"
  | "hurt"
  | "dodge"
  | "throw"
  | "arrival"
  | "crescent"
  | "crescentWide"
  | "stitch"
  | "waltz";

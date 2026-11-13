/** I: the Veil, which hides him from minions while it lasts */
export const VEIL = {
  /** Gloam to raise it, and Gloam a second while it holds */
  enter: 20,
  drain: 8,
  /** seconds before I can raise it again after it ends */
  lock: 1,
  /** seconds the Veil holds after his first blow out of it */
  strikeEnd: 0.2,
  /** his walk is this much faster while veiled */
  walk: 1.15,
  /** seconds the hood takes to come down: the crouch and flicker as it rises or falls */
  flicker: 3 / 30,
} as const;

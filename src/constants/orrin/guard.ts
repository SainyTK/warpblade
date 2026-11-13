/** K: his spinning-chain guard, a weak block that lets a good share through for a strong parry */
export const CHAIN_GUARD = {
  chip: 0.35,
  blockCost: 18,
  /** the disc of chain spun in front of him: its radius, and how fast it turns, in turns a second */
  radius: 11,
  spin: 5,
} as const;

/**
 * Chain Bind, his parry: the chain wraps the foe that struck and hauls it to the chain's tip in front of him, where his
 * string hits hardest, and holds it stunned for a free string. A mini boss or boss is held in place for a moment instead.
 */
export const CHAIN_BIND = {
  /** seconds a minion is held, and a mini boss or boss */
  hold: 1.2,
  bigHold: 0.5,
  /** the foe is hauled to stand this far in front of him: the tip of the Lash */
  tip: 52,
  /** the yank's own blow on the bound foe, as attack damage */
  power: 0.5,
  /** Momentum a parry gives */
  momentum: 20,
  /** Undertow's drag finds more foes this far round the bound one, and lines them up this far apart behind it */
  dragReach: 60,
  dragGap: 12,
  /** seconds the taut chain of the yank shows */
  yankTime: 0.16,
} as const;

/** the warp kick's bind: seconds it holds a minion and a bigger foe, so a string can follow */
export const WARP_BIND = { hold: 0.6, bigHold: 0.25 } as const;

/** the warp kick: its knockback stays short so the bound foe stays in reach, and a foe winding up reels this long */
export const WARP_KICK = { kx: 40, ky: -30, windupStun: 1.2 } as const;

/** the brass arc the warp kick's heel leaves */
export const KICK_SLASH = {
  cx: 4,
  cy: -14,
  R: 16,
  sy: 0.7,
  rot: 0.3,
  a0: -2.4,
  a1: 0.9,
  W: 6,
  hold: 0.05,
  trail: 0.2,
} as const;

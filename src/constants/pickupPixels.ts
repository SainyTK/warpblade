/** Pickups at full detail, as rows of image pixels; each letter is a color in the picture's own table. */

/** a coin through half a turn: its face, three quarters on, then its edge */
export const COIN_TURNS = [
  [".dGGd.", "dGLLGd", "GLWGgG", "GLGGgG", "dGggGd", ".dggd."],
  [".GG.", "dLGd", "GLgG", "GLgG", "dGgd", ".gg."],
  ["LG", "LG", "Lg", "Gg", "Gg", "gd"],
] as const;
export const COIN_TURN_ART = [
  { front: "coin", back: "coin_back" },
  { front: "coin_turn", back: "coin_back_turn" },
  { front: "coin_edge", back: "coin_edge" },
] as const;
/** which picture each of the eight steps of a full turn shows, and whether it is the coin's front */
export const COIN_STEPS = [
  { turn: 0, front: true },
  { turn: 1, front: true },
  { turn: 2, front: true },
  { turn: 1, front: false },
  { turn: 0, front: false },
  { turn: 1, front: false },
  { turn: 2, front: false },
  { turn: 1, front: true },
] as const;
/** steps of the turn a second */
export const COIN_SPIN = 14;

/** an experience orb: a cut gem lit from the upper left */
export const XP_ORB_PIXELS = ["...l...", "..lHl..", ".lHWLl.", "lHWLLld", ".lLLld.", "..lld..", "...d..."] as const;

/** a mana or heal mote: a small round bead */
export const MOTE_PIXELS = [".lll.", "lHWLl", "lWLLd", "lLLLd", ".ddd."] as const;
export const MOTE_DRAW_SHIFT = 1;
export const LYING_PICKUP_LIFT = 0.5;
export const SHARD_LIFT = 5;

export const SHARD_PIXELS = {
  heart: [
    ".dll...lld.",
    "dlHHl.lLLld",
    "lHWWLlLLLLd",
    "lHWLLlLLLLd",
    "lLLLlLLLLLd",
    ".lLlLLLLLd.",
    "..llLLLLd..",
    "...lLLLd...",
    "....lLd....",
    ".....d.....",
  ],
  mana: [
    "....l....",
    "...lHl...",
    "..lHWLl..",
    ".lHWLLLd.",
    "lHWLLLLLd",
    "lLLLLLLLd",
    ".lLLLLLd.",
    "..lLLLd..",
    "...lLd...",
    "....d....",
  ],
} as const;

import type { RelicDef } from "../../types/build";

/** Seeker Wisp. Design: docs/growth-design.md */
export const WISP: RelicDef = {
  id: "wisp",
  name: "Seeker Wisp",
  text: "A wisp at your shoulder fires homing bolts at the nearest foe.",
  levels: [
    { damage: 7, cooldown: 1.2, amount: 1, pierce: 1, text: "A wisp fires a homing bolt." },
    { damage: 7, cooldown: 1.2, amount: 2, pierce: 1, text: "One more bolt." },
    { damage: 7, cooldown: 1, amount: 2, pierce: 1, text: "Fires 0.2 s sooner." },
    { damage: 7, cooldown: 1, amount: 3, pierce: 1, text: "One more bolt." },
    { damage: 10, cooldown: 1, amount: 3, pierce: 1, text: "Damage +3." },
    { damage: 10, cooldown: 1, amount: 4, pierce: 1, text: "One more bolt." },
    { damage: 10, cooldown: 1, amount: 4, pierce: 2, text: "Bolts pass through one more foe." },
    { damage: 14, cooldown: 1, amount: 4, pierce: 2, text: "Damage +4." },
  ],
  evolution: {
    charm: "haste",
    name: "Wisp Choir",
    text: "Three wisps, firing twice as often.",
    stats: { damage: 13, cooldown: 0.5, amount: 6, pierce: 2, text: "Three wisps, firing twice as often." },
  },
};

/** how the wisp floats and its bolts fly, before the build's speed */
export const WISP_FLIGHT = {
  /** where a wisp floats: toward the hero's back and above the feet, in art pixels; the choir's three */
  perch: [[9, 28]] as readonly (readonly [number, number])[],
  choir: [
    [11, 26],
    [0, 36],
    [-11, 26],
  ] as readonly (readonly [number, number])[],
  /** bob height in art pixels and its pace in radians a second */
  bob: 1.5,
  bobRate: 3.2,
  /** how quickly a wisp catches up with its perch, a share a second */
  follow: 8,
  /** bolt speed in art pixels a second, how fast it turns toward its foe in radians a second, and its life in seconds */
  speed: 150,
  turn: 7,
  life: 2,
  /** seconds between the bolts of one volley */
  spacing: 0.07,
  /** how far past a foe's body a bolt still strikes it */
  reach: 2,
  /** seconds before one bolt may strike the same foe again */
  gap: 0.45,
  kick: 20,
} as const;

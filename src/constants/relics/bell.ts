import type { RelicDef } from "../../types/build";

/** Frost Bell. Design: docs/growth-design.md */
export const BELL: RelicDef = {
  id: "bell",
  name: "Frost Bell",
  text: "A cold ring spreads from you, hurting foes and slowing them.",
  levels: [
    { damage: 10, cooldown: 4, area: 1, duration: 1.5, text: "A cold ring hurts and slows foes." },
    { damage: 14, cooldown: 4, area: 1, duration: 1.5, text: "Damage +4." },
    { damage: 14, cooldown: 3.5, area: 1.2, duration: 1.5, text: "Rings sooner and wider." },
    { damage: 20, cooldown: 3.5, area: 1.2, duration: 2, text: "Damage +6, slows longer." },
    { damage: 20, cooldown: 3, area: 1.4, duration: 2, text: "Rings sooner and wider." },
    { damage: 28, cooldown: 3, area: 1.4, duration: 2, text: "Damage +8." },
    { damage: 28, cooldown: 2.6, area: 1.6, duration: 2.5, text: "Rings sooner and wider, slows longer." },
    { damage: 36, cooldown: 2.6, area: 1.6, duration: 2.5, text: "Damage +8." },
  ],
  evolution: {
    charm: "reach",
    name: "Glacier Toll",
    text: "The bell rings twice, and the second ring freezes.",
    stats: {
      damage: 44,
      cooldown: 2.4,
      area: 1.8,
      duration: 1.2,
      text: "The bell rings twice, and the second ring freezes.",
    },
  },
};

/** the ring's size and speed; `area` scales the radius */
export const BELL_RING = {
  /** radius the ring runs out to at area 1, in art pixels */
  radius: 48,
  /** the ring is this tall for its width, centred on the hero's middle */
  tall: 0.7,
  /** seconds the ring takes to run out */
  spread: 0.45,
  /** height of the hero's middle above their feet */
  middle: 14,
  /** where the small bell hangs over the hero's head while it rings, and how long it shows */
  bellRise: 50,
  bellShow: 0.7,
} as const;

/** Glacier Toll: seconds between its two rings, how long the first ring chills, and the share of the freeze mini bosses and bosses take */
export const GLACIER_TOLL = { echo: 0.45, chill: 2.5, bossFreezeShare: 0.5 } as const;

/** chilled foes move at this share of their speed */
export const CHILL_PACE = 0.5;

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

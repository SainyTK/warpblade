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
    { damage: 14, cooldown: 1, amount: 3, pierce: 1, text: "Damage +7." },
    { damage: 14, cooldown: 1, amount: 4, pierce: 1, text: "One more bolt." },
    { damage: 14, cooldown: 1, amount: 4, pierce: 2, text: "Bolts pass through one more foe." },
    { damage: 21, cooldown: 1, amount: 4, pierce: 2, text: "Damage +7." },
  ],
  evolution: {
    charm: "haste",
    name: "Wisp Choir",
    text: "Three wisps, firing twice as often.",
    stats: { damage: 21, cooldown: 0.5, amount: 6, pierce: 2, text: "Three wisps, firing twice as often." },
  },
};

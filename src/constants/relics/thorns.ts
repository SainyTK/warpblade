import type { RelicDef } from "../../types/build";

/** Thorn Trail. Design: docs/growth-design.md */
export const THORNS: RelicDef = {
  id: "thorns",
  name: "Thorn Trail",
  text: "Moving leaves thorns that hurt foes standing in them.",
  levels: [
    { damage: 6, cooldown: 0.4, amount: 1, area: 1, duration: 2, text: "Thorns sprout where you move." },
    { damage: 6, cooldown: 0.4, amount: 2, area: 1, duration: 2, text: "Thorns sprout twice as often." },
    { damage: 9, cooldown: 0.4, amount: 2, area: 1.2, duration: 2, text: "Damage +3, larger thorns." },
    { damage: 9, cooldown: 0.4, amount: 2, area: 1.2, duration: 2.5, text: "Thorns last longer." },
    { damage: 12, cooldown: 0.35, amount: 3, area: 1.2, duration: 2.5, text: "Damage +3, more thorns." },
    { damage: 12, cooldown: 0.35, amount: 3, area: 1.4, duration: 3, text: "Larger thorns that last longer." },
    { damage: 16, cooldown: 0.3, amount: 3, area: 1.4, duration: 3, text: "Damage +4, they hurt more often." },
    { damage: 16, cooldown: 0.3, amount: 4, area: 1.6, duration: 3, text: "More, larger thorns." },
  ],
  evolution: {
    charm: "swiftness",
    name: "Bramble Wake",
    text: "Thorns follow you and grow while you move.",
    stats: {
      damage: 24,
      cooldown: 0.25,
      amount: 4,
      area: 2,
      duration: 3,
      text: "Thorns follow you and grow while you move.",
    },
  },
};

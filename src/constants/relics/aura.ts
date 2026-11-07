import type { RelicDef } from "../../types/build";

/** Ember Aura. Design: docs/growth-design.md */
export const AURA: RelicDef = {
  id: "aura",
  name: "Ember Aura",
  text: "A ring of embers burns foes close to you.",
  levels: [
    { damage: 4, cooldown: 0.8, area: 1, text: "Embers burn foes close by." },
    { damage: 5, cooldown: 0.8, area: 1.3, text: "Damage +1, wider ring." },
    { damage: 6, cooldown: 0.7, area: 1.3, text: "Damage +1, burns more often." },
    { damage: 7, cooldown: 0.7, area: 1.5, text: "Damage +1, wider ring." },
    { damage: 9, cooldown: 0.6, area: 1.5, text: "Damage +2, burns more often." },
    { damage: 10, cooldown: 0.6, area: 1.7, text: "Damage +1, wider ring." },
    { damage: 12, cooldown: 0.5, area: 1.7, text: "Damage +2, burns more often." },
    { damage: 14, cooldown: 0.5, area: 2, text: "Damage +2, wider ring." },
  ],
  evolution: {
    charm: "vigor",
    name: "Sun Heart",
    text: "A larger, hotter ring, and every kill in it heals you.",
    stats: { damage: 24, cooldown: 0.4, area: 2.6, text: "A larger, hotter ring, and every kill in it heals you." },
  },
};

import type { RelicDef } from "../../types/build";

/** Echo Blade. Design: docs/growth-design.md */
export const ECHO: RelicDef = {
  id: "echo",
  name: "Echo Blade",
  text: "Every fourth hit of your own sends a crescent forward.",
  levels: [
    { damage: 12, amount: 4, area: 1, text: "Every 4th hit sends a crescent." },
    { damage: 16, amount: 4, area: 1, text: "Damage +4." },
    { damage: 16, amount: 3, area: 1.15, text: "Every 3rd hit, a larger crescent." },
    { damage: 22, amount: 3, area: 1.15, text: "Damage +6." },
    { damage: 22, amount: 3, area: 1.3, text: "A larger crescent." },
    { damage: 30, amount: 3, area: 1.3, text: "Damage +8." },
    { damage: 30, amount: 2, area: 1.3, text: "Every 2nd hit." },
    { damage: 40, amount: 2, area: 1.45, text: "Damage +10, a larger crescent." },
  ],
  evolution: {
    charm: "might",
    name: "Phantom Arc",
    text: "Every second hit sends crescents both ways, and they come back.",
    stats: {
      damage: 56,
      amount: 2,
      area: 1.6,
      text: "Every second hit sends crescents both ways, and they come back.",
    },
  },
};

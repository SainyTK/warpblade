import type { RelicDef } from "../../types/build";

/** Storm Rod. Design: docs/growth-design.md */
export const STORM: RelicDef = {
  id: "storm",
  name: "Storm Rod",
  text: "Lightning strikes foes anywhere on the screen.",
  levels: [
    { damage: 14, cooldown: 2.5, amount: 1, area: 1, text: "Lightning strikes a foe." },
    { damage: 14, cooldown: 2.5, amount: 2, area: 1, text: "One more strike." },
    { damage: 20, cooldown: 2.5, amount: 2, area: 1.2, text: "Damage +6, wider strikes." },
    { damage: 20, cooldown: 2.2, amount: 3, area: 1.2, text: "One more strike, sooner." },
    { damage: 28, cooldown: 2.2, amount: 3, area: 1.2, text: "Damage +8." },
    { damage: 28, cooldown: 2, amount: 4, area: 1.4, text: "One more strike, sooner and wider." },
    { damage: 36, cooldown: 2, amount: 4, area: 1.4, text: "Damage +8." },
    { damage: 36, cooldown: 1.8, amount: 5, area: 1.4, text: "One more strike, sooner." },
  ],
  evolution: {
    charm: "fortune",
    name: "Thunder Crown",
    text: "Each strike arcs on to two more foes.",
    stats: { damage: 44, cooldown: 1.5, amount: 5, area: 1.5, text: "Each strike arcs on to two more foes." },
  },
};

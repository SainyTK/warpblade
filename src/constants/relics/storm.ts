import type { RelicDef } from "../../types/build";

/** Storm Rod. Design: docs/growth-design.md */
export const STORM: RelicDef = {
  id: "storm",
  name: "Storm Rod",
  text: "Lightning strikes foes anywhere on the screen.",
  levels: [
    { damage: 14, cooldown: 2.5, amount: 1, area: 1, text: "Lightning strikes a foe." },
    { damage: 14, cooldown: 2.5, amount: 2, area: 1, text: "One more strike." },
    { damage: 18, cooldown: 2.5, amount: 2, area: 1.2, text: "Damage +4, wider strikes." },
    { damage: 18, cooldown: 2.2, amount: 3, area: 1.2, text: "One more strike, sooner." },
    { damage: 22, cooldown: 2.2, amount: 3, area: 1.2, text: "Damage +4." },
    { damage: 22, cooldown: 2, amount: 3, area: 1.4, text: "Sooner and wider strikes." },
    { damage: 26, cooldown: 2, amount: 3, area: 1.4, text: "Damage +4." },
    { damage: 26, cooldown: 2, amount: 4, area: 1.4, text: "One more strike." },
  ],
  evolution: {
    charm: "fortune",
    name: "Thunder Crown",
    text: "Each strike arcs on to two more foes.",
    stats: { damage: 36, cooldown: 1.5, amount: 5, area: 1.5, text: "Each strike arcs on to two more foes." },
  },
};

/** how the strikes fall, before the level's area */
export const STORM_STRIKE = {
  /** seconds the mark crackles before the strike, and between the strikes of one volley */
  mark: 0.16,
  spacing: 0.1,
  /** foes this close to a strike, in art pixels, are struck too */
  radius: 12,
  /** Thunder Crown: foes each strike arcs to, how far it reaches and the share of the strike's damage it deals */
  arcs: 2,
  arcReach: 90,
  arcShare: 0.5,
  /** seconds the bolt stays on screen */
  life: 0.28,
} as const;

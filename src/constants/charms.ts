import type { CharmDef, CharmId } from "../types/build";

/** Charms: passives that multiply a stat for every source. Design: docs/growth-design.md */
export const CHARMS: Readonly<Record<CharmId, CharmDef>> = {
  might: { id: "might", name: "Might", text: "Damage +10%, every source.", maxLevel: 5, weight: 90 },
  haste: {
    id: "haste",
    name: "Haste",
    text: "Skill cooldowns and every recharge 8% shorter.",
    maxLevel: 5,
    weight: 50,
  },
  multitude: { id: "multitude", name: "Multitude", text: "Skills fire and summon one more.", maxLevel: 2, weight: 50 },
  reach: { id: "reach", name: "Reach", text: "Skill area +10%.", maxLevel: 5, weight: 90 },
  persistence: {
    id: "persistence",
    name: "Persistence",
    text: "Skill effects last 10% longer.",
    maxLevel: 5,
    weight: 90,
  },
  swiftness: {
    id: "swiftness",
    name: "Swiftness",
    text: "Skill projectiles 10% faster, move speed +4%.",
    maxLevel: 5,
    weight: 90,
  },
  fortune: {
    id: "fortune",
    name: "Fortune",
    text: "Luck +10%: a fourth card more often, richer chests, crit +2%.",
    maxLevel: 5,
    weight: 90,
  },
  vigor: { id: "vigor", name: "Vigor", text: "Max HP +15%, and 0.2 HP back each second.", maxLevel: 5, weight: 90 },
  insight: { id: "insight", name: "Insight", text: "Experience +8%.", maxLevel: 5, weight: 70 },
  resonance: { id: "resonance", name: "Resonance", text: "Flow holds 20% more stacks.", maxLevel: 5, weight: 70 },
};
/** per level of each charm */
export const CHARM_STEP = {
  might: 0.1,
  haste: 0.08,
  multitude: 1,
  reach: 0.1,
  persistence: 0.1,
  swiftness: 0.1,
  swiftnessMove: 0.04,
  fortune: 0.1,
  fortuneCrit: 0.02,
  vigor: 1.15,
  vigorRegen: 0.2,
  insight: 0.08,
  resonance: 0.2,
} as const;

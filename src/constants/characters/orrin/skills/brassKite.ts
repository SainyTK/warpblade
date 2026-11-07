import type { SkillDef } from "../../../../types/skill";

/** Brass Kite. Design: docs/skills/orrin.md. Values: chance: chance a release launches one; count: most kites out; life: seconds; power: attack damage a dive; every: seconds between dives; pairs: 1 kites dive in pairs; chill: 1 a dive chills; armada: 1 four kites circle all the time and dive with every swing kick (evolution) */
export const BRASS_KITE: SkillDef = {
  id: "o_kite",
  name: "Brass Kite",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "Letting go of a swing may launch a brass kite that dives at foes.",
  levels: [
    {
      text: "20% on a release: a kite dives for 0.6x.",
      values: { chance: 0.2, count: 1, life: 6, power: 0.6, every: 1, pairs: 0, chill: 0, armada: 0 },
    },
    {
      text: "35% chance.",
      values: { chance: 0.35, count: 1, life: 6, power: 0.6, every: 1, pairs: 0, chill: 0, armada: 0 },
    },
    {
      text: "Two kites.",
      values: { chance: 0.35, count: 2, life: 6, power: 0.6, every: 1, pairs: 0, chill: 0, armada: 0 },
    },
    {
      text: "Kites dive in pairs.",
      values: { chance: 0.35, count: 2, life: 6, power: 0.6, every: 1, pairs: 1, chill: 0, armada: 0 },
    },
    {
      text: "Dives deal 0.9x.",
      values: { chance: 0.35, count: 2, life: 6, power: 0.9, every: 1, pairs: 1, chill: 0, armada: 0 },
    },
    {
      text: "A dive chills.",
      values: { chance: 0.35, count: 2, life: 6, power: 0.9, every: 1, pairs: 1, chill: 1, armada: 0 },
    },
    {
      text: "Kites stay 10 s.",
      values: { chance: 0.35, count: 2, life: 10, power: 0.9, every: 1, pairs: 1, chill: 1, armada: 0 },
    },
    {
      text: "Dives deal 1.3x.",
      values: { chance: 0.35, count: 2, life: 10, power: 1.3, every: 1, pairs: 1, chill: 1, armada: 0 },
    },
  ],
  evolution: {
    partner: "o_pump",
    name: "Sky Armada",
    text: "Four kites circle you all the time and dive with every swing kick.",
    row: {
      text: "Four kites, always out, dive on kicks.",
      values: { chance: 0.35, count: 4, life: 10, power: 1.3, every: 1, pairs: 1, chill: 1, armada: 1 },
    },
  },
};

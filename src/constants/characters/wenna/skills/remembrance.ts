import type { SkillDef } from "../../../../types/skill";

/** Remembrance. Design: docs/skills/wenna.md. Values: chance: chance a Wick's end raises a ghost candle; cooldown: seconds between ghosts; life: seconds a ghost stays; power: ability power of each bolt; every: seconds between its bolts; pierce: foes a bolt passes through; count: ghosts it raises; vigil: 1 every ended Wick leaves a ghost whose bolts add Hot Wax (evolution) */
export const REMEMBRANCE: SkillDef = {
  id: "w_ghost",
  name: "Remembrance",
  kind: "summon",
  risk: "timed",
  button: "auto",
  text: "A Wick that ends may rise again as a ghost candle that shoots.",
  levels: [
    {
      text: "25% as a Wick ends: a ghost shoots 0.5x for 4 s.",
      values: { chance: 0.25, cooldown: 2, life: 4, power: 0.5, every: 0.6, pierce: 0, count: 1, vigil: 0 },
    },
    {
      text: "40% chance.",
      values: { chance: 0.4, cooldown: 2, life: 4, power: 0.5, every: 0.6, pierce: 0, count: 1, vigil: 0 },
    },
    {
      text: "Ghost bolts pass through a foe.",
      values: { chance: 0.4, cooldown: 2, life: 4, power: 0.5, every: 0.6, pierce: 1, count: 1, vigil: 0 },
    },
    {
      text: "Bolts deal 0.7x.",
      values: { chance: 0.4, cooldown: 2, life: 4, power: 0.7, every: 0.6, pierce: 1, count: 1, vigil: 0 },
    },
    {
      text: "Ghosts stay 6 s.",
      values: { chance: 0.4, cooldown: 2, life: 6, power: 0.7, every: 0.6, pierce: 1, count: 1, vigil: 0 },
    },
    {
      text: "Two ghosts.",
      values: { chance: 0.4, cooldown: 2, life: 6, power: 0.7, every: 0.6, pierce: 1, count: 2, vigil: 0 },
    },
    {
      text: "Bolts deal 0.9x.",
      values: { chance: 0.4, cooldown: 2, life: 6, power: 0.9, every: 0.6, pierce: 1, count: 2, vigil: 0 },
    },
    {
      text: "Bolts deal 1.2x.",
      values: { chance: 0.4, cooldown: 2, life: 6, power: 1.2, every: 0.6, pierce: 1, count: 2, vigil: 0 },
    },
  ],
  evolution: {
    partner: "w_hotWax",
    name: "Vigil of the Lost",
    text: "Every ended Wick leaves a ghost whose bolts add Hot Wax.",
    row: {
      text: "Every ended Wick leaves a ghost.",
      values: { chance: 0.4, cooldown: 2, life: 6, power: 1.2, every: 0.6, pierce: 1, count: 2, vigil: 1 },
    },
  },
};

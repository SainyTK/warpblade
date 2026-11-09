import type { SkillDef } from "../../../../types/skill";

/** Clockwork Wren. Design: docs/skills/mirel.md. Values: chance: chance a Toll hit sends one; cooldown: seconds between wrens; power: attack damage a peck; pecks: pecks before it leaves; count: wrens it sends; chill: 1 pecks chill; life: seconds a wren stays, pecking once a second (0: it leaves after its pecks); chorus: 1 every Toll sends four wrens whose pecks add Age (evolution) */
export const CLOCKWORK_WREN: SkillDef = {
  id: "m_wren",
  name: "Clockwork Wren",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A Toll that hits may wind up a clockwork bird that pecks foes.",
  levels: [
    {
      text: "15% on a Toll hit: a wren pecks 0.4x 3 times.",
      values: { chance: 0.15, cooldown: 2, power: 0.4, pecks: 3, count: 1, chill: 0, life: 0, chorus: 0 },
    },
    {
      text: "25% chance.",
      values: { chance: 0.25, cooldown: 2, power: 0.4, pecks: 3, count: 1, chill: 0, life: 0, chorus: 0 },
    },
    {
      text: "Two wrens.",
      values: { chance: 0.25, cooldown: 2, power: 0.4, pecks: 3, count: 2, chill: 0, life: 0, chorus: 0 },
    },
    {
      text: "Pecks chill.",
      values: { chance: 0.25, cooldown: 2, power: 0.4, pecks: 3, count: 2, chill: 1, life: 0, chorus: 0 },
    },
    {
      text: "Pecks deal 0.6x.",
      values: { chance: 0.25, cooldown: 2, power: 0.6, pecks: 3, count: 2, chill: 1, life: 0, chorus: 0 },
    },
    {
      text: "Wrens stay 6 s.",
      values: { chance: 0.25, cooldown: 2, power: 0.6, pecks: 3, count: 2, chill: 1, life: 6, chorus: 0 },
    },
    {
      text: "35% chance.",
      values: { chance: 0.35, cooldown: 2, power: 0.6, pecks: 3, count: 2, chill: 1, life: 6, chorus: 0 },
    },
    {
      text: "Pecks deal 0.8x.",
      values: { chance: 0.35, cooldown: 2, power: 0.8, pecks: 3, count: 2, chill: 1, life: 6, chorus: 0 },
    },
  ],
  evolution: {
    partner: "m_wither",
    name: "Cuckoo Chorus",
    text: "Every Toll sends four wrens whose pecks add Age.",
    row: {
      text: "Four wrens every Toll; pecks add Age.",
      values: { chance: 0.35, cooldown: 2, power: 0.8, pecks: 3, count: 4, chill: 1, life: 6, chorus: 1 },
    },
  },
};

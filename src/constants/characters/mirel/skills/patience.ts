import type { SkillDef } from "../../../../types/skill";

/** Patience. Design: docs/skills/mirel.md. Values: refill: share faster Sand refills; max: Sand above 100 she can hold; field: share less the Stillfield costs; rewind: Sand less a Rewind costs; echo: share more her echoes deal to still foes; timeless: 1 Sand keeps refilling while a Stillfield stands (evolution) */
export const PATIENCE: SkillDef = {
  id: "m_patience",
  name: "Patience",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "Sand refills faster and goes further.",
  levels: [
    { text: "Sand refills 25% faster.", values: { refill: 0.25, max: 0, field: 0, rewind: 0, echo: 0, timeless: 0 } },
    { text: "Hold 20 more Sand.", values: { refill: 0.25, max: 20, field: 0, rewind: 0, echo: 0, timeless: 0 } },
    { text: "Sand refills 40% faster.", values: { refill: 0.4, max: 20, field: 0, rewind: 0, echo: 0, timeless: 0 } },
    {
      text: "The Stillfield costs 20% less.",
      values: { refill: 0.4, max: 20, field: 0.2, rewind: 0, echo: 0, timeless: 0 },
    },
    {
      text: "Rewind costs 5 less Sand.",
      values: { refill: 0.4, max: 20, field: 0.2, rewind: 5, echo: 0, timeless: 0 },
    },
    {
      text: "Echoes on still foes deal 15% more.",
      values: { refill: 0.4, max: 20, field: 0.2, rewind: 5, echo: 0.15, timeless: 0 },
    },
    { text: "Hold 30 more Sand.", values: { refill: 0.4, max: 30, field: 0.2, rewind: 5, echo: 0.15, timeless: 0 } },
    {
      text: "Sand refills 60% faster.",
      values: { refill: 0.6, max: 30, field: 0.2, rewind: 5, echo: 0.15, timeless: 0 },
    },
  ],
  evolution: {
    partner: "m_pastself",
    name: "Timeless",
    text: "Sand keeps refilling while a Stillfield stands.",
    row: {
      text: "Sand refills while a field stands.",
      values: { refill: 0.6, max: 30, field: 0.2, rewind: 5, echo: 0.15, timeless: 1 },
    },
  },
};

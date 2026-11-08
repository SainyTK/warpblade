import type { SkillDef } from "../../../../types/skill";

/** Twin Chain. Design: docs/skills/orrin.md. Values: power: the shade's Full Circle as a multiple of yours; momentum: Momentum a shade gives; count: shades a Slip calls; swing: 1 the shade swings and spins again; copy: 1 the shade copies your next Hanging Arc; mirror: 1 a Slip calls three shades whose tips all crit (evolution) */
export const TWIN_CHAIN: SkillDef = {
  id: "o_twin",
  name: "Twin Chain",
  kind: "summon",
  risk: "precise",
  button: "auto",
  text: "A Slip calls a shade of you that spins a Full Circle.",
  levels: [
    {
      text: "A Slip calls a shade's Full Circle.",
      values: { power: 1, momentum: 0, count: 1, swing: 0, copy: 0, mirror: 0 },
    },
    { text: "A shade gives 10 Momentum.", values: { power: 1, momentum: 10, count: 1, swing: 0, copy: 0, mirror: 0 } },
    { text: "Two shades.", values: { power: 1, momentum: 10, count: 2, swing: 0, copy: 0, mirror: 0 } },
    {
      text: "The shade swings and spins again.",
      values: { power: 1, momentum: 10, count: 2, swing: 1, copy: 0, mirror: 0 },
    },
    {
      text: "The shade copies your next Hanging Arc.",
      values: { power: 1, momentum: 10, count: 2, swing: 1, copy: 1, mirror: 0 },
    },
    { text: "Shades hit 1.4x as hard.", values: { power: 1.4, momentum: 10, count: 2, swing: 1, copy: 1, mirror: 0 } },
    { text: "Shades hit 1.7x as hard.", values: { power: 1.7, momentum: 10, count: 2, swing: 1, copy: 1, mirror: 0 } },
    { text: "Shades hit 2x as hard.", values: { power: 2, momentum: 10, count: 2, swing: 1, copy: 1, mirror: 0 } },
  ],
  evolution: {
    partner: "o_sweetspot",
    name: "Mirror Dance",
    text: "Every Slip calls three shades whose tip hits all crit.",
    row: {
      text: "Three shades; their tips always crit.",
      values: { power: 2, momentum: 10, count: 3, swing: 1, copy: 1, mirror: 1 },
    },
  },
};

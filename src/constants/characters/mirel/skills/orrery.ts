import type { SkillDef } from "../../../../types/skill";

/** Orrery. Design: docs/skills/mirel.md. Values: chance: chance a cast calls them; cooldown: seconds between orreries; count: gears; radius: their orbit; life: seconds; power: ability power a gear deals every 0.3 s; slow: 1 gears slow foes; celestial: 1 gears orbit all the time and spin out at foes on each cast (evolution) */
export const ORRERY: SkillDef = {
  id: "m_orrery",
  name: "Orrery",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A cast may set gear planets orbiting her that grind foes they touch.",
  levels: [
    {
      text: "25% on a cast: three gears orbit for 5 s.",
      values: { chance: 0.25, cooldown: 2, count: 3, radius: 28, life: 5, power: 0.3, slow: 0, celestial: 0 },
    },
    {
      text: "40% chance.",
      values: { chance: 0.4, cooldown: 2, count: 3, radius: 28, life: 5, power: 0.3, slow: 0, celestial: 0 },
    },
    {
      text: "Gears orbit at 36 px.",
      values: { chance: 0.4, cooldown: 2, count: 3, radius: 36, life: 5, power: 0.3, slow: 0, celestial: 0 },
    },
    {
      text: "Four gears.",
      values: { chance: 0.4, cooldown: 2, count: 4, radius: 36, life: 5, power: 0.3, slow: 0, celestial: 0 },
    },
    {
      text: "Gears deal 0.45x.",
      values: { chance: 0.4, cooldown: 2, count: 4, radius: 36, life: 5, power: 0.45, slow: 0, celestial: 0 },
    },
    {
      text: "Gears orbit 8 s.",
      values: { chance: 0.4, cooldown: 2, count: 4, radius: 36, life: 8, power: 0.45, slow: 0, celestial: 0 },
    },
    {
      text: "Gears slow foes.",
      values: { chance: 0.4, cooldown: 2, count: 4, radius: 36, life: 8, power: 0.45, slow: 1, celestial: 0 },
    },
    {
      text: "Gears deal 0.7x.",
      values: { chance: 0.4, cooldown: 2, count: 4, radius: 36, life: 8, power: 0.7, slow: 1, celestial: 0 },
    },
  ],
  evolution: {
    partner: "m_handsweep",
    name: "Celestial Clock",
    text: "The gears orbit her all the time and spin out at foes on each cast.",
    row: {
      text: "Gears always out; they spin out on casts.",
      values: { chance: 0.4, cooldown: 2, count: 4, radius: 36, life: 8, power: 0.7, slow: 1, celestial: 1 },
    },
  },
};

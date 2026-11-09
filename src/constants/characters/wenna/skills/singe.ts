import type { SkillDef } from "../../../../types/skill";

/** Singe. Design: docs/skills/wenna.md. Values: stacks: Singe each Wick bite adds; max: most stacks; damage: ability power a stack deals a second; life: seconds stacks last; own: 1 her own blows add stacks too; weak: share more Singed foes take from Wicks; ash: ability power each consumed stack deals to foes within 30 px when a foe at max stacks bursts (0: no burst; evolution) */
export const SINGE: SkillDef = {
  id: "w_singe",
  name: "Singe",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Wick bites leave Singe, a slow violet burn.",
  levels: [
    {
      text: "Wick bites add Singe: 0.05x a second a stack.",
      values: { stacks: 1, max: 6, damage: 0.05, life: 3, own: 0, weak: 0, ash: 0 },
    },
    {
      text: "Your own blows add Singe.",
      values: { stacks: 1, max: 6, damage: 0.05, life: 3, own: 1, weak: 0, ash: 0 },
    },
    { text: "Singe burns for 0.13x.", values: { stacks: 1, max: 6, damage: 0.13, life: 3, own: 1, weak: 0, ash: 0 } },
    { text: "Up to 10 stacks.", values: { stacks: 1, max: 10, damage: 0.13, life: 3, own: 1, weak: 0, ash: 0 } },
    {
      text: "Singed foes take 10% more from Wicks.",
      values: { stacks: 1, max: 10, damage: 0.13, life: 3, own: 1, weak: 0.1, ash: 0 },
    },
    {
      text: "Singe burns for 0.17x.",
      values: { stacks: 1, max: 10, damage: 0.17, life: 3, own: 1, weak: 0.1, ash: 0 },
    },
    { text: "Stacks last 5 s.", values: { stacks: 1, max: 10, damage: 0.17, life: 5, own: 1, weak: 0.1, ash: 0 } },
    {
      text: "Singe burns for 0.22x.",
      values: { stacks: 1, max: 10, damage: 0.22, life: 5, own: 1, weak: 0.1, ash: 0 },
    },
  ],
  evolution: {
    partner: "w_hotWax",
    name: "Ashfall",
    text: "A foe at max stacks bursts, consuming them for 1.2x each to foes within 30 px.",
    row: {
      text: "Full Singe bursts for 1.2x a stack.",
      values: { stacks: 1, max: 10, damage: 0.22, life: 5, own: 1, weak: 0.1, ash: 1.2 },
    },
  },
};

import type { SkillDef } from "../../../../types/skill";

/** Wither. Design: docs/skills/mirel.md. Values: stacks: Age stacks a blow adds; damage: attack damage a stack deals a second; max: most stacks; life: seconds; echo: 1 echoes add stacks; slow: share aged foes are slowed; dust: attack damage each stack deals when a foe at max stacks crumbles and consumes them (evolution) */
export const WITHER: SkillDef = {
  id: "m_wither",
  name: "Wither",
  kind: "dot",
  risk: "easy",
  button: "J",
  text: "Her blows age foes, and age keeps hurting.",
  levels: [
    {
      text: "Blows add an Age stack.",
      values: { stacks: 1, damage: 0.12, max: 6, life: 3, echo: 0, slow: 0, dust: 0 },
    },
    { text: "Echoes add stacks too.", values: { stacks: 1, damage: 0.12, max: 6, life: 3, echo: 1, slow: 0, dust: 0 } },
    { text: "Up to 10 stacks.", values: { stacks: 1, damage: 0.12, max: 10, life: 3, echo: 1, slow: 0, dust: 0 } },
    {
      text: "Aged foes are slowed 10%.",
      values: { stacks: 1, damage: 0.12, max: 10, life: 3, echo: 1, slow: 0.1, dust: 0 },
    },
    { text: "Age hurts more.", values: { stacks: 1, damage: 0.18, max: 10, life: 3, echo: 1, slow: 0.1, dust: 0 } },
    { text: "Age hurts far more.", values: { stacks: 1, damage: 0.25, max: 10, life: 3, echo: 1, slow: 0.1, dust: 0 } },
    { text: "Age lasts 5 s.", values: { stacks: 1, damage: 0.25, max: 10, life: 5, echo: 1, slow: 0.1, dust: 0 } },
    { text: "Age hurts most.", values: { stacks: 1, damage: 0.4, max: 10, life: 5, echo: 1, slow: 0.1, dust: 0 } },
  ],
  evolution: {
    partner: "m_echo",
    name: "Dust to Dust",
    text: "A foe at max stacks crumbles, consuming them for 1.5x each.",
    row: {
      text: "Foes at max Age crumble.",
      values: { stacks: 1, damage: 0.4, max: 10, life: 5, echo: 1, slow: 0.1, dust: 1.5 },
    },
  },
};

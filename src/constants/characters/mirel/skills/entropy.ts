import type { SkillDef } from "../../../../types/skill";

/** Entropy. Design: docs/skills/mirel.md. Values: damage: ability power of decay a second; life: seconds; max: decay stacks a foe can hold, a snap on a decaying foe adding one; taken: share more decaying foes take from every source; spread: 1 decay spreads on a kill; stop: seconds every foe within 50 px stops when a decaying foe dies (evolution) */
export const ENTROPY: SkillDef = {
  id: "m_entropy",
  name: "Entropy",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "A foe restarting from a stop or a field snap decays.",
  levels: [
    {
      text: "A restarting foe decays for 3 s.",
      values: { damage: 0.25, life: 3, max: 1, taken: 0, spread: 0, stop: 0 },
    },
    { text: "Decay lasts 5 s.", values: { damage: 0.25, life: 5, max: 1, taken: 0, spread: 0, stop: 0 } },
    {
      text: "Decaying foes take 15% more.",
      values: { damage: 0.25, life: 5, max: 1, taken: 0.15, spread: 0, stop: 0 },
    },
    { text: "Decay hurts more.", values: { damage: 0.35, life: 5, max: 1, taken: 0.15, spread: 0, stop: 0 } },
    { text: "Decay spreads on a kill.", values: { damage: 0.35, life: 5, max: 1, taken: 0.15, spread: 1, stop: 0 } },
    { text: "Decay hurts far more.", values: { damage: 0.5, life: 5, max: 1, taken: 0.15, spread: 1, stop: 0 } },
    {
      text: "A snap on a decaying foe adds a stack.",
      values: { damage: 0.5, life: 5, max: 2, taken: 0.15, spread: 1, stop: 0 },
    },
    { text: "Decay hurts most.", values: { damage: 0.8, life: 5, max: 2, taken: 0.15, spread: 1, stop: 0 } },
  ],
  evolution: {
    partner: "m_foretell",
    name: "Heat Death",
    text: "A decaying foe that dies stops every foe within 50 px for 1 s.",
    row: {
      text: "A decaying death stops foes near it.",
      values: { damage: 0.8, life: 5, max: 2, taken: 0.15, spread: 1, stop: 1 },
    },
  },
};

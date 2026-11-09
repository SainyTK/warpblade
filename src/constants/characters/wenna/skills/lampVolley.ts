import type { SkillDef } from "../../../../types/skill";

/** Lamp Volley. Design: docs/skills/wenna.md. Values: mp: MP a cast costs; cooldown: seconds; power: ability power of each bolt; bolts: bolts each Wick spits; pierce: foes a bolt passes through; ignite: 1 bolts ignite; starfire: 1 bolts curve to foes and burst for 24 px (evolution) */
export const LAMP_VOLLEY: SkillDef = {
  id: "w_lampVolley",
  name: "Lamp Volley",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Every Wick spits a flame bolt at the Quarry or its nearest foe.",
  levels: [
    {
      text: "Every Wick spits a bolt for 1.0x.",
      values: { mp: 18, cooldown: 6, power: 1, bolts: 1, pierce: 0, ignite: 0, starfire: 0 },
    },
    {
      text: "Two bolts from each Wick.",
      values: { mp: 18, cooldown: 6, power: 1, bolts: 2, pierce: 0, ignite: 0, starfire: 0 },
    },
    {
      text: "Bolts deal 1.2x.",
      values: { mp: 18, cooldown: 6, power: 1.2, bolts: 2, pierce: 0, ignite: 0, starfire: 0 },
    },
    {
      text: "Bolts pass through a foe.",
      values: { mp: 18, cooldown: 6, power: 1.2, bolts: 2, pierce: 1, ignite: 0, starfire: 0 },
    },
    { text: "Bolts ignite.", values: { mp: 18, cooldown: 6, power: 1.2, bolts: 2, pierce: 1, ignite: 1, starfire: 0 } },
    { text: "Recharge 4 s.", values: { mp: 18, cooldown: 4, power: 1.2, bolts: 2, pierce: 1, ignite: 1, starfire: 0 } },
    {
      text: "Bolts deal 1.4x.",
      values: { mp: 18, cooldown: 4, power: 1.4, bolts: 2, pierce: 1, ignite: 1, starfire: 0 },
    },
    {
      text: "Bolts deal 1.8x.",
      values: { mp: 18, cooldown: 4, power: 1.8, bolts: 2, pierce: 1, ignite: 1, starfire: 0 },
    },
  ],
  evolution: {
    partner: "w_flare",
    name: "Starfire",
    text: "Bolts curve to foes and burst for 24 px.",
    row: {
      text: "Bolts curve and burst for 24 px.",
      values: { mp: 18, cooldown: 4, power: 1.8, bolts: 2, pierce: 1, ignite: 1, starfire: 1 },
    },
  },
};

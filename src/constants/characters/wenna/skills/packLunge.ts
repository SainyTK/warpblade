import type { SkillDef } from "../../../../types/skill";

/** Pack Lunge. Design: docs/skills/wenna.md. Values: power: ability power of each lunge, on the Quarry only; need: Wicks within 40 px of the Quarry a blow needs to send them lunging; stun: seconds a lunge stuns; crit: 1 lunges always crit; heal: share of its HP a lunging Wick heals; frenzy: 1 each lunge strikes three times and a kill by a lunge relights every Wick (evolution) */
export const PACK_LUNGE: SkillDef = {
  id: "w_packLunge",
  name: "Pack Lunge",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "A blow on a Quarry ringed by Wicks sends them all lunging at it.",
  levels: [
    {
      text: "A blow with 3 Wicks by the Quarry: lunges for 1.2x.",
      values: { power: 1.2, need: 3, stun: 0, crit: 0, heal: 0, frenzy: 0 },
    },
    { text: "Lunges stun for 0.4 s.", values: { power: 1.2, need: 3, stun: 0.4, crit: 0, heal: 0, frenzy: 0 } },
    { text: "Lunges deal 1.5x.", values: { power: 1.5, need: 3, stun: 0.4, crit: 0, heal: 0, frenzy: 0 } },
    { text: "Lunges always crit.", values: { power: 1.5, need: 3, stun: 0.4, crit: 1, heal: 0, frenzy: 0 } },
    {
      text: "Two Wicks by the Quarry are enough.",
      values: { power: 1.5, need: 2, stun: 0.4, crit: 1, heal: 0, frenzy: 0 },
    },
    { text: "Lunging Wicks heal 20%.", values: { power: 1.5, need: 2, stun: 0.4, crit: 1, heal: 0.2, frenzy: 0 } },
    { text: "Lunges deal 1.9x.", values: { power: 1.9, need: 2, stun: 0.4, crit: 1, heal: 0.2, frenzy: 0 } },
    { text: "Lunges deal 2.4x.", values: { power: 2.4, need: 2, stun: 0.4, crit: 1, heal: 0.2, frenzy: 0 } },
  ],
  evolution: {
    partner: "w_quarry",
    name: "Feeding Frenzy",
    text: "Each lunge strikes three times, and a kill by a lunge relights every Wick.",
    row: {
      text: "Lunges strike thrice; a kill relights all.",
      values: { power: 2.4, need: 2, stun: 0.4, crit: 1, heal: 0.2, frenzy: 1 },
    },
  },
};

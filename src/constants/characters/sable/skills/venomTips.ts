import type { SkillDef } from "../../../../types/skill";

/** Venom Tips: Bolts poison; the stacks pile up on one foe. Values: rate: attack damage a second per stack; max: stacks a foe carries; time: seconds the stacks last; closing: stacks a closing bolt lays; creep: poison creeps to a touching foe each second; slow: poisoned foes are slowed; crit: stacks a crit lays; passOn: share of the stacks a falling foe passes on; cloud: pixels of the cloud a poisoned foe bursts into. Design: docs/skills/sable.md */
export const VENOM_TIPS: SkillDef = {
  id: "s_venom",
  name: "Venom Tips",
  kind: "dot",
  risk: "easy",
  button: "J",
  text: "Bolts poison; the stacks pile up on one foe.",
  levels: [
    { text: "Bolts poison foes.", values: { rate: 0.08, max: 4, time: 3, closing: 1, creep: 0, slow: 0, crit: 1, passOn: 0, cloud: 0 } },
    { text: "The closing bolt lays two stacks.", values: { rate: 0.08, max: 6, time: 3, closing: 2, creep: 0, slow: 0, crit: 1, passOn: 0, cloud: 0 } },
    { text: "Poison creeps to foes nearby.", values: { rate: 0.08, max: 6, time: 3, closing: 2, creep: 1, slow: 0, crit: 1, passOn: 0, cloud: 0 } },
    { text: "Poison bites harder.", values: { rate: 0.12, max: 6, time: 3, closing: 2, creep: 1, slow: 0, crit: 1, passOn: 0, cloud: 0 } },
    { text: "Poisoned foes are slowed.", values: { rate: 0.12, max: 6, time: 3, closing: 2, creep: 1, slow: 1, crit: 1, passOn: 0, cloud: 0 } },
    { text: "A crit lays three stacks, and poison stacks higher.", values: { rate: 0.12, max: 12, time: 4, closing: 2, creep: 1, slow: 1, crit: 3, passOn: 0, cloud: 0 } },
    { text: "Poison bites much harder.", values: { rate: 0.3, max: 12, time: 4, closing: 2, creep: 1, slow: 1, crit: 3, passOn: 0, cloud: 0 } },
    { text: "Poison runs deep and passes on when a foe falls.", values: { rate: 0.5, max: 15, time: 6, closing: 2, creep: 1, slow: 1, crit: 3, passOn: 0.5, cloud: 0 } },
  ],
  evolution: {
    partner: "s_ricochet",
    name: "Blight",
    text: "Stacks pile up to thirty, and a poisoned foe that falls bursts in a cloud that gives every foe in it all its stacks.",
    row: { text: "Poisoned foes burst in a cloud.", values: { rate: 0.5, max: 30, time: 6, closing: 2, creep: 1, slow: 1, crit: 3, passOn: 1, cloud: 30 } },
  },
};

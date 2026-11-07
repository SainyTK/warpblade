import type { SkillDef } from "../../../../types/skill";

/** Sky Lash. Design: docs/skills/orrin.md. Values: arcs: Hanging Arcs per airtime; power: share more they deal; fast: share more above 160 px/s; spike: 1 air arcs spike minions so they bounce; splash: attack damage a spiked foe deals to foes it lands on; crescent: attack damage of the brass crescent thrown 60 px on; pierce: 1 crescents pierce (evolution); second: 1 at 100 Momentum a second crescent follows (evolution) */
export const SKY_LASH: SkillDef = {
  id: "o_skylash",
  name: "Sky Lash",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "More Hanging Arcs in the air, stronger when you fly fast.",
  levels: [
    {
      text: "Two Hanging Arcs per airtime.",
      values: { arcs: 2, power: 0, fast: 0, spike: 0, splash: 0, crescent: 0, pierce: 0, second: 0 },
    },
    {
      text: "Hanging Arcs deal 20% more.",
      values: { arcs: 2, power: 0.2, fast: 0, spike: 0, splash: 0, crescent: 0, pierce: 0, second: 0 },
    },
    {
      text: "+50% above 160 px/s.",
      values: { arcs: 2, power: 0.2, fast: 0.5, spike: 0, splash: 0, crescent: 0, pierce: 0, second: 0 },
    },
    {
      text: "Air arcs spike minions into the floor.",
      values: { arcs: 2, power: 0.2, fast: 0.5, spike: 1, splash: 0, crescent: 0, pierce: 0, second: 0 },
    },
    {
      text: "Three Hanging Arcs per airtime.",
      values: { arcs: 3, power: 0.2, fast: 0.5, spike: 1, splash: 0, crescent: 0, pierce: 0, second: 0 },
    },
    {
      text: "A spiked foe hits the foes it lands on.",
      values: { arcs: 3, power: 0.2, fast: 0.5, spike: 1, splash: 0.5, crescent: 0, pierce: 0, second: 0 },
    },
    {
      text: "The arc throws a brass crescent on.",
      values: { arcs: 3, power: 0.2, fast: 0.5, spike: 1, splash: 0.5, crescent: 0.6, pierce: 0, second: 0 },
    },
    {
      text: "Arcs +50%, crescents stronger.",
      values: { arcs: 3, power: 0.5, fast: 0.5, spike: 1, splash: 0.5, crescent: 0.9, pierce: 0, second: 0 },
    },
  ],
  evolution: {
    partner: "o_pump",
    name: "Falling Star",
    text: "Every air arc throws a crescent that pierces, and at 100 Momentum a second one follows.",
    row: {
      text: "Crescents pierce; full Momentum adds one.",
      values: { arcs: 3, power: 0.5, fast: 0.5, spike: 1, splash: 0.5, crescent: 0.9, pierce: 1, second: 1 },
    },
  },
};

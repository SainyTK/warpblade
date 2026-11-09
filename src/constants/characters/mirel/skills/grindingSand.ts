import type { SkillDef } from "../../../../types/skill";

/** Grinding Sand. Design: docs/skills/mirel.md. Values: stacks: grind stacks a foe gains each second inside her Stillfield; damage: ability power a stack deals a second; max: most stacks; linger: seconds stacks last after the field closes; taken: share more ground foes take from every source; spread: 1 the grind spreads on a kill; storm: ability power a stack deals when the closing field bursts in 80 px (evolution) */
export const GRINDING_SAND: SkillDef = {
  id: "m_sandstorm",
  name: "Grinding Sand",
  kind: "dot",
  risk: "timed",
  button: "K",
  text: "Foes inside her Stillfield are ground by sand.",
  levels: [
    {
      text: "Foes in your field gain a grind stack a second.",
      values: { stacks: 1, damage: 0.2, max: 5, linger: 0, taken: 0, spread: 0, storm: 0 },
    },
    {
      text: "Stacks last 1 s after the field.",
      values: { stacks: 1, damage: 0.2, max: 5, linger: 1, taken: 0, spread: 0, storm: 0 },
    },
    {
      text: "Ground foes take 10% more.",
      values: { stacks: 1, damage: 0.2, max: 5, linger: 1, taken: 0.1, spread: 0, storm: 0 },
    },
    {
      text: "Sand grinds harder.",
      values: { stacks: 1, damage: 0.3, max: 5, linger: 1, taken: 0.1, spread: 0, storm: 0 },
    },
    {
      text: "Sand grinds far harder.",
      values: { stacks: 1, damage: 0.4, max: 5, linger: 1, taken: 0.1, spread: 0, storm: 0 },
    },
    {
      text: "The grind spreads on a kill.",
      values: { stacks: 1, damage: 0.4, max: 5, linger: 1, taken: 0.1, spread: 1, storm: 0 },
    },
    { text: "Up to 8 stacks.", values: { stacks: 1, damage: 0.4, max: 8, linger: 1, taken: 0.1, spread: 1, storm: 0 } },
    {
      text: "Sand grinds hardest.",
      values: { stacks: 1, damage: 0.6, max: 8, linger: 1, taken: 0.1, spread: 1, storm: 0 },
    },
  ],
  evolution: {
    partner: "m_sundial",
    name: "Sandstorm",
    text: "The closing field bursts in 80 px for 1.0x for each stack.",
    row: {
      text: "The closing field bursts per stack.",
      values: { stacks: 1, damage: 0.6, max: 8, linger: 1, taken: 0.1, spread: 1, storm: 1 },
    },
  },
};

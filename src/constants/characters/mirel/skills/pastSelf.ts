import type { SkillDef } from "../../../../types/skill";

/** Past Self. Design: docs/skills/mirel.md. Values: chance: chance a Stopped Moment leaves a ghost; cooldown: seconds between ghosts; power: share of her blows' power the ghost's blows deal; taunt: seconds the ghost draws foes; replays: times it strikes her whole string; many: 1 every Stopped Moment leaves a ghost and its blows echo (evolution) */
export const PAST_SELF: SkillDef = {
  id: "m_pastself",
  name: "Past Self",
  kind: "summon",
  risk: "precise",
  button: "K",
  text: "A Stopped Moment may leave a ghost of her that strikes her string where she parried.",
  levels: [
    {
      text: "50% on a parry: a ghost strikes at 0.8x.",
      values: { chance: 0.5, cooldown: 1.5, power: 0.8, taunt: 0, replays: 1, many: 0 },
    },
    { text: "70% chance.", values: { chance: 0.7, cooldown: 1.5, power: 0.8, taunt: 0, replays: 1, many: 0 } },
    {
      text: "The ghost draws foes for 1 s.",
      values: { chance: 0.7, cooldown: 1.5, power: 0.8, taunt: 1, replays: 1, many: 0 },
    },
    {
      text: "The ghost deals 1.2x.",
      values: { chance: 0.7, cooldown: 1.5, power: 1.2, taunt: 1, replays: 1, many: 0 },
    },
    {
      text: "The ghost strikes its string twice.",
      values: { chance: 0.7, cooldown: 1.5, power: 1.2, taunt: 1, replays: 2, many: 0 },
    },
    { text: "Every parry.", values: { chance: 1, cooldown: 1.5, power: 1.2, taunt: 1, replays: 2, many: 0 } },
    { text: "The ghost deals 1.6x.", values: { chance: 1, cooldown: 1.5, power: 1.6, taunt: 1, replays: 2, many: 0 } },
    { text: "The ghost deals 2.2x.", values: { chance: 1, cooldown: 1.5, power: 2.2, taunt: 1, replays: 2, many: 0 } },
  ],
  evolution: {
    partner: "m_quicken",
    name: "Many Selves",
    text: "Every Stopped Moment leaves a ghost, and its blows echo.",
    row: {
      text: "Every parry leaves a ghost; its blows echo.",
      values: { chance: 1, cooldown: 1.5, power: 2.2, taunt: 1, replays: 2, many: 1 },
    },
  },
};

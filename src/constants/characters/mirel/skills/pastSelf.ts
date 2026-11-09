import type { SkillDef } from "../../../../types/skill";

/** Past Self. Design: docs/skills/mirel.md. Values: chance: chance a Rewind leaves a ghost; cooldown: seconds between ghosts; power: share of her blows' power the ghost's replays deal; taunt: seconds the ghost draws foes; replays: times it replays her blows of the last 1.2 s; many: 1 every Rewind leaves a ghost and its blows echo (evolution) */
export const PAST_SELF: SkillDef = {
  id: "m_pastself",
  name: "Past Self",
  kind: "summon",
  risk: "timed",
  button: "auto",
  text: "A Rewind may leave a ghost of her that replays her last blows.",
  levels: [
    {
      text: "30% on a Rewind: a ghost replays at 0.8x.",
      values: { chance: 0.3, cooldown: 1.5, power: 0.8, taunt: 0, replays: 1, many: 0 },
    },
    { text: "45% chance.", values: { chance: 0.45, cooldown: 1.5, power: 0.8, taunt: 0, replays: 1, many: 0 } },
    {
      text: "The ghost draws foes for 1 s.",
      values: { chance: 0.45, cooldown: 1.5, power: 0.8, taunt: 1, replays: 1, many: 0 },
    },
    { text: "Replays deal 1.2x.", values: { chance: 0.45, cooldown: 1.5, power: 1.2, taunt: 1, replays: 1, many: 0 } },
    {
      text: "The ghost replays twice.",
      values: { chance: 0.45, cooldown: 1.5, power: 1.2, taunt: 1, replays: 2, many: 0 },
    },
    { text: "60% chance.", values: { chance: 0.6, cooldown: 1.5, power: 1.2, taunt: 1, replays: 2, many: 0 } },
    { text: "Replays deal 1.6x.", values: { chance: 0.6, cooldown: 1.5, power: 1.6, taunt: 1, replays: 2, many: 0 } },
    { text: "Replays deal 2.2x.", values: { chance: 0.6, cooldown: 1.5, power: 2.2, taunt: 1, replays: 2, many: 0 } },
  ],
  evolution: {
    partner: "m_quicken",
    name: "Many Selves",
    text: "Every Rewind leaves a ghost, and its blows echo.",
    row: {
      text: "Every Rewind leaves a ghost; its blows echo.",
      values: { chance: 0.6, cooldown: 1.5, power: 2.2, taunt: 1, replays: 2, many: 1 },
    },
  },
};

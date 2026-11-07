import type { SkillDef } from "../../../../types/skill";

/** Tremor Stomp. Design: docs/skills/hulda.md. Values: mp; cooldown: seconds; power: attack damage of a tremor; near: radius of the first tremor; far: radius of the second (0 none); launch: 1 throws minions up; fliers: 1 shakes fliers down; grit: Grit a stomp gives; wide: 1 runs wall to wall (evolution) */
export const TREMOR_STOMP: SkillDef = {
  id: "h_tremorStomp",
  name: "Tremor Stomp",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Stomp, and a tremor runs along the floor round you.",
  levels: [
    {
      text: "Stomp the floor round you.",
      values: { mp: 15, cooldown: 3, power: 0.6, near: 50, far: 0, launch: 0, fliers: 0, grit: 0, wide: 0 },
    },
    {
      text: "Stomp damage up.",
      values: { mp: 15, cooldown: 3, power: 0.9, near: 50, far: 0, launch: 0, fliers: 0, grit: 0, wide: 0 },
    },
    {
      text: "The stomp throws foes up.",
      values: { mp: 15, cooldown: 3, power: 0.9, near: 50, far: 0, launch: 1, fliers: 0, grit: 0, wide: 0 },
    },
    {
      text: "A second, wider tremor.",
      values: { mp: 15, cooldown: 3, power: 0.9, near: 50, far: 80, launch: 1, fliers: 0, grit: 0, wide: 0 },
    },
    {
      text: "Wider tremors.",
      values: { mp: 15, cooldown: 3, power: 0.9, near: 70, far: 110, launch: 1, fliers: 0, grit: 0, wide: 0 },
    },
    {
      text: "The stomp shakes fliers down.",
      values: { mp: 15, cooldown: 3, power: 0.9, near: 70, far: 110, launch: 1, fliers: 1, grit: 0, wide: 0 },
    },
    {
      text: "The stomp gives Grit.",
      values: { mp: 15, cooldown: 3, power: 0.9, near: 70, far: 110, launch: 1, fliers: 1, grit: 15, wide: 0 },
    },
    {
      text: "Stomp harder, faster recharge.",
      values: { mp: 15, cooldown: 2.5, power: 2, near: 70, far: 110, launch: 1, fliers: 1, grit: 15, wide: 0 },
    },
  ],
  evolution: {
    partner: "h_stampede",
    name: "Earthbreaker",
    text: "Both tremors run wall to wall along the floor you stand on.",
    row: {
      text: "Tremors run wall to wall.",
      values: { mp: 15, cooldown: 2.5, power: 2, near: 70, far: 110, launch: 1, fliers: 1, grit: 15, wide: 1 },
    },
  },
};

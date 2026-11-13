import type { SkillDef } from "../../../../types/skill";

/** Hour of Stillness. Design: docs/skills/mirel.md. Values: stop: seconds the foes inside stop; power: multiple of the charge level's power the toll deals; stored: share of the damage a foe took while stopped added to the toll; cap: the most that adds, in multiples of the level's power; screen: 1 the clock covers the whole screen at every level; echoes: 1 her echoes on stopped foes hit twice as hard; stun: seconds the toll stuns; field: seconds a free Stillfield stands where it tolled; endless: 1 the stored damage has no cap (evolution) */
export const HOUR_OF_STILLNESS: SkillDef = {
  id: "m_hour",
  name: "Hour of Stillness",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Hour of Stillness stops foes longer and tolls harder.",
  levels: [
    {
      text: "Foes stop 1.6 s; the toll deals 1.2x.",
      values: { stop: 1.6, power: 1.2, stored: 0.4, cap: 2, screen: 0, echoes: 0, stun: 0, field: 0, endless: 0 },
    },
    {
      text: "The clock covers the whole screen.",
      values: { stop: 1.6, power: 1.2, stored: 0.4, cap: 2, screen: 1, echoes: 0, stun: 0, field: 0, endless: 0 },
    },
    {
      text: "Echoes on stopped foes hit twice as hard.",
      values: { stop: 1.6, power: 1.2, stored: 0.4, cap: 2, screen: 1, echoes: 1, stun: 0, field: 0, endless: 0 },
    },
    {
      text: "The toll deals 2x.",
      values: { stop: 1.6, power: 2, stored: 0.4, cap: 2, screen: 1, echoes: 1, stun: 0, field: 0, endless: 0 },
    },
    {
      text: "The toll stuns for 1 s.",
      values: { stop: 1.6, power: 2, stored: 0.4, cap: 2, screen: 1, echoes: 1, stun: 1, field: 0, endless: 0 },
    },
    {
      text: "60% of stored damage returns, up to 4x.",
      values: { stop: 1.6, power: 2, stored: 0.6, cap: 4, screen: 1, echoes: 1, stun: 1, field: 0, endless: 0 },
    },
    {
      text: "The toll leaves a Stillfield for 2 s.",
      values: { stop: 1.6, power: 2, stored: 0.6, cap: 4, screen: 1, echoes: 1, stun: 1, field: 2, endless: 0 },
    },
    {
      text: "Foes stop 2.4 s; the toll deals 3.5x.",
      values: { stop: 2.4, power: 3.5, stored: 0.6, cap: 4, screen: 1, echoes: 1, stun: 1, field: 2, endless: 0 },
    },
  ],
  evolution: {
    partner: "m_patience",
    name: "Eternal Noon",
    text: "Foes stop for 3.5 s, the toll deals 6x, and the damage they took while stopped returns in full with no cap.",
    row: {
      text: "Stop 3.5 s; all stored damage returns.",
      values: { stop: 3.5, power: 6, stored: 1, cap: 4, screen: 1, echoes: 1, stun: 1, field: 2, endless: 1 },
    },
  },
};

import type { SkillDef } from "../../../../types/skill";

/** Eternal Noon. Design: docs/skills/mirel.md. Values: stop: seconds every foe on screen stops; returns: share of the damage a foe took while stopped that lands again when it restarts; power: share of the level's power each foe takes at the toll; echoes: 1 her echoes on stopped foes hit twice as hard; stun: seconds the toll stuns; endless: 1 the stored damage has no cap (evolution) */
export const ETERNAL_NOON: SkillDef = {
  id: "m_noon",
  name: "Eternal Noon",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Replaces Hour of Stillness: every foe on screen stops, and the damage it takes while stopped returns.",
  ultimate: "eternalNoon",
  levels: [
    {
      text: "Stop the screen 1.6 s; 40% returns, 0.8x.",
      values: { stop: 1.6, returns: 0.4, power: 0.8, echoes: 0, stun: 0, endless: 0 },
    },
    { text: "Foes stop for 2.0 s.", values: { stop: 2, returns: 0.4, power: 0.8, echoes: 0, stun: 0, endless: 0 } },
    {
      text: "60% of stored damage returns.",
      values: { stop: 2, returns: 0.6, power: 0.8, echoes: 0, stun: 0, endless: 0 },
    },
    { text: "The toll deals 1.6x.", values: { stop: 2, returns: 0.6, power: 1.6, echoes: 0, stun: 0, endless: 0 } },
    {
      text: "Echoes on stopped foes hit twice as hard.",
      values: { stop: 2, returns: 0.6, power: 1.6, echoes: 1, stun: 0, endless: 0 },
    },
    { text: "Foes stop for 2.6 s.", values: { stop: 2.6, returns: 0.6, power: 1.6, echoes: 1, stun: 0, endless: 0 } },
    {
      text: "The toll stuns for 1 s.",
      values: { stop: 2.6, returns: 0.6, power: 1.6, echoes: 1, stun: 1, endless: 0 },
    },
    { text: "The toll deals 4x.", values: { stop: 2.6, returns: 0.6, power: 4, echoes: 1, stun: 1, endless: 0 } },
  ],
  evolution: {
    partner: "m_patience",
    name: "Endless Noon",
    text: "Foes stop for 3.5 s, and the damage they take while stopped returns in full with no cap.",
    row: {
      text: "Stop 3.5 s; all stored damage returns.",
      values: { stop: 3.5, returns: 1, power: 6, echoes: 1, stun: 1, endless: 1 },
    },
  },
};

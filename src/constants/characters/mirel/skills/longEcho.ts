import type { SkillDef } from "../../../../types/skill";

/** Long Echo. Design: docs/skills/mirel.md. Values: power: share more every echo deals; reach: pixels the echo's hit shape grows; second: share of the blow's power a second echo deals 1.0 s after the blow; delay: seconds after the blow the echo lands; stun: seconds Toll's echo stuns; pull: pixels an echo pulls the foes it hits toward the strike point; choir: 1 every blow echoes three times, the last at full power (evolution) */
export const LONG_ECHO: SkillDef = {
  id: "m_echo",
  name: "Long Echo",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Her echoes, her warp's too, hit harder, land sooner and reach further.",
  levels: [
    {
      text: "Echoes deal 30% more.",
      values: { power: 0.3, reach: 0, second: 0, delay: 0.5, stun: 0, pull: 0, choir: 0 },
    },
    {
      text: "The echo's shape grows 6 px.",
      values: { power: 0.3, reach: 6, second: 0, delay: 0.5, stun: 0, pull: 0, choir: 0 },
    },
    {
      text: "A second echo at 1.0 s for 0.3x.",
      values: { power: 0.3, reach: 6, second: 0.3, delay: 0.5, stun: 0, pull: 0, choir: 0 },
    },
    {
      text: "Echoes deal 60% more.",
      values: { power: 0.6, reach: 6, second: 0.3, delay: 0.5, stun: 0, pull: 0, choir: 0 },
    },
    {
      text: "Echoes land 0.35 s after the blow.",
      values: { power: 0.6, reach: 6, second: 0.3, delay: 0.35, stun: 0, pull: 0, choir: 0 },
    },
    {
      text: "Toll's echo stuns for 0.3 s.",
      values: { power: 0.6, reach: 6, second: 0.3, delay: 0.35, stun: 0.3, pull: 0, choir: 0 },
    },
    {
      text: "Echoes pull foes 8 px to the strike point.",
      values: { power: 0.6, reach: 6, second: 0.3, delay: 0.35, stun: 0.3, pull: 8, choir: 0 },
    },
    {
      text: "Echoes deal 120% more.",
      values: { power: 1.2, reach: 6, second: 0.3, delay: 0.35, stun: 0.3, pull: 8, choir: 0 },
    },
  ],
  evolution: {
    partner: "m_patience",
    name: "Choir of Hours",
    text: "Every blow echoes three times, and the last echo hits at full power.",
    row: {
      text: "Three echoes; the last at full power.",
      values: { power: 1.2, reach: 6, second: 0.3, delay: 0.35, stun: 0.3, pull: 8, choir: 1 },
    },
  },
};

import type { SkillDef } from "../../../../types/skill";

/** Foretell. Design: docs/skills/mirel.md. Values: mp: MP a cast costs; cooldown: seconds; count: foes marked; delay: seconds before the blades fall; power: ability power of a blade; stun: seconds a blade stuns; ring: radius of a blade's ring; splash: ability power the ring deals to other foes; prophecy: 1 every foe on screen is marked and blades land twice on still foes (evolution) */
export const FORETELL: SkillDef = {
  id: "m_foretell",
  name: "Foretell",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Mark the nearest foes; a blade falls on each where it stands a moment later.",
  levels: [
    {
      text: "Mark 3 foes; blades fall 1.2 s later for 2.0x.",
      values: { mp: 18, cooldown: 6, count: 3, delay: 1.2, power: 2, stun: 0, ring: 0, splash: 0, prophecy: 0 },
    },
    {
      text: "Mark 5 foes.",
      values: { mp: 18, cooldown: 6, count: 5, delay: 1.2, power: 2, stun: 0, ring: 0, splash: 0, prophecy: 0 },
    },
    {
      text: "Blades stun for 0.5 s.",
      values: { mp: 18, cooldown: 6, count: 5, delay: 1.2, power: 2, stun: 0.5, ring: 0, splash: 0, prophecy: 0 },
    },
    {
      text: "Blades fall after 0.8 s.",
      values: { mp: 18, cooldown: 6, count: 5, delay: 0.8, power: 2, stun: 0.5, ring: 0, splash: 0, prophecy: 0 },
    },
    {
      text: "Blades deal 3.0x.",
      values: { mp: 18, cooldown: 6, count: 5, delay: 0.8, power: 3, stun: 0.5, ring: 0, splash: 0, prophecy: 0 },
    },
    {
      text: "A 20 px ring hits other foes for 1.0x.",
      values: { mp: 18, cooldown: 6, count: 5, delay: 0.8, power: 3, stun: 0.5, ring: 20, splash: 1, prophecy: 0 },
    },
    {
      text: "Blades deal 4.2x.",
      values: { mp: 18, cooldown: 6, count: 5, delay: 0.8, power: 4.2, stun: 0.5, ring: 20, splash: 1, prophecy: 0 },
    },
    {
      text: "Blades deal 6.0x, the ring 1.5x.",
      values: { mp: 18, cooldown: 6, count: 5, delay: 0.8, power: 6, stun: 0.5, ring: 20, splash: 1.5, prophecy: 0 },
    },
  ],
  evolution: {
    partner: "m_stillpoint",
    name: "Prophecy",
    text: "Every foe on screen is marked, and blades land twice on still foes.",
    row: {
      text: "Mark the screen; still foes take two blades.",
      values: { mp: 18, cooldown: 6, count: 5, delay: 0.8, power: 6, stun: 0.5, ring: 20, splash: 1.5, prophecy: 1 },
    },
  },
};

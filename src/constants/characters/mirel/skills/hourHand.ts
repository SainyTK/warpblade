import type { SkillDef } from "../../../../types/skill";

/** Hour Hand. Design: docs/skills/mirel.md. Values: mp: MP a cast costs; cooldown: seconds; power: ability power of the sweep; radius: the hand's length; back: ability power of the sweep back; stun: seconds the sweep stuns; full: 1 the hand sweeps a full circle; clockwork: 1 two hands sweep full circles for 1.2 s (evolution) */
export const HOUR_HAND: SkillDef = {
  id: "m_handsweep",
  name: "Hour Hand",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "A giant clock hand sweeps a half circle ahead, knocking foes along.",
  levels: [
    {
      text: "A hand sweeps a 70 px half circle for 2.4x.",
      values: { mp: 26, cooldown: 8, power: 2.4, radius: 70, back: 0, stun: 0, full: 0, clockwork: 0 },
    },
    {
      text: "The hand is 84 px long.",
      values: { mp: 26, cooldown: 8, power: 2.4, radius: 84, back: 0, stun: 0, full: 0, clockwork: 0 },
    },
    {
      text: "It sweeps back for 1.2x.",
      values: { mp: 26, cooldown: 8, power: 2.4, radius: 84, back: 1.2, stun: 0, full: 0, clockwork: 0 },
    },
    {
      text: "The sweep stuns for 0.4 s.",
      values: { mp: 26, cooldown: 8, power: 2.4, radius: 84, back: 1.2, stun: 0.4, full: 0, clockwork: 0 },
    },
    {
      text: "The sweep deals 3.5x.",
      values: { mp: 26, cooldown: 8, power: 3.5, radius: 84, back: 1.2, stun: 0.4, full: 0, clockwork: 0 },
    },
    {
      text: "The hand sweeps a full circle.",
      values: { mp: 26, cooldown: 8, power: 3.5, radius: 84, back: 1.2, stun: 0.4, full: 1, clockwork: 0 },
    },
    {
      text: "4.5x; the sweep back 2.0x.",
      values: { mp: 26, cooldown: 8, power: 4.5, radius: 84, back: 2, stun: 0.4, full: 1, clockwork: 0 },
    },
    {
      text: "6.0x; the sweep back 3.0x.",
      values: { mp: 26, cooldown: 8, power: 6, radius: 84, back: 3, stun: 0.4, full: 1, clockwork: 0 },
    },
  ],
  evolution: {
    partner: "m_toll",
    name: "Clockwork",
    text: "Two hands sweep full circles for 1.2 s.",
    row: {
      text: "Two hands sweep for 1.2 s.",
      values: { mp: 26, cooldown: 8, power: 6, radius: 84, back: 3, stun: 0.4, full: 1, clockwork: 1 },
    },
  },
};

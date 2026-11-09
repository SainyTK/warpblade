import type { SkillDef } from "../../../../types/skill";

/** Sundial. Design: docs/skills/mirel.md. Values: mp: MP a cast costs; cooldown: seconds; power: ability power every 0.5 s to foes on the dial; width: the dial's width in pixels; life: seconds it stands; slow: share foes on it are slowed; gnomon: ability power of the gnomon's shadow, sweeping once a second; count: dials at once; court: 1 the dial follows her and covers 140 px (evolution) */
export const SUNDIAL: SkillDef = {
  id: "m_sundial",
  name: "Sundial",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Lay a dial on the floor that slows and wears down foes on it.",
  levels: [
    {
      text: "A 70 px dial for 5 s: slow 30%, 0.4x.",
      values: { mp: 20, cooldown: 6, power: 0.4, width: 70, life: 5, slow: 0.3, gnomon: 0, count: 1, court: 0 },
    },
    {
      text: "The dial is 90 px wide.",
      values: { mp: 20, cooldown: 6, power: 0.4, width: 90, life: 5, slow: 0.3, gnomon: 0, count: 1, court: 0 },
    },
    {
      text: "The gnomon's shadow sweeps for 1.2x.",
      values: { mp: 20, cooldown: 6, power: 0.4, width: 90, life: 5, slow: 0.3, gnomon: 1.2, count: 1, court: 0 },
    },
    {
      text: "Foes on it are slowed 45%.",
      values: { mp: 20, cooldown: 6, power: 0.4, width: 90, life: 5, slow: 0.45, gnomon: 1.2, count: 1, court: 0 },
    },
    {
      text: "The dial deals 0.7x.",
      values: { mp: 20, cooldown: 6, power: 0.7, width: 90, life: 5, slow: 0.45, gnomon: 1.2, count: 1, court: 0 },
    },
    {
      text: "Dials stand 8 s.",
      values: { mp: 20, cooldown: 6, power: 0.7, width: 90, life: 8, slow: 0.45, gnomon: 1.2, count: 1, court: 0 },
    },
    {
      text: "Two dials at once.",
      values: { mp: 20, cooldown: 6, power: 0.7, width: 90, life: 8, slow: 0.45, gnomon: 1.2, count: 2, court: 0 },
    },
    {
      text: "1.0x a tick; the shadow 2.0x.",
      values: { mp: 20, cooldown: 6, power: 1, width: 90, life: 8, slow: 0.45, gnomon: 2, count: 2, court: 0 },
    },
  ],
  evolution: {
    partner: "m_patience",
    name: "Solar Court",
    text: "The dial follows her and covers 140 px.",
    row: {
      text: "The dial follows you, 140 px wide.",
      values: { mp: 20, cooldown: 6, power: 1, width: 140, life: 8, slow: 0.45, gnomon: 2, count: 2, court: 1 },
    },
  },
};

import type { SkillDef } from "../../../../types/skill";

/** Rust Bite. Design: docs/skills/orrin.md. Values: damage: attack damage of rust a second; life: seconds; taken: share more rusted foes take from every source; spread: 1 rust spreads to one foe it touches; pin: 1 Anchor Pin rusts; slow: 1 rusted foes are slowed; corrode: attack damage a rusted foe bursts for when it dies, rusting every foe within 40 px (evolution) */
export const RUST_BITE: SkillDef = {
  id: "o_rust",
  name: "Rust Bite",
  kind: "dot",
  risk: "timed",
  button: "J",
  text: "A foe your warp kick or Chain Bind catches rusts and keeps hurting.",
  levels: [
    {
      text: "A foe your warp kick or Chain Bind catches rusts.",
      values: { damage: 0.2, life: 4, taken: 0, spread: 0, pin: 0, slow: 0, corrode: 0 },
    },
    {
      text: "Rusted foes take 15% more.",
      values: { damage: 0.2, life: 4, taken: 0.15, spread: 0, pin: 0, slow: 0, corrode: 0 },
    },
    {
      text: "Rust spreads to a foe it touches.",
      values: { damage: 0.2, life: 4, taken: 0.15, spread: 1, pin: 0, slow: 0, corrode: 0 },
    },
    {
      text: "Anchor Pin rusts.",
      values: { damage: 0.2, life: 4, taken: 0.15, spread: 1, pin: 1, slow: 0, corrode: 0 },
    },
    {
      text: "Rust bites harder.",
      values: { damage: 0.3, life: 4, taken: 0.15, spread: 1, pin: 1, slow: 0, corrode: 0 },
    },
    {
      text: "Rust bites far harder.",
      values: { damage: 0.45, life: 4, taken: 0.15, spread: 1, pin: 1, slow: 0, corrode: 0 },
    },
    {
      text: "Rusted foes are slowed.",
      values: { damage: 0.45, life: 4, taken: 0.15, spread: 1, pin: 1, slow: 1, corrode: 0 },
    },
    {
      text: "Rust bites hardest, 6 s.",
      values: { damage: 0.6, life: 6, taken: 0.15, spread: 1, pin: 1, slow: 1, corrode: 0 },
    },
  ],
  evolution: {
    partner: "o_gaff",
    name: "Corrode",
    text: "A rusted foe that dies bursts for 3x and rusts every foe within 40 px.",
    row: {
      text: "Rusted foes burst when they die.",
      values: { damage: 0.6, life: 6, taken: 0.15, spread: 1, pin: 1, slow: 1, corrode: 3 },
    },
  },
};

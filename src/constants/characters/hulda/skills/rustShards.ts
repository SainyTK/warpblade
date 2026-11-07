import type { SkillDef } from "../../../../types/skill";

/** Rust Shards. Design: docs/skills/hulda.md. Values: radius: pixels the shards fly; damage: attack damage a stack deals each second; duration: seconds; max: most stacks; any: 1 every armoured blow sprays, not only a broken plate; weaken: share less damage rusted foes deal; onBlow: 1 your J blows add a stack to a rusted foe; reckoning: attack damage per stack a counter or a break consumes (evolution) */
export const RUST_SHARDS: SkillDef = {
  id: "h_rustShards",
  name: "Rust Shards",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Blows on your armour spray rust that eats the attacker.",
  levels: [
    {
      text: "Broken plates spray rust.",
      values: { radius: 30, damage: 0.1, duration: 4, max: 1, any: 0, weaken: 0, onBlow: 0, reckoning: 0 },
    },
    {
      text: "Every armoured blow sprays rust.",
      values: { radius: 30, damage: 0.1, duration: 4, max: 1, any: 1, weaken: 0, onBlow: 0, reckoning: 0 },
    },
    {
      text: "Rust stacks.",
      values: { radius: 30, damage: 0.1, duration: 4, max: 3, any: 1, weaken: 0, onBlow: 0, reckoning: 0 },
    },
    {
      text: "Rust hurts more.",
      values: { radius: 30, damage: 0.2, duration: 4, max: 3, any: 1, weaken: 0, onBlow: 0, reckoning: 0 },
    },
    {
      text: "Rusted foes hit softer.",
      values: { radius: 30, damage: 0.2, duration: 4, max: 3, any: 1, weaken: 0.15, onBlow: 0, reckoning: 0 },
    },
    {
      text: "Blows spread rust.",
      values: { radius: 30, damage: 0.2, duration: 4, max: 3, any: 1, weaken: 0.15, onBlow: 1, reckoning: 0 },
    },
    {
      text: "More rust, wider spray.",
      values: { radius: 50, damage: 0.2, duration: 6, max: 5, any: 1, weaken: 0.15, onBlow: 1, reckoning: 0 },
    },
    {
      text: "Rust far stronger.",
      values: { radius: 50, damage: 0.3, duration: 6, max: 5, any: 1, weaken: 0.15, onBlow: 1, reckoning: 0 },
    },
  ],
  evolution: {
    partner: "h_ironHide",
    name: "Rust Reckoning",
    text: "Every counter and every broken plate consumes the rust on foes near for heavy damage, then sprays fresh shards.",
    row: {
      text: "Counters and breaks consume rust.",
      values: { radius: 50, damage: 0.3, duration: 6, max: 5, any: 1, weaken: 0.15, onBlow: 1, reckoning: 4 },
    },
  },
};

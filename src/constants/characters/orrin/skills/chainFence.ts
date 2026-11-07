import type { SkillDef } from "../../../../types/skill";

/** Chain Fence. Design: docs/skills/orrin.md. Values: mp: MP a cast costs; cooldown: seconds; power: ability power a crossing deals; length: pixels between the posts; stumble: seconds a crossing foe stumbles; count: fences up at once; slow: 1 crossing foes are slowed; spark: ability power the chain's sparks deal every 0.5 s; life: seconds a fence stands; razor: bleed stacks a crossing adds, and the fence follows you (evolution) */
export const CHAIN_FENCE: SkillDef = {
  id: "o_chainfence",
  name: "Chain Fence",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Set two posts with a chain between them that trips foes crossing it.",
  levels: [
    { text: "A fence 60 px long: 1.2x a crossing.", values: { mp: 18, cooldown: 6, power: 1.2, length: 60, stumble: 0.4, count: 1, slow: 0, spark: 0, life: 5, razor: 0 } },
    { text: "The fence is 80 px long.", values: { mp: 18, cooldown: 6, power: 1.2, length: 80, stumble: 0.4, count: 1, slow: 0, spark: 0, life: 5, razor: 0 } },
    { text: "Two fences at once.", values: { mp: 18, cooldown: 6, power: 1.2, length: 80, stumble: 0.4, count: 2, slow: 0, spark: 0, life: 5, razor: 0 } },
    { text: "Crossing foes are slowed.", values: { mp: 18, cooldown: 6, power: 1.2, length: 80, stumble: 0.4, count: 2, slow: 1, spark: 0, life: 5, razor: 0 } },
    { text: "A crossing deals 1.8x.", values: { mp: 18, cooldown: 6, power: 1.8, length: 80, stumble: 0.4, count: 2, slow: 1, spark: 0, life: 5, razor: 0 } },
    { text: "The chain sparks at foes near it.", values: { mp: 18, cooldown: 6, power: 1.8, length: 80, stumble: 0.4, count: 2, slow: 1, spark: 0.3, life: 5, razor: 0 } },
    { text: "Fences stand 8 s.", values: { mp: 18, cooldown: 6, power: 1.8, length: 80, stumble: 0.4, count: 2, slow: 1, spark: 0.3, life: 8, razor: 0 } },
    { text: "2.6x a crossing; stronger sparks.", values: { mp: 18, cooldown: 6, power: 2.6, length: 80, stumble: 0.4, count: 2, slow: 1, spark: 0.5, life: 8, razor: 0 } },
  ],
  evolution: {
    partner: "o_barbs",
    name: "Razor Fence",
    text: "The chain is barbed: every crossing adds 3 bleed stacks, and the fence follows you.",
    row: { text: "Barbed: crossings bleed; it follows you.", values: { mp: 18, cooldown: 6, power: 2.6, length: 80, stumble: 0.4, count: 2, slow: 1, spark: 0.5, life: 8, razor: 3 } },
  },
};

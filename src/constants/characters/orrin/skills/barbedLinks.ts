import type { SkillDef } from "../../../../types/skill";

/** Barbed Links. Design: docs/skills/orrin.md. Values: stacks: bleed stacks a chain hit adds; tipStacks: stacks a tip hit adds; max: most stacks; damage: attack damage a stack deals a second; life: seconds; kick: 1 swing kicks add stacks; bonus: share more bleeding foes take from the chain; flay: attack damage each stack deals when a Full Circle tip consumes them (evolution) */
export const BARBED_LINKS: SkillDef = {
  id: "o_barbs",
  name: "Barbed Links",
  kind: "dot",
  risk: "easy",
  button: "J",
  text: "Chain hits leave bleeding cuts.",
  levels: [
    { text: "Chain hits add a bleed stack.", values: { stacks: 1, tipStacks: 1, max: 6, damage: 0.12, life: 3, kick: 0, bonus: 0, flay: 0 } },
    { text: "Tip hits add 2 stacks.", values: { stacks: 1, tipStacks: 2, max: 6, damage: 0.12, life: 3, kick: 0, bonus: 0, flay: 0 } },
    { text: "Up to 10 stacks.", values: { stacks: 1, tipStacks: 2, max: 10, damage: 0.12, life: 3, kick: 0, bonus: 0, flay: 0 } },
    { text: "Swing kicks add stacks.", values: { stacks: 1, tipStacks: 2, max: 10, damage: 0.12, life: 3, kick: 1, bonus: 0, flay: 0 } },
    { text: "Bleeds hurt more.", values: { stacks: 1, tipStacks: 2, max: 10, damage: 0.18, life: 3, kick: 1, bonus: 0, flay: 0 } },
    { text: "Bleeding foes take 10% more from the chain.", values: { stacks: 1, tipStacks: 2, max: 10, damage: 0.18, life: 3, kick: 1, bonus: 0.1, flay: 0 } },
    { text: "Bleeds hurt more.", values: { stacks: 1, tipStacks: 2, max: 10, damage: 0.24, life: 3, kick: 1, bonus: 0.1, flay: 0 } },
    { text: "Bleeds hurt far more.", values: { stacks: 1, tipStacks: 2, max: 10, damage: 0.3, life: 3, kick: 1, bonus: 0.1, flay: 0 } },
  ],
  evolution: {
    partner: "o_chainfence",
    name: "Flay",
    text: "A Full Circle tip consumes the stacks for 1.2x each.",
    row: { text: "Full Circle tips flay every stack.", values: { stacks: 1, tipStacks: 2, max: 10, damage: 0.3, life: 3, kick: 1, bonus: 0.1, flay: 1.2 } },
  },
};

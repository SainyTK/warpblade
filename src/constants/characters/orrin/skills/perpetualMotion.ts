import type { SkillDef } from "../../../../types/skill";

/** Perpetual Motion. Design: docs/skills/orrin.md. Values: drain: Momentum drains at this share of its usual rate; bonus: Momentum's bonus at full; walk: Momentum a second while walking on the floor; start: Momentum never falls below this; hurt: Momentum a blow costs; endless: 1 Momentum never drains while a Brass Kite is out (evolution) */
export const PERPETUAL_MOTION: SkillDef = {
  id: "o_perpetual",
  name: "Perpetual Motion",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "Momentum lasts longer and does more.",
  levels: [
    {
      text: "Momentum drains half as fast.",
      values: { drain: 0.5, bonus: 0.4, walk: 0, start: 0, hurt: 30, endless: 0 },
    },
    {
      text: "Momentum's bonus reaches +50%.",
      values: { drain: 0.5, bonus: 0.5, walk: 0, start: 0, hurt: 30, endless: 0 },
    },
    {
      text: "Walking gives 5 Momentum a second.",
      values: { drain: 0.5, bonus: 0.5, walk: 5, start: 0, hurt: 30, endless: 0 },
    },
    {
      text: "Momentum never falls below 30.",
      values: { drain: 0.5, bonus: 0.5, walk: 5, start: 30, hurt: 30, endless: 0 },
    },
    {
      text: "A blow costs only 15 Momentum.",
      values: { drain: 0.5, bonus: 0.5, walk: 5, start: 30, hurt: 15, endless: 0 },
    },
    {
      text: "Momentum drains a third as fast.",
      values: { drain: 0.35, bonus: 0.5, walk: 5, start: 30, hurt: 15, endless: 0 },
    },
    {
      text: "Momentum's bonus reaches +60%.",
      values: { drain: 0.35, bonus: 0.6, walk: 5, start: 30, hurt: 15, endless: 0 },
    },
    {
      text: "Momentum drains a quarter as fast.",
      values: { drain: 0.25, bonus: 0.6, walk: 5, start: 30, hurt: 15, endless: 0 },
    },
  ],
  evolution: {
    partner: "o_kite",
    name: "Endless Motion",
    text: "Momentum never drains while a Brass Kite is out.",
    row: {
      text: "No drain while a kite is out.",
      values: { drain: 0.25, bonus: 0.6, walk: 5, start: 30, hurt: 15, endless: 1 },
    },
  },
};

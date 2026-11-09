import type { SkillDef } from "../../../../types/skill";

/** Procession. Design: docs/skills/wenna.md. Values: walk: share faster she walks for each Wick lit; beside: 1 Wicks with no foe to chase walk beside her; wickWalk: share faster Wicks walk; slowBurn: share of their life Wicks lose while she walks (1: all of it); cap: Wicks added to her cap; vigil: 1 Wicks walking beside her leave wax that chills foes (evolution) */
export const PROCESSION: SkillDef = {
  id: "w_procession",
  name: "Procession",
  kind: "movement",
  risk: "easy",
  button: "auto",
  text: "She walks faster with every Wick lit, and her Wicks keep pace.",
  levels: [
    {
      text: "Walk 5% faster for each Wick lit.",
      values: { walk: 0.05, beside: 0, wickWalk: 0, slowBurn: 1, cap: 0, vigil: 0 },
    },
    {
      text: "Idle Wicks walk beside you.",
      values: { walk: 0.05, beside: 1, wickWalk: 0, slowBurn: 1, cap: 0, vigil: 0 },
    },
    {
      text: "Walk 6% faster for each Wick.",
      values: { walk: 0.06, beside: 1, wickWalk: 0, slowBurn: 1, cap: 0, vigil: 0 },
    },
    { text: "Wicks walk 30% faster.", values: { walk: 0.06, beside: 1, wickWalk: 0.3, slowBurn: 1, cap: 0, vigil: 0 } },
    {
      text: "Wicks burn half as fast while you walk.",
      values: { walk: 0.06, beside: 1, wickWalk: 0.3, slowBurn: 0.5, cap: 0, vigil: 0 },
    },
    {
      text: "Walk 7% faster for each Wick.",
      values: { walk: 0.07, beside: 1, wickWalk: 0.3, slowBurn: 0.5, cap: 0, vigil: 0 },
    },
    { text: "One more Wick.", values: { walk: 0.07, beside: 1, wickWalk: 0.3, slowBurn: 0.5, cap: 1, vigil: 0 } },
    {
      text: "Walk 8% faster for each Wick.",
      values: { walk: 0.08, beside: 1, wickWalk: 0.3, slowBurn: 0.5, cap: 1, vigil: 0 },
    },
  ],
  evolution: {
    partner: "w_waxPool",
    name: "Vigil March",
    text: "Wicks walking beside her leave wax that chills foes.",
    row: {
      text: "Wicks beside you leave chilling wax.",
      values: { walk: 0.08, beside: 1, wickWalk: 0.3, slowBurn: 0.5, cap: 1, vigil: 1 },
    },
  },
};

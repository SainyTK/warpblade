import type { SkillDef } from "../../../../types/skill";

/** Deep Tallow. Design: docs/skills/wenna.md. Values: wax: Wax added to her most; trickle: share more Wax trickles in; cap: Wicks added to her cap; hp: share more Wick HP; cost: Wax less a Wick costs; eternal: 1 Wicks never burn out on their own (evolution) */
export const DEEP_TALLOW: SkillDef = {
  id: "w_tallow",
  name: "Deep Tallow",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "More Wax, a faster trickle, and more and sturdier Wicks.",
  levels: [
    {
      text: "Hold 20 more Wax; it trickles 25% faster.",
      values: { wax: 20, trickle: 0.25, cap: 0, hp: 0, cost: 0, eternal: 0 },
    },
    { text: "One more Wick.", values: { wax: 20, trickle: 0.25, cap: 1, hp: 0, cost: 0, eternal: 0 } },
    { text: "Wax trickles 35% faster.", values: { wax: 20, trickle: 0.35, cap: 1, hp: 0, cost: 0, eternal: 0 } },
    { text: "Wicks have 25% more HP.", values: { wax: 20, trickle: 0.35, cap: 1, hp: 0.25, cost: 0, eternal: 0 } },
    { text: "Wicks cost 5 less Wax.", values: { wax: 20, trickle: 0.35, cap: 1, hp: 0.25, cost: 5, eternal: 0 } },
    { text: "Wax trickles 45% faster.", values: { wax: 20, trickle: 0.45, cap: 1, hp: 0.25, cost: 5, eternal: 0 } },
    { text: "Two more Wicks.", values: { wax: 20, trickle: 0.45, cap: 2, hp: 0.25, cost: 5, eternal: 0 } },
    { text: "Wax trickles 60% faster.", values: { wax: 20, trickle: 0.6, cap: 2, hp: 0.25, cost: 5, eternal: 0 } },
  ],
  evolution: {
    partner: "w_twinWick",
    name: "Eternal Flame",
    text: "Wicks never burn out on their own.",
    row: { text: "Wicks never burn out.", values: { wax: 20, trickle: 0.6, cap: 2, hp: 0.25, cost: 5, eternal: 1 } },
  },
};

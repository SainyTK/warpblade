import type { SkillDef } from "../../../../types/skill";

/** Twin Wick. Design: docs/skills/wenna.md. Values: chance: chance a K lights a twin beside the Wick, past the cap; bite: share faster twins bite; life: seconds a twin lives; count: twins it lights; candelabra: 1 every K lights three Wicks (evolution) */
export const TWIN_WICK: SkillDef = {
  id: "w_twinWick",
  name: "Twin Wick",
  kind: "summon",
  risk: "timed",
  button: "K",
  text: "Lighting a Wick may light a twin beside it, past the cap.",
  levels: [
    { text: "20% on K: a twin Wick for 6 s.", values: { chance: 0.2, bite: 0, life: 6, count: 1, candelabra: 0 } },
    { text: "35% chance.", values: { chance: 0.35, bite: 0, life: 6, count: 1, candelabra: 0 } },
    { text: "Twins bite 30% faster.", values: { chance: 0.35, bite: 0.3, life: 6, count: 1, candelabra: 0 } },
    { text: "Twins live 10 s.", values: { chance: 0.35, bite: 0.3, life: 10, count: 1, candelabra: 0 } },
    { text: "45% chance.", values: { chance: 0.45, bite: 0.3, life: 10, count: 1, candelabra: 0 } },
    { text: "Two twins.", values: { chance: 0.45, bite: 0.3, life: 10, count: 2, candelabra: 0 } },
    { text: "50% chance.", values: { chance: 0.5, bite: 0.3, life: 10, count: 2, candelabra: 0 } },
    { text: "55% chance.", values: { chance: 0.55, bite: 0.3, life: 10, count: 2, candelabra: 0 } },
  ],
  evolution: {
    partner: "w_tallow",
    name: "Candelabra",
    text: "Every K lights three Wicks.",
    row: {
      text: "Every K lights three Wicks.",
      values: { chance: 0.55, bite: 0.3, life: 10, count: 2, candelabra: 1 },
    },
  },
};

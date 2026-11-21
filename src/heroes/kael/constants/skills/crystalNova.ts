import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { power: 1.3, pull: 1 } },
  { values: { cooldown: 15, charge: 1.3 } },
  { values: { phantoms: 2, phantom: 0.35 } },
  { values: { power: 1.7 } },
  { values: { stars: 2, star: 0.5 } },
  { values: { edges: 5, edge: 0.15 } },
  { values: { echo: 0.5, echoes: 1, phantoms: 4 } },
  { values: { power: 2, stars: 3, phantom: 0.45 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Charged skills deal +30%.", drill: { tier: 0.3 } },
  { text: "New: charged skills draw foes in.", drill: { pull: 80 } },
  { text: "Charging 15% faster.", drill: { charge: 0.15 } },
  { text: "New: a charged skill strikes again 0.4 s later for 30%.", drill: { echo: 0.3 } },
  { text: "Charged skills +80%; reach +15%.", drill: { tier: 0.8, reach: 0.15 } },
  { text: "Charging 30% faster.", drill: { charge: 0.3 } },
  { text: "Echo 30% to 60%; reach +30%.", drill: { echo: 0.6, reach: 0.3 } },
  { text: "Charged skills +250%.", drill: { tier: 2.5 } },
]);

export const CRYSTAL_NOVA: SkillDef = {
  id: "k_nova",
  name: "Crystal Nova",
  kind: "ultimate",
  risk: "easy",
  button: "J",
  text: "The four charged skills on held J hit harder, reach further and charge faster.",
  levels: LEVELS,
  evolution: {
    partner: "k_keen",
    name: "Supernova",
    text: "Every charged skill bursts two more times.",
    row: evolvedRow(LEVELS[7], "Charged skills burst twice more.", {
      ...drillValues({ burst: 0.5 }),
      echo: 1,
      echoes: 2,
      follow: 4,
    }),
  },
};

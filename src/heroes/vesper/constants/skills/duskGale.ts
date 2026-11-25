import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { power: 1.6, launch: 240, life: 0.5, recharge: 4.5, ticks: 1 } },
  { values: { power: 2.6 } },
  { values: { back: 1 } },
  { values: { power: 3.4, recharge: 3.8 } },
  { values: { ticks: 3 } },
  { values: { both: 1 } },
  { values: { power: 4.6 } },
  { values: { pull: 1 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Dusk Gale deals 0.4 AD more.", drill: { bonus: 0.4 } },
  { text: "New: a second gust flies above the first.", drill: { gusts: 1 } },
  { text: "Gale +0.7 AD.", drill: { bonus: 0.7 } },
  { text: "New: gale blasts are 25% wider.", drill: { area: 0.25 } },
  { text: "Gale +1.2 AD.", drill: { bonus: 1.2 } },
  { text: "New: a gust also flies behind you.", drill: { gusts: 2, behind: 1 } },
  { text: "Gale +1.8 AD; blasts 40% wider.", drill: { bonus: 1.8, area: 0.4 } },
  { text: "Gale +3.2 AD.", drill: { bonus: 3.2 } },
]);

export const DUSK_GALE: SkillDef = {
  id: "ve_gale",
  name: "Dusk Gale",
  kind: "spell",
  element: "storm",
  risk: "timed",
  button: "I",
  text: "Dusk Gale hits harder and blows in more gusts.",
  levels: LEVELS,
  evolution: {
    partner: "ve_sky",
    name: "Twilight Cyclone",
    text: "A gale hit lifts the foe and every foe within 40 px into the air and cuts them.",
    row: evolvedRow(LEVELS[7], "Gale hits lift foes near.", { stand: 2, ...drillValues({ lift: 200 }) }),
  },
};

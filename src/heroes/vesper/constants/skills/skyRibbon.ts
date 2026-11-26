import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { airBonus: 0.2 } },
  { values: { airBonus: 0.3 } },
  { values: { lift: 70 } },
  { values: { airBonus: 0.4 } },
  { values: { waves: 1 } },
  { values: { feather: 0.6 } },
  { values: { airBonus: 0.55, waves: 1.6 } },
  { values: { diveBonus: 0.5 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "One more air cut per jump.", drill: { air: 1 } },
  { text: "New: air cuts deal 0.3 AD more.", drill: { bonus: 0.3 } },
  { text: "Air cuts +0.6 AD.", drill: { bonus: 0.6 } },
  { text: "Air cuts +0.9 AD.", drill: { bonus: 0.9 } },
  { text: "New: a second extra air cut per jump.", drill: { air: 2 } },
  { text: "Air cuts +1.4 AD.", drill: { bonus: 1.4 } },
  { text: "New: an air cut on a foe in the air leaves a 0.8 AD night echo.", drill: { echo: 0.8 } },
  { text: "Three extra air cuts; air cuts +2.4 AD.", drill: { air: 3, bonus: 2.4 } },
]);

export const SKY_RIBBON: SkillDef = {
  id: "ve_sky",
  name: "Sky Ribbon",
  kind: "attack",
  element: "storm",
  risk: "timed",
  button: "J",
  text: "One more air cut per jump, and air cuts hit harder.",
  levels: LEVELS,
  evolution: {
    partner: "ve_ascend",
    name: "Heaven's Ribbon",
    text: "Each air cut also sends a dusk wave diving down ahead for 2 AD.",
    row: evolvedRow(LEVELS[7], "Air cuts send a diving wave.", { ribbon: 0.8, ...drillValues({ ribbon: 2 }) }),
  },
};

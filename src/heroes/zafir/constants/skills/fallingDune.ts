import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { air: 0.25 },
  { air: 0.45 },
  { ringReach: 1.5 },
  { descents: 2 },
  { air: 0.7 },
  { ringLaunch: 220 },
  { ringWounds: 2 },
  { air: 0.9, ringPower: 1.5 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "One more air slash per jump.", drill: { slashes: 1 } },
  { text: "New: landing after an air slash throws a sand ring 30 px each way.", drill: { ring: 0.8 } },
  { text: "Landing ring 0.8 to 1.4.", drill: { ring: 1.4 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "New: the landing ring knocks foes off balance.", drill: { stagger: 0.5 } },
  { text: "Landing ring 1.4 to 3; it reaches 45 px.", drill: { ring: 3, reach: 45 } },
  { text: "New: a third air slash per jump.", drill: { slashes: 2 } },
  { text: "Landing ring 3 to 7.", drill: { ring: 7 } },
]);

export const FALLING_DUNE: SkillDef = {
  id: "za_falling",
  name: "Falling Dune",
  kind: "movement",
  element: "blaze",
  risk: "timed",
  button: "jump",
  text: "More air slashes and air dashes, and landing after an air slash throws a ring of sand both ways.",
  levels: LEVELS,
  evolution: {
    partner: "za_quicksand",
    name: "Meteor Dune",
    text: "The landing ring also throws up a sandspout each way.",
    row: evolvedRow(LEVELS[7], "The landing throws a sandspout each way.", {
      meteor: 1,
      ...drillValues({ spouts: 1 }),
    }),
  },
};

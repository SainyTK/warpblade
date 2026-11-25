import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { perStack: 0.02 } },
  { values: { perStack: 0.03 } },
  { values: { reach: 8 } },
  { values: { perStack: 0.04 } },
  { values: { wave: 1.2 } },
  { values: { echo: 0.5 } },
  { values: { perStack: 0.05, wave: 1.8 } },
  { values: { heavyTop: 1, perStack: 0.06 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The first cut deals 0.3 AD more.", drill: { bonus: 0.3 } },
  { text: "New: the first cut leaves a night echo of 0.3 AD.", drill: { echo: 0.3 } },
  { text: "New: the first cut staggers.", drill: { stagger: 0.3 } },
  { text: "First cut +0.6 AD; echo 0.5 AD.", drill: { bonus: 0.6, echo: 0.5 } },
  { text: "New: every cut reaches 12% farther.", drill: { reach: 0.12 } },
  { text: "First cut +1.1 AD; echo 0.8 AD.", drill: { bonus: 1.1, echo: 0.8 } },
  { text: "New: the echo strikes twice.", drill: { twice: 1 } },
  { text: "First cut +2.2 AD; echo 1.4 AD.", drill: { bonus: 2.2, echo: 1.4 } },
]);

export const RISING_EDGE: SkillDef = {
  id: "ve_edge",
  name: "Rising Edge",
  kind: "attack",
  element: "storm",
  risk: "timed",
  button: "J",
  text: "The dusk cross, your first cut, bites deeper and leaves night echoes.",
  levels: LEVELS,
  evolution: {
    partner: "ve_rhythm",
    name: "Crescendo",
    text: "Every dusk cross also throws a pair of crossing dusk waves ahead for 1.5 AD each.",
    row: evolvedRow(LEVELS[7], "The first cut throws crossing waves.", {
      allEcho: 1,
      perStack: 0.07,
      ...drillValues({ wave: 1.5 }),
    }),
  },
};

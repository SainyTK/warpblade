import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { cut: 0.8 } },
  { values: { cut: 1.2 } },
  { values: { tempo: 1 } },
  { values: { hold: 1 } },
  { values: { cut: 1.8 } },
  { values: { endCut: 1.4 } },
  { values: { refund: 12 } },
  { values: { cut: 2.4, endCut: 2 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "A dash cuts each foe it passes for 0.5 AD.", drill: { cut: 0.5 } },
  { text: "New: the dash cut staggers.", drill: { stagger: 0.35 } },
  { text: "New: a dash through a foe recharges the dash.", drill: { refund: 1 } },
  { text: "Dash cut 1 AD.", drill: { cut: 1 } },
  { text: "New: each foe passed takes a 0.5 AD night echo.", drill: { echo: 0.5 } },
  { text: "Dash cut 1.7 AD; echo 0.8 AD.", drill: { cut: 1.7, echo: 0.8 } },
  { text: "New: one more air dash.", drill: { airDash: 1 } },
  { text: "Dash cut 3.2 AD; echo 1.5 AD.", drill: { cut: 3.2, echo: 1.5 } },
]);

export const SLIPSTREAM: SkillDef = {
  id: "ve_slip",
  name: "Slipstream",
  kind: "movement",
  element: "frost",
  risk: "timed",
  button: "L",
  text: "Dashing through foes cuts them.",
  levels: LEVELS,
  evolution: {
    partner: "ve_rhythm",
    name: "Dusk Current",
    text: "Every dash that passes a foe also throws a pair of crossing dusk waves ahead for 1.5 AD.",
    row: evolvedRow(LEVELS[7], "A dash through foes throws waves.", {
      current: 2,
      currentPower: 0.5,
      ...drillValues({ current: 1.5 }),
    }),
  },
};

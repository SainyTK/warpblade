import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { air: 1 } },
  { values: { jumpCut: 0.8 } },
  { values: { jumpCut: 1.2, jumpLaunch: 1 } },
  { values: { doubleCut: 1 } },
  { values: { airDash: 1 } },
  { values: { doubleCut: 1.6 } },
  { values: { refresh: 1 } },
  { values: { air: 2 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "One more air dash.", drill: { airDash: 1 } },
  { text: "New: a wall kick cuts foes within 26 px for 0.8 AD.", drill: { kick: 0.8 } },
  { text: "New: a jump from the floor cuts foes within 26 px for 0.6 AD.", drill: { jumpCut: 0.6 } },
  { text: "Kick 1.6 AD; jump cut 1.2 AD.", drill: { kick: 1.6, jumpCut: 1.2 } },
  { text: "New: those cuts throw foes up.", drill: { lift: 200 } },
  { text: "Kick 2.8 AD; jump cut 2 AD.", drill: { kick: 2.8, jumpCut: 2 } },
  { text: "New: one more air cut per jump.", drill: { air: 1 } },
  { text: "Two more air dashes; kick 5.5 AD, jump cut 4 AD.", drill: { airDash: 2, kick: 5.5, jumpCut: 4 } },
]);

export const ASCENDING_STEP: SkillDef = {
  id: "ve_ascend",
  name: "Ascending Step",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "More air dashes, and the wall kick cuts what it passes.",
  levels: LEVELS,
  evolution: {
    partner: "ve_sky",
    name: "Moonlit Steps",
    text: "Kicks and jump cuts reach 56 px and leave a dusk ring.",
    row: evolvedRow(LEVELS[7], "Jump and kick cuts reach 56 px.", { doubleCut: 2, ...drillValues({ reach: 56 }) }),
  },
};

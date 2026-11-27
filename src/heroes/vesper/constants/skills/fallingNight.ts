import { PACT } from "../../../../constants/vitals";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { damage: 0.08, max: 4, duration: 3 } },
  { values: { damage: 0.12 } },
  { values: { landStacks: 2 } },
  { values: { max: 6 } },
  { values: { airTaken: 0.2 } },
  { values: { damage: 0.2, duration: 5 } },
  { values: { launchStacks: 2 } },
  { values: { damage: 0.3, max: 8 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Blows on foes in the air lay night that cuts as it burns.", drill: {} },
  { text: "Night 0.08 to 0.12.", drill: {} },
  { text: "New: the moonrise lays 2 night on each foe it cuts.", drill: { land: 2 } },
  { text: "Up to 6 night on a foe.", drill: {} },
  { text: "New: a foe with night takes 20% more while in the air.", drill: {} },
  { text: "Night 0.12 to 0.2; it lasts 5 s.", drill: {} },
  { text: "New: a launch lays 2 night.", drill: {} },
  { text: "Night 0.2 to 0.3; up to 8.", drill: {} },
]);

export const FALLING_NIGHT: SkillDef = {
  id: "ve_night",
  name: "Falling Night",
  kind: "dot",
  element: "void",
  risk: "timed",
  button: "auto",
  pact: PACT.blood,
  text: "Foes you strike in the air carry night that keeps cutting them.",
  levels: LEVELS,
  evolution: {
    partner: "ve_sky",
    name: "Starless Night",
    text: "The moonrise takes all the night on each foe it cuts, each stack a blow of 0.8 times attack damage.",
    row: evolvedRow(LEVELS[7], "The moonrise takes all night at once.", {
      consume: 0.8,
      ...drillValues({ consume: 0.8 }),
    }),
  },
};

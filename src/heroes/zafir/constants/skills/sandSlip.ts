import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { passCut: 0.6 },
  { passCut: 0.9 },
  { passWounds: 2 },
  { cloud: 1.2 },
  { perfectWhirl: 80 },
  { passCut: 1.8 },
  { air: 1 },
  { passCut: 5, passWounds: 3, cloud: 2.4 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "One more air dash.", drill: { airDashes: 1 } },
  { text: "New: foes you dash past are blinded 1 s.", drill: { cloud: 1 } },
  { text: "New: nothing can hurt you while you dash.", drill: { untouchable: 1 } },
  { text: "Blind 1 to 1.5 s.", drill: { cloud: 1.5 } },
  { text: "New: a second extra air dash.", drill: { airDashes: 2 } },
  { text: "New: a dash past a foe recharges the dash.", drill: { refresh: 1 } },
  { text: "New: foes you dash past bleed a wound; blind 1.5 to 2.2 s.", drill: { wounds: 1, cloud: 2.2 } },
  { text: "New: a third extra air dash.", drill: { airDashes: 3 } },
]);

export const SAND_SLIP: SkillDef = {
  id: "za_slip",
  name: "Sand Slip",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "More air dashes, a dash nothing can touch, and a cloud of sand that blinds the foes you slip past.",
  levels: LEVELS,
  evolution: {
    partner: "za_mirage",
    name: "Mirage Slip",
    text: "A dash past foes leaves a mirage where it started, which minions strike at and which bursts into sand blades.",
    row: evolvedRow(LEVELS[7], "Dashes past foes leave a mirage.", { mirage: 1, ...drillValues({ mirage: 1 }) }),
  },
};

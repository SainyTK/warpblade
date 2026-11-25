import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { perWound: 0.1 },
  { perWound: 0.15 },
  { tear: 0.3 },
  { twin: 1 },
  { perWound: 0.22 },
  { spread: 1 },
  { tear: 0.5, splash: 0.5 },
  { perWound: 0.45, tear: 1.2 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The twin turn deals +12% for each wound on the foe.", drill: { perWound: 0.12 } },
  { text: "New: the twin turn opens two more wounds.", drill: { open: 2 } },
  { text: "Per wound +12% to +20%.", drill: { perWound: 0.2 } },
  { text: "New: the twin turn tears the wounds open, 0.3 each.", drill: { tear: 0.3 } },
  { text: "New: the twin turn staggers the foe.", drill: { stagger: 0.4 } },
  { text: "Per wound +20% to +40%; tear 0.3 to 0.6.", drill: { perWound: 0.4, tear: 0.6 } },
  { text: "New: each torn wound also cuts the foes beside it for half.", drill: { splash: 0.5 } },
  { text: "Per wound +40% to +100%; tear 0.6 to 1.5.", drill: { perWound: 1, tear: 1.5 } },
]);

export const OPENED_VEINS: SkillDef = {
  id: "za_veins",
  name: "Opened Veins",
  kind: "attack",
  element: "venom",
  risk: "timed",
  button: "J",
  text: "The twin turn, the chain's finisher, hits harder for each wound on the foe, then tears the wounds open.",
  levels: LEVELS,
  evolution: {
    partner: "za_deep",
    name: "Red Wind",
    text: "Every slash tears one wound open on each foe it cuts, for 1.2 times attack damage.",
    row: evolvedRow(LEVELS[7], "Every slash tears a wound open.", { red: 1.2, ...drillValues({ red: 1.2 }) }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { chance: 0.15, power: 0.5, cooldown: 1.5 },
  { chance: 0.25 },
  { wounds: 1 },
  { back: 1 },
  { power: 0.8 },
  { pair: 1 },
  { drag: 1 },
  { chance: 0.35, power: 1.1 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "A slash that lands has a 15% chance to call a sand wraith." },
  { text: "Chance 15% to 25%." },
  { text: "New: the wraith opens a wound on each foe it cuts." },
  { text: "New: it turns back and cuts through them again." },
  { text: "Wraith 0.5 to 0.8." },
  { text: "New: two wraiths, one each way." },
  { text: "New: the wraith drags foes along with it." },
  { text: "Chance 25% to 35%; wraith 0.8 to 1.1." },
]);

export const SAND_WRAITH: SkillDef = {
  id: "za_wraith",
  name: "Sand Wraith",
  kind: "summon",
  element: "void",
  risk: "easy",
  button: "auto",
  text: "A slash that lands may call a sand wraith that whirls through the foes ahead.",
  levels: LEVELS,
  evolution: {
    partner: "za_dune",
    name: "Wraith Caravan",
    text: "A wraith walks round you all the time and cuts every foe it passes.",
    row: evolvedRow(LEVELS[7], "A wraith walks round you all the time.", { escort: 1, ...drillValues({}) }),
  },
};

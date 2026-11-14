import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a landed spin calls a wraith, `power` attack damage of each cut, `cooldown` least seconds between calls, `wounds` wounds a cut opens, `back` the wraith turns back and cuts again, `pair` one goes each way, `drag` it drags foes along, `escort` evolved, a wraith patrols round him all the time */
const LEVELS = levelRows([
  {
    text: "A spin that lands may call a sand wraith that whirls through foes ahead.",
    values: { chance: 0.15, power: 0.5, cooldown: 1.5 },
  },
  { text: "Chance 15% to 25%.", values: { chance: 0.25 } },
  { text: "New: the wraith opens a wound on each foe it cuts.", values: { wounds: 1 } },
  { text: "New: it turns back and cuts through them again.", values: { back: 1 } },
  { text: "Wraith 0.5 to 0.8.", values: { power: 0.8 } },
  { text: "New: two wraiths, one each way.", values: { pair: 1 } },
  { text: "New: the wraith drags foes along with it.", values: { drag: 1 } },
  { text: "Chance 25% to 45%; wraith 0.8 to 1.6.", values: { chance: 0.45, power: 1.6 } },
]);

export const SAND_WRAITH: SkillDef = {
  id: "za_wraith",
  name: "Sand Wraith",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A spin that lands may call a sand wraith that whirls along the floor through the foes ahead.",
  levels: LEVELS,
  evolution: {
    partner: "za_dune",
    name: "Wraith Caravan",
    text: "A sand wraith walks round you all the time, cutting every foe it passes.",
    row: evolvedRow(LEVELS[7], "A wraith walks round you all the time.", { escort: 1 }),
  },
};

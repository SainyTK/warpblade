import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a launch sends swallows, `count` swallows, `power` attack damage each, `cooldown` least seconds
 *  between flights, `pierce` foes one strikes, `ground` they dive at foes on the floor too, `airTop` an air blow at the top
 *  of Tempo sends one, `storm` (evolved) swallows a launch sends */
const LEVELS = levelRows([
  {
    text: "A launch may send 2 dusk swallows at foes in the air.",
    values: { chance: 0.5, count: 2, power: 0.6, cooldown: 1, pierce: 1 },
  },
  { text: "Chance 50% to 70%.", values: { chance: 0.7 } },
  { text: "New: swallows pierce on to a second foe.", values: { pierce: 2 } },
  { text: "3 swallows.", values: { count: 3 } },
  { text: "New: swallows dive at foes on the floor too and throw them up.", values: { ground: 1 } },
  { text: "Swallows 0.6 to 0.9; every launch sends them.", values: { power: 0.9, chance: 1 } },
  { text: "New: an air blow at the top of Tempo sends a swallow.", values: { airTop: 1 } },
  { text: "4 swallows; 0.9 to 1.2.", values: { count: 4, power: 1.2 } },
]);

export const NIGHT_SWALLOWS: SkillDef = {
  id: "ve_swallow",
  name: "Night Swallows",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "Throwing a foe up may send dusk swallows diving at foes in the air.",
  levels: LEVELS,
  evolution: {
    partner: "ve_night",
    name: "Swallow Storm",
    text: "Six swallows circle you and dive at every launch.",
    row: evolvedRow(LEVELS[7], "Six swallows circle you and dive at every launch.", { storm: 6 }),
  },
};

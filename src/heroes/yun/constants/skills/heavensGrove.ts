import { ULT_CHARGE } from "../../../../constants/ultimate";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` multiplies each falling sword, `cooldown` seconds, `charge` charging speed, `perFoe` swords on each foe, `foes` foes it falls on, `fill` it fills your spirit swords, `again` a second rain at this share, `linger` seconds the rain keeps falling round you */
const LEVELS = levelRows([
  { text: "Jade Rain falls 30% harder.", values: { power: 1.3 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: four swords fall on each foe.", values: { perFoe: 4 } },
  { text: "Rain power +30% to +70%.", values: { power: 1.7 } },
  { text: "New: the rain falls on 10 foes.", values: { foes: 10 } },
  { text: "New: the rain fills your spirit swords.", values: { fill: 1 } },
  { text: "New: a second rain falls a moment later at half power.", values: { again: 0.5 } },
  { text: "Rain power +70% to +120%; five swords to a foe.", values: { power: 2.2, perFoe: 5 } },
]);

export const HEAVENS_GROVE: SkillDef = {
  id: "yu_rain",
  name: "Heaven's Grove",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Jade Rain grows: more swords on more foes, a second rain, and your swords back. Grows with attack damage. ${ULT_CHARGE}`,
  levels: LEVELS,
  evolution: {
    partner: "yu_heron",
    name: "Endless Rain",
    text: "The rain keeps falling on foes near you for 4 seconds after it strikes.",
    row: evolvedRow(LEVELS[7], "The rain keeps falling 4 s.", { linger: 4 }),
  },
};

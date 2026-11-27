import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

/** values: `power` multiplies each falling sword, `cooldown` seconds, `charge` charging speed, `perFoe` swords on each foe, `foes` foes it falls on, `fill` it fills your spirit swords, `again` a second rain at this share, `linger` seconds the rain keeps falling round you */
const LEVELS = levelRows([
  { text: "Jade Rain falls 30% harder.", values: { power: 1.3 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: four swords fall on each foe.", values: { perFoe: 4 } },
  { text: "Rain power x1.3 to x3.", values: { power: 3 } },
  { text: "New: the rain falls on 10 foes.", values: { foes: 10 } },
  { text: "New: the rain fills your spirit swords.", values: { fill: 1 } },
  { text: "New: a second rain falls a moment later at half power.", values: { again: 0.5 } },
  { text: "Rain power x3 to x6; five swords to a foe.", values: { power: 6, perFoe: 5 } },
]);

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "Jade Rain +30% damage.", drill: { damage: 0.3 } },
  { text: "New: each Jade Rain drops a spirit sword on every foe near you.", drill: { swords: 1, power: 0.5 } },
  { text: "New: Jade Rain charges 20% faster.", drill: { charge: 1.2 } },
  { text: "Jade Rain +80% damage.", drill: { damage: 0.8 } },
  { text: "New: Jade Rain reaches 25% further.", drill: { reach: 1.25 } },
  { text: "Two swords on every foe; each 1 AP a level.", drill: { swords: 2, power: 1 } },
  { text: "New: the rain keeps falling 2 s.", drill: { linger: 2 } },
  { text: "Jade Rain +250%; swords 2 AP a level.", drill: { damage: 2.5, power: 2 } },
]);

export const HEAVENS_GROVE: SkillDef = {
  id: "yu_rain",
  name: "Heaven's Grove",
  kind: "ultimate",
  element: "venom",
  risk: "easy",
  button: "J",
  text: "Jade Rain on held J hits harder, charges faster and drops spirit swords on the foes near you.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_heron",
    name: "Endless Rain",
    text: "After every Jade Rain the swords keep falling for 4 seconds.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "The rain keeps falling 4 s.", { linger: 4 }),
      "The rain keeps falling 4 s.",
      { endless: 4 },
    ),
  },
};

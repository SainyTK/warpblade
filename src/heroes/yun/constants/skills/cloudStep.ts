import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

/** values: `ring` power of the qi ring a second jump sends, in attack damage, `radius` its reach in pixels, `airDodge` the front dodge works in the air, `float` gravity while falling, `land` power of the qi waves a landing from a jump sends both ways, `sword` seconds between spirit swords a second jump gives, `pull` the ring draws foes in */
const LEVELS = levelRows([
  { text: "A second jump sends a ring of qi round you.", values: { ring: 0.6, radius: 26 } },
  { text: "Ring power 0.6 to 0.9.", values: { ring: 0.9 } },
  { text: "New: dodge in the air.", values: { airDodge: 1 } },
  { text: "Ring power 0.9 to 1.2; it reaches further.", values: { ring: 1.2, radius: 32 } },
  { text: "New: you fall even more slowly.", values: { float: 0.68 } },
  { text: "New: landing from a jump sends qi waves both ways.", values: { land: 1.5 } },
  { text: "Ring power 1.2 to 2.4; it reaches further.", values: { ring: 2.4, radius: 38 } },
  { text: "New: a second jump gives a spirit sword, once every 3 s; ring power 3.", values: { sword: 3, ring: 3 } },
]);

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "One more air cut per jump.", drill: { airSlashes: 1 } },
  { text: "New: a wall kick sends a qi ring for 1 AD.", drill: { kick: 1 } },
  { text: "New: landing after an air cut sends a qi ring for 1 AD.", drill: { land: 1 } },
  { text: "Kick and landing rings 2 AD.", drill: { kick: 2, land: 2 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "Rings 3.5 AD.", drill: { kick: 3.5, land: 3.5 } },
  { text: "New: two more air cuts per jump.", drill: { airSlashes: 2 } },
  { text: "Rings 7 AD.", drill: { kick: 7, land: 7 } },
]);

export const CLOUD_STEP: SkillDef = {
  id: "yu_cloud",
  name: "Cloud Step",
  kind: "movement",
  element: "storm",
  risk: "timed",
  button: "jump",
  text: "More air cuts, cutting wall kicks and a qi ring where you land.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_drift",
    name: "Cloud Walker",
    text: "The landing ring reaches 70 px and holds foes' feet.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "The ring pulls; landing waves x2.", { pull: 1, land: 1.6 }),
      "Landing ring 70 px; holds feet.",
      { walker: 70 },
    ),
  },
};

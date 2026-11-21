import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

/** values: `power` multiplies the air cuts, `air` air cuts added per jump, `wave` power of the qi wave Falling Petal sends, `sword` the first air cut that lands each jump gives a spirit sword, `airEcho` echo thrusts per sword after an air cut, `crit` air cuts are sure critical hits */
const LEVELS = levelRows([
  { text: "Air cuts hit 30% harder.", values: { power: 1.3 } },
  { text: "Air power +30% to +60%.", values: { power: 1.6 } },
  { text: "New: a third air cut each jump.", values: { air: 1 } },
  { text: "Air power +60% to +90%.", values: { power: 1.9 } },
  { text: "New: Falling Petal sends a qi wave ahead.", values: { wave: 0.8 } },
  { text: "New: the first air cut that lands each jump gives a spirit sword.", values: { sword: 1 } },
  { text: "Air power +90% to +130%.", values: { power: 2.3 } },
  { text: "New: air cuts are echoed twice; power +160%.", values: { airEcho: 2, power: 2.6 } },
]);

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "One more air cut per jump.", drill: { airSlashes: 1 } },
  { text: "New: a landed air cut scatters petals that cut foes below for 0.6 AD.", drill: { petal: 0.6 } },
  { text: "New: a landed air cut restores the air dash.", drill: { refresh: 1 } },
  { text: "Petals 0.6 to 1.2 AD.", drill: { petal: 1.2 } },
  { text: "New: two more air cuts per jump.", drill: { airSlashes: 2 } },
  { text: "Petals 2.2 AD.", drill: { petal: 2.2 } },
  { text: "New: petals stagger.", drill: { stagger: 0.4 } },
  { text: "Petals 4.5 AD.", drill: { petal: 4.5 } },
]);

export const PETAL_STORM: SkillDef = {
  id: "yu_petal",
  name: "Petal Storm",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "More air cuts, and each one that lands scatters cutting petals below.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_cloud",
    name: "Blossom Fall",
    text: "Landing after an air cut sends crescents both ways.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Four air cuts; all critical.", { air: 2, crit: 1 }),
      "Landing sends crescents both ways.",
      { bloom: 3 },
    ),
  },
};

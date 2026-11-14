import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `reach` pixels every blow of the string reaches further, `power` multiplies the string's blows, `behind` Crane Wheel cuts behind too, `stagger` multiplies the stagger, `tideBehind` Returning Tide cuts behind too, `pull` blows draw foes in, `around` every blow cuts behind */
const LEVELS = levelRows([
  { text: "String blows reach 6 px further.", values: { reach: 6 } },
  { text: "String power +10%.", values: { power: 1.1 } },
  { text: "New: Crane Wheel also cuts behind you.", values: { behind: 1 } },
  { text: "Reach +10 px; power +20%.", values: { reach: 10, power: 1.2 } },
  { text: "New: string blows stagger foes 50% longer.", values: { stagger: 1.5 } },
  { text: "Reach +14 px; power +30%.", values: { reach: 14, power: 1.3 } },
  { text: "New: Returning Tide cuts behind you too.", values: { tideBehind: 1 } },
  { text: "New: blows draw foes in to you; power +40%.", values: { pull: 1, power: 1.4 } },
]);

export const CRANES_REACH: SkillDef = {
  id: "yu_crane",
  name: "Crane's Reach",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The string reaches further and hits harder, and Crane Wheel cuts behind.",
  levels: LEVELS,
  evolution: {
    partner: "yu_tide",
    name: "White Crane",
    text: "Every blow of the string cuts behind you as well as ahead.",
    row: evolvedRow(LEVELS[7], "Every blow cuts both ways.", { around: 1 }),
  },
};

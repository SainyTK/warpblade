import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

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

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "Parry window +40%.", drill: { window: 1.4 } },
  { text: "New: a parry sends a qi wave 120 px for 1.2 AD.", drill: { wave: 1.2 } },
  { text: "New: a block sends a wave for 0.6 AD.", drill: { blockWave: 0.6 } },
  { text: "Parry wave 2.4 AD.", drill: { wave: 2.4 } },
  { text: "New: parry window +80%.", drill: { window: 1.8 } },
  { text: "Parry wave 4 AD; block wave 1.2.", drill: { wave: 4, blockWave: 1.2 } },
  { text: "New: a parry holds the feet of foes around for 1.5 s.", drill: { halt: 1.5 } },
  { text: "Parry wave 8 AD.", drill: { wave: 8 } },
]);

export const CRANES_REACH: SkillDef = {
  id: "yu_crane",
  name: "Crane's Reach",
  kind: "attack",
  element: "frost",
  risk: "easy",
  button: "K",
  text: "A wider parry window, and parries send a qi wave at the attacker.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_tide",
    name: "White Crane",
    text: "Every parry sends three waves at three heights.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Every blow cuts both ways.", { around: 1 }),
      "Parries send three waves.",
      {},
    ),
  },
};

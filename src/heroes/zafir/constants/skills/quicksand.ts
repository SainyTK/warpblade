import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { power: 0.35, life: 2, recharge: 5 },
  { power: 0.5, life: 2.5 },
  { reach: 1.33 },
  { mark: 0.15 },
  { power: 0.7, life: 3 },
  { sink: 0.3 },
  { wounds: 1 },
  { power: 1.5, mark: 0.25 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Sandspout holds the foes it hits for 0.5 s.", drill: { halt: 0.5 } },
  { text: "New: Sandspout cuts 0.6 harder.", drill: { power: 0.6 } },
  { text: "New: Sandspout opens two more wounds.", drill: { wounds: 2 } },
  { text: "Sandspout cut 0.6 to 1.2.", drill: { power: 1.2 } },
  { text: "New: a sunk foe drags the foes beside it down too.", drill: { drag: 1 } },
  { text: "Sandspout cut 1.2 to 2.4; holds 0.5 to 1 s.", drill: { power: 2.4, halt: 1 } },
  { text: "New: a second spout follows the first.", drill: { twin: 1 } },
  { text: "Sandspout cut 2.4 to 5.", drill: { power: 5 } },
]);

export const QUICKSAND_SKILL: SkillDef = {
  id: "za_quicksand",
  name: "Quicksand",
  kind: "spell",
  element: "venom",
  risk: "easy",
  button: "I",
  text: "Sandspout sinks what it catches: it hits harder, holds foes in place and opens more wounds.",
  levels: LEVELS,
  evolution: {
    partner: "za_falling",
    name: "Sinking Sea",
    text: "Every Sandspout hit raises a whirl of sand that runs on through the foes behind.",
    row: evolvedRow(LEVELS[7], "Each hit raises a whirl that runs on.", { spout: 0.6, ...drillValues({ sea: 1.5 }) }),
  },
};

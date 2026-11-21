import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { power: 1.0, recharge: 4 },
  { power: 1.4 },
  { wounds: 1 },
  { reach: 1.3 },
  { halt: 1 },
  { power: 3.5, recharge: 3 },
  { both: 1 },
  { power: 7, wounds: 2 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The crescent cuts 0.4 harder.", drill: { power: 0.4 } },
  { text: "New: the crescent comes back, cutting again on the way.", drill: { back: 0.6 } },
  { text: "Crescent cut 0.4 to 0.8.", drill: { power: 0.8 } },
  { text: "New: a crescent-infused hit sends a hot gust ahead.", drill: { gust: 0.8 } },
  { text: "New: infusions last 1 more hit.", drill: { infusion: 1 } },
  { text: "Crescent cut 0.8 to 1.8; return 0.6 to 1.4.", drill: { power: 1.8, back: 1.4 } },
  { text: "New: the crescent staggers the foe it hits.", drill: { stagger: 0.35 } },
  { text: "Crescent cut 1.8 to 4; gust 0.8 to 3.", drill: { power: 4, gust: 3 } },
]);

export const HOT_GALE: SkillDef = {
  id: "za_gale",
  name: "Hot Gale",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "The crescent rides a hot gale: it hits harder, comes back for a second cut and bleeds what it touches.",
  levels: LEVELS,
  evolution: {
    partner: "za_deep",
    name: "Simoom",
    text: "Every crescent hit tears all the foe's wounds open at once, 1 attack damage each.",
    row: evolvedRow(LEVELS[7], "Crescent hits tear every wound open.", { ...drillValues({ simoom: 1 }) }),
  },
};

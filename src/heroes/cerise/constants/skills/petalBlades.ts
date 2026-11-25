import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a spell calls the petals, `count` blades, `power` AD each dart, `every` seconds between darts,
 *  `life` seconds they stay, `bleed` a dart lays a Thorn Wounds-like bleed of this AD a tick, `cd` seconds before
 *  they can come again; evolved `orbit` blades stay round her for good */
const LEVELS = levelRows([
  {
    text: "A spell: 40% to call 2 petal blades that dart at foes for 4 s, 0.5 AD.",
    values: { chance: 0.4, count: 2, power: 0.5, every: 0.6, life: 4, cd: 3 },
  },
  { text: "Chance 40% to 70%.", values: { chance: 0.7 } },
  { text: "New: a third blade.", values: { count: 3 } },
  { text: "Darts 0.5 to 0.6 AD; chance 100%.", values: { power: 0.6, chance: 1 } },
  { text: "New: darts leave a bleed.", values: { bleed: 0.2 } },
  { text: "New: blades stay 4 to 7 s.", values: { life: 7 } },
  { text: "New: blades dart twice as often.", values: { every: 0.3 } },
  { text: "Darts 0.6 to 0.9 AD; 4 blades.", values: { power: 0.9, count: 4 } },
]);

export const PETAL_BLADES: SkillDef = {
  id: "ce_petals",
  name: "Petal Blades",
  kind: "summon",
  element: "venom",
  risk: "easy",
  button: "auto",
  text: "Casting a spell can call petal blades that dart at foes round you.",
  levels: LEVELS,
  evolution: {
    partner: "ce_bloom",
    name: "Rose Guard",
    text: "Five petal blades circle you for good and dart at every foe that comes close.",
    row: evolvedRow(LEVELS[7], "Five blades circle you for good.", { orbit: 1, count: 5 }),
  },
};

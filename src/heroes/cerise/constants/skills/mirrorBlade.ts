import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a parry or perfect dodge calls a glass rapier, `power` AD of its lunge through the foe, `twice` it
 *  lunges back, `mark` it sets the Rose mark, `stagger` seconds it staggers its foe, `blades` how many come; evolved `every` seconds between
 *  rapiers that keep coming for `hold` seconds */
const LEVELS = levelRows([
  {
    text: "A parry or perfect dodge: 50% to call a glass rapier that lunges through the foe, 4 AD.",
    values: { chance: 0.5, power: 4, blades: 1 },
  },
  { text: "Chance 50% to 75%.", values: { chance: 0.75 } },
  { text: "New: the rapier lunges back through it.", values: { twice: 1 } },
  { text: "Lunge 4 to 8 AD; chance 100%.", values: { power: 8, chance: 1 } },
  { text: "New: the rapier sets the Rose mark.", values: { mark: 1 } },
  { text: "New: two rapiers come.", values: { blades: 2 } },
  { text: "New: the rapier staggers its foe.", values: { stagger: 0.4 } },
  { text: "Lunge 8 to 20 AD.", values: { power: 20 } },
]);

export const MIRROR_BLADE: SkillDef = {
  id: "ce_mirror",
  name: "Mirror Blade",
  kind: "summon",
  element: "void",
  risk: "precise",
  button: "auto",
  text: "A parry or a perfect dodge can call a glass rapier that lunges through the foe.",
  levels: LEVELS,
  evolution: {
    partner: "ce_feint",
    name: "Hall of Mirrors",
    text: "After the call, glass rapiers keep lunging at the foe for 2 s.",
    row: evolvedRow(LEVELS[7], "Glass rapiers keep lunging for 2 s.", { every: 0.25, hold: 2 }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a cast calls one, `power` attack damage the heron deals each foe, `back` it flies back too, `count` herons a call sends, `stun` seconds foes are knocked down, `ult` Jade Rain calls them too, `cooldown` least seconds between calls */
const LEVELS = levelRows([
  {
    text: "Casting may call a jade heron that flies through the line ahead.",
    values: { chance: 0.35, power: 1, count: 1, cooldown: 0.6 },
  },
  { text: "Chance 35% to 50%.", values: { chance: 0.5 } },
  { text: "New: the heron flies back too.", values: { back: 1 } },
  { text: "Heron power 1 to 1.6.", values: { power: 1.6 } },
  { text: "New: two herons, one high and one low.", values: { count: 2 } },
  { text: "Chance 50% to 70%.", values: { chance: 0.7 } },
  { text: "New: herons knock foes down.", values: { stun: 0.5 } },
  { text: "New: Jade Rain calls herons too; power 2.6.", values: { ult: 1, power: 2.6 } },
]);

export const JADE_HERON: SkillDef = {
  id: "yu_heron",
  name: "Jade Heron",
  kind: "summon",
  element: "venom",
  risk: "timed",
  button: "auto",
  text: "Casting may call a jade heron that flies through the line ahead.",
  levels: LEVELS,
  evolution: {
    partner: "yu_fan",
    name: "Heron Flight",
    text: "Every cast calls three herons.",
    row: evolvedRow(LEVELS[7], "Every cast: three herons.", { chance: 1, count: 3 }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows } from "./drillRows";
import { SKILL } from "./ids";

/** values: a parry or perfect dodge calls an ink shade of her with `chance`; it draws once on the nearest foe for
 *  `power` attack damage (on that foe only); `store` it stores this too; `mark` damage-taken mark it leaves for 3 s; `clean` a clean sheathe calls one (`drill.keen` a Keen sheathe on the drill); `count`
 *  shades; `crit` its draw is a sure crit; `cd` s between shades */
const LEVELS = levelRows([
  {
    text: "A parry or perfect dodge may call an ink shade that draws on the nearest foe.",
    values: { chance: 0.5, power: 4, count: 1, cd: 1 },
  },
  { text: "Chance 50% to 75%.", values: { chance: 0.75 } },
  { text: "New: the shade's draw stores a cut as well.", values: { store: 3 } },
  { text: "New: the foe the shade cuts takes +25% damage for 3 s.", values: { mark: 0.25 } },
  { text: "New: a clean sheathe calls a shade too.", values: { clean: 1 } },
  { text: "Chance 75% to 100%; shade +150%.", values: { chance: 1, power: 10 } },
  { text: "New: the shade's draw is a sure critical hit.", values: { crit: 1 } },
  { text: "Shade +150% to +400%.", values: { power: 20, store: 8 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "A parry or perfect dodge may call an ink shade that draws on the nearest foe." },
  { text: "Chance 50% to 75%." },
  { text: "New: the shade's draw stores a cut as well." },
  { text: "New: the foe the shade cuts takes +25% damage for 3 s." },
  { text: "New: a Keen sheathe calls a shade too.", drill: { keen: 1 } },
  { text: "Chance 75% to 100%; shade +150%." },
  { text: "New: the shade's draw is a sure critical hit." },
  { text: "Shade +150% to +400%." },
]);

export const SHADE: SkillDef = {
  id: SKILL.shade,
  name: "Ink Shade",
  kind: "summon",
  element: "void",
  risk: "precise",
  button: "K",
  text: "A parry or a perfect dodge may leave an ink shade of her that draws once on the nearest foe.",
  levels: DRILL,
  evolution: {
    partner: SKILL.still,
    name: "Twin Moon",
    text: "Two shades come each time, one each side of the foe, and each draws twice.",
    row: evolvedRow(DRILL[7], "Two shades, each drawing twice.", { count: 2, twice: 1 }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: a full release folds `count` cranes with `chance`, at most once each `cd` s; each flies at a foe for `power`
 *  attack damage, stores `store` in it, and with `turns` cuts that many foes; `early` early releases fold them too, `perFoe` a crane for every foe released */
const LEVELS = levelRows([
  {
    text: "A full release may fold an ink crane that flies at a foe and cuts it.",
    values: { chance: 0.3, power: 1, cd: 1.2, count: 1, turns: 1 },
  },
  { text: "Chance 30% to 45%.", values: { chance: 0.45 } },
  { text: "New: the crane stores its cut too.", values: { store: 1 } },
  { text: "Crane +100%.", values: { power: 2 } },
  { text: "New: two cranes at once.", values: { count: 2 } },
  { text: "New: early releases fold cranes too; chance 70%.", values: { early: 1, chance: 0.7 } },
  { text: "New: each crane turns and cuts a second foe.", values: { turns: 2 } },
  { text: "Crane +100% to +400%.", values: { power: 5, store: 3 } },
]);

export const INK_CRANE: SkillDef = {
  id: SKILL.crane,
  name: "Ink Crane",
  kind: "summon",
  element: "void",
  risk: "easy",
  button: "auto",
  text: "When stored cuts release, an ink crane may fold itself from the splash and fly at a foe.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.crescent,
    name: "Thousand Cranes",
    text: "Every full release folds a crane for each foe it struck.",
    row: evolvedRow(LEVELS[7], "A crane for every foe a release strikes.", { chance: 1, perFoe: 1 }),
  },
};

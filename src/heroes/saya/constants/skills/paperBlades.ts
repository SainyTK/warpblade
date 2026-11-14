import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: a kill folds a paper blade with `chance` (a full release with `release` times it; at most `most` at once) that circles her for `time` s, cutting
 *  foes it touches for `power` attack damage at most every `every` s; `store` it stores too; `fly` when its time ends
 *  it flies at a foe for this many times its cut */
const LEVELS = levelRows([
  {
    text: "A kill may fold a paper blade that circles her and cuts foes it touches.",
    values: { chance: 0.35, time: 4, power: 0.5, every: 0.5, most: 2 },
  },
  { text: "New: a full release may fold a blade too; blades last 6 s.", values: { release: 0.5, time: 6 } },
  { text: "New: blades store their cuts too.", values: { store: 0.4 } },
  { text: "Chance 35% to 55%; cut +60%.", values: { chance: 0.55, power: 0.8 } },
  { text: "New: up to 4 blades at once.", values: { most: 4 } },
  { text: "Cut +60% to +150%.", values: { power: 1.25 } },
  { text: "New: a blade's last act is to fly at a foe.", values: { fly: 3 } },
  { text: "Cut +150% to +400%.", values: { power: 2.5, store: 1 } },
]);

export const PAPER_BLADES: SkillDef = {
  id: SKILL.paper,
  name: "Paper Blades",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A foe that falls may leave a paper blade that circles her and cuts.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.breath,
    name: "Paper Storm",
    text: "Every kill folds a blade, up to 8, and they circle wider.",
    row: evolvedRow(LEVELS[7], "Every kill folds a blade, up to 8.", { chance: 1, most: 8, wider: 1 }),
  },
};

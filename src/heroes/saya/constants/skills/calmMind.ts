import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: while Focus is full (or `need` breaths from short of full) her hits deal `bonus` more; `chip` the factor on
 *  what her guard lets through; `release` added to releases; `hold` s the calm lasts after Focus drops */
const LEVELS = levelRows([
  { text: "With Focus full her hits deal +10%.", values: { bonus: 0.1 } },
  { text: "New: with Focus full her guard lets half as much through.", values: { chip: 0.5 } },
  { text: "Bonus +10% to +20%.", values: { bonus: 0.2 } },
  { text: "New: with Focus full releases deal +25% more.", values: { release: 0.25 } },
  { text: "Bonus +20% to +30%.", values: { bonus: 0.3 } },
  { text: "New: calm holds with one breath short of full.", values: { need: 1 } },
  { text: "Release bonus +25% to +60%.", values: { release: 0.6 } },
  { text: "New: bonus +30% to +50%, and calm holds 1 s after it breaks.", values: { bonus: 0.5, hold: 1 } },
]);

export const CALM_MIND: SkillDef = {
  id: SKILL.calm,
  name: "Calm Mind",
  kind: "passive",
  risk: "timed",
  button: "auto",
  text: "While her Focus is full she is calm: her hits deal more and her guard holds better.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.breath,
    name: "Empty Mind",
    text: "Calm holds for 3 seconds after Focus drops, and the bonus doubles.",
    row: evolvedRow(LEVELS[7], "Calm holds 3 s after it breaks; bonus doubled.", { hold: 3, bonus: 1, release: 1.2 }),
  },
};

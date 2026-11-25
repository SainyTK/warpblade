import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
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

const DRILL = drillRows(LEVELS, [
  { text: "The parry window is 40% longer.", drill: { window: 1.4 } },
  { text: "New: a parry releases every stored cut.", drill: { release: 1 } },
  { text: "New: a parry draws the blade at the attacker for 2x AD, a sure critical hit.", drill: { counter: 2 } },
  { text: "Parry window 40% to 70% longer.", drill: { window: 1.7 } },
  { text: "New: a block stores a 1x AD cut in the attacker.", drill: { blockStore: 1 } },
  { text: "Counter draw 2x to 4x AD.", drill: { counter: 4 } },
  { text: "New: a parry restores 10 MP.", drill: { mp: 10 } },
  { text: "Counter draw 4x to 8x AD; the window doubles.", drill: { counter: 8, window: 2 } },
]);

export const CALM_MIND: SkillDef = {
  id: SKILL.calm,
  name: "Calm Mind",
  kind: "attack",
  element: "frost",
  risk: "timed",
  button: "K",
  text: "A wider parry, and a parry draws the blade at the attacker.",
  levels: DRILL,
  evolution: {
    partner: SKILL.breath,
    name: "Empty Mind",
    text: "For 3 seconds after a parry every slash is a sure critical hit.",
    row: evolvedRow(DRILL[7], "3 s of sure critical slashes after a parry.", {
      ...drillValues({ focus: 3 }),
      hold: 3,
      bonus: 1,
      release: 1.2,
    }),
  },
};

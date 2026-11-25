import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
import { SKILL } from "./ids";

/** values: `rest` the factor on the time a breath takes, `more` breaths added to Focus, `heal` HP each breath filled
 *  gives, `move` the factor on her walk while Focus is full, `refund` the chance a breath draw keeps its breath */
const LEVELS = levelRows([
  { text: "Breaths fill 20% faster.", values: { rest: 0.8 } },
  { text: "New: Focus holds 4 breaths.", values: { more: 1 } },
  { text: "Breaths fill 20% to 35% faster.", values: { rest: 0.65 } },
  { text: "New: each breath filled heals 2 HP.", values: { heal: 2 } },
  { text: "New: she walks 10% faster with Focus full.", values: { move: 1.1 } },
  { text: "Breaths fill 35% to 50% faster.", values: { rest: 0.5 } },
  { text: "New: Focus holds 5 breaths.", values: { more: 2 } },
  { text: "Each breath heals 2 to 5 HP.", values: { heal: 5 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "A wall kick cuts foes near the wall for 1x AD.", drill: { kick: 1 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "New: a dash-jump cuts the foes beside her as she leaves.", drill: { dashJump: 1 } },
  { text: "Cuts 1x to 2x AD.", drill: { kick: 2 } },
  { text: "New: one more air slash per jump.", drill: { air: 1 } },
  { text: "Cuts 2x to 3.5x AD.", drill: { kick: 3.5 } },
  { text: "New: a wall kick restores the air dash.", drill: { refresh: 1 } },
  { text: "Cuts 3.5x to 7x AD.", drill: { kick: 7 } },
]);

export const DEEP_BREATH: SkillDef = {
  id: SKILL.breath,
  name: "Feather Step",
  kind: "movement",
  element: "frost",
  risk: "easy",
  button: "jump",
  text: "Wall kicks and dash-jumps cut, and she gains air dashes and air slashes.",
  levels: DRILL,
  evolution: {
    partner: SKILL.calm,
    name: "Boundless Breath",
    text: "Every jump sends an ink crescent ahead that stores in each foe.",
    row: evolvedRow(DRILL[7], "Every jump sends a storing ink crescent.", {
      ...drillValues({ crescent: 2 }),
      refund: 0.5,
    }),
  },
};

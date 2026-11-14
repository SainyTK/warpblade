import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
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

export const DEEP_BREATH: SkillDef = {
  id: SKILL.breath,
  name: "Deep Breath",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "Focus fills faster, holds more breaths and heals her a little as it fills.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.calm,
    name: "Boundless Breath",
    text: "A draw spends its breath only half the time.",
    row: evolvedRow(LEVELS[7], "A draw keeps its breath half the time.", { refund: 0.5 }),
  },
};

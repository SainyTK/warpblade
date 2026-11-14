import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: `bonus` added to a clean sheathe's release on the first foe it reaches, `window` seconds after the return
 *  cut lands that J is clean, `mark` the damage-taken mark a clean release leaves for `markTime` s, `reset` it gives
 *  the abilities back, `warp` it gives the warp back, `breaths` it gives, `twice` share of a second release a beat later */
const LEVELS = levelRows([
  { text: "A clean sheathe's release deals +100% on the first foe.", values: { bonus: 1 } },
  { text: "Clean window 0.10 to 0.15 s.", values: { window: 0.15 } },
  { text: "New: a clean release marks its foes: +20% damage taken for 3 s.", values: { mark: 0.2, markTime: 3 } },
  { text: "Clean bonus +100% to +250%.", values: { bonus: 2.5 } },
  { text: "New: a clean sheathe gives Brushline and Moonrise back at once.", values: { reset: 1 } },
  { text: "New: a clean sheathe gives the warp back; mark +20% to +35%.", values: { warp: 1, mark: 0.35 } },
  { text: "New: a clean sheathe gives two breaths.", values: { breaths: 2 } },
  { text: "Clean bonus +250% to +700%; window 0.2 s.", values: { bonus: 7, window: 0.2 } },
]);

export const CLEAN_SHEATHE: SkillDef = {
  id: SKILL.clean,
  name: "Clean Sheathe",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "Press the sheathe just as the return cut lands: its release hits far harder on the first foe.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.edge,
    name: "Perfect Stillness",
    text: "A clean sheathe releases twice: the second burst follows a beat later at full strength.",
    row: evolvedRow(LEVELS[7], "A clean sheathe releases twice.", { twice: 1 }),
  },
};

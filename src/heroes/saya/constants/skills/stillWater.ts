import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: `time` s she stands still, `recharge` s, `store` attack damage the counter draw stores in every foe ahead,
 *  `breath` it gives a breath as it starts, `power` the factor on the counter draw, `clean` its click is a clean sheathe,
 *  `ward` it breaks foe shots near her, `behind` it catches blows from behind too */
const LEVELS = levelRows([
  {
    text: "Learn Still Water: stand still a moment; a blow from the front meets a counter draw.",
    values: { time: 0.8, recharge: 7, power: 1 },
  },
  { text: "Stillness 0.8 to 1.1 s.", values: { time: 1.1 } },
  { text: "New: the counter draw stores a cut in every foe ahead.", values: { store: 1.5 } },
  { text: "Recharge 7 to 5.5 s.", values: { recharge: 5.5 } },
  { text: "New: Still Water gives a breath as it starts.", values: { breath: 1 } },
  { text: "New: its counter draw's click is a clean sheathe; draw +50%.", values: { clean: 1, power: 1.5 } },
  { text: "New: foe shots break on her stillness.", values: { ward: 1 } },
  { text: "Stillness 1.1 to 1.5 s; counter draw +150%.", values: { time: 1.5, power: 2.5 } },
]);

export const STILL_WATER: SkillDef = {
  id: SKILL.still,
  name: "Still Water",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "An ability on I: she waits with her hand on the hilt, and the first blow that comes meets a counter draw. Held, it also catches blows from behind.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.shade,
    name: "Mirror Lake",
    text: "Still Water waits up to 3 seconds for its blow and catches blows from behind.",
    row: evolvedRow(LEVELS[7], "Waits up to 3 s; catches blows from behind.", { time: 3, behind: 1 }),
  },
};

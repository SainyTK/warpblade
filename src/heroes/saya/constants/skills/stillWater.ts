import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
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

const DRILL = drillRows(LEVELS, [
  { text: "Still Water stills foes 0.6 s longer.", drill: { freeze: 0.6 } },
  { text: "Still Water +40%.", drill: { power: 0.4 } },
  { text: "New: Still Water restores 6 MP per foe.", drill: { mp: 6 } },
  { text: "Still Water +40% to +90%.", drill: { power: 0.9 } },
  { text: "New: Still Water releases every stored cut.", drill: { release: 1 } },
  { text: "Still Water +90% to +160%.", drill: { power: 1.6 } },
  { text: "New: Still Water stores 1x AP in each foe.", drill: { store: 1 } },
  { text: "Still Water +160% to +320%.", drill: { power: 3.2 } },
]);

export const STILL_WATER: SkillDef = {
  id: SKILL.still,
  name: "Still Water",
  kind: "spell",
  element: "frost",
  risk: "timed",
  button: "I",
  text: "Still Water holds foes longer and hits harder.",
  levels: DRILL,
  evolution: {
    partner: SKILL.shade,
    name: "Mirror Lake",
    text: "Still Water's release is in full and every cut is a sure critical hit.",
    row: evolvedRow(DRILL[7], "Its release is full and sure critical.", {
      ...drillValues({ clean: 1 }),
      time: 3,
      behind: 1,
    }),
  },
};

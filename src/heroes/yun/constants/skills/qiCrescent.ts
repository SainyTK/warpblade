import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` ability power of the wave, `reach` pixels it runs, `tall` multiplies its height, `sword` a foe it cuts gives a spirit sword, once a cast, `twin` a second wave follows, `stun` seconds foes are knocked down, `recharge` seconds */
const LEVELS = levelRows([
  {
    text: "Learn Qi Crescent: a wave of qi from the jian, 14 MP.",
    values: { power: 1.6, reach: 140, tall: 1, recharge: 2.5 },
  },
  { text: "Crescent power 1.6 to 2.", values: { power: 2 } },
  { text: "New: the crescent is twice as tall.", values: { tall: 2 } },
  { text: "Crescent power 2 to 2.5.", values: { power: 2.5 } },
  { text: "New: the first foe it cuts gives a spirit sword.", values: { sword: 1 } },
  { text: "Crescent power 2.5 to 3.", values: { power: 3 } },
  { text: "New: a second crescent follows.", values: { twin: 1 } },
  { text: "New: crescents knock foes down; power 3.5.", values: { stun: 0.6, power: 3.5 } },
]);

export const QI_CRESCENT: SkillDef = {
  id: "yu_crescent",
  name: "Qi Crescent",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Learn Qi Crescent: a wave of qi from the jian, paid with MP, for when your swords are out.",
  levels: LEVELS,
  evolution: {
    partner: "yu_tide",
    name: "Moon Crescent",
    text: "Crescents cross the whole stage.",
    row: evolvedRow(LEVELS[7], "Crescents cross the stage.", { reach: 320 }),
  },
};

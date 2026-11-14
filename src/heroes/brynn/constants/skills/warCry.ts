import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `reach` pixels round her the roar knocks foes back, `heft` Heft it gives, `buff` her damage rises by this
 *  much for `time` seconds, `recharge` seconds, `power` AP the roar deals, `heal` share of max HP back, `stamina`
 *  stamina back a second while it lasts, `armour` she wears her armour the whole time */
const LEVELS = levelRows([
  {
    text: "Learn War Cry: a roar knocks foes back and fills 25 Heft.",
    values: { reach: 60, heft: 25, recharge: 8, buff: 0.1, time: 4 },
  },
  { text: "New: the roar hits 1 AP.", values: { power: 1 } },
  { text: "Her damage +10% to +20% for 4 s after.", values: { buff: 0.2 } },
  { text: "New: the roar heals 8% of her HP.", values: { heal: 0.08 } },
  { text: "Reach 60 to 90 px; 40 Heft.", values: { reach: 90, heft: 40 } },
  {
    text: "New: stamina comes back 25 a second while it lasts; damage +35%.",
    values: { buff: 0.35, time: 6, stamina: 25 },
  },
  { text: "New: she is armoured the whole time.", values: { armour: 1 } },
  { text: "Roar 1 to 4 AP; Heft fills to full.", values: { power: 4, heft: 100 } },
]);

export const WAR_CRY: SkillDef = {
  id: "br_cry",
  name: "War Cry",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "An ability: a roar that knocks foes back, fills Heft and makes her hit harder for a while.",
  levels: LEVELS,
  evolution: {
    partner: "br_bellows",
    name: "Unbroken",
    text: "While the cry lasts every swing is heavy and she takes a third less.",
    row: evolvedRow(LEVELS[7], "Every swing is heavy while it lasts.", { heavy: 1, taken: 0.33 }),
  },
};

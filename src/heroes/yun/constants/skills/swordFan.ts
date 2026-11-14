import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` ability power of each sword's cut, `reach` pixels the fan flies, `extra` swords conjured for each fan besides the ones held, `recharge` seconds, `back` the swords return through foes, `stun` seconds foes cut are knocked down, `around` half the fan flies behind */
const LEVELS = levelRows([
  {
    text: "Learn Sword Fan: your swords fly out in a fan ahead.",
    values: { power: 0.7, reach: 90, extra: 0, recharge: 2 },
  },
  { text: "Fan power 0.7 to 0.9.", values: { power: 0.9 } },
  { text: "New: one more sword is conjured for the fan.", values: { extra: 1 } },
  { text: "Fan power 0.9 to 1.1; recharge 2 s to 1.6 s.", values: { power: 1.1, recharge: 1.6 } },
  { text: "New: the fan's swords cut again on their way back.", values: { back: 1 } },
  { text: "Fan power 1.1 to 1.4.", values: { power: 1.4 } },
  { text: "New: two more swords are conjured.", values: { extra: 2 } },
  { text: "New: foes the fan cuts are knocked down; power 1.7.", values: { stun: 0.5, power: 1.7 } },
]);

export const SWORD_FAN: SkillDef = {
  id: "yu_fan",
  name: "Sword Fan",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Learn Sword Fan: send your spirit swords out in a fan that cuts everything ahead.",
  levels: LEVELS,
  evolution: {
    partner: "yu_guardian",
    name: "Peacock Fan",
    text: "The fan opens all round you, with twice as many conjured swords.",
    row: evolvedRow(LEVELS[7], "A full circle; 4 conjured swords.", { around: 1, extra: 4 }),
  },
};

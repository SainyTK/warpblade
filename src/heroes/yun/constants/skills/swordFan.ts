import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

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

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "Sword Stream cuts for +0.5 AP more.", drill: { bonus: 0.5 } },
  { text: "New: the Stream's cut also strikes foes just behind its target.", drill: { pierce: 1 } },
  { text: "New: the Stream knocks foes back.", drill: { knock: 1 } },
  { text: "Stream bonus 1.2 AP.", drill: { bonus: 1.2 } },
  { text: "New: casting Stream sends 3 more swords at three heights for 0.6 AP.", drill: { fan: 3, swordPower: 0.6 } },
  { text: "Stream bonus 2.2 AP; swords 1.2 AP.", drill: { bonus: 2.2, swordPower: 1.2 } },
  { text: "New: preparation -25%.", drill: { preparation: 0.75 } },
  { text: "Stream bonus 4.5 AP; swords 2.4 AP.", drill: { bonus: 4.5, swordPower: 2.4 } },
]);

export const SWORD_FAN: SkillDef = {
  id: "yu_fan",
  name: "Sword Fan",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Sword Stream cuts harder and fans out into more spirit swords.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_guardian",
    name: "Peacock Fan",
    text: "Every Stream fans out into eight extra swords.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "A full circle; 4 conjured swords.", { around: 1, extra: 4 }),
      "Stream fans eight swords.",
      { peacock: 8 },
    ),
  },
};

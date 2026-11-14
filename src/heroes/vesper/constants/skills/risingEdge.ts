import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `perStack` string damage per Tempo stack, `reach` pixels the long blade reaches farther at the top of Tempo,
 *  `wave` the moonrise's wave in attack damage, `echo` echo cuts' share more, `heavyTop` blows at the top break guards,
 *  `allEcho` (evolved) every blow at the top echoes */
const LEVELS = levelRows([
  { text: "Each Tempo stack adds 2% to your string blows.", values: { perStack: 0.02 } },
  { text: "3% a stack.", values: { perStack: 0.03 } },
  { text: "New: at the top of Tempo the long blade reaches 8 px farther.", values: { reach: 8 } },
  { text: "4% a stack.", values: { perStack: 0.04 } },
  { text: "New: the moonrise sends a dusk wave ahead.", values: { wave: 1.2 } },
  { text: "New: echo cuts hit 50% harder.", values: { echo: 0.5 } },
  { text: "5% a stack; the wave 1.2 to 1.8.", values: { perStack: 0.05, wave: 1.8 } },
  { text: "New: blows at the top of Tempo break guards; 6% a stack.", values: { heavyTop: 1, perStack: 0.06 } },
]);

export const RISING_EDGE: SkillDef = {
  id: "ve_edge",
  name: "Rising Edge",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Your string blows hit harder for every Tempo stack you hold.",
  levels: LEVELS,
  evolution: {
    partner: "ve_rhythm",
    name: "Crescendo",
    text: "At the top of Tempo the long blade's blows echo too, and each stack adds 7%.",
    row: evolvedRow(LEVELS[7], "Long blows echo at the top; 7% a stack.", { allEcho: 1, perStack: 0.07 }),
  },
};

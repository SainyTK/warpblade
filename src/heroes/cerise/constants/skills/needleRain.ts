import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `needles` in a row, `power` AP each, `recharge` seconds, `pin` seconds each pins, `bleed` AP a tick of the
 *  bleed it leaves, `home` needles fall on foes near them, `second` a second rain; evolved, needles fall on marked foes */
const LEVELS = levelRows([
  { text: "I: 5 needles of light fall along your line, 1.2 AP each.", values: { needles: 5, power: 1.2, recharge: 5 } },
  { text: "New: needles pin foes for 0.5 s.", values: { pin: 0.5 } },
  { text: "Needles 5 to 7.", values: { needles: 7 } },
  { text: "New: needles leave a bleed.", values: { bleed: 0.2 } },
  { text: "Needles 1.2 to 2.4 AP.", values: { power: 2.4 } },
  { text: "New: needles fall on the foes nearest them.", values: { home: 1 } },
  { text: "New: a second rain falls a moment later.", values: { second: 1 } },
  { text: "Needles 2.4 to 5 AP.", values: { power: 5 } },
]);

export const NEEDLE_RAIN: SkillDef = {
  id: "ce_needle",
  name: "Needle Rain",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "I: needles of light fall in a row along your line. Held, they fall both ways.",
  levels: LEVELS,
  evolution: {
    partner: "ce_markwarp",
    name: "Starneedle Rain",
    text: "A needle twice as strong also falls on every marked foe.",
    row: evolvedRow(LEVELS[7], "A double needle falls on every marked foe too.", { marked: 1 }),
  },
};

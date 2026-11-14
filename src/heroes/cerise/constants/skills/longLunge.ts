import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` added share of the lunge's power, `reach` px it reaches farther, `guardBreak`, `pin` seconds it
 *  pins, `echo` share of the lunge a petal trail cuts again on its line, `perPoint` AD each Point adds; evolved
 *  `comet` share of the lunge a streak of rose light deals across the whole screen */
const LEVELS = levelRows([
  { text: "The lunge deals +30% damage.", values: { power: 0.3 } },
  { text: "New: the lunge reaches 20 px farther.", values: { reach: 20 } },
  { text: "New: the lunge breaks guards.", values: { guardBreak: 1 } },
  { text: "Lunge damage +30% to +60%.", values: { power: 0.6 } },
  { text: "New: the lunge pins foes for 1.4 s.", values: { pin: 1.4 } },
  { text: "New: petals cut the lunge's line again a moment later.", values: { echo: 0.5 } },
  { text: "New: each Point adds +0.55 AD to the lunge.", values: { perPoint: 0.55 } },
  { text: "Lunge damage +60% to +120%.", values: { power: 1.2 } },
]);

export const LONG_LUNGE: SkillDef = {
  id: "ce_lunge",
  name: "Long Lunge",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The lunge at the end of the string hits harder and reaches farther.",
  levels: LEVELS,
  evolution: {
    partner: "ce_needle",
    name: "Comet Lunge",
    text: "The lunge sends a streak of rose light across the whole screen along its line.",
    row: evolvedRow(LEVELS[7], "A streak of rose light runs the whole screen.", { comet: 1.5 }),
  },
};

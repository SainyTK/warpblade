import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `needles` in a row, `power` AP each, `recharge` seconds, `pin` seconds each pins, `bleed` AP a tick of the
 *  bleed it leaves, `home` needles fall on foes near them, `second` a second rain; evolved, needles fall on marked foes */
const NATIVE = levelRows([
  { text: "I: 5 needles of light fall along your line, 1.2 AP each.", values: { needles: 5, power: 1.2, recharge: 5 } },
  { text: "New: needles pin foes for 0.5 s.", values: { pin: 0.5 } },
  { text: "Needles 5 to 7.", values: { needles: 7 } },
  { text: "New: needles leave a bleed.", values: { bleed: 0.2 } },
  { text: "Needles 1.2 to 2.4 AP.", values: { power: 2.4 } },
  { text: "New: needles fall on the foes nearest them.", values: { home: 1 } },
  { text: "New: a second rain falls a moment later.", values: { second: 1 } },
  { text: "Needles 2.4 to 5 AP.", values: { power: 5 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "Flurry rains 3 needles on its foe, 0.8 AP each.", drill: { needles: 3, power: 0.8 } },
  { text: "New: Flurry staggers 0.3 s longer.", drill: { stagger: 0.3 } },
  { text: "Needles 3 to 5.", drill: { needles: 5 } },
  { text: "Needles 0.8 to 1.4 AP.", drill: { power: 1.4 } },
  { text: "New: needles pin foes for 0.5 s.", drill: { pin: 0.5 } },
  { text: "Needles 1.4 to 2.4 AP.", drill: { power: 2.4 } },
  { text: "New: Rose Edge hits from Flurry rain 2 needles.", drill: { edge: 2 } },
  { text: "Needles 7 at 4 AP.", drill: { needles: 7, power: 4 } },
]);

export const NEEDLE_RAIN: SkillDef = {
  id: "ce_needle",
  name: "Needle Rain",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Flurry calls needles of light down on its foe.",
  levels: LEVELS,
  evolution: {
    partner: "ce_markwarp",
    name: "Starneedle Rain",
    text: "Flurry strikes its foe a second time.",
    row: evolvedRow(LEVELS[7], "Flurry strikes twice.", {
      ...drillValues({ storm: 1 }),
      marked: 1,
    }),
  },
};

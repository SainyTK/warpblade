import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `power` added share of the lunge's power, `reach` px it reaches farther, `guardBreak`, `pin` seconds it
 *  pins, `echo` share of the lunge a petal trail cuts again on its line, `perPoint` AD each Point adds; evolved
 *  `comet` share of the lunge a streak of rose light deals across the whole screen */
const NATIVE = levelRows([
  { text: "The lunge deals +30% damage.", values: { power: 0.3 } },
  { text: "New: the lunge reaches 20 px farther.", values: { reach: 20 } },
  { text: "New: the lunge breaks guards.", values: { guardBreak: 1 } },
  { text: "Lunge damage +30% to +60%.", values: { power: 0.6 } },
  { text: "New: the lunge pins foes for 1.4 s.", values: { pin: 1.4 } },
  { text: "New: petals cut the lunge's line again a moment later.", values: { echo: 0.5 } },
  { text: "New: each Point adds +0.55 AD to the lunge.", values: { perPoint: 0.55 } },
  { text: "Lunge damage +60% to +120%.", values: { power: 1.2 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "The lunge deals +40%.", drill: { power: 0.4 } },
  { text: "New: the lunge pins its foe for 0.6 s.", drill: { pin: 0.6 } },
  { text: "Lunge +40% to +80%.", drill: { power: 0.8 } },
  { text: "New: the lunge sends a Rose Line streak ahead, 1 AD.", drill: { streak: 1 } },
  { text: "New: the lunge staggers.", drill: { stagger: 0.4 } },
  { text: "Lunge +80% to +150%; streak 2 AD.", drill: { power: 1.5, streak: 2 } },
  { text: "New: a second streak runs a little higher.", drill: { twin: 1 } },
  { text: "Lunge +150% to +300%; streaks 4 AD.", drill: { power: 3, streak: 4 } },
]);

export const LONG_LUNGE: SkillDef = {
  id: "ce_lunge",
  name: "Long Lunge",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The lunge that ends the chain hits harder and pins.",
  levels: LEVELS,
  evolution: {
    partner: "ce_needle",
    name: "Comet Lunge",
    text: "A lunge that lands readies the warp strike and the dash.",
    row: evolvedRow(LEVELS[7], "A lunge that lands readies the warp and the dash.", {
      ...drillValues({ comet: 1 }),
      comet: 1.5,
    }),
  },
};

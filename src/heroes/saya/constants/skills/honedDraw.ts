import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
import { SKILL } from "./ids";

/** values: `store` the factor on what draw cuts store, `reach` px they gain, `guard` the return cut breaks guards, `wave` attack
 *  damage of the ink cut a breath draw sends ahead (stored in each foe it meets), `crit` a breath draw is a sure crit */
const LEVELS = levelRows([
  { text: "Draw cuts store +40%.", values: { store: 1.4 } },
  { text: "New: draw cuts reach 8 px farther.", values: { reach: 8 } },
  { text: "New: return cuts break guards too.", values: { guard: 1 } },
  { text: "Draw store +40% to +100%.", values: { store: 2 } },
  { text: "New: a draw with a breath sends an ink cut ahead that stores in each foe.", values: { wave: 1.2 } },
  { text: "Draw store +100% to +160%; reach 8 to 14 px.", values: { store: 2.6, reach: 14 } },
  { text: "New: a draw with a breath is a sure critical hit.", values: { crit: 1 } },
  { text: "Draw store +160% to +300%; the ink cut stores far more.", values: { store: 4, wave: 4 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "The draw cut deals +40% and stores +40%.", drill: { first: 0.4, store: 0.4 } },
  { text: "New: the draw cut staggers the foe.", drill: { stagger: 0.35 } },
  { text: "New: the draw cut sends an ink cut ahead that stores in each foe.", drill: { wave: 0.8 } },
  { text: "Draw cut +40% to +80%.", drill: { first: 0.8, store: 0.8 } },
  { text: "New: the draw cut is a sure critical hit.", drill: { crit: 1 } },
  { text: "Draw cut +80% to +150%; the ink cut doubles.", drill: { first: 1.5, store: 1.5, wave: 1.6 } },
  { text: "New: every slash reaches 15% farther.", drill: { reach: 0.15 } },
  { text: "Draw cut +150% to +300%; the ink cut doubles again.", drill: { first: 3, store: 3, wave: 3.2 } },
]);

export const HONED_DRAW: SkillDef = {
  id: SKILL.edge,
  name: "Honed Draw",
  kind: "attack",
  element: "storm",
  risk: "timed",
  button: "J",
  text: "The draw cut, the first of the chain, hits harder and stores more in the foe.",
  levels: DRILL,
  evolution: {
    partner: SKILL.clean,
    name: "Moonlit Draw",
    text: "Every draw cut sends a second ink cut, higher, and the cuts it stores release at once.",
    row: evolvedRow(DRILL[7], "Every draw: a twin ink cut and an instant release.", {
      ...drillValues({ twin: 1, instant: 1 }),
      waveAlways: 1,
      breathStore: 2,
    }),
  },
};

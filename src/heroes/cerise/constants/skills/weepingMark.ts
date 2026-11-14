import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `dps` AD a second a marked foe bleeds, `taken` added damage it takes from every source, `refresh` her blows on a marked foe renew its mark, `lineMark` Rose Line
 *  marks every foe it cuts, `pass` a marked foe that falls passes the mark to the nearest foe; evolved `spread` share of
 *  the bleed every foe within 30 px of a marked foe takes */
const LEVELS = levelRows([
  { text: "Marked foes bleed 0.4 AD a second.", values: { dps: 0.4 } },
  { text: "New: marked foes take +10% from every source.", values: { taken: 0.1 } },
  { text: "New: your blows keep a mark fresh; bleed 0.9 AD a second.", values: { dps: 0.9, refresh: 1 } },
  { text: "New: Rose Line marks every foe it cuts.", values: { lineMark: 1 } },
  { text: "Bleed 0.9 to 1.6 AD a second.", values: { dps: 1.6 } },
  { text: "New: a marked foe that falls passes its mark on.", values: { pass: 1 } },
  { text: "Marked foes take +10% to +25%.", values: { taken: 0.25 } },
  { text: "Bleed 1.6 to 3.5 AD a second.", values: { dps: 3.5 } },
]);

export const WEEPING_MARK: SkillDef = {
  id: "ce_weep",
  name: "Weeping Mark",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "Foes carrying your Rose mark bleed.",
  levels: LEVELS,
  evolution: {
    partner: "ce_markwarp",
    name: "Crimson Weep",
    text: "A marked foe's bleeding spills onto every foe close to it at half strength.",
    row: evolvedRow(LEVELS[7], "The bleed spills onto foes near it at half.", { spread: 0.5 }),
  },
};

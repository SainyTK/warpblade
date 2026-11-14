import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `halt` seconds a thrust holds a walker's feet, `held` added damage on a held or pinned foe, `behind` the
 *  rising thrust cuts behind too, `reach` px thrusts reach farther, `flurryHalt` Flurry holds feet too; evolved
 *  `pinAll` seconds every thrust pins */
const LEVELS = levelRows([
  { text: "Thrusts hold a walker's feet for 0.4 s.", values: { halt: 0.4 } },
  { text: "New: held and pinned foes take +30% from your blows.", values: { held: 0.3 } },
  { text: "Hold 0.4 to 0.8 s.", values: { halt: 0.8 } },
  { text: "New: the rising thrust also cuts behind you.", values: { behind: 1 } },
  { text: "Held bonus +30% to +80%.", values: { held: 0.8 } },
  { text: "New: thrusts reach 8 px farther.", values: { reach: 8 } },
  { text: "New: Flurry's thrusts hold feet too.", values: { flurryHalt: 1 } },
  { text: "Held bonus +80% to +200%.", values: { held: 2 } },
]);

export const PINNING_POINT: SkillDef = {
  id: "ce_pin",
  name: "Pinning Point",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Thrusts hold foes where they stand, and held foes take more.",
  levels: LEVELS,
  evolution: {
    partner: "ce_thorns",
    name: "Butterfly Pin",
    text: "Every thrust pins its foe in place, and pinned foes take +300%.",
    row: evolvedRow(LEVELS[7], "Every thrust pins; held foes take +300%.", { pinAll: 0.5, held: 3 }),
  },
};

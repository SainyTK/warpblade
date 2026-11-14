import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `perWound` added damage share of the cyclone (and from level 4 the twin turn) for each wound on the foe, `twin` the twin turn counts too, `tear` attack damage each wound deals when the cyclone tears it open, `spread` a foe the cyclone fells passes its wounds on, `splash` share of a tear that cuts the foes beside it, `red` attack damage of the wound every spin's blow tears open once evolved */
const LEVELS = levelRows([
  { text: "The cyclone deals 10% more for each wound on the foe.", values: { perWound: 0.1 } },
  { text: "Per wound 10% to 15%.", values: { perWound: 0.15 } },
  { text: "New: the cyclone tears the wounds open, 0.3 each.", values: { tear: 0.3 } },
  { text: "New: the twin turn also hits harder per wound.", values: { twin: 1 } },
  { text: "Per wound 15% to 22%.", values: { perWound: 0.22 } },
  { text: "New: a foe the cyclone fells passes its wounds to foes beside it.", values: { spread: 1 } },
  {
    text: "New: each wound torn open also cuts the foes beside it for half; tear 0.3 to 0.5.",
    values: { tear: 0.5, splash: 0.5 },
  },
  { text: "Per wound 22% to 45%; tear 0.5 to 1.2.", values: { perWound: 0.45, tear: 1.2 } },
]);

export const OPENED_VEINS: SkillDef = {
  id: "za_veins",
  name: "Opened Veins",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The cyclone hits harder for each wound on the foe, then tears the wounds open.",
  levels: LEVELS,
  evolution: {
    partner: "za_deep",
    name: "Red Wind",
    text: "Every spin tears one wound open on each foe it cuts, for 1.2 times attack damage.",
    row: evolvedRow(LEVELS[7], "Every spin tears one wound open, for 1.2.", { red: 1.2 }),
  },
};

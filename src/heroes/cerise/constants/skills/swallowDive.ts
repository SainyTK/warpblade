import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` added share of the diving thrust, level 2 adds an air thrust before it, `land` AD of the landing cut
 *  on both sides, `pin` seconds the dive pins, `points` a dive that strikes gives, `ring` px the landing reaches
 *  farther; evolved `lines` Rose Lines the landing sends each way, at `linePower` AP */
const LEVELS = levelRows([
  { text: "The diving thrust deals +60% damage.", values: { power: 0.6 } },
  { text: "New: an air thrust before the dive.", values: { air: 1 } },
  { text: "New: the landing cuts both sides for 1.2 AD.", values: { land: 1.2 } },
  { text: "Dive damage +60% to +150%.", values: { power: 1.5 } },
  { text: "New: the dive pins its foe for 1.2 s.", values: { pin: 1.2 } },
  { text: "New: a dive that strikes gives a Point.", values: { points: 1 } },
  { text: "New: the landing cut reaches 16 px farther.", values: { ring: 16 } },
  { text: "Dive damage +150% to +400%; landing 1.2 to 3 AD.", values: { power: 4, land: 3 } },
]);

export const SWALLOW_DIVE: SkillDef = {
  id: "ce_dive",
  name: "Swallow Dive",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "The diving thrust hits harder, and the landing cuts.",
  levels: LEVELS,
  evolution: {
    partner: "ce_step",
    name: "Swallow Storm",
    text: "The dive's landing sends a Rose Line each way along the floor.",
    row: evolvedRow(LEVELS[7], "The landing sends a Rose Line each way.", { lines: 1, linePower: 1.5 }),
  },
};

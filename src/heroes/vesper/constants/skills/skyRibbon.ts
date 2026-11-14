import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `airBonus` air blows' damage more, `lift` an airborne foe she strikes keeps rising this fast, `waves` the
 *  nightfall's floor waves in attack damage, `feather` a feather at the top of Tempo in attack damage, `diveBonus` the
 *  nightfall's damage more, `ribbon` (evolved) the ribbon in attack damage */
const LEVELS = levelRows([
  { text: "Air blows deal 20% more.", values: { airBonus: 0.2 } },
  { text: "30% more.", values: { airBonus: 0.3 } },
  { text: "New: foes you strike in the air keep rising.", values: { lift: 70 } },
  { text: "40% more.", values: { airBonus: 0.4 } },
  { text: "New: the nightfall's landing sends a wave along the floor each way.", values: { waves: 1 } },
  { text: "New: air blows at the top of Tempo throw a dusk feather at one more foe.", values: { feather: 0.6 } },
  { text: "55% more; waves 1 to 1.6.", values: { airBonus: 0.55, waves: 1.6 } },
  { text: "New: the nightfall hits 50% harder.", values: { diveBonus: 0.5 } },
]);

export const SKY_RIBBON: SkillDef = {
  id: "ve_sky",
  name: "Sky Ribbon",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Your air string hits harder and keeps foes up longer.",
  levels: LEVELS,
  evolution: {
    partner: "ve_ascend",
    name: "Heaven's Ribbon",
    text: "Every air blow sends a ribbon of night both ways that cuts every foe on its line.",
    row: evolvedRow(LEVELS[7], "Every air blow sends ribbons both ways.", { ribbon: 0.8 }),
  },
};

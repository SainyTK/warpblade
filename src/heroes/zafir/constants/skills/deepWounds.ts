import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `per` attack damage each wound bleeds a tick, `every` seconds between ticks, `most` wounds a foe can carry, `life` seconds wounds stay open, `spread` a foe that dies bleeding passes half its wounds on, `blows` added damage share of his own blows on a bleeding foe, `tide` wounds stay open while the ring turns */
const LEVELS = levelRows([
  { text: "Wounds bleed 50% harder.", values: { per: 0.15 } },
  { text: "Bleed 0.15 to 0.2.", values: { per: 0.2 } },
  { text: "New: foes carry up to 7 wounds.", values: { most: 7 } },
  { text: "New: wounds stay open 5 s.", values: { life: 5 } },
  { text: "Bleed 0.2 to 0.28.", values: { per: 0.28 } },
  { text: "New: a foe that dies bleeding opens half its wounds on foes beside it.", values: { spread: 1 } },
  { text: "New: your blows deal 15% more to a bleeding foe.", values: { blows: 0.15 } },
  { text: "Bleed 0.28 to 0.32; up to 9 wounds.", values: { per: 0.32, most: 9 } },
]);

export const DEEP_WOUNDS: SkillDef = {
  id: "za_deep",
  name: "Deep Wounds",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Your wounds bleed harder, go deeper and stay open longer.",
  levels: LEVELS,
  evolution: {
    partner: "za_veins",
    name: "Crimson Tide",
    text: "Wounds bleed twice as often and never close while the sand ring turns.",
    row: evolvedRow(LEVELS[7], "Wounds bleed twice as often and stay open while the ring turns.", {
      every: 0.5,
      tide: 1,
    }),
  },
};

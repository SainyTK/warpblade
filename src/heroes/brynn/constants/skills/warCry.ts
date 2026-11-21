import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    {
      text: "Every arrival readies the selected spell at once.",
      values: { reach: 60, heft: 25, recharge: 8, buff: 0.1, time: 4 },
    },
    { text: "New: the roar hits 1 AP.", values: { power: 1 } },
    { text: "Her damage +10% to +20% for 4 s after.", values: { buff: 0.2 } },
    { text: "New: the roar heals 8% of her HP.", values: { heal: 0.08 } },
    { text: "Reach 60 to 90 px; 40 Heft.", values: { reach: 90, heft: 40 } },
    {
      text: "New: stamina comes back 25 a second while it lasts; damage +35%.",
      values: { buff: 0.35, time: 6, stamina: 25 },
    },
    { text: "New: she is armoured the whole time.", values: { armour: 1 } },
    { text: "Roar 1 to 4 AP; Heft fills to full.", values: { power: 4, heft: 100 } },
  ],
  [
    { text: "A warp arrival infuses the blade with the selected spell for 1 hit.", drill: { hits: 1 } },
    { text: "New: spells prepare 15% faster.", drill: { prepare: 0.85 } },
    { text: "New: infusions last one hit longer.", drill: { infusion: 1 } },
    { text: "Spells prepare 25% faster.", drill: { prepare: 0.75 } },
    { text: "New: an arrival takes 1 s off a preparation.", drill: { hasten: 1 } },
    { text: "The arrival infuses for 2 hits.", drill: { hits: 2 } },
    { text: "Spells prepare 40% faster.", drill: { prepare: 0.6 } },
    { text: "Infusions last two hits longer; the arrival takes 2 s off.", drill: { infusion: 2, hasten: 2 } },
  ],
);

export const WAR_CRY: SkillDef = {
  id: "br_cry",
  name: "War Cry",
  kind: "movement",
  risk: "easy",
  button: "J",
  text: "A warp arrival roars and pours the selected spell into the blade.",
  levels: LEVELS,
  evolution: {
    partner: "br_bellows",
    name: "Battle Roar",
    text: "While the cry lasts every swing is Keen and she takes a third less.",
    row: evolvedRow(LEVELS[7], "Every arrival readies the selected spell.", {
      ...drillValues({ ready: 1 }),
      heavy: 1,
      taken: 0.33,
    }),
  },
};

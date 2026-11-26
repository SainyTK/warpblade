import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "Her armour takes 10% more off each blow.", values: { armour: 0.1 }, stats: { hp: 10 } },
    {
      text: "Every dash leaves a shock ring where it started.",
      values: { stamina: 15 },
      stats: { hp: 20 },
    },
    { text: "New: a block costs 25% less stamina.", values: { block: 0.25 } },
    { text: "Armour takes 10% to 20% more.", values: { armour: 0.2 } },
    { text: "New: each blow her armour takes gives 10 Heft.", values: { heft: 10 } },
    { text: "New: each blow her armour takes gives 4 MP; max HP +40.", values: { mp: 4 }, stats: { hp: 40 } },
    { text: "Armour takes 20% to 35% more.", values: { armour: 0.35 } },
    { text: "Max HP +40 to +60; a block costs 40% less.", values: { block: 0.4 }, stats: { hp: 60 } },
  ],
  [
    { text: "Untouchable while dashing.", drill: { inv: 0.05 } },
    { text: "New: untouchable 0.1 s after a dash.", drill: { inv: 0.1 } },
    { text: "New: one more air dash.", drill: { airDashes: 1 } },
    { text: "Untouchable 0.1 to 0.2 s after a dash.", drill: { inv: 0.2 } },
    { text: "New: untouchable 0.4 s after a warp arrival.", drill: { warp: 0.4 } },
    { text: "New: two more air dashes.", drill: { airDashes: 2 } },
    { text: "New: an air dash gives back the air slash.", drill: { refresh: 1 } },
    { text: "Untouchable 0.2 to 0.4 s after a dash.", drill: { inv: 0.4 } },
  ],
);

export const IRON_SKIN: SkillDef = {
  id: "br_ironskin",
  name: "Iron Skin",
  kind: "movement",
  element: "frost",
  risk: "easy",
  button: "L",
  text: "Her dash and air dash cannot be hurt, and she gets more air dashes.",
  levels: LEVELS,
  evolution: {
    partner: "br_cry",
    name: "Living Anvil",
    text: "While Heft is at half or more she wears her armour at all times.",
    row: evolvedRow(LEVELS[7], "Every dash leaves a shock ring.", {
      ...drillValues({ ring: 1.5 }),
      living: 1,
    }),
  },
};

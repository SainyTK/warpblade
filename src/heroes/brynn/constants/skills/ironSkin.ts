import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `armour` her armour takes this much more off a blow, `block` a block costs this share less stamina, `heft`
 *  and `mp` each blow her armour takes gives this much Heft and MP, `stamina` stamina back a second while armoured,
 *  `living` she wears her armour at all times while Heft is at half */
const LEVELS = levelRows([
  { text: "Her armour takes 10% more off each blow.", values: { armour: 0.1 }, stats: { hp: 10 } },
  {
    text: "New: while armoured, stamina comes back 15 a second; max HP +20.",
    values: { stamina: 15 },
    stats: { hp: 20 },
  },
  { text: "New: a block costs 25% less stamina.", values: { block: 0.25 } },
  { text: "Armour takes 10% to 20% more.", values: { armour: 0.2 } },
  { text: "New: each blow her armour takes gives 10 Heft.", values: { heft: 10 } },
  { text: "New: each blow her armour takes gives 4 MP; max HP +40.", values: { mp: 4 }, stats: { hp: 40 } },
  { text: "Armour takes 20% to 35% more.", values: { armour: 0.35 } },
  { text: "Max HP +40 to +60; a block costs 40% less.", values: { block: 0.4 }, stats: { hp: 60 } },
]);

export const IRON_SKIN: SkillDef = {
  id: "br_ironskin",
  name: "Iron Skin",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "Her armour stops more of each blow, and she stands longer.",
  levels: LEVELS,
  evolution: {
    partner: "br_cry",
    name: "Living Anvil",
    text: "While Heft is at half or more she wears her armour at all times.",
    row: evolvedRow(LEVELS[7], "Armour at all times from half Heft.", { living: 1 }),
  },
};

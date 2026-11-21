import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { power: 1.3, top: 1 } },
  { values: { cooldown: 15, charge: 1.3 } },
  { values: { cuts: 2, power: 1.45 } },
  { values: { power: 1.8 } },
  { values: { launch: 1 } },
  { values: { finale: 0.6 } },
  { values: { untouch: 2 } },
  { values: { power: 2.6, cuts: 4, finale: 0.9 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Charged tiers deal 30% more.", drill: { damage: 1.3 } },
  { text: "New: each tier's afterimage dances 1 cut on every foe in reach.", drill: { cuts: 1 } },
  { text: "Charges 25% faster.", drill: { charge: 1.25 } },
  { text: "New: tiers reach 20% farther.", drill: { reach: 1.2 } },
  { text: "Tiers +80%; 2 dancing cuts.", drill: { damage: 1.8, cuts: 2 } },
  { text: "New: a tier draws foes in before it strikes.", drill: { pull: 3 } },
  { text: "Charges 50% faster; reach 40% farther.", drill: { charge: 1.5, reach: 1.4 } },
  { text: "Tiers +250%; 3 dancing cuts.", drill: { damage: 3.5, cuts: 3 } },
]);

export const DUSK_WALTZ: SkillDef = {
  id: "ve_waltz",
  name: "Dusk Waltz",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: "Dusk Waltz, the four charged tiers, grows: harder, faster to charge, with more dancing cuts.",
  levels: LEVELS,
  evolution: {
    partner: "ve_rhythm",
    name: "Endless Waltz",
    text: "Every charged tier dances a second time half a second later at 60%.",
    row: evolvedRow(LEVELS[7], "Each tier dances twice.", { twice: 1, ...drillValues({ again: 0.6 }) }),
  },
};

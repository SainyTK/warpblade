import { PACT } from "../../../../constants/vitals";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { stats: { hp: 10 } },
  { values: { pdTempo: 3 } },
  { stats: { hp: 20, move: 0.1 } },
  { values: { heal: 4 } },
  { stats: { hp: 30, move: 0.1, stamina: 20 } },
  { values: { guard: 0.1 } },
  { values: { heal: 8 } },
  { values: { guard: 0.15 }, stats: { hp: 45, move: 0.1, stamina: 20 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "+10 HP; you cannot be touched while dashing.", drill: { inv: 0.18 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "+20 HP and 10% faster; New: an air dash restores the air cuts.", drill: { refresh: 1 } },
  { text: "New: a dash leaves a dusk shade that cuts for 0.6 AD.", drill: { shade: 0.6 } },
  { text: "+30 HP and +20 stamina; shade 1.1 AD.", drill: { shade: 1.1 } },
  { text: "Shade 1.8 AD.", drill: { shade: 1.8 } },
  { text: "New: two more air dashes.", drill: { airDashes: 2 } },
  { text: "+45 HP; shade 3.6 AD.", drill: { shade: 3.6 } },
]);

export const WANDERERS_GRACE: SkillDef = {
  id: "ve_grace",
  name: "Wanderer's Grace",
  kind: "movement",
  element: "frost",
  risk: "easy",
  button: "L",
  pact: PACT.mending,
  text: "Untouchable while dashing, with more air dashes and a dusk shade left behind.",
  levels: LEVELS,
  evolution: {
    partner: "ve_twin",
    name: "Dusk Ward",
    text: "The dusk shade cuts twice and twice as wide.",
    row: evolvedRow(LEVELS[7], "Shades cut twice, twice as wide.", {}),
  },
};

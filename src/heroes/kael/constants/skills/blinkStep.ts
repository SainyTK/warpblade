import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { power: 1.8 } },
  { values: { keep: 1 } },
  { values: { power: 2.8 } },
  { values: { keen: 1 } },
  { values: { lock: 1.2 } },
  { values: { recharge: 1.2 } },
  { values: { after: 1.2 } },
  { values: { power: 7, lock: 2 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Kael is untouchable while dashing.", drill: { inv: 0.05 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "New: an air dash restores the air slash.", drill: { refresh: 1 } },
  { text: "New: a cut flashes where each dash began, 0.6 AD.", drill: { after: 0.6 } },
  { text: "Afterimage cut 0.6 to 1.2 AD.", drill: { after: 1.2 } },
  { text: "New: a third air dash.", drill: { airDashes: 2 } },
  { text: "Untouchable a moment longer after each dash.", drill: { inv: 0.12 } },
  { text: "Afterimage cut 1.2 to 3 AD.", drill: { after: 3 } },
]);

export const BLINK_STEP: SkillDef = {
  id: "k_blink",
  name: "Blink Step",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Dashes make Kael untouchable and leave a cutting afterimage, and he gains air dashes.",
  levels: LEVELS,
  evolution: {
    partner: "k_echo",
    name: "Shadow Step",
    text: "Each afterimage cuts twice and reaches twice as far.",
    row: evolvedRow(LEVELS[7], "Afterimages cut twice, twice as wide.", {
      ...drillValues({ shadow: 48 }),
      shadow: 1,
    }),
  },
};

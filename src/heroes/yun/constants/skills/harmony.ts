import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `bonus` extra damage while it holds, `heal` HP a second while it holds, `short` it holds with one sword short, `guard` share less damage taken while it holds, `tide` Returning Tide gives a sword even when it misses */
const LEVELS = levelRows([
  { text: "With every sword held, deal 8% more damage.", values: { bonus: 0.08 } },
  { text: "Bonus 8% to 12%.", values: { bonus: 0.12 } },
  { text: "New: with every sword held, recover 1 HP a second.", values: { heal: 1 } },
  { text: "Bonus 12% to 16%.", values: { bonus: 0.16 } },
  { text: "New: Harmony holds with one sword short.", values: { short: 1 } },
  { text: "Bonus 16% to 20%.", values: { bonus: 0.2 } },
  { text: "New: take 15% less damage while it holds.", values: { guard: 0.15 } },
  { text: "New: Returning Tide gives a sword even when it misses; bonus 25%.", values: { tide: 1, bonus: 0.25 } },
]);

export const HARMONY: SkillDef = {
  id: "yu_harmony",
  name: "Harmony",
  kind: "passive",
  risk: "timed",
  button: "auto",
  text: "With every spirit sword held you deal more damage, heal and take less.",
  levels: LEVELS,
  evolution: {
    partner: "yu_breath",
    name: "Perfect Harmony",
    text: "Harmony deals 40% more damage and heals 3 HP a second.",
    row: evolvedRow(LEVELS[7], "Bonus 40%; 3 HP a second.", { bonus: 0.4, heal: 3 }),
  },
};

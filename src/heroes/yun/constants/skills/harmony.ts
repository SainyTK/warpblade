import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

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

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "A warp arrival fills the jian with the selected art for 1 hit.", drill: { infuse: 1 } },
  { text: "Spell cooldowns -20%.", drill: { preparation: 0.8 } },
  { text: "New: infusions last 1 more hit.", drill: { infusionHits: 1 } },
  { text: "Spell cooldowns -30%.", drill: { preparation: 0.7 } },
  { text: "New: an arrival takes 1 s off every spell cooldown.", drill: { shorten: 1 } },
  { text: "Spell cooldowns -40%; arrivals fill 2 hits.", drill: { preparation: 0.6, infuse: 2 } },
  { text: "New: infusions last 2 more hits.", drill: { infusionHits: 2 } },
  { text: "Spell cooldowns -50%; arrivals fill 3 hits.", drill: { preparation: 0.5, infuse: 3 } },
]);

export const HARMONY: SkillDef = {
  id: "yu_harmony",
  name: "Harmony",
  kind: "movement",
  element: "void",
  risk: "timed",
  button: "L",
  text: "The warp and the sword arts move as one: arrivals fill the jian, and art cooldowns are shorter.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_breath",
    name: "Perfect Harmony",
    text: "Every arrival readies the selected sword art at once.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Bonus 40%; 3 HP a second.", { bonus: 0.4, heal: 3 }),
      "Every arrival readies the art.",
      {},
    ),
  },
};

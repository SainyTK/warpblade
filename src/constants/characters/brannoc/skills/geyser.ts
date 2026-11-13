import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "8% HP: a pillar under the nearest foe within 120 px, 1x AP.",
    values: { hp: 0.08, cooldown: 6, ap: 1, ad: 0.4, pillars: 1, width: 12, mark: 0, repay: 0, fountain: 0 },
  },
  { text: "A second pillar.", values: { pillars: 2 } },
  { text: "1.4x AP.", values: { ap: 1.4 } },
  { text: "The pillars are wider.", values: { width: 18 } },
  { text: "Struck foes are marked: +15% for 4 s.", values: { mark: 0.15 } },
  { text: "1.8x AP.", values: { ap: 1.8 } },
  { text: "Each foe struck repays the debt.", values: { repay: 1 } },
  { text: "2.4x AP; 0.6x AD.", values: { ap: 2.4, ad: 0.6 } },
]);

/** Blood Geyser. Design: docs/skills/brannoc.md. Values: hp: share of max HP it costs; cooldown: seconds; ap: ability power each pillar deals; ad: attack damage each pillar adds; pillars: pillars; width: pixels across each pillar; mark: extra damage struck foes take from all sources for 4 s; repay: 1 each foe struck repays the debt; fountain: 1 each foe struck repays twice (evolution) */
export const BLOOD_GEYSER: SkillDef = {
  id: "b_geyser",
  name: "Blood Geyser",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "A spell on I paid in HP: a pillar of blood erupts under the nearest foe and throws it up.",
  levels: LEVELS,
  evolution: {
    partner: "b_pact",
    name: "Blood Fountain",
    text: "Three pillars, and each foe they strike repays the debt twice.",
    row: evolvedRow(LEVELS[7], "Three pillars; each foe repays twice.", { fountain: 1, pillars: 3 }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "20% HP: 5 s of +25% crit, and crits repay double.",
    values: { hp: 0.2, cooldown: 14, time: 5, crit: 0.25, first: 0, fury: 0, noFade: 0, oath: 0 },
  },
  { text: "The first Bloodied blow in it is a sure crit, 2x.", values: { first: 2 } },
  { text: "+35% crit.", values: { crit: 0.35 } },
  { text: "It lasts 7 s.", values: { time: 7 } },
  { text: "Fury +0.1 in it.", values: { fury: 0.1 } },
  { text: "+45% crit.", values: { crit: 0.45 } },
  { text: "The debt does not fade in it.", values: { noFade: 1 } },
  { text: "+60% crit; the first Bloodied blow 3x.", values: { crit: 0.6, first: 3 } },
]);

/** Blood Pact. Design: docs/skills/brannoc.md. Values: hp: share of max HP it costs; cooldown: seconds; time: seconds it lasts; crit: chance his blows crit in it; first: the first Bloodied blow in it is a sure crit for this many times its damage (0 for none); fury: Fury added in it; noFade: 1 the debt does not fade in it; oath: 1 every kill in it extends it 1 s (evolution) */
export const BLOOD_PACT: SkillDef = {
  id: "b_pact",
  name: "Blood Pact",
  kind: "spell",
  risk: "precise",
  button: "I",
  text: "A spell on I paid in HP: for a few seconds his blows crit more, and crits win back double.",
  levels: LEVELS,
  evolution: {
    partner: "b_executioner",
    name: "Oathbound",
    text: "Every kill in the pact makes it last 1 s longer.",
    row: evolvedRow(LEVELS[7], "Every kill extends the pact 1 s.", { oath: 1 }),
  },
};

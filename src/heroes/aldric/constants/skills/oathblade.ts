import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` multiplies every blow of the ground string, `wave` attack damage of a wave of light thrown by Crest breaker, `waveAll` every blow of the string throws one, `pierce` waves pass through foes, `behind` Oath cut also cuts behind him */
const LEVELS = levelRows([
  { text: "String blows +15%.", values: { power: 1.15 } },
  { text: "String blows +25%.", values: { power: 1.25 } },
  { text: "New: Crest breaker throws a wave of light.", values: { wave: 0.6 } },
  { text: "New: Oath cut also cuts behind you.", values: { behind: 1 } },
  { text: "String blows +40%.", values: { power: 1.4 } },
  { text: "New: every blow of the string throws a wave.", values: { waveAll: 1 } },
  { text: "New: waves pass through foes.", values: { pierce: 1 } },
  { text: "String blows +80%; waves hit twice as hard.", values: { power: 1.8, wave: 1.2 } },
]);

export const OATHBLADE: SkillDef = {
  id: "al_oath",
  name: "Oathblade",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The sword string hits harder, Crest breaker throws a wave of light, and later every blow does.",
  levels: LEVELS,
  evolution: {
    partner: "al_resolve",
    name: "Sunblade",
    text: "Every blow of the string throws a great wave of light that passes through every foe.",
    row: evolvedRow(LEVELS[7], "Great piercing waves on every blow.", { wave: 1.6, size: 1.6 }),
  },
};

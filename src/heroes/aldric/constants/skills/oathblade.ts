import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, onDrill } from "./drillLevels";

/** values: `power` multiplies every blow of the ground string, `wave` attack damage of a wave of light thrown by Crest breaker, `waveAll` every blow of the string throws one, `pierce` waves pass through foes, `behind` Oath cut also cuts behind him */
const NATIVE = levelRows([
  { text: "String blows +15%.", values: { power: 1.15 } },
  { text: "String blows +25%.", values: { power: 1.25 } },
  { text: "New: Crest breaker throws a wave of light.", values: { wave: 0.6 } },
  { text: "New: Oath cut also cuts behind you.", values: { behind: 1 } },
  { text: "String blows +40%.", values: { power: 1.4 } },
  { text: "New: every blow of the string throws a wave.", values: { waveAll: 1 } },
  { text: "New: waves pass through foes.", values: { pierce: 1 } },
  { text: "String blows +80%; waves hit twice as hard.", values: { power: 1.8, wave: 1.2 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "Oath cut adds a light cut of 0.5 attack.", drill: { extra: 0.5 } },
  { text: "New: Oath cut also cuts the foes behind you.", drill: { behind: 1 } },
  { text: "New: Oath cut throws a wave of light ahead.", drill: { wave: 0.6 } },
  { text: "Light cut 0.5 to 1 attack.", drill: { extra: 1 } },
  { text: "New: the wave passes through every foe.", drill: { pierce: 1 } },
  { text: "Light cut 1 to 1.6; the wave twice as hard.", drill: { extra: 1.6, wave: 1.2 } },
  { text: "New: Oath cut staggers the foes it cuts.", drill: { stagger: 0.35 } },
  { text: "Light cut 1.6 to 4; the wave 2.5 times as hard.", drill: { extra: 4, wave: 3 } },
]);

export const OATHBLADE: SkillDef = {
  id: "al_oath",
  name: "Oathblade",
  kind: "attack",
  element: "void",
  risk: "easy",
  button: "J",
  text: "Oath cut, the first blow of the chain, adds a cut of light and later throws waves.",
  levels: LEVELS,
  evolution: {
    partner: "al_resolve",
    name: "Sunblade",
    text: "Every blow of the chain throws a great wave of light that passes through every foe.",
    row: evolvedRow(LEVELS[7], "Every blow of the chain throws a piercing wave.", {
      ...drillValues({ all: 1 }),
      wave: 1.6,
      size: 1.6,
    }),
  },
};

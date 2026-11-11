import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Accents deal 30% more to the first foe.",
    values: { power: 0.3, crit: 0, stagger: 0, ring: 0, guard: 0, stun: 0, thunderclap: 0 },
  },
  { text: "Accents crit 15% of the time.", values: { crit: 0.15 } },
  { text: "Accents deal 60% more.", values: { power: 0.6 } },
  { text: "Accents stagger 0.3 s longer.", values: { stagger: 0.3 } },
  { text: "An Accent rings out 20 px onto the foes round it.", values: { ring: 20 } },
  { text: "Accents break guards; 100% more.", values: { guard: 1, power: 1 } },
  { text: "An accented Crash stuns for 0.8 s.", values: { stun: 0.8 } },
  { text: "Accents deal 150% more.", values: { power: 1.5 } },
]);

/** Heavy Accent. Design: docs/skills/jory.md. Values: power: share more an Accent deals to the first foe; crit: chance an Accent is a sure crit; stagger: seconds more an Accent staggers; ring: pixels of the ring an Accent sends onto the foes round its first; guard: 1 an Accent breaks a guard; stun: seconds an accented Crash stuns its first foe; thunderclap: 1 an Accent on a downbeat is a sure crit and splits a 50 px ring (evolution) */
export const HEAVY_ACCENT: SkillDef = {
  id: "j_accent",
  name: "Heavy Accent",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "His Accents, blows started on the beat, hit the first foe they reach much harder.",
  levels: LEVELS,
  evolution: {
    partner: "j_metronome",
    name: "Thunderclap",
    text: "An Accent on a bar's downbeat is a sure crit and splits a 50 px thunderclap ring.",
    row: evolvedRow(LEVELS[7], "A downbeat Accent crits and splits a 50 px ring.", { thunderclap: 1, power: 1.8 }),
  },
};

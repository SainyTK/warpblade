import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "14 MP: tune a foe for 8 beats; Accents on it add 0.6x.",
    values: { mp: 14, cooldown: 6, beats: 8, ap: 0.6, bonus: 0, count: 1, slow: 0, perfect: 0 },
  },
  { text: "Accents on it add 0.9x.", values: { ap: 0.9 } },
  { text: "Tuned foes take 10% more.", values: { bonus: 0.1 } },
  { text: "1.3x.", values: { ap: 1.3 } },
  { text: "Tunes two foes.", values: { count: 2 } },
  { text: "A tuned foe is slowed for 1.5 s.", values: { slow: 1.5 } },
  { text: "1.8x; tuned foes take 20% more.", values: { ap: 1.8, bonus: 0.2 } },
  { text: "2.5x; 12 beats.", values: { ap: 2.5, beats: 12 } },
]);

/** Tuning Fork. Design: docs/skills/jory.md. Values: mp: MP; cooldown: seconds; beats: beats a foe stays tuned; ap: ability power each Accent on it adds; bonus: share more it takes from every source; count: foes tuned; slow: seconds a foe is slowed when tuned; perfect: 1 a tuned foe shatters for 4x ability power after four Accents (evolution) */
export const TUNING_FORK: SkillDef = {
  id: "j_tuning",
  name: "Tuning Fork",
  kind: "spell",
  risk: "precise",
  button: "I",
  text: "A spell on I: on the beat it tunes the nearest foe, and each on-beat blow on it deals bonus ability power. Off the beat it tunes for half as long, at half.",
  levels: LEVELS,
  evolution: {
    partner: "j_rimshot",
    name: "Perfect Pitch",
    text: "A tuned foe shatters for a heavy hit after four Accents.",
    row: evolvedRow(LEVELS[7], "Four Accents shatter a tuned foe, 4x.", { perfect: 1 }),
  },
};

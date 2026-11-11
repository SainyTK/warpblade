import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Drumroll rings 25% wider with cymbal crashes; Crescendo held 8 beats.",
    values: { wider: 0.25, power: 1.2, cymbal: 0.3, lock: 8, encore: 0 },
  },
  { text: "Rings deal 1.5x; cymbals 45%.", values: { power: 1.5, cymbal: 0.45 } },
  { text: "Rings 40% wider.", values: { wider: 0.4 } },
  { text: "Rings deal 2x; cymbals 60%.", values: { power: 2, cymbal: 0.6 } },
  { text: "Crescendo held 12 beats.", values: { lock: 12 } },
  { text: "Rings deal 2.6x; cymbals 80%.", values: { power: 2.6, cymbal: 0.8 } },
  { text: "Rings 55% wider.", values: { wider: 0.55 } },
  { text: "Rings deal 3.5x; cymbals 110%; held 16 beats.", values: { power: 3.5, cymbal: 1.1, lock: 16 } },
]);

/** Grand Finale. Design: docs/skills/jory.md. Values: wider: share wider the rings are; power: a multiple on each ring's damage; cymbal: share of a ring's damage each cymbal crash adds; lock: beats Crescendo is held after it; encore: 1 the roll lasts 12 beats and every ring knocks down (evolution) */
export const GRAND_FINALE: SkillDef = {
  id: "j_finale",
  name: "Grand Finale",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Replaces Drumroll: wider rings, a cymbal crash on every foe each ring reaches, and Crescendo held after it.",
  ultimate: "grandFinale",
  levels: LEVELS,
  evolution: {
    partner: "j_encore",
    name: "Encore of Thunder",
    text: "The roll lasts 12 beats, and every ring knocks foes down.",
    row: evolvedRow(LEVELS[7], "12 beats; every ring knocks down.", { encore: 1, power: 5 }),
  },
};

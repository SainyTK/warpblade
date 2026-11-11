import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Drumroll rings 25% wider with cymbal crashes; Crescendo held 8 beats.",
    values: { wider: 0.25, power: 1.2, cymbal: 0.3, lock: 8, stun: 0, pull: 0, extra: 0, refund: 0, encore: 0 },
  },
  { text: "Rings deal 1.5x; cymbals 45%.", values: { power: 1.5, cymbal: 0.45 } },
  { text: "Each ring stuns minions 0.4 s.", values: { stun: 0.4 } },
  { text: "Rings deal 2x; cymbals 60%; 40% wider.", values: { power: 2, cymbal: 0.6, wider: 0.4 } },
  { text: "Each ring pulls foes 8 px in.", values: { pull: 8 } },
  { text: "Rings deal 2.6x; cymbals 80%; held 12 beats.", values: { power: 2.6, cymbal: 0.8, lock: 12 } },
  { text: "One more beat in the roll.", values: { extra: 1 } },
  {
    text: "25 MP back after it; 3.5x; cymbals 110%; held 16 beats.",
    values: { refund: 25, power: 3.5, cymbal: 1.1, lock: 16 },
  },
]);

/** Grand Finale. Design: docs/skills/jory.md. Values: wider: share wider the rings are; power: a multiple on each ring's damage; cymbal: share of a ring's damage each cymbal crash adds; lock: beats Crescendo is held after it; stun: seconds each ring stuns minions; pull: pixels each ring pulls foes in; extra: beats added to the roll; refund: MP given back when the roll ends; encore: 1 the roll lasts 12 beats and every ring knocks down (evolution) */
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

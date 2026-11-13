import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Drumroll's rings strike 30% harder and drop a cymbal crash on each foe they reach.",
    values: { power: 1.3, cymbal: 0.3, wider: 0, pull: 0, lock: 0, stun: 0, extra: 0, refund: 0, encore: 0 },
  },
  { text: "Rings reach 25% wider.", values: { wider: 0.25 } },
  { text: "Each ring pulls minions 8 px in.", values: { pull: 8 } },
  { text: "Rings deal 2x; cymbals 50%.", values: { power: 2, cymbal: 0.5 } },
  { text: "After it, Crescendo is held for 8 beats.", values: { lock: 8 } },
  { text: "Each ring stuns minions 0.4 s.", values: { stun: 0.4 } },
  { text: "One more beat in the roll; 2.5x.", values: { extra: 1, power: 2.5 } },
  {
    text: "3x; cymbals 70%; Crescendo held 12 beats; 25 MP back.",
    values: { power: 3, cymbal: 0.7, lock: 12, refund: 25 },
  },
]);

/** Drumroll. Design: docs/skills/jory.md. Values: power: a multiple on each ring's damage; cymbal: share of a ring's damage each cymbal crash adds; wider: share wider the rings are; pull: pixels each ring pulls minions in; lock: beats Crescendo is held after it; stun: seconds each ring stuns minions; extra: beats added to the roll; refund: MP given back when the roll ends; encore: 1 the roll plays twice as many beats and every ring knocks down (evolution) */
export const DRUMROLL_SKILL: SkillDef = {
  id: "j_drumroll",
  name: "Drumroll",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Upgrades Drumroll: cymbal crashes on every foe a ring reaches, wider rings that pull, and Crescendo held after it.",
  levels: LEVELS,
  evolution: {
    partner: "j_encore",
    name: "Encore of Thunder",
    text: "The roll plays twice as many beats, and every ring knocks foes down.",
    row: evolvedRow(LEVELS[7], "Twice the beats; every ring knocks down.", { encore: 1, power: 3.8 }),
  },
};

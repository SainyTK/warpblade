import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` ability power of each cut, `life` seconds the pit lasts, `recharge` seconds, `reach` its width multiple, `mark` share more damage foes in it take, `sink` seconds each cut knocks them down, `wounds` wounds each cut opens, `spout` ability power of the sandspout the Sinking Sea throws up on each cut */
const LEVELS = levelRows([
  {
    text: "Learn Quicksand: a pit ahead holds walkers and pulls them in.",
    values: { power: 0.35, life: 2, recharge: 5 },
  },
  { text: "Power 0.35 to 0.5; it lasts 2.5 s.", values: { power: 0.5, life: 2.5 } },
  { text: "New: the pit is a third wider.", values: { reach: 1.33 } },
  { text: "New: foes in the pit take 15% more from everything.", values: { mark: 0.15 } },
  { text: "Power 0.5 to 0.7; it lasts 3 s.", values: { power: 0.7, life: 3 } },
  { text: "New: each cut pulls foes under for a moment.", values: { sink: 0.3 } },
  { text: "New: each cut opens a wound.", values: { wounds: 1 } },
  { text: "Power 0.7 to 1.5; foes in it take 25% more.", values: { power: 1.5, mark: 0.25 } },
]);

export const QUICKSAND_SKILL: SkillDef = {
  id: "za_quicksand",
  name: "Quicksand",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Learn Quicksand on I: a pit opens ahead that holds walkers, pulls them in and cuts them. Held, under your own feet and wider.",
  levels: LEVELS,
  evolution: {
    partner: "za_falling",
    name: "Sinking Sea",
    text: "Each cut of the pit throws a sandspout up out of its middle.",
    row: evolvedRow(LEVELS[7], "Each cut throws up a sandspout.", { spout: 0.6 }),
  },
};

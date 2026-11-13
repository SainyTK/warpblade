import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "+80% on a minion or mini boss under 30% HP.",
    values: { power: 0.8, under: 0.3, killRepay: 0, elites: 0, cull: 0, headsman: 0 },
  },
  { text: "Under 35% HP.", values: { under: 0.35 } },
  { text: "120% more.", values: { power: 1.2 } },
  { text: "A kill it makes repays 10% of max HP.", values: { killRepay: 0.1 } },
  { text: "160% more.", values: { power: 1.6 } },
  { text: "It works on elites.", values: { elites: 1 } },
  { text: "Minions under 15% HP die outright.", values: { cull: 0.15 } },
  { text: "240% more.", values: { power: 2.4 } },
]);

/** Executioner. Design: docs/skills/brannoc.md. Values: power: share more a blow deals to its first foe when that foe is under the threshold; under: the HP share under which a foe counts as wounded; killRepay: share of max HP a kill it makes repays; elites: 1 it works on elites; cull: minions under this HP share die outright; headsman: 1 Cleave fells minions and elites under 20% outright and deals 3x to mini bosses under 30% (evolution) */
export const EXECUTIONER: SkillDef = {
  id: "b_executioner",
  name: "Executioner",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "His blows deal a large bonus to a wounded foe.",
  levels: LEVELS,
  evolution: {
    partner: "b_bleed",
    name: "Headsman",
    text: "Cleave fells minions and elites under 20% HP outright, and deals 3x to mini bosses under 30%.",
    row: evolvedRow(LEVELS[7], "Cleave fells foes under 20%; 3x on mini bosses.", { headsman: 1 }),
  },
};

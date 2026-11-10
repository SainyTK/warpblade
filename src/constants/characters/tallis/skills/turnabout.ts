import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Heel Kick turns a minion round 25% of the time.",
    values: { chance: 0.25, hold: 0, elites: 0, daze: 0, stagger: 0, power: 0, pirouette: 0 },
  },
  { text: "A turned foe cannot turn back for 0.5 s.", values: { hold: 0.5 } },
  { text: "It turns a minion round 50% of the time; 20% more.", values: { chance: 0.5, power: 0.2 } },
  { text: "It always turns a minion round.", values: { chance: 1 } },
  { text: "It turns elites round too.", values: { elites: 1 } },
  { text: "Turned foes stand dazed 0.4 s.", values: { daze: 0.4 } },
  { text: "Heel Kick staggers foes 0.5 s; 40% more.", values: { power: 0.4, stagger: 0.5 } },
  { text: "Heel Kick deals 80% more.", values: { power: 0.8 } },
]);

/** Turnabout. Design: docs/skills/tallis.md. Values: chance: share of minions a Heel Kick turns round; hold: seconds a turned foe cannot turn back; stagger: seconds Heel Kick staggers; elites: 1 it turns elites too; daze: seconds a turned foe stands dazed; power: share more Heel Kick deals; pirouette: 1 Heel Kick turns every foe within 30 px and dazes them 1 s (evolution) */
export const TURNABOUT: SkillDef = {
  id: "t_turnabout",
  name: "Turnabout",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Heel Kick spins the foe it strikes round, its back to him.",
  levels: LEVELS,
  evolution: {
    partner: "t_sink",
    name: "Pirouette",
    text: "Heel Kick turns every foe within 30 px round and dazes them for 1 s.",
    row: evolvedRow(LEVELS[7], "Heel Kick turns all near foes round.", { pirouette: 1, daze: 1 }),
  },
};

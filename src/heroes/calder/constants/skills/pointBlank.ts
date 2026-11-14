import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` added share of the counter shot, `rounds` more rounds a parry loads, `mark` damage taken for 4 s, `pierce` foes behind the target take the plain shot, `dodge` a perfect dodge fires the counter shot, `free` the next Trigger after a parry spends no round, `fill` a parry fills the chamber hot */
const LEVELS = levelRows([
  { text: "The counter shot deals +150%.", values: { power: 1.5 } },
  { text: "New: a parry loads one more round.", values: { rounds: 1 } },
  { text: "New: the struck foe takes +15% from everything for 4 s.", values: { mark: 0.15 } },
  { text: "Counter shot +150% to +400%.", values: { power: 4 } },
  { text: "New: the shot pierces to the foes behind.", values: { pierce: 1 } },
  { text: "New: a perfect dodge fires the counter shot too.", values: { dodge: 1 } },
  { text: "New: the next Trigger after a parry spends no round.", values: { free: 1 } },
  { text: "Counter shot +400% to +1600%.", values: { power: 16 } },
]);

export const POINT_BLANK: SkillDef = {
  id: "ca_pointblank",
  name: "Point Blank",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "The parry's counter shot hits far harder.",
  levels: LEVELS,
  evolution: {
    partner: "ca_trigger",
    name: "Deadeye",
    text: "A parry fills the chamber with hot rounds, and the counter shot hits half again as hard.",
    row: evolvedRow(LEVELS[7], "A parry fills the chamber hot; the shot hits harder.", { fill: 1, power: 24 }),
  },
};

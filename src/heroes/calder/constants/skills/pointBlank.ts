import { PACT } from "../../../../constants/vitals";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { withDrill } from "./drillLevels";

/** values: `power` added share of the counter shot, `rounds` more rounds a parry loads, `mark` damage taken for 4 s, `stagger` seconds the shot staggers longer, `dodge` a perfect dodge fires the counter shot, `free` the next Trigger after a parry spends no round, `fill` a parry fills the chamber */
const LEVELS = levelRows([
  { text: "The counter shot deals +150%.", values: { power: 1.5 } },
  { text: "New: a parry loads one more round.", values: { rounds: 1 } },
  { text: "New: the struck foe takes +15% from everything for 4 s.", values: { mark: 0.15 } },
  { text: "Counter shot +150% to +400%.", values: { power: 4 } },
  { text: "New: the struck foe reels 0.6 s longer.", values: { stagger: 0.6 } },
  { text: "New: a perfect dodge fires the counter shot too.", values: { dodge: 1 } },
  { text: "New: the next Trigger after a parry spends no round.", values: { free: 1 } },
  { text: "Counter shot +400% to +1600%.", values: { power: 16 } },
]);

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "Parry window +30%.", drill: { window: 0.3 } },
  { text: "New: a parry fires a heavy counter round at the attacker.", drill: { counter: 1.5 } },
  { text: "New: a block fires a light round back.", drill: { block: 0.5 } },
  { text: "Parry window +60%; counter 3 AD.", drill: { window: 0.6, counter: 3 } },
  { text: "New: the counter staggers for 1 s.", drill: { stagger: 1 } },
  { text: "Counter 3 to 6 AD.", drill: { counter: 6 } },
  { text: "New: the counter round is hot.", drill: { hot: 1 } },
  { text: "Counter 6 to 12 AD.", drill: { counter: 12 } },
]);

export const POINT_BLANK: SkillDef = {
  id: "ca_pointblank",
  name: "Point Blank",
  kind: "attack",
  element: "storm",
  risk: "precise",
  button: "K",
  pact: PACT.blood,
  text: "A wider parry, and a parry answers with a heavy round.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_trigger",
    name: "Deadeye",
    text: "A parry's counter also fires into every foe in a line ahead.",
    row: evolvedRow(DRILL_LEVELS[7], "Counters fire down the whole line.", {
      fill: 1,
      power: 24,
    }),
  },
};

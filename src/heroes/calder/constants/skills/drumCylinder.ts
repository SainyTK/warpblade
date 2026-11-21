import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { withDrill } from "./drillLevels";

/** values: `rounds` more rounds a full chamber holds, `reload` the reload runs this much faster, `killLoad` chance a kill loads a round, `full` added damage of string blows while the chamber is full, `parry` more rounds a parry loads, `freeEvery` every this many rounds fired, one is free */
const LEVELS = levelRows([
  { text: "The chamber holds one more round.", values: { rounds: 1 } },
  { text: "New: reload 15% faster.", values: { reload: 0.15 } },
  { text: "The chamber holds two more rounds.", values: { rounds: 2 } },
  { text: "New: a kill may load a round.", values: { killLoad: 0.25 } },
  { text: "The chamber holds three more rounds.", values: { rounds: 3 } },
  { text: "New: string blows hit 15% harder while the chamber is full.", values: { full: 0.15 } },
  { text: "New: a parry loads one more round.", values: { parry: 1 } },
  { text: "The chamber holds four more rounds.", values: { rounds: 4 } },
]);

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "One more air dash.", drill: { airDashes: 1 } },
  { text: "New: untouchable while dashing.", drill: { inv: 1 } },
  { text: "New: an air dash restores the air cut.", drill: { airCut: 1 } },
  { text: "Two more air dashes.", drill: { airDashes: 2 } },
  { text: "New: a dash leaves a live round where it began.", drill: { mine: 0.6 } },
  { text: "Round 0.6 to 1.2 AD.", drill: { mine: 1.2 } },
  { text: "Three more air dashes.", drill: { airDashes: 3 } },
  { text: "Round 1.2 to 3 AD.", drill: { mine: 3 } },
]);

export const DRUM_CYLINDER: SkillDef = {
  id: "ca_drum",
  name: "Drum Cylinder",
  kind: "movement",
  risk: "easy",
  button: "L",
  text: "More air dashes, and dashes that leave rounds behind.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_speedload",
    name: "Bottomless Drum",
    text: "Every dash recharges the warp strike.",
    row: evolvedRow(DRILL_LEVELS[7], "Every dash recharges the warp.", {
      freeEvery: 6,
    }),
  },
};

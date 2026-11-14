import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

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

export const DRUM_CYLINDER: SkillDef = {
  id: "ca_drum",
  name: "Drum Cylinder",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "A bigger cylinder: more rounds in the chamber.",
  levels: LEVELS,
  evolution: {
    partner: "ca_speedload",
    name: "Bottomless Drum",
    text: "Every sixth round fired comes back to the chamber.",
    row: evolvedRow(LEVELS[7], "Every sixth round comes back.", { freeEvery: 6 }),
  },
};

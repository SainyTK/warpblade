import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `air` added damage share of the descent, `ringReach` reach multiple of the landing ring, `descents` descents per jump, `ringLaunch` the landing ring throws foes up this fast, `ringWounds` wounds the ring opens, `ringPower` its power multiple, `meteor` the landing raises a sandspout each way and a pit of quicksand */
const LEVELS = levelRows([
  { text: "The spinning descent deals 25% more.", values: { air: 0.25 } },
  { text: "Descent +25% to +45%.", values: { air: 0.45 } },
  { text: "New: the landing ring reaches half again as far.", values: { ringReach: 1.5 } },
  { text: "New: two descents per jump.", values: { descents: 2 } },
  { text: "Descent +45% to +70%.", values: { air: 0.7 } },
  { text: "New: the landing ring throws foes up.", values: { ringLaunch: 220 } },
  { text: "New: the landing ring opens two wounds.", values: { ringWounds: 2 } },
  { text: "Descent +70% to +90%; the ring hits half again as hard.", values: { air: 0.9, ringPower: 1.5 } },
]);

export const FALLING_DUNE: SkillDef = {
  id: "za_falling",
  name: "Falling Dune",
  kind: "attack",
  risk: "timed",
  button: "jump",
  text: "The spinning descent hits harder and lands in a wider ring that throws foes up.",
  levels: LEVELS,
  evolution: {
    partner: "za_quicksand",
    name: "Meteor Dune",
    text: "The landing throws up a sandspout each way and leaves a pit of quicksand under you.",
    row: evolvedRow(LEVELS[7], "Landing: a spout each way and quicksand.", { meteor: 1 }),
  },
};

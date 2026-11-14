import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `time` seconds of the stance, `recharge` seconds, `bonus` added damage of its ripostes, `around` blows from
 *  behind are taken too, `points` more Points when it takes a blow, `line` it sends a Rose Line when it does */
const LEVELS = levelRows([
  { text: "I: for 0.4 s blows from the front are parried for you.", values: { time: 0.4, recharge: 6 } },
  { text: "New: its ripostes deal +100% damage.", values: { bonus: 1 } },
  { text: "Stance 0.4 to 0.7 s.", values: { time: 0.7 } },
  { text: "New: blows from behind are parried too.", values: { around: 1 } },
  { text: "New: a parry in the stance gives 2 more Points.", values: { points: 2 } },
  { text: "Recharge 6 to 4 s.", values: { recharge: 4 } },
  { text: "New: a parry in the stance sends a Rose Line.", values: { line: 1 } },
  { text: "Riposte bonus +100% to +400%.", values: { bonus: 4 } },
]);

export const MIRROR_GUARD: SkillDef = {
  id: "ce_mirrorguard",
  name: "Mirror Guard",
  kind: "spell",
  risk: "precise",
  button: "I",
  text: "I: a short stance that parries the next blow for you and answers with a riposte.",
  levels: LEVELS,
  evolution: {
    partner: "ce_riposte",
    name: "Perfect Mirror",
    text: "The stance lasts 1.2 s and its ripostes deal +800%.",
    row: evolvedRow(LEVELS[7], "Stance 1.2 s; ripostes +800%.", { time: 1.2, bonus: 8 }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Sink lasts 0.3 s longer.",
    values: { longer: 0.3, pass: 0, rising: 0, sinks: 1, cheaper: 0, power: 0, tide: 0 },
  },
  { text: "Foes the pool passes under take 0.4x.", values: { pass: 0.4 } },
  { text: "Rising Cut deals 50% more.", values: { rising: 0.5 } },
  { text: "Two Sinks before the wait.", values: { sinks: 2 } },
  { text: "Sink spends 30% less stamina.", values: { cheaper: 0.3 } },
  { text: "Sink lasts 0.5 s longer.", values: { longer: 0.5 } },
  { text: "Foes the pool passes under take 0.7x.", values: { pass: 0.7 } },
  { text: "The pool and Rising Cut deal 60% more.", values: { power: 0.6 } },
]);

/** Deep Shadow. Design: docs/skills/tallis.md. Values: longer: seconds more a Sink may last; pass: attack damage foes the pool passes under take, once each per Sink; rising: share more Rising Cut deals; sinks: Sinks before the wait; cheaper: share less stamina a Sink spends; power: share more the pool's cut and Rising Cut deal; tide: 1 the first foe he rises behind is dragged down and stunned 1 s (evolution) */
export const DEEP_SHADOW: SkillDef = {
  id: "t_sink",
  name: "Deep Shadow",
  kind: "movement",
  risk: "timed",
  button: "I",
  text: "His shadow pool lasts longer and cuts the foes it passes under.",
  levels: LEVELS,
  evolution: {
    partner: "t_ambush",
    name: "Shadow Tide",
    text: "The first foe he rises behind is dragged down into the pool and stunned for 1 s.",
    row: evolvedRow(LEVELS[7], "The foe he rises behind is dragged down.", { tide: 1 }),
  },
};

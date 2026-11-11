import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "An accented Crash marks foes, 0.12x a beat a stack.",
    values: { ap: 0.12, max: 6, start: 1, any: 0, cacophony: 0 },
  },
  { text: "0.17x.", values: { ap: 0.17 } },
  { text: "An accented Crash lays two stacks.", values: { start: 2 } },
  { text: "0.24x.", values: { ap: 0.24 } },
  { text: "Up to 10 stacks.", values: { max: 10 } },
  { text: "Any Accent marks.", values: { any: 1 } },
  { text: "0.34x.", values: { ap: 0.34 } },
  { text: "0.48x; up to 12 stacks.", values: { ap: 0.48, max: 12 } },
]);

/** Dissonance. Design: docs/skills/jory.md. Values: ap: ability power each stack deals on each beat; max: most stacks; start: stacks an accented Crash lays; any: 1 any Accent marks; cacophony: 1 at 8 stacks it bursts for the stacks consumed (evolution) */
export const DISSONANCE: SkillDef = {
  id: "j_dissonance",
  name: "Dissonance",
  kind: "dot",
  risk: "precise",
  button: "J",
  text: "An accented Crash marks foes with Dissonance, which grows with each Accent on them and hurts on each beat. An off-beat press halves it.",
  levels: LEVELS,
  evolution: {
    partner: "j_accent",
    name: "Cacophony",
    text: "At 8 stacks the Dissonance bursts for the stacks it held.",
    row: evolvedRow(LEVELS[7], "At 8 stacks it bursts.", { cacophony: 1 }),
  },
};

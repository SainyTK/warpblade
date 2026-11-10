import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  { text: "The Veil drains 25% slower.", values: { drain: 0.25, walk: 0, free: 0, prints: 0, phantom: 0 } },
  { text: "He walks 10% faster veiled.", values: { walk: 0.1 } },
  { text: "The Veil drains 30% slower.", values: { drain: 0.3 } },
  { text: "The first Veil of each wave is free.", values: { free: 1 } },
  { text: "Veiled footprints chill foes that cross them.", values: { prints: 1 } },
  { text: "He walks 20% faster veiled.", values: { walk: 0.2 } },
  { text: "The Veil drains 40% slower.", values: { drain: 0.4 } },
  { text: "The Veil drains 50% slower.", values: { drain: 0.5 } },
]);

/** Quiet Step. Design: docs/skills/tallis.md. Values: drain: share less Gloam the Veil drains; walk: share faster he walks veiled, on top of the Veil's own; free: 1 the first Veil of each wave costs nothing; prints: 1 his veiled footprints chill foes that cross them; phantom: 1 walking veiled leaves smoke that blinds foes 1 s (evolution) */
export const QUIET_STEP: SkillDef = {
  id: "t_quietStep",
  name: "Quiet Step",
  kind: "movement",
  risk: "easy",
  button: "auto",
  text: "His Veil drains slower and he walks faster in it.",
  levels: LEVELS,
  evolution: {
    partner: "t_smokeKnot",
    name: "Phantom Walk",
    text: "Walking veiled leaves a thin trail of smoke that blinds the foes in it for 1 s.",
    row: evolvedRow(LEVELS[7], "His veiled trail blinds foes.", { phantom: 1 }),
  },
};

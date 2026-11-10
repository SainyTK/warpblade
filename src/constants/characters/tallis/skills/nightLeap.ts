import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "One more jump in the air while veiled or just after a rise.",
    values: { leaps: 1, keep: 0, rise: 40, drop: 0, window: 0.5, raven: 0 },
  },
  { text: "The leap rises higher.", values: { rise: 50 } },
  { text: "The leap keeps the Veil.", values: { keep: 1 } },
  { text: "The leap rises higher still.", values: { rise: 58 } },
  { text: "Drop Stab after a leap deals 40% more.", values: { drop: 0.4 } },
  { text: "The leap stays open 0.8 s after a rise.", values: { window: 0.8 } },
  { text: "Drop Stab after a leap deals 60% more.", values: { drop: 0.6 } },
  { text: "Two extra jumps.", values: { leaps: 2 } },
]);

/** Night Leap. Design: docs/skills/tallis.md. Values: leaps: jumps in the air; keep: 1 the leap keeps the Veil; rise: pixels the leap rises; drop: share more a Drop Stab after a leap deals; window: seconds after a rise the leap stays open; raven: 1 every Drop Stab after a leap is an Ambush (evolution) */
export const NIGHT_LEAP: SkillDef = {
  id: "t_nightLeap",
  name: "Night Leap",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "He can jump again in the air while veiled or just after a rise.",
  levels: LEVELS,
  evolution: {
    partner: "t_plunge",
    name: "Raven Drop",
    text: "Every Drop Stab after a Night Leap lands as an Ambush.",
    row: evolvedRow(LEVELS[7], "Drop Stab after a leap is an Ambush.", { raven: 1 }),
  },
};

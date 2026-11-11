import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "He walks 4% faster for each Groove tier.",
    values: { walk: 0.04, bump: 0, hold: 0, footfall: 0, parade: 0 },
  },
  { text: "6% a tier.", values: { walk: 0.06 } },
  { text: "Walking into a minion on the beat bumps it back.", values: { bump: 1 } },
  { text: "8% a tier.", values: { walk: 0.08 } },
  { text: "Silence costs no Groove while he runs.", values: { hold: 1 } },
  { text: "Walking stamps a ring on each downbeat, 0.4x.", values: { footfall: 0.4 } },
  { text: "10% a tier.", values: { walk: 0.1 } },
  { text: "Footfalls deal 0.8x.", values: { footfall: 0.8 } },
]);

/** War March. Design: docs/skills/jory.md. Values: walk: share faster he walks for each Groove tier; bump: 1 walking into a minion on a beat bumps it back; hold: 1 silence costs no Groove while he runs; footfall: attack damage of a 30 px ring on each downbeat while he walks; parade: 1 walking at Crescendo stamps a 40 px ring every beat (evolution) */
export const WAR_MARCH: SkillDef = {
  id: "j_march",
  name: "War March",
  kind: "movement",
  risk: "easy",
  button: "auto",
  text: "He walks faster for each Groove tier.",
  levels: LEVELS,
  evolution: {
    partner: "j_drumCorps",
    name: "Parade",
    text: "Walking at Crescendo stamps a 40 px ring on every beat.",
    row: evolvedRow(LEVELS[7], "At Crescendo, a 40 px ring every beat.", { parade: 1 }),
  },
};

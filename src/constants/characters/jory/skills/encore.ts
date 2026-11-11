import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  { text: "An off-beat press costs 2 Groove.", values: { cost: 2 } },
  { text: "His beat window is 0.02 s wider.", values: { window: 0.016 } },
  { text: "A blow taken costs 3 Groove.", values: { hurt: 3 } },
  { text: "Silence costs Groove only after 6 beats.", values: { silence: 6 } },
  { text: "The window is 0.04 s wider.", values: { window: 0.032 } },
  { text: "A blow taken costs 2 Groove.", values: { hurt: 2 } },
  { text: "At Crescendo one blow every 10 s costs nothing.", values: { shrug: 1 } },
  { text: "An off-beat press costs 1 Groove.", values: { cost: 1 } },
]);

/** Encore. Design: docs/skills/jory.md. Values: cost: Groove an off-beat press costs; window: game seconds wider his beat window is; hurt: Groove a blow taken costs; silence: beats of silence before Groove falls; shrug: 1 at Crescendo one blow every 10 s costs no Groove; ovation: 1 every 8th on-beat press heals 2% of his HP (evolution) */
export const ENCORE: SkillDef = {
  id: "j_encore",
  name: "Encore",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "Missing the beat costs him less.",
  levels: LEVELS,
  evolution: {
    partner: "j_dissonance",
    name: "Standing Ovation",
    text: "Every 8th on-beat press heals 2% of his HP.",
    row: evolvedRow(LEVELS[7], "Every 8th on-beat press heals 2%.", { ovation: 1 }),
  },
};

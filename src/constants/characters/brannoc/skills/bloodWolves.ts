import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "15%: a kill calls a red wolf that lunges, 0.8x.",
    values: { chance: 0.15, power: 0.8, count: 1, bleed: 0, stay: 0, cooldown: 0.6, pack: 0 },
  },
  { text: "Two wolves.", values: { count: 2 } },
  { text: "1.1x.", values: { power: 1.1 } },
  { text: "Bites bleed.", values: { bleed: 1 } },
  { text: "30% chance.", values: { chance: 0.3 } },
  { text: "1.5x.", values: { power: 1.5 } },
  { text: "Wolves stay 3 s and bite again.", values: { stay: 3 } },
  { text: "2x.", values: { power: 2 } },
]);

/** Blood Wolves. Design: docs/skills/brannoc.md. Values: chance: chance a kill calls wolves; power: attack damage each bite deals; count: wolves called; bleed: 1 bites bleed; stay: seconds wolves stay and bite again (0 for one bite); cooldown: seconds between calls; pack: 1 every kill while Bloodied calls a wolf (evolution) */
export const BLOOD_WOLVES: SkillDef = {
  id: "b_wolves",
  name: "Blood Wolves",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A kill may call a red wolf spirit that lunges at the nearest foe.",
  levels: LEVELS,
  evolution: {
    partner: "b_ravens",
    name: "Blood Pack",
    text: "Every kill while he is Bloodied calls a wolf.",
    row: evolvedRow(LEVELS[7], "Every Bloodied kill calls a wolf.", { pack: 1 }),
  },
};

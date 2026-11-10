import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Mark the nearest foe 4 s: every hit on it is from behind.",
    values: { mp: 20, cooldown: 8, life: 4, pass: 0, gloam: 1, marks: 1, taken: 0, sentence: 0 },
  },
  { text: "Recharges in 6 s.", values: { cooldown: 6 } },
  { text: "The mark passes on when its foe dies.", values: { pass: 1 } },
  { text: "Marks last 6 s.", values: { life: 6 } },
  { text: "Blows on a marked foe give double Gloam.", values: { gloam: 2 } },
  { text: "Two foes are marked.", values: { marks: 2 } },
  { text: "Marked foes take 20% more.", values: { taken: 0.2 } },
  { text: "Marked foes take 40% more.", values: { taken: 0.4 } },
]);

/** Mark of Dusk. Design: docs/skills/tallis.md. Values: mp: MP; cooldown: seconds; life: seconds a mark lasts; pass: 1 the mark passes to the nearest foe when its foe dies; gloam: Gloam his blows on a marked foe give, times; marks: foes marked at once; taken: share more a marked foe takes; sentence: 1 a marked foe under 30% HP dies at once, a mini boss takes 3x (evolution) */
export const MARK_OF_DUSK: SkillDef = {
  id: "t_markDusk",
  name: "Mark of Dusk",
  kind: "spell",
  risk: "precise",
  button: "I",
  text: "A spell on I: marks the nearest foe so every hit on it counts as from behind.",
  levels: LEVELS,
  evolution: {
    partner: "t_backbiter",
    name: "Death Sentence",
    text: "A marked foe that falls under 30% HP dies at once; a mini boss takes 3x instead.",
    row: evolvedRow(LEVELS[7], "Marked foes under 30% HP die.", { sentence: 1 }),
  },
};

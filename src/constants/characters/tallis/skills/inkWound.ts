import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "An Ambush leaves Ink, 0.2x a second for 3 s.",
    values: { damage: 0.2, life: 3, spread: 0, still: 0, back: 0, spreading: 0 },
  },
  { text: "Ink lasts 5 s.", values: { life: 5 } },
  { text: "Ink spreads when its foe dies.", values: { spread: 1 } },
  { text: "Inked foes cannot turn.", values: { still: 1 } },
  { text: "Ink deals 0.3x.", values: { damage: 0.3 } },
  { text: "Ink deals 0.4x.", values: { damage: 0.4 } },
  { text: "Ink deals 0.5x.", values: { damage: 0.5 } },
  { text: "Inked foes take 20% more from behind.", values: { back: 0.2 } },
]);

/** Ink Wound. Design: docs/skills/tallis.md. Values: damage: attack damage Ink deals a second; life: seconds; spread: 1 Ink passes to the nearest foe when its foe dies; still: 1 Inked foes cannot turn; back: share more an Inked foe takes from behind; spreading: 1 an Ambush Inks every foe within 60 px (evolution) */
export const INK_WOUND: SkillDef = {
  id: "t_inkWound",
  name: "Ink Wound",
  kind: "dot",
  risk: "precise",
  button: "J",
  text: "An Ambush leaves Ink in its foe's wound.",
  levels: LEVELS,
  evolution: {
    partner: "t_ambush",
    name: "Spreading Night",
    text: "An Ambush Inks every foe within 60 px.",
    row: evolvedRow(LEVELS[7], "An Ambush Inks every near foe.", { spreading: 1 }),
  },
};

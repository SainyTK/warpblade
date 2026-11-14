import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `damage` ability power a wound deals each tick per stack, `max` stacks, `ult` Jade Rain lays wounds too, `duration` seconds the wounds last, `every` seconds between ticks, `burst` when a lotus ends, foes take this share of their wounds' remaining damage at once */
const LEVELS = levelRows([
  { text: "Ability cuts leave bleeding wounds.", values: { damage: 0.05, max: 4, duration: 3, every: 0.5 } },
  { text: "Wound damage 0.05 to 0.07.", values: { damage: 0.07 } },
  { text: "New: wounds stack to 8.", values: { max: 8 } },
  { text: "Wound damage 0.07 to 0.09.", values: { damage: 0.09 } },
  { text: "New: Jade Rain lays wounds too.", values: { ult: 1 } },
  { text: "Wound damage 0.09 to 0.12.", values: { damage: 0.12 } },
  { text: "New: wounds last twice as long.", values: { duration: 6 } },
  { text: "New: wounds bleed twice as fast; damage 0.14.", values: { every: 0.25, damage: 0.14 } },
]);

export const THOUSAND_CUTS: SkillDef = {
  id: "yu_bleed",
  name: "Thousand Cuts",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "Your abilities' cuts leave bleeding wounds.",
  levels: LEVELS,
  evolution: {
    partner: "yu_crescent",
    name: "Thousand Petals",
    text: "When a Sword Lotus ends, every wounded foe takes all its wounds at once.",
    row: evolvedRow(LEVELS[7], "Lotus end: wounds strike at once.", { burst: 1 }),
  },
};

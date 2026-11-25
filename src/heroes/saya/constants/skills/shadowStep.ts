import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
import { SKILL } from "./ids";

/** values: `store` attack damage stored in each foe the dodge passes through, `sheathe` the dodge's end is a sheathe,
 *  `perfect` breaths a perfect dodge gives, `air` a dodge in the air, `mark` the damage-taken mark on foes passed for
 *  3 s, `twice` foes passed are cut twice */
const LEVELS = levelRows([
  { text: "Dodging through a foe stores a cut in it.", values: { store: 1 } },
  { text: "Stored cut +50%.", values: { store: 1.5 } },
  { text: "New: the dodge ends in a sheathe that releases every stored cut.", values: { sheathe: 1 } },
  { text: "New: a perfect dodge gives two breaths.", values: { perfect: 2 } },
  { text: "Stored cut +50% to +150%.", values: { store: 2.5 } },
  { text: "New: a dodge in the air.", values: { air: 1 } },
  { text: "New: foes dodged through take +20% damage for 3 s.", values: { mark: 0.2 } },
  { text: "Stored cut +150% to +300%.", values: { store: 4 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "Untouchable while dashing.", drill: { inv: 0.16 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "New: the air dash restores the air slash.", drill: { refresh: 1 } },
  { text: "New: an afterimage cuts where the dash began for 1x AD.", drill: { after: 1 } },
  { text: "Afterimage 1x to 2x AD.", drill: { after: 2 } },
  { text: "New: a third air dash.", drill: { airDashes: 2 } },
  { text: "New: the afterimage stores its cut too.", drill: { afterStore: 1 } },
  { text: "Afterimage 2x to 5x AD.", drill: { after: 5 } },
]);

export const SHADOW_STEP: SkillDef = {
  id: SKILL.step,
  name: "Shadow Step",
  kind: "movement",
  element: "void",
  risk: "timed",
  button: "L",
  text: "She cannot be hit while dashing, and gains air dashes and an afterimage cut.",
  levels: DRILL,
  evolution: {
    partner: SKILL.pass,
    name: "Ghost Passage",
    text: "Afterimages cut twice, twice as wide.",
    row: evolvedRow(DRILL[7], "Afterimages cut twice, twice as wide.", {
      ...drillValues({ shadow: 48 }),
      twice: 1,
    }),
  },
};

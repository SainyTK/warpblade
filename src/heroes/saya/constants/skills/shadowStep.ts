import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
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

export const SHADOW_STEP: SkillDef = {
  id: SKILL.step,
  name: "Shadow Step",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "L: dodge through foes to store a cut in each, then sheathe as you stop.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.pass,
    name: "Ghost Passage",
    text: "Every foe the dodge passes through is cut twice, and the dodge's sheathe is clean.",
    row: evolvedRow(LEVELS[7], "Foes dodged through are cut twice; the sheathe is clean.", { twice: 1 }),
  },
};

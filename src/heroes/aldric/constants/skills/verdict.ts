import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` attack damage of the sword of light, `swords` how many fall, `mark` extra damage the foe takes for 3 s, `counter` a Counterbash calls it too, `keen` seconds added to the Keen moment */
const LEVELS = levelRows([
  { text: "A Keen blow calls a sword of light on its foe.", values: { power: 1.5, swords: 1 } },
  { text: "Sword of light 1.5 to 2.5.", values: { power: 2.5 } },
  { text: "New: the foe takes 15% more for 3 s.", values: { mark: 0.15 } },
  { text: "New: a Counterbash calls it too.", values: { counter: 1 } },
  { text: "Sword of light 2.5 to 5.", values: { power: 5 } },
  { text: "New: two swords fall.", values: { swords: 2 } },
  { text: "New: the Keen moment is 0.05 s longer.", values: { keen: 0.05 } },
  { text: "Sword of light 5 to 12.", values: { power: 12 } },
]);

export const VERDICT: SkillDef = {
  id: "al_verdict",
  name: "Verdict",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "A Keen blow calls a sword of light down on the foe it struck.",
  levels: LEVELS,
  evolution: {
    partner: "al_lance",
    name: "Final Verdict",
    text: "Each sword of light lands with a pillar of dawn that strikes the foes around it.",
    row: evolvedRow(LEVELS[7], "Each sword lands with a pillar.", { pillar: 1.6 }),
  },
};

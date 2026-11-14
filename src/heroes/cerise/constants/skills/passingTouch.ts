import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `thrust` AD of the thrust that ends the dodge, `pass` AD to each foe she passes through, `perfectPoints`
 *  Points a perfect dodge gives, `keen` the thrust is a sure crit after a perfect dodge, `stamina` given back per foe
 *  passed, `pin` seconds the thrust holds its foe; evolved `petals` AD a tick of the petal ring left where it began */
const LEVELS = levelRows([
  { text: "The dodge ends in a thrust ahead for 1.2 AD.", values: { thrust: 1.2 } },
  { text: "New: foes you dodge through are cut for 0.6 AD.", values: { pass: 0.6 } },
  { text: "New: a perfect dodge gives 2 Points.", values: { perfectPoints: 2 } },
  { text: "Thrust 1.2 to 2.5 AD.", values: { thrust: 2.5 } },
  { text: "New: after a perfect dodge the thrust is Keen.", values: { keen: 1 } },
  { text: "New: each foe you pass gives 10 stamina back.", values: { stamina: 10 } },
  { text: "New: the thrust holds its foe for 1 s.", values: { pin: 1 } },
  { text: "Thrust 2.5 to 5 AD; passing cut 0.6 to 1.5 AD.", values: { thrust: 5, pass: 1.5 } },
]);

export const PASSING_TOUCH: SkillDef = {
  id: "ce_step",
  name: "Passing Touch",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "L: the dodge ends in a thrust, and cuts the foes it passes.",
  levels: LEVELS,
  evolution: {
    partner: "ce_measure",
    name: "Petal Step",
    text: "The dodge leaves a ring of petal blades where it began.",
    row: evolvedRow(LEVELS[7], "Leaves a ring of petal blades where it began.", { petals: 1.2 }),
  },
};

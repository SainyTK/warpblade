import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `thrust` AD of the thrust that ends the dodge, `pass` AD to each foe she passes through, `perfectPoints`
 *  Points a perfect dodge gives, `keen` the thrust is a sure crit after a perfect dodge, `stamina` given back per foe
 *  passed, `pin` seconds the thrust holds its foe; evolved `petals` AD a tick of the petal ring left where it began */
const NATIVE = levelRows([
  { text: "The dodge ends in a thrust ahead for 1.2 AD.", values: { thrust: 1.2 } },
  { text: "New: foes you dodge through are cut for 0.6 AD.", values: { pass: 0.6 } },
  { text: "New: a perfect dodge gives 2 Points.", values: { perfectPoints: 2 } },
  { text: "Thrust 1.2 to 2.5 AD.", values: { thrust: 2.5 } },
  { text: "New: after a perfect dodge the thrust is Keen.", values: { keen: 1 } },
  { text: "New: each foe you pass gives 10 stamina back.", values: { stamina: 10 } },
  { text: "New: the thrust holds its foe for 1 s.", values: { pin: 1 } },
  { text: "Thrust 2.5 to 5 AD; passing cut 0.6 to 1.5 AD.", values: { thrust: 5, pass: 1.5 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "A dash through foes cuts each for 0.8 AD.", drill: { cut: 0.8 } },
  { text: "New: the cut staggers.", drill: { stagger: 0.3 } },
  { text: "Cut 0.8 to 1.4 AD.", drill: { cut: 1.4 } },
  { text: "New: a dash through a foe readies the dash again.", drill: { refresh: 1 } },
  { text: "New: the cut sets the Rose mark.", drill: { mark: 1 } },
  { text: "Cut 1.4 to 2.5 AD.", drill: { cut: 2.5 } },
  { text: "New: the dash ends in a thrust ahead for 1.5 AD.", drill: { thrust: 1.5 } },
  { text: "Cut 2.5 to 5 AD; thrust 3 AD.", drill: { cut: 5, thrust: 3 } },
]);

export const PASSING_TOUCH: SkillDef = {
  id: "ce_step",
  name: "Passing Touch",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Dashing through foes cuts them.",
  levels: LEVELS,
  evolution: {
    partner: "ce_measure",
    name: "Petal Step",
    text: "Every cut strikes twice more at half power.",
    row: evolvedRow(LEVELS[7], "Each cut strikes twice more at 50%.", {
      ...drillValues({ petal: 1 }),
      petals: 1.2,
    }),
  },
};

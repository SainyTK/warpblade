import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { ULT_CHARGE } from "../../../ultimate";

/** values: `power` times the charge level's power, `recharge` seconds, `pull` foes are drawn in, `both` charge 2
 *  already reaches both sides, `longer` added cuts, `charge` charging speed, `greatsword` share of the power a last
 *  falling sword deals again */
const LEVELS = levelRows([
  { text: "U becomes Thousand Edges: a storm of blades ahead.", values: { power: 1, cooldown: 20, charge: 1 } },
  { text: "Recharge 20 to 17 s.", values: { cooldown: 17 } },
  { text: "New: the storm pulls foes to its centre.", values: { pull: 1 } },
  { text: "Power +40%.", values: { power: 1.4 } },
  { text: "New: charge level 2 already reaches both sides.", values: { both: 1 } },
  { text: "New: the storm lasts longer and cuts more.", values: { longer: 1 } },
  { text: "Recharge 17 to 13 s; charges 30% faster.", values: { cooldown: 13, charge: 1.3 } },
  { text: "New: a great sword falls last; power x2.5.", values: { greatsword: 0.5, power: 2.5 } },
]);

export const THOUSAND_EDGES: SkillDef = {
  id: "k_edges",
  name: "Thousand Edges",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: `A storm of blades in front of you in place of Crystal Nova. Grows with attack damage. ${ULT_CHARGE}`,
  ultimate: "thousandEdges",
  levels: LEVELS,
  evolution: {
    partner: "k_keen",
    name: "Endless Edges",
    text: "The storm follows Kael for 4 seconds while he fights, and every Keen blow adds a volley.",
    row: evolvedRow(LEVELS[7], "The storm follows you for 4 s.", { follow: 4 }),
  },
};

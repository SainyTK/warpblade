import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` the dodge's shoulder bash on each foe it passes (AD), `heft` Heft per foe, `wave` a shockwave ahead
 *  where the dodge ends at this power (AD), `stun` foes it passes are knocked down this long, `stamina` stamina back per
 *  foe, `trail` the dodge leaves a fissure behind at this power (AD) */
const LEVELS = levelRows([
  { text: "The dodge shoulders every foe it passes through.", values: { power: 0.8 } },
  { text: "New: each foe shouldered gives 8 Heft.", values: { heft: 8 } },
  { text: "Shoulder power 0.8 to 1.6.", values: { power: 1.6 } },
  { text: "New: a shockwave runs ahead where the dodge ends.", values: { wave: 1 } },
  { text: "Shoulder power 1.6 to 3.", values: { power: 3 } },
  { text: "New: foes shouldered are knocked down.", values: { stun: 0.7 } },
  { text: "New: each foe shouldered gives 12 stamina back.", values: { stamina: 12 } },
  { text: "Shoulder power 3 to 5.5; the shockwave hits harder.", values: { power: 5.5, wave: 3 } },
]);

export const SHOULDER_CHARGE: SkillDef = {
  id: "br_charge",
  name: "Shoulder Charge",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "The dodge shoulders through foes, and ends in a shockwave.",
  levels: LEVELS,
  evolution: {
    partner: "br_cry",
    name: "Battering Ram",
    text: "The dodge splits the floor behind her into a fissure that strikes every foe she passed.",
    row: evolvedRow(LEVELS[7], "The dodge leaves a fissure behind.", { trail: 3 }),
  },
};

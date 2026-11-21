import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "The dodge shoulders every foe it passes through.", values: { power: 0.8 } },
    { text: "New: each foe shouldered gives 8 Heft.", values: { heft: 8 } },
    { text: "Shoulder power 0.8 to 1.6.", values: { power: 1.6 } },
    { text: "New: a shockwave runs ahead where the dodge ends.", values: { wave: 1 } },
    { text: "Shoulder power 1.6 to 3.", values: { power: 3 } },
    { text: "New: foes shouldered are knocked down.", values: { stun: 0.7 } },
    { text: "New: each foe shouldered gives 12 stamina back.", values: { stamina: 12 } },
    { text: "Shoulder power 3 to 5.5; the shockwave hits harder.", values: { power: 5.5, wave: 3 } },
  ],
  [
    { text: "Dashing through foes shoulders them for 0.8 AD.", drill: { power: 0.8 } },
    { text: "New: shouldered foes are staggered.", drill: { stagger: 0.4 } },
    { text: "Shoulder 0.8 to 1.4 AD.", drill: { power: 1.4 } },
    { text: "New: shouldered foes are knocked back.", drill: { knock: 140 } },
    { text: "Shoulder 1.4 to 2.4 AD.", drill: { power: 2.4 } },
    { text: "New: one more air dash.", drill: { airDashes: 1 } },
    { text: "New: shouldered foes burn.", drill: { burn: 2 } },
    { text: "Shoulder 2.4 to 5.5 AD.", drill: { power: 5.5 } },
  ],
);

export const SHOULDER_CHARGE: SkillDef = {
  id: "br_charge",
  name: "Shoulder Charge",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "The dash shoulders every foe it passes through.",
  levels: LEVELS,
  evolution: {
    partner: "br_cry",
    name: "Battering Ram",
    text: "Every dash that shoulders a foe ends in a floor wave ahead.",
    row: evolvedRow(LEVELS[7], "A shouldering dash ends in a floor wave.", {
      ...drillValues({ wave: 2 }),
      trail: 3,
    }),
  },
};

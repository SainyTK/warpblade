import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "The slam's shockwave hits harder.", values: { wave: 0.6 } },
    { text: "The shockwave runs 40% farther.", values: { reach: 0.4 } },
    { text: "New: the shockwave runs both ways.", values: { both: 1 } },
    { text: "Shockwave power +0.6 to +1.2.", values: { wave: 1.2 } },
    { text: "New: foes it knocks down stay down 0.5 s longer.", values: { stun: 0.5 } },
    { text: "New: fissures run 40% farther.", values: { fissureReach: 0.4 } },
    { text: "New: fissures hit 1.5 AD harder.", values: { fissure: 1.5 } },
    { text: "Shockwave power +1.2 to +2.5; it runs 80% farther.", values: { wave: 2.5, reach: 0.8 } },
  ],
  [
    { text: "The third slash sends a shockwave of 0.8 AD along the floor.", drill: { wave: 0.8 } },
    { text: "New: the third slash deals +30%.", drill: { finisher: 0.3 } },
    { text: "New: the shockwave runs both ways.", drill: { both: 1 } },
    { text: "Shockwave 0.8 to 1.4 AD.", drill: { wave: 1.4 } },
    { text: "New: the slam staggers foes.", drill: { stagger: 0.5 } },
    { text: "Third slash +30% to +80%; shockwave 2.4 AD.", drill: { finisher: 0.8, wave: 2.4 } },
    { text: "New: a second shockwave follows.", drill: { twin: 1 } },
    { text: "Third slash +80% to +200%; shockwave 5 AD.", drill: { finisher: 2, wave: 5 } },
  ],
);

export const ANVIL_WEIGHT: SkillDef = {
  id: "br_slam",
  name: "Anvil Weight",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The third slash, Anvil Slam, sends a shockwave along the floor.",
  levels: LEVELS,
  evolution: {
    partner: "br_heavy",
    name: "Split Earth",
    text: "Every slam also raises a line of crimson pillars ahead.",
    row: evolvedRow(LEVELS[7], "Every slam raises crimson pillars ahead.", {
      ...drillValues({ pillars: 1.2 }),
      alwaysFissure: 1,
    }),
  },
};

import { ULT_CHARGE } from "../../../../constants/ultimate";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    { text: "Crimson Fall hits 30% harder.", values: { power: 1.3 } },
    { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
    { text: "New: fissures run out both ways from where it lands.", values: { fissures: 0.5 } },
    {
      text: "New: foes past its reach are dragged in first; power +70%.",
      values: { power: 1.7, reach: 0.25, pull: 1 },
    },
    { text: "New: two aftershocks shake the floor round her.", values: { quakes: 2, after: 0.4 } },
    { text: "Fissures hit 0.5 to 0.8 of the blow.", values: { fissures: 0.8 } },
    { text: "New: a second crescent comes down behind her.", values: { falls: 2 } },
    { text: "Power +70% to +120%; three aftershocks.", values: { power: 2.2, quakes: 3 } },
  ],
  [
    { text: "Charged skills +30%.", drill: { tier: 0.3 } },
    { text: "New: J charges 15% faster.", drill: { charge: 0.15 } },
    { text: "New: each release pulls foes toward her.", drill: { pull: 120 } },
    { text: "Charged skills +30% to +70%.", drill: { tier: 0.7 } },
    { text: "New: charged skills reach 20% farther.", drill: { reach: 0.2 } },
    { text: "Charged skills +70% to +130%.", drill: { tier: 1.3 } },
    { text: "New: an echo strike 0.4 s later at 40%.", drill: { echo: 0.4 } },
    { text: "Charged skills +130% to +250%.", drill: { tier: 2.5 } },
  ],
);

export const CRIMSON_FALL: SkillDef = {
  id: "br_fall",
  name: "Crimson Fall",
  kind: "ultimate",
  risk: "timed",
  button: "J",
  text: `Crimson Fall grows: fissures, aftershocks and a second crescent join it. Grows with attack damage. ${ULT_CHARGE}`,
  levels: LEVELS,
  evolution: {
    partner: "br_heavy",
    name: "Crimson Cataclysm",
    text: "Every charged skill shakes the floor twice more.",
    row: evolvedRow(LEVELS[7], "Every charged skill shakes twice more.", {
      ...drillValues({ burst: 0.6 }),
      falls: 3,
      power: 3,
      widen: 0.35,
    }),
  },
};

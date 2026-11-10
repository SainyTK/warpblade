import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Caltrops 60 px wide for 5 s, 0.3x each 0.5 s.",
    values: {
      mp: 18,
      cooldown: 7,
      width: 60,
      life: 5,
      power: 0.3,
      slow: 0,
      still: 0,
      ignite: 0,
      trip: 0,
      thornRoad: 0,
    },
  },
  { text: "Foes on them are slowed.", values: { slow: 1 } },
  { text: "Caltrops cut for 0.4x.", values: { power: 0.4 } },
  { text: "Caltrops spread 90 px.", values: { width: 90 } },
  { text: "Foes on them cannot turn.", values: { still: 1 } },
  { text: "Caltrops add Nightshade.", values: { ignite: 1 } },
  { text: "A foe stepping on them trips 0.3 s once; 0.45x.", values: { power: 0.45, trip: 0.3 } },
  { text: "Caltrops cut for 0.54x.", values: { power: 0.54 } },
]);

/** Caltrops. Design: docs/skills/tallis.md. Values: mp: MP; cooldown: seconds; width: pixels; life: seconds; power: ability power each cut deals every 0.5 s; slow: 1 foes on them are slowed; still: 1 foes on them cannot turn; ignite: 1 they add Nightshade; trip: seconds a foe first stepping on a strip lies tripped; thornRoad: 1 every Sink path leaves caltrops (evolution) */
export const CALTROPS: SkillDef = {
  id: "t_caltrops",
  name: "Caltrops",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "A spell on I: a strip of caltrops on the floor that cuts the foes on it.",
  levels: LEVELS,
  evolution: {
    partner: "t_nightshade",
    name: "Thorn Road",
    text: "Every Sink path leaves a strip of caltrops behind it.",
    row: evolvedRow(LEVELS[7], "Every Sink path leaves caltrops.", { thornRoad: 1 }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` added heave power (AD), `launch` added throw speed, `airBonus` launched foes take this much more,
 *  `reach` added pixels ahead, `crash` a foe the slam drives down bursts on the foes round it at this power (AD),
 *  `behind` the heave cuts behind too, `crashFissure` each crash also cracks the floor both ways */
const LEVELS = levelRows([
  { text: "The heave hits harder and throws foes higher.", values: { power: 0.6, launch: 60 } },
  { text: "New: launched foes take +20% until they land.", values: { airBonus: 0.2 } },
  { text: "Heave power +0.6 to +1.4.", values: { power: 1.4 } },
  { text: "New: the heave reaches 16 px farther ahead.", values: { reach: 16 } },
  { text: "New: a foe the slam drives down bursts on the foes round it.", values: { crash: 1.2 } },
  { text: "Launched foes take +20% to +40%.", values: { airBonus: 0.4 } },
  { text: "New: the heave cuts behind her too.", values: { behind: 1 } },
  { text: "Heave power +1.4 to +3.4; the crash hits far harder.", values: { power: 3.4, crash: 3.5 } },
]);

export const SKYWARD_HEAVE: SkillDef = {
  id: "br_launch",
  name: "Skyward Heave",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The heave throws foes higher, and the slam crashes them down onto the crowd.",
  levels: LEVELS,
  evolution: {
    partner: "br_cleave",
    name: "Meteor Heave",
    text: "Every foe the slam drives down cracks the floor both ways where it lands.",
    row: evolvedRow(LEVELS[7], "Each crash also cracks the floor both ways.", { crashFissure: 1.5 }),
  },
};

import { ULT_CHARGE } from "../../../../constants/ultimate";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` the crescent's share of its own blow, `cooldown` seconds, `charge` charging speed, `reach` added
 *  share of reach, `pull` foes past the reach are dragged in, `fissures` fissures both ways at this share of the
 *  blow, `quakes` aftershocks round her, `after` each aftershock's share, `falls` crescents in all */
const LEVELS = levelRows([
  { text: "Crimson Fall hits 30% harder.", values: { power: 1.3 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: fissures run out both ways from where it lands.", values: { fissures: 0.5 } },
  { text: "New: foes past its reach are dragged in first; power +70%.", values: { power: 1.7, reach: 0.25, pull: 1 } },
  { text: "New: two aftershocks shake the floor round her.", values: { quakes: 2, after: 0.4 } },
  { text: "Fissures hit 0.5 to 0.8 of the blow.", values: { fissures: 0.8 } },
  { text: "New: a second crescent comes down behind her.", values: { falls: 2 } },
  { text: "Power +70% to +120%; three aftershocks.", values: { power: 2.2, quakes: 3 } },
]);

export const CRIMSON_FALL: SkillDef = {
  id: "br_fall",
  name: "Crimson Fall",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: `Crimson Fall grows: fissures, aftershocks and a second crescent join it. Grows with attack damage. ${ULT_CHARGE}`,
  levels: LEVELS,
  evolution: {
    partner: "br_heavy",
    name: "Sundered Sky",
    text: "Three crescents fall one after another, each wider than the last.",
    row: evolvedRow(LEVELS[7], "Three crescents, each wider.", { falls: 3, power: 3, widen: 0.35 }),
  },
};

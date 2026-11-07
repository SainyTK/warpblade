import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { ULT_CHARGE } from "../../../ultimate";

/** values: `power` times the charge level's power, `floor` seconds the floor burns where meteors land, `stun`,
 *  `launch` meteors throw foes up, `late` meteors that fall on the densest group after, `recharge` */
const LEVELS = levelRows([
  { text: "U becomes Starfall: meteors on the foes in reach.", values: { power: 0.9, cooldown: 20, charge: 1 } },
  { text: "New: the floor burns where meteors land.", values: { floor: 3 } },
  { text: "Power +45%.", values: { power: 1.3 } },
  { text: "New: meteors stun foes.", values: { stun: 0.8 } },
  { text: "New: meteors throw foes up.", values: { launch: 1 } },
  { text: "New: 3 more meteors fall on the densest group.", values: { late: 3 } },
  { text: "Recharge 20 to 15 s.", values: { cooldown: 15 } },
  { text: "Power 1.3 to 14x; the floor burns longer.", values: { power: 14, floor: 5 } },
]);

export const STARFALL: SkillDef = {
  id: "k_starfall",
  name: "Starfall",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: `Meteors rain on the foes in reach and set the floor alight, in place of Crystal Nova. Grows with ability power. ${ULT_CHARGE}`,
  ultimate: "starfall",
  levels: LEVELS,
  evolution: {
    partner: "k_flame",
    name: "Cataclysm",
    text: "Meteors keep falling for 4 seconds on foes near Kael, each landing as a Fire Flask burst.",
    row: evolvedRow(LEVELS[7], "Meteors keep falling for 4 s as flask bursts.", { rain: 4, rainEvery: 0.25 }),
  },
};

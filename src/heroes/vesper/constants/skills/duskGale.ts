import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` ability power, `launch` how fast it throws foes up, `life` seconds it runs, `recharge` seconds, `back`
 *  it turns back, `ticks` cuts on one foe, `both` one gale each way, `pull` it drags foes along, `stand` (evolved) seconds
 *  it stands and juggles */
const LEVELS = levelRows([
  {
    text: "Learn Dusk Gale: a whirl runs along the floor and throws foes up.",
    values: { power: 1.6, launch: 240, life: 0.5, recharge: 4.5, ticks: 1 },
  },
  { text: "Power 1.6 to 2.6.", values: { power: 2.6 } },
  { text: "New: the gale turns back at the end of its run.", values: { back: 1 } },
  { text: "Power 2.6 to 3.4; recharge 3.8 s.", values: { power: 3.4, recharge: 3.8 } },
  { text: "New: it cuts each foe three times and holds it up.", values: { ticks: 3 } },
  { text: "New: a gale runs each way.", values: { both: 1 } },
  { text: "Power 3.4 to 4.6.", values: { power: 4.6 } },
  { text: "New: it drags foes along with it.", values: { pull: 1 } },
]);

export const DUSK_GALE: SkillDef = {
  id: "ve_gale",
  name: "Dusk Gale",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "An ability: a whirl of dusk runs along the floor and throws foes into the air.",
  levels: LEVELS,
  evolution: {
    partner: "ve_sky",
    name: "Twilight Cyclone",
    text: "At the end of its run the gale stands for 2 s and keeps juggling every foe in it.",
    row: evolvedRow(LEVELS[7], "The gale stands 2 s and juggles foes.", { stand: 2 }),
  },
};

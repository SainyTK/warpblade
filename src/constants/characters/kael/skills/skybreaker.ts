import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `launch` power of the 4th hit, `wide` a tall box far ahead, `behind` it cuts behind too, `airBonus` damage
 *  launched foes take until they land, `crash` and `crashReach` the blow where a launched foe lands */
const LEVELS = levelRows([
  { text: "The 4th hit launches the foe high.", values: { launch: 1.6, crashReach: 30 } },
  { text: "New: the launch takes every foe in a tall box ahead.", values: { wide: 1 } },
  { text: "Launch power 1.6 to 2.4.", values: { launch: 2.4 } },
  { text: "New: launched foes take +30% damage until they land.", values: { airBonus: 0.3 } },
  { text: "New: launched foes crash down on foes near them.", values: { crash: 1.2 } },
  { text: "New: the launch also cuts behind Kael.", values: { behind: 1 } },
  { text: "Launched foes take +60%; the crash hits harder.", values: { airBonus: 0.6, crash: 2 } },
  { text: "Launch and crash far stronger and wider.", values: { launch: 5, crash: 3.5, crashReach: 45 } },
]);

export const SKYBREAKER: SkillDef = {
  id: "k_skyward",
  name: "Skybreaker",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The last hit of the combo launches foes into the air instead of knocking them down.",
  levels: LEVELS,
  evolution: {
    partner: "k_skydance",
    name: "Heavenfall",
    text: "At the top of each launch a crystal phantom spikes the foe back down into a shockwave.",
    row: evolvedRow(LEVELS[7], "A phantom spikes every launched foe down.", { spike: 15, shockReach: 60 }),
  },
};

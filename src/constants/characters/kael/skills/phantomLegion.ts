import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { ULT_CHARGE } from "../../../ultimate";

/** values: `power` times the charge level's power, `extra` phantoms added at each charge level, `repeat` share a
 *  phantom's cuts repeat at, `launch` the last cut throws the foe up, `lock` seconds struck foes cannot turn, `recharge`,
 *  `hop` a phantom whose foe dies moves to the next */
const LEVELS = levelRows([
  { text: "U becomes Phantom Legion: phantoms cut foes from behind.", values: { power: 0.6, cooldown: 20, charge: 1 } },
  { text: "One more phantom at each charge level.", values: { extra: 1 } },
  { text: "New: each phantom repeats its cuts at half power.", values: { repeat: 0.5 } },
  { text: "New: the last cut launches; power +33%.", values: { launch: 1, power: 0.8 } },
  { text: "New: struck foes cannot turn for 2 s.", values: { lock: 2 } },
  { text: "Recharge 20 to 15 s.", values: { cooldown: 15 } },
  { text: "New: a phantom whose foe falls moves to the next.", values: { hop: 1 } },
  { text: "Power 0.8 to 2x.", values: { power: 2 } },
]);

export const PHANTOM_LEGION: SkillDef = {
  id: "k_legion",
  name: "Phantom Legion",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Phantoms of Kael appear behind foes and cut them, in place of Crystal Nova. Grows with attack damage. ${ULT_CHARGE}`,
  ultimate: "phantomLegion",
  levels: LEVELS,
  evolution: {
    partner: "k_echo",
    name: "Phantom Army",
    text: "The legion stays 5 seconds, each phantom cutting again and again and moving on when its foe falls.",
    row: evolvedRow(LEVELS[7], "The legion stays 5 s.", { army: 5, armyEvery: 0.5 }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a parry or perfect dodge calls a phantom, `cuts` its cuts, `power` attack damage each, `launch` its
 *  last cut throws the foe up, `back` its cuts land from behind, `stay` seconds it stays cutting any foe near it,
 *  `buff` (evolved) her blows' damage more while a phantom is out */
const LEVELS = levelRows([
  {
    text: "A parry or perfect dodge may call a phantom of you that cuts the nearest foe.",
    values: { chance: 0.6, cuts: 3, power: 0.8 },
  },
  { text: "Chance 60% to 100%.", values: { chance: 1 } },
  { text: "New: the phantom's last cut throws its foe up.", values: { launch: 1 } },
  { text: "Cuts 0.8 to 1.2.", values: { power: 1.2 } },
  { text: "New: the phantom cuts from the foe's back.", values: { back: 1 } },
  { text: "5 cuts.", values: { cuts: 5 } },
  { text: "New: the phantom stays 3 s and cuts any foe near it.", values: { stay: 3 } },
  { text: "Cuts 1.2 to 1.8.", values: { power: 1.8 } },
]);

export const TWIN_PHANTOM: SkillDef = {
  id: "ve_twin",
  name: "Twin Phantom",
  kind: "summon",
  risk: "precise",
  button: "auto",
  text: "A parry or perfect dodge calls a phantom of you to cut the nearest foe.",
  levels: LEVELS,
  evolution: {
    partner: "ve_turn",
    name: "Mirror Dance",
    text: "Two phantoms come, and while one is out your blows deal 30% more.",
    row: evolvedRow(LEVELS[7], "Two phantoms; your blows deal 30% more while out.", { buff: 0.3 }),
  },
};

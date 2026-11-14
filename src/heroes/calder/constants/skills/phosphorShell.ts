import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `cost` MP, `recharge` seconds, `power` ability power of the burst, `burn` ability power a fire tick per stack, `time` seconds the pool burns, `radius` pixels, `launch` the burst throws foes up, `halt` foes in the pool are held fast, `burnMax` more stacks, `shells` shells a cast */
const LEVELS = levelRows([
  {
    text: "Learn Phosphor Shell: a shell that leaves green fire.",
    values: { cost: 14, recharge: 6, power: 1.6, burn: 0.2, time: 2.5, radius: 22 },
  },
  { text: "Fire 0.2 to 0.3; burns 3.5 s.", values: { burn: 0.3, time: 3.5 } },
  { text: "New: the burst throws foes up.", values: { launch: 1 } },
  { text: "New: foes in the fire are held fast.", values: { halt: 1 } },
  { text: "Burst 1.6 to 3; wider pool.", values: { power: 3, radius: 30 } },
  { text: "New: two shells a cast.", values: { shells: 2 } },
  { text: "New: the fire stacks twice as high.", values: { burnMax: 5 } },
  { text: "Burst 3 to 6; fire 0.3 to 1.", values: { power: 6, burn: 1 } },
]);

export const PHOSPHOR_SHELL: SkillDef = {
  id: "ca_flare",
  name: "Phosphor Shell",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Learn Phosphor Shell: a lobbed shell bursts into a pool of green fire.",
  levels: LEVELS,
  evolution: {
    partner: "ca_scorch",
    name: "Greenfire Barrage",
    text: "Four shells a cast, and their fire burns twice as hot.",
    row: evolvedRow(LEVELS[7], "Four shells; fire twice as hot.", { shells: 4, burn: 2.4 }),
  },
};

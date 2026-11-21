import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillLevels";

/** values: `cost` MP, `recharge` seconds, `power` ability power of the burst, `burn` ability power a fire tick per stack, `time` seconds the pool burns, `radius` pixels, `launch` the burst throws foes up, `halt` foes in the pool are held fast, `burnMax` more stacks, `shells` shells a cast */
const LEVELS = levelRows([
  {
    text: "Each Phosphor Shell blast throws three more.",
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

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "Phosphor Shell +50% and burns.", drill: { bonus: 0.5 } },
  { text: "New: the fire spreads to foes near the blast.", drill: { spread: 1 } },
  { text: "New: cutting a burning foe flares it.", drill: { flare: 0.5 } },
  { text: "Shell +50% to +120%.", drill: { bonus: 1.2 } },
  { text: "New: the fire spreads 50% wider.", drill: { wide: 1 } },
  { text: "Shell +120% to +250%.", drill: { bonus: 2.5 } },
  { text: "New: a second shell follows.", drill: { twin: 1 } },
  { text: "Shell +250% to +500%.", drill: { bonus: 5 } },
]);

export const PHOSPHOR_SHELL: SkillDef = {
  id: "ca_flare",
  name: "Phosphor Shell",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Phosphor Shell hits harder and its green fire spreads.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_scorch",
    name: "Greenfire Barrage",
    text: "Four shells a cast, and their fire burns twice as hot.",
    row: evolvedRow(DRILL_LEVELS[7], "Each blast throws three more.", {
      ...drillValues({ barrage: 3 }),
      shells: 4,
      burn: 2.4,
    }),
  },
};

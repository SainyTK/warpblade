import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` multiplies each echo thrust, `reach` pixels it reaches further, `back` share of a second cut on its way back, `chill` seconds it slows a foe, `ghost` the jian thrusts an echo of its own when no sword is out, `twice` each sword thrusts twice */
const LEVELS = levelRows([
  { text: "Echo thrusts hit 30% harder.", values: { power: 1.3 } },
  { text: "Echo power +30% to +60%.", values: { power: 1.6 } },
  { text: "New: echoes reach 16 px further.", values: { reach: 16 } },
  { text: "Echo power +60% to +100%.", values: { power: 2 } },
  { text: "New: each echo cuts again on its way back.", values: { back: 0.5 } },
  { text: "New: echoes slow foes for 1 s.", values: { chill: 1 } },
  { text: "Echo power +100% to +200%.", values: { power: 3 } },
  { text: "New: with no sword out, the jian thrusts an echo of its own; +250%.", values: { ghost: 1, power: 3.5 } },
]);

export const TWIN_ECHO: SkillDef = {
  id: "yu_echo",
  name: "Twin Echo",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Sword Echo grows: harder and longer thrusts that cut twice and slow.",
  levels: LEVELS,
  evolution: {
    partner: "yu_breath",
    name: "Myriad Echo",
    text: "Every spirit sword thrusts twice for each of your blows.",
    row: evolvedRow(LEVELS[7], "Every sword thrusts twice.", { twice: 1 }),
  },
};

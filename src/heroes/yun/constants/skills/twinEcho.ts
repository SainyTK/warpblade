import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

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

const DRILL_LEVELS = onDrill(LEVELS, [
  {
    text: "A landed Crane Wheel sends 2 spirit swords thrusting 64 px for 0.4 AD each.",
    drill: { swords: 2, power: 0.4, reach: 64 },
  },
  { text: "New: Willow Cut is echoed too.", drill: { first: 1 } },
  { text: "New: each echo cuts again flying back.", drill: { back: 0.5 } },
  { text: "Echo power 0.4 to 0.8.", drill: { power: 0.8 } },
  { text: "New: four swords echo.", drill: { swords: 4 } },
  { text: "Echo power 1.3; reach 80 px.", drill: { power: 1.3, reach: 80 } },
  { text: "New: every cut is echoed, the air cut too.", drill: { all: 1 } },
  { text: "Echo power 2.6.", drill: { power: 2.6 } },
]);

export const TWIN_ECHO: SkillDef = {
  id: "yu_echo",
  name: "Twin Echo",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Crane Wheel, the second cut, sends your spirit swords thrusting ahead.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_breath",
    name: "Myriad Echo",
    text: "Echo thrusts are sure critical hits and reach 110 px.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Every sword thrusts twice.", { twice: 1 }),
      "Echoes always crit; 110 px.",
      { myriad: 110 },
    ),
  },
};

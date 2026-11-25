import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

/** values: `wave` multiplies the crescent's power, `reach` pixels it runs further, `tall` multiplies its height, `gain` spirit swords a landed tide gives, `launch` the crescent throws foes up, `twin` a second crescent follows, `both` crescents run both ways */
const LEVELS = levelRows([
  { text: "Returning Tide's crescent cuts three times as hard.", values: { wave: 3 } },
  { text: "Crescent power x3 to x4.5; it runs 20 px further.", values: { wave: 4.5, reach: 20 } },
  { text: "New: the crescent is twice as tall.", values: { tall: 2 } },
  { text: "Crescent power x4.5 to x6.5.", values: { wave: 6.5 } },
  { text: "New: a landed tide gives two spirit swords.", values: { gain: 2 } },
  { text: "New: the crescent throws foes up.", values: { launch: 1 } },
  { text: "Crescent power x6.5 to x9; it runs 50 px further.", values: { wave: 9, reach: 50 } },
  { text: "New: a second crescent follows the first.", values: { twin: 1, wave: 11 } },
]);

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "Returning Tide sends a floor crescent 90 px for 1 AD.", drill: { wave: 1, reach: 90 } },
  { text: "New: the crescent knocks foes down.", drill: { stun: 0.5 } },
  { text: "New: Returning Tide deals +30%.", drill: { finisher: 1.3 } },
  { text: "Crescent 1 to 2 AD.", drill: { wave: 2 } },
  { text: "New: the crescent throws foes up.", drill: { launch: 1 } },
  { text: "Crescent 3.5 AD, 130 px; Returning Tide +60%.", drill: { wave: 3.5, reach: 130, finisher: 1.6 } },
  { text: "New: a second crescent follows the first.", drill: { twin: 1 } },
  { text: "Crescent 7 AD; Returning Tide +120%.", drill: { wave: 7, finisher: 2.2 } },
]);

export const HIGH_TIDE: SkillDef = {
  id: "yu_tide",
  name: "High Tide",
  kind: "attack",
  element: "frost",
  risk: "timed",
  button: "J",
  text: "Returning Tide, the third cut, runs a qi crescent along the floor.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_bleed",
    name: "Spring Tide",
    text: "The crescents run both ways at once.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Crescents run both ways.", { both: 1 }),
      "Crescents run both ways.",
      {},
    ),
  },
};

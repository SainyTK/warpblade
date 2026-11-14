import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `wave` multiplies the crescent's power, `reach` pixels it runs further, `tall` multiplies its height, `gain` spirit swords a landed tide gives, `launch` the crescent throws foes up, `twin` a second crescent follows, `both` crescents run both ways */
const LEVELS = levelRows([
  { text: "Returning Tide's crescent cuts twice as hard.", values: { wave: 2 } },
  { text: "Crescent power x2 to x2.6; it runs 20 px further.", values: { wave: 2.6, reach: 20 } },
  { text: "New: the crescent is twice as tall.", values: { tall: 2 } },
  { text: "Crescent power x2.6 to x3.4.", values: { wave: 3.4 } },
  { text: "New: a landed tide gives two spirit swords.", values: { gain: 2 } },
  { text: "New: the crescent throws foes up.", values: { launch: 1 } },
  { text: "Crescent power x3.4 to x4.2; it runs 50 px further.", values: { wave: 4.2, reach: 50 } },
  { text: "New: a second crescent follows the first.", values: { twin: 1, wave: 5 } },
]);

export const HIGH_TIDE: SkillDef = {
  id: "yu_tide",
  name: "High Tide",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Returning Tide's crescent grows: harder, taller, it lifts foes and brings more swords.",
  levels: LEVELS,
  evolution: {
    partner: "yu_bleed",
    name: "Spring Tide",
    text: "The tide sends its crescents both ways at once.",
    row: evolvedRow(LEVELS[7], "Crescents run both ways.", { both: 1 }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

/** values: `power` ability power of the wave, `reach` pixels it runs, `tall` multiplies its height, `sword` a foe it cuts gives a spirit sword, once a cast, `twin` a second wave follows, `stun` seconds foes are knocked down, `recharge` seconds */
const LEVELS = levelRows([
  {
    text: "Learn Qi Crescent: a wave of qi from the jian, 14 MP.",
    values: { power: 1.6, reach: 140, tall: 1, recharge: 2.5 },
  },
  { text: "Crescent power 1.6 to 2.", values: { power: 2 } },
  { text: "New: the crescent is twice as tall.", values: { tall: 2 } },
  { text: "Crescent power 2 to 2.5.", values: { power: 2.5 } },
  { text: "New: the first foe it cuts gives a spirit sword.", values: { sword: 1 } },
  { text: "Crescent power 2.5 to 3.", values: { power: 3 } },
  { text: "New: a second crescent follows.", values: { twin: 1 } },
  { text: "New: crescents knock foes down; power 3.5.", values: { stun: 0.6, power: 3.5 } },
]);

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "Qi Crescent cuts for +0.5 AP more.", drill: { bonus: 0.5 } },
  { text: "New: a landed crescent sends a qi wave on past the foe for 0.8 AD.", drill: { chain: 0.8 } },
  { text: "New: the crescent staggers.", drill: { stagger: 0.4 } },
  { text: "Crescent bonus 1.2 AP.", drill: { bonus: 1.2 } },
  { text: "New: Crescent-filled cuts each send a small wave for 0.8 AD.", drill: { edge: 0.8 } },
  { text: "Crescent bonus 2.2 AP; waves 1.6 AD.", drill: { bonus: 2.2, chain: 1.6, edge: 1.6 } },
  { text: "New: the crescent throws foes up.", drill: { launch: 1 } },
  { text: "Crescent bonus 4.5 AP; waves 3 AD.", drill: { bonus: 4.5, chain: 3, edge: 3 } },
]);

export const QI_CRESCENT: SkillDef = {
  id: "yu_crescent",
  name: "Qi Crescent",
  kind: "spell",
  element: "void",
  risk: "timed",
  button: "I",
  text: "Qi Crescent cuts harder and carries on past its target.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_tide",
    name: "Moon Crescent",
    text: "Each crescent that lands splits into two more.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Crescents cross the stage.", { reach: 320 }),
      "Crescents split in two.",
      { moon: 2 },
    ),
  },
};

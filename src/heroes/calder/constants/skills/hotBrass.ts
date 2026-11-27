import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `casings` thrown a reload, `damage` attack damage a tick per stack, `range` pixels, `quick` a quick reload throws twice as many, `stagger` seconds a casing staggers, `ult` Cylinder Break throws them too, `rain` casings fall on foes across the whole screen */
const LEVELS = levelRows([
  {
    text: "Every sixth round flings hot casings that burn foes nearby.",
    values: { casings: 3, damage: 0.12, range: 70 },
  },
  { text: "Burn 0.12 to 0.2; range 90 px.", values: { damage: 0.2, range: 90 } },
  { text: "New: twice as many casings.", values: { quick: 1 } },
  { text: "New: casings stagger foes.", values: { stagger: 0.4 } },
  { text: "Burn 0.2 to 0.4.", values: { damage: 0.4 } },
  { text: "New: Cylinder Break throws casings too.", values: { ult: 1 } },
  { text: "New: six casings a throw.", values: { casings: 6 } },
  { text: "Burn 0.4 to 1.5.", values: { damage: 1.5 } },
]);

export const HOT_BRASS: SkillDef = {
  id: "ca_brass",
  name: "Hot Brass",
  kind: "dot",
  element: "blaze",
  risk: "easy",
  button: "auto",
  text: "Every sixth round fired flings hot casings at foes nearby, burning them.",
  levels: LEVELS,
  evolution: {
    partner: "ca_speedload",
    name: "Brass Rain",
    text: "Casings rain on every foe on screen.",
    row: evolvedRow(LEVELS[7], "Casings rain on every foe on screen.", { rain: 1, casings: 12 }),
  },
};

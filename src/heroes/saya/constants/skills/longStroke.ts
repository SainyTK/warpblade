import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
import { SKILL } from "./ids";

/** values (Brushline): `length` px of the dash, `recharge` s, `guard` it breaks guards, `stamina` it gives back,
 *  `store` the factor on what it stores, `free` it costs no MP, `launch` its foes are thrown up this fast at the click,
 *  `horizon` px the cut runs on along the floor past where she stops */
const LEVELS = levelRows([
  { text: "Brushline dashes 44 to 56 px.", values: { length: 56 } },
  { text: "Brushline recharge 3.5 to 2.8 s.", values: { recharge: 2.8 } },
  { text: "New: Brushline breaks guards.", values: { guard: 1 } },
  { text: "New: Brushline gives back 20 stamina.", values: { stamina: 20 } },
  { text: "Brushline stores +60%.", values: { store: 1.6 } },
  { text: "New: Brushline costs no MP.", values: { free: 1 } },
  { text: "New: Brushline's click throws its foes up.", values: { launch: 200 } },
  { text: "Brushline stores +60% to +150%; recharge 2.2 s.", values: { store: 2.5, recharge: 2.2 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "Dashing through foes cuts them for 0.8x AD.", drill: { cut: 0.8 } },
  { text: "New: the dash cut stores 1x AD in each foe.", drill: { store: 1 } },
  { text: "New: the dash cut staggers.", drill: { stagger: 0.3 } },
  { text: "Dash cut 0.8x to 1.6x AD.", drill: { cut: 1.6 } },
  { text: "New: the dash leaves an ink stroke on the floor.", drill: { line: 1 } },
  { text: "Dash cut 1.6x to 3x AD.", drill: { cut: 3 } },
  { text: "New: a dash through a foe recharges the dash.", drill: { refresh: 1 } },
  { text: "Dash cut 3x to 6x AD; the store doubles.", drill: { cut: 6, store: 2 } },
]);

export const LONG_STROKE: SkillDef = {
  id: SKILL.stroke,
  name: "Long Stroke",
  kind: "movement",
  risk: "easy",
  button: "L",
  text: "Dashing through foes cuts them like a brush stroke.",
  levels: DRILL,
  evolution: {
    partner: SKILL.trail,
    name: "Ink Horizon",
    text: "The dash cut also strikes every foe up to 60 px past where she stops.",
    row: evolvedRow(DRILL[7], "The dash cut reaches 60 px past her.", {
      ...drillValues({ horizon: 60 }),
      horizon: 120,
    }),
  },
};

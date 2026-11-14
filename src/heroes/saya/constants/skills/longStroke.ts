import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
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

export const LONG_STROKE: SkillDef = {
  id: SKILL.stroke,
  name: "Long Stroke",
  kind: "movement",
  risk: "easy",
  button: "I",
  text: "Brushline dashes a little farther, comes back sooner and stores more.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.trail,
    name: "Ink Horizon",
    text: "Brushline's cut runs on along the floor 120 px past where she stops, cutting every foe on the line.",
    row: evolvedRow(LEVELS[7], "The cut runs on 120 px past you.", { horizon: 120 }),
  },
};

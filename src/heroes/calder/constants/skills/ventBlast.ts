import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` attack damage of the vent, `reach` pixels behind, `knock` throws foes away and staggers them, `air` air blows vent too, `burn` attack damage a burn tick per stack, `front` share of the vent that also bursts in front, `ring` the vent strikes all round */
const LEVELS = levelRows([
  { text: "String blows vent behind you, striking foes there.", values: { power: 0.4, reach: 28 } },
  { text: "Vent power +50%; reach 28 to 34 px.", values: { power: 0.6, reach: 34 } },
  { text: "New: the vent throws foes away and staggers them.", values: { knock: 1 } },
  { text: "New: air blows vent too.", values: { air: 1 } },
  { text: "Vent power 0.6 to 1.", values: { power: 1 } },
  { text: "New: vented foes burn.", values: { burn: 0.1 } },
  { text: "New: the vent also bursts in front.", values: { front: 0.5 } },
  { text: "Vent power 1 to 2.2.", values: { power: 2.2 } },
]);

export const VENT_BLAST: SkillDef = {
  id: "ca_vent",
  name: "Vent Blast",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Each string blow vents the chamber behind you, striking foes there.",
  levels: LEVELS,
  evolution: {
    partner: "ca_brass",
    name: "Furnace Vent",
    text: "The vent bursts all round you at twice the power.",
    row: evolvedRow(LEVELS[7], "The vent bursts all round, twice as hard.", { ring: 1, power: 4.4 }),
  },
};

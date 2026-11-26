import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { withDrill } from "./drillLevels";

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

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "The second cut vents a blast ahead.", drill: { vent: 0.6, reach: 30 } },
  { text: "New: the blast throws foes back.", drill: { knock: 1 } },
  { text: "New: the blast sets foes burning.", drill: { burn: 0.15 } },
  { text: "Vent 0.6 to 1.2 AD.", drill: { vent: 1.2 } },
  { text: "New: the vent reaches 50% farther.", drill: { reach: 45 } },
  { text: "Vent 1.2 to 2.4 AD.", drill: { vent: 2.4 } },
  { text: "New: the vent also fires behind.", drill: { behind: 1 } },
  { text: "Vent 2.4 to 5 AD.", drill: { vent: 5 } },
]);

export const VENT_BLAST: SkillDef = {
  id: "ca_vent",
  name: "Vent Blast",
  kind: "attack",
  element: "frost",
  risk: "easy",
  button: "J",
  text: "The second cut vents a blast from the chamber ahead.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_brass",
    name: "Furnace Vent",
    text: "Every cut of the chain vents.",
    row: evolvedRow(DRILL_LEVELS[7], "Every cut vents.", {
      ring: 1,
      power: 4.4,
    }),
  },
};

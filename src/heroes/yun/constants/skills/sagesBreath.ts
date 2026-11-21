import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

/** values: `regen` seconds between swords coming back, `most` swords held beyond the usual, `rest` swords that come back on their own beyond the usual, `wave` every sword is back at the start of each wave */
const LEVELS = levelRows([
  { text: "Spirit swords come back every 2.2 s.", values: { regen: 2.2 } },
  { text: "New: hold one more spirit sword.", values: { most: 1 } },
  { text: "Swords come back every 1.9 s.", values: { regen: 1.9 } },
  { text: "New: three swords come back on their own.", values: { rest: 1 } },
  { text: "Swords come back every 1.6 s.", values: { regen: 1.6 } },
  { text: "New: hold two more spirit swords.", values: { most: 2 } },
  { text: "New: four swords come back on their own.", values: { rest: 2 } },
  { text: "New: every sword is back as each wave starts; every 1.2 s.", values: { wave: 1, regen: 1.2 } },
]);

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "One more air dash.", drill: { airDashes: 1 } },
  { text: "New: an air dash restores the air cuts.", drill: { restore: 1 } },
  { text: "New: a dash ends in a qi ring for 0.6 AD.", drill: { ring: 0.6 } },
  { text: "Ring 0.6 to 1.2 AD.", drill: { ring: 1.2 } },
  { text: "New: two more air dashes.", drill: { airDashes: 2 } },
  { text: "Ring 2.4 AD.", drill: { ring: 2.4 } },
  { text: "New: the ring staggers.", drill: { stagger: 0.4 } },
  { text: "Ring 5 AD.", drill: { ring: 5 } },
]);

export const SAGES_BREATH: SkillDef = {
  id: "yu_breath",
  name: "Sage's Breath",
  kind: "movement",
  risk: "easy",
  button: "L",
  text: "More air dashes, and each dash ends in a ring of qi.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_guardian",
    name: "Sword Sea",
    text: "Each air dash sends three spirit swords thrusting ahead.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Hold 8; all come back.", { most: 4, rest: 6 }),
      "Air dashes send three swords.",
      { sea: 3 },
    ),
  },
};

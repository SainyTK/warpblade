import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

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

export const SAGES_BREATH: SkillDef = {
  id: "yu_breath",
  name: "Sage's Breath",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "Spirit swords come back faster, and you hold more of them.",
  levels: LEVELS,
  evolution: {
    partner: "yu_guardian",
    name: "Sword Sea",
    text: "Hold eight spirit swords, and all of them come back on their own.",
    row: evolvedRow(LEVELS[7], "Hold 8; all come back.", { most: 4, rest: 6 }),
  },
};

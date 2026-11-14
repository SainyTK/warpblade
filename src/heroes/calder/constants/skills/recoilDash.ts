import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` attack damage of the round behind, `cut` attack damage to foes passed through, `stamina` given back per foe passed, `air` dodge in the air, `end` attack damage of a blast ahead as it ends, `trail` attack damage of each blast left along the path */
const LEVELS = levelRows([
  { text: "The dodge fires a round behind you as it starts.", values: { power: 0.8 } },
  { text: "Round power 0.8 to 1.2.", values: { power: 1.2 } },
  { text: "New: foes you dodge through are cut.", values: { cut: 0.8 } },
  { text: "New: each foe passed gives back 8 stamina.", values: { stamina: 8 } },
  { text: "Round 1.2 to 2.2; cut 0.8 to 1.5.", values: { power: 2.2, cut: 1.5 } },
  { text: "New: dodge in the air.", values: { air: 1 } },
  { text: "New: the dodge ends with a blast ahead.", values: { end: 2 } },
  { text: "Round 4, cut 3, blast 4.", values: { power: 4, cut: 3, end: 4 } },
]);

export const RECOIL_DASH: SkillDef = {
  id: "ca_recoil",
  name: "Recoil Dash",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "The dodge fires a round behind you as it starts.",
  levels: LEVELS,
  evolution: {
    partner: "ca_vent",
    name: "Backfire Rush",
    text: "The dodge leaves a line of blasts along its path.",
    row: evolvedRow(LEVELS[7], "Blasts along the whole path.", { trail: 2.5 }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `passCut` attack damage of the cut on each foe the dodge passes through, `passWounds` wounds it opens, `cloud` seconds the sand cloud the dodge leaves blinds minions, `perfectWhirl` Whirl a perfect dodge fills to, `air` the dodge works in the air, `mirage` every dodge leaves a mirage */
const LEVELS = levelRows([
  { text: "A dodge through a foe cuts it.", values: { passCut: 0.6 } },
  { text: "Cut 0.6 to 0.9.", values: { passCut: 0.9 } },
  { text: "New: the cut opens two wounds.", values: { passWounds: 2 } },
  { text: "New: a dodge leaves a cloud of sand that blinds minions in it.", values: { cloud: 1.2 } },
  { text: "New: a perfect dodge fills the Whirl to its top ring.", values: { perfectWhirl: 80 } },
  { text: "Cut 0.9 to 1.8.", values: { passCut: 1.8 } },
  { text: "New: dodge in the air.", values: { air: 1 } },
  { text: "Cut 1.8 to 3; the cloud blinds twice as long.", values: { passCut: 3, cloud: 2.4 } },
]);

export const SAND_SLIP: SkillDef = {
  id: "za_slip",
  name: "Sand Slip",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "A dodge through a foe cuts it and opens wounds, and leaves a cloud of sand behind.",
  levels: LEVELS,
  evolution: {
    partner: "za_mirage",
    name: "Mirage Slip",
    text: "Every dodge leaves a mirage where it started, which minions strike at and which bursts into sand blades.",
    row: evolvedRow(LEVELS[7], "Every dodge leaves a mirage.", { mirage: 1 }),
  },
};

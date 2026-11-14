import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chip` share of a blocked blow let through, `cost` stamina a block costs, `blind` seconds a block blinds a minion attacker, `mirageReach` the mirage's reach multiple, `miragePower` attack damage added to its blades, `blockWhirl` Whirl a block adds, `twin` evolved, a parry leaves a mirage each side */
const LEVELS = levelRows([
  { text: "A block lets 20% through and costs 11 stamina.", values: { chip: 0.2, cost: 11 } },
  { text: "New: a block throws sand in a minion attacker's eyes.", values: { blind: 1 } },
  { text: "New: the mirage bursts 30% wider.", values: { mirageReach: 1.3 } },
  { text: "Block 15% through, 9 stamina.", values: { chip: 0.15, cost: 9 } },
  { text: "New: the mirage's blades cut 0.6 harder.", values: { miragePower: 0.6 } },
  { text: "New: a block adds 15 Whirl.", values: { blockWhirl: 15 } },
  { text: "Mirage 30% to 50% wider; blind 1 to 1.6 s.", values: { mirageReach: 1.5, blind: 1.6 } },
  { text: "Block 10% through, 7 stamina; blades 0.6 to 1.2 harder.", values: { chip: 0.1, cost: 7, miragePower: 1.2 } },
]);

export const SAND_VEIL_SKILL: SkillDef = {
  id: "za_veil",
  name: "Sand Veil",
  kind: "passive",
  risk: "timed",
  button: "K",
  text: "Your veil of sand blocks more for less, blinds attackers, and your mirage bursts wider and harder.",
  levels: LEVELS,
  evolution: {
    partner: "za_slip",
    name: "Wall of Dunes",
    text: "A parry leaves two mirages, one each side of you.",
    row: evolvedRow(LEVELS[7], "A parry leaves a mirage each side.", { twin: 1 }),
  },
};

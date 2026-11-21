import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { chip: 0.2, cost: 11 },
  { blind: 1 },
  { mirageReach: 1.3 },
  { chip: 0.15, cost: 9 },
  { miragePower: 0.6 },
  { blockWhirl: 15 },
  { mirageReach: 1.5, blind: 1.6 },
  { chip: 0.1, cost: 7, miragePower: 1.2 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Parry window +30%; a block lets 20% through for 11 stamina.", drill: { parry: 0.3 } },
  { text: "New: a block throws sand in a minion attacker's eyes." },
  { text: "New: the mirage bursts 30% wider." },
  { text: "Parry window +30% to +50%; blocks 15% through for 9 stamina.", drill: { parry: 0.5 } },
  { text: "New: the mirage's blades cut 0.6 harder." },
  { text: "New: a block adds 15 Whirl." },
  { text: "Mirage 30% to 50% wider; blind 1 to 1.6 s." },
  { text: "Parry window +50% to +100%; blocks 10% through for 7 stamina.", drill: { parry: 1 } },
]);

export const SAND_VEIL_SKILL: SkillDef = {
  id: "za_veil",
  name: "Sand Veil",
  kind: "attack",
  risk: "timed",
  button: "K",
  text: "Your veil of sand parries more easily, blocks more for less, blinds attackers, and your mirage bursts wider and harder.",
  levels: LEVELS,
  evolution: {
    partner: "za_slip",
    name: "Wall of Dunes",
    text: "A parry leaves two mirages, one each side of you.",
    row: evolvedRow(LEVELS[7], "A parry leaves a mirage each side.", { twin: 1, ...drillValues({}) }),
  },
};

import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "10% HP: a hand axe flies 160 px and back, 0.7x each way.",
    values: { hp: 0.1, cooldown: 4, power: 0.7, pierce: 0, bleed: 0, axes: 1, returnRepay: 0, fangs: 0 },
  },
  { text: "It passes through foes.", values: { pierce: 1 } },
  { text: "0.9x.", values: { power: 0.9 } },
  { text: "It bleeds foes.", values: { bleed: 1 } },
  { text: "A second axe, thrown high.", values: { axes: 2 } },
  { text: "1.2x.", values: { power: 1.2 } },
  { text: "Caught, each axe repays 6% of max HP.", values: { returnRepay: 0.06 } },
  { text: "1.6x.", values: { power: 1.6 } },
]);

/** Hurled Axe. Design: docs/skills/brannoc.md. Values: hp: share of max HP it costs; cooldown: seconds; power: attack damage each way; pierce: 1 it passes through foes; bleed: 1 it bleeds foes; axes: axes thrown; returnRepay: share of max HP each axe repays when he catches it; fangs: seconds two axes orbit him in place of the throw (evolution) */
export const HURLED_AXE: SkillDef = {
  id: "b_axeThrow",
  name: "Hurled Axe",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "A spell on I paid in HP: a hand axe flies out and comes back.",
  levels: LEVELS,
  evolution: {
    partner: "b_spinningReap",
    name: "Twin Fangs",
    text: "Two axes orbit him for 3 s, striking every foe they pass.",
    row: evolvedRow(LEVELS[7], "Two axes orbit him for 3 s.", { fangs: 3 }),
  },
};

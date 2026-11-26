import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillLevels";

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

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "Dashing through foes fires a round into each.", drill: { round: 0.4 } },
  { text: "New: the rounds pop foes up.", drill: { launch: 1 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "Round 0.4 to 0.8 AD.", drill: { round: 0.8 } },
  { text: "New: an air dash through a foe gives the air dash back.", drill: { refund: 1 } },
  { text: "Round 0.8 to 1.6 AD.", drill: { round: 1.6 } },
  { text: "New: the rounds are hot.", drill: { hot: 1 } },
  { text: "Round 1.6 to 3.2 AD.", drill: { round: 3.2 } },
]);

export const RECOIL_DASH: SkillDef = {
  id: "ca_recoil",
  name: "Recoil Dash",
  kind: "movement",
  element: "storm",
  risk: "timed",
  button: "L",
  text: "Dashing through foes fires a round into each.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_vent",
    name: "Backfire Rush",
    text: "Every dash ends with a backfire blast behind.",
    row: evolvedRow(DRILL_LEVELS[7], "Every dash backfires behind.", {
      ...drillValues({ backfire: 3 }),
      trail: 2.5,
    }),
  },
};

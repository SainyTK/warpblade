import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `cut` the dodge's cut on each foe it passes in attack damage, `tempo` Tempo per foe cut, `hold` seconds Tempo
 *  holds after the dodge, `endCut` the closing cross in attack damage, `refund` stamina given back, `current` and
 *  `currentPower` (evolved) the current's seconds and attack damage per beat */
const LEVELS = levelRows([
  { text: "The dodge cuts every foe it passes for 0.8 times attack damage.", values: { cut: 0.8 } },
  { text: "Cut 0.8 to 1.2.", values: { cut: 1.2 } },
  { text: "New: each foe cut adds a Tempo stack.", values: { tempo: 1 } },
  { text: "New: Tempo holds 1 s longer after a dodge.", values: { hold: 1 } },
  { text: "Cut 1.2 to 1.8.", values: { cut: 1.8 } },
  { text: "New: the dodge ends in a cross cut ahead.", values: { endCut: 1.4 } },
  { text: "New: the dodge gives back 12 stamina.", values: { refund: 12 } },
  { text: "Cut 1.8 to 2.4; the cross 1.4 to 2.", values: { cut: 2.4, endCut: 2 } },
]);

export const SLIPSTREAM: SkillDef = {
  id: "ve_slip",
  name: "Slipstream",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Your dodge cuts every foe you pass through.",
  levels: LEVELS,
  evolution: {
    partner: "ve_rhythm",
    name: "Dusk Current",
    text: "The dodge leaves a current of dusk on its path for 2 s that cuts foes in it four times a second.",
    row: evolvedRow(LEVELS[7], "The dodge leaves a cutting current.", { current: 2, currentPower: 0.5 }),
  },
};

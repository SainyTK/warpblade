import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `hold` seconds more Tempo holds before it falls, `keep` share of a blow's Tempo loss she keeps, `most` stacks
 *  added to the top, `topMove` walk speed more at the top, `topMp` MP for reaching the top, `topKeep` a blow at the top
 *  costs no Tempo, `floor` (evolved) share of the top Tempo never falls below */
const LEVELS = levelRows([
  { text: "Tempo holds 0.5 s longer before it falls.", values: { hold: 0.5 } },
  { text: "A blow taken costs a quarter of your Tempo, not half.", values: { keep: 0.5 } },
  { text: "New: Tempo's top is 12.", values: { most: 2 } },
  { text: "New: at the top of Tempo you move 10% faster.", values: { topMove: 0.1 } },
  { text: "Tempo holds 1 s longer.", values: { hold: 1 } },
  { text: "New: reaching the top of Tempo gives back 6 MP.", values: { topMp: 6 } },
  { text: "New: a blow taken at the top of Tempo costs none.", values: { topKeep: 1 } },
  { text: "Tempo's top 12 to 14.", values: { most: 4 } },
]);

export const UNBROKEN_RHYTHM: SkillDef = {
  id: "ve_rhythm",
  name: "Unbroken Rhythm",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "Your Tempo lasts longer, rises higher and is harder to lose.",
  levels: LEVELS,
  evolution: {
    partner: "ve_slip",
    name: "Perpetual Tempo",
    text: "Your Tempo never falls below half its top.",
    row: evolvedRow(LEVELS[7], "Tempo never falls below half.", { floor: 0.5 }),
  },
};
